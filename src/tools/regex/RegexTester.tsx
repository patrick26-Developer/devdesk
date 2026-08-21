import { useMemo, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Regex, SearchCheck } from 'lucide-react';

export default function RegexTester() {
  const [pattern, setPattern] = useState('');
  const [flags, setFlags] = useState('g');
  const [text, setText] = useState('');

  const result = useMemo(() => {
    if (!pattern) {
      return { matches: [], error: null };
    }

    try {
      const regex = new RegExp(pattern, flags);

      const matches = flags.includes('g')
        ? Array.from(text.matchAll(regex))
        : text.match(regex)
          ? [text.match(regex)!]
          : [];

      return {
        matches,
        error: null,
      };
    } catch (e) {
      return {
        matches: [],
        error: (e as Error).message,
      };
    }
  }, [pattern, flags, text]);

  const highlightedSegments = useMemo(() => {
    if (result.matches.length === 0 || !text) {
      return [{ text, isMatch: false }];
    }

    const segments: {
      text: string;
      isMatch: boolean;
    }[] = [];

    let lastIndex = 0;

    for (const match of result.matches) {
      const index = match.index ?? 0;

      if (index > lastIndex) {
        segments.push({
          text: text.slice(lastIndex, index),
          isMatch: false,
        });
      }

      segments.push({
        text: match[0],
        isMatch: true,
      });

      lastIndex = index + match[0].length;
    }

    if (lastIndex < text.length) {
      segments.push({
        text: text.slice(lastIndex),
        isMatch: false,
      });
    }

    return segments;
  }, [result.matches, text]);

  return (
    <div className="flex h-full flex-col gap-6 p-6">
      {/* Header */}
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-pink-500/15 bg-pink-500/10 text-pink-500">
          <Regex className="h-5 w-5" />
        </div>

        <div>
          <h2 className="text-lg font-semibold">
            Regex Tester
          </h2>

          <p className="mt-1 text-xs text-muted-foreground">
            Teste et visualise tes expressions régulières en temps réel.
          </p>
        </div>
      </div>

      {/* Pattern */}
      <section className="rounded-xl border border-border bg-card p-4">
        <label className="mb-2 block text-xs font-medium">
          Expression régulière
        </label>

        <div className="flex items-center gap-2 font-mono">
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
            placeholder="gim"
            className="w-20 font-mono"
          />
        </div>
      </section>

      {result.error && (
        <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-3 text-xs text-destructive">
          Erreur : {result.error}
        </div>
      )}

      {/* Text */}
      <section className="flex min-h-0 flex-1 flex-col gap-2">
        <label className="text-xs font-medium">
          Texte à tester
        </label>

        <Textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Colle ton texte à tester ici..."
          className="min-h-32 flex-1 resize-none font-mono text-sm"
        />
      </section>

      {/* Result */}
      <section className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <div className="flex items-center gap-2">
            <SearchCheck className="h-4 w-4 text-pink-500" />
            <span className="text-xs font-semibold">
              Correspondances
            </span>
          </div>

          <span className="text-xs text-muted-foreground">
            {result.matches.length} résultat
            {result.matches.length !== 1 ? 's' : ''}
          </span>
        </div>

        <div className="min-h-24 bg-muted/20 p-4 font-mono text-sm whitespace-pre-wrap">
          {highlightedSegments.map((seg, i) =>
            seg.isMatch ? (
              <mark
                key={i}
                className="rounded bg-pink-500/20 px-0.5 text-pink-600 dark:text-pink-300"
              >
                {seg.text}
              </mark>
            ) : (
              <span key={i}>{seg.text}</span>
            )
          )}
        </div>
      </section>
    </div>
  );
}