import { Plus, Trash2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { newId, type ExtractRule } from '../types';
import { useT } from '@/i18n';

interface ExtractEditorProps {
  rules: ExtractRule[];
  onChange: (rules: ExtractRule[]) => void;
}

export default function ExtractEditor({ rules, onChange }: ExtractEditorProps) {
  const t = useT();
  const update = (id: string, patch: Partial<ExtractRule>) =>
    onChange(rules.map((r) => (r.id === id ? { ...r, ...patch } : r)));
  const add = () =>
    onChange([...rules, { id: newId('x'), enabled: true, source: 'body', path: '', target: '' }]);

  return (
    <div className="space-y-3">
      <p className="text-xs leading-5 text-muted-foreground">{t('api.extractHint')}</p>

      {rules.map((rule) => (
        <div key={rule.id} className="flex flex-wrap items-center gap-1.5">
          <input
            type="checkbox"
            checked={rule.enabled}
            onChange={(e) => update(rule.id, { enabled: e.target.checked })}
            className="accent-primary"
          />
          <select
            value={rule.source}
            onChange={(e) => update(rule.id, { source: e.target.value as 'body' | 'header' })}
            className="h-8 rounded-lg border border-input bg-transparent px-2 text-xs"
          >
            <option value="body">Body</option>
            <option value="header">Header</option>
          </select>
          <Input
            value={rule.path}
            onChange={(e) => update(rule.id, { path: e.target.value })}
            placeholder={rule.source === 'body' ? 'accessToken' : 'x-request-id'}
            className="h-8 flex-1 font-mono text-xs"
          />
          <span className="text-xs text-muted-foreground">→</span>
          <Input
            value={rule.target}
            onChange={(e) => update(rule.id, { target: e.target.value })}
            placeholder="accessToken"
            className="h-8 flex-1 font-mono text-xs"
          />
          <button
            onClick={() => onChange(rules.filter((r) => r.id !== rule.id))}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
            aria-label={t('common.delete')}
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      ))}

      <button
        onClick={add}
        className="inline-flex items-center gap-1.5 rounded-md border border-dashed border-border px-2.5 py-1 text-xs text-muted-foreground hover:border-primary/30 hover:text-foreground"
      >
        <Plus className="h-3.5 w-3.5" />
        {t('api.addRule')}
      </button>
    </div>
  );
}
