// Assistant LOCAL (aucune IA) : heuristiques déterministes pour accélérer le dev d'API.

import type { Collection, CollectionItem, RequestDef, ResponseData } from './types';

// ---------------------------------------------------------------------------
// 1. Diagnostic d'un échec
// ---------------------------------------------------------------------------
export interface Diagnosis {
  title: string;
  cause: string;
  fixes: string[];
}

export function diagnose(req: RequestDef, res: ResponseData): Diagnosis | null {
  if (res.error) {
    const e = res.error.toLowerCase();
    if (e.includes('econnrefused') || e.includes('failed to fetch') || e.includes('fetch failed')) {
      return {
        title: 'Connexion refusée',
        cause: "Aucun serveur ne répond à cette adresse (mauvais port, serveur éteint, ou faute de frappe dans l'URL).",
        fixes: [
          "Vérifie que le backend tourne (ex. `npm run dev` sur localhost:3000).",
          "Contrôle la variable {{baseUrl}} dans l'environnement actif.",
          "Teste l'URL dans un navigateur ou avec `curl`.",
        ],
      };
    }
    if (e.includes('délai') || e.includes('abort') || e.includes('timeout')) {
      return {
        title: 'Délai dépassé',
        cause: "Le serveur n'a pas répondu à temps.",
        fixes: ["Le endpoint est peut-être lent ou bloqué.", "Augmente le délai, ou vérifie les logs du serveur."],
      };
    }
    if (e.includes('cors')) {
      return {
        title: 'Blocage CORS',
        cause: "Normalement contourné par DevDesk (requête côté process principal). Si tu vois ça, l'URL est probablement invalide.",
        fixes: ["Vérifie le protocole (http/https) et l'hôte."],
      };
    }
    return { title: 'Erreur réseau', cause: res.error, fixes: ["Vérifie l'URL et la connectivité."] };
  }

  const status = res.status ?? 0;
  const hasAuthHeader = req.headers.some((h) => h.enabled && h.key.toLowerCase() === 'authorization');
  const hasAuth = req.auth.type !== 'none' && req.auth.type !== 'inherit';

  switch (status) {
    case 401:
      return {
        title: '401 — Non authentifié',
        cause:
          !hasAuth && !hasAuthHeader
            ? "Aucune authentification n'est configurée sur la requête."
            : "Le token est absent, expiré ou invalide.",
        fixes: [
          "Onglet Auth → Bearer Token → `{{accessToken}}`.",
          "Renvoie d'abord la requête de login pour rafraîchir `{{accessToken}}` (règle d'extraction).",
          "Vérifie que la valeur de `accessToken` dans l'environnement n'est pas vide.",
        ],
      };
    case 403:
      return {
        title: '403 — Accès refusé',
        cause: "Tu es authentifié, mais ton compte n'a pas le droit d'accéder à cette ressource.",
        fixes: ["Connecte-toi avec un compte ayant le bon rôle.", "Vérifie les permissions côté backend."],
      };
    case 404:
      return {
        title: '404 — Introuvable',
        cause: "Cette URL n'existe pas sur le serveur (chemin erroné, ou id inexistant).",
        fixes: [
          "Vérifie le chemin exact et `{{baseUrl}}`.",
          "Si l'URL contient un id de variable, vérifie qu'il est bien résolu.",
        ],
      };
    case 405:
      return {
        title: '405 — Méthode non autorisée',
        cause: `Le endpoint n'accepte pas la méthode ${req.method}.`,
        fixes: ["Regarde l'en-tête `Allow` de la réponse pour la liste des méthodes acceptées."],
      };
    case 415:
      return {
        title: '415 — Type de média non supporté',
        cause: "Le `Content-Type` envoyé ne correspond pas à ce que le serveur attend.",
        fixes: ["Onglet Body → JSON (ajoute `Content-Type: application/json`).", "Ou ajuste l'en-tête manuellement."],
      };
    case 422:
      return {
        title: '422 — Validation échouée',
        cause: "La syntaxe est correcte mais le contenu ne passe pas la validation métier.",
        fixes: [
          "Lis le corps de la réponse : il liste généralement les champs en erreur.",
          "Corrige le Body en conséquence.",
        ],
      };
    case 429:
      return {
        title: '429 — Trop de requêtes',
        cause: "Limite de débit atteinte.",
        fixes: [`Attends la durée indiquée par l'en-tête \`Retry-After\` (${res.headers['retry-after'] ?? '?'} s).`],
      };
    default:
      if (status >= 500) {
        return {
          title: `${status} — Erreur serveur`,
          cause: "Le problème vient du backend, pas de ta requête.",
          fixes: ["Consulte les logs du serveur.", "Le corps de la réponse contient parfois une trace utile."],
        };
      }
      if (status >= 400) {
        return {
          title: `${status} — Requête refusée`,
          cause: "Le serveur a rejeté la requête. Le corps de la réponse en dit souvent la raison.",
          fixes: ["Lis le message d'erreur renvoyé.", "Vérifie les paramètres et le corps."],
        };
      }
      return null;
  }
}

// ---------------------------------------------------------------------------
// 2. Génération d'assertions à partir d'une réponse réelle
// ---------------------------------------------------------------------------
export function generateTests(res: ResponseData): string {
  const lines: string[] = [];
  lines.push(`pm.test('statut ${res.status}', () => pm.expect(pm.response.code).to.equal(${res.status}));`);

  let parsed: unknown;
  try {
    parsed = JSON.parse(res.body);
  } catch {
    lines.push(`pm.test('réponse non vide', () => pm.expect(pm.response.text().length).to.be.above(0));`);
    return lines.join('\n');
  }

  lines.push(`pm.test('réponse JSON', () => pm.expect(pm.response.json()).to.exist());`);

  const target = Array.isArray(parsed) ? parsed[0] : parsed;
  if (Array.isArray(parsed)) {
    lines.push(`pm.test('tableau renvoyé', () => pm.expect(pm.response.json()).to.be.a('object'));`);
  }
  if (target && typeof target === 'object') {
    const base = Array.isArray(parsed) ? 'pm.response.json()[0]' : 'pm.response.json()';
    for (const [key, val] of Object.entries(target).slice(0, 8)) {
      const t = val === null ? 'object' : typeof val;
      lines.push(`pm.test("champ '${key}'", () => pm.expect(${base}).to.have.property('${key}'));`);
      if (t === 'string' || t === 'number' || t === 'boolean') {
        lines.push(`pm.test("'${key}' est un ${t}", () => pm.expect(${base}.${jsKey(key)}).to.be.a('${t}'));`);
      }
    }
  }
  return lines.join('\n');
}

function jsKey(key: string): string {
  return /^[A-Za-z_$][\w$]*$/.test(key) ? key : `['${key}']`;
}

// ---------------------------------------------------------------------------
// 3. Audit d'une collection
// ---------------------------------------------------------------------------
export interface AuditWarning {
  requestName: string;
  level: 'warn' | 'info';
  message: string;
}

export function auditCollection(col: Collection): AuditWarning[] {
  const out: AuditWarning[] = [];
  walk(col.items, (name, req) => {
    if (!req.testScript.trim()) out.push({ requestName: name, level: 'info', message: 'Aucun test défini.' });
    if (/^https?:\/\/localhost|127\.0\.0\.1/.test(req.url))
      out.push({ requestName: name, level: 'warn', message: 'URL absolue vers localhost — utilise {{baseUrl}}.' });
    for (const h of req.headers) {
      if (h.enabled && h.key.toLowerCase() === 'authorization' && /bearer\s+eyj/i.test(h.value))
        out.push({ requestName: name, level: 'warn', message: 'Token JWT en dur dans un en-tête — passe par {{accessToken}}.' });
    }
    if (req.auth.type === 'bearer' && /^eyj/i.test(req.auth.token))
      out.push({ requestName: name, level: 'warn', message: 'Token en dur dans l’auth Bearer — utilise {{accessToken}}.' });
    if (req.auth.type === 'basic' && req.auth.password && !req.auth.password.includes('{{'))
      out.push({ requestName: name, level: 'warn', message: 'Mot de passe en dur dans Basic Auth.' });
  });
  return out;
}

// ---------------------------------------------------------------------------
// 4. Documentation Markdown d'une collection
// ---------------------------------------------------------------------------
export function collectionToMarkdown(col: Collection): string {
  const md: string[] = [`# ${col.name}`, ''];
  if (col.variables.length) {
    md.push('## Variables', '', '| Clé | Valeur |', '| --- | --- |');
    for (const v of col.variables) md.push(`| \`${v.key}\` | ${v.secret ? '••••' : v.value || '—'} |`);
    md.push('');
  }
  const render = (items: CollectionItem[], depth: number) => {
    for (const it of items) {
      if (it.type === 'folder') {
        md.push(`${'#'.repeat(Math.min(depth + 2, 6))} ${it.name}`, '');
        render(it.items, depth + 1);
      } else {
        const r = it.request;
        md.push(`${'#'.repeat(Math.min(depth + 2, 6))} ${r.name}`, '');
        md.push('```http', `${r.method} ${r.url}`);
        for (const h of r.headers.filter((h) => h.enabled && h.key)) md.push(`${h.key}: ${h.value}`);
        md.push('```', '');
        if ((r.body.type === 'json' || r.body.type === 'text') && r.body.content.trim()) {
          md.push('**Corps**', '', '```json', r.body.content, '```', '');
        }
        if (r.testScript.trim()) md.push('**Tests**', '', '```js', r.testScript, '```', '');
      }
    }
  };
  render(col.items, 0);
  return md.join('\n');
}

function walk(items: CollectionItem[], fn: (name: string, req: RequestDef) => void) {
  for (const it of items) {
    if (it.type === 'request') fn(it.request.name, it.request);
    else walk(it.items, fn);
  }
}
