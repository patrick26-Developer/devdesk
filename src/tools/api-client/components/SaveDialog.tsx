import { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

import { actions, useApiClient } from '../store';
import type { CollectionItem, RequestDef } from '../types';

function folderOptions(items: CollectionItem[], prefix = ''): { id: string; label: string }[] {
  const out: { id: string; label: string }[] = [];
  for (const it of items) {
    if (it.type === 'folder') {
      out.push({ id: it.id, label: `${prefix}${it.name}` });
      out.push(...folderOptions(it.items, `${prefix}${it.name} / `));
    }
  }
  return out;
}

export default function SaveDialog({
  open,
  onOpenChange,
  request,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  request: RequestDef;
}) {
  const state = useApiClient();
  const [name, setName] = useState(request.name);
  const [collectionId, setCollectionId] = useState<string>('');
  const [folderId, setFolderId] = useState<string>('');

  useEffect(() => {
    if (open) {
      setName(request.name);
      setCollectionId(state.collections[0]?.id ?? '');
      setFolderId('');
    }
  }, [open, request.name, state.collections]);

  const collection = state.collections.find((c) => c.id === collectionId);

  const save = () => {
    let cid = collectionId;
    if (!cid) cid = actions.addCollection('Ma collection');
    actions.saveRequestToCollection(cid, folderId || null, { ...request, name: name.trim() || 'Requête' });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Enregistrer la requête</DialogTitle>
          <DialogDescription>Elle sera ajoutée à une collection pour être réutilisée.</DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          <label className="block">
            <span className="mb-1 block text-xs font-medium">Nom</span>
            <Input value={name} onChange={(e) => setName(e.target.value)} className="h-9" />
          </label>
          <label className="block">
            <span className="mb-1 block text-xs font-medium">Collection</span>
            <select
              value={collectionId}
              onChange={(e) => {
                setCollectionId(e.target.value);
                setFolderId('');
              }}
              className="h-9 w-full rounded-lg border border-input bg-transparent px-2 text-xs"
            >
              <option value="">+ Nouvelle collection</option>
              {state.collections.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </label>
          {collection && folderOptions(collection.items).length > 0 && (
            <label className="block">
              <span className="mb-1 block text-xs font-medium">Dossier</span>
              <select
                value={folderId}
                onChange={(e) => setFolderId(e.target.value)}
                className="h-9 w-full rounded-lg border border-input bg-transparent px-2 text-xs"
              >
                <option value="">(racine)</option>
                {folderOptions(collection.items).map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.label}
                  </option>
                ))}
              </select>
            </label>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Annuler
          </Button>
          <Button onClick={save}>Enregistrer</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
