import { useMemo } from 'react';
import { usePersistentState } from '@/hooks/usePersistentState';
import { marked } from 'marked';
import DOMPurify from 'dompurify';

import { Textarea } from '@/components/ui/textarea';
import ToolShell from '@/components/tool/ToolShell';
import { Panel, PanelHeader } from '@/components/tool/Panel';
import CopyButton from '@/components/CopyButton';
import { getTool } from '@/tools';
import { Eye, FileCode2, ShieldCheck } from 'lucide-react';

export default function MarkdownPreview() {
  const tool = getTool('markdown')!;
  const [markdown, setMarkdown] = usePersistentState(
    'markdown:content',
    '# Titre\n\nTape du **Markdown** ici.'
  );

  const safeHtml = useMemo(() => {
    const rawHtml = marked.parse(markdown, { async: false }) as string;
    return DOMPurify.sanitize(rawHtml);
  }, [markdown]);

  return (
    <ToolShell tool={tool}>
      <div className="flex items-center gap-2 rounded-lg border border-border bg-muted/30 px-3 py-2 text-xs text-muted-foreground">
        <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
        Aperçu nettoyé avec DOMPurify avant injection HTML.
      </div>

      <div className="grid min-h-0 flex-1 grid-cols-1 gap-4 lg:grid-cols-2">
        <Panel className="min-h-0">
          <PanelHeader icon={FileCode2} title="Markdown" subtitle="Éditeur" />
          <Textarea
            value={markdown}
            onChange={(e) => setMarkdown(e.target.value)}
            className="min-h-0 flex-1 resize-none rounded-none border-0 bg-muted/10 p-4 font-mono text-sm leading-6 focus-visible:ring-0"
            placeholder="# Votre titre..."
          />
        </Panel>

        <Panel className="min-h-0">
          <PanelHeader
            icon={Eye}
            title="Aperçu"
            subtitle="Rendu en temps réel"
            right={<CopyButton value={safeHtml} label="HTML" />}
          />
          <div
            className="prose prose-sm dark:prose-invert min-h-0 max-w-none flex-1 overflow-auto bg-background p-6"
            dangerouslySetInnerHTML={{ __html: safeHtml }}
          />
        </Panel>
      </div>
    </ToolShell>
  );
}
