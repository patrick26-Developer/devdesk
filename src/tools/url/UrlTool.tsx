import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

export default function UrlTool() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState<string | null>(null);

  // encodeURIComponent : échappe tous les caractères spéciaux d'une chaîne pour qu'elle soit sûre dans une URL
  // (espaces -> %20, & -> %26, etc.) — utile pour encoder des paramètres de query string par exemple
  const encode = () => {
    setOutput(encodeURIComponent(input));
    setError(null);
  };

  // decodeURIComponent : opération inverse, remplace les séquences %XX par leur caractère d'origine
  const decode = () => {
    try {
      setOutput(decodeURIComponent(input));
      setError(null);
    } catch {
      // decodeURIComponent lève une erreur si la chaîne contient des séquences %XX malformées
      setError('Chaîne encodée invalide (séquence % malformée)');
      setOutput('');
    }
  };

  return (
    <div className="flex flex-col h-full p-6 gap-4">
      <h2 className="text-lg font-semibold">URL Encoder / Decoder</h2>

      <div className="grid grid-cols-2 gap-4 flex-1 min-h-0">
        <div className="flex flex-col gap-2">
          <label className="text-sm text-muted-foreground">Entrée</label>
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="https://exemple.com?q=café & croissant"
            className="flex-1 font-mono text-sm resize-none"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-sm text-muted-foreground">Résultat</label>
          <Textarea
            value={output}
            readOnly
            className="flex-1 font-mono text-sm resize-none bg-muted/30"
          />
        </div>
      </div>

      {error && <p className="text-sm text-destructive">Erreur : {error}</p>}

      <div className="flex gap-2">
        <Button onClick={encode}>Encoder</Button>
        <Button variant="secondary" onClick={decode}>Décoder</Button>
      </div>
    </div>
  );
}