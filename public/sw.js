const CACHE_NAME = 'foodix-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icon-192.png',
  '/icon-512.png'
];

// Instalar Service Worker
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Cache abierto');
        return cache.addAll(urlsToCache);
      })
  );
});

// Activar Service Worker
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Interceptar requests
self.addEventListener('fetch', (event) => {
  // Estrategia: Network First, Cache Fallback
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Clonar la respuesta
        const responseToCache = response.clone();
        
        caches.open(CACHE_NAME)
          .then((cache) => {
            // No cachear requests de Airtable
            if (!event.request.url.includes('airtable.com')) {
              cache.put(event.request, responseToCache);
            }
          });
        
        return response;
      })
      .catch(() => {
        // Si falla la red, buscar en cache
        return caches.match(event.request)
          .then((response) => {
            if (response) {
              return response;
            }
            // Página offline por defecto
            return new Response('Sin conexión', {
              headers: { 'Content-Type': 'text/plain' }
            });
          });
      })
  );
});

// Manejar notificaciones push (opcional)
self.addEventListener('push', (event) => {
  const options = {
    body: event.data ? event.data.text() : 'Nueva actualización disponible',
    icon: '/icon-192.png',
    badge: '/icon-192.png',
    vibrate: [200, 100, 200]
  };
  
  event.waitUntil(
    self.registration.showNotification('Foodix Inventario', options)
  );
});