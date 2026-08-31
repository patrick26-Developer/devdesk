import { useEffect, useRef, useState } from 'react';
import QRCode from 'qrcode';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import ToolShell from '@/components/tool/ToolShell';
import { Panel, PanelHeader } from '@/components/tool/Panel';
import { getTool } from '@/tools';
import { Download, ShieldCheck } from 'lucide-react';

export default function QrCodeGenerator() {
  const tool = getTool('qrcode')!;
  const [text, setText] = useState('https://electronjs.org');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    if (!text) {
      setError(null);
      return;
    }

    QRCode.toCanvas(canvasRef.current, text, { width: 260, margin: 2 })
      .then(() => setError(null))
      .catch((e: Error) => setError(e.message));
  }, [text]);

  const download = () => {
    if (!canvasRef.current) return;
    const link = document.createElement('a');
    link.href = canvasRef.current.toDataURL('image/png');
    link.download = 'qrcode.png';
    link.click();
  };

  return (
    <ToolShell tool={tool}>
      <div className="grid min-h-0 flex-1 grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1fr)_360px]">
        <Panel className="p-5">
          <div className="mb-4">
            <p className="text-sm font-semibold">Contenu à encoder</p>
            <p className="mt-1 text-xs leading-5 text-muted-foreground">
              Saisissez l'URL ou le texte que vous souhaitez intégrer au QR Code.
            </p>
          </div>

          <Input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="https://exemple.com"
            className="font-mono text-sm"
          />

          {error && (
            <div className="mt-3 rounded-lg border border-destructive/20 bg-destructive/5 px-3 py-2 text-xs text-destructive">
              Erreur : {error}
            </div>
          )}

          <div className="mt-5 flex items-start gap-2 rounded-lg border border-border bg-muted/30 p-3">
            <ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-500" />
            <p className="text-[11px] leading-5 text-muted-foreground">
              Le QR Code est généré localement dans DevDesk. Aucune donnée n'est envoyée vers un
              service externe.
            </p>
          </div>
        </Panel>

        <Panel>
          <PanelHeader title="Aperçu" subtitle="Votre QR Code" />
          <div className="flex flex-1 flex-col items-center justify-center gap-5 p-6">
            <div className="flex items-center justify-center rounded-xl border border-border bg-white p-4 shadow-sm">
              <canvas ref={canvasRef} className="block" />
            </div>
            <Button onClick={download} variant="secondary" className="w-full gap-2" disabled={!text || !!error}>
              <Download className="h-4 w-4" />
              Télécharger en PNG
            </Button>
          </div>
        </Panel>
      </div>
    </ToolShell>
  );
}
