import { useState } from 'react';
import {
  ChevronDown,
  ChevronRight,
  Copy,
  FilePlus,
  FolderPlus,
  History,
  MoreVertical,
  Plus,
  Trash2,
} from 'lucide-react';

import { actions, useApiClient } from '../store';
import type { CollectionItem, HistoryEntry } from '../types';
import InlineEdit from './InlineEdit';

function countRequests(items: CollectionItem[]): number {
  return items.reduce((n, it) => n + (it.type === 'request' ? 1 : countRequests(it.items)), 0);
}

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

          {state.collections.map((col) => {
            const reqCount = countRequests(col.items);
            return (
              <div key={col.id} className="mb-1">
                <div className="group flex items-center gap-1 rounded-md px-1 py-1 hover:bg-accent/50">
                  <button onClick={() => toggle(col.id)} className="shrink-0" aria-label="Développer">
                    {expanded[col.id] === false ? (
                      <ChevronRight className="h-3.5 w-3.5" />
                    ) : (
                      <ChevronDown className="h-3.5 w-3.5" />
                    )}
                  </button>
                  <InlineEdit
                    value={col.name}
                    className="flex-1 text-xs font-semibold"
                    onCommit={(name) => actions.renameCollection(col.id, name)}
                  />
                  <span className="shrink-0 text-[10px] text-muted-foreground/60 tabular-nums">{reqCount}</span>
                  <button
                    onClick={() => {
                      actions.newRequestIn(col.id, null);
                      setExpanded((e) => ({ ...e, [col.id]: true }));
                    }}
                    className="shrink-0 opacity-0 group-hover:opacity-100"
                    title="Nouvelle requête"
                  >
                    <FilePlus className="h-3.5 w-3.5 text-muted-foreground hover:text-foreground" />
                  </button>
                  <button
                    onClick={() => actions.addFolder(col.id, null, 'Dossier')}
                    className="shrink-0 opacity-0 group-hover:opacity-100"
                    title="Nouveau dossier"
                  >
                    <FolderPlus className="h-3.5 w-3.5 text-muted-foreground hover:text-foreground" />
                  </button>
                  <button
                    onClick={() => onManageCollection(col.id)}
                    className="shrink-0 opacity-0 group-hover:opacity-100"
                    title="Paramètres de la collection"
                  >
                    <MoreVertical className="h-3.5 w-3.5 text-muted-foreground hover:text-foreground" />
                  </button>
                </div>

                {expanded[col.id] !== false && (
                  <div className="ml-3 border-l border-border pl-1">
                    {col.items.length === 0 && (
                      <p className="px-2 py-1 text-[11px] text-muted-foreground/70">
                        Vide — clique sur l'icône « + fichier ».
                      </p>
                    )}
                    <Tree
                      items={col.items}
                      collectionId={col.id}
                      activeId={state.activeRequestId}
                      expanded={expanded}
                      onToggle={toggle}
                      onExpand={(id) => setExpanded((e) => ({ ...e, [id]: true }))}
                      depth={0}
                    />
                  </div>
                )}
              </div>
            );
          })}
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
  collectionId,
  activeId,
  expanded,
  onToggle,
  onExpand,
  depth,
}: {
  items: CollectionItem[];
  collectionId: string;
  activeId: string | null;
  expanded: Record<string, boolean>;
  onToggle: (id: string) => void;
  onExpand: (id: string) => void;
  depth: number;
}) {
  return (
    <>
      {items.map((it) =>
        it.type === 'folder' ? (
          <div key={it.id}>
            <div className="group flex items-center gap-1 rounded-md px-1 py-1 hover:bg-accent/50">
              <button onClick={() => onToggle(it.id)} className="shrink-0" aria-label="Développer">
                {expanded[it.id] ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
              </button>
              <InlineEdit
                value={it.name}
                className="flex-1 text-xs"
                onCommit={(name) => actions.renameItem(it.id, name)}
              />
              <span className="shrink-0 text-[10px] text-muted-foreground/50 tabular-nums">
                {countRequests(it.items)}
              </span>
              <button
                onClick={() => {
                  actions.newRequestIn(collectionId, it.id);
                  onExpand(it.id);
                }}
                className="shrink-0 opacity-0 group-hover:opacity-100"
                title="Nouvelle requête dans ce dossier"
              >
                <FilePlus className="h-3 w-3 text-muted-foreground hover:text-foreground" />
              </button>
              <button
                onClick={() => actions.addFolder(collectionId, it.id, 'Dossier')}
                className="shrink-0 opacity-0 group-hover:opacity-100"
                title="Sous-dossier"
              >
                <FolderPlus className="h-3 w-3 text-muted-foreground hover:text-foreground" />
              </button>
              <button
                onClick={() => actions.deleteItem(it.id)}
                className="shrink-0 opacity-0 group-hover:opacity-100"
                title="Supprimer"
              >
                <Trash2 className="h-3 w-3 text-muted-foreground hover:text-destructive" />
              </button>
            </div>
            {expanded[it.id] && (
              <div className="ml-3 border-l border-border pl-1">
                {it.items.length === 0 && (
                  <p className="px-2 py-1 text-[11px] text-muted-foreground/60">dossier vide</p>
                )}
                <Tree
                  items={it.items}
                  collectionId={collectionId}
                  activeId={activeId}
                  expanded={expanded}
                  onToggle={onToggle}
                  onExpand={onExpand}
                  depth={depth + 1}
                />
              </div>
            )}
          </div>
        ) : (
          <div
            key={it.id}
            onClick={() => actions.openRequest(it.id)}
            className={`group flex cursor-pointer items-center gap-1.5 rounded-md px-1.5 py-1 text-xs ${
              activeId === it.id ? 'bg-primary/10 text-primary' : 'hover:bg-accent/50'
            }`}
          >
            <span className={`shrink-0 font-mono text-[10px] font-semibold ${METHOD_COLOR[it.request.method] ?? ''}`}>
              {it.request.method}
            </span>
            <InlineEdit
              value={it.request.name}
              placeholder="Requête"
              className="min-w-0 flex-1 text-xs"
              onCommit={(name) => actions.renameItem(it.id, name)}
            />
            <button
              onClick={() => actions.duplicateItem(it.id)}
              className="shrink-0 opacity-0 group-hover:opacity-100"
              title="Dupliquer"
            >
              <Copy className="h-3 w-3 text-muted-foreground hover:text-foreground" />
            </button>
            <button
              onClick={() => actions.deleteItem(it.id)}
              className="shrink-0 opacity-0 group-hover:opacity-100"
              title="Supprimer"
            >
              <Trash2 className="h-3 w-3 text-muted-foreground hover:text-destructive" />
            </button>
          </div>
        )
      )}
    </>
  );
}
