import { useMemo, useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { marked } from 'marked';
import DOMPurify from 'dompurify';
import {
  Eye,
  FileCode2,
  ShieldCheck,
} from 'lucide-react';

export default function MarkdownPreview() {
  const [markdown, setMarkdown] = useState(
    '# Titre\n\nTape du **Markdown** ici.',
  );

  const safeHtml = useMemo(() => {
    const rawHtml = marked.parse(markdown, {
      async: false,
    }) as string;

    return DOMPurify.sanitize(rawHtml);
  }, [markdown]);

  return (
    <div className="flex h-full flex-col gap-6 p-6 xl:p-8">
      {/* En-tête */}
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-blue-500/15 bg-blue-500/10 text-blue-500">
          <FileCode2 className="h-5 w-5" />
        </div>

        <div>
          <h2 className="text-lg font-semibold tracking-tight">
            Markdown Preview
          </h2>

          <p className="mt-0.5 text-xs text-muted-foreground">
            Écrivez du Markdown et visualisez instantanément son rendu.
          </p>
        </div>
      </div>

      {/* Sécurité */}
      <div className="flex items-center gap-2 rounded-lg border border-border bg-muted/30 px-3 py-2 text-xs text-muted-foreground">
        <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
        Aperçu nettoyé avec DOMPurify avant injection HTML.
      </div>

      {/* Éditeur */}
      <div className="grid min-h-0 flex-1 grid-cols-1 gap-4 lg:grid-cols-2">
        {/* Markdown */}
        <section className="flex min-h-0 flex-col overflow-hidden rounded-xl border border-border bg-card">
          <div className="flex items-center gap-2 border-b border-border px-4 py-3">
            <FileCode2 className="h-4 w-4 text-blue-500" />

            <div>
              <h3 className="text-sm font-medium">
                Markdown
              </h3>

              <p className="text-[11px] text-muted-foreground">
                Éditeur
              </p>
            </div>
          </div>

          <Textarea
            value={markdown}
            onChange={(e) => setMarkdown(e.target.value)}
            className="min-h-0 flex-1 resize-none rounded-none border-0 bg-muted/10 p-4 font-mono text-sm leading-6 focus-visible:ring-0"
            placeholder="# Votre titre..."
          />
        </section>

        {/* Preview */}
        <section className="flex min-h-0 flex-col overflow-hidden rounded-xl border border-border bg-card">
          <div className="flex items-center gap-2 border-b border-border px-4 py-3">
            <Eye className="h-4 w-4 text-emerald-500" />

            <div>
              <h3 className="text-sm font-medium">
                Aperçu
              </h3>

              <p className="text-[11px] text-muted-foreground">
                Rendu en temps réel
              </p>
            </div>
          </div>

          <div
            className="prose prose-sm dark:prose-invert min-h-0 max-w-none flex-1 overflow-auto bg-background p-6"
            dangerouslySetInnerHTML={{
              __html: safeHtml,
            }}
          />
        </section>
      </div>
    </div>
  );
}