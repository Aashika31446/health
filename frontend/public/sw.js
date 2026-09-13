self.addEventListener('install', function(event) {
  self.skipWaiting();
});

self.addEventListener('activate', function(event) {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('push', function(event) {
  let data = {};
  if (event.data) {
    try {
      data = event.data.json();
    } catch (e) {
      data = { title: "CuraMind Notification", body: event.data.text() };
    }
  }

  const title = data.title || "CuraMind Reminder";
  const options = {
    body: data.body || "It's time to take your medication.",
    icon: '/favicon.ico',
    badge: '/favicon.ico',
    vibrate: [200, 100, 200, 100, 200, 100, 200],
    requireInteraction: true,
    data: {
        dateOfArrival: Date.now(),
        primaryKey: '2'
    }
  };

  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window' }).then(windowClients => {
      // Check if there is already a window/tab open with the target URL
      for (let i = 0; i < windowClients.length; i++) {
        let client = windowClients[i];
        if (client.url === '/' && 'focus' in client) {
          return client.focus();
        }
      }
      // If not, open a new window
      if (clients.openWindow) {
        return clients.openWindow('/dashboard');
      }
    })
  );
});
