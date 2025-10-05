const CACHE_NAME = 'kenya-pulse-connect-v2';
const urlsToCache = [
  '/',
  '/static/js/bundle.js',
  '/static/css/main.css',
  '/manifest.json'
];

// Install service worker
self.addEventListener('install', (event) => {
  console.log('Service Worker installing...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(urlsToCache);
      })
  );
  self.skipWaiting();
});

// Fetch event - serve cached content when offline
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Return cached version or fetch from network
        return response || fetch(event.request);
      })
  );
});

// Activate event - clean up old caches
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

// Handle push notifications
self.addEventListener('push', (event) => {
  console.log('Push notification received:', event);
  
  let notificationData = {
    title: 'Kenya Pulse Connect',
    body: 'New update available!',
    icon: '/logo-192.png',
    badge: '/logo-192.png',
    tag: 'default',
    requireInteraction: false,
    vibrate: [200, 100, 200],
    sound: '/notification.mp3',
  };

  try {
    if (event.data) {
      const data = event.data.json();
      notificationData = {
        title: data.title || notificationData.title,
        body: data.body || data.message || notificationData.body,
        icon: data.icon || notificationData.icon,
        badge: notificationData.badge,
        tag: data.tag || data.type || 'default',
        requireInteraction: data.priority === 'high',
        vibrate: data.priority === 'high' ? [300, 100, 300, 100, 300] : [200, 100, 200],
        sound: data.sound || notificationData.sound,
        data: {
          url: data.url || '/',
          type: data.type || 'system',
          timestamp: Date.now(),
          ...data
        },
        actions: data.actions || [
          {
            action: 'view',
            title: 'View Details',
            icon: '/logo-192.png'
          },
          {
            action: 'dismiss',
            title: 'Dismiss',
            icon: '/logo-192.png'
          }
        ]
      };
    }
  } catch (error) {
    console.error('Error parsing push notification data:', error);
  }

  event.waitUntil(
    self.registration.showNotification(notificationData.title, notificationData)
  );
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  console.log('Notification clicked:', event.action, event.notification.data);
  event.notification.close();

  const urlToOpen = event.notification.data?.url || '/';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then((clientList) => {
        // Check if there's already a window open
        for (let i = 0; i < clientList.length; i++) {
          const client = clientList[i];
          if (client.url === urlToOpen && 'focus' in client) {
            return client.focus();
          }
        }
        // If not, open a new window
        if (clients.openWindow) {
          return clients.openWindow(urlToOpen);
        }
      })
  );
});

// Background sync for offline notifications
self.addEventListener('sync', (event) => {
  console.log('Background sync triggered:', event.tag);
  if (event.tag === 'sync-notifications') {
    event.waitUntil(syncNotifications());
  }
});

async function syncNotifications() {
  try {
    // Fetch any pending notifications
    console.log('Syncing notifications...');
  } catch (error) {
    console.error('Error syncing notifications:', error);
  }
}