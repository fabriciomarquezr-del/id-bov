// ══════════════════════════════════════════════
//  SERVICE WORKER — ID-Bov (offline)
// ══════════════════════════════════════════════
const CACHE = 'id-bov-v11';

const PRE_CACHE = [
  './',
  './index.html',
  './manifest.json',
  './icon.svg'
];

self.addEventListener('install', e => {
  self.skipWaiting();
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(PRE_CACHE)));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

// Hosts de CDN cujos scripts precisam funcionar offline (Firebase, SheetJS).
// Respostas de <script> de outra origem chegam "opacas" (status 0) — também
// precisam ser guardadas, senão o Excel/nuvem não funcionam sem internet.
const CDN_HOSTS = ['www.gstatic.com', 'cdnjs.cloudflare.com', 'fonts.googleapis.com', 'fonts.gstatic.com'];

// Cache-first: funciona 100% offline no campo
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    caches.match(e.request).then(hit => {
      if (hit) return hit;
      return fetch(e.request).then(resp => {
        const opacaDeCDN = resp && resp.type === 'opaque' && CDN_HOSTS.includes(new URL(e.request.url).hostname);
        if (resp && (resp.status === 200 || opacaDeCDN)) {
          const copy = resp.clone();
          caches.open(CACHE).then(c => c.put(e.request, copy)).catch(() => {});
        }
        return resp;
      });
    })
  );
});
