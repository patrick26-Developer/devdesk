// Carte « intelligente » : lit le presse-papiers (ou un collage manuel), devine le
// type de contenu et propose d'ouvrir directement le bon outil, déjà rempli.
import { useState } from 'react';
import { ArrowRight, ClipboardPaste, Sparkles } from 'lucide-react';

import { detect, prefillTool, type Detection } from '@/lib/detect';
import { getTool, getCategory } from '@/tools';
import { useT } from '@/i18n';

interface SmartPasteProps {
  onSelectTool: (id: string) => void;
}

export default function SmartPaste({ onSelectTool }: SmartPasteProps) {
  const tr = useT();
  const [content, setContent] = useState('');
  const [suggestions, setSuggestions] = useState<Detection[]>([]);
  const [analyzed, setAnalyzed] = useState(false);
  const [manual, setManual] = useState(false);

  const run = (text: string) => {
    setContent(text);
    setSuggestions(detect(text));
    setAnalyzed(true);
  };

  const analyze = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (!text.trim()) {
        setManual(true);
        setAnalyzed(false);
        return;
      }
      run(text);
    } catch {
      setManual(true);
      setAnalyzed(false);
    }
  };

  const open = (toolId: string) => {
    prefillTool(toolId, content);
    onSelectTool(toolId);
  };

  return (
    <section className="rounded-xl border border-border bg-card p-5">
      <div className="flex items-start gap-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-primary/15 bg-primary/10 text-primary">
          <Sparkles className="h-5 w-5" />
        </div>

        <div className="min-w-0 flex-1">
          <h2 className="text-sm font-semibold">{tr('smart.title')}</h2>
          <p className="mt-1 text-xs leading-5 text-muted-foreground">{tr('smart.desc')}</p>

          <div className="mt-4 flex flex-wrap gap-2">
            <button
              onClick={analyze}
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              <ClipboardPaste className="h-3.5 w-3.5" />
              {tr('smart.analyze')}
            </button>
            <button
              onClick={() => setManual((v) => !v)}
              className="rounded-lg border border-border px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground"
            >
              {tr('smart.manual')}
            </button>
          </div>

          {manual && (
            <textarea
              value={content}
              onChange={(e) => run(e.target.value)}
              placeholder={tr('smart.manualPlaceholder')}
              className="mt-3 h-24 w-full resize-none rounded-lg border border-input bg-background/60 p-3 font-mono text-xs outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
            />
          )}

          {analyzed && (
            <div className="mt-3">
              {content.trim() && !manual && (
                <pre className="mb-3 overflow-hidden truncate rounded-lg border border-border bg-background/60 px-3 py-2 font-mono text-[11px] text-muted-foreground">
                  {content.slice(0, 160)}
                </pre>
              )}
              {suggestions.length === 0 ? (
                <p className="text-xs text-muted-foreground">{tr('smart.none')}</p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {suggestions.map((s) => {
                    const tool = getTool(s.toolId);
                    if (!tool) return null;
                    const Icon = tool.icon;
                    return (
                      <button
                        key={s.toolId + s.label}
                        onClick={() => open(s.toolId)}
                        className="group inline-flex items-center gap-2 rounded-lg border border-border bg-background/50 px-3 py-1.5 text-xs font-medium transition-colors hover:border-primary/30 hover:bg-accent/40"
                      >
                        <Icon className={`h-3.5 w-3.5 ${getCategory(tool.category).text}`} />
                        {tr(s.label)}
                        <ArrowRight className="h-3 w-3 text-muted-foreground transition-colors group-hover:text-primary" />
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
