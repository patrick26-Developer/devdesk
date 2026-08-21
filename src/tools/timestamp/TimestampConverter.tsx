import { useMemo, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Clock,
  ArrowDown,
  ArrowUp,
  RotateCcw,
} from 'lucide-react';

export default function TimestampConverter() {
  const [timestampInput, setTimestampInput] = useState('');
  const [dateInput, setDateInput] = useState('');

  const fromTimestamp = useMemo(() => {
    if (
      !timestampInput ||
      isNaN(Number(timestampInput))
    ) {
      return null;
    }

    const num = Number(timestampInput);
    const ms =
      timestampInput.length > 10
        ? num
        : num * 1000;

    const date = new Date(ms);

    if (isNaN(date.getTime())) return null;

    return {
      iso: date.toISOString(),
      local: date.toLocaleString(),
      utc: date.toUTCString(),
    };
  }, [timestampInput]);

  const fromDate = useMemo(() => {
    if (!dateInput) return null;

    const date = new Date(dateInput);

    if (isNaN(date.getTime())) return null;

    return Math.floor(date.getTime() / 1000);
  }, [dateInput]);

  const useNow = () => {
    setTimestampInput(
      String(Math.floor(Date.now() / 1000))
    );
  };

  return (
    <div className="flex h-full flex-col gap-6 p-6">
      {/* Header */}
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-amber-500/15 bg-amber-500/10 text-amber-500">
          <Clock className="h-5 w-5" />
        </div>

        <div>
          <h2 className="text-lg font-semibold">
            Timestamp Converter
          </h2>

          <p className="mt-1 text-xs text-muted-foreground">
            Convertis des timestamps Unix en dates et inversement.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* Timestamp -> Date */}
        <section className="rounded-xl border border-border bg-card p-4">
          <div className="mb-4 flex items-center gap-2">
            <ArrowDown className="h-4 w-4 text-amber-500" />

            <div>
              <p className="text-xs font-semibold">
                Timestamp → Date
              </p>

              <p className="text-[11px] text-muted-foreground">
                Secondes ou millisecondes
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            <Input
              value={timestampInput}
              onChange={(e) =>
                setTimestampInput(e.target.value)
              }
              placeholder="1755000000"
              className="font-mono"
            />

            <Button
              variant="secondary"
              onClick={useNow}
              className="gap-2"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Maintenant
            </Button>
          </div>

          {fromTimestamp && (
            <div className="mt-4 space-y-2 rounded-lg bg-muted/30 p-3 font-mono text-xs">
              <p>
                <span className="text-muted-foreground">
                  ISO :
                </span>{' '}
                {fromTimestamp.iso}
              </p>

              <p>
                <span className="text-muted-foreground">
                  Local :
                </span>{' '}
                {fromTimestamp.local}
              </p>

              <p>
                <span className="text-muted-foreground">
                  UTC :
                </span>{' '}
                {fromTimestamp.utc}
              </p>
            </div>
          )}
        </section>

        {/* Date -> Timestamp */}
        <section className="rounded-xl border border-border bg-card p-4">
          <div className="mb-4 flex items-center gap-2">
            <ArrowUp className="h-4 w-4 text-emerald-500" />

            <div>
              <p className="text-xs font-semibold">
                Date → Timestamp
              </p>

              <p className="text-[11px] text-muted-foreground">
                Date et heure locales
              </p>
            </div>
          </div>

          <input
            type="datetime-local"
            value={dateInput}
            onChange={(e) =>
              setDateInput(e.target.value)
            }
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          />

          {fromDate !== null && (
            <div className="mt-4 rounded-lg bg-muted/30 p-3">
              <p className="text-xs text-muted-foreground">
                Timestamp Unix
              </p>

              <p className="mt-1 font-mono text-sm font-medium">
                {fromDate}
              </p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}