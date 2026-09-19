import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './styles/app.css'
import App from './App.jsx'
import { installDownloadTracking } from './lib/conversionTracking';

installDownloadTracking();

const PWA_RETIRE_KEY = 'ssc-pwa-retired-2026-09-14-v1';

function clearInlineScrollLocks() {
  if (typeof document === 'undefined') return;
  const nodes = [document.documentElement, document.body].filter(Boolean);
  nodes.forEach((node) => {
    node.style.removeProperty('overflow');
    node.style.removeProperty('overflow-y');
    node.style.removeProperty('position');
    node.style.removeProperty('height');
    node.style.removeProperty('max-height');
  });
}

async function retireLegacyPwa() {
  if (typeof window === 'undefined') return false;
  const alreadyRetired = window.localStorage?.getItem(PWA_RETIRE_KEY) === 'done';
  const hadController = Boolean(navigator.serviceWorker?.controller);

  // The legacy worker/cache cleanup is a one-time migration. Once it has
  // completed and no old worker controls this page, do not block every future
  // app start on service-worker and Cache Storage calls.
  if (alreadyRetired && !hadController) return false;

  try {
    if ('serviceWorker' in navigator) {
      const registrations = await navigator.serviceWorker.getRegistrations();
      await Promise.all(registrations.map((registration) => registration.unregister().catch(() => false)));
    }

    if ('caches' in window) {
      const names = await window.caches.keys();
      await Promise.all(
        names
          .filter((name) => /workbox|precache|ssc-|vite|runtime|navigation/i.test(name))
          .map((name) => window.caches.delete(name)),
      );
    }

    window.localStorage?.setItem(PWA_RETIRE_KEY, 'done');
  } catch {
    // A cleanup failure must never stop the website from loading.
  }

  // A page already controlled by an old worker keeps that controller until the
  // next navigation. Reload exactly once so future asset requests go directly
  // to the live Vercel deployment instead of a stale service-worker shell.
  if (hadController && !alreadyRetired) {
    window.location.replace(window.location.href);
    return true;
  }

  return false;
}

function currentRouteWarmup() {
  const path = window.location.pathname.replace(/\/$/, '') || '/';

  if (path === '/study-material') return () => import('./pages/StudyMaterial');
  if (path === '/cbse-notes') return () => import('./pages/CbseNotes');
  if (path === '/commerce-coaching-mehsana') return () => import('./pages/CommerceCoachingMehsana');

  const cbseParts = path.split('/').filter(Boolean);
  if (cbseParts[0] === 'cbse' && cbseParts.length === 3) {
    return () => import('./pages/SeoMaterialHub');
  }
  if (cbseParts[0] === 'cbse' && cbseParts.length === 4) {
    return () => import('./pages/SeoMaterialChapter');
  }

  return null;
}

async function warmCurrentPublicRoute() {
  const rootNode = document.getElementById('root');
  const hasPrerenderedContent = Boolean(rootNode?.querySelector('[data-prerendered]'));
  const warmup = currentRouteWarmup();

  if (!hasPrerenderedContent || !warmup) return true;

  // The prerendered page is real readable content. Show it immediately while
  // the interactive route chunk loads instead of replacing it with a spinner.
  document.getElementById('app-startup-mask')?.remove();
  clearInlineScrollLocks();

  try {
    await warmup();
    return true;
  } catch (error) {
    // If a route chunk cannot load on a weak connection, keeping the static
    // study page visible is a better visitor experience than crashing/spinning.
    console.error('Interactive route warmup failed; preserving static content', error);
    return false;
  }
}

// Keep the mobile startup path lean. AOS is decorative, so load it only on
// larger screens and only after the first render has had time to settle.
function scheduleDesktopAnimations() {
  if (!window.matchMedia('(min-width: 769px)').matches) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

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

  if ('requestIdleCallback' in window) window.requestIdleCallback(loadAos, { timeout: 2500 });
  else window.setTimeout(loadAos, 1400);
}

async function startApp() {
  clearInlineScrollLocks();
  const reloadingAfterPwaRetirement = await retireLegacyPwa();
  if (reloadingAfterPwaRetirement) return;

  const shouldMountInteractiveApp = await warmCurrentPublicRoute();
  if (!shouldMountInteractiveApp) return;

  const root = createRoot(document.getElementById('root'));
  root.render(
    <StrictMode>
      <App />
    </StrictMode>,
  );

  // Keep the neutral startup layer only until React and critical CSS paint.
  window.requestAnimationFrame(() => {
    window.requestAnimationFrame(() => {
      document.getElementById('app-startup-mask')?.remove();
      clearInlineScrollLocks();
    });
  });

  window.setTimeout(() => {
    document.getElementById('app-startup-mask')?.remove();
    clearInlineScrollLocks();
  }, 1200);

  scheduleDesktopAnimations();
}

window.addEventListener('pageshow', clearInlineScrollLocks);
startApp();
