import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import ToolShell from '@/components/tool/ToolShell';
import { Panel } from '@/components/tool/Panel';
import CopyButton from '@/components/CopyButton';
import { getTool } from '@/tools';
import { RefreshCw } from 'lucide-react';

export default function UuidGenerator() {
  const tool = getTool('uuid')!;
  const [uuids, setUuids] = useState<string[]>(() => [crypto.randomUUID()]);
  const [count, setCount] = useState(1);

  const generate = () => {
    const safe = Math.min(50, Math.max(1, count));
    setUuids(Array.from({ length: safe }, () => crypto.randomUUID()));
  };

  return (
    <ToolShell
      tool={tool}
      actions={
        <Button onClick={generate} size="sm" className="gap-2">
          <RefreshCw className="h-3.5 w-3.5" />
          Générer
        </Button>
      }
    >
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2">
          <Input
            type="number"
            min={1}
            max={50}
            value={count}
            onChange={(e) => setCount(Math.min(50, Math.max(1, Number(e.target.value))))}
            className="h-9 w-20 font-mono text-sm"
          />
          <span className="text-xs text-muted-foreground">identifiant(s)</span>
        </div>

        {uuids.length > 1 && (
          <CopyButton value={uuids.join('\n')} label="Tout copier" variant="secondary" />
        )}
      </div>

      <Panel className="min-h-0 flex-1">
        <div className="min-h-0 flex-1 divide-y divide-border overflow-auto">
          {uuids.map((value, index) => (
            <div key={`${value}-${index}`} className="flex items-center justify-between gap-3 px-4 py-2.5">
              <code className="truncate font-mono text-sm text-foreground">{value}</code>
              <CopyButton value={value} />
            </div>
          ))}
        </div>
      </Panel>

      <div className="rounded-xl border border-border bg-muted/20 p-4">
        <p className="text-xs font-medium">UUID v4</p>
        <p className="mt-1 text-[11px] leading-5 text-muted-foreground">
          Les identifiants sont générés localement à partir de
          <code className="mx-1 rounded bg-muted px-1 font-mono">crypto.randomUUID()</code>
          sans requête réseau.
        </p>
      </div>
    </ToolShell>
  );
}
