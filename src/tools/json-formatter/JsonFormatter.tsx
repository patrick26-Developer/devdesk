import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Check,
  Clipboard,
  Code2,
  Copy,
  FileJson,
  Minimize2,
  Sparkles,
  Trash2,
  XCircle,
} from 'lucide-react';

export default function JsonFormatter() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const format = () => {
    if (!input.trim()) {
      setError('Veuillez saisir un JSON à traiter.');
      setOutput('');
      return;
    }

    try {
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed, null, 2));
      setError(null);
    } catch (e) {
      setError((e as Error).message);
      setOutput('');
    }
  };

  const minify = () => {
    if (!input.trim()) {
      setError('Veuillez saisir un JSON à traiter.');
      setOutput('');
      return;
    }

    try {
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed));
      setError(null);
    } catch (e) {
      setError((e as Error).message);
      setOutput('');
    }
  };

  const copyOutput = async () => {
    if (!output) return;

    await navigator.clipboard.writeText(output);

    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 1500);
  };

  const clearAll = () => {
    setInput('');
    setOutput('');
    setError(null);
    setCopied(false);
  };

  const inputLines = input
    ? input.split('\n').length
    : 0;

  const outputLines = output
    ? output.split('\n').length
    : 0;

  return (
    <div className="flex h-full min-h-0 flex-col bg-background">

      {/* =========================================================
          TOOL HEADER
      ========================================================= */}
      <div className="shrink-0 border-b border-border bg-background/80 px-6 py-4 backdrop-blur-xl">
        <div className="flex items-center justify-between gap-4">

          {/* Identity */}
          <div className="flex items-center gap-3">
            <div className="
              flex h-10 w-10 items-center justify-center
              rounded-xl
              border border-indigo-500/15
              bg-indigo-500/10
              text-indigo-500
            ">
              <FileJson className="h-5 w-5" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-sm font-semibold">
                  JSON Formatter
                </h1>

                <span className="
                  rounded-md
                  border border-border
                  bg-muted/60
                  px-2 py-0.5
                  font-mono text-[10px]
                  text-muted-foreground
                ">
                  JSON
                </span>
              </div>

              <p className="mt-0.5 text-xs text-muted-foreground">
                Formatez, minifiez et validez rapidement votre JSON.
              </p>
            </div>
          </div>

          {/* Actions globales */}
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAll}
            disabled={!input && !output && !error}
            className="gap-2 text-muted-foreground hover:text-foreground"
          >
            <Trash2 className="h-3.5 w-3.5" />
            Effacer
          </Button>
        </div>
      </div>

      {/* =========================================================
          TOOLBAR
      ========================================================= */}
      <div className="shrink-0 border-b border-border bg-card/40 px-6 py-3">
        <div className="flex flex-wrap items-center justify-between gap-3">

          {/* Primary actions */}
          <div className="flex items-center gap-2">

            <Button
              onClick={format}
              size="sm"
              className="group gap-2"
            >
              <Sparkles className="h-3.5 w-3.5" />
              Formater
            </Button>

            <Button
              variant="secondary"
              size="sm"
              onClick={minify}
              className="gap-2"
            >
              <Minimize2 className="h-3.5 w-3.5" />
              Minifier
            </Button>

          </div>

          {/* Status */}
          <div className="flex items-center gap-3">

            {error ? (
              <div className="
                flex items-center gap-1.5
                text-xs text-destructive
              ">
                <XCircle className="h-3.5 w-3.5" />
                JSON invalide
              </div>
            ) : output ? (
              <div className="
                flex items-center gap-1.5
                text-xs text-emerald-500
              ">
                <Check className="h-3.5 w-3.5" />
                JSON valide
              </div>
            ) : (
              <div className="
                flex items-center gap-1.5
                text-xs text-muted-foreground
              ">
                <Code2 className="h-3.5 w-3.5" />
                En attente
              </div>
            )}

          </div>
        </div>
      </div>

      {/* =========================================================
          EDITORS
      ========================================================= */}
      <div className="flex min-h-0 flex-1 flex-col gap-4 p-5 lg:flex-row">

        {/* =======================================================
            INPUT
        ======================================================= */}
        <section className="
          flex min-h-0 flex-1
          flex-col overflow-hidden
          rounded-xl
          border border-border
          bg-card
        ">

          {/* Editor header */}
          <div className="
            flex shrink-0 items-center justify-between
            border-b border-border
            bg-muted/20
            px-4 py-3
          ">
            <div className="flex items-center gap-2">
              <div className="
                flex h-7 w-7 items-center justify-center
                rounded-md bg-indigo-500/10
                text-indigo-500
              ">
                <Code2 className="h-3.5 w-3.5" />
              </div>

              <div>
                <p className="text-xs font-medium">
                  Entrée
                </p>

                <p className="text-[10px] text-muted-foreground">
                  JSON source
                </p>
              </div>
            </div>

            <span className="font-mono text-[10px] text-muted-foreground">
              {inputLines} {inputLines <= 1 ? 'ligne' : 'lignes'}
            </span>
          </div>

          {/* Textarea */}
          <div className="relative min-h-0 flex-1">
            <Textarea
              value={input}
              onChange={(e) => {
                setInput(e.target.value);

                if (error) {
                  setError(null);
                }
              }}
              placeholder={`{
  "exemple": "collez votre JSON ici"
}`}
              spellCheck={false}
              className="
                h-full
                min-h-[300px]
                resize-none
                rounded-none
                border-0
                bg-transparent
                p-5
                font-mono
                text-[13px]
                leading-6
                shadow-none
                focus-visible:ring-0
              "
            />
          </div>

          {/* Footer */}
          <div className="
            flex shrink-0 items-center justify-between
            border-t border-border
            bg-muted/10
            px-4 py-2
          ">
            <span className="text-[10px] text-muted-foreground">
              Collez ou saisissez votre JSON
            </span>

            <span className="font-mono text-[10px] text-muted-foreground">
              {input.length} caractères
            </span>
          </div>
        </section>

        {/* =======================================================
            DIVIDER
        ======================================================= */}
        <div className="hidden items-center justify-center lg:flex">
          <div className="h-10 w-px bg-border" />
        </div>

        {/* =======================================================
            OUTPUT
        ======================================================= */}
        <section className="
          flex min-h-0 flex-1
          flex-col overflow-hidden
          rounded-xl
          border border-border
          bg-card
        ">

          {/* Editor header */}
          <div className="
            flex shrink-0 items-center justify-between
            border-b border-border
            bg-muted/20
            px-4 py-3
          ">
            <div className="flex items-center gap-2">
              <div className="
                flex h-7 w-7 items-center justify-center
                rounded-md bg-emerald-500/10
                text-emerald-500
              ">
                <Check className="h-3.5 w-3.5" />
              </div>

              <div>
                <p className="text-xs font-medium">
                  Résultat
                </p>

                <p className="text-[10px] text-muted-foreground">
                  JSON transformé
                </p>
              </div>
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
                  <Copy className="h-3.5 w-3.5" />
                  Copier
                </>
              )}
            </Button>
          </div>

          {/* Output */}
          <div className="relative min-h-0 flex-1">
            <Textarea
              value={output}
              readOnly
              placeholder="Le résultat apparaîtra ici..."
              spellCheck={false}
              className="
                h-full
                min-h-[300px]
                resize-none
                rounded-none
                border-0
                bg-muted/[0.08]
                p-5
                font-mono
                text-[13px]
                leading-6
                shadow-none
                focus-visible:ring-0
              "
            />

            {!output && !error && (
              <div className="
                pointer-events-none
                absolute inset-0
                flex items-center justify-center
              ">
                <div className="text-center">

                  <div className="
                    mx-auto mb-3
                    flex h-10 w-10 items-center justify-center
                    rounded-xl
                    bg-muted
                    text-muted-foreground
                  ">
                    <FileJson className="h-5 w-5" />
                  </div>

                  <p className="text-xs font-medium text-muted-foreground">
                    Aucun résultat
                  </p>

                  <p className="mt-1 text-[10px] text-muted-foreground/70">
                    Formatez ou minifiez votre JSON
                  </p>

                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="
            flex shrink-0 items-center justify-between
            border-t border-border
            bg-muted/10
            px-4 py-2
          ">
            <span className="text-[10px] text-muted-foreground">
              {output
                ? 'Résultat prêt à être utilisé'
                : 'En attente de traitement'}
            </span>

            <span className="font-mono text-[10px] text-muted-foreground">
              {outputLines} {outputLines <= 1 ? 'ligne' : 'lignes'}
            </span>
          </div>
        </section>
      </div>

      {/* =========================================================
          ERROR
      ========================================================= */}
      {error && (
        <div className="shrink-0 px-5 pb-5">
          <div className="
            flex items-start gap-3
            rounded-xl
            border border-destructive/20
            bg-destructive/[0.05]
            px-4 py-3
          ">
            <XCircle className="
              mt-0.5
              h-4 w-4 shrink-0
              text-destructive
            " />

            <div className="min-w-0">
              <p className="text-xs font-medium text-destructive">
                JSON invalide
              </p>

              <p className="
                mt-1
                break-all
                font-mono
                text-[11px]
                leading-5
                text-muted-foreground
              ">
                {error}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}