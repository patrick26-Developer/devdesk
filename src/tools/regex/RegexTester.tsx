// useState : gère l'état local du composant (pattern regex, texte testé, flags, résultat)
// useMemo : recalcule le résultat uniquement quand une dépendance change (évite de re-tester à chaque frappe inutilement)
import { useMemo, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

export default function RegexTester() {
  // Le pattern regex tapé par l'utilisateur, sans les délimiteurs / /
  const [pattern, setPattern] = useState('');
  // Les flags regex (g, i, m...) tapés par l'utilisateur
  const [flags, setFlags] = useState('g');
  // Le texte dans lequel on cherche des correspondances
  const [text, setText] = useState('');

  // useMemo recalcule "result" uniquement quand pattern, flags ou text changent.
  // On regroupe ici la logique de matching ET la gestion d'erreur (regex invalide).
  const result = useMemo(() => {
    // Si le pattern est vide, inutile de tester quoi que ce soit
    if (!pattern) return { matches: [], error: null };

    try {
      // Construit dynamiquement l'objet RegExp à partir du pattern et des flags saisis
      const regex = new RegExp(pattern, flags);
      // matchAll renvoie un itérateur de tous les matches (nécessite le flag 'g' pour fonctionner)
      // Array.from le convertit en tableau exploitable par React
      const matches = flags.includes('g')
        ? Array.from(text.matchAll(regex))
        : // Sans le flag global, on ne peut avoir qu'un seul match ; on le met quand même dans un tableau
          (text.match(regex) ? [text.match(regex)!] : []);
      return { matches, error: null };
    } catch (e) {
      // Si le pattern est syntaxiquement invalide (ex: parenthèse non fermée), on capture l'erreur au lieu de crasher
      return { matches: [], error: (e as Error).message };
    }
  }, [pattern, flags, text]);

  // Fonction qui découpe le texte en segments pour surligner les parties matchées.
  // On construit un tableau de morceaux : { text, isMatch } dans l'ordre du texte original.
  const highlightedSegments = useMemo(() => {
    if (result.matches.length === 0 || !text) return [{ text, isMatch: false }];

    const segments: { text: string; isMatch: boolean }[] = [];
    let lastIndex = 0;

    // Parcourt chaque match trouvé pour découper le texte autour
    for (const match of result.matches) {
      const index = match.index ?? 0;
      // Ajoute le texte non-matché avant ce match (s'il y en a)
      if (index > lastIndex) {
        segments.push({ text: text.slice(lastIndex, index), isMatch: false });
      }
      // Ajoute le match lui-même, marqué pour être surligné
      segments.push({ text: match[0], isMatch: true });
      lastIndex = index + match[0].length;
    }
    // Ajoute le reste du texte après le dernier match
    if (lastIndex < text.length) {
      segments.push({ text: text.slice(lastIndex), isMatch: false });
    }

    return segments;
  }, [result.matches, text]);

  return (
    <div className="flex flex-col h-full p-6 gap-4">
      <h2 className="text-lg font-semibold">Regex Tester</h2>

      {/* Ligne pattern + flags côte à côte */}
      <div className="flex gap-2 items-center font-mono">
        <span className="text-muted-foreground">/</span>
        <Input
          value={pattern}
          onChange={(e) => setPattern(e.target.value)}
          placeholder="votre pattern regex"
          className="font-mono"
        />
        <span className="text-muted-foreground">/</span>
        <Input
          value={flags}
          onChange={(e) => setFlags(e.target.value)}
          placeholder="flags"
          className="w-20 font-mono"
        />
      </div>

      {/* Affiche l'erreur de syntaxe regex si le pattern est invalide */}
      {result.error && (
        <p className="text-sm text-destructive">Erreur : {result.error}</p>
      )}

      {/* Zone de texte à tester */}
      <Textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Colle ton texte à tester ici..."
        className="flex-1 font-mono text-sm resize-none"
      />

      {/* Aperçu avec surlignage des parties matchées */}
      <div className="border rounded-md p-3 text-sm font-mono whitespace-pre-wrap min-h-24 bg-muted/30">
        {highlightedSegments.map((seg, i) =>
          seg.isMatch ? (
            // Segment matché : fond jaune pour le mettre en évidence
            <mark key={i} className="bg-yellow-300/60 rounded-sm">
              {seg.text}
            </mark>
          ) : (
            // Segment normal : affiché tel quel
            <span key={i}>{seg.text}</span>
          )
        )}
      </div>

      {/* Compteur de résultats */}
      <p className="text-sm text-muted-foreground">
        {result.matches.length} correspondance(s) trouvée(s)
      </p>
    </div>
  );
}