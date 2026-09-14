import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  BookOpen,
  Check,
  CheckCircle2,
  Clock3,
  Copy,
  Download,
  FileText,
  GraduationCap,
  LockKeyhole,
  MessageCircle,
  RotateCcw,
  Share2,
  Sparkles,
  Target,
  Trophy,
} from 'lucide-react';
import SEO from '../components/ui/SEO';
import { gsebFreeAccountancyMaterials } from '../data/gsebMaterials';
import { trackEvent } from '../lib/analytics';
import '../styles/gsebAccountancyHub.css';

const BASE = 'https://www.smitsircommerce.in';
const PATH = '/gseb-class-11-accountancy-notes';
const PAGE_URL = `${BASE}${PATH}`;
const TITLE = 'GSEB Class 11 Accountancy Notes PDF — Free Chapters';
const DESCRIPTION = 'Download free GSEB Class 11 Accountancy notes PDF for Chapters 1–7, 9 and 10. Simple English explanations without numericals, organised chapter-wise by Smit Sir Commerce.';

const chapters = Array.from({ length: 10 }, (_, index) => {
  const chapterNumber = index + 1;
  return gsebFreeAccountancyMaterials.find((item) => item.chapterNumber === chapterNumber) || {
    chapterNumber,
    title: 'Chapter 8 — Notes uploading soon',
    chapter: 'Chapter 8',
    available: false,
  };
});

const faqs = [
  ['Are these GSEB Class 11 Accountancy notes free?', 'Yes. Every currently available chapter in this collection can be opened or downloaded without payment or registration.'],
  ['Do these PDFs contain Accountancy numericals?', 'This free collection focuses on simple explanations, concepts and chapter formats. The separate Part 1 Premium Book contains the deeper accounting tables, worked numericals and exam practice.'],
  ['Which chapter is currently missing from the free collection?', 'Chapter 8 is not yet part of this free concept collection. Chapters 1–7, 9 and 10 are available free.'],
  ['Is the detailed Premium Part 1 collection ready?', 'Yes. The Premium Part 1 library covers Chapters 1–10 and shows every chapter, page count and included feature before access is unlocked.'],
];

const structuredData = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'CollectionPage',
      '@id': `${PAGE_URL}#collection`,
      url: PAGE_URL,
      name: TITLE,
      description: DESCRIPTION,
      inLanguage: 'en-IN',
      isAccessibleForFree: true,
      about: ['GSEB Class 11 Accountancy', 'Gujarat Board Accountancy notes', 'Accountancy notes PDF'],
      audience: { '@type': 'EducationalAudience', educationalRole: 'student', audienceType: 'GSEB Class 11 Commerce students' },
      publisher: { '@id': `${BASE}/#organization` },
      mainEntity: { '@id': `${PAGE_URL}#chapters` },
    },
    {
      '@type': 'ItemList',
      '@id': `${PAGE_URL}#chapters`,
      name: 'Free GSEB Class 11 Accountancy chapter notes',
      numberOfItems: gsebFreeAccountancyMaterials.length,
      itemListElement: gsebFreeAccountancyMaterials.map((chapter, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        item: {
          '@type': 'LearningResource',
          name: chapter.title,
          url: `${BASE}${chapter.seo_path}`,
          contentUrl: `${BASE}${chapter.file_url}`,
          learningResourceType: 'Concept notes PDF',
          educationalLevel: 'GSEB Class 11',
          teaches: chapter.keyTopics,
          isAccessibleForFree: true,
          inLanguage: 'en-IN',
        },
      })),
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: `${BASE}/` },
        { '@type': 'ListItem', position: 2, name: 'Study Material', item: `${BASE}/study-material` },
        { '@type': 'ListItem', position: 3, name: 'GSEB Class 11 Accountancy Notes', item: PAGE_URL },
      ],
    },
    {
      '@type': 'FAQPage',
      mainEntity: faqs.map(([question, answer]) => ({
        '@type': 'Question',
        name: question,
        acceptedAnswer: { '@type': 'Answer', text: answer },
      })),
    },
  ],
};

const shareText = 'Free GSEB Class 11 Accountancy chapter-wise notes — simple explanations by Smit Sir Commerce.';
const PROGRESS_KEY = 'ssc:gseb11-accountancy-quest:v1';

function readSavedProgress() {
  try {
    const saved = JSON.parse(window.localStorage.getItem(PROGRESS_KEY) || '[]');
    return Array.isArray(saved) ? saved.filter((value) => Number.isInteger(value) && value >= 1 && value <= 10 && value !== 8) : [];
  } catch {
    return [];
  }
}

export default function GsebClass11AccountancyNotes() {
  const [notice, setNotice] = useState('');
  const [completedChapters, setCompletedChapters] = useState(readSavedProgress);
  const completedSet = new Set(completedChapters);
  const progress = Math.round((completedChapters.length / gsebFreeAccountancyMaterials.length) * 100);
  const nextChapter = gsebFreeAccountancyMaterials.find((chapter) => !completedSet.has(chapter.chapterNumber)) || gsebFreeAccountancyMaterials[0];

  useEffect(() => {
    try {
      window.localStorage.setItem(PROGRESS_KEY, JSON.stringify(completedChapters));
    } catch {
      // Progress remains available for this visit when storage is unavailable.
    }
  }, [completedChapters]);

  const copyUrl = async (url, label = 'Page link') => {
    try {
      await navigator.clipboard.writeText(url);
      setNotice(`${label} copied`);
      window.setTimeout(() => setNotice(''), 2200);
      void trackEvent('resource_share_copy', { placement: 'gseb_11_accountancy_hub', label });
    } catch {
      setNotice('Copy was blocked. You can copy the address from your browser.');
    }
  };

  const sharePage = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: TITLE, text: shareText, url: PAGE_URL });
        void trackEvent('resource_share_native', { placement: 'gseb_11_accountancy_hub' });
        return;
      } catch (error) {
        if (error?.name === 'AbortError') return;
      }
    }
    await copyUrl(PAGE_URL);
  };

  const trackChapter = (chapter, action) => {
    void trackEvent('gseb_11_accountancy_chapter_click', {
      chapter: chapter.chapterNumber,
      action,
      collection: 'free_simple_explanation',
    });
  };

  const toggleChapter = (chapterNumber) => {
    const wasComplete = completedSet.has(chapterNumber);
    setCompletedChapters((current) => wasComplete
      ? current.filter((number) => number !== chapterNumber)
      : [...current, chapterNumber].sort((a, b) => a - b));
    void trackEvent('gseb_11_accountancy_progress', {
      chapter: chapterNumber,
      status: wasComplete ? 'not_studied' : 'studied',
    });
  };

  const resetProgress = () => {
    setCompletedChapters([]);
    setNotice('Study progress reset');
    window.setTimeout(() => setNotice(''), 2200);
    void trackEvent('gseb_11_accountancy_progress_reset');
  };

  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(`${shareText}\n${PAGE_URL}`)}`;

  return (
    <div className="g11-accountancy-page">
      <SEO title={TITLE} description={DESCRIPTION} path={PATH} type="website" structuredData={structuredData} />

      <section className="g11-accountancy-hero section-light">
        <div className="page-container">
          <nav className="g11-breadcrumb" aria-label="Breadcrumb">
            <Link to="/">Home</Link><span>/</span><Link to="/study-material">Study Material</Link><span>/</span><span>GSEB Class 11 Accountancy</span>
          </nav>

          <div className="g11-hero-grid">
            <div>
              <span className="g11-eyebrow"><GraduationCap aria-hidden="true" /> GSEB · CLASS 11 · ACCOUNTANCY</span>
              <h1>Free Accountancy Notes, <em>Chapter by Chapter.</em></h1>
              <p>Clear English-medium explanations for Gujarat Board students. Start with concepts and formats here; use the separate Premium Part 1 Book when you need detailed numericals and practical accounting work.</p>
              <div className="g11-hero-actions">
                <a href="#free-chapters" className="g11-btn g11-btn-primary"><BookOpen aria-hidden="true" /> Open free chapters</a>
                <a href="/gseb-class-11-accountancy-premium.html" className="g11-btn g11-btn-light" onClick={() => void trackEvent('gseb_11_accountancy_premium_preview', { placement: 'hero' })}><LockKeyhole aria-hidden="true" /> See Premium Part 1</a>
              </div>
              <div className="g11-proof-row" aria-label="Collection highlights">
                <span><Check aria-hidden="true" /> 9 PDFs available</span>
                <span><Check aria-hidden="true" /> No registration</span>
                <span><Check aria-hidden="true" /> Mobile friendly</span>
              </div>
            </div>

            <aside className="g11-hero-card" aria-label="Collection status">
              <div className="g11-book-mark"><FileText aria-hidden="true" /></div>
              <span>FREE CONCEPT EDITION</span>
              <strong>Chapters 1–7, 9 & 10</strong>
              <p>Simple explanations without a separate numerical practice set.</p>
              <div className="g11-progress"><i /><i /><i /><i /><i /><i /><i /><i className="missing" /><i /><i /></div>
              <small>Chapter 8 is available inside the separate Premium Part 1 collection.</small>
            </aside>
          </div>
        </div>
      </section>

      <main>
        <section id="free-chapters" className="page-container g11-section section-light">
          <div className="g11-section-heading">
            <div><span>FREE LIBRARY</span><h2>Choose your chapter</h2><p>Open the chapter page for details or download the PDF directly.</p></div>
            <div className="g11-share-mini">
              <button type="button" onClick={() => copyUrl(PAGE_URL)}><Copy aria-hidden="true" /> Copy link</button>
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" onClick={() => void trackEvent('resource_share_whatsapp', { placement: 'gseb_11_accountancy_hub' })}><MessageCircle aria-hidden="true" /> WhatsApp</a>
            </div>
          </div>

          <aside className="g11-quest" aria-labelledby="accountancy-quest-title">
            <div className="g11-quest-ring" style={{ '--quest-progress': `${progress}%` }} aria-label={`${progress}% of available chapters studied`}>
              <div><strong>{completedChapters.length}<small>/9</small></strong><span>studied</span></div>
            </div>
            <div className="g11-quest-copy">
              <span><Target aria-hidden="true" /> YOUR ACCOUNTANCY QUEST</span>
              <h3 id="accountancy-quest-title">{progress === 100 ? 'Quest complete. Foundation unlocked.' : 'Turn your notes into a visible win.'}</h3>
              <p>Tap a chapter number after studying it. Your progress stays saved on this device, and the smart button always takes you to the next unfinished chapter.</p>
              <div className="g11-quest-route" aria-label="Accountancy chapter progress">
                {chapters.map((chapter) => {
                  const available = chapter.available !== false && Boolean(chapter.file_url);
                  const complete = completedSet.has(chapter.chapterNumber);
                  return (
                    <button
                      type="button"
                      key={chapter.chapterNumber}
                      className={complete ? 'is-complete' : ''}
                      disabled={!available}
                      aria-label={available ? `${complete ? 'Unmark' : 'Mark'} Chapter ${chapter.chapterNumber} as studied` : 'Chapter 8 is Premium-only in this collection'}
                      aria-pressed={available ? complete : undefined}
                      onClick={() => available && toggleChapter(chapter.chapterNumber)}
                    >
                      {complete ? <Check aria-hidden="true" /> : chapter.chapterNumber}
                    </button>
                  );
                })}
              </div>
              <div className="g11-quest-actions">
                <Link to={nextChapter.seo_path} onClick={() => trackChapter(nextChapter, 'quest_continue')}>
                  {progress === 100 ? <Trophy aria-hidden="true" /> : <BookOpen aria-hidden="true" />}
                  {progress === 100 ? 'Revisit Chapter 1' : `Continue with Chapter ${nextChapter.chapterNumber}`}
                  <ArrowRight aria-hidden="true" />
                </Link>
                <button type="button" onClick={resetProgress} disabled={completedChapters.length === 0}><RotateCcw aria-hidden="true" /> Reset</button>
              </div>
            </div>
          </aside>

          <div className="g11-chapter-grid">
            {chapters.map((chapter, index) => {
              const available = chapter.available !== false && Boolean(chapter.file_url);
              return (
                <article key={chapter.chapterNumber} className={`g11-chapter-card tone-${index % 6}${available ? '' : ' is-missing'}${completedSet.has(chapter.chapterNumber) ? ' is-complete' : ''}`}>
                  <div className="g11-chapter-top">
                    <span className="g11-chapter-number">{String(chapter.chapterNumber).padStart(2, '0')}</span>
                    <span className={`g11-status ${available ? 'available' : ''}`}>{available ? 'FREE' : 'PREMIUM'}</span>
                  </div>
                  <h3>{available ? chapter.chapter : 'Chapter 8'}</h3>
                  <p>{available ? `${chapter.pages} pages · Simple explanation notes` : 'Detailed Chapter 8 is included in the Premium Part 1 Book.'}</p>
                  {available ? (
                    <>
                      <div className="g11-chapter-actions">
                        <Link to={chapter.seo_path} onClick={() => trackChapter(chapter, 'view')}>View notes <ArrowRight aria-hidden="true" /></Link>
                        <a href={chapter.file_url} download target="_blank" rel="noopener noreferrer" aria-label={`Download ${chapter.title}`} onClick={() => trackChapter(chapter, 'download')}><Download aria-hidden="true" /></a>
                      </div>
                      <button type="button" className="g11-mark-studied" aria-pressed={completedSet.has(chapter.chapterNumber)} onClick={() => toggleChapter(chapter.chapterNumber)}>
                        <CheckCircle2 aria-hidden="true" /> {completedSet.has(chapter.chapterNumber) ? 'Studied — tap to undo' : 'Mark chapter as studied'}
                      </button>
                    </>
                  ) : (
                    <a className="g11-coming-row" href="/gseb-class-11-accountancy-premium.html" onClick={() => void trackEvent('gseb_11_accountancy_premium_preview', { placement: 'chapter_8' })}><LockKeyhole aria-hidden="true" /> See Premium Chapter 8</a>
                  )}
                </article>
              );
            })}
          </div>
        </section>

        <section className="g11-premium-wrap">
          <div className="page-container g11-premium-grid">
            <div className="g11-premium-copy">
              <span><Sparkles aria-hidden="true" /> PREMIUM PART 1 · READY</span>
              <h2>Detailed Accountancy Part 1 Premium Book</h2>
              <p>The deeper practical collection is now organised separately from these free concept notes. Students can see every Premium chapter and page count before access is unlocked.</p>
              <div className="g11-edition-grid">
                <div><strong>10 Chapters</strong><span>Chapters 1–10 complete</span></div>
                <div><strong>720-page book</strong><span>Tables · numericals · practice</span></div>
              </div>
              <p className="g11-honesty-note"><LockKeyhole aria-hidden="true" /> The chapter catalogue is visible to everyone, but the actual Premium document is served only after the signed-in account passes the access check.</p>
              <a href="/gseb-class-11-accountancy-premium.html" className="g11-btn g11-btn-primary" onClick={() => void trackEvent('gseb_11_accountancy_premium_preview', { placement: 'premium_section' })}>See exactly what Premium includes <ArrowRight aria-hidden="true" /></a>
            </div>
            <aside className="g11-qr-card">
              <img src="/gseb-class-11-accountancy-notes-qr.svg" width="180" height="180" alt="QR code for the free GSEB Class 11 Accountancy notes collection" loading="lazy" />
              <strong>Open the free library on your phone</strong>
              <p>Scan this QR code in class or share the free collection link with a student.</p>
              <button type="button" onClick={() => copyUrl(PAGE_URL, 'Collection link')}><Copy aria-hidden="true" /> Copy collection link</button>
            </aside>
          </div>
        </section>

        <section className="page-container g11-section g11-study-guide section-light">
          <div>
            <span className="g11-section-label">HOW TO USE THESE NOTES</span>
            <h2>Read less. Recall more.</h2>
          </div>
          <ol>
            <li><span>1</span><div><strong>Learn one idea</strong><p>Read one small concept or format instead of rushing through the entire PDF.</p></div></li>
            <li><span>2</span><div><strong>Close the notes</strong><p>Explain the idea aloud or write its meaning in your own words.</p></div></li>
            <li><span>3</span><div><strong>Use your textbook</strong><p>Match the concept with your prescribed GSEB examples and school work.</p></div></li>
            <li><span>4</span><div><strong>Practise separately</strong><p>Use the Premium Part 1 practical collection when you need worked numericals and deeper accounting treatment.</p></div></li>
          </ol>
        </section>

        <section className="page-container g11-section g11-faq section-light">
          <span className="g11-section-label">STUDENT QUESTIONS</span>
          <h2>Frequently asked questions</h2>
          <div>
            {faqs.map(([question, answer]) => <details key={question}><summary>{question}</summary><p>{answer}</p></details>)}
          </div>
        </section>

        <section className="page-container g11-final-cta">
          <div><span>START WITH THE BASICS</span><h2>Open Chapter 1 and build the foundation.</h2></div>
          <Link to={gsebFreeAccountancyMaterials[0].seo_path} onClick={() => trackChapter(gsebFreeAccountancyMaterials[0], 'final_cta')}>Start Chapter 1 <ArrowRight aria-hidden="true" /></Link>
        </section>
      </main>

      <p className="sr-only" aria-live="polite">{notice}</p>
      {notice && <div className="g11-toast" role="status">{notice}</div>}
    </div>
  );
}
