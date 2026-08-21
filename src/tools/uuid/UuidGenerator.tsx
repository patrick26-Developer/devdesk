import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Copy,
  RefreshCw,
  Check,
  Fingerprint,
} from 'lucide-react';

export default function UuidGenerator() {
  const [uuid, setUuid] = useState(() => crypto.randomUUID());
  const [copied, setCopied] = useState(false);

  const generate = () => {
    setUuid(crypto.randomUUID());
    setCopied(false);
  };

  const copy = async () => {
    await navigator.clipboard.writeText(uuid);

    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 1500);
  };

  return (
    <div className="flex h-full flex-col gap-6 p-6">
      {/* Header */}
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-violet-500/15 bg-violet-500/10 text-violet-500">
          <Fingerprint className="h-5 w-5" />
        </div>

        <div>
          <h2 className="text-lg font-semibold">
            UUID Generator
          </h2>

          <p className="mt-1 text-xs text-muted-foreground">
            Génère des identifiants UUID v4 uniques et aléatoires.
          </p>
        </div>
      </div>

      {/* UUID */}
      <section className="rounded-xl border border-border bg-card p-4">
        <label className="mb-2 block text-xs font-medium">
          UUID généré
        </label>

        <div className="flex gap-2">
          <Input
            value={uuid}
            readOnly
            className="font-mono text-sm"
          />

          <Button
            variant="secondary"
            size="icon"
            onClick={copy}
            title="Copier"
          >
            {copied ? (
              <Check className="h-4 w-4 text-emerald-500" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </Button>
        </div>

        {copied && (
          <p className="mt-2 text-[11px] text-emerald-500">
            UUID copié dans le presse-papiers.
          </p>
        )}
      </section>

      {/* Action */}
      <div>
        <Button
          onClick={generate}
          className="gap-2"
        >
          <RefreshCw className="h-4 w-4" />
          Générer un nouveau UUID
        </Button>
      </div>

      {/* Info */}
      <div className="mt-auto rounded-xl border border-border bg-muted/20 p-4">
        <p className="text-xs font-medium">
          UUID v4
        </p>

        <p className="mt-1 text-[11px] leading-5 text-muted-foreground">
          L'identifiant est généré localement à partir de
          <code className="mx-1 rounded bg-muted px-1 font-mono">
            crypto.randomUUID()
          </code>
          sans requête réseau.
        </p>
      </div>
    </div>
  );
}