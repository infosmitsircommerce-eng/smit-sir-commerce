import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { trackEvent } from '../../lib/analytics';
import { captureAcquisition } from '../../lib/acquisition';

function funnelEventForPath(pathname) {
  if (pathname === '/') return 'funnel_home_view';
  if (pathname === '/cbse-notes' || pathname === '/study-material') return 'funnel_notes_library_view';
  if (/\/cbse\/class-\d+\/.+-notes$/.test(pathname)) return 'funnel_subject_notes_view';
  if (/\/cbse\/class-\d+\/.+\/.+-notes$/.test(pathname)) return 'funnel_chapter_open';
  if (pathname === '/pdf-viewer') return 'funnel_pdf_open';
  if (pathname === '/cbse-practice' || pathname.includes('/practice/')) return 'funnel_practice_start';
  if (pathname === '/daily-practice' || pathname === '/exam-mode') return 'funnel_practice_start';
  if (pathname === '/book-demo') return 'funnel_demo_open';
  if (pathname.includes('demo-success')) return 'funnel_demo_submit';
  return null;
}

function sendGoogleEvent(name, metadata = {}) {
  if (typeof window.gtag === 'function') window.gtag('event', name, metadata);
}

export default function AnalyticsTracker() {
  const { pathname, search } = useLocation();
  const { user } = useAuth();

  useEffect(() => {
    const attribution = captureAcquisition(pathname, search);
    const baseMetadata = { route: pathname, source: attribution?.first?.source || 'Direct' };
    trackEvent('page_view', baseMetadata, user?.id || null);
    sendGoogleEvent('page_view_spa', baseMetadata);

    const funnelEvent = funnelEventForPath(pathname);
    if (funnelEvent) {
      trackEvent(funnelEvent, baseMetadata, user?.id || null);
      sendGoogleEvent(funnelEvent, baseMetadata);
    }
  }, [pathname, search, user?.id]);

  useEffect(() => {
    const onClick = (event) => {
      const link = event.target.closest('a[href]');
      if (!link) return;
      const href = link.getAttribute('href') || '';
      let eventName = '';

      if (href.includes('/pdf-viewer') || href.toLowerCase().endsWith('.pdf')) eventName = 'funnel_pdf_click';
      else if (href === '/book-demo' || href.startsWith('/book-demo?')) eventName = 'funnel_demo_click';
      else if (href === '/cbse-notes' || href.includes('-notes')) eventName = 'funnel_notes_click';
      else if (href === '/daily-practice' || href === '/exam-mode' || href === '/cbse-practice' || href.includes('/practice/')) eventName = 'funnel_practice_click';

      if (!eventName) return;
      const metadata = { destination: href.slice(0, 160), from: window.location.pathname };
      trackEvent(eventName, metadata, user?.id || null);
      sendGoogleEvent(eventName, metadata);
    };

    document.addEventListener('click', onClick, { capture: true });
    return () => document.removeEventListener('click', onClick, { capture: true });
  }, [user?.id]);

  return null;
}
