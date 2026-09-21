import { useEffect, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  ArrowRight,
  BookOpenCheck,
  Check,
  Download,
  Eye,
  FileText,
  LibraryBig,
  Loader2,
  LockKeyhole,
  ShieldCheck,
  X,
} from 'lucide-react';
import SEO from '../components/ui/SEO';
import AccountancyPremiumPreview from '../components/premium/AccountancyPremiumPreview';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import {
  CBSE_12_ACCOUNTANCY_TOTAL_PAGES,
  cbse12AccountancyPartStats,
  cbse12AccountancyPremiumMaterials,
} from '../data/cbse12AccountancyPremium';
import { trackEvent } from '../lib/analytics';

const PATH = '/premium/cbse-12-accountancy';
const BASE = 'https://www.smitsircommerce.in';

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
      style={{ width: 'min(470px, calc(100vw - 24px))', background: '#fffdf8', color: '#172033', boxShadow: '0 28px 90px rgba(0,0,0,.28)' }}
      onCancel={(event) => { event.preventDefault(); onClose(); }}
      onClick={(event) => { if (event.target === event.currentTarget) onClose(); }}
    >
      <div className="p-6 sm:p-7">
        <div className="flex items-start justify-between gap-4">
          <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: '#f0eadc', color: '#172033' }}><LockKeyhole className="w-5 h-5" /></div>
          <button type="button" onClick={onClose} className="btn-secondary" aria-label="Close"><X className="w-4 h-4" /></button>
        </div>
        <span className="eyebrow inline-flex mt-5">PREMIUM ACCOUNTANCY</span>
        <h2 className="text-2xl sm:text-3xl mt-3" style={{ fontFamily: 'var(--font-serif)' }}>This chapter is protected.</h2>
        <p className="mt-3 font-bold">{resource.title}</p>
        <p className="mt-3 text-sm leading-6" style={{ color: 'var(--muted)' }}>The complete chapter list stays visible so students can see exactly what is included. The PDF itself opens only after the signed-in account has matching Premium access.</p>
        <div className="rounded-2xl p-4 mt-5" style={{ background: '#f3f7f4', border: '1px solid #d6e3da' }}>
          <div className="flex gap-3"><ShieldCheck className="w-5 h-5 shrink-0" style={{ color: '#21663a' }} /><p className="text-sm leading-6"><strong>No public PDF URL is exposed.</strong> Access is checked before the file is served.</p></div>
        </div>
        <div className="grid gap-3 mt-5">
          {!user ? <Link to={`/login?next=${encodeURIComponent(PATH)}`} className="btn-primary text-center">Sign in to check access</Link> : <Link to="/my-purchases" className="btn-primary text-center">Check My Purchases</Link>}
          <Link to="/premium" className="btn-secondary text-center">See everything in Premium</Link>
          <Link to="/study-material?board=CBSE&class=12&subject=Accountancy" className="btn-secondary text-center">Back to Class 12 Accountancy</Link>
        </div>
      </div>
    </dialog>
  );
}

function ChapterCard({ chapter, busy, selected, onOpen }) {
  return (
    <article
      id={chapter.resourceKey}
      className="card-paper p-5 sm:p-6 flex flex-col scroll-mt-28"
      style={selected ? { border: '1px solid rgba(184,135,47,.55)', boxShadow: '0 14px 34px rgba(23,32,51,.10)' } : undefined}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="w-12 h-12 rounded-2xl flex items-center justify-center font-black" style={{ background: '#f2eee5', color: '#172033' }}>{String(chapter.chapterNumber).padStart(2, '0')}</div>
        <span className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-black tracking-wider" style={{ background: '#172033', color: '#f4d486' }}><LockKeyhole className="w-3.5 h-3.5" /> PREMIUM</span>
      </div>
      <h3 className="text-xl sm:text-2xl mt-4" style={{ fontFamily: 'var(--font-serif)' }}>{chapter.title}</h3>
      <p className="text-sm font-bold mt-2" style={{ color: 'var(--gold)' }}>{chapter.pages} pages</p>
      <div className="space-y-2 mt-4">{chapter.highlights.map((item) => <div key={item} className="flex gap-2 text-sm leading-5"><Check className="w-4 h-4 shrink-0 mt-0.5" style={{ color: '#247447' }} /><span>{item}</span></div>)}</div>
      <div className="w-full mt-5 rounded-xl px-4 py-3 text-center text-sm font-black" style={{ background: '#fff3cd', color: '#805a14', border: '1px solid #ead39a' }}>
        Premium Master rebuild in progress
      </div>
    </article>
  );
}

export default function Cbse12AccountancyPremium() {
  const { user, loading } = useAuth();
  const [params] = useSearchParams();
  const requested = params.get('chapter') || '';
  const [busy, setBusy] = useState('');
  const [viewer, setViewer] = useState(null);
  const [locked, setLocked] = useState(null);
  const [error, setError] = useState('');
  const request = useRef(null);

  useEffect(() => () => request.current?.abort(), []);
  useEffect(() => () => { if (viewer?.url) URL.revokeObjectURL(viewer.url); }, [viewer]);
  useEffect(() => {
    if (!requested) return;
    window.setTimeout(() => document.getElementById(requested)?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 120);
  }, [requested]);
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
      void trackEvent('cbse12_accountancy_premium_locked_click', { resourceKey: resource.resourceKey, reason: 'signed_out' });
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
        body: JSON.stringify({ library: 'cbse12', resourceKey: resource.resourceKey }),
      });
      if (response.status === 401 || response.status === 403) {
        setLocked(resource);
        void trackEvent('cbse12_accountancy_premium_locked_click', { resourceKey: resource.resourceKey, reason: 'no_entitlement' }, user.id);
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
      void trackEvent('cbse12_accountancy_premium_open', { resourceKey: resource.resourceKey, pages: resource.pages }, user.id);
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
      <SEO title={`${viewer.title} — CBSE 12 Accountancy Premium`} description="Protected CBSE Class 12 Accountancy Premium resource." path={PATH} noindex />
      <div className="page-container py-7 max-w-6xl">
        <button type="button" className="btn-secondary" onClick={() => { URL.revokeObjectURL(viewer.url); setViewer(null); }}>← Back to Accountancy library</button>
        <div className="card-paper p-5 sm:p-7 mt-5">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-5">
            <div><span className="eyebrow">PREMIUM ACCESS VERIFIED</span><h1 className="text-2xl sm:text-4xl mt-3" style={{ fontFamily: 'var(--font-serif)' }}>{viewer.title}</h1><p className="mt-2" style={{ color: 'var(--muted)' }}>Part {viewer.part} · Chapter {viewer.chapterNumber} · {viewer.pages} pages · CBSE Class 12 Accountancy</p></div>
            <a href={viewer.url} download className="btn-primary inline-flex items-center justify-center gap-2 shrink-0"><Download className="w-4 h-4" /> Download PDF</a>
          </div>
          <iframe src={viewer.url} title={viewer.title} className="w-full mt-6 rounded-2xl border bg-white" style={{ height: '78vh', minHeight: 520 }} />
        </div>
      </div>
    </main>
  );

  return (
    <main style={{ background: '#f7f4ec' }}>
      <SEO
        title="CBSE Class 12 Accountancy Premium Notes — Parts I & II"
        description="Preview the new CBSE Class 12 Accountancy Premium Master standard with the full Financial Ratios sample. The protected chapter catalogue is being upgraded and synced chapter by chapter."
        path={PATH}
        structuredData={{
          '@context': 'https://schema.org',
          '@type': 'CollectionPage',
          name: 'CBSE Class 12 Accountancy Premium Library — Parts I & II',
          educationalLevel: 'CBSE Class 12',
          about: 'Accountancy',
          isAccessibleForFree: false,
          provider: { '@type': 'Organization', name: 'Smit Sir Commerce', url: BASE },
        }}
      />

      <section style={{ background: '#13213d', color: '#fff' }}>
        <div className="page-container pt-10 sm:pt-16 pb-14 max-w-6xl">
          <nav className="text-xs sm:text-sm opacity-75"><Link to="/">Home</Link> / <Link to="/premium">Premium</Link> / CBSE 12 Accountancy</nav>
          <div className="grid lg:grid-cols-[1.15fr_.85fr] gap-8 items-center mt-8">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-black tracking-wider" style={{ background: '#f1e6c8', color: '#172033' }}><LockKeyhole className="w-4 h-4" /> PREMIUM MASTER LIBRARY</span>
              <h1 className="text-4xl sm:text-6xl mt-5 leading-[1.03]" style={{ fontFamily: 'var(--font-serif)', letterSpacing: '-.04em' }}>CBSE Class 12 Accountancy<br/><span style={{ color: '#f1d28a' }}>Parts I & II</span></h1>
              <p className="text-base sm:text-lg leading-8 mt-5 max-w-3xl" style={{ color: '#d7deea' }}>The new Premium Master standard is now live through the full Financial Ratios sample. The remaining protected Accountancy catalogue is being rebuilt and synced chapter by chapter before we present each PDF as ready.</p>
              <div className="flex flex-wrap gap-3 mt-7"><a href="#part-1" className="btn-primary inline-flex items-center gap-2">Browse all chapters <ArrowRight className="w-4 h-4" /></a><Link to="/premium" className="btn-secondary">Premium home</Link></div>
            </div>
            <aside className="rounded-3xl p-6 sm:p-7" style={{ background: '#fffdf8', color: '#172033', border: '1px solid #dfd4bc', boxShadow: '0 22px 55px rgba(0,0,0,.18)' }}>
              <div className="flex items-center justify-between"><div className="w-13 h-13 rounded-2xl flex items-center justify-center" style={{ width: 52, height: 52, background: '#ebe5d8' }}><LibraryBig className="w-6 h-6" /></div><ShieldCheck className="w-7 h-7" style={{ color: '#247447' }} /></div>
              <span className="text-xs font-black tracking-[.15em] mt-5 block" style={{ color: '#80601e' }}>COMPLETE CLASS 12 LIBRARY</span>
              <div className="text-4xl font-black mt-2">105-page sample live</div>
              <p className="text-sm mt-2 leading-6" style={{ color: '#626b78' }}>Financial Ratios sets the new visual benchmark. Protected chapters below are upgraded only when their actual PDFs are ready.</p>
              <div className="grid grid-cols-2 gap-3 mt-5"><div className="rounded-xl p-4" style={{ background: '#f7f3e9' }}><strong className="text-2xl">1</strong><span className="block text-xs mt-1">full quality sample live</span></div><div className="rounded-xl p-4" style={{ background: '#f7f3e9' }}><strong className="text-2xl">2</strong><span className="block text-xs mt-1">Accountancy parts in rebuild queue</span></div></div>
            </aside>
          </div>
        </div>
      </section>

      <AccountancyPremiumPreview variant="showcase" />

      <section className="page-container max-w-6xl py-9">
        <div className="card-paper p-6 sm:p-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div><span className="eyebrow">WHAT IS INSIDE</span><h2 className="text-3xl sm:text-4xl mt-3" style={{ fontFamily: 'var(--font-serif)' }}>Accountancy Premium is being rebuilt around one quality bar.</h2><p className="mt-3 leading-7 max-w-3xl" style={{ color: 'var(--muted)' }}>The Financial Ratios sample shows the standard we are committing to: large readable type, visual logic, worked numericals, teacher POV and exam-focused presentation. Older catalogue entries are not labelled ready until the matching protected PDF is actually synced.</p></div>
            <Link to="/study-material?board=CBSE&class=12&subject=Accountancy" className="btn-secondary shrink-0">Find from Study Material</Link>
          </div>
        </div>
      </section>

      {error ? <div className="page-container max-w-6xl"><div className="rounded-2xl p-4" role="alert" style={{ background: '#fff0ef', border: '1px solid #efc5c1', color: '#8d2520' }}>{error}</div></div> : null}

      {[1, 2].map((partNumber) => {
        const stat = cbse12AccountancyPartStats.find((item) => item.part === partNumber);
        const chapters = cbse12AccountancyPremiumMaterials.filter((item) => item.part === partNumber);
        return (
          <section id={`part-${partNumber}`} key={partNumber} className="page-container max-w-6xl py-10">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
              <div><span className="eyebrow">PART {partNumber}</span><h2 className="text-3xl sm:text-5xl mt-3" style={{ fontFamily: 'var(--font-serif)' }}>{stat.label.replace(`Part ${partNumber} — `, '')}</h2><p className="mt-3" style={{ color: 'var(--muted)' }}>{stat.chapters} chapters · {stat.pages} pages</p></div>
              <div className="inline-flex items-center gap-2 text-sm font-bold"><ShieldCheck className="w-5 h-5" style={{ color: '#247447' }} /> Account-protected PDFs</div>
            </div>
            <div className="grid md:grid-cols-2 gap-4 mt-6">
              {chapters.map((chapter) => <ChapterCard key={chapter.resourceKey} chapter={chapter} busy={busy} selected={requested === chapter.resourceKey} onOpen={openResource} />)}
            </div>
          </section>
        );
      })}

      <section className="page-container max-w-6xl py-10 pb-20">
        <div className="rounded-3xl p-7 sm:p-9" style={{ background: '#13213d', color: '#fff', border: '1px solid #34415a' }}>
          <div className="grid lg:grid-cols-[1fr_auto] gap-6 items-center">
            <div><FileText className="w-7 h-7" style={{ color: '#f1d28a' }} /><h2 className="text-3xl sm:text-4xl mt-4" style={{ fontFamily: 'var(--font-serif)' }}>See the library before you unlock it.</h2><p className="mt-3 max-w-2xl leading-7" style={{ color: '#d7deea' }}>The catalogue stays visible, but only synced files are treated as live Premium resources. Use the free Financial Ratios sample to judge the quality standard first.</p></div>
            <div className="flex flex-col gap-3">{!user ? <Link to={`/login?next=${encodeURIComponent(PATH)}`} className="btn-primary text-center">Sign in to check access</Link> : <Link to="/my-purchases" className="btn-primary text-center">Open My Purchases</Link>}<Link to="/premium" className="btn-secondary text-center">See full Premium</Link></div>
          </div>
        </div>
      </section>

      {locked ? <AccessDialog resource={locked} user={user} onClose={() => setLocked(null)} /> : null}
    </main>
  );
}
