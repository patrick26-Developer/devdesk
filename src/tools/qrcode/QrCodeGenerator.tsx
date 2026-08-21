import { useEffect, useRef, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import QRCode from 'qrcode';
import {
  Download,
  QrCode,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';

export default function QrCodeGenerator() {
  const [text, setText] = useState('https://electronjs.org');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    if (!text) {
      setError(null);
      return;
    }

    QRCode.toCanvas(
      canvasRef.current,
      text,
      {
        width: 260,
        margin: 2,
      },
    )
      .then(() => setError(null))
      .catch((e: Error) => setError(e.message));
  }, [text]);

  const download = () => {
    if (!canvasRef.current) return;

    const url = canvasRef.current.toDataURL('image/png');

    const link = document.createElement('a');
    link.href = url;
    link.download = 'qrcode.png';
    link.click();
  };

  return (
    <div className="flex h-full flex-col gap-6 p-6 xl:p-8">
      {/* En-tête */}
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-emerald-500/15 bg-emerald-500/10 text-emerald-500">
          <QrCode className="h-5 w-5" />
        </div>

        <div>
          <h2 className="text-lg font-semibold tracking-tight">
            QR Code Generator
          </h2>

          <p className="mt-0.5 text-xs text-muted-foreground">
            Transformez une URL ou un texte en QR Code.
          </p>
        </div>
      </div>

      {/* Contenu */}
      <div className="grid min-h-0 flex-1 grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1fr)_360px]">
        {/* Configuration */}
        <section className="rounded-xl border border-border bg-card p-5">
          <div className="mb-5">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-emerald-500" />

              <h3 className="text-sm font-semibold">
                Contenu à encoder
              </h3>
            </div>

            <p className="mt-1 text-xs leading-5 text-muted-foreground">
              Saisissez l'URL ou le texte que vous souhaitez intégrer
              au QR Code.
            </p>
          </div>

          <Input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="https://exemple.com"
            className="font-mono text-sm"
          />

          {error && (
            <div className="mt-3 rounded-lg border border-destructive/20 bg-destructive/5 px-3 py-2">
              <p className="text-xs text-destructive">
                Erreur : {error}
              </p>
            </div>
          )}

          <div className="mt-5 flex items-start gap-2 rounded-lg border border-border bg-muted/30 p-3">
            <ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-500" />

            <p className="text-[11px] leading-5 text-muted-foreground">
              Le QR Code est généré localement dans DevDesk.
              Aucune donnée n'est envoyée vers un service externe.
            </p>
          </div>
        </section>

        {/* Aperçu */}
        <section className="flex flex-col items-center justify-center rounded-xl border border-border bg-card p-6">
          <div className="mb-5 text-center">
            <h3 className="text-sm font-semibold">
              Aperçu
            </h3>

            <p className="mt-1 text-[11px] text-muted-foreground">
              Votre QR Code
            </p>
          </div>

          <div className="flex items-center justify-center rounded-xl border border-border bg-white p-4 shadow-sm">
            <canvas
              ref={canvasRef}
              className="block"
            />
          </div>

          <Button
            onClick={download}
            variant="secondary"
            className="mt-5 w-full gap-2"
            disabled={!text || !!error}
          >
            <Download className="h-4 w-4" />
            Télécharger en PNG
          </Button>
        </section>
      </div>
    </div>
  );
}