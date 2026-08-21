import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

// Les méthodes HTTP courantes proposées dans le sélecteur
const METHODS = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'];

export default function ApiTester() {
  const [method, setMethod] = useState('GET');
  const [url, setUrl] = useState('https://jsonplaceholder.typicode.com/posts/1');
  // Headers saisis en texte brut, un par ligne, format "Clé: Valeur" (plus simple à taper qu'un tableau dynamique)
  const [headersText, setHeadersText] = useState('Content-Type: application/json');
  const [body, setBody] = useState('');
  // Résultat de la dernière requête (succès ou échec), null tant qu'aucune requête n'a été envoyée
  const [result, setResult] = useState<Awaited<ReturnType<typeof window.api.httpRequest>> | null>(null);
  const [loading, setLoading] = useState(false);

  // Convertit le texte "Clé: Valeur" multi-lignes en objet { Clé: Valeur } attendu par fetch
  const parseHeaders = (): Record<string, string> => {
    const headers: Record<string, string> = {};
    headersText.split('\n').forEach((line) => {
      const [key, ...rest] = line.split(':');
      if (key && rest.length) {
        headers[key.trim()] = rest.join(':').trim();
      }
    });
    return headers;
  };

  // Envoie la requête via IPC vers le main process (voir main.ts pour la logique réelle de fetch)
  const send = async () => {
    setLoading(true);
    setResult(null);
    const response = await window.api.httpRequest({
      url,
      method,
      headers: parseHeaders(),
      body,
    });
    setResult(response);
    setLoading(false);
  };

  return (
    <div className="flex flex-col h-full p-6 gap-4">
      <h2 className="text-lg font-semibold">API Tester</h2>

      {/* Ligne méthode + URL + bouton envoyer */}
      <div className="flex gap-2">
        {/* select natif HTML : simple et suffisant, pas besoin du composant Select shadcn ici */}
        <select
          value={method}
          onChange={(e) => setMethod(e.target.value)}
          className="border rounded-md px-3 text-sm bg-background"
        >
          {METHODS.map((m) => (
            <option key={m} value={m}>{m}</option>
          ))}
        </select>
        <Input value={url} onChange={(e) => setUrl(e.target.value)} className="flex-1 font-mono text-sm" />
        <Button onClick={send} disabled={loading}>
          {loading ? 'Envoi...' : 'Envoyer'}
        </Button>
      </div>

      {/* Headers et body côte à côte */}
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1">
          <label className="text-sm text-muted-foreground">Headers (un par ligne : Clé: Valeur)</label>
          <Textarea
            value={headersText}
            onChange={(e) => setHeadersText(e.target.value)}
            className="font-mono text-xs h-24 resize-none"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-sm text-muted-foreground">Body (JSON ou texte brut)</label>
          <Textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            className="font-mono text-xs h-24 resize-none"
            disabled={method === 'GET' || method === 'HEAD'}
          />
        </div>
      </div>

      {/* Résultat de la requête */}
      {result && (
        <div className="flex-1 overflow-auto border rounded-md p-3 font-mono text-xs bg-muted/30">
          {result.ok ? (
            <>
              {/* Couleur verte si statut 2xx, orange/rouge sinon */}
              <p className={result.status < 300 ? 'text-green-600 font-semibold' : 'text-destructive font-semibold'}>
                {result.status} {result.statusText} — {result.timeMs}ms
              </p>
              <pre className="whitespace-pre-wrap mt-2">{result.body}</pre>
            </>
          ) : (
            <p className="text-destructive">Erreur réseau : {result.error} ({result.timeMs}ms)</p>
          )}
        </div>
      )}
    </div>
  );
}