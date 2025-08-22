// Service Worker for Riverside Academy PWA
const CACHE_NAME = 'riverside-academy-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/about.html',
  '/admissions.html',
  '/contact.html',
  '/events.html',
  '/gallery.html',
  '/login.html',
  '/css/styles.css',
  '/js/main.js',
  '/assets/logos/logo.svg'
];

// Install event - cache resources
self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        console.log('Service Worker: Caching files');
        return cache.addAll(urlsToCache);
      })
      .catch(function(error) {
        console.log('Service Worker: Error caching files', error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          if (cacheName !== CACHE_NAME) {
            console.log('Service Worker: Deleting old cache', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Fetch event - serve cached content when offline
self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        // Return cached version or fetch from network
        if (response) {
          console.log('Service Worker: Serving from cache', event.request.url);
          return response;
        }
        
        console.log('Service Worker: Fetching from network', event.request.url);
        return fetch(event.request).catch(function() {
          // Return offline page if available
          if (event.request.destination === 'document') {
            return caches.match('/index.html');
          }
        });
      })
  );
});

// Background sync for form submissions when online
self.addEventListener('sync', function(event) {
  if (event.tag === 'background-sync') {
    console.log('Service Worker: Background sync triggered');
    event.waitUntil(
      // Handle any background sync tasks here
      Promise.resolve()
    );
  }
});

// Push notification handling
self.addEventListener('push', function(event) {
  if (event.data) {
    const data = event.data.json();
    const options = {
      body: data.body,
      icon: '/assets/logos/logo.svg',
      badge: '/assets/logos/logo.svg',
      vibrate: [100, 50, 100],
      data: {
        dateOfArrival: Date.now(),
        primaryKey: data.primaryKey || 1
      }
    };
    
    event.waitUntil(
      self.registration.showNotification(data.title, options)
    );
  }
});

// Notification click handling
self.addEventListener('notificationclick', function(event) {
  console.log('Service Worker: Notification click received.');
  
  event.notification.close();
  
  event.waitUntil(
    clients.openWindow('/')
  );
});