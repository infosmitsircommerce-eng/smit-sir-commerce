import { useEffect, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ArrowRight, BadgeCheck, BookOpenCheck, Check, CheckCircle2, Crown, FileQuestion, FileText, GraduationCap, Layers3, LockKeyhole, MessageCircle, MonitorPlay, Presentation, ShieldCheck, Sparkles, X } from 'lucide-react';
import SEO from '../components/ui/SEO';
import PremiumQrImage from '../components/PremiumQrImage';
import { useAuth } from '../context/AuthContext';
import { trackEvent } from '../lib/analytics';

const WHATSAPP_NUMBER = '916353709585';
const PLANS = {
  199: { id: 'subject-pack-199', name: 'Subject Pack', price: 199, note: 'Choose one subject', features: ['Premium PDFs for one selected subject', 'Easy, Moderate, Hard & Extreme quizzes', 'Chapter-wise organised access', 'One-time payment for the selected pack'] },
  999: { id: 'complete-commerce-999', name: 'Complete Commerce', price: 999, note: 'Every subject. Every Premium resource.', features: ['All subjects Premium notes and PDFs', 'All subjects quizzes — every difficulty', 'Previous 5 years’ question papers', 'Exclusive chapter PPT presentations', 'Premium test series and Exam Mode', 'Worked numericals and answer explanations', 'Revision sheets and important-question sets', 'New Premium resources added to this plan'] },
};
const SUBJECTS = [
  { title: 'Economics', meta: 'Microeconomics · Macroeconomics · Indian Economy', items: ['Chapter-wise Premium notes', 'Hard & Extreme quizzes', 'Worked concept questions'], icon: GraduationCap },
  { title: 'Accountancy', meta: 'CBSE + GSEB · Class 11 & 12', items: ['Detailed chapter PDFs', 'Worked numericals', 'Board-pattern practice'], icon: BookOpenCheck },
  { title: 'Business Studies / OCM', meta: 'CBSE Business Studies + GSEB BA (OCM)', items: ['Complete subject notes', 'Case-study questions', 'Chapter quizzes'], icon: Layers3 },
  { title: 'Exam Library', meta: 'Practice built for revision and boards', items: ['Last 5 years’ papers', 'Premium test series', 'Important-question sets'], icon: FileQuestion },
  { title: 'Premium PPT Library', meta: 'Clean, visual chapter presentations', items: ['Concept PPTs', 'Classroom-ready slides', 'Quick revision decks'], icon: Presentation },
  { title: 'Smart Study Tools', meta: 'Practice, review and improve', items: ['Exam Mode', 'Answer explanations', 'Revision sheets'], icon: MonitorPlay },
];

function PaymentModal({ plan, initialResource, displayName, user, onClose }) {
  const dialogRef = useRef(null);
  const [name, setName] = useState(displayName || '');
  const [mobile, setMobile] = useState('');
  const [utr, setUtr] = useState('');
  const [subject, setSubject] = useState(initialResource || 'Economics');
  const [error, setError] = useState('');
  useEffect(() => {
    const dialog = dialogRef.current;
    const oldOverflow = document.body.style.overflow;
    dialog?.showModal();
    document.body.style.overflow = 'hidden';
    void trackEvent('manual_premium_payment_open', { plan: plan.id, value: plan.price }, user?.id || null);
    return () => { if (dialog?.open) dialog.close(); document.body.style.overflow = oldOverflow; };
  }, [plan.id, plan.price, user?.id]);

  function continueToWhatsApp(event) {
    event.preventDefault();
    const cleanMobile = mobile.replace(/\D/g, '');
    const cleanUtr = utr.trim().replace(/\s+/g, '');
    if (name.trim().length < 2) return setError('Please enter the student name.');
    if (!/^[6-9]\d{9}$/.test(cleanMobile)) return setError('Please enter a valid 10-digit mobile number.');
    if (!/^[A-Za-z0-9]{8,22}$/.test(cleanUtr)) return setError('Please enter the 8–22 character UTR / transaction ID.');
    const chosen = plan.price === 199 ? subject : 'All subjects';
    const account = user?.email ? `\nLogin email: ${user.email}` : '';
    const message = `Hello Smit Sir, I have paid for Premium access.\n\nPlan: ${plan.name} — ₹${plan.price}\nSubject: ${chosen}\nStudent name: ${name.trim()}\nMobile: ${cleanMobile}\nUTR / Transaction ID: ${cleanUtr}${account}\n\nPlease verify my payment and activate access.`;
    void trackEvent('manual_premium_whatsapp_continue', { plan: plan.id, value: plan.price }, user?.id || null);
    window.location.href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  }

  return <dialog ref={dialogRef} aria-labelledby="payment-title" onCancel={e => { e.preventDefault(); onClose(); }} onClick={e => { if (e.target === e.currentTarget) onClose(); }} className="rounded-[1.75rem] p-0 border-0" style={{ width: 'min(920px, calc(100vw - 20px))', maxHeight: 'calc(100dvh - 20px)', background: '#fff', color: '#172033', boxShadow: '0 28px 100px rgba(8,18,40,.32)' }}>
    <div className="grid md:grid-cols-[.86fr_1.14fr] overflow-y-auto" style={{ maxHeight: 'calc(100dvh - 20px)' }}>
      <section className="p-5 sm:p-7 text-center" style={{ background: 'linear-gradient(160deg,#fff7db,#f8fbff)' }}>
        <div className="flex items-center justify-between gap-3 text-left"><span className="text-xs font-black tracking-[.13em]" style={{ color: '#8b6418' }}>STEP 1 · SCAN & PAY</span><button type="button" onClick={onClose} aria-label="Close payment" className="md:hidden w-10 h-10 rounded-full grid place-items-center" style={{ background: '#fff', border: '1px solid #e7dfce' }}><X className="w-5 h-5" /></button></div>
        <h2 id="payment-title" className="text-2xl sm:text-3xl font-black mt-3">Pay ₹{plan.price}</h2>
        <p className="text-sm mt-2" style={{ color: 'var(--muted)' }}>{plan.name} · one-time payment</p>
        <div className="bg-white rounded-3xl p-3 mt-5 mx-auto" style={{ width: 'min(100%, 300px)', border: '1px solid #ead7a3', boxShadow: '0 14px 35px rgba(70,52,15,.08)' }}><PremiumQrImage src="/premium-payment-qr.jpg" alt={`UPI QR code to pay ₹${plan.price} for ${plan.name}`} className="w-full aspect-square object-contain rounded-2xl" /></div>
        <p className="text-xs leading-5 mt-4" style={{ color: 'var(--muted)' }}>Pay the exact amount, then copy the UTR / transaction ID from your payment app.</p>
      </section>
      <form onSubmit={continueToWhatsApp} className="p-5 sm:p-7 md:p-8">
        <div className="hidden md:flex justify-end"><button type="button" onClick={onClose} aria-label="Close payment" className="w-10 h-10 rounded-full grid place-items-center" style={{ background: '#f5f2eb' }}><X className="w-5 h-5" /></button></div>
        <span className="text-xs font-black tracking-[.13em]" style={{ color: '#8b6418' }}>STEP 2 · SEND PAYMENT DETAILS</span>
        <h3 className="text-2xl font-black mt-3">Enter UTR and continue</h3>
        <p className="text-sm leading-6 mt-2" style={{ color: 'var(--muted)' }}>WhatsApp opens with your details filled. Access activates only after manual payment verification.</p>
        {plan.price === 199 ? <label className="block text-sm font-bold mt-5">Choose your subject<select value={subject} onChange={e => setSubject(e.target.value)} className="input-field w-full mt-2"><option>Economics</option><option>Accountancy</option><option>Business Studies / OCM</option></select></label> : null}
        <label className="block text-sm font-bold mt-4">Student name<input value={name} onChange={e => setName(e.target.value)} className="input-field w-full mt-2" placeholder="Your full name" autoComplete="name" /></label>
        <label className="block text-sm font-bold mt-4">WhatsApp number<input value={mobile} onChange={e => setMobile(e.target.value.replace(/\D/g, '').slice(0, 10))} className="input-field w-full mt-2" inputMode="numeric" maxLength={10} placeholder="10-digit mobile number" autoComplete="tel" /></label>
        <label className="block text-sm font-bold mt-4">UTR / transaction ID<input value={utr} onChange={e => setUtr(e.target.value)} className="input-field w-full mt-2 uppercase" placeholder="Example: 426512345678" autoCapitalize="characters" /></label>
        {error ? <p role="alert" className="text-sm font-bold mt-4" style={{ color: '#b42318' }}>{error}</p> : null}
        <button className="w-full mt-5 rounded-xl px-5 py-3.5 font-black inline-flex items-center justify-center gap-2" style={{ background: '#1f9d55', color: '#fff' }}><MessageCircle className="w-5 h-5" /> Send details on WhatsApp</button>
        <div className="flex gap-2 mt-4 text-xs leading-5" style={{ color: 'var(--muted)' }}><ShieldCheck className="w-4 h-4 shrink-0 mt-0.5" /><span>Never share a UPI PIN or OTP. Only the UTR / transaction ID is required.</span></div>
      </form>
    </div>
  </dialog>;
}

function PlanCard({ plan, featured, onChoose }) {
  return <article className="relative rounded-[1.75rem] p-6 sm:p-7 flex flex-col" style={{ background: featured ? 'linear-gradient(145deg,#0b1834,#172b55)' : '#fff', color: featured ? '#fff' : 'var(--ink)', border: featured ? '1px solid #263f70' : '1px solid #e7e0d4', boxShadow: featured ? '0 24px 65px rgba(13,30,62,.22)' : '0 14px 38px rgba(35,31,25,.07)' }}>
    {featured ? <span className="absolute -top-3 left-6 rounded-full px-4 py-1.5 text-xs font-black" style={{ background: '#f2c75b', color: '#172033' }}>BEST VALUE</span> : null}
    <div className="flex items-start justify-between gap-4 mt-1"><div><span className="text-xs font-black tracking-[.12em]" style={{ color: featured ? '#f2c75b' : '#8b6418' }}>{plan.price === 199 ? 'ONE SUBJECT' : 'COMPLETE ACCESS'}</span><h2 className="text-2xl font-black mt-2">{plan.name}</h2></div>{featured ? <Crown className="w-8 h-8" style={{ color: '#f2c75b' }} /> : <BookOpenCheck className="w-8 h-8" style={{ color: 'var(--gold)' }} />}</div>
    <div className="mt-5"><span className="text-5xl font-black">₹{plan.price}</span><span className="text-sm font-bold ml-2" style={{ color: featured ? '#c8d2e7' : 'var(--muted)' }}>one time</span></div>
    <p className="text-sm mt-2" style={{ color: featured ? '#d7dfef' : 'var(--muted)' }}>{plan.note}</p>
    <div className="space-y-3 mt-6 flex-1">{plan.features.map(feature => <div key={feature} className="flex gap-2.5 text-sm font-semibold leading-5"><Check className="w-4 h-4 mt-0.5 shrink-0" style={{ color: featured ? '#f2c75b' : '#23834a' }} /><span>{feature}</span></div>)}</div>
    <button type="button" onClick={() => onChoose(plan)} className="w-full rounded-xl px-5 py-3.5 font-black mt-7 inline-flex items-center justify-center gap-2" style={{ background: featured ? '#f2c75b' : '#17284b', color: featured ? '#172033' : '#fff' }}>Choose ₹{plan.price} plan <ArrowRight className="w-4 h-4" /></button>
  </article>;
}

export default function Premium() {
  const { user, isPremium, legacyPremium, hasMegaPremium, isAdmin, displayName, loading } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedPlan, setSelectedPlan] = useState(null);
  const fullAccess = isPremium || legacyPremium || hasMegaPremium || isAdmin;
  const requestedResource = searchParams.get('resource') || '';
  const requestedPlan = searchParams.get('plan');
  useEffect(() => { if (requestedPlan && PLANS[requestedPlan]) setSelectedPlan(PLANS[requestedPlan]); }, [requestedPlan]);
  function openPayment(plan) { setSelectedPlan(plan); setSearchParams({ plan: String(plan.price) }); }
  function closePayment() { setSelectedPlan(null); setSearchParams({}); }
  const statusText = loading ? 'Checking access…' : fullAccess ? 'Premium active' : user ? 'Free account' : 'Browse without login';

  return <main className="min-h-screen" style={{ background: 'linear-gradient(180deg,#fffaf0 0%,#f7f9fc 46%,#fff 100%)' }}>
    <SEO title="Premium Commerce Notes, PDFs & Quizzes — Smit Sir Commerce" description="Compare free, ₹199 Subject Pack and ₹999 Complete Commerce access. Preview every Premium category before payment." path="/premium" />
    <section className="page-container pt-10 pb-14 sm:pt-14 sm:pb-20 max-w-6xl">
      <div className="flex items-center justify-between gap-3 mb-7"><span className="eyebrow inline-flex items-center gap-2"><Sparkles className="w-4 h-4" /> Premium</span><span className="rounded-full px-3 py-2 text-xs font-black" style={{ background: fullAccess ? '#e9f8ee' : '#fff', color: fullAccess ? '#21663a' : '#6b6257', border: '1px solid #e7e0d4' }}>{statusText}</span></div>
      <div className="max-w-3xl"><h1 className="text-4xl sm:text-6xl font-black leading-[1.04]" style={{ letterSpacing: '-.045em', color: '#14213d' }}>Choose what you need.<br /><span style={{ color: '#b8872f' }}>See everything before you pay.</span></h1><p className="text-base sm:text-lg leading-8 mt-5" style={{ color: 'var(--muted)' }}>Free resources stay free. Upgrade only when you want Premium PDFs, advanced quizzes and complete exam preparation.</p></div>
      <div className="grid sm:grid-cols-3 gap-3 mt-8">
        <div className="rounded-2xl p-4" style={{ background: '#fff', border: '1px solid #e7e0d4' }}><div className="text-xs font-black tracking-wider" style={{ color: '#23834a' }}>FREE</div><div className="font-black mt-1">Limited free resources</div><p className="text-xs mt-1" style={{ color: 'var(--muted)' }}>Notes, PDFs and Easy/Moderate practice where marked Free.</p></div>
        <div className="rounded-2xl p-4" style={{ background: '#fff7df', border: '1px solid #ead39a' }}><div className="text-xs font-black tracking-wider" style={{ color: '#8b6418' }}>₹199</div><div className="font-black mt-1">PDFs + quizzes</div><p className="text-xs mt-1" style={{ color: 'var(--muted)' }}>Choose one subject and unlock its Premium pack.</p></div>
        <div className="rounded-2xl p-4 text-white" style={{ background: '#14213d', border: '1px solid #263858' }}><div className="text-xs font-black tracking-wider" style={{ color: '#f2c75b' }}>₹999</div><div className="font-black mt-1">Complete Commerce access</div><p className="text-xs mt-1" style={{ color: '#ccd5e5' }}>All subjects, quizzes, papers, PPTs and Premium tools.</p></div>
      </div>
      {fullAccess ? <section className="rounded-3xl p-5 sm:p-6 mt-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4" style={{ background: '#eaf8ef', border: '1px solid #bfe0c7' }}><div className="flex gap-3"><CheckCircle2 className="w-7 h-7 shrink-0" style={{ color: '#21663a' }} /><div><h2 className="font-black" style={{ color: '#174d2a' }}>Your Premium access is active</h2><p className="text-sm mt-1" style={{ color: '#356846' }}>Open protected study libraries from My Purchases.</p></div></div><Link to="/my-purchases" className="btn-primary whitespace-nowrap">Open My Purchases</Link></section> : null}

      <section aria-labelledby="plans-heading" className="mt-12"><span className="text-xs font-black tracking-[.13em]" style={{ color: '#8b6418' }}>SIMPLE PRICING</span><h2 id="plans-heading" className="text-3xl sm:text-4xl font-black mt-2">Two plans. No confusing checkout.</h2><div className="grid lg:grid-cols-2 gap-5 mt-7"><PlanCard plan={PLANS[199]} onChoose={openPayment} /><PlanCard plan={PLANS[999]} featured onChoose={openPayment} /></div></section>

      <section aria-labelledby="library-heading" className="mt-16">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4"><div><span className="text-xs font-black tracking-[.13em]" style={{ color: '#8b6418' }}>VISIBLE, BUT PROTECTED</span><h2 id="library-heading" className="text-3xl sm:text-4xl font-black mt-2">Explore the Premium library</h2><p className="mt-3" style={{ color: 'var(--muted)' }}>You can see what exists. Actual files stay locked until access is verified.</p></div><div className="inline-flex items-center gap-2 text-sm font-bold"><LockKeyhole className="w-4 h-4" style={{ color: 'var(--gold)' }} /> Files remain protected</div></div>
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4 mt-7">{SUBJECTS.map(({ title, meta, items, icon: Icon }) => <article key={title} className="rounded-3xl p-5 sm:p-6" style={{ background: '#fff', border: '1px solid #e7e0d4', boxShadow: '0 12px 34px rgba(35,31,25,.055)' }}>
          <div className="flex items-start justify-between gap-3"><div className="w-11 h-11 rounded-2xl grid place-items-center" style={{ background: '#fff5d8', color: '#8b6418' }}><Icon className="w-5 h-5" /></div><span className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-black" style={{ background: '#14213d', color: '#f2c75b' }}><LockKeyhole className="w-3 h-3" /> PREMIUM</span></div>
          <h3 className="text-xl font-black mt-4">{title}</h3><p className="text-sm mt-1 leading-6" style={{ color: 'var(--muted)' }}>{meta}</p><div className="space-y-2 mt-4">{items.map(item => <div key={item} className="flex items-center gap-2 text-sm font-semibold"><FileText className="w-4 h-4 shrink-0" style={{ color: '#b8872f' }} />{item}</div>)}</div>
          <button type="button" onClick={() => openPayment(PLANS[999])} className="w-full rounded-xl px-4 py-3 font-black mt-5 inline-flex justify-center items-center gap-2" style={{ background: '#f5f2eb', color: '#172033' }}><LockKeyhole className="w-4 h-4" /> Unlock this library</button>
        </article>)}</div>
      </section>

      <section className="rounded-[1.75rem] p-6 sm:p-8 mt-14" style={{ background: '#fff', border: '1px solid #e7e0d4' }}><div className="grid md:grid-cols-3 gap-6">
        <div><BadgeCheck className="w-6 h-6" style={{ color: '#23834a' }} /><h3 className="font-black mt-3">1. Choose a plan</h3><p className="text-sm leading-6 mt-2" style={{ color: 'var(--muted)' }}>Pick one subject for ₹199 or complete access for ₹999.</p></div>
        <div><FileText className="w-6 h-6" style={{ color: '#b8872f' }} /><h3 className="font-black mt-3">2. Scan and enter UTR</h3><p className="text-sm leading-6 mt-2" style={{ color: 'var(--muted)' }}>Pay through the QR and copy your transaction ID.</p></div>
        <div><MessageCircle className="w-6 h-6" style={{ color: '#1f9d55' }} /><h3 className="font-black mt-3">3. Send on WhatsApp</h3><p className="text-sm leading-6 mt-2" style={{ color: 'var(--muted)' }}>Your details open in WhatsApp; access is given after verification.</p></div>
      </div></section>
    </section>
    {selectedPlan ? <PaymentModal plan={selectedPlan} initialResource={requestedResource} displayName={displayName} user={user} onClose={closePayment} /> : null}
  </main>;
}
