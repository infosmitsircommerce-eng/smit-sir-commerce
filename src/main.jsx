import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './mobile.css'
import './styles/premiumVisuals.css'
import App from './App.jsx'

const CACHE_RESET_KEY = 'ssc-cache-reset-2026-09-07-v3';

async function clearOldAppCaches() {
  if (typeof window === 'undefined' || !('localStorage' in window)) return;
  if (window.localStorage.getItem(CACHE_RESET_KEY) === 'done') return;

  try {
    if ('caches' in window) {
      const names = await window.caches.keys();
      await Promise.all(
        names
          .filter((name) => /workbox|precache|ssc-|vite|runtime|navigation/i.test(name))
          .map((name) => window.caches.delete(name)),
      );
    }

    if ('serviceWorker' in navigator) {
      const registrations = await navigator.serviceWorker.getRegistrations();
      await Promise.all(registrations.map((registration) => registration.update().catch(() => null)));
    }

    window.localStorage.setItem(CACHE_RESET_KEY, 'done');
  } catch {
    // Cache cleanup is only a freshness helper. The app must still render normally.
  }
}

clearOldAppCaches();

// Keep the mobile startup path lean. AOS is decorative, so load it only on
// larger screens and only after the first render has had time to settle.
if (window.matchMedia('(min-width: 769px)').matches && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const loadAos = async () => {
    try {
      const [{ default: AOS }] = await Promise.all([
        import('aos'),
        import('aos/dist/aos.css'),
      ]);
      AOS.init({ duration: 600, easing: 'ease-out-cubic', once: true, offset: 60 });
    } catch {
      // Decorative animation failure must never block the learning experience.
    }
  };
  if ('requestIdleCallback' in window) window.requestIdleCallback(loadAos, { timeout: 1600 });
  else window.setTimeout(loadAos, 700);
}

const root = createRoot(document.getElementById('root'));
root.render(
  <StrictMode>
    <App />
  </StrictMode>,
);

// Keep the neutral startup layer in place until React and the critical CSS
// have painted. This prevents the prerendered SEO HTML from flashing as raw text.
window.requestAnimationFrame(() => {
  window.requestAnimationFrame(() => {
    document.getElementById('app-startup-mask')?.remove();
  });
});
