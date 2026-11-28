import { createHash } from 'node:crypto';
import { readdirSync } from 'node:fs';
import { join } from 'node:path';
import type { Plugin } from 'vite';

/**
 * Emits /sw.js at build time with the full list of built files, so the whole app (every lesson,
 * problem, prep topic and Infosys problem chunk) is available offline after the first visit.
 */
export function pwa(root: string): Plugin {
  return {
    name: 'stepwise-pwa',
    apply: 'build',
    generateBundle(_opts, bundle) {
      const files = Object.keys(bundle).filter((f) => !f.endsWith('.map'));
      const pub = readdirSync(join(root, 'public'));
      const precache = ['/', ...[...files, ...pub].filter((f) => f !== 'index.html').map((f) => '/' + f.replace(/\\/g, '/'))];
      const version = createHash('sha1').update(precache.join('\n')).digest('hex').slice(0, 10);
      this.emitFile({ type: 'asset', fileName: 'sw.js', source: serviceWorker(version, precache) });
    },
  };
}

function serviceWorker(version: string, precache: string[]) {
  return `/* Stepwise service worker — generated at build time. Version ${version}. */
const VERSION = ${JSON.stringify(version)};
const APP = 'sw-app-' + VERSION;
const RUNTIME = 'sw-runtime-v1';
const PRECACHE = ${JSON.stringify(precache)};

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(APP).then(async (cache) => {
      // Add files one by one so a single failure doesn't abort the whole install.
      await Promise.all(PRECACHE.map((url) => cache.add(new Request(url, { cache: 'reload' })).catch(() => {})));
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      // Keep the current and the previous app version (open tabs may still lazy-load old chunks).
      const keys = (await caches.keys()).filter((k) => k.startsWith('sw-app-') && k !== APP);
      const meta = await caches.open('sw-meta');
      const prev = await meta.match('/__prev-version').then((r) => (r ? r.text() : null));
      await Promise.all(keys.filter((k) => k !== 'sw-app-' + prev).map((k) => caches.delete(k)));
      const cur = await meta.match('/__version').then((r) => (r ? r.text() : null));
      if (cur && cur !== VERSION) await meta.put('/__prev-version', new Response(cur));
      await meta.put('/__version', new Response(VERSION));
      await self.clients.claim();
    })()
  );
});

const isRuntimeAsset = (url) =>
  url.hostname === 'cdn.jsdelivr.net' || url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com';

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);

  // The API is handled by the app (it keeps its own per-user offline cache and sync queue).
  if (url.origin === location.origin && url.pathname.startsWith('/api/')) return;

  // Page navigations: network first (fresh deploys), fall back to the cached app shell when offline.
  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req)
        .then((res) => {
          const copy = res.clone();
          caches.open(APP).then((c) => c.put('/', copy));
          return res;
        })
        .catch(() => caches.match('/').then((r) => r || caches.match('/index.html')))
    );
    return;
  }

  // Built assets and public files: cache first.
  if (url.origin === location.origin) {
    event.respondWith(
      caches.match(req).then(
        (hit) =>
          hit ||
          fetch(req).then((res) => {
            if (res.ok) {
              const copy = res.clone();
              caches.open(APP).then((c) => c.put(req, copy));
            }
            return res;
          })
      )
    );
    return;
  }

  // The Python runtime (Pyodide) and fonts: cache first, kept across app versions.
  if (isRuntimeAsset(url)) {
    event.respondWith(
      caches.open(RUNTIME).then((cache) =>
        cache.match(req).then(
          (hit) =>
            hit ||
            fetch(req).then((res) => {
              if (res.ok || res.type === 'opaque') cache.put(req, res.clone());
              return res;
            })
        )
      )
    );
  }
});

// The app asks for a status report (what is available offline).
self.addEventListener('message', async (event) => {
  if (event.data?.type !== 'status') return;
  const app = await caches.open(APP);
  const runtime = await caches.open(RUNTIME);
  const appKeys = await app.keys();
  const runtimeKeys = await runtime.keys();
  const python = runtimeKeys.some((r) => r.url.includes('pyodide.asm.wasm'));
  event.ports[0]?.postMessage({ version: VERSION, appFiles: appKeys.length, total: PRECACHE.length, python });
});
`;
}
