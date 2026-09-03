import { useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ArrowRight, Check, Share2, Users } from 'lucide-react';
import { trackEvent } from '../../lib/analytics';

const CAMPAIGN = 'student_resource_referral';

function isShareableLearningRoute(pathname) {
  if (pathname === '/cbse-notes' || pathname === '/cbse-practice' || pathname === '/study-material') return true;
  if (pathname.startsWith('/tools/')) return true;
  if (pathname.includes('/practice/')) return true;
  if (/\/cbse\/class-\d+\/.+-notes$/.test(pathname)) return true;
  if (/\/cbse\/class-\d+\/.+\/.+-notes$/.test(pathname)) return true;
  return false;
}

function sendGoogleEvent(name, metadata = {}) {
  if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
    window.gtag('event', name, metadata);
  }
}

export default function StudentReferralNudge() {
  const { pathname } = useLocation();
  const [copied, setCopied] = useState(false);
  const show = isShareableLearningRoute(pathname);

  const referralUrl = useMemo(() => {
    if (typeof window === 'undefined') return `https://www.smitsircommerce.in${pathname}`;
    const url = new URL(window.location.href);
    url.searchParams.set('utm_source', 'student_referral');
    url.searchParams.set('utm_medium', 'share');
    url.searchParams.set('utm_campaign', CAMPAIGN);
    return url.toString();
  }, [pathname]);

  if (!show) return null;

  const emit = (name, metadata = {}) => {
    const data = { from: pathname, campaign: CAMPAIGN, ...metadata };
    trackEvent(name, data, null);
    sendGoogleEvent(name, data);
  };

  const share = async () => {
    const shareData = {
      title: document.title || 'Smit Sir Commerce',
      text: 'This free Commerce resource might help you too.',
      url: referralUrl,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
        emit('student_resource_shared', { method: 'native_share' });
        return;
      }
      await navigator.clipboard.writeText(referralUrl);
      setCopied(true);
      emit('student_resource_shared', { method: 'copy_link' });
      window.setTimeout(() => setCopied(false), 2200);
    } catch (error) {
      if (error?.name === 'AbortError') return;
      try {
        await navigator.clipboard.writeText(referralUrl);
        setCopied(true);
        emit('student_resource_shared', { method: 'copy_link_fallback' });
        window.setTimeout(() => setCopied(false), 2200);
      } catch {
        emit('student_resource_share_failed');
      }
    }
  };

  return (
    <section className="page-container pb-10" aria-labelledby="student-referral-heading">
      <div className="card-paper p-5 sm:p-7">
        <div className="grid lg:grid-cols-[1fr_auto] gap-5 lg:items-center">
          <div className="flex items-start gap-3">
            <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'var(--gold-bg)' }}>
              <Users className="w-5 h-5" style={{ color: 'var(--gold)' }} />
            </div>
            <div>
              <span className="eyebrow">Help another Commerce student</span>
              <h2 id="student-referral-heading" className="text-2xl sm:text-3xl mt-2" style={{ fontFamily: 'var(--font-serif)', color: 'var(--ink)' }}>
                Useful? Send this page to one classmate.
              </h2>
              <p className="text-sm leading-7 mt-2 max-w-2xl" style={{ color: 'var(--muted)' }}>
                The notes, practice pages and calculators are free. Share the exact resource instead of making them search for it again.
              </p>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-1 gap-3 min-w-[220px]">
            <button type="button" onClick={share} className="btn-primary inline-flex items-center justify-center gap-2 min-h-12">
              {copied ? <Check className="w-4 h-4" /> : <Share2 className="w-4 h-4" />}
              {copied ? 'Link copied' : 'Share with a classmate'}
            </button>
            <Link
              to="/book-demo?source=student-resource"
              onClick={() => emit('paper_analysis_cta_click')}
              className="btn-outline-ink inline-flex items-center justify-center gap-2 min-h-12"
            >
              Free Paper Analysis <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
