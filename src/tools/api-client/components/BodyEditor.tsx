import { useMemo } from 'react';
import { Textarea } from '@/components/ui/textarea';
import type { BodyConfig, BodyType } from '../types';
import KvEditor from './KvEditor';
import { useT } from '@/i18n';

const TYPES: { value: BodyType; labelKey?: string; label?: string }[] = [
  { value: 'none', labelKey: 'api.body.none' },
  { value: 'json', label: 'JSON' },
  { value: 'text', labelKey: 'api.body.text' },
  { value: 'urlencoded', label: 'x-www-form-urlencoded' },
  { value: 'form', label: 'form-data' },
  { value: 'graphql', label: 'GraphQL' },
];

interface BodyEditorProps {
  body: BodyConfig;
  onChange: (body: BodyConfig) => void;
  disabled?: boolean;
}

export default function BodyEditor({ body, onChange, disabled }: BodyEditorProps) {
  const t = useT();
  const jsonState = useMemo(() => {
    if (body.type !== 'json' || !body.content.trim()) return null;
    try {
      JSON.parse(body.content);
      return { valid: true as const };
    } catch (e) {
      return { valid: false as const, message: (e as Error).message };
    }
  }, [body.type, body.content]);

  if (disabled) {
    return <p className="text-xs text-muted-foreground">{t('api.body.disabled')}</p>;
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-3">
      <div className="flex flex-wrap gap-1.5">
        {TYPES.map((ty) => (
          <button
            key={ty.value}
            onClick={() => onChange({ ...body, type: ty.value })}
            className={`rounded-md border px-2.5 py-1 text-xs ${
              body.type === ty.value
                ? 'border-primary/30 bg-primary/10 text-primary'
                : 'border-border text-muted-foreground hover:text-foreground'
            }`}
          >
            {ty.labelKey ? t(ty.labelKey) : ty.label}
          </button>
        ))}
      </div>

      {(body.type === 'json' || body.type === 'text' || body.type === 'graphql') && (
        <>
          <Textarea
            value={body.content}
            onChange={(e) => onChange({ ...body, content: e.target.value })}
            spellCheck={false}
            placeholder={body.type === 'graphql' ? 'query { ... }' : body.type === 'json' ? '{\n  "key": "value"\n}' : ''}
            className="min-h-0 flex-1 resize-none font-mono text-xs leading-5"
          />
          {jsonState && (
            <p className={`text-[11px] ${jsonState.valid ? 'text-emerald-500' : 'text-destructive'}`}>
              {jsonState.valid ? '✓ JSON valide' : `✗ JSON invalide — ${jsonState.message}`}
            </p>
          )}
        </>
      )}

      {(body.type === 'urlencoded' || body.type === 'form') && (
        <KvEditor
          rows={body.fields}
          onChange={(fields) => onChange({ ...body, fields })}
          addLabel={t('api.addField')}
        />
      )}

      {body.type === 'none' && <p className="text-xs text-muted-foreground">{t('api.body.noneMsg')}</p>}
    </div>
  );
}
