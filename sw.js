const CACHE_NAME = 'kitabah-cache-v5';
const ASSETS_TO_CACHE = [
  '/',
  'index.html',
  'index.css',
  'manifest.json',
  'https://unpkg.com/lucide@latest',
  'https://fonts.googleapis.com/css2?family=Dancing+Script:wght@400;700&family=Noto+Naskh+Arabic:wght@400;700&family=Roboto:wght@400;500&display=swap'
];

// Install: Pre-cache the app shell
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Service Worker: Caching App Shell');
        return cache.addAll(ASSETS_TO_CACHE);
      })
  );
});

// Activate: Clean up old caches
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (!cacheWhitelist.includes(cacheName)) {
            console.log('Service Worker: Deleting old cache', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch: Stale-While-Revalidate strategy
self.addEventListener('fetch', event => {
  // Ignore non-GET requests
  if (event.request.method !== 'GET') {
    return;
  }

  // For font requests, use a cache-first strategy for performance.
  if (event.request.url.startsWith('https://fonts.gstatic.com')) {
      event.respondWith(
          caches.open(CACHE_NAME).then(cache => {
              return cache.match(event.request).then(response => {
                  return response || fetch(event.request).then(networkResponse => {
                      cache.put(event.request, networkResponse.clone());
                      return networkResponse;
                  });
              });
          })
      );
      return;
  }
  
  // Stale-while-revalidate for all other requests
  event.respondWith(
    caches.open(CACHE_NAME).then(cache => {
      return cache.match(event.request)
        .then(cachedResponse => {
          const fetchPromise = fetch(event.request).then(networkResponse => {
            // Check for valid response to cache
            if (networkResponse && networkResponse.status === 200) {
              cache.put(event.request, networkResponse.clone());
            }
            return networkResponse;
          }).catch(err => {
            console.error('Service Worker: Fetch failed.', err);
            // If fetch fails (e.g., offline) and we have a cached response, the cached response is still returned.
            // If there's no cached response either, the promise rejects, and the browser shows its offline page.
          });

          // Return cached response immediately if available, otherwise wait for network
          return cachedResponse || fetchPromise;
        });
    })
  );
});
