import type { AuthConfig, RequestDef, ResponseData, TestResult, Variable } from './types';
import { resolve, resolveKV, toScope, type Scope } from './vars';

// ---------------------------------------------------------------------------
// Assertion minimale (style chai) pour les scripts de test
// ---------------------------------------------------------------------------
function makeExpect(actual: unknown) {
  const check = (cond: boolean, msg: string) => {
    if (!cond) throw new Error(msg);
  };
  const api = {
    to: {
      equal: (exp: unknown) => check(actual === exp, `attendu ${JSON.stringify(exp)}, reçu ${JSON.stringify(actual)}`),
      eql: (exp: unknown) =>
        check(JSON.stringify(actual) === JSON.stringify(exp), `attendu ${JSON.stringify(exp)}, reçu ${JSON.stringify(actual)}`),
      include: (sub: unknown) =>
        check(
          typeof actual === 'string'
            ? actual.includes(String(sub))
            : Array.isArray(actual)
              ? actual.includes(sub)
              : false,
          `${JSON.stringify(actual)} ne contient pas ${JSON.stringify(sub)}`
        ),
      be: {
        a: (t: string) => check(typeof actual === t, `attendu un ${t}, reçu ${typeof actual}`),
        an: (t: string) => check(typeof actual === t, `attendu un ${t}, reçu ${typeof actual}`),
        true: () => check(actual === true, `attendu true`),
        false: () => check(actual === false, `attendu false`),
        null: () => check(actual === null, `attendu null`),
        undefined: () => check(actual === undefined, `attendu undefined`),
        ok: () => check(!!actual, `valeur falsy : ${JSON.stringify(actual)}`),
        above: (n: number) => check(Number(actual) > n, `${actual} n'est pas > ${n}`),
        below: (n: number) => check(Number(actual) < n, `${actual} n'est pas < ${n}`),
      },
      exist: () => check(actual !== null && actual !== undefined, `valeur absente`),
      have: {
        property: (p: string) =>
          check(!!actual && typeof actual === 'object' && p in (actual as object), `propriété "${p}" absente`),
        lengthOf: (n: number) => check((actual as { length?: number })?.length === n, `longueur ≠ ${n}`),
        status: (n: number) => check(actual === n, `statut attendu ${n}, reçu ${actual}`),
      },
    },
  };
  return api;
}

// ---------------------------------------------------------------------------
// Contexte `pm` exposé aux scripts
// ---------------------------------------------------------------------------
export interface PmContext {
  response?: ResponseData;
  results: TestResult[];
  /** Variables écrites par les scripts (portée runtime, priorité maximale). */
  runtimeVars: Record<string, string>;
  /** Variables à écrire dans l'environnement actif (extraction / pm.environment.set). */
  envWrites: Record<string, string>;
  scope: Scope;
}

function buildPm(ctx: PmContext) {
  const jsonCache = { parsed: undefined as unknown, done: false };
  const responseJson = () => {
    if (!jsonCache.done) {
      jsonCache.parsed = ctx.response?.body ? JSON.parse(ctx.response.body) : undefined;
      jsonCache.done = true;
    }
    return jsonCache.parsed;
  };

  return {
    response: {
      code: ctx.response?.status ?? 0,
      status: ctx.response?.statusText ?? '',
      responseTime: ctx.response?.timeMs ?? 0,
      json: responseJson,
      text: () => ctx.response?.body ?? '',
      headers: {
        get: (name: string) => {
          const h = ctx.response?.headers ?? {};
          const k = Object.keys(h).find((x) => x.toLowerCase() === name.toLowerCase());
          return k ? h[k] : undefined;
        },
      },
    },
    environment: {
      get: (k: string) => ctx.envWrites[k] ?? ctx.scope[k],
      set: (k: string, v: unknown) => {
        ctx.envWrites[k] = String(v);
        ctx.scope[k] = String(v);
      },
      unset: (k: string) => {
        delete ctx.envWrites[k];
      },
    },
    variables: {
      get: (k: string) => ctx.runtimeVars[k] ?? ctx.scope[k],
      set: (k: string, v: unknown) => {
        ctx.runtimeVars[k] = String(v);
        ctx.scope[k] = String(v);
      },
    },
    expect: makeExpect,
    test: (name: string, fn: () => void) => {
      try {
        fn();
        ctx.results.push({ name, passed: true });
      } catch (e) {
        ctx.results.push({ name, passed: false, error: (e as Error).message });
      }
    },
  };
}

export function runScript(code: string, ctx: PmContext): string | null {
  if (!code.trim()) return null;
  try {
    const pm = buildPm(ctx);
    // eslint-disable-next-line no-new-func
    const fn = new Function('pm', 'expect', `"use strict";\n${code}`);
    fn(pm, pm.expect);
    return null;
  } catch (e) {
    return (e as Error).message;
  }
}

// ---------------------------------------------------------------------------
// Construction de la requête HTTP finale
// ---------------------------------------------------------------------------
function applyAuth(
  auth: AuthConfig,
  inheritedAuth: AuthConfig | undefined,
  headers: Record<string, string>,
  queryPairs: [string, string][],
  scope: Scope
) {
  const effective = auth.type === 'inherit' ? inheritedAuth ?? { type: 'none' } : auth;
  switch (effective.type) {
    case 'bearer':
      if (effective.token) headers['Authorization'] = `Bearer ${resolve(effective.token, scope)}`;
      break;
    case 'basic': {
      const u = resolve(effective.username, scope);
      const p = resolve(effective.password, scope);
      headers['Authorization'] = `Basic ${btoa(`${u}:${p}`)}`;
      break;
    }
    case 'apikey': {
      const k = resolve(effective.key, scope);
      const v = resolve(effective.value, scope);
      if (!k) break;
      if (effective.in === 'header') headers[k] = v;
      else queryPairs.push([k, v]);
      break;
    }
  }
}

export interface BuiltRequest {
  method: string;
  url: string;
  headers: Record<string, string>;
  body: string;
  missing: string[];
}

export function buildRequest(
  req: RequestDef,
  scope: Scope,
  inheritedAuth?: AuthConfig
): BuiltRequest {
  const missing = new Set<string>();

  const headers = resolveKV(req.headers, scope, missing);
  const queryPairs: [string, string][] = req.params
    .filter((p) => p.enabled && p.key)
    .map((p): [string, string] => [resolve(p.key, scope, missing), resolve(p.value, scope, missing)]);

  applyAuth(req.auth, inheritedAuth, headers, queryPairs, scope);

  let url = resolve(req.url, scope, missing).trim();
  if (queryPairs.length) {
    const qs = queryPairs.map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`).join('&');
    url += (url.includes('?') ? '&' : '?') + qs;
  }

  let body = '';
  const bodyDisabled = req.method === 'GET' || req.method === 'HEAD';
  if (!bodyDisabled && req.body.type !== 'none') {
    if (req.body.type === 'json' || req.body.type === 'text') {
      body = resolve(req.body.content, scope, missing);
      if (req.body.type === 'json' && !headers['Content-Type'] && !headers['content-type']) {
        headers['Content-Type'] = 'application/json';
      }
    } else if (req.body.type === 'graphql') {
      body = JSON.stringify({ query: resolve(req.body.content, scope, missing) });
      headers['Content-Type'] = headers['Content-Type'] || 'application/json';
    } else if (req.body.type === 'urlencoded') {
      body = req.body.fields
        .filter((f) => f.enabled && f.key)
        .map((f) => `${encodeURIComponent(resolve(f.key, scope, missing))}=${encodeURIComponent(resolve(f.value, scope, missing))}`)
        .join('&');
      headers['Content-Type'] = 'application/x-www-form-urlencoded';
    } else if (req.body.type === 'form') {
      // form-data multipart non supporté par le pont IPC : on retombe sur urlencoded.
      body = req.body.fields
        .filter((f) => f.enabled && f.key)
        .map((f) => `${encodeURIComponent(resolve(f.key, scope, missing))}=${encodeURIComponent(resolve(f.value, scope, missing))}`)
        .join('&');
      headers['Content-Type'] = 'application/x-www-form-urlencoded';
    }
  }

  return { method: req.method, url, headers, body, missing: [...missing] };
}

// Lit une valeur dans le corps JSON via un chemin `a.b[0].c`.
export function readPath(obj: unknown, pathStr: string): unknown {
  const parts = pathStr
    .replace(/\[(\d+)\]/g, '.$1')
    .split('.')
    .filter(Boolean);
  let cur: unknown = obj;
  for (const p of parts) {
    if (cur === null || cur === undefined) return undefined;
    cur = (cur as Record<string, unknown>)[p];
  }
  return cur;
}

// ---------------------------------------------------------------------------
// Exécution complète d'une requête (pré-script → envoi → extraction → tests)
// ---------------------------------------------------------------------------
export interface RunOutcome {
  built: BuiltRequest;
  response: ResponseData;
  tests: TestResult[];
  extracted: Record<string, string>;
  scriptError: string | null;
}

export async function runRequest(
  req: RequestDef,
  baseScope: Scope,
  inheritedAuth?: AuthConfig,
  timeoutMs?: number
): Promise<RunOutcome> {
  const scope: Scope = { ...baseScope };
  const ctx: PmContext = { results: [], runtimeVars: {}, envWrites: {}, scope };

  const preErr = runScript(req.preRequestScript, ctx);

  const built = buildRequest(req, scope, inheritedAuth);

  const raw = await window.api.httpRequest({
    url: built.url,
    method: built.method,
    headers: built.headers,
    body: built.body,
    timeoutMs,
  });

  const response: ResponseData = raw.ok
    ? {
        ok: true,
        status: raw.status,
        statusText: raw.statusText,
        headers: raw.headers,
        body: raw.body,
        timeMs: raw.timeMs,
        sizeBytes: raw.sizeBytes,
        finalUrl: raw.finalUrl,
        redirected: raw.redirected,
      }
    : { ok: false, status: null, statusText: '', headers: {}, body: '', error: raw.error, timeMs: raw.timeMs, sizeBytes: 0 };

  ctx.response = response;

  // Extraction déclarative de variables
  const extracted: Record<string, string> = {};
  if (response.ok) {
    for (const rule of req.extract) {
      if (!rule.enabled || !rule.target || !rule.path) continue;
      let value: unknown;
      if (rule.source === 'header') {
        const k = Object.keys(response.headers).find((x) => x.toLowerCase() === rule.path.toLowerCase());
        value = k ? response.headers[k] : undefined;
      } else {
        try {
          value = readPath(JSON.parse(response.body), rule.path);
        } catch {
          value = undefined;
        }
      }
      if (value !== undefined && value !== null) {
        extracted[rule.target] = typeof value === 'object' ? JSON.stringify(value) : String(value);
        ctx.envWrites[rule.target] = extracted[rule.target];
      }
    }
  }

  const testErr = runScript(req.testScript, ctx);
  Object.assign(extracted, ctx.envWrites);

  return {
    built,
    response,
    tests: ctx.results,
    extracted,
    scriptError: preErr ?? testErr,
  };
}

export { toScope };
export type { Variable };
