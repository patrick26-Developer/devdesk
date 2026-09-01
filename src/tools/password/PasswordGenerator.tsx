import { useCallback, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import ToolShell from '@/components/tool/ToolShell';
import { Panel } from '@/components/tool/Panel';
import CopyButton from '@/components/CopyButton';
import { usePersistentState } from '@/hooks/usePersistentState';
import { getTool } from '@/tools';
import { useT } from '@/i18n';
import { RefreshCw, ShieldCheck } from 'lucide-react';

const SETS = {
  lower: 'abcdefghijklmnopqrstuvwxyz',
  upper: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  digits: '0123456789',
  symbols: '!@#$%^&*()-_=+[]{};:,.<>?/',
};
const AMBIGUOUS = /[Il1O0o]/g;

interface Options {
  length: number;
  lower: boolean;
  upper: boolean;
  digits: boolean;
  symbols: boolean;
  excludeAmbiguous: boolean;
}

function randomInt(max: number): number {
  // Rejet d'échantillonnage pour éviter le biais modulo.
  const limit = Math.floor(0x100000000 / max) * max;
  const buf = new Uint32Array(1);
  let x = 0;
  do {
    crypto.getRandomValues(buf);
    x = buf[0];
  } while (x >= limit);
  return x % max;
}

function generate(opts: Options): string {
  let pool = '';
  if (opts.lower) pool += SETS.lower;
  if (opts.upper) pool += SETS.upper;
  if (opts.digits) pool += SETS.digits;
  if (opts.symbols) pool += SETS.symbols;
  if (opts.excludeAmbiguous) pool = pool.replace(AMBIGUOUS, '');
  if (!pool) return '';

  let out = '';
  for (let i = 0; i < opts.length; i++) out += pool[randomInt(pool.length)];
  return out;
}

function strength(pw: string, poolSize: number): { bits: number; labelKey: string; className: string } {
  const bits = pw ? Math.round(pw.length * Math.log2(Math.max(poolSize, 2))) : 0;
  if (bits < 40) return { bits, labelKey: 'ui.pw.weak', className: 'text-red-500' };
  if (bits < 70) return { bits, labelKey: 'ui.pw.ok', className: 'text-amber-500' };
  if (bits < 100) return { bits, labelKey: 'ui.pw.strong', className: 'text-emerald-500' };
  return { bits, labelKey: 'ui.pw.veryStrong', className: 'text-emerald-500' };
}

export default function PasswordGenerator() {
  const tool = getTool('password')!;
  const t = useT();
  const [opts, setOpts] = usePersistentState<Options>('password:opts', {
    length: 20,
    lower: true,
    upper: true,
    digits: true,
    symbols: true,
    excludeAmbiguous: false,
  });
  const [password, setPassword] = useState('');

  const regen = useCallback(() => setPassword(generate(opts)), [opts]);

  useEffect(() => {
    regen();
  }, [regen]);

  let poolSize = 0;
  if (opts.lower) poolSize += 26;
  if (opts.upper) poolSize += 26;
  if (opts.digits) poolSize += 10;
  if (opts.symbols) poolSize += 25;

  const s = strength(password, poolSize);
  const noSet = !opts.lower && !opts.upper && !opts.digits && !opts.symbols;

  const toggle = (key: keyof Options) => setOpts((o) => ({ ...o, [key]: !o[key] }));

  return (
    <ToolShell
      tool={tool}
      actions={
        <Button onClick={regen} size="sm" className="gap-2" disabled={noSet}>
          <RefreshCw className="h-3.5 w-3.5" />
          {t('common.generate')}
        </Button>
      }
    >
      <div className="flex items-center gap-2 rounded-lg border border-border bg-muted/30 px-3.5 py-2.5 text-xs text-muted-foreground">
        <ShieldCheck className="h-4 w-4 shrink-0 text-emerald-500" />
        <span>{t('ui.pw.note')}</span>
      </div>

      <Panel>
        <div className="flex items-center justify-between gap-3 p-4">
          <code className="min-w-0 flex-1 break-all font-mono text-base text-foreground">
            {password || <span className="text-muted-foreground">—</span>}
          </code>
          <CopyButton value={password} label={t('common.copy')} variant="secondary" />
        </div>
        <div className="flex items-center justify-between border-t border-border bg-muted/20 px-4 py-2 text-[11px]">
          <span className="text-muted-foreground">
            {t('ui.pw.entropy')} : <span className="tabular-nums text-foreground">{t('ui.pw.bits', { n: s.bits })}</span>
          </span>
          <span className={s.className}>{password ? t(s.labelKey) : ''}</span>
        </div>
      </Panel>

      <Panel className="p-4">
        <div className="mb-4 flex items-center justify-between gap-4">
          <label htmlFor="pw-length" className="text-sm font-medium">
            {t('ui.pw.length')}
          </label>
          <span className="font-mono text-sm tabular-nums">{opts.length}</span>
        </div>
        <input
          id="pw-length"
          type="range"
          min={6}
          max={64}
          value={opts.length}
          onChange={(e) => setOpts((o) => ({ ...o, length: Number(e.target.value) }))}
          className="w-full accent-primary"
        />

        <div className="mt-5 grid grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-2">
          <OptionRow label={t('ui.pw.lower')} checked={opts.lower} onChange={() => toggle('lower')} />
          <OptionRow label={t('ui.pw.upper')} checked={opts.upper} onChange={() => toggle('upper')} />
          <OptionRow label={t('ui.pw.digits')} checked={opts.digits} onChange={() => toggle('digits')} />
          <OptionRow label={t('ui.pw.symbols')} checked={opts.symbols} onChange={() => toggle('symbols')} />
          <OptionRow
            label={t('ui.pw.excludeAmbiguous')}
            checked={opts.excludeAmbiguous}
            onChange={() => toggle('excludeAmbiguous')}
          />
        </div>

        {noSet && (
          <p className="mt-4 rounded-lg border border-destructive/20 bg-destructive/5 px-3 py-2 text-xs text-destructive">
            {t('ui.pw.noSet')}
          </p>
        )}
      </Panel>
    </ToolShell>
  );
}

function OptionRow({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <label className="flex cursor-pointer items-center justify-between gap-3">
      <span className="text-xs text-foreground">{label}</span>
      <Switch checked={checked} onCheckedChange={onChange} />
    </label>
  );
}
