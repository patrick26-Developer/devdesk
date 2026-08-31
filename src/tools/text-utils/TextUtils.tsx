import { useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import ToolShell from '@/components/tool/ToolShell';
import { Panel, PanelHeader } from '@/components/tool/Panel';
import CopyButton from '@/components/CopyButton';
import { usePersistentState } from '@/hooks/usePersistentState';
import { getTool } from '@/tools';

type Op =
  | 'sort-asc'
  | 'sort-desc'
  | 'dedupe'
  | 'reverse'
  | 'trim'
  | 'remove-empty'
  | 'lower'
  | 'upper'
  | 'shuffle';

const OPS: { key: Op; label: string }[] = [
  { key: 'sort-asc', label: 'Trier A→Z' },
  { key: 'sort-desc', label: 'Trier Z→A' },
  { key: 'dedupe', label: 'Dédupliquer' },
  { key: 'reverse', label: 'Inverser l’ordre' },
  { key: 'trim', label: 'Trim par ligne' },
  { key: 'remove-empty', label: 'Retirer lignes vides' },
  { key: 'lower', label: 'minuscules' },
  { key: 'upper', label: 'MAJUSCULES' },
  { key: 'shuffle', label: 'Mélanger' },
];

function apply(op: Op, lines: string[]): string[] {
  switch (op) {
    case 'sort-asc':
      return [...lines].sort((a, b) => a.localeCompare(b));
    case 'sort-desc':
      return [...lines].sort((a, b) => b.localeCompare(a));
    case 'dedupe':
      return [...new Set(lines)];
    case 'reverse':
      return [...lines].reverse();
    case 'trim':
      return lines.map((l) => l.trim());
    case 'remove-empty':
      return lines.filter((l) => l.trim() !== '');
    case 'lower':
      return lines.map((l) => l.toLowerCase());
    case 'upper':
      return lines.map((l) => l.toUpperCase());
    case 'shuffle': {
      const a = [...lines];
      for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
      }
      return a;
    }
  }
}

export default function TextUtils() {
  const tool = getTool('text-utils')!;
  const [text, setText] = usePersistentState('text-utils:text', '');

  const stats = useMemo(() => {
    const lines = text ? text.split('\n') : [];
    return {
      lines: lines.length,
      words: text.trim() ? text.trim().split(/\s+/).length : 0,
      chars: text.length,
      bytes: new TextEncoder().encode(text).length,
    };
  }, [text]);

  const run = (op: Op) => setText(apply(op, text.split('\n')).join('\n'));

  return (
    <ToolShell tool={tool}>
      <div className="flex flex-wrap gap-2">
        {OPS.map(({ key, label }) => (
          <Button key={key} variant="secondary" size="sm" onClick={() => run(key)} disabled={!text}>
            {label}
          </Button>
        ))}
      </div>

      <Panel className="min-h-0 flex-1">
        <PanelHeader title="Texte" subtitle="Les opérations s'appliquent en place" right={<CopyButton value={text} />} />
        <Textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Une valeur par ligne..."
          className="min-h-0 flex-1 resize-none rounded-none border-0 bg-transparent p-4 font-mono text-sm leading-6 shadow-none focus-visible:ring-0"
        />
        <div className="flex flex-wrap items-center gap-4 border-t border-border bg-muted/10 px-4 py-2 text-[11px] text-muted-foreground tabular-nums">
          <span>{stats.lines} lignes</span>
          <span>{stats.words} mots</span>
          <span>{stats.chars} caractères</span>
          <span>{stats.bytes} octets</span>
        </div>
      </Panel>
    </ToolShell>
  );
}
