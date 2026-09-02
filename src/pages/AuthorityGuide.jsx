import { Link, useLocation } from 'react-router-dom';
import { ArrowRight, BookOpen, CalendarDays, CheckCircle2, UserRound } from 'lucide-react';
import SEO from '../components/ui/SEO';
import { authorityGuideByPath } from '../data/authorityGuides';

const SITE = 'https://www.smitsircommerce.in';

function structuredData(guide) {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'LearningResource',
        name: guide.title,
        description: guide.description,
        url: `${SITE}${guide.path}`,
        isAccessibleForFree: true,
        inLanguage: 'en-IN',
        datePublished: guide.updated,
        dateModified: guide.updated,
        author: { '@id': `${SITE}/#teacher` },
        provider: { '@id': `${SITE}/#organization` },
        learningResourceType: 'Revision guide',
      },
      {
        '@type': 'FAQPage',
        mainEntity: guide.faqs.map(([question, answer]) => ({
          '@type': 'Question',
          name: question,
          acceptedAnswer: { '@type': 'Answer', text: answer },
        })),
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE}/` },
          { '@type': 'ListItem', position: 2, name: 'CBSE Practice', item: `${SITE}/cbse-practice` },
          { '@type': 'ListItem', position: 3, name: guide.shortTitle, item: `${SITE}${guide.path}` },
        ],
      },
    ],
  };
}

export default function AuthorityGuide() {
  const { pathname } = useLocation();
  const guide = authorityGuideByPath[pathname.replace(/\/$/, '')];
  if (!guide) return null;
  const formatted = new Intl.DateTimeFormat('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(`${guide.updated}T00:00:00`));

  return <div className="min-h-screen" style={{ background: 'var(--bg-ivory)' }}>
    <SEO title={guide.title} description={guide.description} path={guide.path} type="article" publishedTime={guide.updated} modifiedTime={guide.updated} structuredData={structuredData(guide)} />
    <section className="page-hero"><div className="page-container">
      <nav aria-label="Breadcrumb" className="text-sm flex flex-wrap gap-2 mb-7" style={{ color: 'var(--muted)' }}><Link to="/">Home</Link><span>/</span><Link to="/cbse-practice">CBSE Practice</Link><span>/</span><span style={{ color: 'var(--gold)' }}>{guide.shortTitle}</span></nav>
      <span className="eyebrow">{guide.eyebrow}</span>
      <h1 className="mt-5 max-w-5xl">{guide.title}</h1>
      <p className="mt-5 max-w-3xl text-lg leading-relaxed" style={{ color: 'var(--muted)' }}>{guide.intro}</p>
      <div className="flex flex-wrap gap-3 mt-6 text-sm" style={{ color: 'var(--muted)' }}><span className="tile-paper px-3 py-2 inline-flex items-center gap-2"><UserRound className="w-4 h-4" style={{ color: 'var(--gold)' }} /> Prepared by Smit Sir</span><span className="tile-paper px-3 py-2 inline-flex items-center gap-2"><CalendarDays className="w-4 h-4" style={{ color: 'var(--gold)' }} /> Updated {formatted}</span><span className="tile-paper px-3 py-2 inline-flex items-center gap-2"><BookOpen className="w-4 h-4" style={{ color: 'var(--gold)' }} /> Free revision resource</span></div>
    </div></section>

    <main className="page-container section-padding"><div className="grid lg:grid-cols-[minmax(0,1fr)_300px] gap-8 items-start">
      <div className="space-y-7">
        {guide.sections.map((section, sectionIndex) => <section key={section.title} className="card-paper p-5 sm:p-8">
          <h2 className="text-3xl" style={{ fontFamily: 'var(--font-serif)', color: 'var(--ink)' }}>{section.title}</h2>
          <p className="mt-3 leading-8" style={{ color: 'var(--muted)' }}>{section.text}</p>
          <div className="grid sm:grid-cols-2 gap-3 mt-6">{section.links.map(([path, label]) => <Link key={path} to={path} className="tile-paper p-4 flex items-center justify-between gap-3 text-sm font-semibold"><span>{label}</span><ArrowRight className="w-4 h-4 flex-shrink-0" style={{ color: 'var(--gold)' }} /></Link>)}</div>
          {sectionIndex === 0 && <div className="mt-6 rounded-xl p-4 flex items-start gap-3" style={{ background: 'var(--gold-bg)', color: 'var(--charcoal)' }}><CheckCircle2 className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: 'var(--green)' }} /><p className="text-sm leading-7">Use the linked material actively: recall first, check the explanation second, then revisit the chapter note only where your answer was incomplete.</p></div>}
        </section>)}

        <section className="card-paper p-5 sm:p-8"><h2 className="text-3xl" style={{ fontFamily: 'var(--font-serif)', color: 'var(--ink)' }}>Frequently asked questions</h2><div className="divide-y mt-5" style={{ borderColor: 'var(--border-soft)' }}>{guide.faqs.map(([question, answer], index) => <details key={question} className="py-4" open={index === 0}><summary className="cursor-pointer font-semibold" style={{ color: 'var(--ink)' }}>{question}</summary><p className="mt-3 leading-7" style={{ color: 'var(--muted)' }}>{answer}</p></details>)}</div></section>
      </div>

      <aside className="space-y-5 lg:sticky lg:top-24"><div className="card-paper p-5"><h2 className="text-xl" style={{ fontFamily: 'var(--font-serif)', color: 'var(--ink)' }}>Editorial transparency</h2><p className="text-sm leading-7 mt-3" style={{ color: 'var(--muted)' }}>This page links to material actually published on Smit Sir Commerce. Original practice is not presented as an official CBSE paper, and students should check the latest official CBSE curriculum and sample papers for current requirements.</p><Link to="/about" className="mt-4 inline-flex items-center gap-2 text-sm font-semibold" style={{ color: 'var(--gold)' }}>About Smit Sir <ArrowRight className="w-4 h-4" /></Link></div><Link to="/cbse-practice" className="btn-primary w-full inline-flex items-center justify-center gap-2">Open Practice Library <ArrowRight className="w-4 h-4" /></Link><Link to="/cbse-notes" className="btn-secondary w-full inline-flex items-center justify-center gap-2">Browse Free Notes</Link></aside>
    </div></main>
  </div>;
}
