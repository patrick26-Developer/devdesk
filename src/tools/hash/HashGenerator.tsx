// useEffect : recalcule automatiquement les hashes lorsque le texte change
import { useEffect, useState } from 'react';

import { Check, Hash, Info, RotateCcw, ShieldCheck } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import ToolShell from '@/components/tool/ToolShell';
import { Panel, PanelHeader, PanelFooter } from '@/components/tool/Panel';
import CopyButton from '@/components/CopyButton';
import { getTool } from '@/tools';
import { useT } from '@/i18n';

const ALGORITHMS = ['SHA-1', 'SHA-256', 'SHA-384', 'SHA-512'] as const;

async function computeHash(text: string, algorithm: string): Promise<string> {
  const data = new TextEncoder().encode(text);
  const hashBuffer = await window.crypto.subtle.digest(algorithm, data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

export default function HashGenerator() {
  const tool = getTool('hash')!;
  const t = useT();
  const [input, setInput] = useState('');
  const [hashes, setHashes] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!input) {
      setHashes({});
      return;
    }

    let cancelled = false;

    Promise.all(ALGORITHMS.map((algo) => computeHash(input, algo))).then((results) => {
      if (cancelled) return;
      const next: Record<string, string> = {};
      ALGORITHMS.forEach((algo, index) => {
        next[algo] = results[index];
      });
      setHashes(next);
    });

    return () => {
      cancelled = true;
    };
  }, [input]);

  return (
    <ToolShell
      tool={tool}
      actions={
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setInput('')}
          disabled={!input}
          className="gap-2 text-muted-foreground hover:text-foreground"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          {t('common.reset')}
        </Button>
      }
    >
      <div className="flex items-start gap-2 rounded-lg border border-border bg-muted/30 px-3.5 py-2.5 text-xs text-muted-foreground">
        <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
        <span>{t('ui.hash.note')}</span>
      </div>

      <Panel>
        <PanelHeader
          title={t('ui.hash.sourceTitle')}
          subtitle={t('ui.hash.sourceSub')}
        />
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={t('ui.hash.placeholder')}
          className="min-h-[130px] resize-none rounded-none border-0 bg-transparent p-4 font-mono text-sm shadow-none focus-visible:ring-0"
        />
        <PanelFooter>
          <span>{t('common.characters', { n: input.length })}</span>
          {input ? (
            <span className="flex items-center gap-1 text-emerald-500">
              <Check className="h-3 w-3" />
              {t('ui.hash.auto')}
            </span>
          ) : (
            <span>{t('common.waiting')}</span>
          )}
        </PanelFooter>
      </Panel>

      <div className="grid min-h-0 flex-1 grid-cols-1 gap-3 lg:grid-cols-2">
        {ALGORITHMS.map((algo) => {
          const value = hashes[algo];
          return (
            <Panel key={algo} className="min-h-0 hover:border-border">
              <PanelHeader
                icon={Hash}
                title={algo}
                subtitle="SHA family"
                right={<CopyButton value={value ?? ''} />}
              />
              <div className="min-h-0 flex-1 overflow-auto bg-muted/[0.15] p-4">
                <code className="block break-all font-mono text-xs leading-5 text-foreground">
                  {value || <span className="text-muted-foreground">—</span>}
                </code>
              </div>
              <PanelFooter>
                <span>{value ? t('common.characters', { n: value.length }) : t('ui.hash.waitingSource')}</span>
              </PanelFooter>
            </Panel>
          );
        })}
      </div>

      <div className="flex items-center gap-2 border-t border-border pt-3 text-[10px] text-muted-foreground">
        <Info className="h-3.5 w-3.5 shrink-0" />
        <span>{t('ui.hash.sha1note')}</span>
      </div>
    </ToolShell>
  );
}
