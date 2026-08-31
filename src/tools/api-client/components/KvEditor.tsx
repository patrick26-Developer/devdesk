import type { ReactNode } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { newId } from '../types';

interface Row {
  id: string;
  key: string;
  value: string;
  enabled: boolean;
}

interface KvEditorProps<T extends Row> {
  rows: T[];
  onChange: (rows: T[]) => void;
  keyPlaceholder?: string;
  valuePlaceholder?: string;
  addLabel?: string;
  /** Colonne supplémentaire (ex. "secret") rendue avant la corbeille. */
  extra?: (row: T, update: (patch: Partial<T>) => void) => ReactNode;
}

export default function KvEditor<T extends Row>({
  rows,
  onChange,
  keyPlaceholder = 'Clé',
  valuePlaceholder = 'Valeur',
  addLabel = 'Ajouter',
  extra,
}: KvEditorProps<T>) {
  const update = (id: string, patch: Partial<T>) => onChange(rows.map((r) => (r.id === id ? { ...r, ...patch } : r)));
  const remove = (id: string) => onChange(rows.filter((r) => r.id !== id));
  const add = () => onChange([...rows, { id: newId('kv'), key: '', value: '', enabled: true } as T]);

  return (
    <div className="space-y-1.5">
      {rows.map((row) => (
        <div key={row.id} className="flex items-center gap-1.5">
          <input
            type="checkbox"
            checked={row.enabled}
            onChange={(e) => update(row.id, { enabled: e.target.checked } as Partial<T>)}
            className="accent-primary"
            aria-label="Activer"
          />
          <Input
            value={row.key}
            onChange={(e) => update(row.id, { key: e.target.value } as Partial<T>)}
            placeholder={keyPlaceholder}
            className="h-8 flex-1 font-mono text-xs"
          />
          <Input
            value={row.value}
            onChange={(e) => update(row.id, { value: e.target.value } as Partial<T>)}
            placeholder={valuePlaceholder}
            className="h-8 flex-[1.5] font-mono text-xs"
          />
          {extra?.(row, (patch) => update(row.id, patch))}
          <button
            onClick={() => remove(row.id)}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
            aria-label="Supprimer"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      ))}
      <button
        onClick={add}
        className="mt-1 inline-flex items-center gap-1.5 rounded-md border border-dashed border-border px-2.5 py-1 text-xs text-muted-foreground hover:border-primary/30 hover:text-foreground"
      >
        <Plus className="h-3.5 w-3.5" />
        {addLabel}
      </button>
    </div>
  );
}
