// Incrementa questo numero (es. v2, v3) ogni volta che modifichi l'index.html
const CACHE_NAME = 'sushi-kounter-v2'; 
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  // Aggiungi qui le icone se le hai, es: './icon-192.png'
];

// Installazione e salvataggio asset in cache
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    }).then(() => self.skipWaiting()) // Forza l'attivazione immediata
  );
});

// Pulizia delle vecchie cache quando la nuova v2 si attiva
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim()) // Prende il controllo immediato delle pagine aperte
  );
});

// Strategia Network-First: prova a scaricare dal web, se offline usa la cache
self.addEventListener('fetch', (e) => {
  e.respondWith(
    fetch(e.request).then((response) => {
      // Se la risposta è valida, aggiorna la cache in background
      if (response.status === 200 && e.request.method === 'GET') {
        const responseClone = response.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(e.request, responseClone);
        });
      }
      return response;
    }).catch(() => {
      // Se sei offline o il network fallisce, usa la cache
      return caches.match(e.request).then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse;
        }
        // Fallback estremo se manca anche la cache (es. navigazione su una pagina nuova offline)
        if (e.request.mode === 'navigate') {
          return caches.match('./index.html');
        }
      });
    })
  );
});
