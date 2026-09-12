import { useEffect, useRef, useState } from 'react';
import { gsebPremiumEconomicsMaterials } from '../data/gsebMaterials';
import { supabase } from '../lib/supabase';

export default function PremiumGsebEconomics() {
  const [pdf, setPdf] = useState(null);
  const [busy, setBusy] = useState(null);
  const [error, setError] = useState('');
  const request = useRef(null);
  useEffect(() => () => request.current?.abort(), []);
  useEffect(() => () => { if (pdf) URL.revokeObjectURL(pdf.url); }, [pdf]);

  async function open(notes) {
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
    <p className="mt-3 leading-7">The original chapter revision PDFs are now part of your Premium access. Choose a chapter to read or download its notes. Chapters 2–11 are available here.</p>
    <a className="btn-secondary inline-flex mt-4" href="/gseb-class-12-economics.html">Open the new free notes collection</a>
    {error && <p role="alert" className="mt-4 text-red-700">{error}</p>}
    <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4 mt-7">{gsebPremiumEconomicsMaterials.map(notes => <article key={notes.id} className="card-paper p-5">
      <span className="eyebrow">GSEB · Class 12 · Premium</span>
      <h3 className="text-xl mt-3">{notes.title}</h3>
      <p className="text-sm mt-2">{notes.pages} pages · Revision PDF</p>
      <button onClick={() => open(notes)} disabled={busy !== null} className="btn-primary w-full mt-5">{busy === notes.chapterNumber ? 'Loading…' : 'Open Premium PDF'}</button>
    </article>)}</div>
  </section>;
}
