import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  FileText,
  RefreshCw,
  Sparkles,
} from 'lucide-react';

// Banque de mots latins classiques utilisée pour générer du faux texte.
const WORDS = [
  'lorem',
  'ipsum',
  'dolor',
  'sit',
  'amet',
  'consectetur',
  'adipiscing',
  'elit',
  'sed',
  'do',
  'eiusmod',
  'tempor',
  'incididunt',
  'ut',
  'labore',
  'et',
  'dolore',
  'magna',
  'aliqua',
  'enim',
  'ad',
  'minim',
  'veniam',
  'quis',
  'nostrud',
  'exercitation',
  'ullamco',
  'laboris',
  'nisi',
  'aliquip',
  'ex',
  'ea',
  'commodo',
  'consequat',
  'duis',
  'aute',
  'irure',
  'in',
  'reprehenderit',
  'voluptate',
  'velit',
  'esse',
  'cillum',
  'eu',
  'fugiat',
  'nulla',
  'pariatur',
];

function randomWord(): string {
  return WORDS[Math.floor(Math.random() * WORDS.length)];
}

function generateSentence(): string {
  const wordCount = 6 + Math.floor(Math.random() * 10);

  const words = Array.from(
    { length: wordCount },
    randomWord
  );

  const sentence = words.join(' ');

  return (
    sentence.charAt(0).toUpperCase() +
    sentence.slice(1) +
    '.'
  );
}

function generateParagraph(): string {
  const sentenceCount = 4 + Math.floor(Math.random() * 4);

  return Array.from(
    { length: sentenceCount },
    generateSentence
  ).join(' ');
}

export default function LoremGenerator() {
  const [count, setCount] = useState(3);
  const [output, setOutput] = useState('');

  const generate = () => {
    const safeCount = Math.min(20, Math.max(1, count));

    const paragraphs = Array.from(
      { length: safeCount },
      generateParagraph
    );

    setOutput(paragraphs.join('\n\n'));
  };

  return (
    <div className="flex h-full flex-col gap-6 p-6 xl:p-8">
      {/* =========================================================
          HEADER
      ========================================================= */}
      <div className="flex items-start gap-4">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-teal-500/15 bg-teal-500/10 text-teal-500">
          <FileText className="h-5 w-5" />
        </div>

        <div>
          <h2 className="text-lg font-semibold tracking-tight">
            Lorem Ipsum Generator
          </h2>

          <p className="mt-1 text-xs leading-5 text-muted-foreground">
            Générez rapidement du texte fictif pour vos interfaces,
            maquettes et prototypes.
          </p>
        </div>
      </div>

      {/* =========================================================
          CONFIGURATION
      ========================================================= */}
      <section className="rounded-xl border border-border bg-card p-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-teal-500" />

              <h3 className="text-xs font-semibold">
                Configuration
              </h3>
            </div>

            <p className="mt-1 text-[11px] text-muted-foreground">
              Choisissez le nombre de paragraphes à générer.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2">
              <Input
                type="number"
                min={1}
                max={20}
                value={count}
                onChange={(e) =>
                  setCount(
                    Math.min(
                      20,
                      Math.max(1, Number(e.target.value))
                    )
                  )
                }
                className="h-9 w-20 font-mono text-sm"
              />

              <span className="whitespace-nowrap text-xs text-muted-foreground">
                paragraphe(s)
              </span>
            </div>

            <Button
              onClick={generate}
              className="h-9 gap-2"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              Générer
            </Button>
          </div>
        </div>
      </section>

      {/* =========================================================
          SORTIE
      ========================================================= */}
      <section className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl border border-border bg-card">
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <div>
            <h3 className="text-xs font-semibold">
              Texte généré
            </h3>

            <p className="mt-1 text-[10px] text-muted-foreground">
              Votre contenu fictif apparaîtra ici.
            </p>
          </div>

          {output && (
            <span className="rounded-full border border-teal-500/15 bg-teal-500/10 px-2.5 py-1 text-[10px] font-medium text-teal-600">
              Généré
            </span>
          )}
        </div>

        <Textarea
          value={output}
          readOnly
          placeholder="Le texte généré apparaîtra ici..."
          className="min-h-0 flex-1 resize-none rounded-none border-0 bg-muted/10 p-5 font-mono text-xs leading-6 focus-visible:ring-0"
        />
      </section>

      {/* =========================================================
          FOOTER INFO
      ========================================================= */}
      <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
        <span className="h-1.5 w-1.5 rounded-full bg-teal-500" />
        Génération locale · Aucun contenu envoyé à un serveur
      </div>
    </div>
  );
}