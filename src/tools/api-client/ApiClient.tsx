import { useMemo, useState } from 'react';
import { FileDown, ListChecks, Play, Plus, Settings2, TerminalSquare } from 'lucide-react';

import ToolShell from '@/components/tool/ToolShell';
import { Button } from '@/components/ui/button';
import { notify } from '@/lib/notify';
import { getTool } from '@/tools';
import { parseCurl, toCurl } from './curl';
import { toAxios, toFetch, toHttpie } from './snippets';

import { actions, collectionOfRequest, findRequest, useApiClient } from './store';
import { runRequest } from './runtime';
import { toScope } from './vars';
import type { HistoryEntry, ResponseData, TestResult } from './types';
import { newId } from './types';

import RequestBuilder from './components/RequestBuilder';
import ResponseView from './components/ResponseView';
import WorkspacePanel from './components/WorkspacePanel';
import EnvDialog from './components/EnvDialog';
import SaveDialog from './components/SaveDialog';
import RunnerDialog from './components/RunnerDialog';
import CollectionDialog from './components/CollectionDialog';

export default function ApiClient() {
  const tool = getTool('api-tester')!;
  const state = useApiClient();

  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<ResponseData | null>(null);
  const [tests, setTests] = useState<TestResult[]>([]);
  const [extracted, setExtracted] = useState<Record<string, string>>({});
  const [scriptError, setScriptError] = useState<string | null>(null);

  const [envOpen, setEnvOpen] = useState(false);
  const [saveOpen, setSaveOpen] = useState(false);
  const [runnerOpen, setRunnerOpen] = useState(false);
  const [collectionDialogId, setCollectionDialogId] = useState<string | null | undefined>(undefined);

  const activeEnv = state.environments.find((e) => e.id === state.activeEnvId) ?? null;
  const parentCollection = state.activeRequestId
    ? collectionOfRequest(state.collections, state.activeRequestId)
    : null;

  const savedRequest = useMemo(
    () => (state.activeRequestId ? findRequest(state.collections, state.activeRequestId) : null),
    [state.activeRequestId, state.collections]
  );

  const dirty = useMemo(
    () => (savedRequest ? JSON.stringify(savedRequest) !== JSON.stringify(state.draft) : true),
    [savedRequest, state.draft]
  );

  const send = async () => {
    setLoading(true);
    setResponse(null);
    setTests([]);
    setExtracted({});
    setScriptError(null);

    const scope = toScope(parentCollection?.variables ?? [], activeEnv?.variables ?? []);

    try {
      const outcome = await runRequest(state.draft, scope, parentCollection?.auth, 30000);
      setResponse(outcome.response);
      setTests(outcome.tests);
      setExtracted(outcome.extracted);
      setScriptError(outcome.scriptError);

      if (Object.keys(outcome.extracted).length) actions.writeEnvVars(outcome.extracted);

      const entry: HistoryEntry = {
        id: newId('hist'),
        ts: Date.now(),
        method: state.draft.method,
        url: outcome.built.url,
        status: outcome.response.status,
        ok: outcome.response.ok,
        timeMs: outcome.response.timeMs,
        sizeBytes: outcome.response.sizeBytes,
        request: state.draft,
        response: outcome.response,
        tests: outcome.tests,
      };
      actions.pushHistory(entry);

      // Enregistrement automatique des modifs d'une requête déjà rangée dans une collection.
      if (state.activeRequestId && dirty) {
        actions.updateRequestInCollection(state.activeRequestId, state.draft);
      }
    } catch (e) {
      notify('Requête impossible', { type: 'error', description: (e as Error).message });
    } finally {
      setLoading(false);
    }
  };

  const save = () => {
    if (state.activeRequestId) {
      actions.updateRequestInCollection(state.activeRequestId, state.draft);
      notify('Requête enregistrée');
    } else {
      setSaveOpen(true);
    }
  };

  const importCurl = async () => {
    try {
      const text = await navigator.clipboard.readText();
      actions.setDraft(parseCurl(text));
      notify('Requête importée depuis cURL');
    } catch (e) {
      notify('Import cURL impossible', { type: 'error', description: (e as Error).message });
    }
  };

  const copySnippet = async (kind: 'curl' | 'fetch' | 'axios' | 'httpie') => {
    const gen = { curl: toCurl, fetch: toFetch, axios: toAxios, httpie: toHttpie }[kind];
    try {
      await navigator.clipboard.writeText(gen(state.draft));
      notify(`Snippet ${kind} copié`);
    } catch {
      /* presse-papiers indisponible */
    }
  };

  const openFromHistory = (entry: HistoryEntry) => {
    actions.setDraft(entry.request);
    setResponse(entry.response);
    setTests(entry.tests);
    setExtracted({});
    setScriptError(null);
  };

  return (
    <ToolShell
      tool={{ ...tool, name: 'API Client', description: 'Environnements, collections, variables, tests — votre atelier d’API.' }}
      actions={
        <div className="flex items-center gap-2">
          <select
            value={state.activeEnvId ?? ''}
            onChange={(e) => actions.setActiveEnv(e.target.value || null)}
            className="h-8 rounded-lg border border-input bg-transparent px-2 text-xs"
            title="Environnement actif"
          >
            <option value="">Aucun environnement</option>
            {state.environments.map((e) => (
              <option key={e.id} value={e.id}>
                {e.name}
              </option>
            ))}
          </select>
          <Button variant="ghost" size="sm" onClick={() => setEnvOpen(true)} className="gap-1.5">
            <Settings2 className="h-3.5 w-3.5" />
            Variables
          </Button>
          <Button variant="ghost" size="sm" onClick={() => setRunnerOpen(true)} className="gap-1.5">
            <Play className="h-3.5 w-3.5" />
            Runner
          </Button>
        </div>
      }
      contentClassName="gap-0 p-0 xl:p-0"
    >
      <div className="flex min-h-0 flex-1">
        <WorkspacePanel onOpenHistory={openFromHistory} onManageCollection={(id) => setCollectionDialogId(id)} />

        <div className="flex min-h-0 flex-1 flex-col">
          {/* Barre d'onglet requête */}
          <div className="flex shrink-0 items-center gap-2 border-b border-border px-3 py-1.5">
            <span className="truncate text-xs font-medium">
              {state.draft.name}
              {dirty && <span className="ml-1 text-primary">•</span>}
            </span>
            {parentCollection && (
              <span className="rounded-md bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground">
                {parentCollection.name}
              </span>
            )}
            <div className="ml-auto flex items-center gap-1">
              <button
                onClick={() => actions.newDraft()}
                className="flex h-7 items-center gap-1 rounded-md px-2 text-xs text-muted-foreground hover:bg-accent hover:text-foreground"
                title="Nouvelle requête"
              >
                <Plus className="h-3.5 w-3.5" />
                Nouvelle
              </button>
              <button
                onClick={importCurl}
                className="flex h-7 items-center gap-1 rounded-md px-2 text-xs text-muted-foreground hover:bg-accent hover:text-foreground"
                title="Coller une commande cURL depuis le presse-papiers"
              >
                <TerminalSquare className="h-3.5 w-3.5" />
                Coller cURL
              </button>
              <select
                value=""
                onChange={(e) => {
                  if (e.target.value) copySnippet(e.target.value as 'curl' | 'fetch' | 'axios' | 'httpie');
                  e.target.value = '';
                }}
                className="h-7 rounded-md border border-border bg-transparent px-1.5 text-xs text-muted-foreground"
                title="Copier la requête sous forme de code"
              >
                <option value="">Copier en…</option>
                <option value="curl">cURL</option>
                <option value="fetch">fetch</option>
                <option value="axios">axios</option>
                <option value="httpie">HTTPie</option>
              </select>
              <button
                onClick={() => setCollectionDialogId(null)}
                className="flex h-7 items-center gap-1 rounded-md px-2 text-xs text-muted-foreground hover:bg-accent hover:text-foreground"
                title="Importer OpenAPI"
              >
                <FileDown className="h-3.5 w-3.5" />
                OpenAPI
              </button>
            </div>
          </div>

          <div className="flex min-h-0 flex-1 flex-col lg:flex-row">
            <div className="flex min-h-0 flex-1 flex-col border-b border-border lg:border-b-0 lg:border-r">
              <RequestBuilder
                request={state.draft}
                onChange={(patch) => actions.patchDraft(patch)}
                onSend={send}
                onSave={save}
                loading={loading}
                dirty={dirty}
              />
            </div>
            <div className="flex min-h-0 flex-1 flex-col">
              <div className="flex shrink-0 items-center gap-2 border-b border-border px-4 py-2 text-xs font-medium">
                <ListChecks className="h-3.5 w-3.5 text-muted-foreground" />
                Réponse
              </div>
              <ResponseView
                request={state.draft}
                response={response}
                tests={tests}
                extracted={extracted}
                scriptError={scriptError}
                loading={loading}
                onApplyTests={(script) => {
                  actions.patchDraft({ testScript: script });
                  notify('Tests générés dans l’onglet Tests');
                }}
              />
            </div>
          </div>
        </div>
      </div>

      <EnvDialog open={envOpen} onOpenChange={setEnvOpen} />
      <SaveDialog open={saveOpen} onOpenChange={setSaveOpen} request={state.draft} />
      <RunnerDialog open={runnerOpen} onOpenChange={setRunnerOpen} />
      {collectionDialogId !== undefined && (
        <CollectionDialog
          collectionId={collectionDialogId}
          onOpenChange={(o) => !o && setCollectionDialogId(undefined)}
        />
      )}
    </ToolShell>
  );
}
