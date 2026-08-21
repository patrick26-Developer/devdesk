import { useState } from 'react';
import {
  Activity,
  Check,
  Clock3,
  Copy,
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

// Méthodes HTTP courantes
const METHODS = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'];

export default function ApiTester() {
  const [method, setMethod] = useState('GET');

  const [url, setUrl] = useState(
    'https://jsonplaceholder.typicode.com/posts/1'
  );

  const [headersText, setHeadersText] = useState(
    'Content-Type: application/json'
  );

  const [body, setBody] = useState('');

  const [result, setResult] =
    useState<Awaited<ReturnType<typeof window.api.httpRequest>> | null>(null);

  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  // =========================================================
  // HEADERS
  // =========================================================

  const parseHeaders = (): Record<string, string> => {
    const headers: Record<string, string> = {};

    headersText.split('\n').forEach((line) => {
      const [key, ...rest] = line.split(':');

      if (key && rest.length) {
        headers[key.trim()] = rest.join(':').trim();
      }
    });

    return headers;
  };

  // =========================================================
  // SEND REQUEST
  // =========================================================

  const send = async () => {
    if (!url.trim()) return;

    setLoading(true);
    setResult(null);
    setCopied(false);

    try {
      const response = await window.api.httpRequest({
        url,
        method,
        headers: parseHeaders(),
        body,
      });

      setResult(response);
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // RESET
  // =========================================================

  const reset = () => {
    setMethod('GET');
    setUrl('https://jsonplaceholder.typicode.com/posts/1');
    setHeadersText('Content-Type: application/json');
    setBody('');
    setResult(null);
    setCopied(false);
  };

  // =========================================================
  // COPY RESPONSE
  // =========================================================

  const copyResponse = async () => {
    if (!result?.body) return;

    await navigator.clipboard.writeText(result.body);
    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 1500);
  };

  // =========================================================
  // METHOD STYLE
  // =========================================================

  const getMethodStyle = () => {
    switch (method) {
      case 'GET':
        return 'text-emerald-500 bg-emerald-500/10 border-emerald-500/15';

      case 'POST':
        return 'text-blue-500 bg-blue-500/10 border-blue-500/15';

      case 'PUT':
        return 'text-amber-500 bg-amber-500/10 border-amber-500/15';

      case 'PATCH':
        return 'text-violet-500 bg-violet-500/10 border-violet-500/15';

      case 'DELETE':
        return 'text-red-500 bg-red-500/10 border-red-500/15';

      default:
        return 'text-primary bg-primary/10 border-primary/15';
    }
  };

  return (
    <div className="flex h-full min-h-0 flex-col gap-5 p-6 xl:p-8">

      {/* =========================================================
          HEADER
      ========================================================= */}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

        <div className="flex items-center gap-3">

          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-orange-500/15 bg-orange-500/10">
            <Globe className="h-5 w-5 text-orange-500" />
          </div>

          <div>
            <h2 className="text-base font-semibold text-foreground">
              API Tester
            </h2>

            <p className="mt-0.5 text-xs text-muted-foreground">
              Testez vos endpoints HTTP directement depuis DevDesk.
            </p>
          </div>

        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={reset}
          className="w-fit gap-2 text-muted-foreground hover:text-foreground"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          Réinitialiser
        </Button>

      </div>

      {/* =========================================================
          REQUEST BAR
      ========================================================= */}

      <div className="rounded-xl border border-border bg-card p-3">

        <div className="flex flex-col gap-2 md:flex-row">

          {/* METHOD */}

          <select
            value={method}
            onChange={(e) => setMethod(e.target.value)}
            className={`h-10 rounded-lg border px-3 text-xs font-semibold outline-none transition-colors focus:ring-2 focus:ring-primary/20 ${getMethodStyle()}`}
          >
            {METHODS.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>

          {/* URL */}

          <div className="relative flex-1">

            <Server className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />

            <Input
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://api.example.com/endpoint"
              className="h-10 pl-9 font-mono text-xs"
            />

          </div>

          {/* SEND */}

          <Button
            onClick={send}
            disabled={loading || !url.trim()}
            className="h-10 gap-2 px-5"
          >
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

      {/* =========================================================
          LOCAL PROCESSING INFO
      ========================================================= */}

      <div className="flex items-center gap-2 rounded-lg border border-orange-500/15 bg-orange-500/[0.04] px-3.5 py-2.5 text-xs text-muted-foreground">

        <ShieldCheck className="h-4 w-4 shrink-0 text-orange-500" />

        <span>
          Les requêtes sont exécutées localement via le processus principal
          de DevDesk.
        </span>

      </div>

      {/* =========================================================
          REQUEST CONFIGURATION
      ========================================================= */}

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">

        {/* HEADERS */}

        <div className="overflow-hidden rounded-xl border border-border bg-card">

          <div className="flex items-center justify-between border-b border-border px-4 py-3">

            <div>
              <p className="text-sm font-medium">
                Headers
              </p>

              <p className="mt-0.5 text-[11px] text-muted-foreground">
                Un header par ligne
              </p>
            </div>

            <span className="rounded-md bg-muted px-2 py-1 font-mono text-[10px] text-muted-foreground">
              HEADERS
            </span>

          </div>

          <Textarea
            value={headersText}
            onChange={(e) => setHeadersText(e.target.value)}
            placeholder={`Authorization: Bearer token
Content-Type: application/json`}
            className="min-h-[120px] resize-none rounded-none border-0 bg-transparent p-4 font-mono text-xs shadow-none focus-visible:ring-0"
          />

        </div>

        {/* BODY */}

        <div className="overflow-hidden rounded-xl border border-border bg-card">

          <div className="flex items-center justify-between border-b border-border px-4 py-3">

            <div>
              <p className="text-sm font-medium">
                Body
              </p>

              <p className="mt-0.5 text-[11px] text-muted-foreground">
                JSON ou texte brut
              </p>
            </div>

            <span className="rounded-md bg-muted px-2 py-1 font-mono text-[10px] text-muted-foreground">
              {method === 'GET' || method === 'HEAD'
                ? 'DISABLED'
                : 'REQUEST BODY'}
            </span>

          </div>

          <Textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder='{"name": "DevDesk"}'
            disabled={method === 'GET' || method === 'HEAD'}
            className="min-h-[120px] resize-none rounded-none border-0 bg-transparent p-4 font-mono text-xs shadow-none focus-visible:ring-0"
          />

        </div>

      </div>

      {/* =========================================================
          RESPONSE
      ========================================================= */}

      <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl border border-border bg-card">

        {/* RESPONSE HEADER */}

        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-4 py-3">

          <div className="flex items-center gap-3">

            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-orange-500" />

              <span className="text-sm font-medium">
                Réponse
              </span>
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

              <span className="flex items-center gap-1.5">
                <Clock3 className="h-3.5 w-3.5" />
                {result.timeMs}ms
              </span>

              <Button
                variant="ghost"
                size="sm"
                onClick={copyResponse}
                disabled={!result.body}
                className="h-7 gap-1.5 px-2 text-xs"
              >
                {copied ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-emerald-500" />
                    Copié
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5" />
                    Copier
                  </>
                )}
              </Button>

            </div>
          )}

        </div>

        {/* RESPONSE CONTENT */}

        <div className="min-h-0 flex-1 overflow-auto bg-muted/[0.12] p-4">

          {!result && !loading && (
            <div className="flex h-full flex-col items-center justify-center text-center">

              <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-border bg-card">
                <Globe className="h-5 w-5 text-muted-foreground" />
              </div>

              <p className="mt-3 text-sm font-medium text-foreground">
                Aucune requête envoyée
              </p>

              <p className="mt-1 max-w-sm text-xs leading-5 text-muted-foreground">
                Configurez votre endpoint puis cliquez sur
                <span className="font-medium text-foreground">
                  {' '}Envoyer
                </span>
                {' '}pour afficher la réponse.
              </p>

            </div>
          )}

          {loading && (
            <div className="flex h-full flex-col items-center justify-center">

              <Loader2 className="h-6 w-6 animate-spin text-orange-500" />

              <p className="mt-3 text-xs text-muted-foreground">
                Exécution de la requête...
              </p>

            </div>
          )}

          {result && (
            <div className="h-full">

              {result.ok ? (
                <div className="flex h-full flex-col">

                  <div className="mb-3 flex items-center gap-2">

                    {result.status < 300 ? (
                      <Check className="h-4 w-4 text-emerald-500" />
                    ) : (
                      <XCircle className="h-4 w-4 text-destructive" />
                    )}

                    <span
                      className={
                        result.status < 300
                          ? 'text-xs font-semibold text-emerald-500'
                          : 'text-xs font-semibold text-destructive'
                      }
                    >
                      Requête terminée
                    </span>

                  </div>

                  <pre className="min-h-0 flex-1 overflow-auto rounded-lg border border-border bg-background p-4 font-mono text-xs leading-5 text-foreground">
                    {result.body}
                  </pre>

                </div>
              ) : (
                <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-4">

                  <div className="flex items-center gap-2">

                    <XCircle className="h-4 w-4 text-destructive" />

                    <p className="text-sm font-medium text-destructive">
                      Erreur réseau
                    </p>

                  </div>

                  <p className="mt-2 font-mono text-xs leading-5 text-destructive/80">
                    {result.error}
                  </p>

                  <p className="mt-3 text-[11px] text-muted-foreground">
                    Temps de réponse : {result.timeMs}ms
                  </p>

                </div>
              )}

            </div>
          )}

        </div>

      </div>

    </div>
  );
}