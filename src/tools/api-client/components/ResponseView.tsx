import { useMemo, useState } from 'react';
import { CheckCircle2, Clock3, Globe, HardDrive, XCircle } from 'lucide-react';

import CopyButton from '@/components/CopyButton';
import EmptyState from '@/components/tool/EmptyState';
import type { ResponseData, TestResult } from '../types';

interface ResponseViewProps {
  response: ResponseData | null;
  tests: TestResult[];
  extracted: Record<string, string>;
  scriptError: string | null;
  loading: boolean;
}

type Tab = 'pretty' | 'raw' | 'headers' | 'tests';

function formatSize(n: number): string {
  if (n < 1024) return `${n} o`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} Ko`;
  return `${(n / 1024 / 1024).toFixed(2)} Mo`;
}

function statusColor(status: number | null): string {
  if (status === null) return 'text-destructive';
  if (status < 300) return 'text-emerald-500';
  if (status < 400) return 'text-amber-500';
  return 'text-red-500';
}

export default function ResponseView({ response, tests, extracted, scriptError, loading }: ResponseViewProps) {
  const [tab, setTab] = useState<Tab>('pretty');
  const [search, setSearch] = useState('');

  const pretty = useMemo(() => {
    if (!response?.body) return '';
    try {
      return JSON.stringify(JSON.parse(response.body), null, 2);
    } catch {
      return response.body;
    }
  }, [response]);

  const shown = useMemo(() => {
    const src = tab === 'raw' ? response?.body ?? '' : pretty;
    if (!search) return src;
    return src
      .split('\n')
      .filter((l) => l.toLowerCase().includes(search.toLowerCase()))
      .join('\n');
  }, [tab, pretty, response, search]);

  if (loading) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center">
        <Clock3 className="h-6 w-6 animate-pulse text-muted-foreground" />
        <p className="mt-2 text-xs text-muted-foreground">Requête en cours…</p>
      </div>
    );
  }

  if (!response) {
    return (
      <EmptyState
        icon={Globe}
        title="Aucune réponse"
        description="Configurez la requête puis cliquez sur Envoyer."
      />
    );
  }

  const passed = tests.filter((t) => t.passed).length;
  const headerEntries = Object.entries(response.headers);

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      {/* Barre méta */}
      <div className="flex flex-wrap items-center gap-3 border-b border-border px-4 py-2.5 text-xs">
        {response.error ? (
          <span className="flex items-center gap-1.5 font-semibold text-destructive">
            <XCircle className="h-4 w-4" />
            Échec — {response.error}
          </span>
        ) : (
          <span className={`font-mono font-semibold ${statusColor(response.status)}`}>
            {response.status} {response.statusText}
          </span>
        )}
        <span className="flex items-center gap-1 text-muted-foreground tabular-nums">
          <Clock3 className="h-3.5 w-3.5" />
          {response.timeMs} ms
        </span>
        {!response.error && (
          <span className="flex items-center gap-1 text-muted-foreground tabular-nums">
            <HardDrive className="h-3.5 w-3.5" />
            {formatSize(response.sizeBytes)}
          </span>
        )}
        {tests.length > 0 && (
          <span
            className={`flex items-center gap-1 font-medium ${passed === tests.length ? 'text-emerald-500' : 'text-red-500'}`}
          >
            {passed === tests.length ? <CheckCircle2 className="h-3.5 w-3.5" /> : <XCircle className="h-3.5 w-3.5" />}
            {passed}/{tests.length} tests
          </span>
        )}
        {response.redirected && response.finalUrl && (
          <span className="truncate text-muted-foreground">↪ {response.finalUrl}</span>
        )}
        <div className="ml-auto">
          <CopyButton value={tab === 'raw' ? response.body : pretty} />
        </div>
      </div>

      {Object.keys(extracted).length > 0 && (
        <div className="border-b border-border bg-emerald-500/[0.06] px-4 py-2 text-[11px] text-emerald-600 dark:text-emerald-400">
          Variables mises à jour :{' '}
          {Object.entries(extracted).map(([k, v]) => (
            <code key={k} className="mx-1 rounded bg-emerald-500/10 px-1 font-mono">
              {k}={v.length > 24 ? v.slice(0, 24) + '…' : v}
            </code>
          ))}
        </div>
      )}

      {scriptError && (
        <div className="border-b border-border bg-destructive/5 px-4 py-2 text-[11px] text-destructive">
          Erreur de script : {scriptError}
        </div>
      )}

      {/* Onglets */}
      <div className="flex shrink-0 items-center gap-1 border-b border-border px-3 py-1.5">
        {(['pretty', 'raw', 'headers', 'tests'] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`rounded-md px-2.5 py-1 text-xs font-medium capitalize transition-colors ${
              tab === t ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {t === 'headers' ? `Headers (${headerEntries.length})` : t === 'tests' ? `Tests (${tests.length})` : t}
          </button>
        ))}
        {(tab === 'pretty' || tab === 'raw') && (
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Filtrer…"
            className="ml-auto h-7 w-40 rounded-md border border-input bg-transparent px-2 text-xs outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
          />
        )}
      </div>

      {/* Contenu */}
      <div className="min-h-0 flex-1 overflow-auto">
        {(tab === 'pretty' || tab === 'raw') && (
          <pre className="p-4 font-mono text-xs leading-5 text-foreground">{shown || '—'}</pre>
        )}
        {tab === 'headers' && (
          <div className="divide-y divide-border">
            {headerEntries.map(([k, v]) => (
              <div key={k} className="flex gap-4 px-4 py-2 font-mono text-xs">
                <span className="w-48 shrink-0 text-muted-foreground">{k}</span>
                <span className="break-all">{v}</span>
              </div>
            ))}
          </div>
        )}
        {tab === 'tests' && (
          <div className="divide-y divide-border">
            {tests.length === 0 && <p className="p-4 text-xs text-muted-foreground">Aucun test défini.</p>}
            {tests.map((t, i) => (
              <div key={i} className="flex items-start gap-2 px-4 py-2.5 text-xs">
                {t.passed ? (
                  <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-500" />
                ) : (
                  <XCircle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-destructive" />
                )}
                <div className="min-w-0">
                  <p className={t.passed ? '' : 'text-destructive'}>{t.name}</p>
                  {t.error && <p className="mt-0.5 font-mono text-[11px] text-muted-foreground">{t.error}</p>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
