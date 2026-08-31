import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, Download, FileText } from 'lucide-react';
import SEO from '../components/ui/SEO';
import { getHubMaterials, seoHubs } from '../data/seoMaterials';

const PATH = '/cbse-notes';
const TITLE = 'Free CBSE Notes for Class 11 & 12 Commerce';
const DESCRIPTION = 'Free CBSE Commerce notes for Class 11 and 12. View and download chapter-wise PDF notes for Business Studies, Microeconomics and Macroeconomics.';

const structuredData = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'CollectionPage',
      '@id': `https://www.smitsircommerce.in${PATH}#page`,
      name: TITLE,
      description: DESCRIPTION,
      url: `https://www.smitsircommerce.in${PATH}`,
      isAccessibleForFree: true,
      inLanguage: 'en-IN',
      about: ['CBSE notes', 'Class 11 Commerce notes', 'Class 12 Commerce notes'],
      mainEntity: {
        '@type': 'ItemList',
        numberOfItems: seoHubs.length,
        itemListElement: seoHubs.map((hub, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          name: hub.label,
          url: `https://www.smitsircommerce.in${hub.path}`,
        })),
      },
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.smitsircommerce.in/' },
        { '@type': 'ListItem', position: 2, name: 'Free CBSE Notes', item: `https://www.smitsircommerce.in${PATH}` },
      ],
    },
  ],
};

export default function CbseNotes() {
  const totalChapters = seoHubs.reduce((total, hub) => total + getHubMaterials(hub.id).length, 0);
  const popularNotes = seoHubs.flatMap((hub) => getHubMaterials(hub.id).slice(0, 2));

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-ivory)' }}>
      <SEO title={TITLE} description={DESCRIPTION} path={PATH} structuredData={structuredData} />

      <section className="page-hero">
        <div className="page-container">
          <nav aria-label="Breadcrumb" className="text-sm mb-6 flex items-center gap-2" style={{ color: 'var(--muted)' }}>
            <Link to="/">Home</Link><span>/</span><span style={{ color: 'var(--gold)' }}>Free CBSE Notes</span>
          </nav>

          <div className="max-w-4xl">
            <span className="eyebrow">Free study material • No registration</span>
            <h1 className="mt-5">Free CBSE Notes for Class 11 &amp; 12 Commerce</h1>
            <p className="mt-5 text-lg leading-relaxed" style={{ color: 'var(--muted)' }}>
              Study chapter by chapter with free CBSE Commerce notes prepared for clear concepts and board-exam revision. Choose Business Studies, Microeconomics or Macroeconomics, then view the complete PDF online or download it for later.
            </p>
            <div className="flex flex-wrap gap-3 mt-7">
              <span className="tile-paper px-4 py-2 text-sm inline-flex items-center gap-2"><BookOpen className="w-4 h-4" style={{ color: 'var(--gold)' }} /> Classes 11 &amp; 12</span>
              <span className="tile-paper px-4 py-2 text-sm inline-flex items-center gap-2"><FileText className="w-4 h-4" style={{ color: 'var(--gold)' }} /> {totalChapters} chapter PDFs</span>
              <span className="tile-paper px-4 py-2 text-sm inline-flex items-center gap-2"><Download className="w-4 h-4" style={{ color: 'var(--gold)' }} /> Free view and download</span>
            </div>
          </div>
        </div>
      </section>

      <main className="page-container section-padding">
        <section aria-labelledby="subjects-heading">
          <span className="eyebrow">Choose your subject</span>
          <h2 id="subjects-heading" className="text-3xl mt-3 mb-8" style={{ fontFamily: 'var(--font-serif)', color: 'var(--ink)' }}>
            CBSE Commerce notes by class and subject
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {seoHubs.map((hub) => {
              const chapters = getHubMaterials(hub.id);
              return (
                <article key={hub.id} className="card-paper p-6 flex flex-col">
                  <div className="text-xs font-bold tracking-widest uppercase mb-3" style={{ color: 'var(--gold)' }}>
                    CBSE Class {hub.classLevel}
                  </div>
                  <h2 className="text-2xl leading-snug mb-3" style={{ fontFamily: 'var(--font-serif)', color: 'var(--ink)' }}>
                    {hub.subject} Notes
                  </h2>
                  <p className="text-sm leading-relaxed mb-5 flex-1" style={{ color: 'var(--muted)' }}>{hub.intro}</p>
                  <div className="text-sm mb-5" style={{ color: 'var(--subtle)' }}>{chapters.length} chapter{chapters.length === 1 ? '' : 's'} available</div>
                  <Link to={hub.path} className="btn-primary inline-flex items-center justify-center gap-2">
                    Open free notes <ArrowRight className="w-4 h-4" />
                  </Link>
                </article>
              );
            })}
          </div>
        </section>

        <section className="card-paper p-7 md:p-9 mt-12">
          <h2 className="text-2xl mb-4" style={{ fontFamily: 'var(--font-serif)', color: 'var(--ink)' }}>How these free CBSE notes help</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-sm leading-relaxed" style={{ color: 'var(--muted)' }}>
            <p><strong style={{ color: 'var(--ink)' }}>Learn clearly:</strong> begin with concise chapter summaries and important concepts before opening the complete notes.</p>
            <p><strong style={{ color: 'var(--ink)' }}>Revise faster:</strong> use chapter-wise PDFs and exam-focus checklists instead of searching through one large book.</p>
            <p><strong style={{ color: 'var(--ink)' }}>Study anywhere:</strong> view every PDF in the browser or download it free for offline revision.</p>
          </div>
        </section>

        <section className="mt-12" aria-labelledby="popular-notes-heading">
          <span className="eyebrow">Start with a chapter</span>
          <h2 id="popular-notes-heading" className="text-3xl mt-3 mb-7" style={{ fontFamily: 'var(--font-serif)', color: 'var(--ink)' }}>Popular free CBSE Commerce notes</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {popularNotes.map((material) => <Link key={material.id} to={material.seo_path} className="card-paper p-5 flex items-center justify-between gap-4"><div><div className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: 'var(--gold)' }}>Class {material.class_level} · Chapter {material.chapterNumber}</div><span className="font-semibold" style={{ color: 'var(--ink)' }}>{material.chapter} notes PDF</span></div><ArrowRight className="w-5 h-5 flex-shrink-0" style={{ color: 'var(--gold)' }} /></Link>)}
          </div>
        </section>

        <section className="mt-12 max-w-4xl">
          <h2 className="text-3xl mb-5" style={{ fontFamily: 'var(--font-serif)', color: 'var(--ink)' }}>Frequently asked questions</h2>
          <div className="space-y-4">
            <article className="card-paper p-6"><h3 className="font-semibold mb-2" style={{ color: 'var(--ink)' }}>Are these CBSE notes completely free?</h3><p className="text-sm leading-relaxed" style={{ color: 'var(--muted)' }}>Yes. Students can view and download every published PDF without paying or creating an account.</p></article>
            <article className="card-paper p-6"><h3 className="font-semibold mb-2" style={{ color: 'var(--ink)' }}>Which Commerce subjects are available?</h3><p className="text-sm leading-relaxed" style={{ color: 'var(--muted)' }}>The current library includes Class 12 Business Studies, Class 11 Microeconomics and Class 12 Macroeconomics. More CBSE Commerce subjects will be added over time.</p></article>
            <article className="card-paper p-6"><h3 className="font-semibold mb-2" style={{ color: 'var(--ink)' }}>Can I use the notes for board-exam revision?</h3><p className="text-sm leading-relaxed" style={{ color: 'var(--muted)' }}>Yes. The material is organised chapter-wise with important topics and revision guidance, but students should also practise NCERT questions and current CBSE sample papers.</p></article>
          </div>
        </section>
      </main>
    </div>
  );
}
