import { ArrowRight, BookOpen, CheckCircle2, Crown, ExternalLink, FileText, ListChecks, Search } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import SEO from '../components/ui/SEO';
import StudyAccessFinder from '../components/ui/StudyAccessFinder';
import { studyAccessItems } from '../data/studyAccess';
import { netGsetFreePdfCount } from '../data/netGsetStats.js';

const PATH = '/study-material';
const TITLE = 'Free Commerce Notes PDF — CBSE & GSEB Class 11 and 12 | Smit Sir Commerce';
const DESCRIPTION = 'Find free CBSE and GSEB Class 11 and 12 Commerce notes by board, class, subject and chapter. Open chapter notes, download available PDFs and continue learning.';

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

const freeNotes = studyAccessItems.filter((item) => item.kind === 'Notes' && !item.path.startsWith('/premium'));
const freeCatalog = ['CBSE', 'GSEB'].map((board) => ({
  board,
  classes: [11, 12].map((classLevel) => ({
    classLevel,
    subjects: [...new Set(freeNotes.filter((item) => item.board === board && item.classLevel === classLevel).map((item) => item.subject))]
      .sort()
      .map((subject) => ({
        subject,
        items: freeNotes.filter((item) => item.board === board && item.classLevel === classLevel && item.subject === subject),
      })),
  })).filter((group) => group.subjects.length),
})).filter((group) => group.classes.length);

function FreeNoteLink({ item, number }) {
  const content = <><span className="ssc-free-note-number">{String(number).padStart(2, '0')}</span><span className="ssc-free-note-copy"><strong>{item.title}</strong><small>{item.pdf ? 'Free PDF · open or download' : 'Free chapter notes · read online'}</small></span><ExternalLink aria-hidden="true" /></>;
  return item.path.startsWith('/') ? <Link to={item.path} className="ssc-free-note-row">{content}</Link> : <a href={item.path} className="ssc-free-note-row">{content}</a>;
}

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
    <div className="ssc-resource-library">
      <SEO title={downloadsOnly ? 'Download Commerce Chapter PDFs — CBSE & GSEB' : TITLE} description={DESCRIPTION} path={PATH} structuredData={structuredData} />

      <header className="ssc-library-hero">
        <div className="page-container">
          <div className="ssc-library-hero-grid">
            <div>
              <span className="eyebrow">YOUR COMMERCE LIBRARY</span>
              <h1>{downloadsOnly ? 'Choose and download your chapter PDF.' : 'Find the right chapter without the searching.'}</h1>
              <p>Choose your board, class and subject. Only matching chapters appear, so your notes are always a few taps away.</p>
              <div className="ssc-library-hero-actions">
                <a href="#chapter-finder" className="btn-primary"><Search className="w-4 h-4" /> Find my chapter</a>
                <Link to="/study-material?board=CBSE&class=12&subject=Accountancy#chapter-finder" className="btn-outline-ink"><BookOpen className="w-4 h-4" /> CBSE 12 Accounts</Link>
                <Link to="/study-material?board=GSEB&class=12&subject=CCSP#chapter-finder" className="btn-outline-ink"><FileText className="w-4 h-4" /> GSEB 12 CCSP</Link>
                <Link to="/gseb-class-11-accountancy-notes" className="btn-outline-ink"><BookOpen className="w-4 h-4" /> GSEB 11 Accounts</Link>
                <a href="/net-gset-commerce" className="btn-outline-ink"><BookOpen className="w-4 h-4" /> NET/GSET {netGsetFreePdfCount} PDFs</a>
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
        <section className="ssc-free-catalog" aria-labelledby="free-library-heading">
          <div className="ssc-free-catalog-intro">
            <div><span className="eyebrow">CLASS 11–12 FREE NOTES — OPEN ACCESS</span><h2 id="free-library-heading">See every school-level free resource before choosing.</h2><p>The {freeNotes.length} Class 11–12 resources below are listed by board, class and subject. For competitive exams, the separate NET/GSET Commerce library contains {netGsetFreePdfCount} free detailed PDFs across all 10 units.</p></div>
            <span className="ssc-free-total"><strong>{freeNotes.length}</strong> Class 11–12 free resources</span>
          </div>
          <div className="ssc-free-boards">
            {freeCatalog.map((board) => (
              <section key={board.board} className="ssc-free-board" aria-label={`${board.board} free notes`}>
                <div className="ssc-free-board-heading"><span>BOARD</span><h3>{board.board}</h3><b>{board.classes.reduce((sum, item) => sum + item.subjects.reduce((count, subject) => count + subject.items.length, 0), 0)} resources</b></div>
                {board.classes.map((classGroup) => (
                  <div key={classGroup.classLevel} className="ssc-free-class">
                    <div className="ssc-free-class-heading"><span>{classGroup.classLevel}</span><h4>Class {classGroup.classLevel}</h4></div>
                    <div className="ssc-free-subjects">
                      {classGroup.subjects.map((subject) => (
                        <article key={subject.subject} className="ssc-free-subject">
                          <header><div><h5>{subject.subject}</h5><p>{subject.items.length} free chapter resource{subject.items.length === 1 ? '' : 's'}</p></div><span>FREE</span></header>
                          <div>{subject.items.map((item, index) => <FreeNoteLink key={item.id} item={item} number={index + 1} />)}</div>
                        </article>
                      ))}
                    </div>
                  </div>
                ))}
              </section>
            ))}
          </div>
        </section>

        <ol className="ssc-library-steps" aria-label="How to find study material">
          {steps.map(([number, title, detail]) => (
            <li key={title}><span>{number}</span><div><strong>{title}</strong><small>{detail}</small></div></li>
          ))}
        </ol>

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
