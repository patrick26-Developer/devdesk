import { useMemo, useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import {
  AlertCircle,
  CheckCircle2,
  Code2,
  ShieldCheck,
} from 'lucide-react';

// Décode une chaîne Base64URL utilisée par les JWT.
function base64UrlDecode(str: string): string {
  let base64 = str.replace(/-/g, '+').replace(/_/g, '/');

  while (base64.length % 4 !== 0) {
    base64 += '=';
  }

  return decodeURIComponent(escape(atob(base64)));
}

export default function JwtDecoder() {
  const [token, setToken] = useState('');

  const decoded = useMemo(() => {
    if (!token.trim()) return null;

    const parts = token.trim().split('.');

    if (parts.length !== 3) {
      return {
        error:
          'Format invalide : un JWT doit contenir 3 parties séparées par des points',
      };
    }

    try {
      const header = JSON.parse(base64UrlDecode(parts[0]));
      const payload = JSON.parse(base64UrlDecode(parts[1]));

      const isExpired = payload.exp
        ? Date.now() / 1000 > payload.exp
        : null;

      return {
        header,
        payload,
        isExpired,
        error: null,
      };
    } catch {
      return {
        error: 'Impossible de décoder ce token (Base64 ou JSON invalide)',
      };
    }
  }, [token]);

  return (
    <div className="flex h-full flex-col gap-6 p-6 xl:p-8">
      {/* =========================================================
          HEADER
      ========================================================= */}
      <div className="flex items-start gap-4">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-red-500/15 bg-red-500/10 text-red-500">
          <ShieldCheck className="h-5 w-5" />
        </div>

        <div>
          <h2 className="text-lg font-semibold tracking-tight">
            JWT Decoder
          </h2>

          <p className="mt-1 text-xs leading-5 text-muted-foreground">
            Analysez localement le header et le payload d'un token JWT.
          </p>
        </div>
      </div>

      {/* =========================================================
          INFORMATIONS DE SÉCURITÉ
      ========================================================= */}
      <div className="flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-3 text-xs text-muted-foreground">
        <ShieldCheck className="h-4 w-4 shrink-0 text-emerald-500" />

        <span>
          Décodage uniquement en local — aucune vérification de signature
          et aucune donnée envoyée à un serveur.
        </span>
      </div>

      {/* =========================================================
          TOKEN
      ========================================================= */}
      <section className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-medium text-foreground">
            Token JWT
          </label>

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
      </section>

      {/* =========================================================
          ERREUR
      ========================================================= */}
      {decoded?.error && (
        <div className="flex items-start gap-3 rounded-xl border border-destructive/20 bg-destructive/5 p-4">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-destructive" />

          <div>
            <p className="text-xs font-semibold text-destructive">
              Token invalide
            </p>

            <p className="mt-1 text-xs leading-5 text-muted-foreground">
              {decoded.error}
            </p>
          </div>
        </div>
      )}

      {/* =========================================================
          RÉSULTATS
      ========================================================= */}
      {decoded && !decoded.error && (
        <div className="grid min-h-0 flex-1 grid-cols-1 gap-5 lg:grid-cols-2">
          {/* HEADER JWT */}
          <section className="flex min-h-0 flex-col overflow-hidden rounded-xl border border-border bg-card">
            <div className="flex items-center justify-between border-b border-border px-4 py-3">
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-md bg-sky-500/10 text-sky-500">
                  <Code2 className="h-3.5 w-3.5" />
                </div>

                <div>
                  <h3 className="text-xs font-semibold">Header</h3>
                  <p className="text-[10px] text-muted-foreground">
                    Métadonnées du token
                  </p>
                </div>
              </div>
            </div>

            <pre className="min-h-0 flex-1 overflow-auto bg-muted/20 p-4 font-mono text-xs leading-5">
              {JSON.stringify(decoded.header, null, 2)}
            </pre>
          </section>

          {/* PAYLOAD JWT */}
          <section className="flex min-h-0 flex-col overflow-hidden rounded-xl border border-border bg-card">
            <div className="flex items-center justify-between border-b border-border px-4 py-3">
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-md bg-violet-500/10 text-violet-500">
                  <Code2 className="h-3.5 w-3.5" />
                </div>

                <div>
                  <h3 className="text-xs font-semibold">Payload</h3>
                  <p className="text-[10px] text-muted-foreground">
                    Claims et données du token
                  </p>
                </div>
              </div>

              {decoded.isExpired !== null && (
                <div
                  className={`flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-medium ${
                    decoded.isExpired
                      ? 'border-destructive/20 bg-destructive/5 text-destructive'
                      : 'border-emerald-500/20 bg-emerald-500/5 text-emerald-600'
                  }`}
                >
                  {decoded.isExpired ? (
                    <AlertCircle className="h-3 w-3" />
                  ) : (
                    <CheckCircle2 className="h-3 w-3" />
                  )}

                  {decoded.isExpired
                    ? 'Token expiré'
                    : 'Token non expiré'}
                </div>
              )}
            </div>

            <pre className="min-h-0 flex-1 overflow-auto bg-muted/20 p-4 font-mono text-xs leading-5">
              {JSON.stringify(decoded.payload, null, 2)}
            </pre>
          </section>
        </div>
      )}

      {/* =========================================================
          EMPTY STATE
      ========================================================= */}
      {!token.trim() && (
        <div className="flex flex-1 items-center justify-center rounded-xl border border-dashed border-border bg-muted/10">
          <div className="max-w-sm text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl border border-red-500/15 bg-red-500/10 text-red-500">
              <ShieldCheck className="h-5 w-5" />
            </div>

            <h3 className="mt-4 text-sm font-semibold">
              Aucun token à analyser
            </h3>

            <p className="mt-1 text-xs leading-5 text-muted-foreground">
              Collez un token JWT dans la zone ci-dessus pour afficher
              automatiquement son header et son payload.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}