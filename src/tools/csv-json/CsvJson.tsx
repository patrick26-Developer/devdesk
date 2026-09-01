import { useMemo } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import ToolShell from '@/components/tool/ToolShell';
import { Panel, PanelHeader } from '@/components/tool/Panel';
import CopyButton from '@/components/CopyButton';
import { usePersistentState } from '@/hooks/usePersistentState';
import { getTool } from '@/tools';
import { useT } from '@/i18n';
import { ArrowLeftRight } from 'lucide-react';

// Parseur CSV minimal gérant les guillemets et les retours à la ligne échappés.
function parseCsv(text: string, delimiter: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = '';
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i++;
        } else inQuotes = false;
      } else field += c;
    } else if (c === '"') {
      inQuotes = true;
    } else if (c === delimiter) {
      row.push(field);
      field = '';
    } else if (c === '\n') {
      row.push(field);
      rows.push(row);
      row = [];
      field = '';
    } else if (c !== '\r') {
      field += c;
    }
  }
  if (field !== '' || row.length) {
    row.push(field);
    rows.push(row);
  }
  return rows.filter((r) => r.some((v) => v !== ''));
}

function csvToJson(text: string, delimiter: string): string {
  const rows = parseCsv(text, delimiter);
  if (rows.length < 1) return '[]';
  const [header, ...body] = rows;
  const out = body.map((r) => {
    const obj: Record<string, unknown> = {};
    header.forEach((key, i) => {
      const raw = r[i] ?? '';
      obj[key] = raw === '' ? null : /^-?\d+(\.\d+)?$/.test(raw) ? Number(raw) : raw === 'true' ? true : raw === 'false' ? false : raw;
    });
    return obj;
  });
  return JSON.stringify(out, null, 2);
}

function jsonToCsv(text: string, delimiter: string): string {
  const data = JSON.parse(text);
  const arr = Array.isArray(data) ? data : [data];
  const cols = Array.from(new Set(arr.flatMap((o) => (o && typeof o === 'object' ? Object.keys(o) : []))));
  const esc = (v: unknown) => {
    const s = v === null || v === undefined ? '' : typeof v === 'object' ? JSON.stringify(v) : String(v);
    return /[",\n]/.test(s) || s.includes(delimiter) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  const lines = [cols.join(delimiter), ...arr.map((o) => cols.map((c) => esc(o?.[c])).join(delimiter))];
  return lines.join('\n');
}

export default function CsvJson() {
  const tool = getTool('csv-json')!;
  const t = useT();
  const [mode, setMode] = usePersistentState<'csv2json' | 'json2csv'>('csv-json:mode', 'csv2json');
  const [delimiter, setDelimiter] = usePersistentState('csv-json:delim', ',');
  const [input, setInput] = usePersistentState('csv-json:input', 'name,role,active\nPatrick,dev,true\nAda,lead,false');

  const result = useMemo(() => {
    if (!input.trim()) return { output: '', error: null as string | null };
    try {
      return {
        output: mode === 'csv2json' ? csvToJson(input, delimiter) : jsonToCsv(input, delimiter),
        error: null,
      };
    } catch (e) {
      return { output: '', error: (e as Error).message };
    }
  }, [input, mode, delimiter]);

  return (
    <ToolShell
      tool={tool}
      actions={
        <Button
          variant="secondary"
          size="sm"
          onClick={() => {
            setMode(mode === 'csv2json' ? 'json2csv' : 'csv2json');
            setInput(result.output || '');
          }}
          className="gap-2"
        >
          <ArrowLeftRight className="h-3.5 w-3.5" />
          {mode === 'csv2json' ? 'CSV → JSON' : 'JSON → CSV'}
        </Button>
      }
    >
      <div className="flex flex-wrap items-center gap-3">
        <label className="text-xs font-medium">{t('ui.conv.delimiter')}</label>
        {[',', ';', '\t', '|'].map((d) => (
          <button
            key={d}
            onClick={() => setDelimiter(d)}
            className={`rounded px-2 py-1 font-mono text-xs ${delimiter === d ? 'bg-primary/10 text-primary' : 'hover:bg-accent'}`}
          >
            {d === '\t' ? t('ui.conv.tab') : d}
          </button>
        ))}
      </div>

      <div className="grid min-h-0 flex-1 grid-cols-1 gap-4 lg:grid-cols-2">
        <Panel className="min-h-0">
          <PanelHeader title={mode === 'csv2json' ? 'CSV' : 'JSON'} subtitle={t('common.input')} />
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            spellCheck={false}
            className="min-h-[220px] flex-1 resize-none rounded-none border-0 bg-transparent p-4 font-mono text-[13px] leading-6 shadow-none focus-visible:ring-0"
          />
        </Panel>
        <Panel className="min-h-0">
          <PanelHeader
            title={mode === 'csv2json' ? 'JSON' : 'CSV'}
            subtitle={t('common.result')}
            right={<CopyButton value={result.output} />}
          />
          {result.error ? (
            <div className="p-4 text-xs text-destructive">{t('common.error')} : {result.error}</div>
          ) : (
            <pre className="min-h-0 flex-1 overflow-auto bg-muted/[0.08] p-4 font-mono text-[13px] leading-6 text-foreground">
              {result.output || t('ui.conv.waiting')}
            </pre>
          )}
        </Panel>
      </div>
    </ToolShell>
  );
}
