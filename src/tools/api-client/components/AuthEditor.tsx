import { Input } from '@/components/ui/input';
import type { AuthConfig } from '../types';

const TYPES: { value: AuthConfig['type']; label: string }[] = [
  { value: 'inherit', label: 'Hériter de la collection' },
  { value: 'none', label: 'Aucune' },
  { value: 'bearer', label: 'Bearer Token' },
  { value: 'basic', label: 'Basic Auth' },
  { value: 'apikey', label: 'API Key' },
];

interface AuthEditorProps {
  auth: AuthConfig;
  onChange: (auth: AuthConfig) => void;
  /** Masquer l'option "hériter" (pour l'auth d'une collection). */
  allowInherit?: boolean;
}

export default function AuthEditor({ auth, onChange, allowInherit = true }: AuthEditorProps) {
  const types = allowInherit ? TYPES : TYPES.filter((t) => t.value !== 'inherit');

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
        {types.map((t) => (
          <button
            key={t.value}
            onClick={() => setType(t.value)}
            className={`rounded-md border px-2.5 py-1 text-xs ${
              auth.type === t.value
                ? 'border-primary/30 bg-primary/10 text-primary'
                : 'border-border text-muted-foreground hover:text-foreground'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {auth.type === 'bearer' && (
        <label className="block">
          <span className="mb-1 block text-xs font-medium">Token</span>
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
            <span className="mb-1 block text-xs font-medium">Utilisateur</span>
            <Input value={auth.username} onChange={(e) => onChange({ ...auth, username: e.target.value })} className="h-9 font-mono text-xs" />
          </label>
          <label className="block">
            <span className="mb-1 block text-xs font-medium">Mot de passe</span>
            <Input value={auth.password} onChange={(e) => onChange({ ...auth, password: e.target.value })} className="h-9 font-mono text-xs" />
          </label>
        </div>
      )}

      {auth.type === 'apikey' && (
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
          <label className="block">
            <span className="mb-1 block text-xs font-medium">Nom</span>
            <Input value={auth.key} onChange={(e) => onChange({ ...auth, key: e.target.value })} placeholder="X-API-Key" className="h-9 font-mono text-xs" />
          </label>
          <label className="block">
            <span className="mb-1 block text-xs font-medium">Valeur</span>
            <Input value={auth.value} onChange={(e) => onChange({ ...auth, value: e.target.value })} className="h-9 font-mono text-xs" />
          </label>
          <label className="block">
            <span className="mb-1 block text-xs font-medium">Emplacement</span>
            <select
              value={auth.in}
              onChange={(e) => onChange({ ...auth, in: e.target.value as 'header' | 'query' })}
              className="h-9 w-full rounded-lg border border-input bg-transparent px-2 text-xs"
            >
              <option value="header">En-tête</option>
              <option value="query">Paramètre d'URL</option>
            </select>
          </label>
        </div>
      )}

      {auth.type === 'inherit' && (
        <p className="text-xs text-muted-foreground">
          La requête utilise l'authentification définie au niveau de sa collection.
        </p>
      )}
    </div>
  );
}
