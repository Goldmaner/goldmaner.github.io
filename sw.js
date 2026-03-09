// Service Worker — Network-first com fallback offline
const CACHE_NAME = 'daf-afericao-v3';
const ASSETS = [
  './',
  './index.html',
  './manifest.json'
];

// Instala e cacheia os assets essenciais para uso offline
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(ASSETS))
      .then(() => self.skipWaiting())
  );
});

// Limpa caches antigos ao ativar nova versão
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

// Estratégia: network-first, fallback para cache se offline
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  event.respondWith(
    fetch(event.request).then(response => {
      // Atualiza o cache com a resposta mais recente
      if (response.ok) {
        const clone = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
      }
      return response;
    }).catch(() => {
      // Sem rede — entrega do cache
      return caches.match(event.request)
        .then(cached => cached || caches.match('./index.html'));
    })
  );
});
