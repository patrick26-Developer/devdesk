import { useMemo, useState } from 'react';
import { Input } from '@/components/ui/input';
import ToolShell from '@/components/tool/ToolShell';
import { getTool } from '@/tools';
import { useT } from '@/i18n';
import { Search } from 'lucide-react';

interface Status {
  code: number;
  name: string;
}

const STATUSES: Status[] = [
  { code: 100, name: 'Continue' },
  { code: 101, name: 'Switching Protocols' },
  { code: 200, name: 'OK' },
  { code: 201, name: 'Created' },
  { code: 202, name: 'Accepted' },
  { code: 204, name: 'No Content' },
  { code: 206, name: 'Partial Content' },
  { code: 301, name: 'Moved Permanently' },
  { code: 302, name: 'Found' },
  { code: 303, name: 'See Other' },
  { code: 304, name: 'Not Modified' },
  { code: 307, name: 'Temporary Redirect' },
  { code: 308, name: 'Permanent Redirect' },
  { code: 400, name: 'Bad Request' },
  { code: 401, name: 'Unauthorized' },
  { code: 403, name: 'Forbidden' },
  { code: 404, name: 'Not Found' },
  { code: 405, name: 'Method Not Allowed' },
  { code: 406, name: 'Not Acceptable' },
  { code: 409, name: 'Conflict' },
  { code: 410, name: 'Gone' },
  { code: 415, name: 'Unsupported Media Type' },
  { code: 418, name: "I'm a teapot" },
  { code: 422, name: 'Unprocessable Entity' },
  { code: 429, name: 'Too Many Requests' },
  { code: 500, name: 'Internal Server Error' },
  { code: 501, name: 'Not Implemented' },
  { code: 502, name: 'Bad Gateway' },
  { code: 503, name: 'Service Unavailable' },
  { code: 504, name: 'Gateway Timeout' },
];

const CLASS_STYLE: Record<number, string> = {
  1: 'border-sky-500/20 bg-sky-500/10 text-sky-500',
  2: 'border-emerald-500/20 bg-emerald-500/10 text-emerald-500',
  3: 'border-amber-500/20 bg-amber-500/10 text-amber-500',
  4: 'border-orange-500/20 bg-orange-500/10 text-orange-500',
  5: 'border-red-500/20 bg-red-500/10 text-red-500',
};

export default function HttpStatus() {
  const tool = getTool('http-status')!;
  const t = useT();
  const [query, setQuery] = useState('');

  const groups = useMemo(() => {
    const q = query.trim().toLowerCase();
    const filtered = STATUSES.filter(
      (s) => !q || String(s.code).includes(q) || s.name.toLowerCase().includes(q) || t(`ui.http.d.${s.code}`).toLowerCase().includes(q)
    );
    const byClass = new Map<number, Status[]>();
    for (const s of filtered) {
      const c = Math.floor(s.code / 100);
      if (!byClass.has(c)) byClass.set(c, []);
      byClass.get(c)!.push(s);
    }
    return [...byClass.entries()].sort((a, b) => a[0] - b[0]);
  }, [query, t]);

  return (
    <ToolShell tool={tool} scroll>
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t('ui.http.search')}
          className="h-10 pl-9"
        />
      </div>

      {groups.map(([cls, items]) => (
        <section key={cls}>
          <div className="mb-2 flex items-center gap-2">
            <span className={`rounded-md border px-2 py-0.5 text-[10px] font-semibold ${CLASS_STYLE[cls]}`}>{cls}xx</span>
            <h2 className="text-sm font-semibold">{t(`ui.http.class.${cls}`)}</h2>
          </div>
          <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
            {items.map((s) => (
              <div key={s.code} className="rounded-lg border border-border bg-card p-3.5">
                <div className="flex items-baseline gap-2">
                  <span className={`font-mono text-sm font-semibold ${CLASS_STYLE[cls].split(' ').pop()}`}>{s.code}</span>
                  <span className="text-sm font-medium">{s.name}</span>
                </div>
                <p className="mt-1 text-xs leading-5 text-muted-foreground">{t(`ui.http.d.${s.code}`)}</p>
              </div>
            ))}
          </div>
        </section>
      ))}

      {groups.length === 0 && (
        <p className="py-8 text-center text-sm text-muted-foreground">{t('ui.http.noMatch')}</p>
      )}
    </ToolShell>
  );
}
