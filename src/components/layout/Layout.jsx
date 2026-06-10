import { useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import WhatsAppButton from '../ui/WhatsAppButton';
import MobileBottomBar from '../ui/MobileBottomBar';
import MobileHeader from '../ui/MobileHeader';
import ScrollToTop from '../ui/ScrollToTop';
import PageLoader from '../ui/PageLoader';
import CursorSpotlight from '../ui/CursorSpotlight';
import ScrollProgressBar from '../ui/ScrollProgressBar';
import { isLightRoute } from '../../lib/theme';

export default function Layout({ children }) {
  const { pathname } = useLocation();
  const light = isLightRoute(pathname);

  return (
    <div className="min-h-screen flex flex-col"
      style={{ background: light ? 'var(--bg-ivory)' : '#0f0d2e' }}>
      <ScrollProgressBar />
      <PageLoader />
      <CursorSpotlight />
      <Navbar />
      <MobileHeader />
      <main className="flex-1 pt-0 lg:pt-20 pb-20 lg:pb-0">
        {children}
      </main>
      <Footer />
      <WhatsAppButton />
      <MobileBottomBar />
      <ScrollToTop />
    </div>
  );
}
