import { useMemo } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import ToolShell from '@/components/tool/ToolShell';
import { Panel, PanelHeader } from '@/components/tool/Panel';
import CopyButton from '@/components/CopyButton';
import PasteButton from '@/components/PasteButton';
import { usePersistentState } from '@/hooks/usePersistentState';
import { getTool } from '@/tools';
import { ArrowLeftRight } from 'lucide-react';

type Target = 'json' | 'html' | 'url' | 'backslash' | 'sql' | 'shell' | 'regex';

const TARGETS: { key: Target; label: string; hint: string }[] = [
  { key: 'json', label: 'Chaîne JSON', hint: 'contenu entre guillemets' },
  { key: 'html', label: 'Entités HTML', hint: '& < > " \'' },
  { key: 'url', label: 'URL', hint: 'encodeURIComponent' },
  { key: 'backslash', label: 'Backslash', hint: '\\n \\t \\" \\\\' },
  { key: 'sql', label: 'SQL', hint: "quote simple doublée" },
  { key: 'shell', label: 'Shell', hint: 'guillemets simples POSIX' },
  { key: 'regex', label: 'RegExp', hint: 'métacaractères échappés' },
];

const HTML_ENTITIES: Record<string, string> = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };

function escape(text: string, target: Target): string {
  switch (target) {
    case 'json':
      return JSON.stringify(text).slice(1, -1);
    case 'html':
      return text.replace(/[&<>"']/g, (c) => HTML_ENTITIES[c]);
    case 'url':
      return encodeURIComponent(text);
    case 'backslash':
      return text.replace(/\\/g, '\\\\').replace(/\n/g, '\\n').replace(/\r/g, '\\r').replace(/\t/g, '\\t').replace(/"/g, '\\"');
    case 'sql':
      return text.replace(/'/g, "''");
    case 'shell':
      return `'${text.replace(/'/g, `'\\''`)}'`;
    case 'regex':
      return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }
}

function unescape(text: string, target: Target): string {
  switch (target) {
    case 'json':
      return JSON.parse(`"${text.replace(/"/g, '\\"')}"`);
    case 'html':
      return text
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&#0?39;/g, "'")
        .replace(/&apos;/g, "'");
    case 'url':
      return decodeURIComponent(text);
    case 'backslash':
      return text.replace(/\\n/g, '\n').replace(/\\r/g, '\r').replace(/\\t/g, '\t').replace(/\\"/g, '"').replace(/\\\\/g, '\\');
    case 'sql':
      return text.replace(/''/g, "'");
    case 'shell':
      return text.replace(/^'|'$/g, '').replace(/'\\''/g, "'");
    case 'regex':
      return text.replace(/\\([.*+?^${}()|[\]\\])/g, '$1');
  }
}

export default function StringEscape() {
  const tool = getTool('string-escape')!;
  const [target, setTarget] = usePersistentState<Target>('string-escape:target', 'json');
  const [direction, setDirection] = usePersistentState<'escape' | 'unescape'>('string-escape:dir', 'escape');
  const [input, setInput] = usePersistentState('string-escape:input', 'Ligne 1\n"Bonjour", dit-il — 100% <ok>');

  const result = useMemo(() => {
    if (!input) return { output: '', error: null as string | null };
    try {
      return { output: direction === 'escape' ? escape(input, target) : unescape(input, target), error: null };
    } catch (e) {
      return { output: '', error: (e as Error).message };
    }
  }, [input, target, direction]);

  return (
    <ToolShell
      tool={tool}
      actions={
        <Button
          variant="secondary"
          size="sm"
          onClick={() => setDirection(direction === 'escape' ? 'unescape' : 'escape')}
          className="gap-2"
        >
          <ArrowLeftRight className="h-3.5 w-3.5" />
          {direction === 'escape' ? 'Échapper' : 'Déséchapper'}
        </Button>
      }
    >
      <div className="flex flex-wrap gap-1.5">
        {TARGETS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTarget(t.key)}
            title={t.hint}
            className={`rounded-md border px-2.5 py-1 text-xs ${
              target === t.key
                ? 'border-primary/30 bg-primary/10 text-primary'
                : 'border-border text-muted-foreground hover:text-foreground'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="grid min-h-0 flex-1 grid-cols-1 gap-4 lg:grid-cols-2">
        <Panel className="min-h-0">
          <PanelHeader
            title="Entrée"
            subtitle={direction === 'escape' ? 'Texte brut' : 'Texte échappé'}
            right={<PasteButton onPaste={setInput} />}
          />
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="min-h-[200px] flex-1 resize-none rounded-none border-0 bg-transparent p-4 font-mono text-sm shadow-none focus-visible:ring-0"
          />
        </Panel>
        <Panel className="min-h-0">
          <PanelHeader title="Résultat" right={<CopyButton value={result.output} />} />
          {result.error ? (
            <div className="p-4 text-xs text-destructive">Erreur : {result.error}</div>
          ) : (
            <pre className="min-h-0 flex-1 overflow-auto whitespace-pre-wrap break-all bg-muted/[0.08] p-4 font-mono text-sm text-foreground">
              {result.output || '—'}
            </pre>
          )}
        </Panel>
      </div>
    </ToolShell>
  );
}
