import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './mobile.css'
import App from './App.jsx'

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

// Service-worker updates are allowed to wait until the next normal visit.
// Never force-refresh an active study session in the middle of a page.

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
