import { useMemo } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import ToolShell from '@/components/tool/ToolShell';
import { Panel, PanelHeader } from '@/components/tool/Panel';
import CopyButton from '@/components/CopyButton';
import PasteButton from '@/components/PasteButton';
import { usePersistentState } from '@/hooks/usePersistentState';
import { getTool } from '@/tools';

function pascal(name: string): string {
  const base = name.replace(/[^a-zA-Z0-9]+/g, ' ').trim().split(/\s+/).map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join('');
  return base || 'Root';
}

function isValidIdent(key: string): boolean {
  return /^[A-Za-z_$][A-Za-z0-9_$]*$/.test(key);
}

type Ctx = { interfaces: Map<string, string>; usedNames: Set<string> };

function uniqueName(base: string, ctx: Ctx): string {
  let name = base;
  let i = 2;
  while (ctx.usedNames.has(name)) name = `${base}${i++}`;
  ctx.usedNames.add(name);
  return name;
}

function typeOf(value: unknown, hint: string, ctx: Ctx): string {
  if (value === null) return 'null';
  if (Array.isArray(value)) {
    if (value.length === 0) return 'unknown[]';
    const inner = Array.from(new Set(value.map((v) => typeOf(v, singular(hint), ctx))));
    return inner.length === 1 ? `${wrap(inner[0])}[]` : `(${inner.join(' | ')})[]`;
  }
  if (typeof value === 'object') {
    const name = uniqueName(pascal(hint), ctx);
    const body = objectBody(value as Record<string, unknown>, name, ctx);
    ctx.interfaces.set(name, body);
    return name;
  }
  return typeof value === 'number' ? 'number' : typeof value === 'boolean' ? 'boolean' : 'string';
}

function wrap(t: string): string {
  return t.includes(' | ') ? `(${t})` : t;
}

function singular(name: string): string {
  return name.endsWith('s') ? name.slice(0, -1) : name + 'Item';
}

function objectBody(obj: Record<string, unknown>, name: string, ctx: Ctx): string {
  const lines = Object.entries(obj).map(([key, val]) => {
    const t = typeOf(val, key, ctx);
    const k = isValidIdent(key) ? key : JSON.stringify(key);
    return `  ${k}: ${t};`;
  });
  return `interface ${name} {\n${lines.join('\n')}\n}`;
}

export default function JsonToTs() {
  const tool = getTool('json-to-ts')!;
  const [input, setInput] = usePersistentState('json-to-ts:input', '{\n  "id": 1,\n  "name": "DevDesk",\n  "tags": ["dev", "local"],\n  "owner": { "email": "a@b.c", "admin": true }\n}');
  const [rootName, setRootName] = usePersistentState('json-to-ts:root', 'Root');

  const result = useMemo(() => {
    if (!input.trim()) return { output: '', error: null as string | null };
    try {
      const parsed = JSON.parse(input);
      const ctx: Ctx = { interfaces: new Map(), usedNames: new Set() };
      const rootType = typeOf(parsed, rootName || 'Root', ctx);
      const parts = Array.from(ctx.interfaces.values()).reverse();
      if (!ctx.interfaces.has(rootType)) {
        parts.unshift(`type ${pascal(rootName || 'Root')} = ${rootType};`);
      }
      return { output: parts.join('\n\n'), error: null };
    } catch (e) {
      return { output: '', error: (e as Error).message };
    }
  }, [input, rootName]);

  return (
    <ToolShell tool={tool}>
      <div className="flex flex-wrap items-center gap-3">
        <label className="text-xs font-medium">Nom de l'interface racine</label>
        <Input
          value={rootName}
          onChange={(e) => setRootName(e.target.value)}
          className="h-8 w-40 font-mono text-sm"
        />
      </div>

      <div className="grid min-h-0 flex-1 grid-cols-1 gap-4 lg:grid-cols-2">
        <Panel className="min-h-0">
          <PanelHeader
            title="JSON"
            subtitle="Réponse d'API, fixture…"
            right={<PasteButton onPaste={setInput} />}
          />
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            spellCheck={false}
            className="min-h-[240px] flex-1 resize-none rounded-none border-0 bg-transparent p-4 font-mono text-[13px] leading-6 shadow-none focus-visible:ring-0"
          />
        </Panel>

        <Panel className="min-h-0">
          <PanelHeader
            title="TypeScript"
            subtitle="Interfaces générées"
            right={<CopyButton value={result.output} />}
          />
          {result.error ? (
            <div className="p-4 text-xs text-destructive">JSON invalide : {result.error}</div>
          ) : (
            <pre className="min-h-0 flex-1 overflow-auto bg-muted/[0.08] p-4 font-mono text-[13px] leading-6 text-foreground">
              {result.output || '// En attente de JSON…'}
            </pre>
          )}
        </Panel>
      </div>
    </ToolShell>
  );
}
