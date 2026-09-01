import { useMemo } from 'react';
import * as YAML from 'yaml';

import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import ToolShell from '@/components/tool/ToolShell';
import { Panel, PanelHeader } from '@/components/tool/Panel';
import CopyButton from '@/components/CopyButton';
import { usePersistentState } from '@/hooks/usePersistentState';
import { getTool } from '@/tools';
import { useT } from '@/i18n';
import { ArrowLeftRight } from 'lucide-react';

export default function JsonYaml() {
  const tool = getTool('json-yaml')!;
  const t = useT();
  const [mode, setMode] = usePersistentState<'json2yaml' | 'yaml2json'>('json-yaml:mode', 'json2yaml');
  const [input, setInput] = usePersistentState(
    'json-yaml:input',
    '{\n  "service": "devdesk",\n  "ports": [5173, 8080],\n  "env": { "LOCAL": true }\n}'
  );

  const result = useMemo(() => {
    if (!input.trim()) return { output: '', error: null as string | null };
    try {
      if (mode === 'json2yaml') {
        return { output: YAML.stringify(JSON.parse(input)), error: null };
      }
      return { output: JSON.stringify(YAML.parse(input), null, 2), error: null };
    } catch (e) {
      return { output: '', error: (e as Error).message };
    }
  }, [input, mode]);

  const swap = () => {
    setMode(mode === 'json2yaml' ? 'yaml2json' : 'json2yaml');
    if (result.output) setInput(result.output);
  };

  return (
    <ToolShell
      tool={tool}
      actions={
        <Button variant="secondary" size="sm" onClick={swap} className="gap-2">
          <ArrowLeftRight className="h-3.5 w-3.5" />
          {mode === 'json2yaml' ? 'JSON → YAML' : 'YAML → JSON'}
        </Button>
      }
    >
      <div className="grid min-h-0 flex-1 grid-cols-1 gap-4 lg:grid-cols-2">
        <Panel className="min-h-0">
          <PanelHeader title={mode === 'json2yaml' ? 'JSON' : 'YAML'} subtitle={t('common.input')} />
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            spellCheck={false}
            className="min-h-[260px] flex-1 resize-none rounded-none border-0 bg-transparent p-4 font-mono text-[13px] leading-6 shadow-none focus-visible:ring-0"
          />
        </Panel>
        <Panel className="min-h-0">
          <PanelHeader
            title={mode === 'json2yaml' ? 'YAML' : 'JSON'}
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
