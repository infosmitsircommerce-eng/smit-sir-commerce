import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  BadgeCheck,
  BookOpenCheck,
  Check,
  Crown,
  FileCheck2,
  HelpCircle,
  ListChecks,
  Loader2,
  LockKeyhole,
  MessageCircle,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import SEO from '../components/ui/SEO';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { trackEvent } from '../lib/analytics';

const benefits = [
  { icon: ListChecks, title: 'Hard & Extreme quizzes', text: 'Premium difficulty for CBSE Microeconomics, Macroeconomics and Indian Economic Development.' },
  { icon: BookOpenCheck, title: '31 chapter deep-dives', text: 'Every covered Economics chapter includes 20 focused concept explanations.' },
  { icon: FileCheck2, title: '620 worked challenges', text: 'Twenty solved Hard and Extreme questions per chapter with reasoning, not only answer keys.' },
  { icon: ShieldCheck, title: 'One account, lifetime access', text: 'Pay once. No monthly subscription and no scheduled expiry while Smit Sir Commerce operates.' },
];

const statusCopy = {
  pending: { title: 'Payment submitted', text: 'Your reference is waiting for manual verification. Please do not pay or submit again.', color: '#8a5b0b', bg: '#fff7df' },
  verified: { title: 'Payment verified', text: 'Premium is approved. If access is not visible yet, sign out once and sign in again.', color: '#21663a', bg: '#edf9f0' },
  rejected: { title: 'Reference not verified', text: 'Check the transaction reference and submit the correct successful-payment reference below.', color: '#8a2f2f', bg: '#fff0f0' },
};

function PaymentClaim({ user, isPremium }) {
  const [reference, setReference] = useState('');
  const [claim, setClaim] = useState(null);
  const [loadingClaim, setLoadingClaim] = useState(Boolean(user));
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');

  async function loadClaim() {
    if (!user) {
      setLoadingClaim(false);
      return;
    }
    const { data, error } = await supabase
      .from('premium_payment_claims')
      .select('id,transaction_reference,status,submitted_at,reviewed_at')
      .order('submitted_at', { ascending: false })
      .limit(1)
      .maybeSingle();
    if (!error) setClaim(data || null);
    setLoadingClaim(false);
  }

  useEffect(() => {
    loadClaim();
  }, [user?.id]);

  async function submit(event) {
    event.preventDefault();
    const cleanReference = reference.trim().toUpperCase();
    if (!/^[A-Z0-9/-]{6,80}$/.test(cleanReference)) {
      setMessage('Enter the 6–80 character transaction reference from your successful payment.');
      return;
    }
    setBusy(true);
    setMessage('');
    trackEvent('premium_claim_attempt', { offer: 'lifetime-999' }, user?.id || null);
    const { error } = await supabase.rpc('submit_premium_payment_claim', { p_reference: cleanReference });
    if (error) {
      setMessage(error.code === '23505'
        ? 'This transaction reference has already been submitted or verified.'
        : error.message);
      trackEvent('premium_claim_error', { offer: 'lifetime-999' }, user?.id || null);
    } else {
      setReference('');
      setMessage('Reference submitted successfully. Do not pay again while verification is pending.');
      trackEvent('premium_claim_success', { offer: 'lifetime-999' }, user?.id || null);
      if (typeof window.gtag === 'function') window.gtag('event', 'premium_claim_success', { offer: 'lifetime-999', value: 999, currency: 'INR' });
      await loadClaim();
    }
    setBusy(false);
  }

  if (isPremium) {
    return (
      <div className="rounded-2xl p-5" style={{ background: '#edf9f0', border: '1px solid #bfe0c7' }}>
        <div className="flex items-center gap-3">
          <BadgeCheck className="w-7 h-7" style={{ color: '#21663a' }} />
          <div><h3 className="font-black" style={{ color: '#174d2a' }}>Premium is active</h3><p className="text-sm mt-1" style={{ color: '#356846' }}>Your account already has lifetime Premium access.</p></div>
        </div>
        <Link to="/premium/economics" className="btn-primary w-full mt-4">Open Premium Economics Library</Link>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="rounded-2xl p-5" style={{ background: 'var(--gold-bg)', border: '1px solid rgba(184,135,47,.28)' }}>
        <LockKeyhole className="w-7 h-7" style={{ color: 'var(--gold)' }} />
        <h3 className="text-xl font-black mt-3">Create your student account first</h3>
        <p className="text-sm mt-2 leading-6">Premium is connected to your account email. Sign in before paying so you can submit the transaction reference from the same account.</p>
        <Link to="/login" className="btn-primary w-full mt-4">Sign in / create account</Link>
      </div>
    );
  }

  if (loadingClaim) {
    return <div className="flex items-center justify-center gap-2 p-6"><Loader2 className="w-5 h-5 animate-spin" /> Checking payment status…</div>;
  }

  const latest = claim && statusCopy[claim.status];
  const canSubmit = !claim || claim.status === 'rejected';

  return (
    <div>
      {latest && (
        <div className="rounded-2xl p-5 mb-5" style={{ background: latest.bg, border: `1px solid ${latest.color}33` }}>
          <div className="font-black" style={{ color: latest.color }}>{latest.title}</div>
          <p className="text-sm mt-1 leading-6" style={{ color: latest.color }}>{latest.text}</p>
          <p className="text-xs mt-2" style={{ color: 'var(--muted)' }}>Reference: {claim.transaction_reference}</p>
        </div>
      )}

      {canSubmit && (
        <form onSubmit={submit}>
          <label className="text-sm font-black" htmlFor="premium-reference">UPI transaction reference / UTR</label>
          <input
            id="premium-reference"
            required
            minLength={6}
            maxLength={80}
            inputMode="text"
            autoComplete="off"
            value={reference}
            onChange={(event) => setReference(event.target.value)}
            placeholder="Enter reference after successful ₹999 payment"
            className="w-full mt-2 rounded-xl border p-4 bg-white"
          />
          <button disabled={busy} className="btn-primary w-full mt-3">{busy ? 'Submitting…' : 'Submit for verification'}</button>
        </form>
      )}
      {message && <p role="status" className="text-sm mt-3 leading-6">{message}</p>}
    </div>
  );
}

export default function Premium() {
  const { user, isPremium, isAdmin, loading } = useAuth();
  const hasAccess = isPremium || isAdmin;
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: 'Smit Sir Commerce Premium',
    description: 'Lifetime Premium access to advanced CBSE Economics quizzes and chapter deep-dive study guides.',
    brand: { '@type': 'Brand', name: 'Smit Sir Commerce' },
    offers: {
      '@type': 'Offer',
      price: '999',
      priceCurrency: 'INR',
      availability: 'https://schema.org/InStock',
      url: 'https://www.smitsircommerce.in/premium',
    },
  };

  return (
    <main style={{ background: 'linear-gradient(180deg,#fffaf0 0%,#f8fafc 50%,#fff 100%)' }}>
      <SEO
        title="₹999 Lifetime Premium Economics Quizzes & Study Guides"
        description="Unlock Hard and Extreme CBSE Economics quizzes plus 31 chapter deep-dive guides with a one-time ₹999 payment."
        path="/premium"
        structuredData={structuredData}
      />

      <section className="page-container py-12 sm:py-20">
        <div className="grid lg:grid-cols-[1.1fr_.9fr] gap-8 lg:gap-12 items-start">
          <div>
            <span className="eyebrow inline-flex items-center gap-2"><Sparkles className="w-4 h-4" /> Smit Sir Commerce Premium</span>
            <h1 className="text-4xl sm:text-6xl mt-5 leading-tight" style={{ fontFamily: 'var(--font-serif)', color: 'var(--ink)', letterSpacing: '-.045em' }}>
              Study deeper. Practise harder. <span style={{ color: 'var(--gold)' }}>Pay only once.</span>
            </h1>
            <p className="text-lg mt-5 max-w-2xl leading-8" style={{ color: 'var(--muted)' }}>
              Free notes and Easy–Moderate quizzes stay free. Premium is for students who want the advanced CBSE Economics practice and detailed chapter guides.
            </p>

            <div className="grid sm:grid-cols-2 gap-4 mt-8">
              {benefits.map(({ icon: Icon, title, text }) => (
                <article key={title} className="card-paper p-5">
                  <Icon className="w-6 h-6" style={{ color: 'var(--gold)' }} />
                  <h2 className="text-lg font-black mt-3">{title}</h2>
                  <p className="text-sm mt-2 leading-6" style={{ color: 'var(--muted)' }}>{text}</p>
                </article>
              ))}
            </div>

            <div className="rounded-2xl p-5 mt-6" style={{ background: '#fff', border: '1px solid var(--border)' }}>
              <h2 className="font-black">What remains free?</h2>
              <div className="grid sm:grid-cols-2 gap-3 mt-4 text-sm">
                {['Easy quizzes', 'Moderate quizzes', 'Published free notes', 'Answer explanations in free levels'].map((item) => (
                  <div key={item} className="flex items-center gap-2"><Check className="w-4 h-4" style={{ color: '#2f6b3a' }} /> {item}</div>
                ))}
              </div>
            </div>
          </div>

          <aside className="card-paper p-5 sm:p-7 lg:sticky lg:top-24">
            <div className="flex items-start justify-between gap-4">
              <div><span className="text-sm font-black" style={{ color: 'var(--gold)' }}>LIFETIME PREMIUM</span><div className="text-5xl font-black mt-2">₹999</div><p className="text-sm mt-1" style={{ color: 'var(--muted)' }}>One-time payment · No subscription</p></div>
              <Crown className="w-10 h-10" style={{ color: 'var(--gold)' }} />
            </div>

            {!hasAccess && (
              <>
                <div className="rounded-2xl mt-6 p-3" style={{ background: '#fff', border: '1px solid var(--border)' }}>
                  <img
                    src="/premium-payment-qr.jpg"
                    alt="UPI QR for Smit Sir Commerce ₹999 Premium"
                    width="971"
                    height="975"
                    loading="eager"
                    className="w-full h-auto rounded-xl"
                    style={{ maxHeight: '360px', objectFit: 'contain' }}
                  />
                </div>
                <a href="/premium-payment-qr.jpg" download="Smit-Sir-Premium-QR.jpg" className="btn-secondary w-full mt-3">Download payment QR</a>
                <ol className="mt-5 space-y-3 text-sm leading-6" style={{ color: 'var(--charcoal)' }}>
                  <li><strong>1.</strong> Sign in with the account that should receive Premium.</li>
                  <li><strong>2.</strong> Scan the QR and pay exactly ₹999. Confirm the recipient in your UPI app.</li>
                  <li><strong>3.</strong> Copy the successful payment's UTR/reference and submit it below.</li>
                  <li><strong>4.</strong> Premium unlocks after manual verification.</li>
                </ol>
              </>
            )}

            <div className="mt-6">
              {loading ? <div className="flex items-center justify-center gap-2 p-6"><Loader2 className="w-5 h-5 animate-spin" /> Loading account…</div> : <PaymentClaim user={user} isPremium={hasAccess} />}
            </div>

            <p className="text-xs mt-5 leading-5" style={{ color: 'var(--subtle)' }}>
              Premium currently covers the listed CBSE Economics digital resources. Personal tuition, live classes and future unlisted material are separate. Payment does not auto-unlock until verified.
            </p>
            <a
              href="https://wa.me/916353709585?text=Hello%20Smit%20Sir%2C%20I%20need%20help%20with%20the%20%E2%82%B9999%20Premium%20payment."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 w-full mt-4 text-sm font-bold"
              style={{ color: '#21663a' }}
            >
              <MessageCircle className="w-4 h-4" /> Need payment help?
            </a>
          </aside>
        </div>
      </section>

      <section className="page-container pb-16">
        <div className="card-paper p-6 sm:p-8">
          <div className="flex items-center gap-3"><HelpCircle className="w-6 h-6" style={{ color: 'var(--gold)' }} /><h2 className="text-2xl font-black">Before you pay</h2></div>
          <div className="grid md:grid-cols-3 gap-5 mt-5 text-sm leading-6">
            <div><strong>Is it automatic?</strong><p className="mt-1" style={{ color: 'var(--muted)' }}>No. Submit the UTR from your signed-in account and wait for manual verification.</p></div>
            <div><strong>Is tuition included?</strong><p className="mt-1" style={{ color: 'var(--muted)' }}>No. This ₹999 plan is for the listed digital Premium Economics resources.</p></div>
            <div><strong>Can I keep using free material?</strong><p className="mt-1" style={{ color: 'var(--muted)' }}>Yes. Free notes and Easy–Moderate quizzes remain available without buying Premium.</p></div>
          </div>
          <p className="text-xs mt-6" style={{ color: 'var(--subtle)' }}>By purchasing, you agree to the <Link to="/terms" className="underline">Terms</Link> and <Link to="/access-policy" className="underline">Access Policy</Link>.</p>
        </div>
      </section>
    </main>
  );
}
