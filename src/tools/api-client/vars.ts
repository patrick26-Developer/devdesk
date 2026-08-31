import type { Variable } from './types';

// Variables dynamiques : {{$guid}}, {{$timestamp}}, {{$isoTimestamp}}, {{$randomInt}}.
function dynamic(name: string): string | undefined {
  switch (name) {
    case '$guid':
      return crypto.randomUUID();
    case '$timestamp':
      return String(Math.floor(Date.now() / 1000));
    case '$isoTimestamp':
      return new Date().toISOString();
    case '$randomInt':
      return String(Math.floor(Math.random() * 1000));
    default:
      return undefined;
  }
}

export type Scope = Record<string, string>;

// Fusionne plusieurs jeux de variables (ordre de priorité croissant : le dernier gagne).
export function toScope(...groups: Variable[][]): Scope {
  const scope: Scope = {};
  for (const group of groups) {
    for (const v of group) {
      if (v.enabled && v.key) scope[v.key] = v.value;
    }
  }
  return scope;
}

const TOKEN_RE = /\{\{\s*([^}]+?)\s*\}\}/g;

// Remplace récursivement les {{tokens}} dans une chaîne. `used` collecte les variables
// manquantes pour un retour d'information à l'utilisateur.
export function resolve(input: string, scope: Scope, missing?: Set<string>): string {
  if (!input) return input;
  let out = input;
  for (let depth = 0; depth < 5 && TOKEN_RE.test(out); depth++) {
    TOKEN_RE.lastIndex = 0;
    out = out.replace(TOKEN_RE, (whole, name: string) => {
      const dyn = dynamic(name);
      if (dyn !== undefined) return dyn;
      if (name in scope) return scope[name];
      missing?.add(name);
      return whole;
    });
  }
  return out;
}

export function resolveKV(
  pairs: { key: string; value: string; enabled: boolean }[],
  scope: Scope,
  missing?: Set<string>
): Record<string, string> {
  const out: Record<string, string> = {};
  for (const p of pairs) {
    if (!p.enabled || !p.key) continue;
    out[resolve(p.key, scope, missing)] = resolve(p.value, scope, missing);
  }
  return out;
}
