import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  BookOpen,
  Check,
  Crown,
  Download,
  Eye,
  FileText,
  Layers3,
  Loader2,
  LockKeyhole,
  Search,
  ShieldCheck,
  Sparkles,
  X,
} from 'lucide-react';
import SEO from '../components/ui/SEO';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import {
  CBSE_12_BST_FREE_PREVIEWS,
  CBSE_12_BST_PREMIUM_CHAPTERS,
  CBSE_12_BST_TOTAL_PAGES,
  cbse12BusinessStudiesPremiumMaterials,
} from '../data/cbse12BusinessStudiesPremium';
import { trackEvent } from '../lib/analytics';

const PATH = '/premium/cbse-12-business-studies';
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
      style={{ width: 'min(480px, calc(100vw - 24px))', background: '#fffdf8', color: '#172033', boxShadow: '0 32px 100px rgba(0,0,0,.3)' }}
      onCancel={(event) => { event.preventDefault(); onClose(); }}
      onClick={(event) => { if (event.target === event.currentTarget) onClose(); }}
    >
      <div className="p-6 sm:p-8">
        <div className="flex items-start justify-between gap-4">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: '#17284b', color: '#f4d486' }}><LockKeyhole className="w-5 h-5" /></div>
          <button type="button" onClick={onClose} className="btn-secondary" aria-label="Close"><X className="w-4 h-4" /></button>
        </div>
        <span className="eyebrow inline-flex mt-5">DETAILED PREMIUM MASTER</span>
        <h2 className="text-2xl sm:text-3xl mt-3" style={{ fontFamily: 'var(--font-serif)' }}>This full chapter is protected.</h2>
        <p className="mt-3 font-black">{resource.title}</p>
        <p className="mt-3 text-sm leading-6" style={{ color: 'var(--muted)' }}>You can see the full chapter list, page counts and what each Master contains before buying. The detailed PDF opens only for an eligible Premium student account.</p>
        {resource.freeQuickNotes ? (
          <a href={resource.freeQuickNotes} target="_blank" rel="noopener noreferrer" className="btn-secondary w-full mt-5 text-center inline-flex items-center justify-center gap-2">
            <FileText className="w-4 h-4" /> Try the free quick-note edition
          </a>
        ) : null}
        <div className="grid gap-3 mt-4">
          {!user ? <Link to={`/login?next=${encodeURIComponent(PATH)}`} className="btn-primary text-center">Sign in to check Premium</Link> : <Link to="/my-purchases" className="btn-primary text-center">Check My Purchases</Link>}
          <Link to="/premium" className="btn-secondary text-center">View Premium options</Link>
        </div>
      </div>
    </dialog>
  );
}

function PremiumCard({ chapter, busy, selected, onOpen }) {
  return (
    <motion.article
      id={chapter.resourceKey}
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-30px' }}
      transition={{ duration: .38, ease: 'easeOut' }}
      whileHover={{ y: -4 }}
      className="bst-master-card card-paper relative overflow-hidden p-5 sm:p-6 flex flex-col scroll-mt-28"
      style={{
        '--bst-accent': chapter.accent,
        border: selected ? `1px solid ${chapter.accent}` : '1px solid rgba(23,32,51,.10)',
        boxShadow: selected ? `0 18px 48px ${chapter.accent}22` : '0 12px 30px rgba(23,32,51,.07)',
      }}
    >
      <span className="bst-card-glow" aria-hidden="true" />
      <div className="flex items-start justify-between gap-3 relative z-[1]">
        <div className="w-12 h-12 rounded-2xl flex items-center justify-center font-black text-lg" style={{ background: `${chapter.accent}12`, color: chapter.accent, border: `1px solid ${chapter.accent}2b` }}>
          {String(chapter.chapterNumber).padStart(2, '0')}
        </div>
        <span className="bst-premium-pill"><Crown className="w-3.5 h-3.5" /> PREMIUM MASTER</span>
      </div>

      <div className="relative z-[1]">
        <h3 className="text-xl sm:text-2xl mt-4 leading-tight" style={{ fontFamily: 'var(--font-serif)' }}>{chapter.title}</h3>
        <div className="flex flex-wrap gap-2 mt-3">
          <span className="rounded-full px-3 py-1 text-[11px] font-black" style={{ background: '#f3efe5', color: '#574b32' }}>{chapter.pages} pages</span>
          <span className="rounded-full px-3 py-1 text-[11px] font-black" style={{ background: '#eef5ff', color: '#244b84' }}>CBSE · Class 12</span>
        </div>
        <div className="space-y-2 mt-4">
          {chapter.highlights.map((item) => <div key={item} className="flex gap-2 text-sm leading-5"><Check className="w-4 h-4 shrink-0 mt-0.5" style={{ color: chapter.accent }} /><span>{item}</span></div>)}
        </div>
      </div>

      <div className="mt-auto pt-5 relative z-[1]">
        {chapter.freeQuickNotes ? (
          <a
            href={chapter.freeQuickNotes}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full rounded-xl px-4 py-3 font-black text-sm inline-flex items-center justify-center gap-2 mb-2.5 transition-transform hover:-translate-y-0.5"
            style={{ background: '#edf9f0', color: '#205f37', border: '1px solid #c9e4d1' }}
            onClick={() => void trackEvent('bst_free_quick_notes_open', { chapter: chapter.chapterNumber })}
          >
            <BookOpen className="w-4 h-4" /> Free quick notes · {chapter.freeQuickPages}p
          </a>
        ) : null}
        <button type="button" onClick={() => onOpen(chapter)} disabled={Boolean(busy)} className="bst-premium-open w-full">
          {busy === chapter.resourceKey ? <><Loader2 className="w-4 h-4 animate-spin" /> Checking access…</> : <><Sparkles className="w-4 h-4" /> Open Detailed Premium Master</>}
        </button>
      </div>
    </motion.article>
  );
}

export default function Cbse12BusinessStudiesPremium() {
  const { user, loading } = useAuth();
  const [params] = useSearchParams();
  const requested = params.get('chapter') || '';
  const [busy, setBusy] = useState('');
  const [viewer, setViewer] = useState(null);
  const [locked, setLocked] = useState(null);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');
  const [query, setQuery] = useState('');
  const request = useRef(null);

  const visible = useMemo(() => {
    const words = query.toLowerCase().trim().split(/\s+/).filter(Boolean);
    return cbse12BusinessStudiesPremiumMaterials.filter((item) => {
      if (filter === 'free' && !item.freeQuickNotes) return false;
      if (filter === 'premium' && !item.pages) return false;
      return words.every((word) => `${item.chapterNumber} ${item.title} ${item.highlights.join(' ')}`.toLowerCase().includes(word));
    });
  }, [filter, query]);

  useEffect(() => () => request.current?.abort(), []);
  useEffect(() => () => { if (viewer?.url) URL.revokeObjectURL(viewer.url); }, [viewer]);
  useEffect(() => {
    if (!requested) return;
    window.setTimeout(() => document.getElementById(requested)?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 160);
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
      void trackEvent('bst_premium_locked_click', { resourceKey: resource.resourceKey, reason: 'signed_out' });
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

      const response = await fetch('/api/premium-business-studies', {
        method: 'POST',
        signal: controller.signal,
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ resourceKey: resource.resourceKey }),
      });

      if (response.status === 401 || response.status === 403) {
        setLocked(resource);
        void trackEvent('bst_premium_locked_click', { resourceKey: resource.resourceKey, reason: 'no_entitlement' }, user.id);
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
      void trackEvent('bst_premium_open', { resourceKey: resource.resourceKey, pages: resource.pages }, user.id);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (problem) {
      if (!controller.signal.aborted) setError(problem.message || 'Unable to open this resource.');
    } finally {
      if (!controller.signal.aborted) setBusy('');
    }
  }

  if (loading) return <main className="min-h-screen flex items-center justify-center"><Loader2 className="w-7 h-7 animate-spin" /></main>;

  if (viewer) return (
    <main className="min-h-screen" style={{ background: '#f6f4ee' }}>
      <SEO title={`${viewer.title} — CBSE 12 BST Premium`} description="Protected CBSE Class 12 Business Studies Premium Master resource." path={PATH} noindex />
      <div className="page-container py-7 max-w-6xl">
        <button type="button" className="btn-secondary" onClick={() => { URL.revokeObjectURL(viewer.url); setViewer(null); }}>← Back to Business Studies library</button>
        <div className="card-paper p-5 sm:p-7 mt-5">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-5">
            <div>
              <span className="eyebrow">PREMIUM ACCESS VERIFIED</span>
              <h1 className="text-2xl sm:text-4xl mt-3" style={{ fontFamily: 'var(--font-serif)' }}>{viewer.title}</h1>
              <p className="mt-2" style={{ color: 'var(--muted)' }}>Chapter {viewer.chapterNumber} · {viewer.pages} pages · CBSE Class 12 Business Studies</p>
            </div>
            <a href={viewer.url} download className="btn-primary inline-flex items-center justify-center gap-2 shrink-0"><Download className="w-4 h-4" /> Download PDF</a>
          </div>
          <iframe src={viewer.url} title={viewer.title} className="w-full mt-6 rounded-2xl border bg-white" style={{ height: '78vh', minHeight: 520 }} />
        </div>
      </div>
    </main>
  );

  return (
    <main className="bst-premium-page" style={{ background: 'linear-gradient(180deg,#fbf8f0 0%,#f7f8fb 42%,#fff 100%)' }}>
      <SEO
        title="CBSE Class 12 Business Studies Premium Master Notes"
        description={`Browse all 12 detailed Smit Sir Commerce CBSE Class 12 Business Studies Premium Master chapters — ${CBSE_12_BST_TOTAL_PAGES} pages with theory, case studies, MCQs, model answers and exam-writing guidance.`}
        path={PATH}
        structuredData={{
          '@context': 'https://schema.org',
          '@type': 'CollectionPage',
          name: 'CBSE Class 12 Business Studies Premium Master Library',
          educationalLevel: 'CBSE Class 12',
          about: 'Business Studies',
          isAccessibleForFree: false,
          provider: { '@type': 'Organization', name: 'Smit Sir Commerce', url: BASE },
        }}
      />

      <style>{`
        .bst-master-card:before{content:"";position:absolute;left:0;top:0;right:0;height:4px;background:linear-gradient(90deg,var(--bst-accent),#f4c95d,var(--bst-accent));background-size:220% 100%;animation:bstShine 5.5s linear infinite}
        .bst-card-glow{position:absolute;width:150px;height:150px;right:-70px;top:-70px;border-radius:999px;background:var(--bst-accent);opacity:.07;filter:blur(4px);transition:transform .35s ease,opacity .35s ease}
        .bst-master-card:hover .bst-card-glow{transform:scale(1.35);opacity:.11}
        .bst-premium-pill{display:inline-flex;align-items:center;gap:6px;border-radius:999px;padding:7px 10px;font-size:10px;font-weight:950;letter-spacing:.08em;background:linear-gradient(110deg,#17284b 0%,#2b3b62 45%,#17284b 70%);background-size:200% 100%;color:#f7d77f;animation:bstPill 4.8s ease-in-out infinite;border:1px solid rgba(244,212,134,.34);box-shadow:0 8px 20px rgba(23,40,75,.16)}
        .bst-premium-open{display:inline-flex;align-items:center;justify-content:center;gap:8px;border:0;border-radius:13px;padding:13px 15px;font-weight:900;background:linear-gradient(135deg,#17284b,#293e70);color:#fff;box-shadow:0 10px 24px rgba(23,40,75,.18);transition:transform .2s ease,box-shadow .2s ease}
        .bst-premium-open:hover{transform:translateY(-2px);box-shadow:0 15px 30px rgba(23,40,75,.24)}
        .bst-premium-open:disabled{opacity:.55}
        @keyframes bstShine{to{background-position:220% 0}}
        @keyframes bstPill{0%,100%{background-position:0 0}50%{background-position:100% 0}}
        @media(prefers-reduced-motion:reduce){.bst-master-card:before,.bst-premium-pill{animation:none}.bst-master-card,.bst-premium-open{transition:none}}
      `}</style>

      <section style={{ background: 'radial-gradient(circle at 80% 15%,rgba(244,201,93,.18),transparent 25%),linear-gradient(135deg,#0d1833 0%,#17284b 58%,#39270b 100%)', color: '#fff' }}>
        <div className="page-container max-w-6xl pt-10 sm:pt-16 pb-14">
          <nav className="text-xs sm:text-sm opacity-75"><Link to="/">Home</Link> / <Link to="/premium">Premium</Link> / CBSE 12 Business Studies</nav>
          <div className="grid lg:grid-cols-[1.15fr_.85fr] gap-8 items-center mt-8">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-black tracking-wider" style={{ background: '#f4d486', color: '#172033' }}><Crown className="w-4 h-4" /> PREMIUM MASTER SERIES</span>
              <h1 className="text-4xl sm:text-6xl mt-5 leading-[1.02]" style={{ fontFamily: 'var(--font-serif)', letterSpacing: '-.045em' }}>Business Studies that feels like<br/><span style={{ color: '#f4d486' }}>Smit Sir is teaching beside you.</span></h1>
              <p className="text-base sm:text-lg leading-8 mt-5 max-w-3xl" style={{ color: '#d9e0ef' }}>The old free notes stay available as fast revision. This is the new detailed Premium layer: deeper theory, case-study decoding, examiner keywords, MCQs, model answers, board-writing strategy and visual revision — chapter by chapter.</p>
              <div className="flex flex-wrap gap-3 mt-7">
                <a href="#master-library" className="btn-primary inline-flex items-center gap-2">Explore all 12 chapters <ArrowRight className="w-4 h-4" /></a>
                <a href="/materials/cbse/class-12/business-studies/chapter-01-nature-and-significance-of-management.pdf" target="_blank" rel="noopener noreferrer" className="btn-secondary">Try free quick notes</a>
              </div>
            </div>

            <aside className="rounded-3xl p-6 sm:p-7" style={{ background: '#fffdf8', color: '#172033', border: '1px solid rgba(244,212,134,.45)', boxShadow: '0 25px 70px rgba(0,0,0,.24)' }}>
              <div className="flex items-center justify-between"><div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ background: '#17284b', color: '#f4d486' }}><Layers3 className="w-7 h-7" /></div><Sparkles className="w-7 h-7" style={{ color: '#b8872f' }} /></div>
              <span className="text-xs font-black tracking-[.15em] mt-5 block" style={{ color: '#8a6012' }}>DETAILED PREMIUM LIBRARY</span>
              <div className="text-4xl font-black mt-2">{CBSE_12_BST_TOTAL_PAGES} pages</div>
              <p className="text-sm mt-2 leading-6" style={{ color: '#626b78' }}>12 full Master chapters, plus {CBSE_12_BST_FREE_PREVIEWS} free quick-note examples for students who want to see the teaching approach first.</p>
              <div className="grid grid-cols-3 gap-2 mt-5">
                <div className="rounded-xl p-3 text-center" style={{ background: '#f7f3e9' }}><strong className="text-2xl">{CBSE_12_BST_PREMIUM_CHAPTERS}</strong><span className="block text-[10px] mt-1 font-bold">MASTER PDFs</span></div>
                <div className="rounded-xl p-3 text-center" style={{ background: '#edf9f0' }}><strong className="text-2xl">{CBSE_12_BST_FREE_PREVIEWS}</strong><span className="block text-[10px] mt-1 font-bold">FREE EXAMPLES</span></div>
                <div className="rounded-xl p-3 text-center" style={{ background: '#eef3ff' }}><strong className="text-2xl">12</strong><span className="block text-[10px] mt-1 font-bold">CHAPTERS</span></div>
              </div>
            </aside>
          </div>
        </div>
      </section>

      <section className="page-container max-w-6xl py-8">
        <div className="grid md:grid-cols-2 gap-4">
          <div className="card-paper p-5 sm:p-6" style={{ background: 'linear-gradient(135deg,#f2fbf4,#fff)' }}>
            <span className="text-xs font-black tracking-wider" style={{ color: '#21663a' }}>FREE QUICK NOTES</span>
            <h2 className="text-2xl mt-2" style={{ fontFamily: 'var(--font-serif)' }}>Fast revision. Always useful.</h2>
            <p className="text-sm leading-6 mt-2" style={{ color: 'var(--muted)' }}>Your existing shorter BST notes remain free. They are ideal when a student wants a quick chapter revision or wants to understand the basic teaching style before Premium.</p>
          </div>
          <div className="card-paper p-5 sm:p-6 relative overflow-hidden" style={{ background: 'linear-gradient(135deg,#fff8df,#fff)' }}>
            <span className="text-xs font-black tracking-wider" style={{ color: '#8a6012' }}>DETAILED PREMIUM MASTER</span>
            <h2 className="text-2xl mt-2" style={{ fontFamily: 'var(--font-serif)' }}>Teach → Decode → Write → Practise.</h2>
            <p className="text-sm leading-6 mt-2" style={{ color: 'var(--muted)' }}>Premium is not the same PDF with a lock icon. It is the deeper edition: richer explanation, visual learning, case clues, answer structure, examiner traps, MCQs, HOTS, mocks and revision systems.</p>
          </div>
        </div>
      </section>

      <section id="master-library" className="page-container max-w-6xl pb-14">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-5">
          <div><span className="eyebrow">CBSE · CLASS 12 · BUSINESS STUDIES</span><h2 className="text-3xl sm:text-5xl mt-3" style={{ fontFamily: 'var(--font-serif)' }}>Every chapter. One organised Premium shelf.</h2><p className="mt-3 max-w-3xl leading-7" style={{ color: 'var(--muted)' }}>No hunting through duplicated pages. Pick the exact chapter, see its depth, try the free quick edition where available, and open the protected Master when your account has Premium access.</p></div>
          <Link to="/study-material?board=CBSE&class=12&subject=Business%20Studies#chapter-finder" className="btn-secondary shrink-0">See Free + Premium together</Link>
        </div>

        <div className="grid sm:grid-cols-[auto_auto_auto_1fr] gap-2 mt-7 items-center">
          {[['all','All 12'],['free','Free examples'],['premium','Premium masters']].map(([value,label]) => <button key={value} type="button" onClick={() => setFilter(value)} className={filter === value ? 'btn-primary' : 'btn-secondary'}>{label}</button>)}
          <label className="flex items-center gap-2 rounded-xl px-3 py-2.5 bg-white border sm:ml-auto w-full sm:w-auto"><Search className="w-4 h-4" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Find a chapter…" className="outline-none bg-transparent min-w-0 w-full" /></label>
        </div>

        {error ? <div className="rounded-2xl p-4 mt-5" role="alert" style={{ background: '#fff0ef', border: '1px solid #efc5c1', color: '#8d2520' }}>{error}</div> : null}

        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5 mt-6">
          {visible.map((chapter) => <PremiumCard key={chapter.resourceKey} chapter={chapter} busy={busy} selected={requested === chapter.resourceKey} onOpen={openResource} />)}
        </div>
        {!visible.length ? <p className="card-paper p-6 mt-6">No chapter matches that search.</p> : null}
      </section>

      <section className="page-container max-w-6xl pb-16">
        <div className="rounded-[2rem] p-6 sm:p-9" style={{ background: '#17284b', color: '#fff' }}>
          <div className="grid lg:grid-cols-[1fr_auto] gap-6 items-center">
            <div><span className="text-xs font-black tracking-[.13em]" style={{ color: '#f4d486' }}>SMIT SIR COMMERCE PREMIUM</span><h2 className="text-3xl sm:text-4xl mt-3" style={{ fontFamily: 'var(--font-serif)' }}>Know exactly what you are paying for.</h2><p className="mt-3 leading-7 max-w-3xl" style={{ color: '#d9e0ef' }}>All 12 chapter names, page counts and learning coverage are visible before purchase. Premium access protects the detailed files while free quick notes remain available for students who need basic revision.</p></div>
            <Link to="/premium" className="btn-primary shrink-0">View Premium access</Link>
          </div>
        </div>
      </section>

      {locked ? <AccessDialog resource={locked} user={user} onClose={() => setLocked(null)} /> : null}
    </main>
  );
}
