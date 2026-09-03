import { useEffect, useMemo, useState } from 'react';
import { Feather, Music2, Share2, Sparkles, X } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

const FESTIVAL_DATE = '2026-09-04';
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

    const activeToday = getIndiaDateStamp() === FESTIVAL_DATE;
    const dismissed = window.localStorage.getItem(DISMISS_KEY) === 'yes';
    if ((!activeToday && !preview) || (dismissed && !preview)) return undefined;

    const timer = window.setTimeout(() => setOpen(true), 450);
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
      window.gtag('event', action, {
        festival: 'janmashtami_2026',
        page_path: window.location.pathname,
      });
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

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[120] flex items-center justify-center p-4 sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="janmashtami-title"
          aria-describedby="janmashtami-message"
        >
          <motion.button
            aria-label="Close Janmashtami greeting"
            className="absolute inset-0 w-full h-full cursor-default"
            style={{ background: 'rgba(3, 12, 35, 0.78)', backdropFilter: 'blur(10px)' }}
            onClick={closeGreeting}
          />

          <motion.section
            initial={{ opacity: 0, y: 26, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 180, damping: 20 }}
            className="relative w-full max-w-[620px] overflow-hidden rounded-[30px] border shadow-2xl"
            style={{
              borderColor: 'rgba(234, 194, 92, 0.7)',
              background: 'linear-gradient(145deg, #061a46 0%, #0a2862 52%, #071631 100%)',
              boxShadow: '0 30px 90px rgba(0,0,0,.45), inset 0 0 0 1px rgba(255,255,255,.04)',
            }}
          >
            <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
              <div className="absolute -top-24 -left-20 h-64 w-64 rounded-full" style={{ background: 'radial-gradient(circle, rgba(240,195,76,.22), transparent 67%)' }} />
              <div className="absolute -bottom-28 -right-16 h-72 w-72 rounded-full" style={{ background: 'radial-gradient(circle, rgba(22,115,172,.34), transparent 68%)' }} />
              <Sparkles className="absolute left-[9%] top-[16%] h-5 w-5 opacity-70" style={{ color: '#f3cf6c' }} />
              <Sparkles className="absolute right-[11%] top-[31%] h-4 w-4 opacity-55" style={{ color: '#f3cf6c' }} />
              <Feather className="absolute -right-3 bottom-8 h-32 w-32 rotate-[-18deg] opacity-[0.10]" style={{ color: '#f4d477' }} />
              <Music2 className="absolute -left-1 bottom-12 h-24 w-24 rotate-12 opacity-[0.07]" style={{ color: '#f4d477' }} />
            </div>

            <button
              onClick={closeGreeting}
              className="absolute right-4 top-4 z-20 flex h-10 w-10 items-center justify-center rounded-full border transition hover:scale-105"
              style={{ borderColor: 'rgba(255,255,255,.18)', background: 'rgba(255,255,255,.08)', color: '#fff' }}
              aria-label="Continue to website"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="relative z-10 px-6 py-8 text-center sm:px-10 sm:py-11">
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full border" style={{ borderColor: 'rgba(240,198,91,.65)', background: 'rgba(240,198,91,.10)' }}>
                <Feather className="h-8 w-8" style={{ color: '#f2cc68' }} />
              </div>

              <div className="text-[11px] font-semibold uppercase tracking-[0.28em]" style={{ color: '#e7c66c' }}>
                Smit Sir Commerce wishes you
              </div>

              <h2 id="janmashtami-title" className="mt-4 text-4xl font-semibold leading-tight sm:text-5xl" style={{ color: '#fff8df', fontFamily: 'var(--font-serif)' }}>
                Happy Janmashtami
              </h2>

              <div className="mx-auto mt-4 flex max-w-xs items-center justify-center gap-3" aria-hidden="true">
                <span className="h-px flex-1" style={{ background: 'linear-gradient(90deg, transparent, #d9b65b)' }} />
                <span className="text-lg" style={{ color: '#efcb6d' }}>✦</span>
                <span className="h-px flex-1" style={{ background: 'linear-gradient(90deg, #d9b65b, transparent)' }} />
              </div>

              <p id="janmashtami-message" className="mx-auto mt-5 max-w-md text-base leading-7 sm:text-lg" style={{ color: 'rgba(255,248,223,.83)' }}>
                May Shri Krishna's wisdom inspire curiosity, courage and clarity in every learner.
              </p>

              <p className="mt-4 text-sm" style={{ color: 'rgba(255,255,255,.58)' }}>
                Celebrate the day with learning that feels meaningful.
              </p>

              <div className="mt-8 grid gap-3 sm:grid-cols-2">
                <button
                  onClick={closeGreeting}
                  className="inline-flex min-h-12 items-center justify-center rounded-2xl px-5 py-3 text-sm font-bold transition hover:-translate-y-0.5"
                  style={{ background: 'linear-gradient(135deg, #f4d477, #d6a63e)', color: '#071631', boxShadow: '0 12px 26px rgba(211,166,63,.22)' }}
                >
                  Continue Learning
                </button>

                <button
                  onClick={shareGreeting}
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl border px-5 py-3 text-sm font-semibold transition hover:bg-white/10"
                  style={{ borderColor: 'rgba(239,203,109,.45)', color: '#fff7da', background: 'rgba(255,255,255,.045)' }}
                >
                  <Share2 className="h-4 w-4" />
                  {shareStatus || 'Share Janmashtami Wishes'}
                </button>
              </div>

              <div className="mt-7 text-[11px] uppercase tracking-[0.2em]" style={{ color: 'rgba(255,255,255,.42)' }}>
                Learning with fun • Marks as a result
              </div>
            </div>
          </motion.section>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
