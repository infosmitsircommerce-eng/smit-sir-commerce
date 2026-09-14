/* Legacy PWA retirement worker.
 * Smit Sir Commerce no longer uses a service worker for normal browsing.
 * This file exists only so previously installed workers can update, clear old
 * caches and unregister themselves instead of serving stale app shells.
 */
self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    try {
      const names = await caches.keys();
      await Promise.all(names.map((name) => caches.delete(name)));
    } catch {
      // Best-effort cleanup only.
    }

    try {
      await self.clients.claim();
    } catch {
      // Ignore claim failures during retirement.
    }

    try {
      await self.registration.unregister();
    } catch {
      // Ignore unregister failures; the page script also unregisters workers.
    }

    try {
      const clients = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
      clients.forEach((client) => client.navigate(client.url));
    } catch {
      // Existing tabs can be refreshed manually if navigation is unavailable.
    }
  })());
});

// Intentionally no fetch handler: all requests go directly to the network.
