import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

// Banque de mots latins classiques utilisée pour générer du faux texte de remplissage
const WORDS = [
  'lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit',
  'sed', 'do', 'eiusmod', 'tempor', 'incididunt', 'ut', 'labore', 'et', 'dolore',
  'magna', 'aliqua', 'enim', 'ad', 'minim', 'veniam', 'quis', 'nostrud',
  'exercitation', 'ullamco', 'laboris', 'nisi', 'aliquip', 'ex', 'ea', 'commodo',
  'consequat', 'duis', 'aute', 'irure', 'in', 'reprehenderit', 'voluptate',
  'velit', 'esse', 'cillum', 'eu', 'fugiat', 'nulla', 'pariatur',
];

// Pioche un mot au hasard dans la banque de mots
function randomWord(): string {
  return WORDS[Math.floor(Math.random() * WORDS.length)];
}

// Génère une phrase : un nombre aléatoire de mots (entre min et max), première lettre en majuscule, point final
function generateSentence(): string {
  const wordCount = 6 + Math.floor(Math.random() * 10); // entre 6 et 15 mots
  const words = Array.from({ length: wordCount }, randomWord);
  const sentence = words.join(' ');
  // Met en majuscule la première lettre et ajoute un point final
  return sentence.charAt(0).toUpperCase() + sentence.slice(1) + '.';
}

// Génère un paragraphe : plusieurs phrases assemblées
function generateParagraph(): string {
  const sentenceCount = 4 + Math.floor(Math.random() * 4); // entre 4 et 7 phrases
  return Array.from({ length: sentenceCount }, generateSentence).join(' ');
}

export default function LoremGenerator() {
  // Nombre de paragraphes à générer, saisi par l'utilisateur
  const [count, setCount] = useState(3);
  // Le texte généré, prêt à être copié
  const [output, setOutput] = useState('');

  // Génère "count" paragraphes et les assemble avec une ligne vide entre chaque
  const generate = () => {
    const paragraphs = Array.from({ length: count }, generateParagraph);
    setOutput(paragraphs.join('\n\n'));
  };

  return (
    <div className="flex flex-col h-full p-6 gap-4">
      <h2 className="text-lg font-semibold">Lorem Ipsum Generator</h2>

      {/* Contrôle du nombre de paragraphes + bouton de génération */}
      <div className="flex gap-2 items-center">
        <Input
          type="number"
          min={1}
          max={20}
          value={count}
          onChange={(e) => setCount(Math.max(1, Number(e.target.value)))}
          className="w-24"
        />
        <span className="text-sm text-muted-foreground">paragraphe(s)</span>
        <Button onClick={generate}>Générer</Button>
      </div>

      <Textarea
        value={output}
        readOnly
        className="flex-1 font-mono text-sm resize-none bg-muted/30"
        placeholder="Le texte généré apparaîtra ici..."
      />
    </div>
  );
}