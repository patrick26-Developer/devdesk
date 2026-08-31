import { useState } from 'react';
import {
  Activity,
  Clock3,
  Globe,
  Loader2,
  Play,
  RotateCcw,
  Server,
  ShieldCheck,
  XCircle,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import ToolShell from '@/components/tool/ToolShell';
import { Panel, PanelHeader } from '@/components/tool/Panel';
import EmptyState from '@/components/tool/EmptyState';
import CopyButton from '@/components/CopyButton';
import { getTool } from '@/tools';

const METHODS = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'];

const METHOD_STYLE: Record<string, string> = {
  GET: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/15',
  POST: 'text-blue-500 bg-blue-500/10 border-blue-500/15',
  PUT: 'text-amber-500 bg-amber-500/10 border-amber-500/15',
  PATCH: 'text-violet-500 bg-violet-500/10 border-violet-500/15',
  DELETE: 'text-red-500 bg-red-500/10 border-red-500/15',
};

const DEFAULT_URL = 'https://jsonplaceholder.typicode.com/posts/1';

export default function ApiTester() {
  const tool = getTool('api-tester')!;
  const [method, setMethod] = useState('GET');
  const [url, setUrl] = useState(DEFAULT_URL);
  const [headersText, setHeadersText] = useState('Content-Type: application/json');
  const [body, setBody] = useState('');
  const [result, setResult] =
    useState<Awaited<ReturnType<typeof window.api.httpRequest>> | null>(null);
  const [loading, setLoading] = useState(false);

  const parseHeaders = (): Record<string, string> => {
    const headers: Record<string, string> = {};
    headersText.split('\n').forEach((line) => {
      const [key, ...rest] = line.split(':');
      if (key && rest.length) headers[key.trim()] = rest.join(':').trim();
    });
    return headers;
  };

  const send = async () => {
    if (!url.trim()) return;
    setLoading(true);
    setResult(null);
    try {
      setResult(
        await window.api.httpRequest({ url, method, headers: parseHeaders(), body })
      );
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setMethod('GET');
    setUrl(DEFAULT_URL);
    setHeadersText('Content-Type: application/json');
    setBody('');
    setResult(null);
  };

  const bodyDisabled = method === 'GET' || method === 'HEAD';

  return (
    <ToolShell
      tool={tool}
      actions={
        <Button
          variant="ghost"
          size="sm"
          onClick={reset}
          className="gap-2 text-muted-foreground hover:text-foreground"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          Réinitialiser
        </Button>
      }
    >
      {/* Barre de requête */}
      <div className="rounded-xl border border-border bg-card p-3">
        <div className="flex flex-col gap-2 md:flex-row">
          <select
            value={method}
            onChange={(e) => setMethod(e.target.value)}
            aria-label="Méthode HTTP"
            className={`h-10 rounded-lg border px-3 text-xs font-semibold outline-none transition-colors focus-visible:ring-3 focus-visible:ring-ring/50 ${METHOD_STYLE[method] ?? ''}`}
          >
            {METHODS.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>

          <div className="relative flex-1">
            <Server className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://api.example.com/endpoint"
              className="h-10 pl-9 font-mono text-xs"
            />
          </div>

          <Button onClick={send} disabled={loading || !url.trim()} className="h-10 gap-2 px-5">
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Envoi...
              </>
            ) : (
              <>
                <Play className="h-4 w-4" />
                Envoyer
              </>
            )}
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-2 rounded-lg border border-border bg-muted/30 px-3.5 py-2.5 text-xs text-muted-foreground">
        <ShieldCheck className="h-4 w-4 shrink-0 text-emerald-500" />
        <span>
          Les requêtes sont exécutées localement via le processus principal de DevDesk.
        </span>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Panel>
          <PanelHeader title="Headers" subtitle="Un header par ligne" />
          <Textarea
            value={headersText}
            onChange={(e) => setHeadersText(e.target.value)}
            placeholder={'Authorization: Bearer token\nContent-Type: application/json'}
            className="min-h-[120px] resize-none rounded-none border-0 bg-transparent p-4 font-mono text-xs shadow-none focus-visible:ring-0"
          />
        </Panel>

        <Panel>
          <PanelHeader
            title="Body"
            subtitle={bodyDisabled ? 'Désactivé pour cette méthode' : 'JSON ou texte brut'}
          />
          <Textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder='{"name": "DevDesk"}'
            disabled={bodyDisabled}
            className="min-h-[120px] resize-none rounded-none border-0 bg-transparent p-4 font-mono text-xs shadow-none focus-visible:ring-0"
          />
        </Panel>
      </div>

      <Panel className="min-h-0 flex-1">
        <PanelHeader>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Réponse</span>
            </div>
            {result && result.ok && (
              <span
                className={`rounded-md border px-2 py-1 text-[10px] font-semibold ${
                  result.status < 300
                    ? 'border-emerald-500/15 bg-emerald-500/10 text-emerald-500'
                    : 'border-red-500/15 bg-red-500/10 text-red-500'
                }`}
              >
                {result.status} {result.statusText}
              </span>
            )}
          </div>

          {result && (
            <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
              <span className="flex items-center gap-1.5 tabular-nums">
                <Clock3 className="h-3.5 w-3.5" />
                {result.timeMs}ms
              </span>
              {result.ok && <CopyButton value={result.body} />}
            </div>
          )}
        </PanelHeader>

        <div className="min-h-0 flex-1 overflow-auto bg-muted/[0.12] p-4">
          {!result && !loading && (
            <EmptyState
              icon={Globe}
              title="Aucune requête envoyée"
              description="Configurez votre endpoint puis cliquez sur Envoyer pour afficher la réponse."
            />
          )}

          {loading && (
            <div className="flex h-full flex-col items-center justify-center">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              <p className="mt-3 text-xs text-muted-foreground">Exécution de la requête...</p>
            </div>
          )}

          {result && result.ok && (
            <pre className="h-full overflow-auto rounded-lg border border-border bg-background p-4 font-mono text-xs leading-5 text-foreground">
              {result.body}
            </pre>
          )}

          {result && !result.ok && (
            <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-4">
              <div className="flex items-center gap-2">
                <XCircle className="h-4 w-4 text-destructive" />
                <p className="text-sm font-medium text-destructive">Erreur réseau</p>
              </div>
              <p className="mt-2 font-mono text-xs leading-5 text-destructive/80">{result.error}</p>
              <p className="mt-3 text-[11px] text-muted-foreground">
                Temps de réponse : {result.timeMs}ms
              </p>
            </div>
          )}
        </div>
      </Panel>
    </ToolShell>
  );
}
