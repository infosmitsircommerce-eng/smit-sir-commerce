import { useEffect, useMemo, useState } from 'react';
import { Feather, Music2, Share2, Sparkles, X } from 'lucide-react';

const FESTIVAL_DATES = new Set(['2026-09-03', '2026-09-04']);
const DISMISS_KEY = 'ssc-janmashtami-2026-dismissed';

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

function shouldPreview() {
  if (typeof window === 'undefined') return false;
  return new URLSearchParams(window.location.search).get('festival') === 'janmashtami-preview';
}

export default function JanmashtamiWelcome() {
  const [open, setOpen] = useState(false);
  const [shareStatus, setShareStatus] = useState('');
  const preview = useMemo(() => shouldPreview(), []);

  useEffect(() => {
    if (typeof window === 'undefined') return undefined;
    const activeToday = FESTIVAL_DATES.has(getIndiaDateStamp());
    const dismissed = window.localStorage.getItem(DISMISS_KEY) === 'yes';
    if ((!activeToday && !preview) || (dismissed && !preview)) return undefined;
    const timer = window.setTimeout(() => setOpen(true), 250);
    return () => window.clearTimeout(timer);
  }, [preview]);

  useEffect(() => {
    if (!open) return undefined;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKeyDown = (event) => {
      if (event.key === 'Escape') closeGreeting();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  function track(action) {
    if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
      window.gtag('event', action, { festival: 'janmashtami_2026', page_path: window.location.pathname });
    }
  }

  function closeGreeting() {
    setOpen(false);
    if (!preview && typeof window !== 'undefined') window.localStorage.setItem(DISMISS_KEY, 'yes');
    track('janmashtami_greeting_dismissed');
  }

  async function shareGreeting() {
    const url = new URL('https://www.smitsircommerce.in/');
    url.searchParams.set('utm_source', 'janmashtami_share');
    url.searchParams.set('utm_medium', 'share');
    url.searchParams.set('utm_campaign', 'janmashtami_2026');
    const shareData = {
      title: 'Happy Janmashtami — Smit Sir Commerce',
      text: 'Wishing you a joyful Janmashtami. Celebrate learning, curiosity and wisdom with Smit Sir Commerce.',
      url: url.toString(),
    };
    try {
      if (navigator.share) {
        await navigator.share(shareData);
        setShareStatus('Shared');
        track('janmashtami_greeting_shared');
      } else {
        await navigator.clipboard.writeText(url.toString());
        setShareStatus('Link copied');
        track('janmashtami_greeting_link_copied');
      }
    } catch (error) {
      if (error?.name !== 'AbortError') setShareStatus('Try again');
    }
  }

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="janmashtami-title"
      aria-describedby="janmashtami-message"
      style={{
        position: 'fixed', inset: 0, zIndex: 2147483000, display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '16px', isolation: 'isolate'
      }}
    >
      <button
        aria-label="Close Janmashtami greeting"
        onClick={closeGreeting}
        style={{
          position: 'absolute', inset: 0, zIndex: 1, width: '100%', height: '100%', border: 0, margin: 0,
          background: 'rgba(3,12,35,.82)', backdropFilter: 'blur(9px)', WebkitBackdropFilter: 'blur(9px)', cursor: 'default'
        }}
      />

      <section
        style={{
          position: 'relative', zIndex: 2, width: 'min(620px, 100%)', maxHeight: 'calc(100vh - 32px)', overflowY: 'auto',
          borderRadius: '28px', border: '1px solid rgba(234,194,92,.72)',
          background: 'linear-gradient(145deg,#061a46 0%,#0a2862 52%,#071631 100%)',
          boxShadow: '0 30px 90px rgba(0,0,0,.5), inset 0 0 0 1px rgba(255,255,255,.04)', color: '#fff8df'
        }}
      >
        <div aria-hidden="true" style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', borderRadius: '28px' }}>
          <div style={{ position: 'absolute', width: 260, height: 260, borderRadius: '50%', top: -110, left: -90, background: 'radial-gradient(circle,rgba(240,195,76,.25),transparent 68%)' }} />
          <div style={{ position: 'absolute', width: 300, height: 300, borderRadius: '50%', right: -120, bottom: -130, background: 'radial-gradient(circle,rgba(22,115,172,.38),transparent 68%)' }} />
          <Sparkles style={{ position: 'absolute', left: '10%', top: '15%', width: 20, color: '#f3cf6c', opacity: .75 }} />
          <Sparkles style={{ position: 'absolute', right: '12%', top: '30%', width: 16, color: '#f3cf6c', opacity: .55 }} />
          <Feather style={{ position: 'absolute', right: -10, bottom: 26, width: 122, height: 122, color: '#f4d477', opacity: .10, transform: 'rotate(-18deg)' }} />
          <Music2 style={{ position: 'absolute', left: -5, bottom: 38, width: 90, height: 90, color: '#f4d477', opacity: .07, transform: 'rotate(12deg)' }} />
        </div>

        <button
          onClick={closeGreeting}
          aria-label="Continue to website"
          style={{
            position: 'absolute', right: 16, top: 16, zIndex: 5, width: 40, height: 40, borderRadius: '50%',
            border: '1px solid rgba(255,255,255,.2)', background: 'rgba(255,255,255,.09)', color: '#fff',
            display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer'
          }}
        >
          <X style={{ width: 17, height: 17 }} />
        </button>

        <div style={{ position: 'relative', zIndex: 3, textAlign: 'center', padding: '42px 28px 32px' }}>
          <div style={{ margin: '0 auto 22px', width: 68, height: 68, borderRadius: '50%', border: '1px solid rgba(240,198,91,.66)', background: 'rgba(240,198,91,.11)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Feather style={{ width: 34, height: 34, color: '#f2cc68' }} />
          </div>

          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.26em', textTransform: 'uppercase', color: '#e7c66c' }}>
            Smit Sir Commerce wishes you
          </div>

          <h2 id="janmashtami-title" style={{ margin: '16px 0 0', fontSize: 'clamp(38px,7vw,58px)', lineHeight: 1.05, fontWeight: 700, color: '#fff8df', fontFamily: 'var(--font-serif)' }}>
            Happy Janmashtami
          </h2>

          <div aria-hidden="true" style={{ display: 'flex', alignItems: 'center', gap: 12, maxWidth: 330, margin: '18px auto 0' }}>
            <span style={{ height: 1, flex: 1, background: 'linear-gradient(90deg,transparent,#d9b65b)' }} />
            <span style={{ color: '#efcb6d', fontSize: 18 }}>✦</span>
            <span style={{ height: 1, flex: 1, background: 'linear-gradient(90deg,#d9b65b,transparent)' }} />
          </div>

          <p id="janmashtami-message" style={{ maxWidth: 470, margin: '20px auto 0', fontSize: 17, lineHeight: 1.7, color: 'rgba(255,248,223,.86)' }}>
            May Shri Krishna's wisdom inspire curiosity, courage and clarity in every learner.
          </p>

          <p style={{ margin: '10px 0 0', fontSize: 14, color: 'rgba(255,255,255,.6)' }}>
            Celebrate the day with learning that feels meaningful.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 12, marginTop: 28 }}>
            <button
              onClick={closeGreeting}
              style={{ minHeight: 50, border: 0, borderRadius: 16, padding: '13px 18px', fontSize: 14, fontWeight: 800, background: 'linear-gradient(135deg,#f4d477,#d6a63e)', color: '#071631', boxShadow: '0 12px 26px rgba(211,166,63,.22)', cursor: 'pointer' }}
            >
              Continue Learning
            </button>
            <button
              onClick={shareGreeting}
              style={{ minHeight: 50, borderRadius: 16, padding: '13px 18px', fontSize: 14, fontWeight: 700, border: '1px solid rgba(239,203,109,.48)', color: '#fff7da', background: 'rgba(255,255,255,.05)', cursor: 'pointer', display: 'flex', gap: 8, alignItems: 'center', justifyContent: 'center' }}
            >
              <Share2 style={{ width: 17, height: 17 }} />
              {shareStatus || 'Share Janmashtami Wishes'}
            </button>
          </div>

          <div style={{ marginTop: 24, fontSize: 11, letterSpacing: '.18em', textTransform: 'uppercase', color: 'rgba(255,255,255,.45)' }}>
            Learning with fun • Marks as a result
          </div>
        </div>
      </section>
    </div>
  );
}
