import { useMemo, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import ToolShell from '@/components/tool/ToolShell';
import { Panel } from '@/components/tool/Panel';
import CopyButton from '@/components/CopyButton';
import { getTool } from '@/tools';
import { useI18n } from '@/i18n';
import { ArrowDown, ArrowUp, Clock } from 'lucide-react';

export default function TimestampConverter() {
  const tool = getTool('timestamp')!;
  const { t, locale } = useI18n();
  const [timestampInput, setTimestampInput] = useState('');
  const [dateInput, setDateInput] = useState('');

  const fromTimestamp = useMemo(() => {
    if (!timestampInput || isNaN(Number(timestampInput))) return null;

    const num = Number(timestampInput);
    const ms = timestampInput.trim().length > 10 ? num : num * 1000;
    const date = new Date(ms);
    if (isNaN(date.getTime())) return null;

    return {
      iso: date.toISOString(),
      local: date.toLocaleString(),
      utc: date.toUTCString(),
      relative: formatRelative(date, locale),
    };
  }, [timestampInput, locale]);

  const fromDate = useMemo(() => {
    if (!dateInput) return null;
    const date = new Date(dateInput);
    if (isNaN(date.getTime())) return null;
    return Math.floor(date.getTime() / 1000);
  }, [dateInput]);

  const useNow = () => setTimestampInput(String(Math.floor(Date.now() / 1000)));

  return (
    <ToolShell tool={tool}>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Panel>
          <div className="p-4">
            <div className="mb-4 flex items-center gap-2">
              <ArrowDown className="h-4 w-4 text-emerald-500" />
              <div>
                <p className="text-xs font-semibold">{t('ui.ts.toDate')}</p>
                <p className="text-[11px] text-muted-foreground">{t('ui.ts.toDateSub')}</p>
              </div>
            </div>

            <div className="flex gap-2">
              <Input
                value={timestampInput}
                onChange={(e) => setTimestampInput(e.target.value)}
                placeholder="1755000000"
                className="font-mono"
              />
              <Button variant="secondary" onClick={useNow} className="gap-2">
                <Clock className="h-3.5 w-3.5" />
                {t('ui.ts.now')}
              </Button>
            </div>

            {fromTimestamp && (
              <div className="mt-4 space-y-2 rounded-lg bg-muted/30 p-3 font-mono text-xs">
                <Row label="ISO" value={fromTimestamp.iso} />
                <Row label={t('ui.ts.local')} value={fromTimestamp.local} />
                <Row label="UTC" value={fromTimestamp.utc} />
                <Row label={t('ui.ts.relative')} value={fromTimestamp.relative} />
              </div>
            )}
          </div>
        </Panel>

        <Panel>
          <div className="p-4">
            <div className="mb-4 flex items-center gap-2">
              <ArrowUp className="h-4 w-4 text-emerald-500" />
              <div>
                <p className="text-xs font-semibold">{t('ui.ts.toTs')}</p>
                <p className="text-[11px] text-muted-foreground">{t('ui.ts.toTsSub')}</p>
              </div>
            </div>

            <input
              type="datetime-local"
              value={dateInput}
              onChange={(e) => setDateInput(e.target.value)}
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
              aria-label={t('ui.ts.dateTimeLabel')}
            />

            {fromDate !== null && (
              <div className="mt-4 flex items-center justify-between gap-3 rounded-lg bg-muted/30 p-3">
                <div className="min-w-0">
                  <p className="text-xs text-muted-foreground">{t('ui.ts.unix')}</p>
                  <p className="mt-1 font-mono text-sm font-medium">{fromDate}</p>
                </div>
                <CopyButton value={String(fromDate)} />
              </div>
            )}
          </div>
        </Panel>
      </div>
    </ToolShell>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span>
        <span className="text-muted-foreground">{label} :</span> {value}
      </span>
      <CopyButton value={value} />
    </div>
  );
}

function formatRelative(date: Date, locale: string): string {
  const diffMs = date.getTime() - Date.now();
  const abs = Math.abs(diffMs);
  const units: [Intl.RelativeTimeFormatUnit, number][] = [
    ['year', 31536000000],
    ['month', 2592000000],
    ['day', 86400000],
    ['hour', 3600000],
    ['minute', 60000],
    ['second', 1000],
  ];
  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });
  for (const [unit, ms] of units) {
    if (abs >= ms || unit === 'second') {
      return rtf.format(Math.round(diffMs / ms), unit);
    }
  }
  return '';
}
