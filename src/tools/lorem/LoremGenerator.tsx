import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import ToolShell from '@/components/tool/ToolShell';
import { Panel, PanelHeader } from '@/components/tool/Panel';
import CopyButton from '@/components/CopyButton';
import { getTool } from '@/tools';
import { useT } from '@/i18n';
import { RefreshCw } from 'lucide-react';

const WORDS = [
  'lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit', 'sed', 'do',
  'eiusmod', 'tempor', 'incididunt', 'ut', 'labore', 'et', 'dolore', 'magna', 'aliqua', 'enim',
  'ad', 'minim', 'veniam', 'quis', 'nostrud', 'exercitation', 'ullamco', 'laboris', 'nisi',
  'aliquip', 'ex', 'ea', 'commodo', 'consequat', 'duis', 'aute', 'irure', 'in', 'reprehenderit',
  'voluptate', 'velit', 'esse', 'cillum', 'eu', 'fugiat', 'nulla', 'pariatur',
];

const randomWord = () => WORDS[Math.floor(Math.random() * WORDS.length)];

function generateSentence(): string {
  const wordCount = 6 + Math.floor(Math.random() * 10);
  const sentence = Array.from({ length: wordCount }, randomWord).join(' ');
  return sentence.charAt(0).toUpperCase() + sentence.slice(1) + '.';
}

function generateParagraph(): string {
  const sentenceCount = 4 + Math.floor(Math.random() * 4);
  return Array.from({ length: sentenceCount }, generateSentence).join(' ');
}

export default function LoremGenerator() {
  const tool = getTool('lorem')!;
  const t = useT();
  const [count, setCount] = useState(3);
  const [output, setOutput] = useState('');

  const generate = () => {
    const safeCount = Math.min(20, Math.max(1, count));
    setOutput(Array.from({ length: safeCount }, generateParagraph).join('\n\n'));
  };

  return (
    <ToolShell
      tool={tool}
      actions={
        <Button onClick={generate} size="sm" className="gap-2">
          <RefreshCw className="h-3.5 w-3.5" />
          {t('common.generate')}
        </Button>
      }
    >
      <div className="flex flex-wrap items-center gap-2">
        <Input
          type="number"
          min={1}
          max={20}
          value={count}
          onChange={(e) => setCount(Math.min(20, Math.max(1, Number(e.target.value))))}
          className="h-9 w-20 font-mono text-sm"
          aria-label={t('ui.lorem.countLabel')}
        />
        <span className="text-xs text-muted-foreground">{t('ui.lorem.paragraphs')}</span>
      </div>

      <Panel className="min-h-0 flex-1">
        <PanelHeader
          title={t('ui.lorem.title')}
          subtitle={t('ui.lorem.subtitle')}
          right={output ? <CopyButton value={output} label={t('common.copy')} /> : undefined}
        />
        <Textarea
          value={output}
          readOnly
          placeholder={t('ui.lorem.placeholder')}
          className="min-h-0 flex-1 resize-none rounded-none border-0 bg-muted/10 p-5 font-mono text-xs leading-6 focus-visible:ring-0"
        />
      </Panel>
    </ToolShell>
  );
}
