import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

export default function JsonFormatter() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState<string | null>(null);

  const format = () => {
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
    try {
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed));
      setError(null);
    } catch (e) {
      setError((e as Error).message);
      setOutput('');
    }
  };

  return (
    <div className="flex flex-col h-full p-6 gap-4">
      <h2 className="text-lg font-semibold">JSON Formatter</h2>

      <div className="grid grid-cols-2 gap-4 flex-1 min-h-0">
        <div className="flex flex-col gap-2">
          <label className="text-sm text-muted-foreground">Entrée</label>
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder='{"exemple": "colle ton JSON ici"}'
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
        <Button onClick={format}>Formater</Button>
        <Button variant="secondary" onClick={minify}>Minifier</Button>
      </div>
    </div>
  );
}