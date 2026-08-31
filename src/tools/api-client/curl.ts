import { emptyRequest, newId, type HttpMethod, type RequestDef } from './types';

// Découpe une ligne de commande en respectant guillemets simples/doubles et \ de continuation.
function tokenize(input: string): string[] {
  const cleaned = input.replace(/\\\r?\n/g, ' ').trim();
  const tokens: string[] = [];
  let cur = '';
  let quote: '"' | "'" | null = null;
  for (let i = 0; i < cleaned.length; i++) {
    const c = cleaned[i];
    if (quote) {
      if (c === quote) quote = null;
      else if (c === '\\' && quote === '"' && cleaned[i + 1]) {
        cur += cleaned[++i];
      } else cur += c;
    } else if (c === '"' || c === "'") {
      quote = c;
    } else if (/\s/.test(c)) {
      if (cur) {
        tokens.push(cur);
        cur = '';
      }
    } else cur += c;
  }
  if (cur) tokens.push(cur);
  return tokens;
}

export function parseCurl(command: string): RequestDef {
  const tokens = tokenize(command);
  if (tokens[0] !== 'curl') throw new Error('La commande doit commencer par « curl ».');

  const req = emptyRequest('Depuis cURL');
  req.auth = { type: 'none' };
  let method: HttpMethod | null = null;
  let bodyRaw = '';

  for (let i = 1; i < tokens.length; i++) {
    const t = tokens[i];
    const next = () => tokens[++i];
    if (t === '-X' || t === '--request') {
      method = next().toUpperCase() as HttpMethod;
    } else if (t === '-H' || t === '--header') {
      const h = next();
      const idx = h.indexOf(':');
      if (idx > 0) req.headers.push({ id: newId('kv'), key: h.slice(0, idx).trim(), value: h.slice(idx + 1).trim(), enabled: true });
    } else if (t === '-d' || t === '--data' || t === '--data-raw' || t === '--data-binary') {
      bodyRaw += (bodyRaw ? '&' : '') + next();
    } else if (t === '--url') {
      req.url = next();
    } else if (t === '-u' || t === '--user') {
      const [username, ...rest] = next().split(':');
      req.auth = { type: 'basic', username, password: rest.join(':') };
    } else if (t === '--compressed' || t === '-s' || t === '--silent' || t === '-L' || t === '--location' || t === '-k' || t === '--insecure') {
      // ignoré
    } else if (!t.startsWith('-') && !req.url) {
      req.url = t;
    }
  }

  if (bodyRaw) {
    try {
      JSON.parse(bodyRaw);
      req.body = { type: 'json', content: bodyRaw, fields: [] };
    } catch {
      req.body = { type: 'text', content: bodyRaw, fields: [] };
    }
  }

  const bearer = req.headers.find((h) => h.key.toLowerCase() === 'authorization' && /^bearer /i.test(h.value));
  if (bearer) {
    req.auth = { type: 'bearer', token: bearer.value.replace(/^bearer /i, '') };
    req.headers = req.headers.filter((h) => h !== bearer);
  }

  req.method = method ?? (bodyRaw ? 'POST' : 'GET');
  if (!req.url) throw new Error('Aucune URL trouvée dans la commande.');
  return req;
}

export function toCurl(req: RequestDef): string {
  const parts = [`curl -X ${req.method}`, `'${req.url}'`];
  for (const h of req.headers.filter((x) => x.enabled && x.key)) {
    parts.push(`-H '${h.key}: ${h.value}'`);
  }
  if (req.auth.type === 'bearer' && req.auth.token) parts.push(`-H 'Authorization: Bearer ${req.auth.token}'`);
  if (req.auth.type === 'basic') parts.push(`-u '${req.auth.username}:${req.auth.password}'`);
  if (req.body.type === 'json' || req.body.type === 'text' || req.body.type === 'graphql') {
    const payload = req.body.type === 'graphql' ? JSON.stringify({ query: req.body.content }) : req.body.content;
    if (payload) parts.push(`-d '${payload.replace(/'/g, "'\\''")}'`);
  }
  return parts.join(' \\\n  ');
}
