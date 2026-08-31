import { useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import MobileBottomBar from '../ui/MobileBottomBar';
import MobileHeader from '../ui/MobileHeader';
import ScrollToTop from '../ui/ScrollToTop';
import CursorSpotlight from '../ui/CursorSpotlight';
import ScrollProgressBar from '../ui/ScrollProgressBar';
import GlobalStudySearch from '../ui/GlobalStudySearch';
import CloudSyncBridge from '../ui/CloudSyncBridge';
import { isLightRoute } from '../../lib/theme';

export default function Layout({ children }) {
  const { pathname } = useLocation();
  const light = isLightRoute(pathname);

  return (
    <div className="min-h-screen flex flex-col"
      style={{ background: light ? 'var(--bg-ivory)' : '#0f0d2e' }}>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only fixed left-4 top-4 z-[100] rounded-lg bg-white px-4 py-3 font-semibold text-slate-900 shadow-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
      >
        Skip to main content
      </a>
      <ScrollProgressBar />
      <CursorSpotlight />
      <Navbar />
      <MobileHeader />
      <GlobalStudySearch />
      <CloudSyncBridge />
      <main id="main-content" tabIndex="-1" className="flex-1 pt-0 lg:pt-20 pb-20 lg:pb-0">
        {children}
      </main>
      <Footer />
      <MobileBottomBar />
      <ScrollToTop />
    </div>
  );
}
