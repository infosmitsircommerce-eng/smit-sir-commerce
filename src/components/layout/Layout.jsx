import { Component, lazy, Suspense, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import TopicalAuthorityLinks from '../ui/TopicalAuthorityLinks';
import MobileBottomBar from '../ui/MobileBottomBar';
import MobileHeader from '../ui/MobileHeader';
import PilotHreflang from '../ui/PilotHreflang';
import { isLightRoute, mobileStudySection } from '../../lib/theme';
import { isAdEligiblePath } from '../../lib/adPolicy';
import { RouteRevenueBridge } from '../leads/StudyRevenueBridge';
import { useAuth } from '../../context/AuthContext';

const ScrollToTop = lazy(() => import('../ui/ScrollToTop'));
const CursorSpotlight = lazy(() => import('../ui/CursorSpotlight'));
const ScrollProgressBar = lazy(() => import('../ui/ScrollProgressBar'));
const GlobalStudySearch = lazy(() => import('../ui/GlobalStudySearch'));
const StudyAccessDialog = lazy(() => import('../ui/StudyAccessDialog'));
const CloudSyncBridge = lazy(() => import('../ui/CloudSyncBridge'));
const AnalyticsTracker = lazy(() => import('../ui/AnalyticsTracker'));
const ChapterProgressTracker = lazy(() => import('../ui/ChapterProgressTracker'));

class EnhancementBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { failed: false };
  }

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error, info) {
    // These widgets are optional conveniences. Never let one take down study content.
    console.error('Optional Smit Sir Commerce enhancement failed', error, info);
  }

  render() {
    return this.state.failed ? null : this.props.children;
  }
}

function DeferredEnhancements() {
  const [ready, setReady] = useState(false);
  const { user } = useAuth();
  const { pathname } = useLocation();

  useEffect(() => {
    let idleId;
    let timerId;
    let loadTimerId;
    let cancelled = false;

    const mobile = window.matchMedia('(max-width: 768px)').matches;
    const saveData = navigator.connection?.saveData === true;
    const slowConnection = ['slow-2g', '2g', '3g'].includes(navigator.connection?.effectiveType);
    const delay = mobile || saveData || slowConnection ? 7000 : 3200;

    const reveal = () => {
      if (!cancelled) setReady(true);
    };

    const schedule = () => {
      timerId = window.setTimeout(() => {
        if ('requestIdleCallback' in window) {
          idleId = window.requestIdleCallback(reveal, { timeout: 2200 });
        } else {
          reveal();
        }
      }, delay);
    };

    if (document.readyState === 'complete') schedule();
    else {
      const onLoad = () => schedule();
      window.addEventListener('load', onLoad, { once: true });
      // Fallback in case a third-party resource keeps the load event waiting.
      loadTimerId = window.setTimeout(schedule, delay + 1800);
      return () => {
        cancelled = true;
        window.removeEventListener('load', onLoad);
        if (idleId) window.cancelIdleCallback?.(idleId);
        if (timerId) window.clearTimeout(timerId);
        if (loadTimerId) window.clearTimeout(loadTimerId);
      };
    }

    return () => {
      cancelled = true;
      if (idleId) window.cancelIdleCallback?.(idleId);
      if (timerId) window.clearTimeout(timerId);
      if (loadTimerId) window.clearTimeout(loadTimerId);
    };
  }, [pathname]);

  if (!ready) return null;

  const desktopPointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const isChapterRoute = /^\/cbse\/[^/]+\/[^/]+\/[^/]+\/?$/.test(pathname);

  return (
    <Suspense fallback={null}>
      <AnalyticsTracker />
      {desktopPointer && <ScrollProgressBar />}
      {desktopPointer && <CursorSpotlight />}
      {user && <CloudSyncBridge />}
      {isChapterRoute && <ChapterProgressTracker />}
      {desktopPointer && <ScrollToTop />}
    </Suspense>
  );
}

function SearchOnDemand() {
  const [request, setRequest] = useState(null);
  useEffect(() => {
    const open = (event) => setRequest({ query: event?.detail?.query || '', key: Date.now() });
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
  return request ? <Suspense fallback={null}><GlobalStudySearch key={request.key} initialOpen initialQuery={request.query} /></Suspense> : null;
}

export default function Layout({ children }) {
  const { pathname, search } = useLocation();
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
      data-mobile-theme={light ? "ledger" : "tool"}
      data-mobile-section={mobileStudySection(pathname, search)}
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
      <EnhancementBoundary>
        <DeferredEnhancements />
      </EnhancementBoundary>
    </div>
  );
}
