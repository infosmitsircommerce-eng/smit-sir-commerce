import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  BookOpen,
  Check,
  Clock3,
  Copy,
  Download,
  FileText,
  GraduationCap,
  LockKeyhole,
  MessageCircle,
  Share2,
  Sparkles,
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
  ['Do these PDFs contain Accountancy numericals?', 'This collection focuses on simple explanations, concepts and chapter formats. Detailed numerical practice will be published separately.'],
  ['Which chapter is currently missing?', 'Chapter 8 is still being prepared. Chapters 1–7, 9 and 10 are available now.'],
  ['Which Premium chapters will be free demos?', 'When the detailed numerical collection is published, Chapters 1 and 2 are planned as free demos. Chapters 3–10 will form the Premium numerical collection.'],
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

export default function GsebClass11AccountancyNotes() {
  const [notice, setNotice] = useState('');

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

  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(`${shareText}\n${PAGE_URL}`)}`;

  return (
    <div className="g11-accountancy-page">
      <SEO title={TITLE} description={DESCRIPTION} path={PATH} type="website" structuredData={structuredData} />

      <section className="g11-accountancy-hero">
        <div className="page-container">
          <nav className="g11-breadcrumb" aria-label="Breadcrumb">
            <Link to="/">Home</Link><span>/</span><Link to="/study-material">Study Material</Link><span>/</span><span>GSEB Class 11 Accountancy</span>
          </nav>

          <div className="g11-hero-grid">
            <div>
              <span className="g11-eyebrow"><GraduationCap aria-hidden="true" /> GSEB · CLASS 11 · ACCOUNTANCY</span>
              <h1>Free Accountancy Notes, <em>Chapter by Chapter.</em></h1>
              <p>Clear English-medium explanations for Gujarat Board students. Start with concepts and formats here; detailed numerical practice will stay in a separate collection.</p>
              <div className="g11-hero-actions">
                <a href="#free-chapters" className="g11-btn g11-btn-primary"><BookOpen aria-hidden="true" /> Open free chapters</a>
                <button type="button" className="g11-btn g11-btn-light" onClick={sharePage}><Share2 aria-hidden="true" /> Share this collection</button>
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
              <small>Chapter 8 will be uploaded later.</small>
            </aside>
          </div>
        </div>
      </section>

      <main>
        <section id="free-chapters" className="page-container g11-section">
          <div className="g11-section-heading">
            <div><span>FREE LIBRARY</span><h2>Choose your chapter</h2><p>Open the chapter page for details or download the PDF directly.</p></div>
            <div className="g11-share-mini">
              <button type="button" onClick={() => copyUrl(PAGE_URL)}><Copy aria-hidden="true" /> Copy link</button>
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" onClick={() => void trackEvent('resource_share_whatsapp', { placement: 'gseb_11_accountancy_hub' })}><MessageCircle aria-hidden="true" /> WhatsApp</a>
            </div>
          </div>

          <div className="g11-chapter-grid">
            {chapters.map((chapter, index) => {
              const available = chapter.available !== false && Boolean(chapter.file_url);
              return (
                <article key={chapter.chapterNumber} className={`g11-chapter-card tone-${index % 6}${available ? '' : ' is-missing'}`}>
                  <div className="g11-chapter-top">
                    <span className="g11-chapter-number">{String(chapter.chapterNumber).padStart(2, '0')}</span>
                    <span className={`g11-status ${available ? 'available' : ''}`}>{available ? 'FREE' : 'COMING SOON'}</span>
                  </div>
                  <h3>{available ? chapter.chapter : 'Chapter 8'}</h3>
                  <p>{available ? `${chapter.pages} pages · Simple explanation notes` : 'This chapter will be added when the checked PDF is ready.'}</p>
                  {available ? (
                    <div className="g11-chapter-actions">
                      <Link to={chapter.seo_path} onClick={() => trackChapter(chapter, 'view')}>View notes <ArrowRight aria-hidden="true" /></Link>
                      <a href={chapter.file_url} download target="_blank" rel="noopener noreferrer" aria-label={`Download ${chapter.title}`} onClick={() => trackChapter(chapter, 'download')}><Download aria-hidden="true" /></a>
                    </div>
                  ) : (
                    <div className="g11-coming-row"><Clock3 aria-hidden="true" /> Uploading later</div>
                  )}
                </article>
              );
            })}
          </div>
        </section>

        <section className="g11-premium-wrap">
          <div className="page-container g11-premium-grid">
            <div className="g11-premium-copy">
              <span><Sparkles aria-hidden="true" /> COMING NEXT</span>
              <h2>Detailed Numerical Practice</h2>
              <p>The future numerical collection will remain clearly separated from these free concept notes, so students always know exactly what they are opening.</p>
              <div className="g11-edition-grid">
                <div><strong>Chapters 1 & 2</strong><span>Free numerical demos</span></div>
                <div><strong>Chapters 3–10</strong><span>Premium numerical editions</span></div>
              </div>
              <p className="g11-honesty-note"><LockKeyhole aria-hidden="true" /> No unavailable PDF is being sold or shown as ready. The collection will open only after the detailed files are uploaded and checked.</p>
            </div>
            <aside className="g11-qr-card">
              <img src="/gseb-class-11-accountancy-notes-qr.svg" width="180" height="180" alt="QR code for the free GSEB Class 11 Accountancy notes collection" loading="lazy" />
              <strong>Open on your phone</strong>
              <p>Scan this QR code in class or share the collection link with a student.</p>
              <button type="button" onClick={() => copyUrl(PAGE_URL, 'Collection link')}><Copy aria-hidden="true" /> Copy collection link</button>
            </aside>
          </div>
        </section>

        <section className="page-container g11-section g11-study-guide">
          <div>
            <span className="g11-section-label">HOW TO USE THESE NOTES</span>
            <h2>Read less. Recall more.</h2>
          </div>
          <ol>
            <li><span>1</span><div><strong>Learn one idea</strong><p>Read one small concept or format instead of rushing through the entire PDF.</p></div></li>
            <li><span>2</span><div><strong>Close the notes</strong><p>Explain the idea aloud or write its meaning in your own words.</p></div></li>
            <li><span>3</span><div><strong>Use your textbook</strong><p>Match the concept with your prescribed GSEB examples and school work.</p></div></li>
            <li><span>4</span><div><strong>Practise separately</strong><p>Attempt written sums independently when numerical practice is available.</p></div></li>
          </ol>
        </section>

        <section className="page-container g11-section g11-faq">
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
