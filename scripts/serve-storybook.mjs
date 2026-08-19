import { createReadStream, statSync } from 'node:fs';
import { createServer } from 'node:http';
import { extname, resolve, sep } from 'node:path';
import { URL } from 'node:url';

const root = resolve('storybook-static');
const port = Number(globalThis.process.env.STORYBOOK_PORT ?? 6006);
const mimeTypes = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.map': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.woff2': 'font/woff2'
};

const server = createServer((request, response) => {
  try {
    const pathname = decodeURIComponent(new URL(request.url ?? '/', 'http://127.0.0.1').pathname);
    const relativePath = pathname === '/' ? 'index.html' : pathname.replace(/^\/+/, '');
    const target = resolve(root, relativePath);

    if (target !== root && !target.startsWith(`${root}${sep}`)) {
      response.writeHead(403).end('Forbidden');
      return;
    }

    const stats = statSync(target);
    if (!stats.isFile()) throw new Error('Not a file');

    response.writeHead(200, {
      'Cache-Control': 'no-store',
      'Content-Length': stats.size,
      'Content-Type': mimeTypes[extname(target)] ?? 'application/octet-stream'
    });
    if (request.method === 'HEAD') {
      response.end();
      return;
    }
    createReadStream(target).pipe(response);
  } catch {
    response.writeHead(404).end('Not found');
  }
});

server.listen(port, '127.0.0.1', () => {
  globalThis.console.log(`Storybook server listening on http://127.0.0.1:${port}`);
});

const close = () => server.close(() => globalThis.process.exit(0));
globalThis.process.on('SIGINT', close);
globalThis.process.on('SIGTERM', close);
