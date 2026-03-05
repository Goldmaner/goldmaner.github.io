// Service Worker — Cache-first para uso offline
const CACHE_NAME = 'daf-afericao-v1';
const ASSETS = [
  './',
  './index.html',
  './manifest.json'
];

// Instala e cacheia todos os assets
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

// Estratégia: cache-first, fallback para rede
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;
      return fetch(event.request).then(response => {
        // Cacheia novos requests bem-sucedidos
        if (response.ok && event.request.method === 'GET') {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
        }
        return response;
      });
    }).catch(() => {
      // Offline e não em cache — retorna o index.html como fallback
      return caches.match('./index.html');
    })
  );
});
