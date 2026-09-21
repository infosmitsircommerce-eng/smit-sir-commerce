import { useEffect, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  ArrowRight,
  BadgeCheck,
  BookOpenCheck,
  Check,
  CheckCircle2,
  CreditCard,
  Crown,
  FileText,
  Loader2,
  LockKeyhole,
  ShieldCheck,
  Sparkles,
  X,
} from 'lucide-react';
import SEO from '../components/ui/SEO';
import AccountancyPremiumPreview from '../components/premium/AccountancyPremiumPreview';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { trackEvent } from '../lib/analytics';
import { verifiedQuizPacks } from '../data/quizPublic';
import { gsebPremiumEconomicsMaterials } from '../data/gsebMaterials';
import { gseb11AccountancyPremiumMaterials } from '../data/gsebAccountancyPremium';
import { cbse12AccountancyPremiumMaterials } from '../data/cbse12AccountancyPremium';
import { PREMIUM_MEGA_PACK } from '../data/premiumMegaPack';

const PATH = '/premium';
let cashfreeScriptPromise;

function loadCashfreeSdk() {
  if (window.Cashfree) return Promise.resolve(window.Cashfree);
  if (!cashfreeScriptPromise) {
    cashfreeScriptPromise = new Promise((resolve, reject) => {
      const existing = document.querySelector('script[data-cashfree-sdk="true"]');
      if (existing) {
        existing.addEventListener('load', () => resolve(window.Cashfree), { once: true });
        existing.addEventListener('error', () => reject(new Error('Unable to load secure checkout.')), { once: true });
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://sdk.cashfree.com/js/v3/cashfree.js';
      script.async = true;
      script.dataset.cashfreeSdk = 'true';
      script.onload = () => window.Cashfree ? resolve(window.Cashfree) : reject(new Error('Unable to initialize secure checkout.'));
      script.onerror = () => reject(new Error('Unable to load secure checkout.'));
      document.head.appendChild(script);
    });
  }
  return cashfreeScriptPromise;
}

const cbse11Economics = verifiedQuizPacks.filter(
  (pack) => pack.board === 'CBSE' && pack.classLevel === 11 && pack.subject === 'Economics',
);
const cbse12Macro = verifiedQuizPacks.filter(
  (pack) => pack.board === 'CBSE' && pack.classLevel === 12 && pack.stream === 'Macroeconomics',
);
const cbse12Ied = verifiedQuizPacks.filter(
  (pack) => pack.board === 'CBSE' && pack.classLevel === 12 && pack.stream === 'Indian Economic Development',
);

const CATALOG = [
  {
    board: 'CBSE',
    classes: [
      {
        level: 'Class 11',
        subjects: [
          {
            name: 'Economics — Microeconomics',
            type: 'Premium guides + advanced quizzes',
            href: '/premium/economics?board=CBSE',
            status: 'LIVE',
            items: cbse11Economics.map((pack) => ({
              title: pack.title,
              meta: '20 concepts · 20 worked challenges · 40 MCQs',
            })),
          },
        ],
      },
      {
        level: 'Class 12',
        subjects: [
          {
            name: 'Accountancy — Parts I & II',
            type: 'Premium Master rebuild in progress',
            href: '/premium/cbse-12-accountancy',
            status: 'NEW STANDARD',
            items: [
              {
                title: 'Financial Ratios — Analysis',
                meta: '105-page full Premium-quality sample · free to read now',
              },
              ...cbse12AccountancyPremiumMaterials.slice(0, 4).map((item) => ({
                title: item.title,
                meta: 'Protected chapter catalogue · being upgraded to the new Master standard',
              })),
            ],
          },
          {
            name: 'Economics — Macroeconomics',
            type: 'Premium guides + advanced quizzes',
            href: '/premium/economics?board=CBSE',
            status: 'LIVE',
            items: cbse12Macro.map((pack) => ({
              title: pack.title,
              meta: '20 concepts · 20 worked challenges · 40 MCQs',
            })),
          },
          {
            name: 'Economics — Indian Economic Development',
            type: 'Premium guides + advanced quizzes',
            href: '/premium/economics?board=CBSE',
            status: 'LIVE',
            items: cbse12Ied.map((pack) => ({
              title: pack.title,
              meta: '20 concepts · 20 worked challenges · 40 MCQs',
            })),
          },
        ],
      },
    ],
  },
  {
    board: 'GSEB',
    classes: [
      {
        level: 'Class 11',
        subjects: [
          {
            name: 'Accountancy — Part 1',
            type: 'Detailed Premium library · sync/rebuild in progress',
            href: '/premium/accountancy',
            status: 'UPGRADING',
            items: gseb11AccountancyPremiumMaterials.slice(0, 5).map((item) => ({
              title: `Chapter ${item.chapterNumber} — ${item.title}`,
              meta: 'Catalogue visible · protected PDF availability shown inside the library',
            })),
          },
        ],
      },
      {
        level: 'Class 12',
        subjects: [
          {
            name: 'Economics',
            type: 'Premium revision PDFs + advanced practice',
            href: '/premium/economics?board=GSEB',
            status: 'LIVE',
            items: gsebPremiumEconomicsMaterials.map((item) => ({
              title: item.title,
              meta: `${item.pages} pages · Premium revision PDF`,
            })),
          },
        ],
      },
    ],
  },
];

function CheckoutDialog({ user, onClose }) {
  const ref = useRef(null);
  const [mobile, setMobile] = useState('');
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const dialog = ref.current;
    const previous = document.body.style.overflow;
    dialog?.showModal();
    document.body.style.overflow = 'hidden';
    void trackEvent('premium_checkout_view', { productId: PREMIUM_MEGA_PACK.id, value: PREMIUM_MEGA_PACK.price }, user?.id || null);
    return () => {
      dialog?.close();
      document.body.style.overflow = previous;
    };
  }, [user?.id]);

  async function submit(event) {
    event.preventDefault();
    if (!user) return;
    const phone = mobile.replace(/\D/g, '');
    if (!/^[6-9]\d{9}$/.test(phone)) {
      setMessage('Enter a valid 10-digit Indian mobile number.');
      return;
    }

    setBusy(true);
    setMessage('');
    void trackEvent('premium_checkout_start', { productId: PREMIUM_MEGA_PACK.id, value: PREMIUM_MEGA_PACK.price }, user.id);

    try {
      const { data } = await supabase.auth.getSession();
      const token = data.session?.access_token;
      if (!token) throw new Error('Please sign in again before checkout.');

      const response = await fetch('/api/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ productId: PREMIUM_MEGA_PACK.id, phone }),
      });
      const body = await response.json();

      if (body.alreadyOwned) {
        window.location.href = body.accessPath || '/my-purchases';
        return;
      }
      if (!response.ok) {
        throw new Error(body.error || 'Unable to start secure checkout.');
      }
      if (!body.paymentSessionId) throw new Error('Secure checkout session was not created.');

      const Cashfree = await loadCashfreeSdk();
      const cashfree = Cashfree({ mode: body.environment === 'production' ? 'production' : 'sandbox' });
      void trackEvent('premium_cashfree_open', { productId: PREMIUM_MEGA_PACK.id, value: PREMIUM_MEGA_PACK.price }, user.id);
      await cashfree.checkout({ paymentSessionId: body.paymentSessionId, redirectTarget: '_self' });
    } catch (error) {
      setMessage(error.message || 'Unable to start secure checkout. Please try again.');
      void trackEvent('premium_checkout_error', { productId: PREMIUM_MEGA_PACK.id }, user?.id || null);
    } finally {
      setBusy(false);
    }
  }

  return (
    <dialog
      ref={ref}
      onCancel={(event) => { event.preventDefault(); onClose(); }}
      onClick={(event) => { if (event.target === event.currentTarget) onClose(); }}
      className="rounded-[1.75rem] p-0 border-0"
      style={{
        width: 'min(560px, calc(100vw - 20px))',
        background: '#fffdf8',
        color: '#172033',
        boxShadow: '0 28px 100px rgba(8,18,40,.32)',
      }}
    >
      <form onSubmit={submit} className="p-6 sm:p-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <span className="eyebrow">SECURE CHECKOUT</span>
            <h2 className="text-3xl sm:text-4xl mt-3" style={{ fontFamily: 'var(--font-serif)' }}>
              Complete Commerce
            </h2>
          </div>
          <button type="button" onClick={onClose} aria-label="Close checkout" className="btn-secondary">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="rounded-2xl p-5 mt-5" style={{ background: '#14213d', color: '#fff' }}>
          <div className="text-xs font-black tracking-[.14em]" style={{ color: '#f2c75b' }}>ONE-TIME ACCESS</div>
          <div className="text-4xl font-black mt-2">₹{PREMIUM_MEGA_PACK.price}</div>
          <p className="text-sm mt-2 leading-6" style={{ color: '#d7deea' }}>
            Current Premium libraries, advanced practice and newly published Premium resources included in the Complete Commerce plan.
          </p>
        </div>

        {!user ? (
          <div className="mt-5">
            <p className="text-sm leading-6" style={{ color: 'var(--muted)' }}>
              Sign in first so the verified payment unlocks the correct student account.
            </p>
            <Link to={`/login?next=${encodeURIComponent('/premium?plan=999')}`} className="btn-primary w-full mt-4 text-center">
              Sign in / create account
            </Link>
          </div>
        ) : (
          <>
            <label className="block text-sm font-bold mt-5">
              Mobile number
              <input
                required
                inputMode="numeric"
                maxLength={10}
                value={mobile}
                onChange={(event) => setMobile(event.target.value.replace(/\D/g, '').slice(0, 10))}
                className="input-field w-full mt-2"
                placeholder="10-digit Indian mobile number"
                autoComplete="tel"
              />
            </label>
            <button disabled={busy} className="btn-primary w-full mt-5 inline-flex items-center justify-center gap-2">
              {busy ? <><Loader2 className="w-4 h-4 animate-spin" /> Preparing secure checkout…</> : <><CreditCard className="w-4 h-4" /> Continue securely for ₹{PREMIUM_MEGA_PACK.price}</>}
            </button>
          </>
        )}

        {message ? <p role="status" className="text-sm font-semibold leading-6 mt-4">{message}</p> : null}

        <div className="flex gap-2 mt-5 text-xs leading-5" style={{ color: 'var(--muted)' }}>
          <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5" />
          <span>Payment is verified server-side before access is granted. Never share a UPI PIN or OTP.</span>
        </div>
      </form>
    </dialog>
  );
}

function PlanCard({ title, eyebrow, price, note, features, featured, href, onChoose }) {
  const body = (
    <>
      {featured ? <span className="absolute -top-3 left-6 rounded-full px-4 py-1.5 text-xs font-black" style={{ background: '#f2c75b', color: '#172033' }}>BEST VALUE</span> : null}
      <div className="flex items-start justify-between gap-4 mt-1">
        <div>
          <span className="text-xs font-black tracking-[.12em]" style={{ color: featured ? '#f2c75b' : '#8b6418' }}>{eyebrow}</span>
          <h2 className="text-2xl font-black mt-2">{title}</h2>
        </div>
        {featured ? <Crown className="w-8 h-8" style={{ color: '#f2c75b' }} /> : <BookOpenCheck className="w-8 h-8" style={{ color: 'var(--gold)' }} />}
      </div>
      <div className="mt-5">
        <span className="text-5xl font-black">₹{price}</span>
        <span className="text-sm font-bold ml-2" style={{ color: featured ? '#c8d2e7' : 'var(--muted)' }}>one time</span>
      </div>
      <p className="text-sm mt-2" style={{ color: featured ? '#d7dfef' : 'var(--muted)' }}>{note}</p>
      <div className="space-y-3 mt-6 flex-1">
        {features.map((feature) => (
          <div key={feature} className="flex gap-2.5 text-sm font-semibold leading-5">
            <Check className="w-4 h-4 mt-0.5 shrink-0" style={{ color: featured ? '#f2c75b' : '#23834a' }} />
            <span>{feature}</span>
          </div>
        ))}
      </div>
      {href ? (
        <Link
          to={href}
          onClick={() => void trackEvent('premium_plan_click', { plan: 'focused-199', value: 199 })}
          className="w-full rounded-xl px-5 py-3.5 font-black mt-7 inline-flex items-center justify-center gap-2"
          style={{ background: '#17284b', color: '#fff' }}
        >
          Browse ₹199 packs <ArrowRight className="w-4 h-4" />
        </Link>
      ) : (
        <button
          type="button"
          onClick={() => {
            void trackEvent('premium_plan_click', { plan: PREMIUM_MEGA_PACK.id, value: PREMIUM_MEGA_PACK.price });
            onChoose();
          }}
          className="w-full rounded-xl px-5 py-3.5 font-black mt-7 inline-flex items-center justify-center gap-2"
          style={{ background: '#f2c75b', color: '#172033' }}
        >
          Continue securely <ArrowRight className="w-4 h-4" />
        </button>
      )}
    </>
  );

  return (
    <article
      className="relative rounded-[1.75rem] p-6 sm:p-7 flex flex-col"
      style={{
        background: featured ? 'linear-gradient(145deg,#0b1834,#172b55)' : '#fff',
        color: featured ? '#fff' : 'var(--ink)',
        border: featured ? '1px solid #263f70' : '1px solid #e7e0d4',
        boxShadow: featured ? '0 24px 65px rgba(13,30,62,.22)' : '0 14px 38px rgba(35,31,25,.07)',
      }}
    >
      {body}
    </article>
  );
}

export default function Premium() {
  const { user, isPremium, legacyPremium, hasMegaPremium, isAdmin, loading } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const fullAccess = isPremium || legacyPremium || hasMegaPremium || isAdmin;

  useEffect(() => {
    void trackEvent('premium_page_view', { source: searchParams.get('from') || 'direct' }, user?.id || null);
  }, [user?.id]);

  useEffect(() => {
    if (searchParams.get('plan') === '999') setCheckoutOpen(true);
  }, [searchParams]);

  function openCheckout() {
    setCheckoutOpen(true);
    setSearchParams({ plan: '999' });
  }

  function closeCheckout() {
    setCheckoutOpen(false);
    setSearchParams({});
  }

  const statusText = loading ? 'Checking access…' : fullAccess ? 'Premium active' : user ? 'Free account' : 'Browse without login';

  return (
    <main className="min-h-screen" style={{ background: 'linear-gradient(180deg,#fffaf0 0%,#f7f9fc 46%,#fff 100%)' }}>
      <SEO
        title="Premium Commerce Notes, PDFs & Quizzes — Smit Sir Commerce"
        description="Read a full Premium-quality Accountancy chapter free, compare focused ₹199 packs and ₹999 Complete Commerce, then use secure verified checkout."
        path={PATH}
      />

      <section className="page-container pt-10 pb-8 sm:pt-14 max-w-6xl">
        <div className="flex items-center justify-between gap-3 mb-7">
          <span className="eyebrow inline-flex items-center gap-2"><Sparkles className="w-4 h-4" /> Premium</span>
          <span
            className="rounded-full px-3 py-2 text-xs font-black"
            style={{ background: fullAccess ? '#e9f8ee' : '#fff', color: fullAccess ? '#21663a' : '#6b6257', border: '1px solid #e7e0d4' }}
          >
            {statusText}
          </span>
        </div>

        <div className="max-w-4xl">
          <h1 className="text-4xl sm:text-6xl font-black leading-[1.04]" style={{ letterSpacing: '-.045em', color: '#14213d' }}>
            See the quality first.<br /><span style={{ color: '#b8872f' }}>Pay only when the deeper library is useful.</span>
          </h1>
          <p className="text-base sm:text-lg leading-8 mt-5" style={{ color: 'var(--muted)' }}>
            Start with the complete Financial Ratios Premium Master sample below. Focused ₹199 packs unlock one clearly defined published pack; ₹999 Complete Commerce unlocks the current Premium ecosystem tied to your student account.
          </p>
        </div>

        {fullAccess ? (
          <section className="rounded-3xl p-5 sm:p-6 mt-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4" style={{ background: '#eaf8ef', border: '1px solid #bfe0c7' }}>
            <div className="flex gap-3">
              <CheckCircle2 className="w-7 h-7 shrink-0" style={{ color: '#21663a' }} />
              <div>
                <h2 className="font-black" style={{ color: '#174d2a' }}>Your Premium access is active</h2>
                <p className="text-sm mt-1" style={{ color: '#356846' }}>Open your verified purchases and protected libraries.</p>
              </div>
            </div>
            <Link to="/my-purchases" className="btn-primary whitespace-nowrap">Open My Purchases</Link>
          </section>
        ) : null}
      </section>

      <AccountancyPremiumPreview variant="showcase" />

      <section className="page-container max-w-6xl py-10">
        <span className="text-xs font-black tracking-[.13em]" style={{ color: '#8b6418' }}>CLEAR PRICING</span>
        <h2 className="text-3xl sm:text-4xl font-black mt-2">Choose the smallest pack that solves your need.</h2>
        <div className="grid lg:grid-cols-2 gap-5 mt-7">
          <PlanCard
            eyebrow="SELECTED PUBLISHED PACKS"
            title="Focused Pack"
            price={199}
            note="One clearly defined board/class/subject pack where a paid layer is already published."
            features={[
              'See the exact resource list before paying',
              'Free preview remains available first',
              'Harder practice / premium guides only where listed',
              'One-time payment for the selected pack',
            ]}
            href="/board-booster-packs"
          />
          <PlanCard
            eyebrow="COMPLETE ACCESS"
            title="Complete Commerce"
            price={PREMIUM_MEGA_PACK.price}
            note="One verified student account for the complete current Premium ecosystem."
            features={[
              'Current Premium Economics libraries',
              'Current Premium practice and protected resources',
              'Premium Accountancy resources as they are published/synced',
              'New Premium resources explicitly added to Complete Commerce',
              'Server-verified access after secure checkout',
            ]}
            featured
            onChoose={openCheckout}
          />
        </div>
      </section>

      <section className="page-container max-w-6xl py-10">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-black tracking-[.13em]" style={{ color: '#8b6418' }}>THE CATALOGUE</span>
            <h2 className="text-3xl sm:text-4xl font-black mt-2">See what is live, what is free, and what is being upgraded.</h2>
            <p className="mt-3 max-w-3xl" style={{ color: 'var(--muted)' }}>
              We no longer treat a chapter name as proof that a protected PDF is ready. Each library page shows its current availability, while the Financial Ratios sample demonstrates the new Premium Master standard.
            </p>
          </div>
          <div className="inline-flex items-center gap-2 text-sm font-bold"><LockKeyhole className="w-4 h-4" style={{ color: 'var(--gold)' }} /> Verified access only</div>
        </div>

        <div className="space-y-10 mt-8">
          {CATALOG.map((board) => (
            <section key={board.board} className="rounded-[1.75rem] p-4 sm:p-7" style={{ background: '#fff', border: '1px solid #e5ddcf', boxShadow: '0 16px 44px rgba(35,31,25,.06)' }}>
              <div className="flex items-center justify-between gap-4">
                <div><span className="text-xs font-black tracking-[.14em]" style={{ color: '#8b6418' }}>BOARD</span><h3 className="text-3xl font-black mt-1">{board.board}</h3></div>
              </div>

              <div className="space-y-8 mt-7">
                {board.classes.map((cls) => (
                  <div key={cls.level}>
                    <div className="flex items-center gap-3">
                      <span className="w-9 h-9 rounded-xl grid place-items-center font-black text-sm" style={{ background: '#fff2c8', color: '#805a14' }}>{cls.level.replace('Class ', '')}</span>
                      <h4 className="text-xl font-black">{cls.level}</h4>
                    </div>

                    <div className="grid xl:grid-cols-2 gap-5 mt-4">
                      {cls.subjects.map((subject) => (
                        <article key={subject.name} className="rounded-2xl overflow-hidden flex flex-col" style={{ border: '1px solid #e8e0d3', background: '#fcfbf8' }}>
                          <div className="p-4 sm:p-5" style={{ background: '#f6f1e7', borderBottom: '1px solid #e8e0d3' }}>
                            <div className="flex items-start justify-between gap-3">
                              <div>
                                <h5 className="font-black text-lg">{subject.name}</h5>
                                <p className="text-xs font-bold mt-1" style={{ color: '#8b6418' }}>{subject.type}</p>
                              </div>
                              <span className="rounded-full px-2.5 py-1 text-[10px] font-black tracking-wider" style={{ background: subject.status === 'LIVE' ? '#eaf8ef' : '#fff3cd', color: subject.status === 'LIVE' ? '#21663a' : '#805a14' }}>{subject.status}</span>
                            </div>
                          </div>

                          <div className="divide-y" style={{ borderColor: '#eee8de' }}>
                            {subject.items.slice(0, 5).map((item, index) => (
                              <div key={item.title} className="flex items-start gap-3 p-4">
                                <span className="w-7 h-7 rounded-lg grid place-items-center shrink-0 text-[11px] font-black" style={{ background: '#fff2c8', color: '#805a14' }}>{String(index + 1).padStart(2, '0')}</span>
                                <span className="min-w-0 flex-1">
                                  <strong className="block text-sm leading-5">{item.title}</strong>
                                  <small className="block mt-1 leading-5" style={{ color: 'var(--muted)' }}>{item.meta}</small>
                                </span>
                              </div>
                            ))}
                          </div>

                          <Link to={subject.href} className="w-full px-4 py-3 font-black text-sm inline-flex items-center justify-center gap-2 mt-auto" style={{ background: '#14213d', color: '#fff' }}>
                            Open {subject.name} <ArrowRight className="w-4 h-4" />
                          </Link>
                        </article>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      </section>

      <section className="page-container max-w-6xl py-10 pb-20">
        <div className="rounded-[1.75rem] p-6 sm:p-8" style={{ background: '#fff', border: '1px solid #e7e0d4' }}>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              ['01', 'Preview first', 'Open the full Financial Ratios Premium sample or another free preview before paying.'],
              ['02', 'Choose access', 'Pick a focused ₹199 pack or Complete Commerce depending on what is actually published.'],
              ['03', 'Secure checkout', 'Sign in and use Cashfree so the order is tied to the correct student account.'],
              ['04', 'Verified unlock', 'Access is granted only after server-side payment verification.'],
            ].map(([n, title, text]) => (
              <div key={n}>
                <div className="text-xs font-black tracking-wider" style={{ color: '#b8872f' }}>{n}</div>
                <h3 className="font-black mt-2">{title}</h3>
                <p className="text-sm leading-6 mt-2" style={{ color: 'var(--muted)' }}>{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {checkoutOpen ? <CheckoutDialog user={user} onClose={closeCheckout} /> : null}
    </main>
  );
}
