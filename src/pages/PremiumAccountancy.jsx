import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  BadgeCheck,
  BookOpenCheck,
  Calculator,
  Check,
  Crown,
  Download,
  Eye,
  FileText,
  LibraryBig,
  Loader2,
  LockKeyhole,
  ShieldCheck,
  Sparkles,
  Table2,
  X,
} from 'lucide-react';
import SEO from '../components/ui/SEO';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import {
  GSEB_11_ACCOUNTANCY_PRODUCT_ID,
  gseb11AccountancyPremiumBenefits,
  gseb11AccountancyPremiumBook,
  gseb11AccountancyPremiumMaterials,
} from '../data/gsebAccountancyPremium';
import { trackEvent } from '../lib/analytics';

const PATH = '/premium/accountancy';
const BASE = 'https://www.smitsircommerce.in';

const featureCards = [
  { icon: Table2, title: 'Accounting-format tables', text: 'Journal, Cash Book, Subsidiary Books, Ledger and Trial Balance are shown in proper accounting formats.' },
  { icon: Calculator, title: 'Worked numericals', text: 'Practical chapters explain the working, logic and final answer instead of giving answer-only practice.' },
  { icon: BookOpenCheck, title: 'Exam-ready explanation', text: 'Concepts, illustrations, common mistakes, questions, MCQs and revision are organised chapter by chapter.' },
];

function AccessDialog({ resource, user, onClose }) {
  const ref = useRef(null);

  useEffect(() => {
    const dialog = ref.current;
    const previous = document.body.style.overflow;
    dialog?.showModal();
    document.body.style.overflow = 'hidden';
    return () => {
      dialog?.close();
      document.body.style.overflow = previous;
    };
  }, []);

  return (
    <dialog
      ref={ref}
      className="rounded-3xl border-0 p-0"
      style={{ width: 'min(470px, calc(100vw - 24px))', background: '#fffaf0', color: '#172033', boxShadow: '0 30px 100px rgba(0,0,0,.32)' }}
      onCancel={(event) => { event.preventDefault(); onClose(); }}
      onClick={(event) => { if (event.target === event.currentTarget) onClose(); }}
    >
      <div className="p-6 sm:p-7">
        <div className="flex items-start justify-between gap-4">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: '#fff0bd', color: '#8a6012' }}><LockKeyhole className="w-6 h-6" /></div>
          <button type="button" onClick={onClose} className="btn-secondary" aria-label="Close"><X className="w-4 h-4" /></button>
        </div>
        <span className="eyebrow inline-flex mt-5">PREMIUM RESOURCE</span>
        <h2 className="text-2xl sm:text-3xl mt-3" style={{ fontFamily: 'var(--font-serif)' }}>This PDF is visible, but protected.</h2>
        <p className="mt-3 font-bold">{resource.title}</p>
        <p className="mt-3 text-sm leading-6" style={{ color: 'var(--muted)' }}>The chapter list is public so students can see exactly what Premium includes. The actual PDF opens only after the signed-in account has Premium access.</p>
        <div className="rounded-2xl p-4 mt-5" style={{ background: '#edf9f0', border: '1px solid #cbe5d1' }}>
          <div className="flex gap-3"><ShieldCheck className="w-5 h-5 shrink-0" style={{ color: '#21663a' }} /><p className="text-sm leading-6"><strong>No public PDF link is exposed from this page.</strong> Access is checked against the student account before the document is served.</p></div>
        </div>
        <div className="grid gap-3 mt-5">
          {!user ? <Link to={`/login?next=${encodeURIComponent(PATH)}`} className="btn-primary text-center">Sign in to check access</Link> : <a href="/my-purchases.html" className="btn-primary text-center">Check My Purchases</a>}
          <Link to="/premium" className="btn-secondary text-center">See Premium access information</Link>
          <Link to="/gseb-class-11-accountancy-notes" className="btn-secondary text-center">Use free concept notes instead</Link>
        </div>
      </div>
    </dialog>
  );
}

export default function PremiumAccountancy() {
  const { user, loading } = useAuth();
  const [busy, setBusy] = useState('');
  const [viewer, setViewer] = useState(null);
  const [locked, setLocked] = useState(null);
  const [error, setError] = useState('');
  const request = useRef(null);

  const resources = useMemo(() => [
    { ...gseb11AccountancyPremiumBook, isBook: true },
    ...gseb11AccountancyPremiumMaterials.map((item) => ({ ...item, title: `Chapter ${item.chapterNumber} - ${item.title}` })),
  ], []);

  useEffect(() => () => request.current?.abort(), []);
  useEffect(() => () => { if (viewer?.url) URL.revokeObjectURL(viewer.url); }, [viewer]);
  useEffect(() => {
    request.current?.abort();
    if (viewer?.url) URL.revokeObjectURL(viewer.url);
    setViewer(null);
    setLocked(null);
    setError('');
  }, [user?.id]);

  async function openResource(resource) {
    setError('');
    if (!user) {
      setLocked(resource);
      void trackEvent('accountancy_premium_locked_click', { resourceKey: resource.resourceKey, reason: 'signed_out' });
      return;
    }

    request.current?.abort();
    const controller = new AbortController();
    request.current = controller;
    setBusy(resource.resourceKey);

    try {
      const { data } = await supabase.auth.getSession();
      const token = data.session?.access_token;
      if (!token) {
        setLocked(resource);
        return;
      }
      const response = await fetch('/api/premium-accountancy', {
        method: 'POST',
        signal: controller.signal,
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ resourceKey: resource.resourceKey }),
      });
      if (response.status === 401 || response.status === 403) {
        setLocked(resource);
        void trackEvent('accountancy_premium_locked_click', { resourceKey: resource.resourceKey, reason: 'no_entitlement' }, user.id);
        return;
      }
      if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        throw new Error(body.error || 'Unable to open this Premium PDF.');
      }
      if (!response.headers.get('content-type')?.includes('application/pdf')) throw new Error('The Premium PDF could not be loaded safely.');
      const blob = await response.blob();
      if (controller.signal.aborted) return;
      if (viewer?.url) URL.revokeObjectURL(viewer.url);
      const url = URL.createObjectURL(blob);
      setViewer({ ...resource, url });
      void trackEvent('accountancy_premium_open', { resourceKey: resource.resourceKey, pages: resource.pages }, user.id);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (problem) {
      if (!controller.signal.aborted) setError(problem.message || 'Unable to open this resource.');
    } finally {
      if (!controller.signal.aborted) setBusy('');
    }
  }

  if (loading) return <main className="min-h-screen flex items-center justify-center"><Loader2 className="w-7 h-7 animate-spin" /></main>;

  if (viewer) return (
    <main className="min-h-screen" style={{ background: '#f7f5ef' }}>
      <SEO title={`${viewer.title} — Premium Accountancy`} description="Protected GSEB Class 11 Accountancy Premium resource." path={PATH} noindex />
      <div className="page-container py-7 max-w-6xl">
        <button type="button" className="btn-secondary" onClick={() => { URL.revokeObjectURL(viewer.url); setViewer(null); }}>← Back to Premium library</button>
        <div className="card-paper p-5 sm:p-7 mt-5">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-5">
            <div><span className="eyebrow"><Crown className="w-4 h-4" /> PREMIUM ACCESS VERIFIED</span><h1 className="text-2xl sm:text-4xl mt-3" style={{ fontFamily: 'var(--font-serif)' }}>{viewer.title}</h1><p className="mt-2" style={{ color: 'var(--muted)' }}>{viewer.pages} pages · GSEB English Medium · Standard 11 Accountancy</p></div>
            <a href={viewer.url} download className="btn-primary inline-flex items-center justify-center gap-2 shrink-0"><Download className="w-4 h-4" /> Download PDF</a>
          </div>
          <iframe src={viewer.url} title={viewer.title} className="w-full mt-6 rounded-2xl border bg-white" style={{ height: '78vh', minHeight: 520 }} />
        </div>
      </div>
    </main>
  );

  return (
    <main style={{ background: 'linear-gradient(180deg,#09152f 0,#111f3f 32%,#f7f4ec 32%,#f7f4ec 100%)' }}>
      <SEO
        title="GSEB Class 11 Accountancy Premium — Rebuild & Free Notes"
        description="See the GSEB Class 11 Accountancy Premium catalogue and free concept notes. The protected numerical book is being rebuilt and synced before it is presented as live."
        path={PATH}
        structuredData={{
          '@context': 'https://schema.org',
          '@type': 'LearningResource',
          name: 'GSEB Std. 11 Accountancy Part 1 Premium Complete Book',
          educationalLevel: 'GSEB Standard 11',
          learningResourceType: 'Premium study material',
          isAccessibleForFree: false,
          provider: { '@type': 'Organization', name: 'Smit Sir Commerce', url: BASE },
        }}
      />

      <section className="page-container pt-10 sm:pt-16 pb-16 text-white max-w-6xl">
        <nav className="text-xs sm:text-sm opacity-75"><Link to="/" className="hover:underline">Home</Link> / <Link to="/gseb-class-11-accountancy-notes" className="hover:underline">GSEB 11 Accountancy</Link> / Premium Part 1</nav>
        <div className="grid lg:grid-cols-[1.15fr_.85fr] gap-8 items-center mt-8">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-black tracking-wider" style={{ background: '#f4cb61', color: '#18213c' }}><Crown className="w-4 h-4" /> PREMIUM COMPLETE EDITION</span>
            <h1 className="text-4xl sm:text-6xl mt-5 leading-[1.03]" style={{ fontFamily: 'var(--font-serif)', letterSpacing: '-.04em' }}>Std. 11 Accountancy<br/><span style={{ color: '#f3c84d' }}>Part 1 Premium Book</span></h1>
            <p className="text-base sm:text-lg leading-8 mt-5 max-w-3xl" style={{ color: '#d8dfef' }}>GSEB English Medium. The Part 1 Premium catalogue is mapped, but the protected numerical book is still being rebuilt and synced. Free concept notes remain available while the Premium files are prepared.</p>
            <div className="flex flex-wrap gap-3 mt-7"><a href="#premium-chapters" className="btn-primary inline-flex items-center gap-2">See all 10 chapters <ArrowRight className="w-4 h-4" /></a><Link to="/gseb-class-11-accountancy-notes" className="btn-secondary inline-flex items-center gap-2"><LibraryBig className="w-4 h-4" /> Use free notes now</Link></div>
          </div>

          <aside className="rounded-3xl p-6 sm:p-7" style={{ background: 'linear-gradient(145deg,#fff9e7,#f7e6b4)', color: '#172033', boxShadow: '0 24px 70px rgba(0,0,0,.25)' }}>
            <div className="flex items-center justify-between"><div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ background: '#17284b', color: '#f3c84d' }}><FileText className="w-7 h-7" /></div><BadgeCheck className="w-8 h-8" style={{ color: '#247447' }} /></div>
            <span className="text-xs font-black tracking-[.16em] mt-5 block" style={{ color: '#8a6012' }}>PART 1 • COMPLETE</span>
            <div className="text-4xl font-black mt-2">Rebuild in progress</div>
            <p className="text-sm mt-2 leading-6" style={{ color: '#5d6471' }}>The chapter catalogue is visible for transparency. Protected PDFs will be activated only after the actual files are synced and verified.</p>
            <div className="grid grid-cols-2 gap-3 mt-5"><div className="rounded-xl bg-white/80 p-4"><strong className="text-2xl">10</strong><span className="block text-xs mt-1">chapters mapped</span></div><div className="rounded-xl bg-white/80 p-4"><strong className="text-2xl">Free</strong><span className="block text-xs mt-1">concept notes available now</span></div></div>
          </aside>
        </div>
      </section>

      <section className="page-container max-w-6xl -mt-3 pb-8">
        <div className="grid md:grid-cols-3 gap-4">{featureCards.map(({ icon: Icon, title, text }) => <article key={title} className="card-paper p-5 sm:p-6"><Icon className="w-6 h-6" style={{ color: 'var(--gold)' }} /><h2 className="font-black text-lg mt-3">{title}</h2><p className="text-sm leading-6 mt-2" style={{ color: 'var(--muted)' }}>{text}</p></article>)}</div>
      </section>

      <section className="page-container max-w-6xl py-9">
        <div className="card-paper p-6 sm:p-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div><span className="eyebrow">WHAT PREMIUM ADDS</span><h2 className="text-3xl sm:text-4xl mt-3" style={{ fontFamily: 'var(--font-serif)' }}>Premium should be genuinely different from the free notes.</h2><p className="mt-3 leading-7 max-w-3xl" style={{ color: 'var(--muted)' }}>The free Accountancy collection remains your concept-first foundation. The deeper Premium numerical layer is being rebuilt and will only be marked live after the protected files are synced and tested.</p></div>
            <Link to="/gseb-class-11-accountancy-notes" className="btn-secondary shrink-0">Compare with free notes</Link>
          </div>
          <div className="grid sm:grid-cols-2 gap-3 mt-7">{gseb11AccountancyPremiumBenefits.map((item) => <div key={item} className="flex gap-3 rounded-xl p-4" style={{ background: '#fffaf0', border: '1px solid #eadcb8' }}><Check className="w-5 h-5 shrink-0 mt-0.5" style={{ color: '#247447' }} /><span className="text-sm font-semibold leading-6">{item}</span></div>)}</div>
        </div>
      </section>

      <section id="premium-chapters" className="page-container max-w-6xl py-10">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4"><div><span className="eyebrow">THE EXACT LIBRARY</span><h2 className="text-3xl sm:text-5xl mt-3" style={{ fontFamily: 'var(--font-serif)' }}>See everything before you unlock.</h2><p className="mt-3" style={{ color: 'var(--muted)' }}>Every chapter remains visible for transparency. Protected PDFs are activated only after their actual files are synced and verified.</p></div><div className="inline-flex items-center gap-2 text-sm font-bold"><ShieldCheck className="w-5 h-5" style={{ color: '#247447' }} /> Account-protected PDFs</div></div>

        {error ? <div className="rounded-2xl p-4 mt-6" role="alert" style={{ background: '#fff0ef', border: '1px solid #efc5c1', color: '#8d2520' }}>{error}</div> : null}

        <article className="rounded-3xl p-6 sm:p-8 mt-7" style={{ background: 'linear-gradient(135deg,#101e3e,#1d315b)', color: 'white', boxShadow: '0 18px 55px rgba(9,21,47,.18)' }}>
          <div className="grid lg:grid-cols-[1fr_auto] gap-6 items-center"><div><span className="inline-flex items-center gap-2 text-xs font-black tracking-wider" style={{ color: '#f3c84d' }}><Sparkles className="w-4 h-4" /> COMPLETE-BOOK OPTION</span><h3 className="text-2xl sm:text-3xl mt-3">Complete-book edition is being rebuilt</h3><p className="mt-3 leading-7" style={{ color: '#d8dfef' }}>The complete-book option will return after the rebuilt chapter files are synced and pass the same quality and access checks.</p></div><Link to="/gseb-class-11-accountancy-notes" className="btn-primary min-w-[210px] inline-flex items-center justify-center gap-2"><Eye className="w-4 h-4" /> Open free concept notes</Link></div>
        </article>

        <div className="grid md:grid-cols-2 gap-4 mt-6">
          {gseb11AccountancyPremiumMaterials.map((chapter) => (
            <article key={chapter.resourceKey} className="card-paper p-5 sm:p-6 flex flex-col">
              <div className="flex items-start justify-between gap-4"><div className="w-12 h-12 rounded-2xl flex items-center justify-center font-black" style={{ background: '#fff2c8', color: '#855c0d' }}>{String(chapter.chapterNumber).padStart(2, '0')}</div><span className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-black tracking-wider" style={{ background: '#17284b', color: '#f4cc62' }}><LockKeyhole className="w-3.5 h-3.5" /> PREMIUM</span></div>
              <h3 className="text-xl sm:text-2xl mt-4" style={{ fontFamily: 'var(--font-serif)' }}>{chapter.title}</h3>
              <p className="text-sm font-bold mt-2" style={{ color: 'var(--gold)' }}>{chapter.pages} pages</p>
              <div className="space-y-2 mt-4">{chapter.highlights.map((item) => <div key={item} className="flex gap-2 text-sm leading-5"><Check className="w-4 h-4 shrink-0 mt-0.5" style={{ color: '#247447' }} /><span>{item}</span></div>)}</div>
              <button type="button" onClick={() => openResource(chapter)} disabled={Boolean(busy)} className="btn-primary w-full mt-5 inline-flex items-center justify-center gap-2">{busy === chapter.resourceKey ? <><Loader2 className="w-4 h-4 animate-spin" /> Checking…</> : <><LockKeyhole className="w-4 h-4" /> Open / check Premium access</>}</button>
            </article>
          ))}
        </div>
      </section>

      <section className="page-container max-w-6xl py-10 pb-20">
        <div className="rounded-3xl p-7 sm:p-10 text-center" style={{ background: '#fff2c8', border: '1px solid #e8cf8a' }}><Crown className="w-9 h-9 mx-auto" style={{ color: '#8a6012' }} /><h2 className="text-3xl sm:text-4xl mt-4" style={{ fontFamily: 'var(--font-serif)' }}>Know what you are getting before you pay.</h2><p className="mt-3 max-w-2xl mx-auto leading-7" style={{ color: '#5d6471' }}>No mystery bundle. The exact 10 chapters and their page counts are visible above. Premium access controls only the actual documents.</p><div className="flex flex-wrap justify-center gap-3 mt-6">{!user ? <Link to={`/login?next=${encodeURIComponent(PATH)}`} className="btn-primary">Sign in to check access</Link> : <a href="/my-purchases.html" className="btn-primary">Open My Purchases</a>}<Link to="/premium" className="btn-secondary">Premium information</Link></div></div>
      </section>

      {locked ? <AccessDialog resource={locked} user={user} onClose={() => setLocked(null)} /> : null}
    </main>
  );
}
