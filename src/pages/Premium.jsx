import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  BadgeCheck,
  BookOpenCheck,
  Check,
  CheckCircle2,
  CreditCard,
  Crown,
  FileText,
  Layers3,
  Loader2,
  LockKeyhole,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import SEO from '../components/ui/SEO';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { trackEvent } from '../lib/analytics';
import { PREMIUM_MEGA_PACK, PREMIUM_MEGA_SECTIONS } from '../data/premiumMegaPack';

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

function MegaCheckout({ user, displayName, alreadyCovered, hasMegaPremium, fetchProfile }) {
  const [mobile, setMobile] = useState('');
  const [consent, setConsent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');

  async function saveReservation(cleanMobile) {
    if (!consent) return false;
    const params = new URLSearchParams(window.location.search);
    const payload = {
      full_name: displayName || 'Student',
      mobile: `+91${cleanMobile}`,
      class_level: '11 & 12',
      board: 'CBSE + GSEB',
      subjects: ['Commerce Mega Premium'],
      study_mode: 'Online',
      preferred_contact_time: 'Any time',
      source: params.get('utm_source') ? 'Other' : document.referrer.includes('google.') ? 'Google' : 'Direct',
      intent: 'General Enquiry',
      message: `COMMERCE MEGA PREMIUM ₹${PREMIUM_MEGA_PACK.price} RESERVATION | Full current Premium library | Cashfree activation pending; no payment collected.`,
      consent: true,
      first_path: '/premium',
      utm_source: params.get('utm_source') || 'direct',
      utm_medium: params.get('utm_medium') || 'premium-page',
      utm_campaign: params.get('utm_campaign') || 'mega_premium_699',
      landing_context: `premium:${PREMIUM_MEGA_PACK.id}`,
    };
    const { error } = await supabase.from('lead_submissions').insert(payload);
    return !error;
  }

  async function submit(event) {
    event.preventDefault();
    const cleanMobile = mobile.replace(/\D/g, '');
    if (!/^[6-9]\d{9}$/.test(cleanMobile)) {
      setMessage('Enter a valid 10-digit Indian mobile number.');
      return;
    }
    if (!user) {
      setMessage('Sign in first so the Mega Premium Pack can be unlocked to the correct student account.');
      return;
    }
    if (alreadyCovered) {
      setMessage(hasMegaPremium ? 'Your Commerce Mega Premium Pack is already active.' : 'Your existing Premium account already covers these resources.');
      return;
    }

    setBusy(true);
    setMessage('');
    void trackEvent('premium_mega_checkout_start', { productId: PREMIUM_MEGA_PACK.id, value: PREMIUM_MEGA_PACK.price }, user.id);

    try {
      const { data } = await supabase.auth.getSession();
      const token = data.session?.access_token;
      if (!token) throw new Error('Please sign in again before checkout.');

      const response = await fetch('/api/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ productId: PREMIUM_MEGA_PACK.id, phone: cleanMobile }),
      });
      const body = await response.json();

      if (body.alreadyOwned) {
        await fetchProfile(user.id);
        setMessage('Your Commerce Mega Premium Pack is already active.');
        return;
      }

      if (!response.ok) {
        if (body.code === 'gateway_activation_pending') {
          const reserved = await saveReservation(cleanMobile);
          setMessage(reserved
            ? 'Cashfree is still activating. No money was taken; your ₹699 Mega Premium request has been saved.'
            : 'Cashfree is still activating. No money was taken. Tick the contact box if you want us to save your ₹699 reservation.');
          return;
        }
        throw new Error(body.error || 'Unable to start secure checkout.');
      }

      if (!body.paymentSessionId) throw new Error('Secure checkout session was not created.');
      const Cashfree = await loadCashfreeSdk();
      const cashfree = Cashfree({ mode: body.environment === 'production' ? 'production' : 'sandbox' });
      void trackEvent('premium_mega_cashfree_open', { productId: PREMIUM_MEGA_PACK.id, value: PREMIUM_MEGA_PACK.price }, user.id);
      await cashfree.checkout({ paymentSessionId: body.paymentSessionId, redirectTarget: '_self' });
    } catch (error) {
      setMessage(error.message || 'Unable to start secure checkout. Please try again.');
      void trackEvent('premium_mega_checkout_error', { productId: PREMIUM_MEGA_PACK.id }, user?.id || null);
    } finally {
      setBusy(false);
    }
  }

  if (alreadyCovered) {
    return (
      <div className="rounded-2xl p-5" style={{ background: '#edf9f0', border: '1px solid #bfe0c7' }}>
        <div className="flex gap-3"><CheckCircle2 className="w-6 h-6 shrink-0" style={{ color: '#21663a' }} /><div><div className="font-black" style={{ color: '#174d2a' }}>{hasMegaPremium ? 'Mega Premium is active' : 'Full Premium access is already active'}</div><p className="text-sm mt-1 leading-6" style={{ color: '#356846' }}>This account can open the Premium libraries and Premium-gated study tools covered by the full-access plan.</p></div></div>
        <a href="/my-purchases.html" className="btn-primary w-full mt-4 text-center">Open My Purchases</a>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="rounded-2xl p-5" style={{ background: '#fffaf0', border: '1px solid rgba(184,135,47,.32)' }}>
      <div className="flex items-center justify-between gap-3"><span className="text-xs font-black tracking-wider" style={{ color: '#8a6012' }}>ONE-TIME MEGA ACCESS</span><span className="text-2xl font-black" style={{ color: '#17284b' }}>₹699</span></div>
      <p className="text-sm mt-3 leading-6" style={{ color: 'var(--muted)' }}>One student account gets the complete Premium ecosystem currently published on Smit Sir Commerce.</p>
      <label className="block text-sm font-bold mt-4">Mobile number<input required inputMode="numeric" maxLength={10} value={mobile} onChange={(event) => setMobile(event.target.value.replace(/\D/g, '').slice(0, 10))} className="input-field w-full mt-2" placeholder="10-digit mobile" /></label>
      {!user ? <div className="rounded-xl p-4 mt-4 text-sm" style={{ background: '#fff6df', border: '1px solid #ead4a4' }}>Login is required so the purchase can unlock the correct account. <Link to="/login?next=%2Fpremium" className="font-black underline">Sign in / create account</Link></div> : null}
      <label className="flex items-start gap-3 text-sm leading-6 mt-4"><input type="checkbox" checked={consent} onChange={(event) => setConsent(event.target.checked)} className="mt-1 w-4 h-4" /><span>If Cashfree is still pending, save my request and allow Smit Sir Commerce to contact me about the ₹699 Mega Premium Pack.</span></label>
      <button disabled={busy || !user} className="btn-primary w-full mt-5 inline-flex items-center justify-center gap-2">{busy ? <><Loader2 className="w-4 h-4 animate-spin" /> Preparing secure checkout…</> : <><CreditCard className="w-4 h-4" /> Continue for ₹699</>}</button>
      {message ? <p role="status" className="text-sm font-semibold leading-6 mt-4">{message}</p> : null}
    </form>
  );
}

export default function Premium() {
  const {
    user,
    isPremium,
    legacyPremium,
    hasMegaPremium,
    isAdmin,
    displayName,
    fetchProfile,
    loading,
  } = useAuth();
  const fullAccess = isPremium || isAdmin;
  const legacyAccess = legacyPremium || isAdmin;

  return (
    <main className="min-h-screen" style={{ background: 'linear-gradient(180deg,#fffaf0 0%,#f8fafc 55%,#fff 100%)' }}>
      <SEO
        title="Premium Access — Smit Sir Commerce"
        description="Premium Commerce libraries, the ₹699 Commerce Mega Premium Pack and focused Board Booster packs with protected student access."
        path="/premium"
        noindex
      />

      <section className="page-container py-12 sm:py-16 max-w-6xl">
        <div className="text-center max-w-3xl mx-auto">
          <span className="eyebrow inline-flex items-center gap-2"><Sparkles className="w-4 h-4" /> Premium access</span>
          <h1 className="text-4xl sm:text-6xl mt-5 leading-tight" style={{ fontFamily: 'var(--font-serif)', letterSpacing: '-.04em' }}>One Premium home for <span style={{ color: 'var(--gold)' }}>serious Commerce study.</span></h1>
          <p className="text-lg mt-5 leading-8" style={{ color: 'var(--muted)' }}>Choose a focused ₹199 subject pack when you need only one area, or get the ₹699 Mega Premium Pack for the complete Premium ecosystem currently published.</p>
        </div>

        <section className="mt-10 rounded-[2rem] overflow-hidden" style={{ background: 'linear-gradient(135deg,#09152f 0%,#17284b 60%,#2f260f 100%)', boxShadow: '0 28px 80px rgba(16,30,58,.22)' }}>
          <div className="grid lg:grid-cols-[1.25fr_.75fr]">
            <div className="p-6 sm:p-9 lg:p-10 text-white">
              <div className="flex flex-wrap items-center gap-3"><span className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-black tracking-[.12em]" style={{ background: '#f4cb61', color: '#18213c' }}><Crown className="w-4 h-4" /> EXCLUSIVE PREMIUM MEGA PACK</span><span className="text-sm font-black" style={{ color: '#f4cb61' }}>₹699 · one time</span></div>
              <h2 className="text-3xl sm:text-5xl mt-5 leading-tight" style={{ fontFamily: 'var(--font-serif)' }}>Commerce Mega Premium</h2>
              <p className="text-base sm:text-lg leading-8 mt-4 max-w-3xl" style={{ color: '#d8dfef' }}>All current Premium subjects and serious-practice resources in one purchase: protected PDFs, deep notes, worked numericals, Hard + Extreme practice, MCQs, Pro tests, exam practice and Premium study tools.</p>

              <div className="grid sm:grid-cols-2 gap-3 mt-7">
                {PREMIUM_MEGA_SECTIONS.map((section) => (
                  <a key={section.title} href={section.href} className="rounded-2xl p-4 block transition-transform hover:-translate-y-0.5" style={{ background: 'rgba(255,255,255,.075)', border: '1px solid rgba(244,203,97,.20)' }}>
                    <div className="flex gap-3"><FileText className="w-5 h-5 shrink-0 mt-0.5" style={{ color: '#f4cb61' }} /><div><h3 className="font-black">{section.title}</h3><p className="text-xs font-bold mt-1" style={{ color: '#f4cb61' }}>{section.meta}</p><p className="text-xs leading-5 mt-2" style={{ color: '#c6d0e5' }}>{section.detail}</p></div></div>
                  </a>
                ))}
              </div>

              <div className="rounded-2xl p-4 mt-6 flex gap-3" style={{ background: 'rgba(244,203,97,.10)', border: '1px solid rgba(244,203,97,.22)' }}><Layers3 className="w-5 h-5 shrink-0" style={{ color: '#f4cb61' }} /><p className="text-sm leading-6" style={{ color: '#e6ebf5' }}><strong>Better than one giant merged file:</strong> the Mega Pack is delivered as one Premium purchase with an organised subject library, so students can open the exact PDF, chapter, MCQ set or test they need without scrolling through thousands of pages.</p></div>
            </div>

            <aside className="p-6 sm:p-8 lg:p-9" style={{ background: 'linear-gradient(180deg,#fff8df,#ffffff)' }}>
              <div className="flex items-center justify-between gap-3"><div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ background: '#17284b', color: '#f4cb61' }}><Crown className="w-7 h-7" /></div><span className="rounded-full px-3 py-1 text-xs font-black" style={{ background: '#edf9f0', color: '#21663a' }}>BEST VALUE</span></div>
              <div className="mt-5"><span className="text-sm font-black" style={{ color: '#8a6012' }}>FULL CURRENT PREMIUM ACCESS</span><div className="text-5xl font-black mt-2" style={{ color: '#17284b' }}>₹699</div><p className="text-sm mt-2 leading-6" style={{ color: 'var(--muted)' }}>One-time access tied to the signed-in student account.</p></div>
              <div className="space-y-2.5 mt-5">{['All current Premium subject libraries', 'Protected Premium PDFs and master books', 'Hard + Extreme MCQs and worked explanations', 'Pro-labelled tests and serious exam practice', 'Premium-gated study tools'].map((item) => <div key={item} className="flex gap-2 text-sm font-semibold"><Check className="w-4 h-4 mt-0.5 shrink-0" style={{ color: '#21663a' }} /><span>{item}</span></div>)}</div>
              <div className="mt-6"><MegaCheckout user={user} displayName={displayName} alreadyCovered={fullAccess} hasMegaPremium={hasMegaPremium} fetchProfile={fetchProfile} /></div>
            </aside>
          </div>
        </section>

        <div className="grid lg:grid-cols-[1.05fr_.95fr] gap-7 items-start mt-10">
          <div>
            <a href="/gseb-class-11-accountancy-premium.html" className="card-paper p-5 sm:p-6 block" style={{ border: '1px solid rgba(184,135,47,.38)', background: 'linear-gradient(135deg,#fffaf0,#fff3c8)' }}>
              <div className="flex items-start gap-4"><div className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0" style={{ background: '#17284b', color: '#f4cc62' }}><BookOpenCheck className="w-6 h-6" /></div><div><span className="text-xs font-black tracking-wider" style={{ color: '#8a6012' }}>PREMIUM LIBRARY</span><h2 className="text-xl sm:text-2xl font-black mt-1">GSEB Std. 11 Accountancy — Part 1</h2><p className="text-sm leading-6 mt-2" style={{ color: 'var(--muted)' }}>10 complete chapters · 718 chapter pages · 720-page master book · accounting tables · worked numericals · board practice.</p><div className="font-black mt-3" style={{ color: 'var(--gold)' }}>See exactly what is included →</div></div></div>
            </a>

            <div className="grid sm:grid-cols-2 gap-4 mt-5">
              <div className="card-paper p-5"><ShieldCheck className="w-6 h-6" style={{ color: '#21663a' }} /><h2 className="text-lg font-black mt-3">Mega + focused access</h2><p className="text-sm mt-2 leading-6" style={{ color: 'var(--muted)' }}>₹699 Mega Premium acts as full Premium access. Focused ₹199 purchases still unlock only their matching subject pack.</p></div>
              <div className="card-paper p-5"><LockKeyhole className="w-6 h-6" style={{ color: 'var(--gold)' }} /><h2 className="text-lg font-black mt-3">Server-verified access</h2><p className="text-sm mt-2 leading-6" style={{ color: 'var(--muted)' }}>Protected material is served only after the account is verified. A visible resource card is not the same as a public PDF link.</p></div>
            </div>

            <div className="flex flex-wrap gap-3 mt-7"><Link to="/board-booster-packs" className="btn-primary">Browse ₹199 Board Boosters</Link><a href="/my-purchases.html" className="btn-secondary">My Purchases</a><Link to="/study-material" className="btn-secondary">Free Resources</Link></div>
          </div>

          <aside className="card-paper p-6 sm:p-7">
            <BadgeCheck className="w-9 h-9" style={{ color: fullAccess ? '#21663a' : 'var(--gold)' }} />
            <h2 className="text-2xl mt-4" style={{ fontFamily: 'var(--font-serif)' }}>Your Premium status</h2>
            {loading ? <p className="mt-4">Checking your account…</p> : hasMegaPremium ? <div className="rounded-2xl p-5 mt-5" style={{ background: '#edf9f0', border: '1px solid #bfe0c7' }}><div className="font-black" style={{ color: '#174d2a' }}>Commerce Mega Premium is active</div><p className="text-sm mt-1 leading-6" style={{ color: '#356846' }}>Your ₹699 full-access entitlement is connected to this account.</p><Link to="/premium/economics" className="btn-primary w-full mt-4 text-center">Open Premium Economics</Link><a href="/premium/accountancy" className="btn-secondary w-full mt-3 text-center">Open Premium Accountancy</a></div> : legacyAccess ? <div className="rounded-2xl p-5 mt-5" style={{ background: '#edf9f0', border: '1px solid #bfe0c7' }}><div className="font-black" style={{ color: '#174d2a' }}>Legacy Premium is active</div><p className="text-sm mt-1 leading-6" style={{ color: '#356846' }}>Your older Premium status continues to work for protected resources covered by legacy access.</p><Link to="/premium/economics" className="btn-primary w-full mt-4 text-center">Open Economics library</Link></div> : user ? <div className="rounded-2xl p-5 mt-5" style={{ background: 'var(--gold-bg)', border: '1px solid rgba(184,135,47,.25)' }}><div className="font-black">Free account</div><p className="text-sm mt-2 leading-6">You can inspect the complete Premium contents above before choosing ₹699 Mega access or a focused ₹199 subject pack.</p></div> : <div className="rounded-2xl p-5 mt-5" style={{ background: 'var(--gold-bg)', border: '1px solid rgba(184,135,47,.25)' }}><div className="font-black">Sign in to check access</div><p className="text-sm mt-2 leading-6">Purchases are attached to the student account used during checkout.</p><Link to="/login?next=%2Fpremium" className="btn-primary w-full mt-4 text-center">Sign in</Link></div>}
          </aside>
        </div>
      </section>
    </main>
  );
}
