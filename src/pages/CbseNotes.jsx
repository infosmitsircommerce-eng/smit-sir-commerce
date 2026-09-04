import { Link } from 'react-router-dom';
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Download,
  FileQuestion,
  FileText,
} from 'lucide-react';
import SEO from '../components/ui/SEO';
import { getHubMaterials, seoHubs } from '../data/seoMaterials';

const PATH = '/cbse-notes';
const TITLE = 'Free CBSE Commerce Notes Class 11 & 12 PDF Download';
const DESCRIPTION = 'Download free CBSE Commerce notes for Class 11 and 12. Get chapter-wise PDF notes for Business Studies, Microeconomics and Macroeconomics with no registration required.';

const faqItems = [
  {
    question: 'Are these CBSE Commerce notes free?',
    answer: 'Yes. The notes available through this library can be viewed online or downloaded free. No registration is required to open the public study material.',
  },
  {
    question: 'Which Class 11 Commerce notes are available?',
    answer: 'The Class 11 collection currently includes chapter-wise Microeconomics notes. Each available chapter has its own page with a PDF, key topics and exam-focused revision guidance.',
  },
  {
    question: 'Which Class 12 Commerce notes are available?',
    answer: 'The Class 12 collection includes Business Studies notes and Macroeconomics notes. The library is organised by subject and chapter so students can open the exact topic they need.',
  },
  {
    question: 'Can I download the CBSE notes PDF?',
    answer: 'Yes. Where a chapter PDF is available, students can view it online and use the download option from the chapter page.',
  },
  {
    question: 'How should I use these notes for exam preparation?',
    answer: 'Read one chapter, revise its key concepts and definitions, then practise questions from the same chapter. After that, use sample-paper and exam-preparation resources to test recall and application.',
  },
];

const structuredData = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'CollectionPage',
      '@id': `https://www.smitsircommerce.in${PATH}#collection`,
      name: TITLE,
      description: DESCRIPTION,
      url: `https://www.smitsircommerce.in${PATH}`,
      isAccessibleForFree: true,
      inLanguage: 'en-IN',
      about: [
        'CBSE Class 11 Commerce notes',
        'CBSE Class 12 Commerce notes',
        'Economics notes',
        'Business Studies notes',
        'Microeconomics notes',
        'Macroeconomics notes',
      ],
    },
    {
      '@type': 'FAQPage',
      mainEntity: faqItems.map((item) => ({
        '@type': 'Question',
        name: item.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: item.answer,
        },
      })),
    },
  ],
};

export default function CbseNotes() {
  const allNotes = seoHubs.flatMap((hub) => getHubMaterials(hub.id));
  const totalChapters = allNotes.length;
  const priorityPaths = new Set([
    '/cbse/class-12/business-studies/controlling-notes',
    '/cbse/class-11/microeconomics/economics-and-economy-notes',
  ]);
  const priorityNotes = allNotes.filter((material) => priorityPaths.has(material.seo_path));
  const popularNotes = [
    ...priorityNotes,
    ...allNotes.filter((material) => !priorityPaths.has(material.seo_path)).slice(0, 4),
  ];

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-ivory)' }}>
      <SEO title={TITLE} description={DESCRIPTION} path={PATH} structuredData={structuredData} />

      <section className="page-hero">
        <div className="page-container">
          <nav className="text-sm mb-6 flex items-center gap-2" style={{ color: 'var(--muted)' }}>
            <Link to="/">Home</Link>
            <span>/</span>
            <span style={{ color: 'var(--gold)' }}>Free CBSE Commerce Notes</span>
          </nav>

          <div className="max-w-4xl">
            <span className="eyebrow">Free study material • No registration</span>
            <h1 className="mt-5">Free CBSE Commerce Notes for Class 11 &amp; 12</h1>
            <p className="mt-5 text-lg leading-relaxed" style={{ color: 'var(--muted)' }}>
              Find free CBSE Commerce notes for Class 11 and Class 12 in one organised library. Open chapter-wise PDF notes for Economics and Business Studies, revise the important concepts, and move directly into practice for the same topic.
            </p>
            <p className="mt-3 leading-7" style={{ color: 'var(--muted)' }}>
              The aim is simple: instead of searching for scattered PDFs, students can choose a class, subject and chapter, study the notes online or download the PDF, then continue with practice and exam-preparation resources on the same website.
            </p>

            <div className="flex flex-wrap gap-3 mt-7">
              <span className="tile-paper px-4 py-2 text-sm inline-flex items-center gap-2">
                <BookOpen className="w-4 h-4" style={{ color: 'var(--gold)' }} /> Classes 11 &amp; 12
              </span>
              <span className="tile-paper px-4 py-2 text-sm inline-flex items-center gap-2">
                <FileText className="w-4 h-4" style={{ color: 'var(--gold)' }} /> {totalChapters} chapter PDFs
              </span>
              <span className="tile-paper px-4 py-2 text-sm inline-flex items-center gap-2">
                <Download className="w-4 h-4" style={{ color: 'var(--gold)' }} /> Free view and download
              </span>
            </div>
          </div>
        </div>
      </section>

      <main className="page-container section-padding">
        <section>
          <span className="eyebrow">Choose your class and subject</span>
          <h2 className="text-3xl mt-3 mb-3" style={{ fontFamily: 'var(--font-serif)', color: 'var(--ink)' }}>
            CBSE Commerce notes by class and subject
          </h2>
          <p className="max-w-3xl leading-7 mb-8" style={{ color: 'var(--muted)' }}>
            Start with the subject you are studying now. Every collection below links to its available chapters, so you can reach a specific notes PDF without browsing through unrelated material.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {seoHubs.map((hub) => {
              const chapters = getHubMaterials(hub.id);
              return (
                <article key={hub.id} className="card-paper p-6 flex flex-col">
                  <div className="text-xs font-bold tracking-widest uppercase mb-3" style={{ color: 'var(--gold)' }}>
                    CBSE Class {hub.classLevel}
                  </div>
                  <h3 className="text-2xl mb-3" style={{ fontFamily: 'var(--font-serif)', color: 'var(--ink)' }}>
                    {hub.label} Notes PDF
                  </h3>
                  <p className="text-sm leading-relaxed mb-5 flex-1" style={{ color: 'var(--muted)' }}>
                    {hub.intro}
                  </p>
                  <div className="text-sm mb-5" style={{ color: 'var(--subtle)' }}>
                    {chapters.length} {chapters.length === 1 ? 'chapter' : 'chapters'} currently available
                  </div>
                  <Link to={hub.path} className="btn-primary inline-flex items-center justify-center gap-2">
                    Open free notes <ArrowRight className="w-4 h-4" />
                  </Link>
                </article>
              );
            })}
          </div>
        </section>

        <section className="mt-12 card-paper p-6 md:p-8">
          <span className="eyebrow">What you can study here</span>
          <h2 className="text-3xl mt-3" style={{ fontFamily: 'var(--font-serif)', color: 'var(--ink)' }}>
            Free Commerce notes built for chapter-wise revision
          </h2>
          <div className="grid md:grid-cols-2 gap-7 mt-7">
            <div>
              <h3 className="text-xl font-semibold" style={{ color: 'var(--ink)' }}>CBSE Class 11 Commerce notes</h3>
              <p className="mt-3 text-sm leading-7" style={{ color: 'var(--muted)' }}>
                Class 11 students can use the Microeconomics collection to build their foundation chapter by chapter. The available material covers core concepts such as scarcity and choice, demand, production, cost, revenue and market-related topics as the collection develops.
              </p>
              <Link to="/cbse/class-11/microeconomics-notes" className="font-semibold text-sm inline-flex items-center gap-1 mt-4" style={{ color: 'var(--gold)' }}>
                Open Class 11 Economics notes <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div>
              <h3 className="text-xl font-semibold" style={{ color: 'var(--ink)' }}>CBSE Class 12 Commerce notes</h3>
              <p className="mt-3 text-sm leading-7" style={{ color: 'var(--muted)' }}>
                Class 12 students can revise Business Studies chapter by chapter and use the available Macroeconomics notes for concept clarity. The subject hubs keep every PDF connected to the exact chapter it belongs to.
              </p>
              <div className="flex flex-wrap gap-4 mt-4">
                <Link to="/cbse/class-12/business-studies-notes" className="font-semibold text-sm inline-flex items-center gap-1" style={{ color: 'var(--gold)' }}>
                  Business Studies notes <ArrowRight className="w-4 h-4" />
                </Link>
                <Link to="/cbse/class-12/macroeconomics-notes" className="font-semibold text-sm inline-flex items-center gap-1" style={{ color: 'var(--gold)' }}>
                  Macroeconomics notes <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-12">
          <span className="eyebrow">Google is already finding these chapters</span>
          <h2 className="text-3xl mt-3 mb-7" style={{ fontFamily: 'var(--font-serif)', color: 'var(--ink)' }}>
            High-priority free CBSE Commerce notes PDFs
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            {popularNotes.map((material) => (
              <Link key={material.id} to={material.seo_path} className="card-paper p-5 flex items-center justify-between gap-4">
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: 'var(--gold)' }}>
                    CBSE Class {material.class_level} · Chapter {material.chapterNumber}
                  </div>
                  <span className="font-semibold" style={{ color: 'var(--ink)' }}>
                    {material.chapter} notes PDF
                  </span>
                </div>
                <ArrowRight className="w-5 h-5 shrink-0" style={{ color: 'var(--gold)' }} />
              </Link>
            ))}
          </div>
        </section>

        <section className="mt-12">
          <span className="eyebrow">A better revision flow</span>
          <h2 className="text-3xl mt-3 mb-7" style={{ fontFamily: 'var(--font-serif)', color: 'var(--ink)' }}>
            How to use these Commerce notes effectively
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              ['1', 'Read the chapter', 'Start with the chapter PDF and understand the meaning of each concept before trying to memorise it.'],
              ['2', 'Mark key points', 'Focus on definitions, formulas, diagrams, differences and headings that are useful during revision.'],
              ['3', 'Practise immediately', 'Attempt questions from the same chapter while the concepts are fresh instead of postponing practice.'],
              ['4', 'Test your recall', 'Return to sample-paper and exam-preparation resources to check whether you can apply what you studied.'],
            ].map(([number, heading, text]) => (
              <article key={number} className="card-paper p-5">
                <div className="w-9 h-9 rounded-full flex items-center justify-center font-bold mb-4" style={{ background: 'var(--gold-soft)', color: 'var(--gold)' }}>
                  {number}
                </div>
                <h3 className="font-semibold" style={{ color: 'var(--ink)' }}>{heading}</h3>
                <p className="text-sm leading-6 mt-2" style={{ color: 'var(--muted)' }}>{text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="grid md:grid-cols-2 gap-5 mt-12">
          <Link to="/cbse-practice" className="card-paper p-6 group">
            <FileQuestion className="w-7 h-7" style={{ color: 'var(--gold)' }} />
            <h2 className="text-2xl mt-4" style={{ fontFamily: 'var(--font-serif)', color: 'var(--ink)' }}>
              Finished reading? Practise the same chapter.
            </h2>
            <p className="text-sm leading-7 mt-2" style={{ color: 'var(--muted)' }}>
              Move from notes into MCQs, important questions, revision, case studies and numericals mapped to chapters.
            </p>
            <span className="font-semibold text-sm inline-flex items-center gap-1 mt-4" style={{ color: 'var(--gold)' }}>
              Open practice library <ArrowRight className="w-4 h-4" />
            </span>
          </Link>

          <Link to="/cbse-pyq" className="card-paper p-6 group">
            <BookOpen className="w-7 h-7" style={{ color: 'var(--gold)' }} />
            <h2 className="text-2xl mt-4" style={{ fontFamily: 'var(--font-serif)', color: 'var(--ink)' }}>
              Continue into exam preparation.
            </h2>
            <p className="text-sm leading-7 mt-2" style={{ color: 'var(--muted)' }}>
              Use the growing exam-preparation hub after chapter revision. Verified PYQ material is distinguished from original practice material.
            </p>
            <span className="font-semibold text-sm inline-flex items-center gap-1 mt-4" style={{ color: 'var(--gold)' }}>
              Open exam-prep hub <ArrowRight className="w-4 h-4" />
            </span>
          </Link>
        </section>

        <section className="mt-12 max-w-4xl">
          <span className="eyebrow">Frequently asked questions</span>
          <h2 className="text-3xl mt-3 mb-7" style={{ fontFamily: 'var(--font-serif)', color: 'var(--ink)' }}>
            CBSE Commerce notes FAQ
          </h2>
          <div className="space-y-4">
            {faqItems.map((item) => (
              <article key={item.question} className="card-paper p-5 md:p-6">
                <h3 className="font-semibold flex items-start gap-3" style={{ color: 'var(--ink)' }}>
                  <CheckCircle2 className="w-5 h-5 mt-0.5 shrink-0" style={{ color: 'var(--gold)' }} />
                  {item.question}
                </h3>
                <p className="text-sm leading-7 mt-3 pl-8" style={{ color: 'var(--muted)' }}>{item.answer}</p>
              </article>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
