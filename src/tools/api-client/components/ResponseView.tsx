import { useMemo, useState } from 'react';
import { CheckCircle2, Clock3, Globe, HardDrive, Sparkles, Wand2, XCircle } from 'lucide-react';

import CopyButton from '@/components/CopyButton';
import EmptyState from '@/components/tool/EmptyState';
import type { RequestDef, ResponseData, TestResult } from '../types';
import { diagnose, generateTests } from '../assist';
import { useT } from '@/i18n';

interface ResponseViewProps {
  request: RequestDef;
  response: ResponseData | null;
  tests: TestResult[];
  extracted: Record<string, string>;
  scriptError: string | null;
  loading: boolean;
  onApplyTests: (script: string) => void;
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

export default function ResponseView({
  request,
  response,
  tests,
  extracted,
  scriptError,
  loading,
  onApplyTests,
}: ResponseViewProps) {
  const t = useT();
  const [tab, setTab] = useState<Tab>('pretty');
  const [search, setSearch] = useState('');
  const [showDiag, setShowDiag] = useState(true);

  const diagnosis = useMemo(
    () => (response && (response.error || (response.status ?? 0) >= 400) ? diagnose(request, response) : null),
    [request, response]
  );

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
        <p className="mt-2 text-xs text-muted-foreground">{t('api.running')}</p>
      </div>
    );
  }

  if (!response) {
    return (
      <EmptyState
        icon={Globe}
        title={t('api.noResponse')}
        description={t('api.noResponseSub')}
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
            {response.error}
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
        <div className="ml-auto flex items-center gap-1">
          {!response.error && (
            <button
              onClick={() => onApplyTests(generateTests(response))}
              className="flex items-center gap-1 rounded-md px-2 py-1 text-[11px] text-muted-foreground hover:bg-accent hover:text-foreground"
              title={t('api.genTestsTooltip')}
            >
              <Wand2 className="h-3.5 w-3.5" />
              {t('api.genTests')}
            </button>
          )}
          <CopyButton value={tab === 'raw' ? response.body : pretty} />
        </div>
      </div>

      {diagnosis && showDiag && (
        <div className="border-b border-border bg-amber-500/[0.06] px-4 py-3">
          <div className="flex items-start gap-2">
            <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold text-amber-600 dark:text-amber-400">{diagnosis.title}</p>
                <button onClick={() => setShowDiag(false)} className="text-[11px] text-muted-foreground hover:text-foreground">
                  {t('api.diagHide')}
                </button>
              </div>
              <p className="mt-0.5 text-[11px] leading-5 text-muted-foreground">{diagnosis.cause}</p>
              <ul className="mt-1.5 space-y-0.5">
                {diagnosis.fixes.map((f, i) => (
                  <li key={i} className="text-[11px] leading-5 text-foreground">
                    → {f}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {Object.keys(extracted).length > 0 && (
        <div className="border-b border-border bg-emerald-500/[0.06] px-4 py-2 text-[11px] text-emerald-600 dark:text-emerald-400">
          {t('api.varsUpdated')}{' '}
          {Object.entries(extracted).map(([k, v]) => (
            <code key={k} className="mx-1 rounded bg-emerald-500/10 px-1 font-mono">
              {k}={v.length > 24 ? v.slice(0, 24) + '…' : v}
            </code>
          ))}
        </div>
      )}

      {scriptError && (
        <div className="border-b border-border bg-destructive/5 px-4 py-2 text-[11px] text-destructive">
          {t('api.scriptError')} {scriptError}
        </div>
      )}

      {/* Onglets */}
      <div className="flex shrink-0 items-center gap-1 border-b border-border px-3 py-1.5">
        {(['pretty', 'raw', 'headers', 'tests'] as Tab[]).map((tb) => (
          <button
            key={tb}
            onClick={() => setTab(tb)}
            className={`rounded-md px-2.5 py-1 text-xs font-medium capitalize transition-colors ${
              tab === tb ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {tb === 'headers' ? `Headers (${headerEntries.length})` : tb === 'tests' ? `Tests (${tests.length})` : tb}
          </button>
        ))}
        {(tab === 'pretty' || tab === 'raw') && (
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t('api.resp.filter')}
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
            {tests.length === 0 && <p className="p-4 text-xs text-muted-foreground">{t('api.resp.noTests')}</p>}
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
