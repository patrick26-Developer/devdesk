import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

export default function Base64Tool() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState<string | null>(null);

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
    } catch (e) {
      setError('Chaîne Base64 invalide');
      setOutput('');
    }
  };

  return (
    <div className="flex flex-col h-full p-6 gap-4">
      <h2 className="text-lg font-semibold">Base64 Encoder / Decoder</h2>

      <div className="grid grid-cols-2 gap-4 flex-1 min-h-0">
        <div className="flex flex-col gap-2">
          <label className="text-sm text-muted-foreground">Entrée</label>
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Texte ou chaîne Base64..."
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

      {error && (
        <p className="text-sm text-destructive">Erreur : {error}</p>
      )}

      <div className="flex gap-2">
        <Button onClick={encode}>Encoder</Button>
        <Button variant="secondary" onClick={decode}>Décoder</Button>
      </div>
    </div>
  );
}