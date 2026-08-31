import * as YAML from 'yaml';

import { emptyRequest, newId, type Collection, type CollectionItem, type HttpMethod, type KV } from './types';

const METHODS = ['get', 'post', 'put', 'patch', 'delete', 'head', 'options'];

interface ParsedDoc {
  info?: { title?: string };
  servers?: { url: string }[];
  host?: string;
  basePath?: string;
  schemes?: string[];
  paths?: Record<string, Record<string, unknown>>;
}

function exampleFromSchema(schema: unknown, depth = 0): unknown {
  if (!schema || typeof schema !== 'object' || depth > 4) return undefined;
  const s = schema as Record<string, unknown>;
  if (s.example !== undefined) return s.example;
  if (s.default !== undefined) return s.default;
  if (Array.isArray(s.enum) && s.enum.length) return s.enum[0];
  switch (s.type) {
    case 'string':
      return s.format === 'date-time' ? new Date().toISOString() : 'string';
    case 'integer':
    case 'number':
      return 0;
    case 'boolean':
      return true;
    case 'array':
      return [exampleFromSchema(s.items, depth + 1)].filter((x) => x !== undefined);
    case 'object':
    default: {
      const props = (s.properties as Record<string, unknown>) || {};
      const out: Record<string, unknown> = {};
      for (const [k, v] of Object.entries(props)) {
        const ex = exampleFromSchema(v, depth + 1);
        if (ex !== undefined) out[k] = ex;
      }
      return Object.keys(out).length || s.type === 'object' ? out : undefined;
    }
  }
}

export function parseSpec(text: string): Collection {
  let doc: ParsedDoc;
  try {
    doc = JSON.parse(text);
  } catch {
    doc = YAML.parse(text) as ParsedDoc;
  }
  if (!doc || !doc.paths) throw new Error('Spécification invalide : aucune section "paths".');

  // Base URL
  let baseUrl = '';
  if (doc.servers?.[0]?.url) baseUrl = doc.servers[0].url;
  else if (doc.host) baseUrl = `${(doc.schemes?.[0] as string) || 'https'}://${doc.host}${doc.basePath || ''}`;

  const rootItems: CollectionItem[] = [];
  const byTag: Record<string, CollectionItem[]> = {};

  for (const [rawPath, methods] of Object.entries(doc.paths)) {
    for (const method of METHODS) {
      const op = (methods as Record<string, unknown>)[method] as Record<string, unknown> | undefined;
      if (!op) continue;

      const req = emptyRequest(
        (op.summary as string) || (op.operationId as string) || `${method.toUpperCase()} ${rawPath}`
      );
      req.method = method.toUpperCase() as HttpMethod;
      req.url = `{{baseUrl}}${rawPath.replace(/\{([^}]+)\}/g, ':$1')}`;

      // Paramètres query + path
      const params = [
        ...(((methods as Record<string, unknown>).parameters as unknown[]) || []),
        ...((op.parameters as unknown[]) || []),
      ] as Record<string, unknown>[];
      const query: KV[] = [];
      const headers: KV[] = [];
      for (const p of params) {
        if (p.in === 'query') query.push({ id: newId('kv'), key: String(p.name), value: '', enabled: !!p.required });
        if (p.in === 'header') headers.push({ id: newId('kv'), key: String(p.name), value: '', enabled: !!p.required });
      }
      req.params = query;
      req.headers = headers;

      // Corps
      const rb = op.requestBody as Record<string, unknown> | undefined;
      const jsonSchema =
        (rb?.content as Record<string, Record<string, unknown>>)?.['application/json']?.schema ??
        // Swagger 2.0 : body dans parameters
        (params.find((p) => p.in === 'body') as Record<string, unknown> | undefined)?.schema;
      if (jsonSchema && req.method !== 'GET' && req.method !== 'HEAD') {
        const example = exampleFromSchema(jsonSchema);
        req.body = {
          type: 'json',
          content: example !== undefined ? JSON.stringify(example, null, 2) : '{}',
          fields: [],
        };
        req.headers.push({ id: newId('kv'), key: 'Content-Type', value: 'application/json', enabled: true });
      }

      const item: CollectionItem = { type: 'request', id: newId('req'), request: req };
      const tags = (op.tags as string[]) || [];
      if (tags.length) {
        const tag = tags[0];
        (byTag[tag] ||= []).push(item);
      } else {
        rootItems.push(item);
      }
    }
  }

  const folders: CollectionItem[] = Object.entries(byTag).map(([name, items]) => ({
    type: 'folder',
    id: newId('fld'),
    name,
    items,
  }));

  return {
    id: newId('col'),
    name: doc.info?.title || 'API importée',
    variables: baseUrl ? [{ id: newId('v'), key: 'baseUrl', value: baseUrl, enabled: true }] : [],
    auth: { type: 'none' },
    items: [...folders, ...rootItems],
  };
}
