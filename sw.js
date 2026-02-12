self.addEventListener('fetch', function(event) {
  // Isso permite que o site funcione de forma básica
  event.respondWith(fetch(event.request));
});
