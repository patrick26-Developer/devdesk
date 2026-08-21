// useEffect : redessine le QR code sur le canvas à chaque changement de texte
// useRef : référence directe vers l'élément <canvas> du DOM, nécessaire car qrcode dessine directement dessus
import { useEffect, useRef, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
// toCanvas : fonction de la librairie qrcode qui dessine un QR code directement sur un élément <canvas>
import QRCode from 'qrcode';

export default function QrCodeGenerator() {
  // Le texte ou l'URL à encoder dans le QR code
  const [text, setText] = useState('https://electronjs.org');
  // Référence vers le <canvas> réel dans le DOM, pour que qrcode puisse dessiner dessus
  const canvasRef = useRef<HTMLCanvasElement>(null);
  // Message d'erreur si le texte est trop long ou vide
  const [error, setError] = useState<string | null>(null);

  // Redessine le QR code à chaque fois que le texte change
  useEffect(() => {
    if (!canvasRef.current) return;

    if (!text) {
      setError(null);
      return;
    }

    // QRCode.toCanvas est asynchrone et dessine directement sur l'élément canvas fourni
    QRCode.toCanvas(canvasRef.current, text, { width: 240, margin: 2 })
      .then(() => setError(null))
      .catch((e: Error) => setError(e.message));
  }, [text]);

  // Télécharge le contenu du canvas en tant que fichier PNG, via l'API native du navigateur
  const download = () => {
    if (!canvasRef.current) return;
    // toDataURL convertit le contenu du canvas en chaîne Base64 image/png
    const url = canvasRef.current.toDataURL('image/png');
    // Crée un lien <a> temporaire pour déclencher le téléchargement, technique standard côté navigateur
    const link = document.createElement('a');
    link.href = url;
    link.download = 'qrcode.png';
    link.click();
  };

  return (
    <div className="flex flex-col h-full p-6 gap-4 max-w-xl">
      <h2 className="text-lg font-semibold">QR Code Generator</h2>

      <Input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Texte ou URL à encoder..."
      />

      {error && <p className="text-sm text-destructive">{error}</p>}

      {/* Le canvas sur lequel qrcode dessine directement — pas de <img>, le rendu est natif Canvas */}
      <canvas ref={canvasRef} className="border rounded-md self-start" />

      <Button onClick={download} variant="secondary" className="w-fit">
        Télécharger en PNG
      </Button>
    </div>
  );
}