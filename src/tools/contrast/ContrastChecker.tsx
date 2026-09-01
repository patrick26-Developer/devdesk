import { useMemo } from 'react';
import { Input } from '@/components/ui/input';
import ToolShell from '@/components/tool/ToolShell';
import { Panel } from '@/components/tool/Panel';
import { usePersistentState } from '@/hooks/usePersistentState';
import { getTool } from '@/tools';
import { useT } from '@/i18n';
import { Check, X } from 'lucide-react';

const HEX_RE = /^#?([0-9a-fA-F]{6})$/;

function parseHex(value: string): { r: number; g: number; b: number } | null {
  const m = value.match(HEX_RE);
  if (!m) return null;
  const int = parseInt(m[1], 16);
  return { r: (int >> 16) & 255, g: (int >> 8) & 255, b: int & 255 };
}

function relativeLuminance({ r, g, b }: { r: number; g: number; b: number }): number {
  const channel = (c: number) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
}

function contrastRatio(a: string, b: string): number | null {
  const ca = parseHex(a);
  const cb = parseHex(b);
  if (!ca || !cb) return null;
  const la = relativeLuminance(ca);
  const lb = relativeLuminance(cb);
  return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
}

function normalizeHex(value: string): string {
  const m = value.match(HEX_RE);
  return m ? `#${m[1]}` : value;
}

export default function ContrastChecker() {
  const tool = getTool('contrast')!;
  const t = useT();
  const [fg, setFg] = usePersistentState('contrast:fg', '#1e293b');
  const [bg, setBg] = usePersistentState('contrast:bg', '#f8fafc');

  const ratio = useMemo(() => contrastRatio(fg, bg), [fg, bg]);

  const checks = ratio
    ? [
        { label: t('ui.contrast.normalAA'), pass: ratio >= 4.5, need: '4.5:1' },
        { label: t('ui.contrast.normalAAA'), pass: ratio >= 7, need: '7:1' },
        { label: t('ui.contrast.largeAA'), pass: ratio >= 3, need: '3:1' },
        { label: t('ui.contrast.largeAAA'), pass: ratio >= 4.5, need: '4.5:1' },
        { label: t('ui.contrast.graphicsAA'), pass: ratio >= 3, need: '3:1' },
      ]
    : [];

  return (
    <ToolShell tool={tool}>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <ColorField label={t('ui.contrast.fg')} value={fg} onChange={setFg} />
        <ColorField label={t('ui.contrast.bg')} value={bg} onChange={setBg} />
      </div>

      <Panel>
        <div
          className="flex min-h-[130px] flex-col items-center justify-center gap-2 p-6"
          style={{ backgroundColor: normalizeHex(bg), color: normalizeHex(fg) }}
        >
          <p className="text-lg font-semibold">{t('ui.contrast.sample')}</p>
          <p className="text-sm">The quick brown fox jumps over the lazy dog — 0123456789</p>
        </div>
        <div className="flex items-center justify-between border-t border-border bg-card px-4 py-3">
          <span className="text-sm text-muted-foreground">{t('ui.contrast.ratio')}</span>
          <span className="font-mono text-lg font-semibold tabular-nums">
            {ratio ? `${ratio.toFixed(2)}:1` : '—'}
          </span>
        </div>
      </Panel>

      {ratio ? (
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {checks.map((c) => (
            <div
              key={c.label}
              className="flex items-center justify-between gap-3 rounded-lg border border-border bg-card px-4 py-3"
            >
              <span className="text-xs font-medium">{c.label}</span>
              <span
                className={`flex items-center gap-1.5 text-xs font-semibold ${
                  c.pass ? 'text-emerald-500' : 'text-destructive'
                }`}
              >
                {c.pass ? <Check className="h-3.5 w-3.5" /> : <X className="h-3.5 w-3.5" />}
                {c.pass ? t('ui.contrast.pass') : t('ui.contrast.fail', { need: c.need })}
              </span>
            </div>
          ))}
        </div>
      ) : (
        <p className="rounded-lg border border-destructive/20 bg-destructive/5 px-3 py-2 text-xs text-destructive">
          {t('ui.contrast.needTwo')}
        </p>
      )}
    </ToolShell>
  );
}

function ColorField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  const t = useT();
  const valid = HEX_RE.test(value);
  return (
    <Panel className="p-4">
      <label className="mb-2 block text-xs font-medium">{label}</label>
      <div className="flex gap-3">
        <input
          type="color"
          value={valid ? normalizeHex(value) : '#000000'}
          onChange={(e) => onChange(e.target.value)}
          className="h-10 w-14 cursor-pointer rounded-lg border border-border bg-background p-1"
          aria-label={`${label} — ${t('ui.contrast.pickerSuffix')}`}
        />
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="#000000"
          className="h-10 font-mono text-sm"
          aria-label={`${label} — ${t('ui.contrast.hexSuffix')}`}
        />
      </div>
    </Panel>
  );
}
