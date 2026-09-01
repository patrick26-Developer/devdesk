import { Input } from '@/components/ui/input';
import type { AuthConfig } from '../types';
import { useT } from '@/i18n';

const TYPE_KEYS: { value: AuthConfig['type']; key: string }[] = [
  { value: 'inherit', key: 'api.auth.inherit' },
  { value: 'none', key: 'api.auth.none' },
  { value: 'bearer', key: 'api.auth.token' },
  { value: 'basic', key: 'api.auth.token' },
  { value: 'apikey', key: 'api.auth.token' },
];

interface AuthEditorProps {
  auth: AuthConfig;
  onChange: (auth: AuthConfig) => void;
  /** Masquer l'option "hériter" (pour l'auth d'une collection). */
  allowInherit?: boolean;
}

export default function AuthEditor({ auth, onChange, allowInherit = true }: AuthEditorProps) {
  const t = useT();
  const LABELS: Record<AuthConfig['type'], string> = { inherit: t('api.auth.inherit'), none: t('api.auth.none'), bearer: 'Bearer Token', basic: 'Basic Auth', apikey: 'API Key' };
  const types = (allowInherit ? TYPE_KEYS : TYPE_KEYS.filter((x) => x.value !== 'inherit'));

  const setType = (type: AuthConfig['type']) => {
    switch (type) {
      case 'bearer':
        onChange({ type, token: auth.type === 'bearer' ? auth.token : '{{accessToken}}' });
        break;
      case 'basic':
        onChange({ type, username: '', password: '' });
        break;
      case 'apikey':
        onChange({ type, key: '', value: '', in: 'header' });
        break;
      default:
        onChange({ type });
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-1.5">
        {types.map((ty) => (
          <button
            key={ty.value}
            onClick={() => setType(ty.value)}
            className={`rounded-md border px-2.5 py-1 text-xs ${
              auth.type === ty.value
                ? 'border-primary/30 bg-primary/10 text-primary'
                : 'border-border text-muted-foreground hover:text-foreground'
            }`}
          >
            {LABELS[ty.value]}
          </button>
        ))}
      </div>

      {auth.type === 'bearer' && (
        <label className="block">
          <span className="mb-1 block text-xs font-medium">{t('api.auth.token')}</span>
          <Input
            value={auth.token}
            onChange={(e) => onChange({ ...auth, token: e.target.value })}
            placeholder="{{accessToken}}"
            className="h-9 font-mono text-xs"
          />
        </label>
      )}

      {auth.type === 'basic' && (
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          <label className="block">
            <span className="mb-1 block text-xs font-medium">{t('api.auth.user')}</span>
            <Input value={auth.username} onChange={(e) => onChange({ ...auth, username: e.target.value })} className="h-9 font-mono text-xs" />
          </label>
          <label className="block">
            <span className="mb-1 block text-xs font-medium">{t('api.auth.password')}</span>
            <Input value={auth.password} onChange={(e) => onChange({ ...auth, password: e.target.value })} className="h-9 font-mono text-xs" />
          </label>
        </div>
      )}

      {auth.type === 'apikey' && (
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
          <label className="block">
            <span className="mb-1 block text-xs font-medium">{t('api.auth.name')}</span>
            <Input value={auth.key} onChange={(e) => onChange({ ...auth, key: e.target.value })} placeholder="X-API-Key" className="h-9 font-mono text-xs" />
          </label>
          <label className="block">
            <span className="mb-1 block text-xs font-medium">{t('api.auth.value')}</span>
            <Input value={auth.value} onChange={(e) => onChange({ ...auth, value: e.target.value })} className="h-9 font-mono text-xs" />
          </label>
          <label className="block">
            <span className="mb-1 block text-xs font-medium">{t('api.auth.location')}</span>
            <select
              value={auth.in}
              onChange={(e) => onChange({ ...auth, in: e.target.value as 'header' | 'query' })}
              className="h-9 w-full rounded-lg border border-input bg-transparent px-2 text-xs"
            >
              <option value="header">{t('api.auth.inHeader')}</option>
              <option value="query">{t('api.auth.inQuery')}</option>
            </select>
          </label>
        </div>
      )}

      {auth.type === 'inherit' && (
        <p className="text-xs text-muted-foreground">
          {t('api.auth.inheritMsg')}
        </p>
      )}
    </div>
  );
}
