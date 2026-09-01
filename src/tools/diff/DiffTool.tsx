import { useMemo } from 'react';
import { Textarea } from '@/components/ui/textarea';
import ToolShell from '@/components/tool/ToolShell';
import { Panel, PanelHeader } from '@/components/tool/Panel';
import { usePersistentState } from '@/hooks/usePersistentState';
import { getTool } from '@/tools';
import { useT } from '@/i18n';

type Row =
  | { type: 'equal'; left: number; right: number; text: string }
  | { type: 'del'; left: number; text: string }
  | { type: 'add'; right: number; text: string };

// Diff ligne à ligne via plus longue sous-séquence commune (programmation dynamique).
function diffLines(a: string[], b: string[]): Row[] {
  const n = a.length;
  const m = b.length;
  const lcs: number[][] = Array.from({ length: n + 1 }, () => new Array(m + 1).fill(0));

  for (let i = n - 1; i >= 0; i--) {
    for (let j = m - 1; j >= 0; j--) {
      lcs[i][j] = a[i] === b[j] ? lcs[i + 1][j + 1] + 1 : Math.max(lcs[i + 1][j], lcs[i][j + 1]);
    }
  }

  const rows: Row[] = [];
  let i = 0;
  let j = 0;
  while (i < n && j < m) {
    if (a[i] === b[j]) {
      rows.push({ type: 'equal', left: i + 1, right: j + 1, text: a[i] });
      i++;
      j++;
    } else if (lcs[i + 1][j] >= lcs[i][j + 1]) {
      rows.push({ type: 'del', left: i + 1, text: a[i] });
      i++;
    } else {
      rows.push({ type: 'add', right: j + 1, text: b[j] });
      j++;
    }
  }
  while (i < n) rows.push({ type: 'del', left: i + 1, text: a[i++] });
  while (j < m) rows.push({ type: 'add', right: j + 1, text: b[j++] });
  return rows;
}

export default function DiffTool() {
  const tool = getTool('diff')!;
  const t = useT();
  const [left, setLeft] = usePersistentState('diff:left', '');
  const [right, setRight] = usePersistentState('diff:right', '');

  const { rows, added, removed } = useMemo(() => {
    if (!left && !right) return { rows: [] as Row[], added: 0, removed: 0 };
    const r = diffLines(left.split('\n'), right.split('\n'));
    return {
      rows: r,
      added: r.filter((x) => x.type === 'add').length,
      removed: r.filter((x) => x.type === 'del').length,
    };
  }, [left, right]);

  return (
    <ToolShell tool={tool}>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="flex flex-col gap-2">
          <label className="text-xs font-medium">{t('ui.diff.origin')}</label>
          <Textarea
            value={left}
            onChange={(e) => setLeft(e.target.value)}
            placeholder={t('ui.diff.originPlaceholder')}
            className="min-h-[140px] resize-none font-mono text-xs leading-5"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-xs font-medium">{t('ui.diff.modified')}</label>
          <Textarea
            value={right}
            onChange={(e) => setRight(e.target.value)}
            placeholder={t('ui.diff.modifiedPlaceholder')}
            className="min-h-[140px] resize-none font-mono text-xs leading-5"
          />
        </div>
      </div>

      <Panel className="min-h-0 flex-1">
        <PanelHeader title={t('ui.diff.title')} subtitle={t('ui.diff.subtitle')}>
          <div className="flex items-center gap-3 text-[11px] font-medium tabular-nums">
            <span className="text-emerald-500">+{added}</span>
            <span className="text-destructive">−{removed}</span>
          </div>
        </PanelHeader>
        <div className="min-h-0 flex-1 overflow-auto font-mono text-xs leading-5">
          {rows.length === 0 ? (
            <p className="p-4 text-muted-foreground">{t('ui.diff.empty')}</p>
          ) : (
            rows.map((row, idx) => (
              <div
                key={idx}
                className={
                  row.type === 'add'
                    ? 'flex bg-emerald-500/10'
                    : row.type === 'del'
                      ? 'flex bg-destructive/10'
                      : 'flex'
                }
              >
                <span className="w-10 shrink-0 select-none px-2 text-right text-muted-foreground/60">
                  {row.type === 'add' ? '' : row.left}
                </span>
                <span className="w-10 shrink-0 select-none px-2 text-right text-muted-foreground/60">
                  {row.type === 'del' ? '' : row.right}
                </span>
                <span
                  className={
                    row.type === 'add'
                      ? 'w-4 shrink-0 select-none text-emerald-500'
                      : row.type === 'del'
                        ? 'w-4 shrink-0 select-none text-destructive'
                        : 'w-4 shrink-0 select-none text-muted-foreground/40'
                  }
                >
                  {row.type === 'add' ? '+' : row.type === 'del' ? '−' : ' '}
                </span>
                <span className="whitespace-pre-wrap break-all pr-4">{row.text || ' '}</span>
              </div>
            ))
          )}
        </div>
      </Panel>
    </ToolShell>
  );
}
