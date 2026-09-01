import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, FileQuestion, GraduationCap, Sparkles } from 'lucide-react';
import SEO from '../components/ui/SEO';
import { seoHubs, getHubMaterials } from '../data/seoMaterials';

const SITE_URL = 'https://www.smitsircommerce.in';
const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'CollectionPage',
  name: 'CBSE Commerce PYQ & Sample Paper Preparation',
  description: 'A preparation hub for CBSE Class 11 and 12 Commerce previous-year question and sample-paper practice.',
  url: `${SITE_URL}/cbse-pyq`,
  isAccessibleForFree: true,
  inLanguage: 'en-IN',
};

export default function PyqHub() {
  return <div className="min-h-screen" style={{ background: 'var(--bg-ivory)' }}>
    <SEO title="CBSE Commerce PYQ & Sample Paper Practice" description="Prepare for CBSE Class 11 and 12 Commerce with chapter notes, important questions and a growing PYQ/sample-paper practice library." path="/cbse-pyq" structuredData={structuredData} />
    <section className="page-hero"><div className="page-container"><span className="eyebrow">Exam preparation hub · Growing library</span><h1 className="mt-5 max-w-4xl">CBSE Commerce <em>PYQ & sample-paper preparation.</em></h1><p className="mt-5 max-w-3xl text-lg leading-relaxed" style={{ color: 'var(--muted)' }}>This section is being built carefully. Until verified previous-year papers are added, use the chapter-wise notes, original important questions and practice sets already available. We will never label original questions as official CBSE PYQs.</p><div className="flex flex-wrap gap-3 mt-7"><Link to="/cbse-practice" className="btn-primary inline-flex items-center gap-2"><FileQuestion className="w-4 h-4" /> Start exam practice</Link><Link to="/cbse-notes" className="btn-secondary inline-flex items-center gap-2"><BookOpen className="w-4 h-4" /> Revise notes</Link></div></div></section>
    <main className="page-container section-padding"><section><span className="eyebrow">Subject-wise preparation</span><h2 className="text-3xl mt-3 mb-7" style={{ fontFamily: 'var(--font-serif)', color: 'var(--ink)' }}>Prepare chapter by chapter</h2><div className="grid md:grid-cols-3 gap-5">{seoHubs.map((hub) => <article key={hub.id} className="card-paper p-6 flex flex-col"><GraduationCap className="w-7 h-7 mb-4" style={{ color: 'var(--gold)' }} /><div className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--gold)' }}>Class {hub.classLevel}</div><h3 className="text-2xl mt-2" style={{ fontFamily: 'var(--font-serif)', color: 'var(--ink)' }}>{hub.label}</h3><p className="text-sm leading-7 mt-3 flex-1" style={{ color: 'var(--muted)' }}>{getHubMaterials(hub.id).length} published chapters can already be revised before attempting exam-style practice.</p><Link to={hub.path} className="btn-outline-ink mt-5 inline-flex items-center justify-center gap-2">Open chapters <ArrowRight className="w-4 h-4" /></Link></article>)}</div></section>
    <section className="card-paper p-6 sm:p-8 mt-10"><div className="flex items-start gap-4"><Sparkles className="w-6 h-6 mt-1 flex-shrink-0" style={{ color: 'var(--gold)' }} /><div><h2 className="text-2xl" style={{ fontFamily: 'var(--font-serif)', color: 'var(--ink)' }}>What is coming here</h2><p className="mt-3 leading-7" style={{ color: 'var(--muted)' }}>Verified previous-year questions, official/sample-paper links where appropriate, year filters, subject filters, answer guidance and chapter mapping. The goal is a trustworthy exam library, not a page filled with unverified “PYQ” labels.</p></div></div></section>
    <section className="mt-10 rounded-3xl p-6 sm:p-9 text-center" style={{ background: 'var(--ink-bg)', color: 'var(--ivory-on-ink)' }}><span className="eyebrow eyebrow-on-ink">Want guided preparation?</span><h2 className="text-3xl mt-4" style={{ fontFamily: 'var(--font-serif)' }}>Study → practise → test → fix weak areas.</h2><p className="mt-3 max-w-2xl mx-auto" style={{ color: 'var(--muted-on-ink)' }}>Use the free library first. If you want help understanding difficult chapters, book a free demo class.</p><Link to="/book-demo" className="btn-primary inline-flex items-center gap-2 mt-6">Book Free Demo <ArrowRight className="w-4 h-4" /></Link></section></main>
  </div>;
}
