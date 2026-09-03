import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { trackEvent } from '../../lib/analytics';
import { captureAcquisition } from '../../lib/acquisition';

function funnelEventForPath(pathname) {
  if (pathname === '/') return 'funnel_home_view';
  if (pathname === '/cbse-notes' || pathname === '/study-material') return 'funnel_notes_library_view';
  if (pathname === '/cbse-pyq') return 'funnel_exam_prep_view';
  if (/\/cbse\/class-\d+\/.+-notes$/.test(pathname)) return 'funnel_subject_notes_view';
  if (/\/cbse\/class-\d+\/.+\/.+-notes$/.test(pathname)) return 'funnel_chapter_open';
  if (pathname === '/pdf-viewer') return 'funnel_pdf_open';
  if (pathname === '/cbse-practice' || pathname.includes('/practice/')) return 'funnel_practice_start';
  if (pathname === '/daily-practice' || pathname === '/exam-mode') return 'funnel_practice_start';
  if (pathname === '/book-demo') return 'funnel_demo_open';
  if (pathname === '/marks-recovery') return 'marks_recovery_view';
  if (pathname.startsWith('/tools/topics/')) return 'calculator_cluster_view';
  if (/^\/tools\/[^/]+$/.test(pathname)) return 'calculator_view';
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
    const emit = (name, metadata = {}) => {
      trackEvent(name, metadata, user?.id || null);
      sendGoogleEvent(name, metadata);
    };

    const onClick = (event) => {
      const button = event.target.closest('button');
      if (button && /^\/tools\/[^/]+$/.test(window.location.pathname)) {
        const label = (button.textContent || '').trim().toLowerCase();
        if (label.includes('try example') || label.includes('load this example')) {
          emit('example_loaded', { tool_path: window.location.pathname });
        }
      }

      const link = event.target.closest('a[href]');
      if (!link) return;
      const href = link.getAttribute('href') || '';
      const from = window.location.pathname;
      const metadata = { destination: href.slice(0, 160), from };

      if (/^\/tools\/[^/]+$/.test(from)) {
        if (href === '/cbse-notes' || href.includes('-notes')) emit('notes_clicked_from_tool', metadata);
        else if (href === '/test-series' || href.startsWith('/test-series?')) emit('test_clicked_from_tool', metadata);
        else if (href === '/book-demo' || href.startsWith('/book-demo?')) emit('demo_clicked_from_tool', metadata);
        else if (href === '/marks-recovery' || href.startsWith('/marks-recovery?')) emit('marks_recovery_clicked_from_tool', metadata);
      }

      let eventName = '';
      if (href.includes('/pdf-viewer') || href.toLowerCase().endsWith('.pdf')) eventName = 'funnel_pdf_click';
      else if (href === '/book-demo' || href.startsWith('/book-demo?')) eventName = 'funnel_demo_click';
      else if (href === '/marks-recovery' || href.startsWith('/marks-recovery?')) eventName = 'marks_recovery_click';
      else if (href === '/cbse-pyq' || href.startsWith('/cbse-pyq?')) eventName = 'funnel_exam_prep_click';
      else if (href === '/cbse-notes' || href.includes('-notes')) eventName = 'funnel_notes_click';
      else if (href === '/daily-practice' || href === '/exam-mode' || href === '/cbse-practice' || href.includes('/practice/')) eventName = 'funnel_practice_click';
      else if (href.startsWith('/tools/')) eventName = 'calculator_link_click';

      if (eventName) emit(eventName, metadata);
    };

    const onSubmit = (event) => {
      if (!/^\/tools\/[^/]+$/.test(window.location.pathname)) return;
      const form = event.target.closest('form');
      if (!form) return;
      emit('calculator_used', { tool_path: window.location.pathname });
    };

    document.addEventListener('click', onClick, { capture: true });
    document.addEventListener('submit', onSubmit, { capture: true });
    return () => {
      document.removeEventListener('click', onClick, { capture: true });
      document.removeEventListener('submit', onSubmit, { capture: true });
    };
  }, [user?.id]);

  return null;
}
