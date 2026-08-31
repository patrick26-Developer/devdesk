import { useMemo, useState } from 'react';
import { CheckCircle2, Loader2, Play, XCircle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

import { actions, flattenRequests, useApiClient } from '../store';
import { runRequest } from '../runtime';
import { toScope } from '../vars';
import type { TestResult } from '../types';

interface RunRow {
  id: string;
  name: string;
  method: string;
  status: number | null;
  timeMs: number;
  tests: TestResult[];
  state: 'pending' | 'running' | 'done' | 'error';
}

export default function RunnerDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (o: boolean) => void }) {
  const state = useApiClient();
  const [collectionId, setCollectionId] = useState<string | null>(state.collections[0]?.id ?? null);
  const [rows, setRows] = useState<RunRow[]>([]);
  const [running, setRunning] = useState(false);

  const collection = state.collections.find((c) => c.id === collectionId) ?? null;
  const requests = useMemo(() => (collection ? flattenRequests(collection.items) : []), [collection]);

  const run = async () => {
    if (!collection) return;
    setRunning(true);
    const activeEnv = state.environments.find((e) => e.id === state.activeEnvId);
    const baseScope = toScope(collection.variables, activeEnv?.variables ?? []);

    const init: RunRow[] = requests.map((r) => ({
      id: r.id,
      name: r.request.name,
      method: r.request.method,
      status: null,
      timeMs: 0,
      tests: [],
      state: 'pending',
    }));
    setRows(init);

    for (let i = 0; i < requests.length; i++) {
      setRows((rs) => rs.map((r, idx) => (idx === i ? { ...r, state: 'running' } : r)));
      try {
        const outcome = await runRequest(requests[i].request, baseScope, collection.auth);
        // Propager les variables extraites aux requêtes suivantes et à l'environnement.
        Object.assign(baseScope, outcome.extracted);
        if (Object.keys(outcome.extracted).length) actions.writeEnvVars(outcome.extracted);
        setRows((rs) =>
          rs.map((r, idx) =>
            idx === i
              ? {
                  ...r,
                  status: outcome.response.status,
                  timeMs: outcome.response.timeMs,
                  tests: outcome.tests,
                  state: outcome.response.ok ? 'done' : 'error',
                }
              : r
          )
        );
      } catch {
        setRows((rs) => rs.map((r, idx) => (idx === i ? { ...r, state: 'error' } : r)));
      }
    }
    setRunning(false);
  };

  const totalTests = rows.reduce((n, r) => n + r.tests.length, 0);
  const passedTests = rows.reduce((n, r) => n + r.tests.filter((t) => t.passed).length, 0);
  const done = rows.length > 0 && !running;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Exécuter une collection</DialogTitle>
          <DialogDescription>
            Les requêtes s'exécutent dans l'ordre ; les variables extraites circulent d'une requête à l'autre.
          </DialogDescription>
        </DialogHeader>

        <div className="flex items-center gap-2">
          <select
            value={collectionId ?? ''}
            onChange={(e) => {
              setCollectionId(e.target.value || null);
              setRows([]);
            }}
            className="h-9 flex-1 rounded-lg border border-input bg-transparent px-2 text-xs"
          >
            <option value="">— choisir une collection —</option>
            {state.collections.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} ({flattenRequests(c.items).length})
              </option>
            ))}
          </select>
          <Button onClick={run} disabled={running || !collection || requests.length === 0} size="sm" className="gap-2">
            {running ? <Loader2 className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />}
            Lancer
          </Button>
        </div>

        {done && (
          <div className="flex items-center gap-4 rounded-lg border border-border bg-muted/30 px-4 py-2.5 text-xs tabular-nums">
            <span>Requêtes : {rows.length}</span>
            <span className="text-emerald-500">{passedTests} tests OK</span>
            <span className="text-red-500">{totalTests - passedTests} échecs</span>
          </div>
        )}

        <div className="max-h-[45vh] overflow-auto rounded-lg border border-border">
          {rows.length === 0 ? (
            <p className="p-4 text-xs text-muted-foreground">
              {collection ? `${requests.length} requête(s) prêtes.` : 'Choisis une collection.'}
            </p>
          ) : (
            <div className="divide-y divide-border">
              {rows.map((r) => {
                const ok = r.tests.length > 0 && r.tests.every((t) => t.passed);
                const failed = r.tests.some((t) => !t.passed) || r.state === 'error';
                return (
                  <div key={r.id} className="px-4 py-2.5 text-xs">
                    <div className="flex items-center gap-2">
                      {r.state === 'running' ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin text-muted-foreground" />
                      ) : r.state === 'pending' ? (
                        <span className="h-3.5 w-3.5 rounded-full border border-border" />
                      ) : failed ? (
                        <XCircle className="h-3.5 w-3.5 text-destructive" />
                      ) : (
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                      )}
                      <span className="font-mono text-[10px] font-semibold text-muted-foreground">{r.method}</span>
                      <span className="truncate">{r.name}</span>
                      {r.state !== 'pending' && r.state !== 'running' && (
                        <span className="ml-auto text-muted-foreground tabular-nums">
                          {r.status ?? 'ERR'} · {r.timeMs} ms
                        </span>
                      )}
                    </div>
                    {r.tests.filter((t) => !t.passed).map((t, i) => (
                      <p key={i} className="ml-5 mt-0.5 text-[11px] text-destructive">✗ {t.name} — {t.error}</p>
                    ))}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
