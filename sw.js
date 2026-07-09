// ══════════════════════════════════════════════
//  SERVICE WORKER — ID-Bov (offline)
//
//  Arquitetura (v14) — pensada para PWA instalado no iPhone:
//  • ABRIR O APP (navegação): REDE PRIMEIRO com timeout → atualização chega
//    na hora; sem internet, cai no cache; sem cache, mostra aviso amigável.
//    NUNCA fica sem resposta (era a causa da tela branca no iOS).
//  • Demais recursos: cache-first (offline no campo).
//  • Pré-cache com {cache:'reload'} — fura o cache HTTP do Safari (era a
//    causa das atualizações nunca chegarem ao iPhone).
// ══════════════════════════════════════════════
const CACHE = 'id-bov-v20';

const PRE_CACHE = [
  './',
  './index.html',
  './manifest.json',
  './icon.svg'
];

// Hosts de CDN cujos scripts precisam funcionar offline (Firebase, SheetJS).
// Respostas de <script> de outra origem chegam "opacas" (status 0) — também
// precisam ser guardadas, senão o Excel/nuvem não funcionam sem internet.
const CDN_HOSTS = ['www.gstatic.com', 'cdnjs.cloudflare.com', 'fonts.googleapis.com', 'fonts.gstatic.com'];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE)
      // {cache:'reload'}: busca SEMPRE da rede, ignorando o cache HTTP do navegador
      .then(c => Promise.all(PRE_CACHE.map(u => c.add(new Request(u, {cache:'reload'})))))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

function comTimeout(promessa, ms){
  return new Promise((res, rej) => {
    const t = setTimeout(() => rej(new Error('timeout')), ms);
    promessa.then(v => { clearTimeout(t); res(v); }, err => { clearTimeout(t); rej(err); });
  });
}

const PAGINA_OFFLINE = `<!DOCTYPE html><html lang="pt-BR"><head><meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0"><title>ID-Bov</title></head>
<body style="font-family:-apple-system,sans-serif;background:#F4F7F3;color:#182720;display:flex;align-items:center;justify-content:center;min-height:100vh;text-align:center;padding:24px">
<div><svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="#1B7A3D" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M4.5 6c0 2 1.4 3.1 3 3.1M19.5 6c0 2-1.4 3.1-3 3.1"/><ellipse cx="12" cy="13.5" rx="5.2" ry="4.6"/><path d="M10 16.8c.55.5 1.2.7 2 .7s1.45-.2 2-.7"/><circle cx="10.2" cy="12.4" r=".45" fill="#1B7A3D"/><circle cx="13.8" cy="12.4" r=".45" fill="#1B7A3D"/></svg><h2>Sem internet agora</h2>
<p style="color:#5A6353;line-height:1.5">O ID-Bov precisa de internet só nesta primeira abertura.<br>Feche o app e abra de novo quando a conexão voltar.</p></div></body></html>`;

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;

  // ── ABRIR O APP: rede primeiro (atualização na hora), cache se offline ──
  if (e.request.mode === 'navigate') {
    e.respondWith((async () => {
      // O fallback de cache é só para o APP (index); /admin.html é online-only
      const ehApp = /(\/|index\.html)$/.test(new URL(e.request.url).pathname);
      const cacheado = ehApp ? await caches.match('./index.html') : null;
      try {
        // Com cache disponível espera pouco pela rede; sem cache, espera mais
        const resp = await comTimeout(fetch(e.request.url, {cache:'no-cache'}), cacheado ? 4000 : 20000);
        if (resp && resp.status === 200) {
          if (ehApp) {
            const copia = resp.clone();
            caches.open(CACHE).then(c => { c.put('./index.html', copia); }).catch(() => {});
          }
          return resp;
        }
        return cacheado || resp;
      } catch (err) {
        if (cacheado) return cacheado;
        // Último recurso: aviso amigável — NUNCA tela branca
        return new Response(PAGINA_OFFLINE, {headers:{'Content-Type':'text/html; charset=utf-8'}});
      }
    })());
    return;
  }

  // ── Demais recursos: cache-first (funciona 100% offline no campo) ──
  e.respondWith((async () => {
    const hit = await caches.match(e.request, {ignoreSearch:false});
    if (hit) return hit;
    try {
      const resp = await fetch(e.request);
      const opacaDeCDN = resp && resp.type === 'opaque' && CDN_HOSTS.includes(new URL(e.request.url).hostname);
      if (resp && (resp.status === 200 || opacaDeCDN)) {
        const copia = resp.clone();
        caches.open(CACHE).then(c => c.put(e.request, copia)).catch(() => {});
      }
      return resp;
    } catch (err) {
      // Sem rede e sem cache: devolve erro controlado (nunca promessa rejeitada)
      return Response.error();
    }
  })());
});
