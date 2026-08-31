import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { notify } from '@/lib/notify';

import { actions, useApiClient } from '../store';
import { parseSpec } from '../openapi';
import { auditCollection, collectionToMarkdown } from '../assist';
import type { Variable } from '../types';
import KvEditor from './KvEditor';
import AuthEditor from './AuthEditor';

export default function CollectionDialog({
  collectionId,
  onOpenChange,
}: {
  collectionId: string | null;
  onOpenChange: (o: boolean) => void;
}) {
  const state = useApiClient();
  const collection = state.collections.find((c) => c.id === collectionId) ?? null;
  const [tab, setTab] = useState<'settings' | 'audit' | 'import'>(collectionId ? 'settings' : 'import');
  const [spec, setSpec] = useState('');

  const audit = collection ? auditCollection(collection) : [];

  const importSpec = () => {
    try {
      const col = parseSpec(spec);
      actions.replaceState({ ...state, collections: [...state.collections, col] });
      notify(`Collection « ${col.name} » importée`);
      onOpenChange(false);
    } catch (e) {
      notify('Import impossible', { type: 'error', description: (e as Error).message });
    }
  };

  return (
    <Dialog open onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>{collection ? collection.name : 'Collection'}</DialogTitle>
          <DialogDescription>Auth et variables héritées par toutes les requêtes, ou import de spec.</DialogDescription>
        </DialogHeader>

        <div className="flex gap-1 border-b border-border pb-2">
          <button
            onClick={() => setTab('settings')}
            className={`rounded-md px-2.5 py-1 text-xs ${tab === 'settings' ? 'bg-primary/10 text-primary' : 'text-muted-foreground'}`}
          >
            Paramètres
          </button>
          {collection && (
            <button
              onClick={() => setTab('audit')}
              className={`flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs ${tab === 'audit' ? 'bg-primary/10 text-primary' : 'text-muted-foreground'}`}
            >
              Audit & doc
              {audit.some((a) => a.level === 'warn') && (
                <span className="rounded-full bg-amber-500/20 px-1.5 text-[10px] text-amber-500">
                  {audit.filter((a) => a.level === 'warn').length}
                </span>
              )}
            </button>
          )}
          <button
            onClick={() => setTab('import')}
            className={`rounded-md px-2.5 py-1 text-xs ${tab === 'import' ? 'bg-primary/10 text-primary' : 'text-muted-foreground'}`}
          >
            Importer OpenAPI / Swagger
          </button>
        </div>

        {tab === 'audit' && collection && (
          <div className="max-h-[55vh] space-y-4 overflow-auto">
            <div>
              <div className="mb-2 flex items-center justify-between">
                <p className="text-xs font-medium">Revue de la collection</p>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => {
                    navigator.clipboard.writeText(collectionToMarkdown(collection)).then(
                      () => notify('Documentation Markdown copiée'),
                      () => {}
                    );
                  }}
                >
                  Copier la doc Markdown
                </Button>
              </div>
              {audit.length === 0 ? (
                <p className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 px-3 py-2 text-xs text-emerald-600 dark:text-emerald-400">
                  ✓ Rien à signaler.
                </p>
              ) : (
                <ul className="space-y-1.5">
                  {audit.map((a, i) => (
                    <li
                      key={i}
                      className={`rounded-lg border px-3 py-2 text-xs ${
                        a.level === 'warn'
                          ? 'border-amber-500/20 bg-amber-500/5 text-amber-600 dark:text-amber-400'
                          : 'border-border bg-muted/30 text-muted-foreground'
                      }`}
                    >
                      <span className="font-medium">{a.requestName}</span> — {a.message}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        )}

        {tab === 'settings' && collection && (
          <div className="max-h-[55vh] space-y-4 overflow-auto">
            <label className="block">
              <span className="mb-1 block text-xs font-medium">Nom</span>
              <Input value={collection.name} onChange={(e) => actions.renameCollection(collection.id, e.target.value)} className="h-9" />
            </label>

            <div>
              <p className="mb-1.5 text-xs font-medium">Authentification héritée</p>
              <AuthEditor
                auth={collection.auth}
                onChange={(auth) => actions.setCollectionAuth(collection.id, auth)}
                allowInherit={false}
              />
            </div>

            <div>
              <p className="mb-1.5 text-xs font-medium">Variables de collection</p>
              <KvEditor<Variable>
                rows={collection.variables}
                onChange={(v) => actions.setCollectionVariables(collection.id, v)}
                addLabel="Ajouter une variable"
              />
            </div>

            <button
              onClick={() => {
                actions.deleteCollection(collection.id);
                onOpenChange(false);
              }}
              className="text-xs text-destructive hover:underline"
            >
              Supprimer la collection
            </button>
          </div>
        )}

        {tab === 'import' && (
          <div className="space-y-3">
            <p className="text-xs leading-5 text-muted-foreground">
              Colle le contenu d'un fichier <code className="font-mono">openapi.json</code> /{' '}
              <code className="font-mono">swagger.json</code> (JSON ou YAML). Une collection est générée
              avec une requête par opération, groupée par tag.
            </p>
            <Textarea
              value={spec}
              onChange={(e) => setSpec(e.target.value)}
              spellCheck={false}
              placeholder='{ "openapi": "3.0.0", "paths": { ... } }'
              className="h-48 resize-none font-mono text-xs"
            />
            <Button onClick={importSpec} disabled={!spec.trim()} size="sm">
              Générer la collection
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
