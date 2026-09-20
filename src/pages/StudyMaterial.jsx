import { ArrowRight, BookOpen, CheckCircle2, Crown, FileText, ListChecks, Search } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import SEO from '../components/ui/SEO';
import StudyAccessFinder from '../components/ui/StudyAccessFinder';\nimport { studyResourceStats } from '../data/studyAccess';

const PATH = '/study-material';
const TITLE = 'Commerce Notes Library — Free & Premium CBSE/GSEB Class 11 and 12 | Smit Sir Commerce';
const DESCRIPTION = 'Find free quick notes and detailed Premium Master notes for CBSE and GSEB Class 11 and 12 Commerce, organised by board, class, subject and chapter.';

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'CollectionPage',
  name: TITLE,
  description: DESCRIPTION,
  url: `https://www.smitsircommerce.in${PATH}`,
  isAccessibleForFree: true,
  about: ['Commerce notes', 'CBSE Commerce', 'GSEB Commerce', 'Class 11 Commerce', 'Class 12 Commerce', 'Economics', 'Business Studies', 'Accountancy', 'CCSP', 'Commercial Correspondence', 'Secretarial Practice'],
};

const steps = [
  ['1', 'Board', 'CBSE or GSEB'],
  ['2', 'Class', 'Class 11 or 12'],
  ['3', 'Subject', 'Pick one subject'],
  ['4', 'Chapter', 'Open notes or PDF'],
];

const nextActions = [
  { title: 'Chapter quizzes', text: 'Check what you understood.', to: '/quizzes', icon: ListChecks, tone: 'violet' },
  { title: 'Test series', text: 'Practise in exam format.', to: '/test-series', icon: CheckCircle2, tone: 'blue' },
  { title: 'Premium learning', text: 'Hard practice and deep revision.', to: '/premium', icon: Crown, tone: 'gold' },
];

function readLatestResource() {
  if (typeof window === 'undefined') return null;
  try {
    const items = JSON.parse(window.localStorage.getItem('ssc-resource-recents-v1') || '[]');
    return Array.isArray(items) && items.length ? items[0] : null;
  } catch {
    return null;
  }
}

export default function StudyMaterial() {
  const { search } = useLocation();
  const downloadsOnly = new URLSearchParams(search).get('view') === 'downloads';
  const recent = readLatestResource();

  return (
    <div className="ssc-resource-library min-h-screen">
      <SEO title={downloadsOnly ? 'Download Commerce Chapter PDFs — CBSE & GSEB' : TITLE} description={DESCRIPTION} path={PATH} structuredData={structuredData} />

      <header className="ssc-library-hero">
        <div className="page-container">
          <div className="ssc-library-hero-grid">
            <div>
              <span className="eyebrow">YOUR COMMERCE LIBRARY</span>
              <h1>{downloadsOnly ? 'Choose and download your chapter PDF.' : 'Find the right chapter without the searching.'}</h1>
              <p>Choose board, class and subject. Free Quick Notes and Detailed Premium Masters are labelled separately, so students can understand exactly what is available.</p>
              <div className="ssc-library-hero-actions">
                <a href="#chapter-finder" className="btn-primary"><Search className="w-4 h-4" /> Find my chapter</a>
                <Link to="/study-material?board=CBSE&class=12&subject=Accountancy#chapter-finder" className="btn-outline-ink"><BookOpen className="w-4 h-4" /> CBSE 12 Accounts</Link>\n                <Link to="/premium/cbse-12-business-studies" className="btn-outline-ink"><Crown className="w-4 h-4" /> BST Premium Masters</Link>
                <Link to="/study-material?board=GSEB&class=12&subject=CCSP#chapter-finder" className="btn-outline-ink"><FileText className="w-4 h-4" /> GSEB 12 CCSP</Link>
                <Link to="/gseb-class-11-accountancy-notes" className="btn-outline-ink"><BookOpen className="w-4 h-4" /> GSEB 11 Accounts</Link>
              </div>
            </div>
            {recent ? (
              <Link to={recent.path} className="ssc-library-continue" aria-label={`Continue ${recent.title}`}>
                <span>CONTINUE LEARNING</span>
                <FileText aria-hidden="true" />
                <strong>{recent.title}</strong>
                <small>{recent.board} · Class {recent.classLevel} · {recent.subject}</small>
                <b>Open again <ArrowRight aria-hidden="true" /></b>
              </Link>
            ) : (
              <div className="ssc-library-continue" aria-label="Simple four-step study path">
                <span>ONE SIMPLE PATH</span>
                <FileText aria-hidden="true" />
                <strong>Board → Class → Subject → Chapter</strong>
                <small>Your selection is remembered on this device.</small>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="page-container ssc-library-main">
        <ol className="ssc-library-steps" aria-label="How to find study material">
          {steps.map(([number, title, detail]) => (
            <li key={title}><span>{number}</span><div><strong>{title}</strong><small>{detail}</small></div></li>
          ))}
        </ol>

        {!downloadsOnly && (
          <section aria-labelledby="library-access-map" style={{ margin: '18px 0 24px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(150px,1fr))', gap: 12 }}>
              <div className="card-paper p-4" style={{ background: '#fff' }}>
                <small style={{ fontWeight: 900, letterSpacing: '.08em', color: '#687386' }}>PUBLISHED NOTES</small>
                <strong style={{ display: 'block', fontSize: 30, color: '#17284b', marginTop: 5 }}>{studyResourceStats.notesTotal}</strong>
                <span style={{ fontSize: 12, color: '#687386' }}>Across boards, classes and subjects</span>
              </div>
              <div className="card-paper p-4" style={{ background: 'linear-gradient(135deg,#effaf2,#fff)' }}>
                <small style={{ fontWeight: 900, letterSpacing: '.08em', color: '#21663a' }}>FREE NOTES</small>
                <strong style={{ display: 'block', fontSize: 30, color: '#174c2b', marginTop: 5 }}>{studyResourceStats.freeNotes}</strong>
                <span style={{ fontSize: 12, color: '#4f6f59' }}>Open PDFs and quick chapter revision</span>
              </div>
              <div className="card-paper p-4" style={{ background: 'linear-gradient(135deg,#17284b,#293e70)', color: '#fff', border: '1px solid rgba(244,212,134,.38)' }}>
                <small style={{ fontWeight: 900, letterSpacing: '.08em', color: '#f4d486' }}>PREMIUM MASTERS</small>
                <strong style={{ display: 'block', fontSize: 30, marginTop: 5 }}>{studyResourceStats.premiumNotes}</strong>
                <span style={{ fontSize: 12, color: '#d9e0ef' }}>Detailed protected resources for Premium students</span>
              </div>
              <Link to="/premium/cbse-12-business-studies" className="card-paper p-4" style={{ background: 'linear-gradient(135deg,#fff6d8,#fff)', textDecoration: 'none' }}>
                <small style={{ fontWeight: 900, letterSpacing: '.08em', color: '#8a6012' }}>NEW · CBSE 12 BST</small>
                <strong id="library-access-map" style={{ display: 'block', fontSize: 18, lineHeight: 1.25, color: '#17284b', marginTop: 7 }}>783-page Detailed Premium Master Library</strong>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, marginTop: 8, fontSize: 12, fontWeight: 900, color: '#8a6012' }}>Explore 12 chapters <ArrowRight size={14} /></span>
              </Link>
            </div>
            <div className="mt-4 rounded-2xl px-4 py-3" style={{ background: '#f8f4e9', border: '1px solid #eadfca' }}>
              <strong style={{ color: '#17284b' }}>FREE + PREMIUM, CLEARLY SEPARATED:</strong>
              <span style={{ marginLeft: 6, color: '#687386', fontSize: 13 }}>Older shorter BST PDFs remain available as “FREE Quick Notes”. The new long-form resources appear as “Detailed Premium Master”, so students do not confuse the two editions.</span>
            </div>
          </section>
        )}

        <section id="chapter-finder" className="ssc-library-finder-wrap">
          <StudyAccessFinder defaultKind="Notes" pdfOnly={downloadsOnly} />
        </section>

        <section className="ssc-library-next" aria-labelledby="after-notes-heading">
          <div><span className="eyebrow">AFTER YOUR NOTES</span><h2 id="after-notes-heading">Learn, practise, then test yourself.</h2></div>
          <div className="ssc-library-next-grid">
            {nextActions.map(({ title, text, to, icon: Icon, tone }) => (
              <Link key={title} to={to} data-tone={tone}><span><Icon aria-hidden="true" /></span><div><strong>{title}</strong><small>{text}</small></div><ArrowRight aria-hidden="true" /></Link>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
