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
import { useT } from '@/i18n';

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
  const t = useT();
  const state = useApiClient();
  const [view, setView] = useState<'collections' | 'history'>('collections');
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  // id de la requête tout juste créée : son nom s'ouvre directement en édition.
  const [justCreatedId, setJustCreatedId] = useState<string | null>(null);

  const toggle = (id: string) => setExpanded((e) => ({ ...e, [id]: !e[id] }));

  const createRequest = (collectionId: string, parentFolderId: string | null) => {
    const id = actions.newRequestIn(collectionId, parentFolderId);
    setJustCreatedId(id);
    setExpanded((e) => ({ ...e, [collectionId]: true, ...(parentFolderId ? { [parentFolderId]: true } : {}) }));
  };

  return (
    <div className="flex h-full min-h-0 w-64 shrink-0 flex-col border-r border-border bg-card/30">
      <div className="flex shrink-0 items-center gap-1 border-b border-border p-2">
        <button
          onClick={() => setView('collections')}
          className={`flex-1 rounded-md px-2 py-1 text-xs font-medium ${view === 'collections' ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:text-foreground'}`}
        >
          {t('api.collections')}
        </button>
        <button
          onClick={() => setView('history')}
          className={`flex flex-1 items-center justify-center gap-1 rounded-md px-2 py-1 text-xs font-medium ${view === 'history' ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:text-foreground'}`}
        >
          <History className="h-3.5 w-3.5" />
          {t('api.history')}
        </button>
      </div>

      {view === 'collections' ? (
        <div className="min-h-0 flex-1 overflow-auto p-2">
          <button
            onClick={() => actions.addCollection(`Collection ${state.collections.length + 1}`)}
            className="mb-2 inline-flex w-full items-center gap-1.5 rounded-md border border-dashed border-border px-2 py-1.5 text-xs text-muted-foreground hover:border-primary/30 hover:text-foreground"
          >
            <Plus className="h-3.5 w-3.5" />
            {t('api.newCollection')}
          </button>

          {state.collections.length === 0 && (
            <p className="px-1 py-4 text-center text-[11px] text-muted-foreground">
              {t('api.collectionsEmpty')}
            </p>
          )}

          {state.collections.map((col) => {
            const reqCount = countRequests(col.items);
            return (
              <div key={col.id} className="mb-1">
                <div className="group flex items-center gap-1 rounded-md px-1 py-1 hover:bg-accent/50">
                  <button onClick={() => toggle(col.id)} className="shrink-0" aria-label="expand">
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
                    onClick={() => createRequest(col.id, null)}
                    className="shrink-0 opacity-0 group-hover:opacity-100"
                    title={t('api.newRequestTitle')}
                  >
                    <FilePlus className="h-3.5 w-3.5 text-muted-foreground hover:text-foreground" />
                  </button>
                  <button
                    onClick={() => actions.addFolder(col.id, null, t('api.newFolder'))}
                    className="shrink-0 opacity-0 group-hover:opacity-100"
                    title={t('api.newFolder')}
                  >
                    <FolderPlus className="h-3.5 w-3.5 text-muted-foreground hover:text-foreground" />
                  </button>
                  <button
                    onClick={() => onManageCollection(col.id)}
                    className="shrink-0 opacity-0 group-hover:opacity-100"
                    title={t('api.colSettings')}
                  >
                    <MoreVertical className="h-3.5 w-3.5 text-muted-foreground hover:text-foreground" />
                  </button>
                </div>

                {expanded[col.id] !== false && (
                  <div className="ml-3 border-l border-border pl-1">
                    {col.items.length === 0 && (
                      <p className="px-2 py-1 text-[11px] text-muted-foreground/70">
                        {t('api.folderEmpty')}
                      </p>
                    )}
                    <Tree
                      items={col.items}
                      collectionId={col.id}
                      activeId={state.activeRequestId}
                      expanded={expanded}
                      onToggle={toggle}
                      onExpand={(id) => setExpanded((e) => ({ ...e, [id]: true }))}
                      justCreatedId={justCreatedId}
                      onCreateRequest={createRequest}
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
            <span className="text-[11px] text-muted-foreground">
              {t('api.historyEntries', { n: state.history.length })}
            </span>
            {state.history.length > 0 && (
              <button onClick={actions.clearHistory} className="text-[11px] text-muted-foreground hover:text-destructive">
                {t('common.clear')}
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
            <p className="px-1 py-4 text-center text-[11px] text-muted-foreground">{t('api.emptyHistory')}</p>
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
  justCreatedId,
  onCreateRequest,
  depth,
}: {
  items: CollectionItem[];
  collectionId: string;
  activeId: string | null;
  expanded: Record<string, boolean>;
  onToggle: (id: string) => void;
  onExpand: (id: string) => void;
  justCreatedId: string | null;
  onCreateRequest: (collectionId: string, parentFolderId: string | null) => void;
  depth: number;
}) {
  const t = useT();
  return (
    <>
      {items.map((it) =>
        it.type === 'folder' ? (
          <div key={it.id}>
            <div className="group flex items-center gap-1 rounded-md px-1 py-1 hover:bg-accent/50">
              <button onClick={() => onToggle(it.id)} className="shrink-0" aria-label="expand">
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
                onClick={() => onCreateRequest(collectionId, it.id)}
                className="shrink-0 opacity-0 group-hover:opacity-100"
                title={t('api.newRequestInFolder')}
              >
                <FilePlus className="h-3 w-3 text-muted-foreground hover:text-foreground" />
              </button>
              <button
                onClick={() => actions.addFolder(collectionId, it.id, t('api.subFolder'))}
                className="shrink-0 opacity-0 group-hover:opacity-100"
                title={t('api.subFolder')}
              >
                <FolderPlus className="h-3 w-3 text-muted-foreground hover:text-foreground" />
              </button>
              <button
                onClick={() => actions.deleteItem(it.id)}
                className="shrink-0 opacity-0 group-hover:opacity-100"
                title={t('common.delete')}
              >
                <Trash2 className="h-3 w-3 text-muted-foreground hover:text-destructive" />
              </button>
            </div>
            {expanded[it.id] && (
              <div className="ml-3 border-l border-border pl-1">
                {it.items.length === 0 && (
                  <p className="px-2 py-1 text-[11px] text-muted-foreground/60">{t("api.emptyFolder")}</p>
                )}
                <Tree
                  items={it.items}
                  collectionId={collectionId}
                  activeId={activeId}
                  expanded={expanded}
                  onToggle={onToggle}
                  onExpand={onExpand}
                  justCreatedId={justCreatedId}
                  onCreateRequest={onCreateRequest}
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
              placeholder={t("api.request")}
              className="min-w-0 flex-1 text-xs"
              autoEdit={it.id === justCreatedId}
              onCommit={(name) => actions.renameItem(it.id, name)}
            />
            <button
              onClick={() => actions.duplicateItem(it.id)}
              className="shrink-0 opacity-0 group-hover:opacity-100"
              title={t('common.duplicate')}
            >
              <Copy className="h-3 w-3 text-muted-foreground hover:text-foreground" />
            </button>
            <button
              onClick={() => actions.deleteItem(it.id)}
              className="shrink-0 opacity-0 group-hover:opacity-100"
              title={t('common.delete')}
            >
              <Trash2 className="h-3 w-3 text-muted-foreground hover:text-destructive" />
            </button>
          </div>
        )
      )}
    </>
  );
}
