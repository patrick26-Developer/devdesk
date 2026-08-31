import { useSyncExternalStore } from 'react';

import type {
  ApiClientState,
  Collection,
  CollectionItem,
  Environment,
  HistoryEntry,
  RequestDef,
  Variable,
} from './types';
import { defaultState, newId } from './types';

let state: ApiClientState = defaultState();
let loaded = false;
const listeners = new Set<() => void>();

function emit() {
  for (const l of listeners) l();
}

let saveTimer: ReturnType<typeof setTimeout> | null = null;
function scheduleSave() {
  if (saveTimer) clearTimeout(saveTimer);
  saveTimer = setTimeout(() => {
    void window.api.apiClientWrite(state);
  }, 400);
}

async function load() {
  loaded = true;
  try {
    const saved = (await window.api.apiClientRead()) as ApiClientState | null;
    if (saved && Array.isArray(saved.environments)) {
      state = { ...defaultState(), ...saved };
      emit();
    }
  } catch {
    /* on garde l'état par défaut */
  }
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  if (!loaded) void load();
  return () => {
    listeners.delete(cb);
  };
}

function getSnapshot() {
  return state;
}

function set(updater: (s: ApiClientState) => ApiClientState) {
  state = updater(state);
  emit();
  scheduleSave();
}

// ---------------------------------------------------------------------------
// Actions
// ---------------------------------------------------------------------------
export const actions = {
  setDraft(draft: RequestDef) {
    set((s) => ({ ...s, draft }));
  },
  patchDraft(patch: Partial<RequestDef>) {
    set((s) => ({ ...s, draft: { ...s.draft, ...patch } }));
  },

  // Environnements ---------------------------------------------------------
  setActiveEnv(id: string | null) {
    set((s) => ({ ...s, activeEnvId: id }));
  },
  addEnv(name: string) {
    const env: Environment = { id: newId('env'), name, variables: [] };
    set((s) => ({ ...s, environments: [...s.environments, env], activeEnvId: env.id }));
  },
  renameEnv(id: string, name: string) {
    set((s) => ({ ...s, environments: s.environments.map((e) => (e.id === id ? { ...e, name } : e)) }));
  },
  deleteEnv(id: string) {
    set((s) => ({
      ...s,
      environments: s.environments.filter((e) => e.id !== id),
      activeEnvId: s.activeEnvId === id ? null : s.activeEnvId,
    }));
  },
  setEnvVariables(id: string, variables: Variable[]) {
    set((s) => ({ ...s, environments: s.environments.map((e) => (e.id === id ? { ...e, variables } : e)) }));
  },
  /** Écrit/actualise des variables dans l'environnement actif (extraction, scripts). */
  writeEnvVars(entries: Record<string, string>) {
    if (!Object.keys(entries).length) return;
    set((s) => {
      if (!s.activeEnvId) return s;
      return {
        ...s,
        environments: s.environments.map((e) => {
          if (e.id !== s.activeEnvId) return e;
          let variables = [...e.variables];
          for (const [key, value] of Object.entries(entries)) {
            const idx = variables.findIndex((v) => v.key === key);
            if (idx >= 0) variables[idx] = { ...variables[idx], value };
            else variables.push({ id: newId('v'), key, value, enabled: true });
          }
          return { ...e, variables };
        }),
      };
    });
  },

  // Historique -----------------------------------------------------------
  pushHistory(entry: HistoryEntry) {
    set((s) => ({ ...s, history: [entry, ...s.history].slice(0, 100) }));
  },
  clearHistory() {
    set((s) => ({ ...s, history: [] }));
  },

  // Collections --------------------------------------------------------
  addCollection(name: string) {
    const col: Collection = { id: newId('col'), name, variables: [], auth: { type: 'none' }, items: [] };
    set((s) => ({ ...s, collections: [...s.collections, col] }));
    return col.id;
  },
  renameCollection(id: string, name: string) {
    set((s) => ({ ...s, collections: s.collections.map((c) => (c.id === id ? { ...c, name } : c)) }));
  },
  deleteCollection(id: string) {
    set((s) => ({ ...s, collections: s.collections.filter((c) => c.id !== id) }));
  },
  setCollectionAuth(id: string, auth: Collection['auth']) {
    set((s) => ({ ...s, collections: s.collections.map((c) => (c.id === id ? { ...c, auth } : c)) }));
  },
  setCollectionVariables(id: string, variables: Variable[]) {
    set((s) => ({ ...s, collections: s.collections.map((c) => (c.id === id ? { ...c, variables } : c)) }));
  },
  addFolder(collectionId: string, parentFolderId: string | null, name: string) {
    const folder: CollectionItem = { type: 'folder', id: newId('fld'), name, items: [] };
    set((s) => ({
      ...s,
      collections: s.collections.map((c) =>
        c.id === collectionId ? { ...c, items: insertItem(c.items, parentFolderId, folder) } : c
      ),
    }));
  },
  saveRequestToCollection(collectionId: string, parentFolderId: string | null, request: RequestDef) {
    const item: CollectionItem = { type: 'request', id: newId('req'), request };
    set((s) => ({
      ...s,
      collections: s.collections.map((c) =>
        c.id === collectionId ? { ...c, items: insertItem(c.items, parentFolderId, item) } : c
      ),
      activeRequestId: item.id,
      draft: request,
    }));
    return item.id;
  },
  updateRequestInCollection(requestId: string, request: RequestDef) {
    set((s) => ({
      ...s,
      collections: s.collections.map((c) => ({ ...c, items: mapItems(c.items, requestId, request) })),
    }));
  },
  renameItem(itemId: string, name: string) {
    set((s) => ({
      ...s,
      collections: s.collections.map((c) => ({ ...c, items: renameItemRec(c.items, itemId, name) })),
    }));
  },
  duplicateItem(itemId: string) {
    set((s) => ({ ...s, collections: s.collections.map((c) => ({ ...c, items: duplicateRec(c.items, itemId) })) }));
  },
  deleteItem(itemId: string) {
    set((s) => ({
      ...s,
      collections: s.collections.map((c) => ({ ...c, items: deleteRec(c.items, itemId) })),
      activeRequestId: s.activeRequestId === itemId ? null : s.activeRequestId,
    }));
  },
  openRequest(requestId: string) {
    set((s) => {
      const found = findRequest(s.collections, requestId);
      return found ? { ...s, activeRequestId: requestId, draft: found } : s;
    });
  },
  newDraft() {
    set((s) => ({ ...s, activeRequestId: null, draft: emptyRequest() }));
  },

  /** Crée une requête vide directement dans une collection / un dossier et l'ouvre. */
  newRequestIn(collectionId: string, parentFolderId: string | null) {
    return actions.saveRequestToCollection(collectionId, parentFolderId, emptyRequest());
  },

  replaceState(next: ApiClientState) {
    set(() => next);
  },
};

// ---------------------------------------------------------------------------
// Helpers arborescence
// ---------------------------------------------------------------------------
function insertItem(items: CollectionItem[], parentFolderId: string | null, item: CollectionItem): CollectionItem[] {
  if (parentFolderId === null) return [...items, item];
  return items.map((it) =>
    it.type === 'folder'
      ? it.id === parentFolderId
        ? { ...it, items: [...it.items, item] }
        : { ...it, items: insertItem(it.items, parentFolderId, item) }
      : it
  );
}

function mapItems(items: CollectionItem[], requestId: string, request: RequestDef): CollectionItem[] {
  return items.map((it) => {
    if (it.type === 'request') return it.id === requestId ? { ...it, request } : it;
    return { ...it, items: mapItems(it.items, requestId, request) };
  });
}

function renameItemRec(items: CollectionItem[], itemId: string, name: string): CollectionItem[] {
  return items.map((it) => {
    if (it.id === itemId) {
      return it.type === 'folder' ? { ...it, name } : { ...it, request: { ...it.request, name } };
    }
    return it.type === 'folder' ? { ...it, items: renameItemRec(it.items, itemId, name) } : it;
  });
}

function duplicateRec(items: CollectionItem[], itemId: string): CollectionItem[] {
  const out: CollectionItem[] = [];
  for (const it of items) {
    out.push(it.type === 'folder' ? { ...it, items: duplicateRec(it.items, itemId) } : it);
    if (it.id === itemId && it.type === 'request') {
      out.push({ type: 'request', id: newId('req'), request: { ...it.request, name: `${it.request.name} (copie)` } });
    }
  }
  return out;
}

function deleteRec(items: CollectionItem[], itemId: string): CollectionItem[] {
  return items
    .filter((it) => it.id !== itemId)
    .map((it) => (it.type === 'folder' ? { ...it, items: deleteRec(it.items, itemId) } : it));
}

export function findRequest(collections: Collection[], requestId: string): RequestDef | null {
  for (const c of collections) {
    const r = findRequestRec(c.items, requestId);
    if (r) return r;
  }
  return null;
}
function findRequestRec(items: CollectionItem[], requestId: string): RequestDef | null {
  for (const it of items) {
    if (it.type === 'request' && it.id === requestId) return it.request;
    if (it.type === 'folder') {
      const r = findRequestRec(it.items, requestId);
      if (r) return r;
    }
  }
  return null;
}

export function collectionOfRequest(collections: Collection[], requestId: string): Collection | null {
  for (const c of collections) {
    if (findRequestRec(c.items, requestId)) return c;
  }
  return null;
}

export function flattenRequests(items: CollectionItem[]): { id: string; request: RequestDef }[] {
  const out: { id: string; request: RequestDef }[] = [];
  for (const it of items) {
    if (it.type === 'request') out.push({ id: it.id, request: it.request });
    else out.push(...flattenRequests(it.items));
  }
  return out;
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------
export function useApiClient() {
  return useSyncExternalStore(subscribe, getSnapshot);
}
