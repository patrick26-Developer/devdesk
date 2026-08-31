import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import ToolShell from '@/components/tool/ToolShell';
import { Panel, PanelHeader, PanelFooter } from '@/components/tool/Panel';
import CopyButton from '@/components/CopyButton';
import { getTool } from '@/tools';
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
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState<string | null>(null);

  const transform = (compact: boolean) => {
    if (!input.trim()) {
      setError('Veuillez saisir un JSON à traiter.');
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
          Effacer
        </Button>
      }
    >
      {/* Barre d'actions */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Button onClick={() => transform(false)} size="sm" className="gap-2">
            <Sparkles className="h-3.5 w-3.5" />
            Formater
          </Button>
          <Button variant="secondary" size="sm" onClick={() => transform(true)} className="gap-2">
            <Minimize2 className="h-3.5 w-3.5" />
            Minifier
          </Button>
        </div>

        {error ? (
          <div className="flex items-center gap-1.5 text-xs text-destructive">
            <XCircle className="h-3.5 w-3.5" />
            JSON invalide
          </div>
        ) : output ? (
          <div className="flex items-center gap-1.5 text-xs text-emerald-500">
            <Check className="h-3.5 w-3.5" />
            JSON valide
          </div>
        ) : (
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Code2 className="h-3.5 w-3.5" />
            En attente
          </div>
        )}
      </div>

      {/* Éditeurs */}
      <div className="flex min-h-0 flex-1 flex-col gap-4 lg:flex-row">
        <Panel className="min-h-0 flex-1">
          <PanelHeader title="Entrée" subtitle="JSON source" icon={Code2} />
          <Textarea
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              if (error) setError(null);
            }}
            placeholder={'{\n  "exemple": "collez votre JSON ici"\n}'}
            spellCheck={false}
            className="min-h-[240px] flex-1 resize-none rounded-none border-0 bg-transparent p-4 font-mono text-[13px] leading-6 shadow-none focus-visible:ring-0"
          />
          <PanelFooter>
            <span>Collez ou saisissez votre JSON</span>
            <span>{inputLines <= 1 ? `${inputLines} ligne` : `${inputLines} lignes`} · {input.length} car.</span>
          </PanelFooter>
        </Panel>

        <Panel className="min-h-0 flex-1">
          <PanelHeader
            title="Résultat"
            subtitle="JSON transformé"
            icon={Check}
            right={<CopyButton value={output} />}
          />
          <Textarea
            value={output}
            readOnly
            placeholder="Le résultat apparaîtra ici..."
            spellCheck={false}
            className="min-h-[240px] flex-1 resize-none rounded-none border-0 bg-muted/[0.08] p-4 font-mono text-[13px] leading-6 shadow-none focus-visible:ring-0"
          />
          <PanelFooter>
            <span>{output ? 'Résultat prêt' : 'En attente de traitement'}</span>
            <span>{outputLines <= 1 ? `${outputLines} ligne` : `${outputLines} lignes`}</span>
          </PanelFooter>
        </Panel>
      </div>

      {error && (
        <div className="flex items-start gap-3 rounded-xl border border-destructive/20 bg-destructive/[0.05] px-4 py-3">
          <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-destructive" />
          <div className="min-w-0">
            <p className="text-xs font-medium text-destructive">JSON invalide</p>
            <p className="mt-1 break-all font-mono text-[11px] leading-5 text-muted-foreground">
              {error}
            </p>
          </div>
        </div>
      )}
    </ToolShell>
  );
}
