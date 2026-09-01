import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import ToolShell from '@/components/tool/ToolShell';
import { Panel, PanelHeader } from '@/components/tool/Panel';
import CopyButton from '@/components/CopyButton';
import { getTool } from '@/tools';
import { useT } from '@/i18n';
import { ArrowLeft, ArrowRight } from 'lucide-react';

export default function UrlTool() {
  const tool = getTool('url')!;
  const t = useT();
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState<string | null>(null);

  const encode = () => {
    setOutput(encodeURIComponent(input));
    setError(null);
  };

  const decode = () => {
    try {
      setOutput(decodeURIComponent(input));
      setError(null);
    } catch {
      setError(t('ui.url.invalid'));
      setOutput('');
    }
  };

  return (
    <ToolShell tool={tool}>
      <div className="grid min-h-0 flex-1 grid-cols-1 gap-4 lg:grid-cols-2">
        <Panel className="min-h-0">
          <PanelHeader title={t('common.input')} subtitle={t('ui.url.inputSub')} />
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={t('ui.url.placeholder')}
            className="min-h-[160px] flex-1 resize-none rounded-none border-0 p-4 font-mono text-sm focus-visible:ring-0"
          />
        </Panel>

        <Panel className="min-h-0">
          <PanelHeader title={t('common.result')} subtitle={t('ui.url.resultSub')} right={<CopyButton value={output} />} />
          <Textarea
            value={output}
            readOnly
            placeholder={t('common.resultPlaceholder')}
            className="min-h-[160px] flex-1 resize-none rounded-none border-0 bg-muted/20 p-4 font-mono text-sm focus-visible:ring-0"
          />
        </Panel>
      </div>

      {error && (
        <p className="rounded-lg border border-destructive/20 bg-destructive/5 p-3 text-xs text-destructive">
          {t('common.error')} : {error}
        </p>
      )}

      <div className="flex gap-2 border-t border-border pt-4">
        <Button onClick={encode} disabled={!input} className="gap-2">
          <ArrowRight className="h-4 w-4" />
          {t('common.encode')}
        </Button>
        <Button variant="secondary" onClick={decode} disabled={!input} className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          {t('common.decode')}
        </Button>
      </div>
    </ToolShell>
  );
}
