import { Link, useLocation } from 'react-router-dom';
import { ArrowRight, BookOpen, CalendarDays, Download, FileText, UserRound } from 'lucide-react';
import SEO from '../components/ui/SEO';
import { getHubMaterials, getHubStructuredData, hubByPath, seoHubs } from '../data/seoMaterials';

const guideByHub = {
  'class-12-business-studies': ['/cbse/class-12/business-studies-important-questions', 'Class 12 BST Important Questions'],
  'class-11-microeconomics': ['/cbse/class-11/economics-numericals', 'Class 11 Economics Numericals'],
  'class-12-macroeconomics': ['/cbse/class-12/economics-revision-guide', 'Class 12 Economics Revision Guide'],
};

export default function SeoMaterialHub() {
  const { pathname } = useLocation();
  const hub = hubByPath[pathname.replace(/\/$/, '')];
  if (!hub) return <div className="min-h-screen flex items-center justify-center px-4" style={{ background: 'var(--bg-ivory)' }}><SEO title="Study Material Not Found" description="The requested study-material collection could not be found." path={pathname} noindex /><div className="card-paper max-w-lg w-full p-8 text-center"><h1 className="text-2xl mb-3" style={{ fontFamily: 'var(--font-serif)', color: 'var(--ink)' }}>Collection not found</h1><Link to="/study-material" className="btn-primary inline-flex items-center gap-2">Browse study material</Link></div></div>;

  const materials = getHubMaterials(hub.id);
  const relatedHubs = seoHubs.filter((item) => item.id !== hub.id);
  const guide = guideByHub[hub.id];
  const latestUpdated = materials.map((m) => m.updated).sort().at(-1) || '2026-08-31';
  const formattedUpdated = new Intl.DateTimeFormat('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(`${latestUpdated}T00:00:00`));
  const faqs = [
    [`Are these ${hub.label} notes free?`, 'Yes. Every PDF currently published in this collection can be opened and downloaded without payment or registration.'],
    [`How should I use these ${hub.label} notes?`, 'Read the chapter overview, revise the listed concepts, open the full PDF and then practise the chapter questions or numericals before moving to a timed test.'],
    ['Are these official CBSE previous-year papers?', 'No. Notes and original practice on Smit Sir Commerce are not presented as official CBSE papers. Use the latest official CBSE curriculum and sample papers for current board requirements.'],
  ];
  const baseSchema = getHubStructuredData(hub);
  const structuredData = { '@context': 'https://schema.org', '@graph': [...(baseSchema['@graph'] || []), { '@type': 'FAQPage', mainEntity: faqs.map(([q,a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })) }] };

  return <div className="min-h-screen" style={{ background: 'var(--bg-ivory)' }}>
    <SEO title={hub.seoTitle} description={hub.description} path={hub.path} structuredData={structuredData} />
    <section className="page-hero"><div className="page-container"><nav aria-label="Breadcrumb" className="text-sm mb-6 flex flex-wrap items-center gap-2" style={{ color: 'var(--muted)' }}><Link to="/">Home</Link><span>/</span><Link to="/study-material">Study Material</Link><span>/</span><span style={{ color: 'var(--gold)' }}>{hub.label}</span></nav><div className="max-w-4xl"><span className="eyebrow">Free CBSE chapter-wise PDFs</span><h1 className="mt-5">{hub.seoTitle}</h1><p className="mt-5 text-lg leading-relaxed" style={{ color: 'var(--muted)' }}>{hub.intro}</p><div className="flex flex-wrap gap-3 mt-7"><span className="tile-paper px-4 py-2 text-sm inline-flex items-center gap-2"><BookOpen className="w-4 h-4" style={{ color: 'var(--gold)' }} /> {materials.length} chapters available</span><span className="tile-paper px-4 py-2 text-sm inline-flex items-center gap-2"><Download className="w-4 h-4" style={{ color: 'var(--gold)' }} /> Free viewing and downloads</span><span className="tile-paper px-4 py-2 text-sm inline-flex items-center gap-2"><CalendarDays className="w-4 h-4" style={{ color: 'var(--gold)' }} /> Updated {formattedUpdated}</span></div></div></div></section>

    <main className="page-container section-padding">
      <section className="grid md:grid-cols-[1fr_320px] gap-5 mb-12"><div className="card-paper p-6"><div className="flex items-center gap-3"><UserRound className="w-6 h-6" style={{ color: 'var(--gold)' }} /><h2 className="text-2xl" style={{ fontFamily: 'var(--font-serif)', color: 'var(--ink)' }}>Prepared by Smit Sir</h2></div><p className="mt-3 leading-7" style={{ color: 'var(--muted)' }}>This collection is organised for Class {hub.classLevel} Commerce students with chapter-level notes, revision prompts and practice links. Published resources are kept separate by class and subject so students can reach the correct material quickly.</p><Link to="/about" className="mt-4 inline-flex items-center gap-2 text-sm font-semibold" style={{ color: 'var(--gold)' }}>About the teacher <ArrowRight className="w-4 h-4" /></Link></div>{guide && <Link to={guide[0]} className="card-paper p-6 flex flex-col justify-between gap-5"><div><span className="eyebrow">Revision hub</span><h2 className="text-2xl mt-3" style={{ fontFamily: 'var(--font-serif)', color: 'var(--ink)' }}>{guide[1]}</h2><p className="text-sm leading-7 mt-3" style={{ color: 'var(--muted)' }}>Move from reading notes to focused question practice and revision.</p></div><span className="font-semibold inline-flex items-center gap-2" style={{ color: 'var(--gold)' }}>Open revision guide <ArrowRight className="w-4 h-4" /></span></Link>}</section>

      <div className="flex items-end justify-between gap-4 mb-8"><div><span className="eyebrow">Complete collection</span><h2 className="text-3xl mt-3" style={{ fontFamily: 'var(--font-serif)', color: 'var(--ink)' }}>Choose a chapter</h2></div><Link to="/study-material" className="text-sm font-semibold hidden sm:inline-flex items-center gap-1" style={{ color: 'var(--gold)' }}>View all resources <ArrowRight className="w-4 h-4" /></Link></div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">{materials.map((material) => <article key={material.id} className="card-paper p-6 flex gap-4 items-start"><div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'var(--gold-bg)', border: '1px solid rgba(184,135,47,0.22)', color: 'var(--gold)', fontFamily: 'var(--font-serif)', fontWeight: 700 }}>{material.chapterNumber}</div><div className="flex-1 min-w-0"><div className="text-xs font-semibold mb-2" style={{ color: 'var(--gold)' }}>CBSE CLASS {material.class_level}</div><h2 className="text-xl leading-snug mb-2" style={{ fontFamily: 'var(--font-serif)', color: 'var(--ink)' }}><Link to={material.seo_path}>{material.chapter}</Link></h2><p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--muted)' }}>{material.summary}</p><div className="flex flex-wrap items-center gap-3 text-xs" style={{ color: 'var(--subtle)' }}><span>{material.pages} pages</span><span>•</span><span>Free PDF</span></div><Link to={material.seo_path} className="mt-4 inline-flex items-center gap-2 text-sm font-semibold" style={{ color: 'var(--gold)' }}>Open chapter notes <ArrowRight className="w-4 h-4" /></Link></div></article>)}</div>

      <section className="card-paper p-7 md:p-9 mt-12"><div className="flex items-start gap-4"><FileText className="w-8 h-8 flex-shrink-0" style={{ color: 'var(--gold)' }} /><div><h2 className="text-2xl mb-3" style={{ fontFamily: 'var(--font-serif)', color: 'var(--ink)' }}>How to use these notes</h2><p className="leading-relaxed" style={{ color: 'var(--muted)' }}>Read the chapter overview first, revise the listed key topics, and then open the complete PDF. Use the exam-focus points as a final checklist before practising questions. Every resource is prepared for concept clarity and quick CBSE revision.</p></div></div></section>

      <section className="card-paper p-7 md:p-9 mt-8"><h2 className="text-2xl mb-5" style={{ fontFamily: 'var(--font-serif)', color: 'var(--ink)' }}>Frequently asked questions</h2><div className="divide-y" style={{ borderColor: 'var(--border-soft)' }}>{faqs.map(([q,a],index) => <details key={q} className="py-4" open={index===0}><summary className="cursor-pointer font-semibold" style={{ color: 'var(--ink)' }}>{q}</summary><p className="mt-3 leading-7" style={{ color: 'var(--muted)' }}>{a}</p></details>)}</div></section>

      <section className="mt-12"><span className="eyebrow">More free Commerce resources</span><h2 className="text-3xl mt-3 mb-6" style={{ fontFamily: 'var(--font-serif)', color: 'var(--ink)' }}>Explore notes for other CBSE subjects</h2><div className="grid grid-cols-1 md:grid-cols-2 gap-4">{relatedHubs.map((related) => <Link key={related.id} to={related.path} className="card-paper p-5 flex items-center justify-between gap-4"><span className="font-semibold" style={{ color: 'var(--ink)' }}>Free {related.label} notes PDF</span><ArrowRight className="w-5 h-5 flex-shrink-0" style={{ color: 'var(--gold)' }} /></Link>)}</div><Link to="/cbse-notes" className="mt-5 inline-flex items-center gap-2 text-sm font-semibold" style={{ color: 'var(--gold)' }}>Browse all free CBSE Commerce notes <ArrowRight className="w-4 h-4" /></Link></section>
    </main>
  </div>;
}
