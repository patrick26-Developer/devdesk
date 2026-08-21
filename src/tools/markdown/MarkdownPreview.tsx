// useMemo : recalcule le HTML rendu uniquement quand le texte source change
import { useMemo, useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
// marked : parseur Markdown -> HTML
import { marked } from 'marked';
// DOMPurify : nettoie le HTML généré pour retirer tout script/attribut dangereux avant de l'injecter dans le DOM
import DOMPurify from 'dompurify';

export default function MarkdownPreview() {
  // Le texte Markdown brut saisi par l'utilisateur
  const [markdown, setMarkdown] = useState('# Titre\n\nTape du **Markdown** ici.');

  // Convertit le Markdown en HTML sûr, recalculé uniquement quand le texte change
  const safeHtml = useMemo(() => {
    // marked.parse peut renvoyer une Promise selon la config ; en usage synchrone standard elle renvoie une string
    const rawHtml = marked.parse(markdown, { async: false }) as string;
    // DOMPurify.sanitize retire tout <script>, onclick=, etc. avant qu'on injecte ce HTML dans le DOM réel
    return DOMPurify.sanitize(rawHtml);
  }, [markdown]);

  return (
    <div className="flex flex-col h-full p-6 gap-4">
      <h2 className="text-lg font-semibold">Markdown Preview</h2>

      {/* Deux colonnes : édition à gauche, rendu à droite */}
      <div className="grid grid-cols-2 gap-4 flex-1 min-h-0">
        <div className="flex flex-col gap-2">
          <label className="text-sm text-muted-foreground">Markdown</label>
          <Textarea
            value={markdown}
            onChange={(e) => setMarkdown(e.target.value)}
            className="flex-1 font-mono text-sm resize-none"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-sm text-muted-foreground">Aperçu</label>
          {/* dangerouslySetInnerHTML : nécessaire pour injecter du HTML généré dynamiquement.
              C'est sûr ici UNIQUEMENT parce que le HTML a été nettoyé par DOMPurify juste avant. */}
          <div
            className="flex-1 overflow-auto border rounded-md p-4 prose prose-sm max-w-none dark:prose-invert"
            dangerouslySetInnerHTML={{ __html: safeHtml }}
          />
        </div>
      </div>
    </div>
  );
}