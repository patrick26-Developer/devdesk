// Détection heuristique du type de contenu d'une chaîne, pour aiguiller vers le bon outil.

export interface Detection {
  toolId: string;
  label: string;
  // 0..1 — confiance de la détection, pour trier les suggestions.
  score: number;
}

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const JWT_RE = /^[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]*$/;
const HEX_COLOR_RE = /^#?[0-9a-f]{6}$/i;
const BASE64_RE = /^[A-Za-z0-9+/]+={0,2}$/;
const CRON_RE = /^(\S+\s+){4}\S+$/;

export function detect(input: string): Detection[] {
  const text = input.trim();
  if (!text) return [];
  const out: Detection[] = [];

  // JSON
  if ((text.startsWith('{') && text.endsWith('}')) || (text.startsWith('[') && text.endsWith(']'))) {
    try {
      JSON.parse(text);
      out.push({ toolId: 'json-formatter', label: 'JSON', score: 0.95 });
      out.push({ toolId: 'json-to-ts', label: 'JSON → TypeScript', score: 0.5 });
      out.push({ toolId: 'json-yaml', label: 'JSON → YAML', score: 0.4 });
    } catch {
      /* pas du JSON valide */
    }
  }

  // JWT
  if (JWT_RE.test(text) && text.split('.').length === 3) {
    out.push({ toolId: 'jwt', label: 'Token JWT', score: 0.97 });
  }

  // UUID
  if (UUID_RE.test(text)) {
    out.push({ toolId: 'uuid', label: 'UUID', score: 0.9 });
  }

  // Couleur hex
  if (HEX_COLOR_RE.test(text)) {
    out.push({ toolId: 'color', label: 'Couleur hexadécimale', score: 0.9 });
    out.push({ toolId: 'contrast', label: 'Vérifier le contraste', score: 0.4 });
  }

  // Timestamp Unix (10 ou 13 chiffres, plausible entre 2001 et 2100)
  if (/^\d{10}$|^\d{13}$/.test(text)) {
    const n = Number(text.length === 13 ? text : text + '000');
    if (n > 978307200000 && n < 4102444800000) {
      out.push({ toolId: 'timestamp', label: 'Timestamp Unix', score: 0.85 });
    }
  }

  // URL
  if (/^https?:\/\/\S+$/i.test(text)) {
    out.push({ toolId: 'api-tester', label: 'URL — tester la requête', score: 0.7 });
    out.push({ toolId: 'qrcode', label: 'URL — générer un QR code', score: 0.4 });
  }
  if (/%[0-9A-Fa-f]{2}/.test(text)) {
    out.push({ toolId: 'url', label: 'Texte URL-encodé', score: 0.6 });
  }

  // Cron
  if (CRON_RE.test(text) && /[*\d]/.test(text) && !text.includes('://')) {
    out.push({ toolId: 'cron', label: 'Expression cron', score: 0.6 });
  }

  // CSV (plusieurs lignes, séparateurs cohérents)
  if (text.includes('\n')) {
    const lines = text.split('\n').filter(Boolean);
    const commas = lines.map((l) => (l.match(/,/g) || []).length);
    if (lines.length >= 2 && commas[0] > 0 && commas.every((c) => c === commas[0])) {
      out.push({ toolId: 'csv-json', label: 'CSV', score: 0.7 });
    }
    if (lines.every((l) => /^[A-Z_][A-Z0-9_]*\s*=/i.test(l) || l.startsWith('#'))) {
      out.push({ toolId: 'dotenv-json', label: 'Fichier .env', score: 0.75 });
    }
  }

  // Base64 (longueur multiple de 4, assez long, pas déjà classé)
  if (out.length === 0 && text.length >= 12 && text.length % 4 === 0 && BASE64_RE.test(text)) {
    out.push({ toolId: 'base64', label: 'Chaîne Base64', score: 0.55 });
  }

  // Markdown
  if (out.length === 0 && /^#{1,6}\s|\*\*[^*]+\*\*|^[-*]\s|\[.+\]\(.+\)/m.test(text)) {
    out.push({ toolId: 'markdown', label: 'Markdown', score: 0.5 });
  }

  return out.sort((a, b) => b.score - a.score).slice(0, 4);
}

// Clé de stockage du champ d'entrée principal d'un outil (voir usePersistentState).
// Permet de pré-remplir un outil avant d'y naviguer.
const PRIMARY_INPUT_KEY: Record<string, string> = {
  'json-formatter': 'json-formatter:input',
  jwt: 'jwt:token',
  base64: 'base64:input',
  'csv-json': 'csv-json:input',
  'dotenv-json': 'dotenv-json:input',
  'json-to-ts': 'json-to-ts:input',
  'json-yaml': 'json-yaml:input',
  cron: 'cron:expr',
  markdown: 'markdown:content',
  'api-tester': 'api-tester:url',
  'string-escape': 'string-escape:input',
  slug: 'slug:input',
  hash: undefined as unknown as string,
};

export function prefillTool(toolId: string, value: string): void {
  const key = PRIMARY_INPUT_KEY[toolId];
  if (!key) return;
  try {
    localStorage.setItem(`devdesk-tool:${key}`, JSON.stringify(value));
  } catch {
    /* localStorage indisponible */
  }
}

