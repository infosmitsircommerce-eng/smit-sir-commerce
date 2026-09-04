import { lazy, Suspense, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import MobileBottomBar from '../ui/MobileBottomBar';
import MobileHeader from '../ui/MobileHeader';
import PilotHreflang from '../ui/PilotHreflang';
import { isLightRoute } from '../../lib/theme';
import { isAdEligiblePath } from '../../lib/adPolicy';

const ScrollToTop = lazy(() => import('../ui/ScrollToTop'));
const CursorSpotlight = lazy(() => import('../ui/CursorSpotlight'));
const ScrollProgressBar = lazy(() => import('../ui/ScrollProgressBar'));
const GlobalStudySearch = lazy(() => import('../ui/GlobalStudySearch'));
const CloudSyncBridge = lazy(() => import('../ui/CloudSyncBridge'));
const AnalyticsTracker = lazy(() => import('../ui/AnalyticsTracker'));
const ChapterProgressTracker = lazy(() => import('../ui/ChapterProgressTracker'));
const ChapterPracticeStrip = lazy(() => import('../ui/ChapterPracticeStrip'));
const ContextualToolLinks = lazy(() => import('../ui/ContextualToolLinks'));
const TopicalAuthorityLinks = lazy(() => import('../ui/TopicalAuthorityLinks'));
const MarksRecoveryNudge = lazy(() => import('../ui/MarksRecoveryNudge'));
const StudentReferralNudge = lazy(() => import('../ui/StudentReferralNudge'));
const DemoNudge = lazy(() => import('../leads/DemoNudge'));

function DeferredEnhancements() {
  const [ready, setReady] = useState(false);

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
      <CursorSpotlight />
      <GlobalStudySearch />
      <CloudSyncBridge />
      <ChapterProgressTracker />
      <ContextualToolLinks />
      <ChapterPracticeStrip />
      <TopicalAuthorityLinks />
      <MarksRecoveryNudge />
      <StudentReferralNudge />
      <DemoNudge />
      <ScrollToTop />
    </Suspense>
  );
}

export default function Layout({ children }) {
  const { pathname } = useLocation();
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
      <MobileHeader />
      <main id="main-content" tabIndex="-1" className="flex-1 pt-0 lg:pt-20 pb-20 lg:pb-0">
        {children}
      </main>
      <Footer />
      <MobileBottomBar />
      <DeferredEnhancements />
    </div>
  );
}
