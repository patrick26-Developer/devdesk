import { useState } from 'react';
import { usePersistentState } from '@/hooks/usePersistentState';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import ToolShell from '@/components/tool/ToolShell';
import { Panel, PanelHeader, PanelFooter } from '@/components/tool/Panel';
import CopyButton from '@/components/CopyButton';
import PasteButton from '@/components/PasteButton';
import { getTool } from '@/tools';
import { useT } from '@/i18n';
import {
  Check,
  Code2,
  Minimize2,
  Sparkles,
  Trash2,
  XCircle,
} from 'lucide-react';

export default function JsonFormatter() {
  const tool = getTool('json-formatter')!;
  const t = useT();
  const [input, setInput] = usePersistentState('json-formatter:input', '');
  const [output, setOutput] = useState('');
  const [error, setError] = useState<string | null>(null);

  const transform = (compact: boolean) => {
    if (!input.trim()) {
      setError(t('ui.json.needInput'));
      setOutput('');
      return;
    }

    try {
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed, null, compact ? undefined : 2));
      setError(null);
    } catch (e) {
      setError((e as Error).message);
      setOutput('');
    }
  };

  const clearAll = () => {
    setInput('');
    setOutput('');
    setError(null);
  };

  const inputLines = input ? input.split('\n').length : 0;
  const outputLines = output ? output.split('\n').length : 0;

  return (
    <ToolShell
      tool={tool}
      actions={
        <Button
          variant="ghost"
          size="sm"
          onClick={clearAll}
          disabled={!input && !output && !error}
          className="gap-2 text-muted-foreground hover:text-foreground"
        >
          <Trash2 className="h-3.5 w-3.5" />
          {t('common.clear')}
        </Button>
      }
    >
      {/* Barre d'actions */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Button onClick={() => transform(false)} size="sm" className="gap-2">
            <Sparkles className="h-3.5 w-3.5" />
            {t('common.format')}
          </Button>
          <Button variant="secondary" size="sm" onClick={() => transform(true)} className="gap-2">
            <Minimize2 className="h-3.5 w-3.5" />
            {t('common.minify')}
          </Button>
        </div>

        {error ? (
          <div className="flex items-center gap-1.5 text-xs text-destructive">
            <XCircle className="h-3.5 w-3.5" />
            {t('common.invalidJson')}
          </div>
        ) : output ? (
          <div className="flex items-center gap-1.5 text-xs text-emerald-500">
            <Check className="h-3.5 w-3.5" />
            {t('common.validJson')}
          </div>
        ) : (
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Code2 className="h-3.5 w-3.5" />
            {t('common.waiting')}
          </div>
        )}
      </div>

      {/* Éditeurs */}
      <div className="flex min-h-0 flex-1 flex-col gap-4 lg:flex-row">
        <Panel className="min-h-0 flex-1">
          <PanelHeader
            title={t('common.input')}
            subtitle={t('ui.json.sourceJson')}
            icon={Code2}
            right={<PasteButton onPaste={(v) => { setInput(v); setError(null); }} />}
          />
          <Textarea
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              if (error) setError(null);
            }}
            placeholder={t('ui.json.placeholder')}
            spellCheck={false}
            className="min-h-[240px] flex-1 resize-none rounded-none border-0 bg-transparent p-4 font-mono text-[13px] leading-6 shadow-none focus-visible:ring-0"
          />
          <PanelFooter>
            <span>{t('ui.json.hintInput')}</span>
            <span>{t(inputLines <= 1 ? 'common.line' : 'common.lines', { n: inputLines })} · {t('common.characters', { n: input.length })}</span>
          </PanelFooter>
        </Panel>

        <Panel className="min-h-0 flex-1">
          <PanelHeader
            title={t('common.result')}
            subtitle={t('ui.json.transformed')}
            icon={Check}
            right={<CopyButton value={output} />}
          />
          <Textarea
            value={output}
            readOnly
            placeholder={t('common.resultPlaceholder')}
            spellCheck={false}
            className="min-h-[240px] flex-1 resize-none rounded-none border-0 bg-muted/[0.08] p-4 font-mono text-[13px] leading-6 shadow-none focus-visible:ring-0"
          />
          <PanelFooter>
            <span>{output ? t('common.resultReady') : t('common.waitingProcessing')}</span>
            <span>{t(outputLines <= 1 ? 'common.line' : 'common.lines', { n: outputLines })}</span>
          </PanelFooter>
        </Panel>
      </div>

      {error && (
        <div className="flex items-start gap-3 rounded-xl border border-destructive/20 bg-destructive/[0.05] px-4 py-3">
          <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-destructive" />
          <div className="min-w-0">
            <p className="text-xs font-medium text-destructive">{t('common.invalidJson')}</p>
            <p className="mt-1 break-all font-mono text-[11px] leading-5 text-muted-foreground">
              {error}
            </p>
          </div>
        </div>
      )}
    </ToolShell>
  );
}
