import { useMemo } from 'react';
import { Textarea } from '@/components/ui/textarea';
import ToolShell from '@/components/tool/ToolShell';
import { Panel, PanelHeader } from '@/components/tool/Panel';
import EmptyState from '@/components/tool/EmptyState';
import CopyButton from '@/components/CopyButton';
import { usePersistentState } from '@/hooks/usePersistentState';
import { getTool } from '@/tools';
import { useT } from '@/i18n';
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

const CONVERTERS: { key: string; label: string; hintKey?: string; fn: (words: string[]) => string }[] = [
  { key: 'camel', label: 'camelCase', hintKey: 'ui.case.hint.camel', fn: (w) => w.map((x, i) => (i === 0 ? x.toLowerCase() : cap(x))).join('') },
  { key: 'pascal', label: 'PascalCase', hintKey: 'ui.case.hint.pascal', fn: (w) => w.map(cap).join('') },
  { key: 'snake', label: 'snake_case', hintKey: 'ui.case.hint.snake', fn: (w) => w.map((x) => x.toLowerCase()).join('_') },
  { key: 'kebab', label: 'kebab-case', hintKey: 'ui.case.hint.kebab', fn: (w) => w.map((x) => x.toLowerCase()).join('-') },
  { key: 'constant', label: 'CONSTANT_CASE', hintKey: 'ui.case.hint.constant', fn: (w) => w.map((x) => x.toUpperCase()).join('_') },
  { key: 'title', label: 'Title Case', hintKey: 'ui.case.hint.title', fn: (w) => w.map(cap).join(' ') },
  { key: 'sentence', label: 'Sentence case', hintKey: 'ui.case.hint.sentence', fn: (w) => {
    const s = w.map((x) => x.toLowerCase()).join(' ');
    return s.charAt(0).toUpperCase() + s.slice(1);
  } },
  { key: 'lower', label: 'lower case', fn: (w) => w.join(' ').toLowerCase() },
  { key: 'upper', label: 'UPPER CASE', fn: (w) => w.join(' ').toUpperCase() },
];

function cap(word: string): string {
  return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
}

export default function CaseConverter() {
  const tool = getTool('case')!;
  const t = useT();
  const [input, setInput] = usePersistentState('case:input', '');

  const words = useMemo(() => toWords(input), [input]);

  return (
    <ToolShell tool={tool}>
      <div className="flex flex-col gap-2">
        <label className="text-xs font-medium">{t('ui.case.sourceLabel')}</label>
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={t('ui.case.placeholder')}
          className="min-h-[90px] resize-none font-mono text-sm"
        />
      </div>

      {words.length === 0 ? (
        <Panel className="min-h-0 flex-1 border-dashed bg-muted/10">
          <EmptyState
            icon={Type}
            title={t('ui.case.emptyTitle')}
            description={t('ui.case.emptyDesc')}
          />
        </Panel>
      ) : (
        <div className="grid min-h-0 flex-1 grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {CONVERTERS.map(({ key, label, hintKey, fn }) => {
            const value = fn(words);
            return (
              <Panel key={key}>
                <PanelHeader
                  title={label}
                  subtitle={hintKey ? t(hintKey) : undefined}
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
