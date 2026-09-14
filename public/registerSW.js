/* Legacy compatibility cleanup.
 * Older cached HTML may still request /registerSW.js. Instead of registering
 * another worker, remove old registrations and caches so the current site can
 * load directly from the network.
 */
(async () => {
  try {
    if ('serviceWorker' in navigator) {
      const registrations = await navigator.serviceWorker.getRegistrations();
      await Promise.all(registrations.map((registration) => registration.unregister().catch(() => false)));
    }

    if ('caches' in window) {
      const names = await caches.keys();
      await Promise.all(
        names
          .filter((name) => /workbox|precache|ssc-|vite|runtime|navigation/i.test(name))
          .map((name) => caches.delete(name)),
      );
    }
  } catch {
    // Cleanup is best-effort and must never block the page.
  }
})();
