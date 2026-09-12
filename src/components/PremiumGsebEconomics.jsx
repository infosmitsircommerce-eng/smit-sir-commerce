import { useEffect, useRef, useState } from 'react';
import { gsebPremiumEconomicsMaterials } from '../data/gsebMaterials';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import PremiumPaymentDialog from './PremiumPaymentDialog';

export default function PremiumGsebEconomics() {
  const { user, isPremium, isAdmin, loading } = useAuth();
  const access = isPremium || isAdmin;
  const [paymentNotes, setPaymentNotes] = useState(null);
  const launched = useRef(false);
  const [pdf, setPdf] = useState(null);
  const [busy, setBusy] = useState(null);
  const [error, setError] = useState('');
  const request = useRef(null);
  useEffect(() => () => request.current?.abort(), []);
  useEffect(() => () => { if (pdf) URL.revokeObjectURL(pdf.url); }, [pdf]);

  useEffect(() => {
    request.current?.abort(); setBusy(null); setPdf(null); setPaymentNotes(null);
  }, [user?.id, access]);
  useEffect(() => {
    if (loading || launched.current) return;
    launched.current = true;
    const chapter = Number(new URLSearchParams(window.location.search).get('chapter'));
    const notes = gsebPremiumEconomicsMaterials.find(m => m.chapterNumber === chapter);
    if (notes) void open(notes);
    return () => { launched.current = false; };
  }, [loading]);

  async function open(notes) {
    if (!access) { setPaymentNotes(notes); return; }
    request.current?.abort();
    const controller = new AbortController();
    request.current = controller;
    setBusy(notes.chapterNumber);
    setError('');
    try {
      const { data } = await supabase.auth.getSession();
      const token = data.session?.access_token;
      if (!token) throw new Error('Please sign in again.');
      const response = await fetch('/api/premium-study', {
        method: 'POST', signal: controller.signal,
        headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token },
        body: JSON.stringify({ gsebChapter: notes.chapterNumber }),
      });
      if (!response.ok) {
        const body = await response.json();
        throw new Error(body.error || 'Unable to load Premium notes.');
      }
      if (!response.headers.get('content-type')?.includes('application/pdf')) throw new Error('The PDF could not be loaded. Please try again.');
      const blob = await response.blob();
      if (controller.signal.aborted) return;
      setPdf({ ...notes, url: URL.createObjectURL(blob) });
    } catch (problem) {
      if (!controller.signal.aborted) setError(problem.message);
    } finally {
      if (!controller.signal.aborted) setBusy(null);
    }
  }

  if (pdf) return <section className="card-paper p-5 mt-7">
    <button className="btn-secondary" onClick={() => setPdf(null)}>← All GSEB Premium notes</button>
    <h2 className="text-2xl mt-5">{pdf.title}</h2>
    <p className="mt-2">GSEB Class 12 Economics · Premium revision notes · {pdf.pages} pages</p>
    <a className="btn-primary inline-flex mt-4" href={pdf.url} download={`gseb-class-12-economics-chapter-${pdf.chapterNumber}-premium-notes.pdf`}>Download Premium PDF</a>
    <p className="mt-3 text-sm">If your browser does not show the reader, use Download Premium PDF.</p>
    <iframe src={pdf.url} title={pdf.title + ' Premium PDF'} className="w-full mt-5 rounded-xl border" style={{ height: '75vh', minHeight: 420 }} />
  </section>;

  return <section className="mt-7">
    <h2 className="text-2xl">GSEB Class 12 Economics revision PDFs</h2>
    <p className="mt-3 leading-7">Browse all original chapter revision PDFs. Premium students can read or download them; click a chapter to see the payment QR if you have Free access. Choose a chapter to read or download its notes. Chapters 2–11 are available here.</p>
    <a className="btn-secondary inline-flex mt-4" href="/gseb-class-12-economics.html">Open the new free notes collection</a>
    {error && <p role="alert" className="mt-4 text-red-700">{error}</p>}
    <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4 mt-7">{gsebPremiumEconomicsMaterials.map(notes => <article key={notes.id} className="card-paper p-5">
      <span className="eyebrow">GSEB · Class 12 · Premium</span>
      <h3 className="text-xl mt-3">{notes.title}</h3>
      <p className="text-sm mt-2">{notes.pages} pages · Revision PDF</p>
      <button onClick={() => open(notes)} disabled={busy !== null} className="btn-primary w-full mt-5">{busy === notes.chapterNumber ? 'Loading…' : access ? 'Open Premium PDF' : 'View Premium PDF'}</button>
    </article>)}</div>
    {paymentNotes && <PremiumPaymentDialog title={paymentNotes.title} onClose={() => setPaymentNotes(null)} />}
  </section>;
}
