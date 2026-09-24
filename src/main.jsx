import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './styles/app.css'
import './styles/performance.css'
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

  document.getElementById('app-startup-mask')?.remove();
  clearInlineScrollLocks();

  try {
    await warmup();
    return true;
  } catch (error) {
    console.error('Interactive route warmup failed; preserving static content', error);
    return false;
  }
}

function scheduleLegacyPwaRetirement() {
  const run = () => {
    retireLegacyPwa().catch(() => false);
  };

  if ('requestIdleCallback' in window) {
    window.requestIdleCallback(run, { timeout: 1800 });
  } else {
    window.setTimeout(run, 700);
  }
}

async function startApp() {
  clearInlineScrollLocks();

  const legacyWorkerControlsPage = Boolean(navigator.serviceWorker?.controller);
  if (legacyWorkerControlsPage) {
    const reloadingAfterPwaRetirement = await retireLegacyPwa();
    if (reloadingAfterPwaRetirement) return;
  }

  const shouldMountInteractiveApp = await warmCurrentPublicRoute();
  if (!shouldMountInteractiveApp) return;

  const root = createRoot(document.getElementById('root'));
  root.render(
    <StrictMode>
      <App />
    </StrictMode>,
  );

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

  // Intentionally do not load AOS or other scroll-triggered decoration.
  // Native scrolling and immediate content are more important than reveal effects.
  if (!legacyWorkerControlsPage) scheduleLegacyPwaRetirement();
}

window.addEventListener('pageshow', clearInlineScrollLocks);
startApp();
