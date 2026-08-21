// useEffect : recalcule les hashes à chaque frappe (async car l'API crypto est asynchrone)
import { useEffect, useState } from 'react';
import { Textarea } from '@/components/ui/textarea';

// Liste des algorithmes de hash supportés nativement par l'API Web Crypto d'Electron (pas de dépendance externe)
const ALGORITHMS = ['SHA-1', 'SHA-256', 'SHA-384', 'SHA-512'] as const;

// Calcule le hash d'un texte avec un algorithme donné, en utilisant l'API Web Crypto native (window.crypto.subtle)
async function computeHash(text: string, algorithm: string): Promise<string> {
  // Convertit le texte en bytes UTF-8 (requis par l'API crypto, qui travaille sur des buffers binaires, pas du texte)
  const data = new TextEncoder().encode(text);
  // Calcule le hash de façon asynchrone (opération native, potentiellement coûteuse sur de gros textes)
  const hashBuffer = await window.crypto.subtle.digest(algorithm, data);
  // Convertit le résultat binaire (ArrayBuffer) en tableau d'octets
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  // Convertit chaque octet en sa représentation hexadécimale à 2 chiffres, puis assemble la chaîne finale
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

export default function HashGenerator() {
  // Le texte source dont on veut calculer les hashes
  const [input, setInput] = useState('');
  // Stocke le résultat de chaque algorithme : { 'SHA-256': 'abc123...', ... }
  const [hashes, setHashes] = useState<Record<string, string>>({});

  // Recalcule tous les hashes à chaque changement du texte d'entrée
  useEffect(() => {
    // Si le champ est vide, on vide aussi les résultats plutôt que de garder les anciens hashes affichés
    if (!input) {
      setHashes({});
      return;
    }

    // Calcule tous les hashes en parallèle (Promise.all) plutôt que séquentiellement, pour la rapidité
    Promise.all(ALGORITHMS.map((algo) => computeHash(input, algo))).then((results) => {
      // Reconstruit un objet { algorithme: résultat } à partir des deux tableaux parallèles
      const next: Record<string, string> = {};
      ALGORITHMS.forEach((algo, i) => {
        next[algo] = results[i];
      });
      setHashes(next);
    });
  }, [input]);

  return (
    <div className="flex flex-col h-full p-6 gap-4">
      <h2 className="text-lg font-semibold">Hash Generator</h2>

      <Textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Texte à hasher..."
        className="font-mono text-sm resize-none h-32"
      />

      {/* Affiche un bloc par algorithme, uniquement si un résultat existe */}
      <div className="flex flex-col gap-2">
        {ALGORITHMS.map((algo) => (
          <div key={algo} className="flex flex-col gap-1">
            <span className="text-xs text-muted-foreground font-medium">{algo}</span>
            <div className="font-mono text-sm bg-muted/30 rounded-md p-2 break-all">
              {hashes[algo] || '—'}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}