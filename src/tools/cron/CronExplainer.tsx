import { useMemo } from 'react';
import cronstrue from 'cronstrue/i18n';

import { Input } from '@/components/ui/input';
import ToolShell from '@/components/tool/ToolShell';
import { Panel, PanelHeader } from '@/components/tool/Panel';
import { usePersistentState } from '@/hooks/usePersistentState';
import { getTool } from '@/tools';
import { CalendarClock } from 'lucide-react';

const PRESETS: { expr: string; label: string }[] = [
  { expr: '*/5 * * * *', label: 'Toutes les 5 min' },
  { expr: '0 * * * *', label: 'Toutes les heures' },
  { expr: '0 9 * * 1-5', label: 'En semaine à 9h' },
  { expr: '0 0 * * 0', label: 'Dimanche minuit' },
  { expr: '0 0 1 * *', label: 'Le 1er du mois' },
  { expr: '30 3 * * *', label: 'Chaque jour à 3h30' },
];

// Développe un champ cron ("*", "*/n", "a-b", "a,b", "a-b/n") en liste de valeurs.
function expandField(field: string, min: number, max: number): number[] {
  const out = new Set<number>();
  for (const part of field.split(',')) {
    let step = 1;
    let range = part;
    const slash = part.split('/');
    if (slash.length === 2) {
      range = slash[0];
      step = parseInt(slash[1], 10) || 1;
    }
    let lo = min;
    let hi = max;
    if (range !== '*') {
      const dash = range.split('-');
      lo = parseInt(dash[0], 10);
      hi = dash.length === 2 ? parseInt(dash[1], 10) : lo;
    }
    for (let v = lo; v <= hi; v += step) if (v >= min && v <= max) out.add(v);
  }
  return [...out];
}

function nextRuns(expr: string, count: number): Date[] {
  const parts = expr.trim().split(/\s+/);
  if (parts.length !== 5) throw new Error('Attendu 5 champs : minute heure jour mois jour-semaine');
  const [mins, hours, doms, months, dows] = [
    expandField(parts[0], 0, 59),
    expandField(parts[1], 0, 23),
    expandField(parts[2], 1, 31),
    expandField(parts[3], 1, 12),
    expandField(parts[4], 0, 7).map((d) => (d === 7 ? 0 : d)),
  ];

  const results: Date[] = [];
  const d = new Date();
  d.setSeconds(0, 0);
  d.setMinutes(d.getMinutes() + 1);
  const domRestricted = parts[2] !== '*';
  const dowRestricted = parts[4] !== '*';

  for (let i = 0; i < 366 * 24 * 60 && results.length < count; i++) {
    if (
      mins.includes(d.getMinutes()) &&
      hours.includes(d.getHours()) &&
      months.includes(d.getMonth() + 1) &&
      (domRestricted && dowRestricted
        ? doms.includes(d.getDate()) || dows.includes(d.getDay())
        : (!domRestricted || doms.includes(d.getDate())) && (!dowRestricted || dows.includes(d.getDay())))
    ) {
      results.push(new Date(d));
    }
    d.setMinutes(d.getMinutes() + 1);
  }
  return results;
}

export default function CronExplainer() {
  const tool = getTool('cron')!;
  const [expr, setExpr] = usePersistentState('cron:expr', '*/15 9-17 * * 1-5');

  const human = useMemo(() => {
    try {
      return { text: cronstrue.toString(expr, { locale: 'fr', use24HourTimeFormat: true }), error: null as string | null };
    } catch (e) {
      return { text: '', error: String(e) };
    }
  }, [expr]);

  const runs = useMemo(() => {
    try {
      return { list: nextRuns(expr, 7), error: null as string | null };
    } catch (e) {
      return { list: [] as Date[], error: (e as Error).message };
    }
  }, [expr]);

  return (
    <ToolShell tool={tool}>
      <div className="flex flex-col gap-2">
        <label className="text-xs font-medium">Expression cron (5 champs)</label>
        <Input
          value={expr}
          onChange={(e) => setExpr(e.target.value)}
          placeholder="*/15 9-17 * * 1-5"
          className="h-11 font-mono text-sm"
        />
        <div className="flex flex-wrap gap-1.5">
          {PRESETS.map((p) => (
            <button
              key={p.expr}
              onClick={() => setExpr(p.expr)}
              className="rounded-md border border-border px-2 py-1 text-[11px] text-muted-foreground hover:border-primary/30 hover:text-foreground"
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      <Panel className="p-5">
        <div className="flex items-start gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-sky-500/15 bg-sky-500/10 text-sky-500">
            <CalendarClock className="h-4 w-4" />
          </div>
          <div className="min-w-0">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Signification</p>
            {human.error ? (
              <p className="mt-1 text-sm text-destructive">Expression invalide</p>
            ) : (
              <p className="mt-1 text-base font-medium text-foreground">{human.text}</p>
            )}
          </div>
        </div>
      </Panel>

      <Panel className="min-h-0 flex-1">
        <PanelHeader title="Prochaines exécutions" subtitle="Sur la base de l'heure locale" />
        <div className="min-h-0 flex-1 overflow-auto">
          {runs.error ? (
            <p className="p-4 text-xs text-destructive">{runs.error}</p>
          ) : runs.list.length === 0 ? (
            <p className="p-4 text-xs text-muted-foreground">Aucune exécution dans l'année à venir.</p>
          ) : (
            <ul className="divide-y divide-border">
              {runs.list.map((d, i) => (
                <li key={i} className="flex items-center justify-between px-4 py-2.5 font-mono text-xs">
                  <span className="text-foreground">{d.toLocaleString('fr-FR', { weekday: 'short', day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}</span>
                  <span className="text-muted-foreground">
                    {i === 0 ? 'prochaine' : `+${Math.round((d.getTime() - runs.list[0].getTime()) / 60000)} min`}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </Panel>
    </ToolShell>
  );
}
