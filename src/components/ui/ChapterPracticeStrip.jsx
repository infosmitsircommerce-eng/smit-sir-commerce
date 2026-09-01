import { Link, useLocation } from 'react-router-dom';
import { ArrowRight, BrainCircuit } from 'lucide-react';
import { materialByPath } from '../../data/seoMaterials';
import { getGrowthPagesForMaterial } from '../../data/contentGrowth';

export default function ChapterPracticeStrip() {
  const { pathname } = useLocation();
  const material = materialByPath[pathname.replace(/\/$/, '')];
  if (!material) return null;
  const pages = getGrowthPagesForMaterial(material.id);
  if (!pages.length) return null;

  return <section className="page-container pb-12 lg:pb-16" aria-labelledby="chapter-practice-heading">
    <div className="card-paper p-5 sm:p-7 md:p-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div><span className="eyebrow">Now practise the chapter</span><h2 id="chapter-practice-heading" className="text-3xl mt-3" style={{ fontFamily: 'var(--font-serif)', color: 'var(--ink)' }}>{material.chapter} practice library</h2><p className="text-sm mt-2 max-w-2xl leading-relaxed" style={{ color: 'var(--muted)' }}>Reading is step one. Use these free chapter-specific sets to retrieve, apply and check what you actually remember.</p></div>
        <Link to="/cbse-practice" className="text-sm font-semibold inline-flex items-center gap-1" style={{ color: 'var(--gold)' }}>All Commerce practice <ArrowRight className="w-4 h-4" /></Link>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-6">
        {pages.map((page) => <Link key={page.path} to={page.path} className="tile-paper p-4 flex items-center justify-between gap-3 group"><div className="flex items-center gap-3 min-w-0"><div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'var(--gold-bg)', color: 'var(--gold)' }}><BrainCircuit className="w-4 h-4" /></div><div className="min-w-0"><div className="font-semibold text-sm" style={{ color: 'var(--ink)' }}>{page.label}</div><div className="text-xs mt-1 truncate" style={{ color: 'var(--muted)' }}>Class {page.classLevel} · {page.subject}</div></div></div><ArrowRight className="w-4 h-4 flex-shrink-0 transition-transform group-hover:translate-x-1" style={{ color: 'var(--gold)' }} /></Link>)}
      </div>
    </div>
  </section>;
}
