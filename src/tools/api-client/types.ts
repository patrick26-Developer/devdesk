export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'HEAD' | 'OPTIONS';

export const METHODS: HttpMethod[] = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS'];

export interface KV {
  id: string;
  key: string;
  value: string;
  enabled: boolean;
}

export interface Variable {
  id: string;
  key: string;
  value: string;
  enabled: boolean;
  secret?: boolean;
}

export type AuthConfig =
  | { type: 'none' }
  | { type: 'inherit' }
  | { type: 'bearer'; token: string }
  | { type: 'basic'; username: string; password: string }
  | { type: 'apikey'; key: string; value: string; in: 'header' | 'query' };

export type BodyType = 'none' | 'json' | 'text' | 'form' | 'urlencoded' | 'graphql';

export interface BodyConfig {
  type: BodyType;
  /** Contenu brut (json / text / graphql). */
  content: string;
  /** Champs pour form-data / x-www-form-urlencoded. */
  fields: KV[];
}

export interface ExtractRule {
  id: string;
  enabled: boolean;
  /** Source : corps JSON (chemin type `data.token`) ou en-tête (nom d'en-tête). */
  source: 'body' | 'header';
  path: string;
  /** Nom de la variable cible (écrite dans l'environnement actif). */
  target: string;
}

export interface RequestDef {
  name: string;
  method: HttpMethod;
  url: string;
  params: KV[];
  headers: KV[];
  auth: AuthConfig;
  body: BodyConfig;
  preRequestScript: string;
  testScript: string;
  extract: ExtractRule[];
}

export type CollectionItem =
  | { type: 'folder'; id: string; name: string; items: CollectionItem[] }
  | { type: 'request'; id: string; request: RequestDef };

export interface Collection {
  id: string;
  name: string;
  variables: Variable[];
  auth: AuthConfig;
  items: CollectionItem[];
}

export interface Environment {
  id: string;
  name: string;
  variables: Variable[];
}

export interface ResponseData {
  ok: boolean;
  status: number | null;
  statusText: string;
  headers: Record<string, string>;
  body: string;
  error?: string;
  timeMs: number;
  sizeBytes: number;
  finalUrl?: string;
  redirected?: boolean;
}

export interface TestResult {
  name: string;
  passed: boolean;
  error?: string;
}

export interface HistoryEntry {
  id: string;
  ts: number;
  method: string;
  url: string;
  status: number | null;
  ok: boolean;
  timeMs: number;
  sizeBytes: number;
  request: RequestDef;
  response: ResponseData;
  tests: TestResult[];
}

export interface ApiClientState {
  environments: Environment[];
  activeEnvId: string | null;
  collections: Collection[];
  history: HistoryEntry[];
  /** Requête ouverte dans l'onglet de travail (brouillon non enregistré). */
  draft: RequestDef;
  /** Id de la requête de collection actuellement éditée (ou null si brouillon libre). */
  activeRequestId: string | null;
}

export function newId(prefix = 'id'): string {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}`;
}

export function emptyRequest(name = 'Requête'): RequestDef {
  return {
    name,
    method: 'GET',
    url: '',
    params: [],
    headers: [],
    auth: { type: 'inherit' },
    body: { type: 'none', content: '', fields: [] },
    preRequestScript: '',
    testScript: '',
    extract: [],
  };
}

export function defaultState(): ApiClientState {
  const envId = newId('env');
  return {
    environments: [
      {
        id: envId,
        name: 'Local',
        variables: [
          { id: newId('v'), key: 'baseUrl', value: 'http://localhost:3000', enabled: true },
          { id: newId('v'), key: 'accessToken', value: '', enabled: true, secret: true },
        ],
      },
    ],
    activeEnvId: envId,
    collections: [],
    history: [],
    draft: {
      ...emptyRequest('Requête'),
      method: 'POST',
      url: '{{baseUrl}}/api/auth/login',
      headers: [{ id: newId('h'), key: 'Content-Type', value: 'application/json', enabled: true }],
      body: {
        type: 'json',
        content: '{\n  "email": "admin@superette.local",\n  "password": "Admin@123456"\n}',
        fields: [],
      },
      extract: [
        { id: newId('x'), enabled: true, source: 'body', path: 'accessToken', target: 'accessToken' },
      ],
      testScript:
        "pm.test('statut 200', () => pm.expect(pm.response.code).to.equal(200));\npm.test('accessToken présent', () => pm.expect(pm.response.json().accessToken).to.be.a('string'));",
    },
    activeRequestId: null,
  };
}
