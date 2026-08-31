import { useMemo, useState } from 'react';
import { Input } from '@/components/ui/input';
import ToolShell from '@/components/tool/ToolShell';
import { getTool } from '@/tools';
import { Search } from 'lucide-react';

interface Status {
  code: number;
  name: string;
  desc: string;
}

const STATUSES: Status[] = [
  { code: 100, name: 'Continue', desc: 'Le client peut poursuivre sa requête.' },
  { code: 101, name: 'Switching Protocols', desc: 'Le serveur accepte de changer de protocole (ex. WebSocket).' },
  { code: 200, name: 'OK', desc: 'Requête réussie. Le corps contient la ressource demandée.' },
  { code: 201, name: 'Created', desc: 'Ressource créée. En-tête Location vers la nouvelle ressource.' },
  { code: 202, name: 'Accepted', desc: 'Requête acceptée mais traitée de manière asynchrone.' },
  { code: 204, name: 'No Content', desc: 'Succès sans corps de réponse (DELETE, PUT souvent).' },
  { code: 206, name: 'Partial Content', desc: 'Réponse partielle suite à un en-tête Range.' },
  { code: 301, name: 'Moved Permanently', desc: 'La ressource a changé d’URL définitivement.' },
  { code: 302, name: 'Found', desc: 'Redirection temporaire. La méthode peut changer en GET.' },
  { code: 303, name: 'See Other', desc: 'Redirige en GET vers une autre ressource (POST-redirect-GET).' },
  { code: 304, name: 'Not Modified', desc: 'Le cache client est à jour (ETag / If-Modified-Since).' },
  { code: 307, name: 'Temporary Redirect', desc: 'Redirection temporaire en conservant la méthode.' },
  { code: 308, name: 'Permanent Redirect', desc: 'Redirection permanente en conservant la méthode.' },
  { code: 400, name: 'Bad Request', desc: 'Requête mal formée : syntaxe, paramètres, corps invalides.' },
  { code: 401, name: 'Unauthorized', desc: 'Authentification requise ou invalide (en fait « non authentifié »).' },
  { code: 403, name: 'Forbidden', desc: 'Authentifié mais non autorisé à accéder à la ressource.' },
  { code: 404, name: 'Not Found', desc: 'Ressource inexistante à cette URL.' },
  { code: 405, name: 'Method Not Allowed', desc: 'Méthode HTTP non supportée pour cette ressource.' },
  { code: 406, name: 'Not Acceptable', desc: 'Aucune représentation ne correspond à l’en-tête Accept.' },
  { code: 409, name: 'Conflict', desc: 'Conflit d’état (ex. édition concurrente, doublon).' },
  { code: 410, name: 'Gone', desc: 'Ressource supprimée définitivement.' },
  { code: 415, name: 'Unsupported Media Type', desc: 'Content-Type de la requête non supporté.' },
  { code: 418, name: "I'm a teapot", desc: 'Blague RFC 2324. Parfois utilisé pour du filtrage.' },
  { code: 422, name: 'Unprocessable Entity', desc: 'Syntaxe correcte mais validation métier échouée.' },
  { code: 429, name: 'Too Many Requests', desc: 'Limite de débit dépassée. Voir Retry-After.' },
  { code: 500, name: 'Internal Server Error', desc: 'Erreur serveur non gérée.' },
  { code: 501, name: 'Not Implemented', desc: 'Fonctionnalité non implémentée par le serveur.' },
  { code: 502, name: 'Bad Gateway', desc: 'Réponse invalide reçue d’un serveur en amont.' },
  { code: 503, name: 'Service Unavailable', desc: 'Serveur indisponible (surcharge, maintenance).' },
  { code: 504, name: 'Gateway Timeout', desc: 'Pas de réponse à temps d’un serveur en amont.' },
];

const CLASS_STYLE: Record<number, string> = {
  1: 'border-sky-500/20 bg-sky-500/10 text-sky-500',
  2: 'border-emerald-500/20 bg-emerald-500/10 text-emerald-500',
  3: 'border-amber-500/20 bg-amber-500/10 text-amber-500',
  4: 'border-orange-500/20 bg-orange-500/10 text-orange-500',
  5: 'border-red-500/20 bg-red-500/10 text-red-500',
};

const CLASS_LABEL: Record<number, string> = {
  1: 'Information',
  2: 'Succès',
  3: 'Redirection',
  4: 'Erreur client',
  5: 'Erreur serveur',
};

export default function HttpStatus() {
  const tool = getTool('http-status')!;
  const [query, setQuery] = useState('');

  const groups = useMemo(() => {
    const q = query.trim().toLowerCase();
    const filtered = STATUSES.filter(
      (s) => !q || String(s.code).includes(q) || s.name.toLowerCase().includes(q) || s.desc.toLowerCase().includes(q)
    );
    const byClass = new Map<number, Status[]>();
    for (const s of filtered) {
      const c = Math.floor(s.code / 100);
      if (!byClass.has(c)) byClass.set(c, []);
      byClass.get(c)!.push(s);
    }
    return [...byClass.entries()].sort((a, b) => a[0] - b[0]);
  }, [query]);

  return (
    <ToolShell tool={tool} scroll>
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Rechercher un code, un nom, un mot-clé…"
          className="h-10 pl-9"
        />
      </div>

      {groups.map(([cls, items]) => (
        <section key={cls}>
          <div className="mb-2 flex items-center gap-2">
            <span className={`rounded-md border px-2 py-0.5 text-[10px] font-semibold ${CLASS_STYLE[cls]}`}>{cls}xx</span>
            <h2 className="text-sm font-semibold">{CLASS_LABEL[cls]}</h2>
          </div>
          <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
            {items.map((s) => (
              <div key={s.code} className="rounded-lg border border-border bg-card p-3.5">
                <div className="flex items-baseline gap-2">
                  <span className={`font-mono text-sm font-semibold ${CLASS_STYLE[cls].split(' ').pop()}`}>{s.code}</span>
                  <span className="text-sm font-medium">{s.name}</span>
                </div>
                <p className="mt-1 text-xs leading-5 text-muted-foreground">{s.desc}</p>
              </div>
            ))}
          </div>
        </section>
      ))}

      {groups.length === 0 && (
        <p className="py-8 text-center text-sm text-muted-foreground">Aucun code ne correspond.</p>
      )}
    </ToolShell>
  );
}
