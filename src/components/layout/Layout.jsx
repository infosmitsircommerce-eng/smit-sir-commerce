import { lazy, Suspense, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import TopicalAuthorityLinks from '../ui/TopicalAuthorityLinks';
import MobileBottomBar from '../ui/MobileBottomBar';
import MobileHeader from '../ui/MobileHeader';
import PilotHreflang from '../ui/PilotHreflang';
import { isLightRoute } from '../../lib/theme';
import { isAdEligiblePath } from '../../lib/adPolicy';
import { RouteRevenueBridge } from '../leads/StudyRevenueBridge';
import { useAuth } from '../../context/AuthContext';

const ScrollToTop = lazy(() => import('../ui/ScrollToTop'));
const CursorSpotlight = lazy(() => import('../ui/CursorSpotlight'));
const ScrollProgressBar = lazy(() => import('../ui/ScrollProgressBar'));
const GlobalStudySearch = lazy(() => import('../ui/GlobalStudySearch'));
const StudyAccessDialog = lazy(() => import('../ui/StudyAccessDialog'));
const QuickAccessDock = lazy(() => import('../ui/QuickAccessDock'));
const CloudSyncBridge = lazy(() => import('../ui/CloudSyncBridge'));
const AnalyticsTracker = lazy(() => import('../ui/AnalyticsTracker'));
const ChapterProgressTracker = lazy(() => import('../ui/ChapterProgressTracker'));

function DeferredEnhancements() {
  const [ready, setReady] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    let idleId;
    let timerId;
    const reveal = () => setReady(true);

    if ('requestIdleCallback' in window) {
      idleId = window.requestIdleCallback(reveal, { timeout: 1200 });
    } else {
      timerId = window.setTimeout(reveal, 650);
    }

    return () => {
      if (idleId) window.cancelIdleCallback?.(idleId);
      if (timerId) window.clearTimeout(timerId);
    };
  }, []);

  if (!ready) return null;

  return (
    <Suspense fallback={null}>
      <AnalyticsTracker />
      <ScrollProgressBar />
      {window.matchMedia('(hover: hover) and (pointer: fine)').matches && <CursorSpotlight />}
      <QuickAccessDock />
      {user && <CloudSyncBridge />}
      <ChapterProgressTracker />
      <ScrollToTop />
    </Suspense>
  );
}

function SearchOnDemand() {
  const [requested, setRequested] = useState(false);
  useEffect(() => {
    const open = () => setRequested(true);
    const onKey = event => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault(); open();
      }
    };
    window.addEventListener('ssc-open-search', open);
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('ssc-open-search', open);
      window.removeEventListener('keydown', onKey);
    };
  }, []);
  return requested ? <Suspense fallback={null}><GlobalStudySearch initialOpen /></Suspense> : null;
}

export default function Layout({ children }) {
  const { pathname } = useLocation();
  const [finderOpen, setFinderOpen] = useState(false);
  useEffect(() => {
    const open = () => setFinderOpen(true);
    window.addEventListener('ssc-open-resource-finder', open);
    return () => window.removeEventListener('ssc-open-resource-finder', open);
  }, []);
  useEffect(() => { setFinderOpen(false); }, [pathname]);
  const light = isLightRoute(pathname);
  const adEligible = isAdEligiblePath(pathname);

  return (
    <div
      className="min-h-screen flex flex-col"
      data-ad-eligible={adEligible ? 'true' : 'false'}
      style={{ background: light ? 'var(--bg-ivory)' : '#0f0d2e' }}
    >
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only fixed left-4 top-4 z-[100] rounded-lg bg-white px-4 py-3 font-semibold text-slate-900 shadow-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
      >
        Skip to main content
      </a>
      <PilotHreflang />
      <Navbar />
      {pathname !== '/' && <MobileHeader />}
      <main id="main-content" tabIndex="-1" className="flex-1 pt-0 lg:pt-20 pb-20 lg:pb-0">
        <div key={pathname} className="ssc-route-view">{children}</div>
      </main>
      <TopicalAuthorityLinks />
      <RouteRevenueBridge />
      <Footer />
      <MobileBottomBar />
      <SearchOnDemand />
      {finderOpen && <Suspense fallback={<p role="status" className="fixed top-20 right-4 z-[180] card-paper p-4">Opening notes and tests…</p>}><StudyAccessDialog onClose={() => setFinderOpen(false)} /></Suspense>}
      <DeferredEnhancements />
    </div>
  );
}
