import { useState } from 'react';
import {
  ArrowDownToLine,
  ArrowUpFromLine,
  Check,
  Clipboard,
  FileCode2,
  RotateCcw,
  ShieldCheck,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

export default function Base64Tool() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const encode = () => {
    try {
      setOutput(btoa(unescape(encodeURIComponent(input))));
      setError(null);
    } catch (e) {
      setError((e as Error).message);
      setOutput('');
    }
  };

  const decode = () => {
    try {
      setOutput(decodeURIComponent(escape(atob(input))));
      setError(null);
    } catch {
      setError('Chaîne Base64 invalide');
      setOutput('');
    }
  };

  const clear = () => {
    setInput('');
    setOutput('');
    setError(null);
    setCopied(false);
  };

  const copyOutput = async () => {
    if (!output) return;

    await navigator.clipboard.writeText(output);
    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 1500);
  };

  return (
    <div className="flex h-full min-h-0 flex-col gap-5 p-6 xl:p-8">

      {/* =========================================================
          HEADER
      ========================================================= */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-cyan-500/15 bg-cyan-500/10">
            <FileCode2 className="h-5 w-5 text-cyan-500" />
          </div>

          <div>
            <h2 className="text-base font-semibold text-foreground">
              Base64 Encoder / Decoder
            </h2>

            <p className="mt-0.5 text-xs text-muted-foreground">
              Encodez ou décodez rapidement une chaîne Base64.
            </p>
          </div>
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={clear}
          className="w-fit gap-2 text-muted-foreground hover:text-foreground"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          Réinitialiser
        </Button>
      </div>

      {/* =========================================================
          INFO
      ========================================================= */}
      <div className="flex items-center gap-2 rounded-lg border border-cyan-500/15 bg-cyan-500/[0.04] px-3.5 py-2.5 text-xs text-muted-foreground">
        <ShieldCheck className="h-4 w-4 shrink-0 text-cyan-500" />
        <span>
          Le traitement est effectué localement dans DevDesk.
        </span>
      </div>

      {/* =========================================================
          EDITORS
      ========================================================= */}
      <div className="grid min-h-0 flex-1 grid-cols-1 gap-4 lg:grid-cols-2">

        {/* INPUT */}
        <div className="flex min-h-0 flex-col overflow-hidden rounded-xl border border-border bg-card">

          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <div>
              <p className="text-sm font-medium text-foreground">
                Entrée
              </p>

              <p className="mt-0.5 text-[11px] text-muted-foreground">
                Texte ou chaîne Base64
              </p>
            </div>

            <span className="rounded-md bg-muted px-2 py-1 font-mono text-[10px] text-muted-foreground">
              INPUT
            </span>
          </div>

          <Textarea
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              setError(null);
            }}
            placeholder="Saisissez votre texte ou votre chaîne Base64..."
            className="min-h-0 flex-1 resize-none rounded-none border-0 bg-transparent p-4 font-mono text-sm shadow-none focus-visible:ring-0"
          />

          <div className="border-t border-border px-4 py-2">
            <span className="text-[10px] text-muted-foreground">
              {input.length} caractères
            </span>
          </div>
        </div>

        {/* OUTPUT */}
        <div className="flex min-h-0 flex-col overflow-hidden rounded-xl border border-border bg-card">

          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <div>
              <p className="text-sm font-medium text-foreground">
                Résultat
              </p>

              <p className="mt-0.5 text-[11px] text-muted-foreground">
                Résultat de l'opération
              </p>
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={copyOutput}
              disabled={!output}
              className="h-7 gap-1.5 px-2 text-xs"
            >
              {copied ? (
                <>
                  <Check className="h-3.5 w-3.5 text-emerald-500" />
                  Copié
                </>
              ) : (
                <>
                  <Clipboard className="h-3.5 w-3.5" />
                  Copier
                </>
              )}
            </Button>
          </div>

          <Textarea
            value={output}
            readOnly
            placeholder="Le résultat apparaîtra ici..."
            className="min-h-0 flex-1 resize-none rounded-none border-0 bg-muted/[0.18] p-4 font-mono text-sm shadow-none focus-visible:ring-0"
          />

          <div className="border-t border-border px-4 py-2">
            <span className="text-[10px] text-muted-foreground">
              {output.length} caractères
            </span>
          </div>
        </div>
      </div>

      {/* =========================================================
          ERROR
      ========================================================= */}
      {error && (
        <div className="rounded-lg border border-destructive/20 bg-destructive/5 px-4 py-2.5 text-xs text-destructive">
          <span className="font-medium">Erreur :</span> {error}
        </div>
      )}

      {/* =========================================================
          ACTIONS
      ========================================================= */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4">

        <p className="text-[11px] text-muted-foreground">
          Choisissez une opération pour transformer votre contenu.
        </p>

        <div className="flex gap-2">
          <Button
            onClick={encode}
            disabled={!input}
            className="gap-2"
          >
            <ArrowUpFromLine className="h-4 w-4" />
            Encoder
          </Button>

          <Button
            variant="secondary"
            onClick={decode}
            disabled={!input}
            className="gap-2"
          >
            <ArrowDownToLine className="h-4 w-4" />
            Décoder
          </Button>
        </div>
      </div>
    </div>
  );
}