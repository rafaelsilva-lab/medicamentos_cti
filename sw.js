// Service Worker com Auto-Atualização
// ⚠️ IMPORTANTE: Muda esse número a cada atualização do site!
const VERSION = '3.0.1';
const CACHE_NAME = `medicamentos-cti-v${VERSION}`;

// Arquivos para cachear
const urlsToCache = [
  './',
  './index.html',
  './manifest.json'
];

// Instalação - cacheia os arquivos
self.addEventListener('install', (event) => {
  console.log('[SW] Instalando versão:', VERSION);
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[SW] Cache aberto');
        return cache.addAll(urlsToCache);
      })
      .then(() => {
        // Força o novo SW a assumir imediatamente
        return self.skipWaiting();
      })
  );
});

// Ativação - limpa caches antigos
self.addEventListener('activate', (event) => {
  console.log('[SW] Ativando versão:', VERSION);
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('[SW] Deletando cache antigo:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      // Assume controle imediatamente
      return self.clients.claim();
    })
  );
});

// Fetch - estratégia Network First (sempre tenta buscar do servidor primeiro)
self.addEventListener('fetch', (event) => {
  event.respondWith(
    // Tenta buscar do servidor primeiro
    fetch(event.request)
      .then((response) => {
        // Se conseguiu, atualiza o cache
        if (response && response.status === 200) {
          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return response;
      })
      .catch(() => {
        // Se falhou (offline), busca do cache
        return caches.match(event.request).then((response) => {
          if (response) {
            return response;
          }
          // Se não tem no cache, retorna página offline
          return new Response('Offline - sem conexão', {
            status: 503,
            statusText: 'Service Unavailable'
          });
        });
      })
  );
});

// Mensagem para notificar atualização
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
