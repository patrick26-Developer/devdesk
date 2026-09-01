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

function dotenvToObject(text: string): Record<string, string> {
  const obj: Record<string, string> = {};
  for (const raw of text.split('\n')) {
    const line = raw.trim();
    if (!line || line.startsWith('#')) continue;
    const eq = line.indexOf('=');
    if (eq === -1) continue;
    const key = line.slice(0, eq).replace(/^export\s+/, '').trim();
    let value = line.slice(eq + 1).trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    obj[key] = value.replace(/\\n/g, '\n');
  }
  return obj;
}

function objectToDotenv(obj: Record<string, unknown>): string {
  return Object.entries(obj)
    .map(([k, v]) => {
      const s = v === null || v === undefined ? '' : typeof v === 'object' ? JSON.stringify(v) : String(v);
      const needsQuotes = /[\s#"'\n]/.test(s);
      return `${k}=${needsQuotes ? `"${s.replace(/\n/g, '\\n').replace(/"/g, '\\"')}"` : s}`;
    })
    .join('\n');
}

export default function DotenvJson() {
  const tool = getTool('dotenv-json')!;
  const t = useT();
  const [mode, setMode] = usePersistentState<'env2json' | 'json2env'>('dotenv-json:mode', 'env2json');
  const [input, setInput] = usePersistentState(
    'dotenv-json:input',
    '# Base de données\nDB_HOST=localhost\nDB_PORT=5432\nAPP_NAME="Dev Desk"'
  );

  const result = useMemo(() => {
    if (!input.trim()) return { output: '', error: null as string | null };
    try {
      if (mode === 'env2json') {
        return { output: JSON.stringify(dotenvToObject(input), null, 2), error: null };
      }
      return { output: objectToDotenv(JSON.parse(input)), error: null };
    } catch (e) {
      return { output: '', error: (e as Error).message };
    }
  }, [input, mode]);

  return (
    <ToolShell
      tool={tool}
      actions={
        <Button
          variant="secondary"
          size="sm"
          onClick={() => {
            setMode(mode === 'env2json' ? 'json2env' : 'env2json');
            if (result.output) setInput(result.output);
          }}
          className="gap-2"
        >
          <ArrowLeftRight className="h-3.5 w-3.5" />
          {mode === 'env2json' ? '.env → JSON' : 'JSON → .env'}
        </Button>
      }
    >
      <div className="grid min-h-0 flex-1 grid-cols-1 gap-4 lg:grid-cols-2">
        <Panel className="min-h-0">
          <PanelHeader title={mode === 'env2json' ? '.env' : 'JSON'} subtitle={t('common.input')} />
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            spellCheck={false}
            className="min-h-[240px] flex-1 resize-none rounded-none border-0 bg-transparent p-4 font-mono text-[13px] leading-6 shadow-none focus-visible:ring-0"
          />
        </Panel>
        <Panel className="min-h-0">
          <PanelHeader
            title={mode === 'env2json' ? 'JSON' : '.env'}
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
