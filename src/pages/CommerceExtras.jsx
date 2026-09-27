import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Crown, Download, FileQuestion, Loader2, LockKeyhole, X } from 'lucide-react';
import SEO from '../components/ui/SEO';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { commerceExtras, commerceExtraSubjects } from '../data/commerceExtras';

const PAGE_PATH = '/extras-notes';

export default function CommerceExtras() {
  const { user, isPremium, loading } = useAuth();
  const [subject, setSubject] = useState(commerceExtraSubjects[0]);
  const [busy, setBusy] = useState('');
  const [notice, setNotice] = useState('');
  const [viewer, setViewer] = useState(null);
  const chapters = useMemo(() => commerceExtras.filter((item) => item.subject === subject), [subject]);
  const locked = !user || !isPremium;

  useEffect(() => () => { if (viewer?.url) URL.revokeObjectURL(viewer.url); }, [viewer]);

  async function openPdf(item) {
    setNotice('');
    if (!user) {
      setNotice('Sign in to check your Premium access.');
      return;
    }
    if (!isPremium) {
      setNotice('These Extras are locked for Premium members.');
      return;
    }

    setBusy(item.resourceKey);
    try {
      const { data } = await supabase.auth.getSession();
      const token = data.session?.access_token;
      if (!token) throw new Error('Your sign-in session has expired. Sign in again to continue.');
      const response = await fetch('/api/premium-commerce-extras', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ resourceKey: item.resourceKey }),
      });
      if (!response.ok) {
        const result = await response.json().catch(() => ({}));
        throw new Error(result.error || 'Unable to open this Premium PDF.');
      }
      const blob = await response.blob();
      if (!blob.type.includes('pdf')) throw new Error('The server did not return a PDF.');
      const url = URL.createObjectURL(blob);
      setViewer({ item, url });
    } catch (error) {
      setNotice(error.message || 'Unable to open this PDF. Please try again.');
    } finally {
      setBusy('');
    }
  }

  return (
    <div className="min-h-screen bg-[#fbfaf6] text-[#14223b]">
      <SEO title="Premium Extras: Commerce Notes & Question Practice | Smit Sir Commerce" description="34 chapter-wise Premium Extra PDFs across Microeconomics, Business Studies and Accountancy. Includes detailed notes and question practice." path={PAGE_PATH} />
      <header className="relative overflow-hidden bg-[#101d39] px-4 py-14 text-white sm:py-20">
        <div className="absolute -right-20 -top-28 h-80 w-80 rounded-full bg-[#d7b25b]/15 blur-3xl" />
        <div className="relative mx-auto max-w-6xl">
          <div className="flex flex-wrap items-center gap-2 text-xs font-extrabold uppercase tracking-[.18em] text-[#e7c96e]"><Crown size={16} /> Premium Extras</div>
          <h1 className="mt-4 max-w-4xl font-serif text-4xl font-black leading-tight sm:text-6xl">Extra Notes &amp; Question Practice</h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-slate-200 sm:text-lg">34 chapter PDFs across three subjects. Each chapter has a 50-page workbook with explanations, worked ideas, revision and practice.</p>
          <div className="mt-6 flex flex-wrap gap-3 text-sm font-bold">
            <span className="rounded-full border border-white/20 bg-white/10 px-4 py-2">1,700 pages</span>
            <span className="rounded-full border border-white/20 bg-white/10 px-4 py-2">3 subjects</span>
            <span className="rounded-full border border-[#e7c96e]/40 bg-[#e7c96e]/10 px-4 py-2 text-[#ffe69b]">Premium only</span>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-10 sm:py-14">
        <div className="flex flex-wrap gap-2" role="tablist" aria-label="Choose a subject">
          {commerceExtraSubjects.map((name) => (
            <button key={name} type="button" role="tab" aria-selected={subject === name} onClick={() => { setSubject(name); setNotice(''); }}
              className={`min-h-11 rounded-full px-5 py-2 text-sm font-extrabold transition ${subject === name ? 'bg-[#126c61] text-white shadow-md' : 'border border-[#d8e4df] bg-white text-[#35504b] hover:border-[#126c61]'}`}>
              {name}
            </button>
          ))}
        </div>

        <div className="mt-7 flex flex-col justify-between gap-5 rounded-3xl border border-[#e7ddc4] bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:p-7">
          <div>
            <span className="text-xs font-black uppercase tracking-[.16em] text-[#977127]">Chapter library</span>
            <h2 className="mt-2 font-serif text-2xl font-black sm:text-3xl">{subject}</h2>
            <p className="mt-2 text-sm leading-6 text-[#66716f]">{chapters.length} chapter PDFs · 50 pages each · notes and question practice.</p>
          </div>
          {loading ? <span className="inline-flex items-center gap-2 text-sm font-bold text-[#66716f]"><Loader2 size={16} className="animate-spin" /> Checking account…</span>
            : locked ? <Link to={user ? '/premium' : `/login?redirect=${encodeURIComponent(PAGE_PATH)}`} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#172744] px-5 py-3 text-sm font-extrabold text-white shadow hover:bg-[#263e67]"><LockKeyhole size={16} /> Unlock with Premium</Link>
              : <span className="inline-flex items-center gap-2 rounded-full bg-[#eaf7ee] px-4 py-2 text-sm font-extrabold text-[#286743]"><Crown size={16} /> Premium access active</span>}
        </div>

        {notice && <p role="status" className="mt-5 rounded-xl border border-[#e8d5a3] bg-[#fff8e5] px-4 py-3 text-sm font-semibold text-[#684f17]">{notice} {notice.includes('Sign in') && <Link to={`/login?redirect=${encodeURIComponent(PAGE_PATH)}`} className="underline">Sign in</Link>} {notice.includes('locked') && <Link to="/premium" className="underline">View Premium</Link>}</p>}

        <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {chapters.map((item) => (
            <article key={item.resourceKey} className="group flex min-h-64 flex-col rounded-2xl border border-[#e0e8e3] bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-[#94c2b5] hover:shadow-lg">
              <div className="flex items-start justify-between gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#edf5f1] text-[#126c61]"><BookOpen size={21} /></div>
                <span className="rounded-full bg-[#f6f0df] px-3 py-1 text-[10px] font-black uppercase tracking-wider text-[#795f27]">50-page extra</span>
              </div>
              <p className="mt-5 text-xs font-black uppercase tracking-[.14em] text-[#6a817a]">Chapter {item.chapter} · {item.subject}</p>
              <h3 className="mt-2 font-serif text-xl font-bold leading-snug text-[#162640]">{item.title}</h3>
              <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-6">
                <span className="inline-flex items-center gap-2 text-xs font-bold text-[#64746f]"><FileQuestion size={15} /> Notes + question practice</span>
                <button type="button" disabled={Boolean(busy) || loading} onClick={() => openPdf(item)} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#126c61] px-4 py-2 text-sm font-extrabold text-white disabled:cursor-wait disabled:opacity-60">
                  {busy === item.resourceKey ? <><Loader2 size={16} className="animate-spin" /> Opening</> : locked ? <><LockKeyhole size={15} /> Locked</> : <><Download size={15} /> Open PDF</>}
                </button>
              </div>
            </article>
          ))}
        </div>

        <p className="mt-8 text-center text-xs leading-5 text-[#7a8581]">Premium PDFs are served after the site verifies your signed-in account and Premium access.</p>
      </main>

      {viewer && <div className="fixed inset-0 z-[100] flex flex-col bg-[#0b1325]/95 p-2 sm:p-5" role="dialog" aria-modal="true" aria-label={viewer.item.title}>
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-3 rounded-t-2xl bg-white px-4 py-3">
          <div className="min-w-0"><p className="truncate text-sm font-extrabold">{viewer.item.subject} · Chapter {viewer.item.chapter}</p><p className="truncate text-xs text-slate-500">{viewer.item.title}</p></div>
          <div className="flex shrink-0 items-center gap-2"><a href={viewer.url} download={`Smit_Sir_${viewer.item.resourceKey}_50p.pdf`} className="inline-flex min-h-10 items-center gap-2 rounded-lg bg-[#126c61] px-3 text-xs font-bold text-white"><Download size={14} /> Download</a><button type="button" aria-label="Close PDF" onClick={() => setViewer(null)} className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 text-slate-700"><X size={18} /></button></div>
        </div>
        <iframe title={viewer.item.title} src={viewer.url} className="mx-auto w-full max-w-6xl flex-1 rounded-b-2xl bg-white" />
      </div>}
    </div>
  );
}
