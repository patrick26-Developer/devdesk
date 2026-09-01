import { useMemo, useState } from 'react';
import { Input } from '@/components/ui/input';
import ToolShell from '@/components/tool/ToolShell';
import { Panel, PanelHeader } from '@/components/tool/Panel';
import CopyButton from '@/components/CopyButton';
import { usePersistentState } from '@/hooks/usePersistentState';
import { getTool } from '@/tools';
import { useT } from '@/i18n';

const BASES: { key: string; labelKey: string; radix: number; prefix: string }[] = [
  { key: 'bin', labelKey: 'ui.nb.bin', radix: 2, prefix: '0b' },
  { key: 'oct', labelKey: 'ui.nb.oct', radix: 8, prefix: '0o' },
  { key: 'dec', labelKey: 'ui.nb.dec', radix: 10, prefix: '' },
  { key: 'hex', labelKey: 'ui.nb.hex', radix: 16, prefix: '0x' },
];

function parseInput(raw: string): bigint | null {
  const s = raw.trim().toLowerCase().replace(/[_\s]/g, '');
  if (!s) return null;
  try {
    if (s.startsWith('0b')) return BigInt(s);
    if (s.startsWith('0o')) return BigInt(s);
    if (s.startsWith('0x')) return BigInt(s);
    // Sans préfixe : décimal.
    if (/^-?\d+$/.test(s)) return BigInt(s);
    return null;
  } catch {
    return null;
  }
}

export default function NumberBaseConverter() {
  const tool = getTool('number-base')!;
  const t = useT();
  const [value, setValue] = usePersistentState('number-base:value', '255');
  const [bitWidth, setBitWidth] = useState(8);

  const parsed = useMemo(() => parseInput(value), [value]);

  const bits =
    parsed !== null && parsed >= 0n
      ? parsed.toString(2).padStart(bitWidth, '0')
      : null;

  return (
    <ToolShell tool={tool}>
      <div className="flex flex-col gap-2">
        <label className="text-xs font-medium">
          {t('ui.nb.numberLabel')} <span className="text-muted-foreground">{t('ui.nb.prefixHint')}</span>
        </label>
        <Input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="255 ou 0xff ou 0b1010"
          className="h-11 font-mono text-sm"
        />
        {value.trim() && parsed === null && (
          <p className="text-xs text-destructive">{t('ui.nb.invalid')}</p>
        )}
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {BASES.map(({ key, labelKey, radix, prefix }) => {
          const out =
            parsed !== null
              ? (parsed < 0n ? '-' : '') +
                prefix +
                (parsed < 0n ? (-parsed).toString(radix) : parsed.toString(radix))
              : '';
          return (
            <Panel key={key}>
              <PanelHeader title={t(labelKey)} subtitle={t('ui.nb.base', { r: radix })} right={<CopyButton value={out} />} />
              <div className="p-4">
                <code className="block break-all font-mono text-sm text-foreground">
                  {out || <span className="text-muted-foreground">—</span>}
                </code>
              </div>
            </Panel>
          );
        })}
      </div>

      <Panel className="p-4">
        <div className="mb-3 flex items-center justify-between">
          <p className="text-sm font-medium">{t('ui.nb.binRepr')}</p>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span>{t('ui.nb.width')}</span>
            {[8, 16, 32, 64].map((w) => (
              <button
                key={w}
                onClick={() => setBitWidth(w)}
                className={`rounded px-1.5 py-0.5 font-mono ${
                  bitWidth === w ? 'bg-primary/10 text-primary' : 'hover:bg-accent'
                }`}
              >
                {w}
              </button>
            ))}
          </div>
        </div>
        {bits ? (
          <div className="flex flex-wrap gap-1.5 font-mono text-xs">
            {bits
              .slice(-bitWidth)
              .split('')
              .map((b, i) => (
                <span
                  key={i}
                  className={`flex h-7 w-6 items-center justify-center rounded border ${
                    b === '1'
                      ? 'border-primary/30 bg-primary/10 text-primary'
                      : 'border-border text-muted-foreground'
                  }`}
                >
                  {b}
                </span>
              ))}
          </div>
        ) : (
          <p className="text-xs text-muted-foreground">{t('ui.nb.positiveOnly')}</p>
        )}
      </Panel>
    </ToolShell>
  );
}
