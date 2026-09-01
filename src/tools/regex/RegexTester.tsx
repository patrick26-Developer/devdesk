import { useMemo } from 'react';
import { usePersistentState } from '@/hooks/usePersistentState';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import ToolShell from '@/components/tool/ToolShell';
import { Panel, PanelHeader } from '@/components/tool/Panel';
import { getTool } from '@/tools';
import { useT } from '@/i18n';
import { SearchCheck } from 'lucide-react';

export default function RegexTester() {
  const tool = getTool('regex')!;
  const t = useT();
  const [pattern, setPattern] = usePersistentState('regex:pattern', '');
  const [flags, setFlags] = usePersistentState('regex:flags', 'g');
  const [text, setText] = usePersistentState('regex:text', '');

  const result = useMemo(() => {
    if (!pattern) return { matches: [] as RegExpMatchArray[], error: null as string | null };

    try {
      const regex = new RegExp(pattern, flags);
      const matches = flags.includes('g')
        ? Array.from(text.matchAll(regex))
        : text.match(regex)
          ? [text.match(regex)!]
          : [];
      return { matches, error: null };
    } catch (e) {
      return { matches: [], error: (e as Error).message };
    }
  }, [pattern, flags, text]);

  const highlightedSegments = useMemo(() => {
    if (result.matches.length === 0 || !text) return [{ text, isMatch: false }];

    const segments: { text: string; isMatch: boolean }[] = [];
    let lastIndex = 0;

    for (const match of result.matches) {
      const index = match.index ?? 0;
      if (index > lastIndex) segments.push({ text: text.slice(lastIndex, index), isMatch: false });
      segments.push({ text: match[0], isMatch: true });
      lastIndex = index + match[0].length;
    }

    if (lastIndex < text.length) segments.push({ text: text.slice(lastIndex), isMatch: false });
    return segments;
  }, [result.matches, text]);

  return (
    <ToolShell tool={tool}>
      <Panel>
        <div className="p-4">
          <label className="mb-2 block text-xs font-medium">{t('ui.regex.pattern')}</label>
          <div className="flex items-center gap-2 font-mono">
            <span className="text-muted-foreground">/</span>
            <Input
              value={pattern}
              onChange={(e) => setPattern(e.target.value)}
              placeholder={t('ui.regex.patternPlaceholder')}
              className="font-mono"
            />
            <span className="text-muted-foreground">/</span>
            <Input
              value={flags}
              onChange={(e) => setFlags(e.target.value)}
              placeholder="gim"
              className="w-20 font-mono"
              aria-label={t('ui.regex.flagsLabel')}
            />
          </div>
        </div>
      </Panel>

      {result.error && (
        <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-3 text-xs text-destructive">
          {t('common.error')} : {result.error}
        </div>
      )}

      <div className="flex min-h-0 flex-1 flex-col gap-2">
        <label className="text-xs font-medium">{t('ui.regex.testText')}</label>
        <Textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={t('ui.regex.testPlaceholder')}
          className="min-h-32 flex-1 resize-none font-mono text-sm"
        />
      </div>

      <Panel>
        <PanelHeader>
          <div className="flex items-center gap-2">
            <SearchCheck className="h-4 w-4 text-amber-500" />
            <span className="text-xs font-semibold">{t('ui.regex.matches')}</span>
          </div>
          <span className="text-xs text-muted-foreground tabular-nums">
            {t(result.matches.length === 1 ? 'ui.regex.resultCount' : 'ui.regex.resultCountPlural', { n: result.matches.length })}
          </span>
        </PanelHeader>
        <div className="min-h-24 whitespace-pre-wrap bg-muted/20 p-4 font-mono text-sm">
          {highlightedSegments.map((seg, i) =>
            seg.isMatch ? (
              <mark
                key={i}
                className="rounded bg-amber-500/25 px-0.5 text-amber-700 dark:bg-amber-400/25 dark:text-amber-200"
              >
                {seg.text}
              </mark>
            ) : (
              <span key={i}>{seg.text}</span>
            )
          )}
        </div>
      </Panel>
    </ToolShell>
  );
}
