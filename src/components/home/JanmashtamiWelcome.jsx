import { useEffect, useState } from 'react';
import { Feather, Share2, Sparkles, X } from 'lucide-react';

const FESTIVAL_DATES = new Set(['2026-09-03', '2026-09-04']);
const DISMISS_KEY = 'ssc-janmashtami-banner-2026-dismissed';

function getIndiaDateStamp() {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Kolkata',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(new Date());

  const byType = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  return `${byType.year}-${byType.month}-${byType.day}`;
}

export default function JanmashtamiWelcome() {
  const [visible, setVisible] = useState(false);
  const [shareStatus, setShareStatus] = useState('');

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const active = FESTIVAL_DATES.has(getIndiaDateStamp());
    const dismissed = window.localStorage.getItem(DISMISS_KEY) === 'yes';
    setVisible(active && !dismissed);
  }, []);

  function track(action) {
    if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
      window.gtag('event', action, {
        festival: 'janmashtami_2026',
        page_path: window.location.pathname,
      });
    }
  }

  function dismiss() {
    setVisible(false);
    if (typeof window !== 'undefined') window.localStorage.setItem(DISMISS_KEY, 'yes');
    track('janmashtami_banner_dismissed');
  }

  async function shareGreeting() {
    const url = new URL('https://www.smitsircommerce.in/');
    url.searchParams.set('utm_source', 'janmashtami_share');
    url.searchParams.set('utm_medium', 'share');
    url.searchParams.set('utm_campaign', 'janmashtami_2026');

    const shareData = {
      title: 'Happy Janmashtami — Smit Sir Commerce',
      text: 'Happy Janmashtami! May Shri Krishna bless every learner with wisdom, curiosity and clarity.',
      url: url.toString(),
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
        setShareStatus('Shared');
        track('janmashtami_banner_shared');
      } else {
        await navigator.clipboard.writeText(url.toString());
        setShareStatus('Link copied');
        track('janmashtami_banner_link_copied');
      }
    } catch (error) {
      if (error?.name !== 'AbortError') setShareStatus('Try again');
    }
  }

  if (!visible) return null;

  return (
    <section
      aria-label="Janmashtami greeting from Smit Sir Commerce"
      style={{
        position: 'relative',
        zIndex: 10,
        overflow: 'hidden',
        width: '100%',
        borderTop: '1px solid rgba(232,190,86,.35)',
        borderBottom: '1px solid rgba(232,190,86,.48)',
        background: 'linear-gradient(105deg,#061b46 0%,#0b2e69 48%,#071b3e 100%)',
        boxShadow: '0 10px 30px rgba(5,20,55,.13)',
      }}
    >
      <div aria-hidden="true" style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
        <div style={{ position: 'absolute', left: '-50px', top: '-85px', width: 210, height: 210, borderRadius: '50%', background: 'radial-gradient(circle,rgba(238,192,72,.20),transparent 70%)' }} />
        <div style={{ position: 'absolute', right: '-65px', bottom: '-115px', width: 245, height: 245, borderRadius: '50%', background: 'radial-gradient(circle,rgba(31,130,183,.30),transparent 70%)' }} />
        <Sparkles style={{ position: 'absolute', left: '12%', top: 14, width: 16, height: 16, color: '#f0cb66', opacity: .65 }} />
        <Sparkles style={{ position: 'absolute', right: '17%', bottom: 12, width: 13, height: 13, color: '#f0cb66', opacity: .5 }} />
      </div>

      <div
        className="page-container"
        style={{
          position: 'relative',
          minHeight: 78,
          paddingTop: 13,
          paddingBottom: 13,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 18,
          flexWrap: 'wrap',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0, flex: '1 1 560px', justifyContent: 'center' }}>
          <div style={{ width: 42, height: 42, flex: '0 0 42px', borderRadius: '50%', border: '1px solid rgba(240,201,101,.52)', background: 'rgba(240,201,101,.10)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Feather style={{ width: 22, height: 22, color: '#f0ca66' }} />
          </div>

          <div style={{ minWidth: 0 }}>
            <div style={{ color: '#e9c668', fontSize: 10, fontWeight: 800, letterSpacing: '.18em', textTransform: 'uppercase', marginBottom: 3 }}>
              Smit Sir Commerce wishes you
            </div>
            <div style={{ color: '#fff8df', fontFamily: 'var(--font-serif)', fontWeight: 700, fontSize: 'clamp(20px,2.4vw,29px)', lineHeight: 1.1 }}>
              Happy Janmashtami ✨
            </div>
            <div style={{ color: 'rgba(255,248,223,.73)', fontSize: 12, lineHeight: 1.45, marginTop: 3 }}>
              May Shri Krishna inspire wisdom, curiosity and clarity in every learner.
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <button
            onClick={shareGreeting}
            style={{
              minHeight: 38,
              borderRadius: 999,
              border: '1px solid rgba(240,201,101,.45)',
              background: 'rgba(255,255,255,.06)',
              color: '#fff8df',
              padding: '8px 14px',
              fontSize: 12,
              fontWeight: 700,
              display: 'inline-flex',
              alignItems: 'center',
              gap: 7,
              cursor: 'pointer',
            }}
          >
            <Share2 style={{ width: 14, height: 14 }} />
            {shareStatus || 'Share wishes'}
          </button>

          <button
            onClick={dismiss}
            aria-label="Dismiss Janmashtami greeting"
            style={{
              width: 36,
              height: 36,
              borderRadius: '50%',
              border: '1px solid rgba(255,255,255,.16)',
              background: 'rgba(255,255,255,.05)',
              color: 'rgba(255,255,255,.78)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
            }}
          >
            <X style={{ width: 15, height: 15 }} />
          </button>
        </div>
      </div>
    </section>
  );
}
