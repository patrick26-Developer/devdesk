import { useState } from 'react';
import {
  ChevronDown,
  ChevronRight,
  Copy,
  FolderPlus,
  History,
  MoreVertical,
  Plus,
  Trash2,
} from 'lucide-react';

import { actions, useApiClient } from '../store';
import type { CollectionItem, HistoryEntry } from '../types';

const METHOD_COLOR: Record<string, string> = {
  GET: 'text-emerald-500',
  POST: 'text-blue-500',
  PUT: 'text-amber-500',
  PATCH: 'text-violet-500',
  DELETE: 'text-red-500',
  HEAD: 'text-muted-foreground',
  OPTIONS: 'text-muted-foreground',
};

interface WorkspacePanelProps {
  onOpenHistory: (entry: HistoryEntry) => void;
  onManageCollection: (collectionId: string) => void;
}

export default function WorkspacePanel({ onOpenHistory, onManageCollection }: WorkspacePanelProps) {
  const state = useApiClient();
  const [view, setView] = useState<'collections' | 'history'>('collections');
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const toggle = (id: string) => setExpanded((e) => ({ ...e, [id]: !e[id] }));

  return (
    <div className="flex h-full min-h-0 w-64 shrink-0 flex-col border-r border-border bg-card/30">
      <div className="flex shrink-0 items-center gap-1 border-b border-border p-2">
        <button
          onClick={() => setView('collections')}
          className={`flex-1 rounded-md px-2 py-1 text-xs font-medium ${view === 'collections' ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:text-foreground'}`}
        >
          Collections
        </button>
        <button
          onClick={() => setView('history')}
          className={`flex flex-1 items-center justify-center gap-1 rounded-md px-2 py-1 text-xs font-medium ${view === 'history' ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:text-foreground'}`}
        >
          <History className="h-3.5 w-3.5" />
          Historique
        </button>
      </div>

      {view === 'collections' ? (
        <div className="min-h-0 flex-1 overflow-auto p-2">
          <button
            onClick={() => actions.addCollection(`Collection ${state.collections.length + 1}`)}
            className="mb-2 inline-flex w-full items-center gap-1.5 rounded-md border border-dashed border-border px-2 py-1.5 text-xs text-muted-foreground hover:border-primary/30 hover:text-foreground"
          >
            <Plus className="h-3.5 w-3.5" />
            Nouvelle collection
          </button>

          {state.collections.length === 0 && (
            <p className="px-1 py-4 text-center text-[11px] text-muted-foreground">
              Enregistre une requête pour créer ta première collection.
            </p>
          )}

          {state.collections.map((col) => (
            <div key={col.id} className="mb-1">
              <div className="group flex items-center gap-1 rounded-md px-1 py-1 hover:bg-accent/50">
                <button onClick={() => toggle(col.id)} className="flex flex-1 items-center gap-1 text-xs font-semibold">
                  {expanded[col.id] === false ? (
                    <ChevronRight className="h-3.5 w-3.5" />
                  ) : (
                    <ChevronDown className="h-3.5 w-3.5" />
                  )}
                  <span className="truncate">{col.name}</span>
                </button>
                <button
                  onClick={() => actions.addFolder(col.id, null, 'Dossier')}
                  className="opacity-0 group-hover:opacity-100"
                  title="Ajouter un dossier"
                >
                  <FolderPlus className="h-3.5 w-3.5 text-muted-foreground hover:text-foreground" />
                </button>
                <button
                  onClick={() => onManageCollection(col.id)}
                  className="opacity-0 group-hover:opacity-100"
                  title="Paramètres de la collection"
                >
                  <MoreVertical className="h-3.5 w-3.5 text-muted-foreground hover:text-foreground" />
                </button>
              </div>

              {expanded[col.id] !== false && (
                <div className="ml-3 border-l border-border pl-1">
                  {col.items.length === 0 && (
                    <p className="px-2 py-1 text-[11px] text-muted-foreground/70">vide</p>
                  )}
                  <Tree
                    items={col.items}
                    activeId={state.activeRequestId}
                    expanded={expanded}
                    onToggle={toggle}
                    onOpen={actions.openRequest}
                    depth={0}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="min-h-0 flex-1 overflow-auto p-2">
          <div className="mb-1 flex items-center justify-between px-1">
            <span className="text-[11px] text-muted-foreground">{state.history.length} entrées</span>
            {state.history.length > 0 && (
              <button onClick={actions.clearHistory} className="text-[11px] text-muted-foreground hover:text-destructive">
                Vider
              </button>
            )}
          </div>
          {state.history.map((h) => (
            <button
              key={h.id}
              onClick={() => onOpenHistory(h)}
              className="flex w-full flex-col gap-0.5 rounded-md px-2 py-1.5 text-left hover:bg-accent/50"
            >
              <span className="flex items-center gap-2 text-[11px]">
                <span className={`font-mono font-semibold ${METHOD_COLOR[h.method] ?? ''}`}>{h.method}</span>
                <span
                  className={`font-mono ${h.status === null ? 'text-destructive' : h.status < 300 ? 'text-emerald-500' : h.status < 400 ? 'text-amber-500' : 'text-red-500'}`}
                >
                  {h.status ?? 'ERR'}
                </span>
                <span className="ml-auto text-muted-foreground tabular-nums">{h.timeMs} ms</span>
              </span>
              <span className="truncate font-mono text-[11px] text-muted-foreground">{h.url}</span>
            </button>
          ))}
          {state.history.length === 0 && (
            <p className="px-1 py-4 text-center text-[11px] text-muted-foreground">Aucune requête envoyée.</p>
          )}
        </div>
      )}
    </div>
  );
}

function Tree({
  items,
  activeId,
  expanded,
  onToggle,
  onOpen,
  depth,
}: {
  items: CollectionItem[];
  activeId: string | null;
  expanded: Record<string, boolean>;
  onToggle: (id: string) => void;
  onOpen: (id: string) => void;
  depth: number;
}) {
  return (
    <>
      {items.map((it) =>
        it.type === 'folder' ? (
          <div key={it.id}>
            <div className="group flex items-center gap-1 rounded-md px-1 py-1 hover:bg-accent/50">
              <button onClick={() => onToggle(it.id)} className="flex flex-1 items-center gap-1 text-xs">
                {expanded[it.id] ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
                <span className="truncate">{it.name}</span>
              </button>
              <button onClick={() => actions.renameItem(it.id, prompt('Renommer le dossier', it.name) || it.name)} className="opacity-0 group-hover:opacity-100">
                <MoreVertical className="h-3 w-3 text-muted-foreground" />
              </button>
              <button onClick={() => actions.deleteItem(it.id)} className="opacity-0 group-hover:opacity-100">
                <Trash2 className="h-3 w-3 text-muted-foreground hover:text-destructive" />
              </button>
            </div>
            {expanded[it.id] && (
              <div className="ml-3 border-l border-border pl-1">
                <Tree items={it.items} activeId={activeId} expanded={expanded} onToggle={onToggle} onOpen={onOpen} depth={depth + 1} />
              </div>
            )}
          </div>
        ) : (
          <div
            key={it.id}
            className={`group flex items-center gap-1.5 rounded-md px-1.5 py-1 text-xs ${
              activeId === it.id ? 'bg-primary/10 text-primary' : 'hover:bg-accent/50'
            }`}
          >
            <button onClick={() => onOpen(it.id)} className="flex min-w-0 flex-1 items-center gap-1.5">
              <span className={`font-mono text-[10px] font-semibold ${METHOD_COLOR[it.request.method] ?? ''}`}>
                {it.request.method}
              </span>
              <span className="truncate">{it.request.name}</span>
            </button>
            <button onClick={() => actions.duplicateItem(it.id)} className="opacity-0 group-hover:opacity-100" title="Dupliquer">
              <Copy className="h-3 w-3 text-muted-foreground hover:text-foreground" />
            </button>
            <button onClick={() => actions.deleteItem(it.id)} className="opacity-0 group-hover:opacity-100" title="Supprimer">
              <Trash2 className="h-3 w-3 text-muted-foreground hover:text-destructive" />
            </button>
          </div>
        )
      )}
    </>
  );
}
