import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, Filter, Search } from 'lucide-react';
import SEO from '../components/ui/SEO';
import { growthPages, growthStats } from '../data/contentGrowth';

const TYPE_LABELS = {
  mcqs: 'MCQs',
  'important-questions': 'Important Questions',
  revision: 'Revision',
  'assertion-reason': 'Assertion–Reason',
  'case-study': 'Case Study',
  numericals: 'Numericals',
};

export default function ContentGrowthHub() {
  const [query, setQuery] = useState('');
  const [classLevel, setClassLevel] = useState('All');
  const [subject, setSubject] = useState('All');
  const [type, setType] = useState('All');

  const subjects = [...new Set(growthPages.map((page) => page.subject))].sort();
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return growthPages.filter((page) => {
      if (classLevel !== 'All' && String(page.classLevel) !== classLevel) return false;
      if (subject !== 'All' && page.subject !== subject) return false;
      if (type !== 'All' && page.type !== type) return false;
      return !q || `${page.chapter} ${page.subject} ${page.label}`.toLowerCase().includes(q);
    });
  }, [query, classLevel, subject, type]);

  return <div className="min-h-screen" style={{ background: 'var(--bg-ivory)' }}>
    <SEO title="Free CBSE Commerce Practice — MCQs, Numericals & Case Studies" description="Free CBSE Class 11 and 12 Commerce practice by chapter: MCQs, important questions, assertion–reason, case studies, numericals and one-shot revision." path="/cbse-practice" structuredData={{ '@context': 'https://schema.org', '@type': 'CollectionPage', name: 'Free CBSE Commerce Practice', url: 'https://www.smitsircommerce.in/cbse-practice', isAccessibleForFree: true }} />
    <section className="page-hero"><div className="page-container"><span className="eyebrow">Free CBSE Commerce practice library</span><h1 className="mt-5 max-w-4xl">Practise chapter by chapter, <em>not randomly.</em></h1><p className="mt-5 max-w-3xl text-lg leading-relaxed" style={{ color: 'var(--muted)' }}>Original Class 11–12 Commerce practice pages built around real chapters: MCQs, important questions, assertion–reason, case studies, worked numericals and quick revision.</p><div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-8 max-w-3xl">{[[growthStats.pages, 'Practice pages'], [growthStats.chapters, 'Chapters covered'], [growthStats.caseStudyPages, 'Case-study sets'], [growthStats.numericalPages, 'Numerical sets']].map(([value, label]) => <div key={label} className="tile-paper p-4"><div className="text-2xl font-bold" style={{ color: 'var(--ink)', fontFamily: 'var(--font-serif)' }}>{value}</div><div className="text-xs mt-1" style={{ color: 'var(--muted)' }}>{label}</div></div>)}</div></div></section>
    <main className="page-container section-padding"><section className="card-paper p-4 sm:p-5 mb-7"><div className="grid md:grid-cols-[1.5fr_repeat(3,minmax(0,1fr))] gap-3"><label className="relative"><Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--muted)' }} /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search chapter or topic…" className="w-full rounded-xl pl-9 pr-3 py-3 text-sm outline-none" style={{ border: '1px solid var(--border)', background: 'var(--bg-white)', color: 'var(--ink)' }} /></label><select value={classLevel} onChange={(e) => setClassLevel(e.target.value)} className="rounded-xl px-3 py-3 text-sm" style={{ border: '1px solid var(--border)', background: 'var(--bg-white)', color: 'var(--ink)' }}><option>All</option><option>11</option><option>12</option></select><select value={subject} onChange={(e) => setSubject(e.target.value)} className="rounded-xl px-3 py-3 text-sm" style={{ border: '1px solid var(--border)', background: 'var(--bg-white)', color: 'var(--ink)' }}><option>All</option>{subjects.map((item) => <option key={item}>{item}</option>)}</select><select value={type} onChange={(e) => setType(e.target.value)} className="rounded-xl px-3 py-3 text-sm" style={{ border: '1px solid var(--border)', background: 'var(--bg-white)', color: 'var(--ink)' }}><option value="All">All practice types</option>{Object.entries(TYPE_LABELS).map(([key, label]) => <option value={key} key={key}>{label}</option>)}</select></div><div className="flex items-center gap-2 text-xs mt-3" style={{ color: 'var(--muted)' }}><Filter className="w-3.5 h-3.5" /> Showing {filtered.length} of {growthPages.length} free practice pages</div></section>
    {filtered.length ? <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">{filtered.map((page) => <article key={page.path} className="card-paper p-5 flex flex-col"><div className="flex items-center justify-between gap-3"><span className="text-[10px] font-black uppercase tracking-widest" style={{ color: 'var(--gold)' }}>{TYPE_LABELS[page.type]}</span><span className="text-xs" style={{ color: 'var(--subtle)' }}>Class {page.classLevel}</span></div><h2 className="text-xl mt-3 leading-snug" style={{ fontFamily: 'var(--font-serif)', color: 'var(--ink)' }}>{page.chapter}</h2><p className="text-sm mt-2 flex-1" style={{ color: 'var(--muted)' }}>{page.subject} · {page.label}</p><div className="flex gap-2 mt-5"><Link to={page.path} className="btn-primary flex-1 inline-flex items-center justify-center gap-2 text-sm">Practice <ArrowRight className="w-4 h-4" /></Link><Link to={page.notesPath} className="w-11 h-11 rounded-xl flex items-center justify-center" title="Read chapter notes" style={{ border: '1px solid var(--border)', color: 'var(--gold)' }}><BookOpen className="w-4 h-4" /></Link></div></article>)}</div> : <div className="card-paper p-10 text-center"><Search className="w-8 h-8 mx-auto" style={{ color: 'var(--gold)' }} /><h2 className="text-2xl mt-4" style={{ fontFamily: 'var(--font-serif)', color: 'var(--ink)' }}>No matching practice page</h2><p className="text-sm mt-2" style={{ color: 'var(--muted)' }}>Try clearing a filter or using a broader chapter name.</p></div>}
    </main>
  </div>;
}
