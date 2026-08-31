import { useEffect, useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { MessageCircle, X } from 'lucide-react';
import { trackEvent } from '../../lib/analytics';
import { useAuth } from '../../context/AuthContext';

const DISMISS_KEY = 'ssc-demo-nudge-dismissed-until';
const STUDY_ROUTES = ['/cbse-notes', '/study-material', '/test-series', '/daily-practice', '/study-coach', '/quizzes', '/flashcards'];

function eligible(pathname) {
  if (STUDY_ROUTES.includes(pathname)) return true;
  if (pathname.startsWith('/cbse/')) return true;
  if (pathname.startsWith('/tests/')) return true;
  return false;
}

export default function DemoNudge() {
  const { pathname } = useLocation();
  const { user } = useAuth();
  const [visible, setVisible] = useState(false);
  const shouldShow = useMemo(() => eligible(pathname), [pathname]);

  useEffect(() => {
    setVisible(false);
    if (!shouldShow) return undefined;
    const until = Number(localStorage.getItem(DISMISS_KEY) || 0);
    if (until > Date.now()) return undefined;
    const timer = window.setTimeout(() => {
      setVisible(true);
      trackEvent('demo_nudge_view', { routeType: pathname.startsWith('/cbse/') ? 'notes' : pathname.startsWith('/tests/') ? 'test' : pathname }, user?.id || null);
    }, 35000);
    return () => window.clearTimeout(timer);
  }, [pathname, shouldShow, user?.id]);

  if (!visible) return null;

  const dismiss = () => {
    localStorage.setItem(DISMISS_KEY, String(Date.now() + 3 * 24 * 60 * 60 * 1000));
    setVisible(false);
    trackEvent('demo_nudge_dismiss', { routeType: pathname }, user?.id || null);
  };

  return (
    <div className="fixed z-[58] left-3 right-3 bottom-[86px] lg:left-auto lg:right-6 lg:bottom-6 lg:w-[360px] rounded-2xl p-4 shadow-2xl" style={{ background: 'var(--ink)', border: '1px solid rgba(231,198,108,.26)', color: '#fff' }}>
      <button onClick={dismiss} aria-label="Dismiss demo invitation" className="absolute right-3 top-3 p-1 rounded-lg" style={{ color: 'var(--muted-on-ink)' }}><X className="w-4 h-4" /></button>
      <div className="pr-7">
        <div className="text-xs font-black uppercase tracking-wider" style={{ color: '#e7c66c' }}>Need help beyond the free material?</div>
        <div className="font-semibold mt-1">Book a free Commerce demo.</div>
        <p className="text-xs mt-1.5 leading-relaxed" style={{ color: 'var(--muted-on-ink)' }}>If a chapter still feels unclear, talk through it before deciding whether coaching is useful for you.</p>
      </div>
      <Link onClick={() => trackEvent('demo_nudge_click', { routeType: pathname }, user?.id || null)} to={`/book-demo?source=Direct&utm_medium=study_nudge&utm_campaign=${encodeURIComponent(pathname)}`} className="btn-gold mt-3 w-full inline-flex items-center justify-center gap-2"><MessageCircle className="w-4 h-4" /> Request free demo</Link>
    </div>
  );
}
