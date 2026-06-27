const CACHE_NAME = 'sushi-kounter-v1';
const ASSETS = [
  'index.html',
  'manifest.json'
];

// Installazione e salvataggio in cache dei file necessari
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );
});

// Strategia: Prima controlla la cache, se non c'è internet usa i file locali
self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((response) => {
      return response || fetch(e.request);
    })
  );
});
