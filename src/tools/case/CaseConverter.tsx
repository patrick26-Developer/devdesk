import { useMemo } from 'react';
import { Textarea } from '@/components/ui/textarea';
import ToolShell from '@/components/tool/ToolShell';
import { Panel, PanelHeader } from '@/components/tool/Panel';
import EmptyState from '@/components/tool/EmptyState';
import CopyButton from '@/components/CopyButton';
import { usePersistentState } from '@/hooks/usePersistentState';
import { getTool } from '@/tools';
import { Type } from 'lucide-react';

// Découpe une chaîne en mots, quelle que soit sa casse d'origine
// (espaces, tirets, underscores, camelCase, PascalCase, séquences de majuscules).
function toWords(input: string): string[] {
  return (
    input
      .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
      .replace(/([A-Z]+)([A-Z][a-z])/g, '$1 $2')
      .split(/[\s_\-./]+/)
      .map((w) => w.trim())
      .filter(Boolean)
  );
}

const CONVERTERS: { key: string; label: string; hint: string; fn: (words: string[]) => string }[] = [
  { key: 'camel', label: 'camelCase', hint: 'variables JS', fn: (w) => w.map((x, i) => (i === 0 ? x.toLowerCase() : cap(x))).join('') },
  { key: 'pascal', label: 'PascalCase', hint: 'classes, composants', fn: (w) => w.map(cap).join('') },
  { key: 'snake', label: 'snake_case', hint: 'Python, SQL', fn: (w) => w.map((x) => x.toLowerCase()).join('_') },
  { key: 'kebab', label: 'kebab-case', hint: 'URLs, CSS', fn: (w) => w.map((x) => x.toLowerCase()).join('-') },
  { key: 'constant', label: 'CONSTANT_CASE', hint: 'constantes, env', fn: (w) => w.map((x) => x.toUpperCase()).join('_') },
  { key: 'title', label: 'Title Case', hint: 'titres', fn: (w) => w.map(cap).join(' ') },
  { key: 'sentence', label: 'Sentence case', hint: 'phrases', fn: (w) => {
    const s = w.map((x) => x.toLowerCase()).join(' ');
    return s.charAt(0).toUpperCase() + s.slice(1);
  } },
  { key: 'lower', label: 'lower case', hint: '', fn: (w) => w.join(' ').toLowerCase() },
  { key: 'upper', label: 'UPPER CASE', hint: '', fn: (w) => w.join(' ').toUpperCase() },
];

function cap(word: string): string {
  return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
}

export default function CaseConverter() {
  const tool = getTool('case')!;
  const [input, setInput] = usePersistentState('case:input', '');

  const words = useMemo(() => toWords(input), [input]);

  return (
    <ToolShell tool={tool}>
      <div className="flex flex-col gap-2">
        <label className="text-xs font-medium">Texte source</label>
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="mon identifiant à convertir"
          className="min-h-[90px] resize-none font-mono text-sm"
        />
      </div>

      {words.length === 0 ? (
        <Panel className="min-h-0 flex-1 border-dashed bg-muted/10">
          <EmptyState
            icon={Type}
            title="Aucun texte à convertir"
            description="Saisissez un identifiant ou une phrase pour obtenir toutes les casses courantes."
          />
        </Panel>
      ) : (
        <div className="grid min-h-0 flex-1 grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {CONVERTERS.map(({ key, label, hint, fn }) => {
            const value = fn(words);
            return (
              <Panel key={key}>
                <PanelHeader
                  title={label}
                  subtitle={hint || undefined}
                  right={<CopyButton value={value} />}
                />
                <div className="p-4">
                  <code className="block break-all font-mono text-sm text-foreground">{value}</code>
                </div>
              </Panel>
            );
          })}
        </div>
      )}
    </ToolShell>
  );
}
