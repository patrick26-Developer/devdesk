import { useMemo, useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import ToolShell from '@/components/tool/ToolShell';
import { Panel, PanelHeader } from '@/components/tool/Panel';
import EmptyState from '@/components/tool/EmptyState';
import CopyButton from '@/components/CopyButton';
import { getTool } from '@/tools';
import { AlertCircle, CheckCircle2, Code2, KeyRound, ShieldCheck } from 'lucide-react';

function base64UrlDecode(str: string): string {
  let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
  while (base64.length % 4 !== 0) base64 += '=';
  return decodeURIComponent(escape(atob(base64)));
}

export default function JwtDecoder() {
  const tool = getTool('jwt')!;
  const [token, setToken] = useState('');

  const decoded = useMemo(() => {
    if (!token.trim()) return null;

    const parts = token.trim().split('.');
    if (parts.length !== 3) {
      return { error: 'Format invalide : un JWT doit contenir 3 parties séparées par des points' };
    }

    try {
      const header = JSON.parse(base64UrlDecode(parts[0]));
      const payload = JSON.parse(base64UrlDecode(parts[1]));
      const isExpired = payload.exp ? Date.now() / 1000 > payload.exp : null;
      return { header, payload, isExpired, error: null as string | null };
    } catch {
      return { error: 'Impossible de décoder ce token (Base64 ou JSON invalide)' };
    }
  }, [token]);

  return (
    <ToolShell tool={tool}>
      <div className="flex items-center gap-2 rounded-lg border border-border bg-muted/30 px-4 py-3 text-xs text-muted-foreground">
        <ShieldCheck className="h-4 w-4 shrink-0 text-emerald-500" />
        <span>
          Décodage uniquement en local — aucune vérification de signature et aucune donnée envoyée à
          un serveur.
        </span>
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-medium text-foreground">Token JWT</label>
          <span className="font-mono text-[10px] text-muted-foreground">
            HEADER.PAYLOAD.SIGNATURE
          </span>
        </div>
        <Textarea
          value={token}
          onChange={(e) => setToken(e.target.value)}
          placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
          className="min-h-[110px] resize-none rounded-xl border-border bg-card font-mono text-xs leading-5"
        />
      </div>

      {decoded?.error && (
        <div className="flex items-start gap-3 rounded-xl border border-destructive/20 bg-destructive/5 p-4">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-destructive" />
          <div>
            <p className="text-xs font-semibold text-destructive">Token invalide</p>
            <p className="mt-1 text-xs leading-5 text-muted-foreground">{decoded.error}</p>
          </div>
        </div>
      )}

      {decoded && !decoded.error && (
        <div className="grid min-h-0 flex-1 grid-cols-1 gap-4 lg:grid-cols-2">
          <Panel className="min-h-0">
            <PanelHeader icon={Code2} title="Header" subtitle="Métadonnées du token"
              right={<CopyButton value={JSON.stringify(decoded.header, null, 2)} />} />
            <pre className="min-h-0 flex-1 overflow-auto bg-muted/20 p-4 font-mono text-xs leading-5">
              {JSON.stringify(decoded.header, null, 2)}
            </pre>
          </Panel>

          <Panel className="min-h-0">
            <PanelHeader>
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-md bg-muted text-muted-foreground">
                  <Code2 className="h-3.5 w-3.5" />
                </div>
                <div>
                  <p className="text-sm font-medium">Payload</p>
                  <p className="mt-0.5 text-[11px] text-muted-foreground">Claims et données</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {decoded.isExpired !== null && (
                  <span
                    className={`flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-medium ${
                      decoded.isExpired
                        ? 'border-destructive/20 bg-destructive/5 text-destructive'
                        : 'border-emerald-500/20 bg-emerald-500/5 text-emerald-600 dark:text-emerald-400'
                    }`}
                  >
                    {decoded.isExpired ? (
                      <AlertCircle className="h-3 w-3" />
                    ) : (
                      <CheckCircle2 className="h-3 w-3" />
                    )}
                    {decoded.isExpired ? 'Token expiré' : 'Token non expiré'}
                  </span>
                )}
                <CopyButton value={JSON.stringify(decoded.payload, null, 2)} />
              </div>
            </PanelHeader>
            <pre className="min-h-0 flex-1 overflow-auto bg-muted/20 p-4 font-mono text-xs leading-5">
              {JSON.stringify(decoded.payload, null, 2)}
            </pre>
          </Panel>
        </div>
      )}

      {!token.trim() && (
        <Panel className="min-h-0 flex-1 border-dashed bg-muted/10">
          <EmptyState
            icon={KeyRound}
            title="Aucun token à analyser"
            description="Collez un token JWT dans la zone ci-dessus pour afficher automatiquement son header et son payload."
          />
        </Panel>
      )}
    </ToolShell>
  );
}
