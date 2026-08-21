// useEffect : recalcule automatiquement les hashes lorsque le texte change
// useState : conserve le texte source, les résultats et l'état de copie
import { useEffect, useState } from 'react';

import {
  Check,
  Clipboard,
  Copy,
  Hash,
  Info,
  RotateCcw,
  ShieldCheck,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

// =========================================================
// ALGORITHMES
// =========================================================

const ALGORITHMS = [
  'SHA-1',
  'SHA-256',
  'SHA-384',
  'SHA-512',
] as const;

// =========================================================
// CALCUL DU HASH
// =========================================================

async function computeHash(
  text: string,
  algorithm: string
): Promise<string> {

  // Transforme le texte en bytes UTF-8
  const data = new TextEncoder().encode(text);

  // Calcule le hash avec l'API Web Crypto native
  const hashBuffer =
    await window.crypto.subtle.digest(
      algorithm,
      data
    );

  // Transforme le résultat binaire en tableau d'octets
  const hashArray = Array.from(
    new Uint8Array(hashBuffer)
  );

  // Convertit chaque octet en hexadécimal
  return hashArray
    .map((b) =>
      b.toString(16).padStart(2, '0')
    )
    .join('');
}

// =========================================================
// COMPOSANT
// =========================================================

export default function HashGenerator() {

  const [input, setInput] = useState('');

  const [hashes, setHashes] =
    useState<Record<string, string>>({});

  const [copied, setCopied] =
    useState<string | null>(null);

  // =========================================================
  // CALCUL AUTOMATIQUE
  // =========================================================

  useEffect(() => {

    if (!input) {
      setHashes({});
      return;
    }

    Promise.all(
      ALGORITHMS.map((algo) =>
        computeHash(input, algo)
      )
    ).then((results) => {

      const next: Record<string, string> = {};

      ALGORITHMS.forEach((algo, index) => {
        next[algo] = results[index];
      });

      setHashes(next);

    });

  }, [input]);

  // =========================================================
  // COPIER
  // =========================================================

  const copyHash = async (
    algorithm: string
  ) => {

    const value = hashes[algorithm];

    if (!value) return;

    await navigator.clipboard.writeText(value);

    setCopied(algorithm);

    setTimeout(() => {
      setCopied(null);
    }, 1500);
  };

  // =========================================================
  // RESET
  // =========================================================

  const reset = () => {
    setInput('');
    setHashes({});
    setCopied(null);
  };

  return (
    <div className="flex h-full min-h-0 flex-col gap-5 p-6 xl:p-8">

      {/* =========================================================
          HEADER
      ========================================================= */}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

        <div className="flex items-center gap-3">

          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-purple-500/15 bg-purple-500/10">
            <Hash className="h-5 w-5 text-purple-500" />
          </div>

          <div>

            <h2 className="text-base font-semibold text-foreground">
              Hash Generator
            </h2>

            <p className="mt-0.5 text-xs text-muted-foreground">
              Générez plusieurs empreintes cryptographiques
              à partir d'un texte.
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
          SECURITY INFO
      ========================================================= */}

      <div className="flex items-start gap-2 rounded-lg border border-purple-500/15 bg-purple-500/[0.04] px-3.5 py-2.5 text-xs text-muted-foreground">

        <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-purple-500" />

        <span>
          Les empreintes sont calculées localement avec
          l'API Web Crypto native. Aucune donnée n'est
          envoyée vers un serveur.
        </span>

      </div>

      {/* =========================================================
          INPUT
      ========================================================= */}

      <div className="overflow-hidden rounded-xl border border-border bg-card">

        <div className="flex items-center justify-between border-b border-border px-4 py-3">

          <div>

            <p className="text-sm font-medium">
              Texte source
            </p>

            <p className="mt-0.5 text-[11px] text-muted-foreground">
              Le hash est recalculé automatiquement à chaque modification.
            </p>

          </div>

          <span className="rounded-md bg-muted px-2 py-1 font-mono text-[10px] text-muted-foreground">
            INPUT
          </span>

        </div>

        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Saisissez le texte à hasher..."
          className="min-h-[150px] resize-none rounded-none border-0 bg-transparent p-4 font-mono text-sm shadow-none focus-visible:ring-0"
        />

        <div className="flex items-center justify-between border-t border-border px-4 py-2">

          <span className="text-[10px] text-muted-foreground">
            {input.length} caractères
          </span>

          {input && (
            <span className="flex items-center gap-1 text-[10px] text-emerald-500">
              <Check className="h-3 w-3" />
              Analyse automatique
            </span>
          )}

        </div>

      </div>

      {/* =========================================================
          RESULTS HEADER
      ========================================================= */}

      <div className="flex items-center justify-between">

        <div className="flex items-center gap-2">

          <Hash className="h-4 w-4 text-purple-500" />

          <h3 className="text-sm font-semibold">
            Empreintes générées
          </h3>

        </div>

        <span className="text-[11px] text-muted-foreground">
          {ALGORITHMS.length} algorithmes
        </span>

      </div>

      {/* =========================================================
          RESULTS
      ========================================================= */}

      <div className="grid min-h-0 flex-1 grid-cols-1 gap-3 lg:grid-cols-2">

        {ALGORITHMS.map((algo) => {

          const value = hashes[algo];

          return (
            <div
              key={algo}
              className="flex min-h-0 flex-col overflow-hidden rounded-xl border border-border bg-card transition-colors hover:border-purple-500/25"
            >

              {/* RESULT HEADER */}

              <div className="flex items-center justify-between border-b border-border px-4 py-3">

                <div className="flex items-center gap-2">

                  <div className="flex h-7 w-7 items-center justify-center rounded-md bg-purple-500/10">
                    <Hash className="h-3.5 w-3.5 text-purple-500" />
                  </div>

                  <div>

                    <p className="text-xs font-semibold">
                      {algo}
                    </p>

                    <p className="text-[10px] text-muted-foreground">
                      SHA family
                    </p>

                  </div>

                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyHash(algo)}
                  disabled={!value}
                  className="h-7 gap-1.5 px-2 text-xs"
                >

                  {copied === algo ? (
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

              {/* RESULT */}

              <div className="min-h-0 flex-1 bg-muted/[0.15] p-4">

                <code className="block break-all font-mono text-xs leading-5 text-foreground">

                  {value || (
                    <span className="text-muted-foreground">
                      —
                    </span>
                  )}

                </code>

              </div>

              {/* RESULT FOOTER */}

              <div className="border-t border-border px-4 py-2">

                <span className="text-[10px] text-muted-foreground">

                  {value
                    ? `${value.length} caractères`
                    : 'En attente du texte source'}

                </span>

              </div>

            </div>
          );
        })}

      </div>

      {/* =========================================================
          FOOTER INFO
      ========================================================= */}

      <div className="flex items-center gap-2 border-t border-border pt-3 text-[10px] text-muted-foreground">

        <Info className="h-3.5 w-3.5 shrink-0" />

        <span>
          SHA-1 est conservé pour compatibilité. Pour les
          nouveaux usages de sécurité, privilégiez SHA-256 ou supérieur.
        </span>

      </div>

    </div>
  );
}