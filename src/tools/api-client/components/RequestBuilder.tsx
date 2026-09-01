import { useState } from 'react';
import { Loader2, Play, Save } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

import { METHODS, type HttpMethod, type RequestDef } from '../types';
import KvEditor from './KvEditor';
import AuthEditor from './AuthEditor';
import BodyEditor from './BodyEditor';
import ExtractEditor from './ExtractEditor';
import { useT } from '@/i18n';

const METHOD_COLOR: Record<string, string> = {
  GET: 'text-emerald-500',
  POST: 'text-blue-500',
  PUT: 'text-amber-500',
  PATCH: 'text-violet-500',
  DELETE: 'text-red-500',
  HEAD: 'text-muted-foreground',
  OPTIONS: 'text-muted-foreground',
};

type Tab = 'params' | 'headers' | 'auth' | 'body' | 'scripts' | 'tests' | 'extract';

interface RequestBuilderProps {
  request: RequestDef;
  onChange: (patch: Partial<RequestDef>) => void;
  onSend: () => void;
  onSave: () => void;
  loading: boolean;
  dirty: boolean;
}

export default function RequestBuilder({ request, onChange, onSend, onSave, loading, dirty }: RequestBuilderProps) {
  const t = useT();
  const [tab, setTab] = useState<Tab>('body');
  const bodyDisabled = request.method === 'GET' || request.method === 'HEAD';

  const count = {
    params: request.params.filter((p) => p.enabled && p.key).length,
    headers: request.headers.filter((h) => h.enabled && h.key).length,
    extract: request.extract.filter((e) => e.enabled).length,
  };

  const tabs: { key: Tab; label: string; badge?: number }[] = [
    { key: 'params', label: t('api.tab.params'), badge: count.params },
    { key: 'headers', label: t('api.tab.headers'), badge: count.headers },
    { key: 'auth', label: t('api.tab.auth') },
    { key: 'body', label: t('api.tab.body') },
    { key: 'scripts', label: t('api.tab.prescript') },
    { key: 'tests', label: t('api.tab.tests') },
    { key: 'extract', label: t('api.tab.extract'), badge: count.extract },
  ];

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      {/* Barre méthode + URL */}
      <div className="flex flex-col gap-2 border-b border-border p-3 md:flex-row">
        <select
          value={request.method}
          onChange={(e) => onChange({ method: e.target.value as HttpMethod })}
          className={`h-10 rounded-lg border border-input bg-transparent px-3 text-xs font-semibold outline-none focus-visible:ring-3 focus-visible:ring-ring/50 ${METHOD_COLOR[request.method] ?? ''}`}
        >
          {METHODS.map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>
        <Input
          value={request.url}
          onChange={(e) => onChange({ url: e.target.value })}
          placeholder="{{baseUrl}}/api/…"
          className="h-10 flex-1 font-mono text-xs"
        />
        <div className="flex gap-2">
          <Button onClick={onSend} disabled={loading || !request.url.trim()} className="h-10 gap-2 px-5">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />}
            {t('api.send')}
          </Button>
          <Button variant="secondary" size="icon" onClick={onSave} className="h-10 w-10" title={dirty ? t('api.saveTooltip') : t('api.saved')}>
            <Save className={`h-4 w-4 ${dirty ? 'text-primary' : ''}`} />
          </Button>
        </div>
      </div>

      {/* Onglets */}
      <div className="flex shrink-0 gap-1 overflow-x-auto border-b border-border px-3 py-1.5">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`flex shrink-0 items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
              tab === t.key ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {t.label}
            {t.badge ? (
              <span className="rounded-full bg-muted px-1.5 text-[10px] tabular-nums text-muted-foreground">{t.badge}</span>
            ) : null}
          </button>
        ))}
      </div>

      {/* Contenu de l'onglet */}
      <div className="flex min-h-0 flex-1 flex-col overflow-auto p-4">
        {tab === 'params' && (
          <KvEditor rows={request.params} onChange={(params) => onChange({ params })} addLabel={t('api.addParam')} />
        )}
        {tab === 'headers' && (
          <KvEditor rows={request.headers} onChange={(headers) => onChange({ headers })} addLabel={t('api.addHeader')} />
        )}
        {tab === 'auth' && <AuthEditor auth={request.auth} onChange={(auth) => onChange({ auth })} />}
        {tab === 'body' && (
          <BodyEditor body={request.body} onChange={(body) => onChange({ body })} disabled={bodyDisabled} />
        )}
        {tab === 'scripts' && (
          <div className="flex min-h-0 flex-1 flex-col gap-2">
            <p className="text-xs text-muted-foreground">
              {t('api.prescriptHint')}
            </p>
            <Textarea
              value={request.preRequestScript}
              onChange={(e) => onChange({ preRequestScript: e.target.value })}
              spellCheck={false}
              placeholder="pm.variables.set('requestId', crypto.randomUUID());"
              className="min-h-0 flex-1 resize-none font-mono text-xs leading-5"
            />
          </div>
        )}
        {tab === 'tests' && (
          <div className="flex min-h-0 flex-1 flex-col gap-2">
            <p className="text-xs text-muted-foreground">
              {t('api.testsHint')}
            </p>
            <Textarea
              value={request.testScript}
              onChange={(e) => onChange({ testScript: e.target.value })}
              spellCheck={false}
              placeholder={"pm.test('statut 200', () => pm.expect(pm.response.code).to.equal(200));"}
              className="min-h-0 flex-1 resize-none font-mono text-xs leading-5"
            />
          </div>
        )}
        {tab === 'extract' && <ExtractEditor rules={request.extract} onChange={(extract) => onChange({ extract })} />}
      </div>
    </div>
  );
}
