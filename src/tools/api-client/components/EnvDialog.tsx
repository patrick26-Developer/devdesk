import { useEffect, useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

import { actions, useApiClient } from '../store';
import { newId, type Variable } from '../types';
import KvEditor from './KvEditor';
import { useT } from '@/i18n';

export default function EnvDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (o: boolean) => void }) {
  const state = useApiClient();
  const t = useT();
  const [selectedId, setSelectedId] = useState<string | null>(state.activeEnvId);

  useEffect(() => {
    if (open) setSelectedId(state.activeEnvId ?? state.environments[0]?.id ?? null);
  }, [open, state.activeEnvId, state.environments]);

  const env = state.environments.find((e) => e.id === selectedId) ?? null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{t('api.envTitle')}</DialogTitle>
          <DialogDescription>
            {t('api.envDesc')}
          </DialogDescription>
        </DialogHeader>

        <div className="flex max-h-[60vh] gap-4">
          {/* Liste des environnements */}
          <div className="w-44 shrink-0 space-y-1 overflow-auto border-r border-border pr-3">
            {state.environments.map((e) => (
              <button
                key={e.id}
                onClick={() => setSelectedId(e.id)}
                className={`flex w-full items-center justify-between rounded-md px-2 py-1.5 text-xs ${
                  selectedId === e.id ? 'bg-primary/10 text-primary' : 'hover:bg-accent'
                }`}
              >
                <span className="truncate">{e.name}</span>
                {state.activeEnvId === e.id && <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />}
              </button>
            ))}
            <button
              onClick={() => actions.addEnv(`Env ${state.environments.length + 1}`)}
              className="inline-flex items-center gap-1.5 rounded-md border border-dashed border-border px-2 py-1 text-xs text-muted-foreground hover:text-foreground"
            >
              <Plus className="h-3.5 w-3.5" />
              {t('api.envNew')}
            </button>
          </div>

          {/* Éditeur de l'environnement sélectionné */}
          <div className="min-w-0 flex-1 overflow-auto">
            {env ? (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Input
                    value={env.name}
                    onChange={(e) => actions.renameEnv(env.id, e.target.value)}
                    className="h-8 flex-1 text-sm font-medium"
                  />
                  <Button
                    variant={state.activeEnvId === env.id ? 'secondary' : 'default'}
                    size="sm"
                    onClick={() => actions.setActiveEnv(env.id)}
                  >
                    {state.activeEnvId === env.id ? t('api.envActive') : t('api.envActivate')}
                  </Button>
                  <button
                    onClick={() => actions.deleteEnv(env.id)}
                    className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                    aria-label={t('api.envDeleteEnv')}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>

                <KvEditor<Variable>
                  rows={env.variables}
                  onChange={(variables) => actions.setEnvVariables(env.id, variables)}
                  keyPlaceholder="baseUrl"
                  valuePlaceholder="http://localhost:3000"
                  addLabel={t('api.addVar')}
                  extra={(row, update) => (
                    <button
                      onClick={() => update({ secret: !row.secret })}
                      title={row.secret ? t('api.envSecret') : t('api.envClear')}
                      className={`shrink-0 rounded px-1.5 py-1 text-[10px] ${row.secret ? 'text-amber-500' : 'text-muted-foreground'}`}
                    >
                      {row.secret ? t('api.envSecret') : t('api.envClear')}
                    </button>
                  )}
                />
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                {t('api.collectionsEmpty')}
              </p>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Réexport utilitaire
export { newId };
