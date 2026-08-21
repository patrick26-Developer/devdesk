import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Link2,
  ArrowRight,
  ArrowLeft,
} from 'lucide-react';

export default function UrlTool() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState<string | null>(null);

  const encode = () => {
    setOutput(encodeURIComponent(input));
    setError(null);
  };

  const decode = () => {
    try {
      setOutput(decodeURIComponent(input));
      setError(null);
    } catch {
      setError(
        'Chaîne encodée invalide (séquence % malformée)'
      );
      setOutput('');
    }
  };

  return (
    <div className="flex h-full flex-col gap-6 p-6">
      {/* Header */}
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-sky-500/15 bg-sky-500/10 text-sky-500">
          <Link2 className="h-5 w-5" />
        </div>

        <div>
          <h2 className="text-lg font-semibold">
            URL Encoder / Decoder
          </h2>

          <p className="mt-1 text-xs text-muted-foreground">
            Encode ou décode rapidement des URLs et paramètres.
          </p>
        </div>
      </div>

      {/* Workspace */}
      <div className="grid min-h-0 flex-1 grid-cols-1 gap-4 lg:grid-cols-2">
        {/* Input */}
        <section className="flex min-h-0 flex-col overflow-hidden rounded-xl border border-border bg-card">
          <div className="flex items-center gap-2 border-b border-border px-4 py-3">
            <ArrowRight className="h-4 w-4 text-sky-500" />

            <div>
              <p className="text-xs font-semibold">Entrée</p>
              <p className="text-[11px] text-muted-foreground">
                Texte ou URL
              </p>
            </div>
          </div>

          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="https://exemple.com?q=café & croissant"
            className="min-h-0 flex-1 resize-none rounded-none border-0 font-mono text-sm focus-visible:ring-0"
          />
        </section>

        {/* Output */}
        <section className="flex min-h-0 flex-col overflow-hidden rounded-xl border border-border bg-card">
          <div className="flex items-center gap-2 border-b border-border px-4 py-3">
            <ArrowLeft className="h-4 w-4 text-emerald-500" />

            <div>
              <p className="text-xs font-semibold">Résultat</p>
              <p className="text-[11px] text-muted-foreground">
                Valeur transformée
              </p>
            </div>
          </div>

          <Textarea
            value={output}
            readOnly
            placeholder="Le résultat apparaîtra ici..."
            className="min-h-0 flex-1 resize-none rounded-none border-0 bg-muted/20 font-mono text-sm focus-visible:ring-0"
          />
        </section>
      </div>

      {/* Error */}
      {error && (
        <p className="rounded-lg border border-destructive/20 bg-destructive/5 p-3 text-xs text-destructive">
          Erreur : {error}
        </p>
      )}

      {/* Actions */}
      <div className="flex gap-2">
        <Button onClick={encode} className="gap-2">
          <ArrowRight className="h-4 w-4" />
          Encoder
        </Button>

        <Button
          variant="secondary"
          onClick={decode}
          className="gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Décoder
        </Button>
      </div>
    </div>
  );
}