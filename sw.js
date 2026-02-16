const cacheName = 'medcti-v2';
const resourcesToPrecache = [
  './',
  'index.html' // Se o seu arquivo principal tiver outro nome, troque aqui
];

// Instala e guarda os arquivos no cache
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(cacheName).then((cache) => {
      return cache.addAll(resourcesToPrecache);
    })
  );
});

// Faz o site carregar do cache se estiver sem internet
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      return cachedResponse || fetch(event.request);
    })
  );
});
