import { useState } from 'react';
import {
  ArrowDownToLine,
  ArrowUpFromLine,
  RotateCcw,
  ShieldCheck,
} from 'lucide-react';

import { usePersistentState } from '@/hooks/usePersistentState';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import ToolShell from '@/components/tool/ToolShell';
import { Panel, PanelHeader, PanelFooter } from '@/components/tool/Panel';
import CopyButton from '@/components/CopyButton';
import PasteButton from '@/components/PasteButton';
import { getTool } from '@/tools';

export default function Base64Tool() {
  const tool = getTool('base64')!;
  const [input, setInput] = usePersistentState('base64:input', '');
  const [output, setOutput] = useState('');
  const [error, setError] = useState<string | null>(null);

  const encode = () => {
    try {
      setOutput(btoa(unescape(encodeURIComponent(input))));
      setError(null);
    } catch (e) {
      setError((e as Error).message);
      setOutput('');
    }
  };

  const decode = () => {
    try {
      setOutput(decodeURIComponent(escape(atob(input))));
      setError(null);
    } catch {
      setError('Chaîne Base64 invalide');
      setOutput('');
    }
  };

  const clear = () => {
    setInput('');
    setOutput('');
    setError(null);
  };

  return (
    <ToolShell
      tool={tool}
      actions={
        <Button
          variant="ghost"
          size="sm"
          onClick={clear}
          disabled={!input && !output && !error}
          className="gap-2 text-muted-foreground hover:text-foreground"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          Réinitialiser
        </Button>
      }
    >
      <div className="flex items-center gap-2 rounded-lg border border-border bg-muted/30 px-3.5 py-2.5 text-xs text-muted-foreground">
        <ShieldCheck className="h-4 w-4 shrink-0 text-emerald-500" />
        <span>Le traitement est effectué localement dans DevDesk.</span>
      </div>

      <div className="grid min-h-0 flex-1 grid-cols-1 gap-4 lg:grid-cols-2">
        <Panel className="min-h-0">
          <PanelHeader
            title="Entrée"
            subtitle="Texte ou chaîne Base64"
            right={<PasteButton onPaste={(t) => { setInput(t); setError(null); }} />}
          />
          <Textarea
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              setError(null);
            }}
            placeholder="Saisissez votre texte ou votre chaîne Base64..."
            className="min-h-[180px] flex-1 resize-none rounded-none border-0 bg-transparent p-4 font-mono text-sm shadow-none focus-visible:ring-0"
          />
          <PanelFooter>
            <span>Entrée</span>
            <span>{input.length} car.</span>
          </PanelFooter>
        </Panel>

        <Panel className="min-h-0">
          <PanelHeader
            title="Résultat"
            subtitle="Résultat de l'opération"
            right={<CopyButton value={output} />}
          />
          <Textarea
            value={output}
            readOnly
            placeholder="Le résultat apparaîtra ici..."
            className="min-h-[180px] flex-1 resize-none rounded-none border-0 bg-muted/[0.18] p-4 font-mono text-sm shadow-none focus-visible:ring-0"
          />
          <PanelFooter>
            <span>Résultat</span>
            <span>{output.length} car.</span>
          </PanelFooter>
        </Panel>
      </div>

      {error && (
        <div className="rounded-lg border border-destructive/20 bg-destructive/5 px-4 py-2.5 text-xs text-destructive">
          <span className="font-medium">Erreur :</span> {error}
        </div>
      )}

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4">
        <p className="text-[11px] text-muted-foreground">
          Choisissez une opération pour transformer votre contenu.
        </p>
        <div className="flex gap-2">
          <Button onClick={encode} disabled={!input} className="gap-2">
            <ArrowUpFromLine className="h-4 w-4" />
            Encoder
          </Button>
          <Button variant="secondary" onClick={decode} disabled={!input} className="gap-2">
            <ArrowDownToLine className="h-4 w-4" />
            Décoder
          </Button>
        </div>
      </div>
    </ToolShell>
  );
}
