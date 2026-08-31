import type { RequestDef } from './types';

function effHeaders(req: RequestDef): Record<string, string> {
  const h: Record<string, string> = {};
  for (const x of req.headers.filter((x) => x.enabled && x.key)) h[x.key] = x.value;
  if (req.auth.type === 'bearer' && req.auth.token) h['Authorization'] = `Bearer ${req.auth.token}`;
  if (req.auth.type === 'basic') h['Authorization'] = `Basic <base64(${req.auth.username}:••••)>`;
  return h;
}

function body(req: RequestDef): string | null {
  if (req.method === 'GET' || req.method === 'HEAD') return null;
  if (req.body.type === 'json' || req.body.type === 'text') return req.body.content || null;
  if (req.body.type === 'graphql') return JSON.stringify({ query: req.body.content });
  return null;
}

export function toFetch(req: RequestDef): string {
  const h = effHeaders(req);
  const b = body(req);
  const opts: string[] = [`  method: '${req.method}'`];
  if (Object.keys(h).length) opts.push(`  headers: ${JSON.stringify(h, null, 2).replace(/\n/g, '\n  ')}`);
  if (b) opts.push(`  body: ${JSON.stringify(b)}`);
  return `const res = await fetch('${req.url}', {\n${opts.join(',\n')}\n});\nconst data = await res.json();`;
}

export function toAxios(req: RequestDef): string {
  const h = effHeaders(req);
  const b = body(req);
  const cfg: string[] = [`  method: '${req.method}'`, `  url: '${req.url}'`];
  if (Object.keys(h).length) cfg.push(`  headers: ${JSON.stringify(h, null, 2).replace(/\n/g, '\n  ')}`);
  if (b) {
    try {
      cfg.push(`  data: ${JSON.stringify(JSON.parse(b), null, 2).replace(/\n/g, '\n  ')}`);
    } catch {
      cfg.push(`  data: ${JSON.stringify(b)}`);
    }
  }
  return `import axios from 'axios';\n\nconst { data } = await axios({\n${cfg.join(',\n')}\n});`;
}

export function toHttpie(req: RequestDef): string {
  const parts = ['http', req.method, `'${req.url}'`];
  for (const [k, v] of Object.entries(effHeaders(req))) parts.push(`'${k}:${v}'`);
  const b = body(req);
  if (b) {
    try {
      const obj = JSON.parse(b) as Record<string, unknown>;
      for (const [k, v] of Object.entries(obj)) {
        parts.push(typeof v === 'string' ? `${k}='${v}'` : `${k}:='${JSON.stringify(v)}'`);
      }
    } catch {
      return `echo '${b}' | ` + parts.join(' ');
    }
  }
  return parts.join(' ');
}
