import { useMemo } from 'react';
import { Textarea } from '@/components/ui/textarea';
import ToolShell from '@/components/tool/ToolShell';
import { Panel, PanelHeader } from '@/components/tool/Panel';
import CopyButton from '@/components/CopyButton';
import { usePersistentState } from '@/hooks/usePersistentState';
import { getTool } from '@/tools';

interface Opts {
  separator: '-' | '_' | '.';
  lower: boolean;
  strict: boolean;
  maxLength: number;
}

function slugify(text: string, o: Opts): string {
  let s = text
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '') // diacritiques combinants
    .replace(/['"‘’]/g, '');
  if (o.lower) s = s.toLowerCase();
  s = s
    .replace(/[^a-zA-Z0-9]+/g, o.separator)
    .replace(new RegExp(`\\${o.separator}{2,}`, 'g'), o.separator)
    .replace(new RegExp(`^\\${o.separator}|\\${o.separator}$`, 'g'), '');
  if (o.strict) s = s.replace(/[^a-z0-9-_.]/gi, '');
  if (o.maxLength > 0 && s.length > o.maxLength) {
    s = s.slice(0, o.maxLength).replace(new RegExp(`\\${o.separator}[^\\${o.separator}]*$`), '');
  }
  return s;
}

export default function SlugGenerator() {
  const tool = getTool('slug')!;
  const [input, setInput] = usePersistentState('slug:input', "Créer un article : « 10 Astuces pour l'Été 2026 »");
  const [opts, setOpts] = usePersistentState<Opts>('slug:opts', {
    separator: '-',
    lower: true,
    strict: true,
    maxLength: 60,
  });

  const lines = useMemo(
    () =>
      input
        .split('\n')
        .map((l) => ({ src: l, slug: slugify(l, opts) }))
        .filter((x) => x.src.trim()),
    [input, opts]
  );

  return (
    <ToolShell tool={tool}>
      <div className="flex flex-col gap-2">
        <label className="text-xs font-medium">Texte (une ligne = un slug)</label>
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="min-h-[90px] resize-none text-sm"
        />
      </div>

      <div className="flex flex-wrap items-center gap-4 rounded-lg border border-border bg-card p-3 text-xs">
        <div className="flex items-center gap-1.5">
          <span className="text-muted-foreground">Séparateur</span>
          {(['-', '_', '.'] as const).map((s) => (
            <button
              key={s}
              onClick={() => setOpts({ ...opts, separator: s })}
              className={`rounded px-2 py-0.5 font-mono ${opts.separator === s ? 'bg-primary/10 text-primary' : 'hover:bg-accent'}`}
            >
              {s}
            </button>
          ))}
        </div>
        <label className="flex items-center gap-1.5">
          <input type="checkbox" checked={opts.lower} onChange={(e) => setOpts({ ...opts, lower: e.target.checked })} className="accent-primary" />
          minuscules
        </label>
        <label className="flex items-center gap-1.5">
          <input type="checkbox" checked={opts.strict} onChange={(e) => setOpts({ ...opts, strict: e.target.checked })} className="accent-primary" />
          strict (a-z 0-9)
        </label>
        <label className="flex items-center gap-1.5">
          <span className="text-muted-foreground">Longueur max</span>
          <input
            type="number"
            min={0}
            max={200}
            value={opts.maxLength}
            onChange={(e) => setOpts({ ...opts, maxLength: Number(e.target.value) })}
            className="w-16 rounded border border-input bg-transparent px-1.5 py-0.5 font-mono"
          />
        </label>
      </div>

      <Panel className="min-h-0 flex-1">
        <PanelHeader
          title="Slugs"
          subtitle={`${lines.length} ligne${lines.length > 1 ? 's' : ''}`}
          right={lines.length > 0 ? <CopyButton value={lines.map((l) => l.slug).join('\n')} label="Tout copier" /> : undefined}
        />
        <div className="min-h-0 flex-1 divide-y divide-border overflow-auto">
          {lines.map((l, i) => (
            <div key={i} className="flex items-center justify-between gap-3 px-4 py-2.5">
              <code className="min-w-0 flex-1 truncate font-mono text-sm text-foreground">{l.slug || '—'}</code>
              <CopyButton value={l.slug} />
            </div>
          ))}
        </div>
      </Panel>
    </ToolShell>
  );
}
