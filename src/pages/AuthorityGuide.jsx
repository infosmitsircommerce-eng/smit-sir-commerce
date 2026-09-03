import { Link, useLocation } from 'react-router-dom';
import { ArrowRight, BookOpen, CalendarDays, CheckCircle2, Lightbulb, ListChecks, UserRound } from 'lucide-react';
import SEO from '../components/ui/SEO';
import { authorityGuideByPath } from '../data/authorityGuides';
import { authorityEnhancements } from '../data/highIntentEnhancements';

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
  const enhancement = authorityEnhancements[guide.path] || {};
  const formatted = new Intl.DateTimeFormat('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(`${guide.updated}T00:00:00`));

  return <div className="min-h-screen" style={{ background: 'var(--bg-ivory)' }}>
    <SEO title={guide.title} description={guide.description} path={guide.path} type="article" publishedTime={guide.updated} modifiedTime={guide.updated} structuredData={structuredData(guide)} />
    <section className="page-hero"><div className="page-container">
      <nav aria-label="Breadcrumb" className="text-sm flex flex-wrap gap-2 mb-7" style={{ color: 'var(--muted)' }}><Link to="/">Home</Link><span>/</span><Link to="/cbse-practice">CBSE Practice</Link><span>/</span><span style={{ color: 'var(--gold)' }}>{guide.shortTitle}</span></nav>
      <span className="eyebrow">{guide.eyebrow}</span>
      <h1 className="mt-5 max-w-5xl">{guide.title}</h1>
      <p className="mt-5 max-w-3xl text-lg leading-relaxed" style={{ color: 'var(--muted)' }}>{guide.intro}</p>
      <div className="flex flex-wrap gap-3 mt-6 text-sm" style={{ color: 'var(--muted)' }}><span className="tile-paper px-3 py-2 inline-flex items-center gap-2"><UserRound className="w-4 h-4" style={{ color: 'var(--gold)' }} /> Prepared by Smit Sir</span><span className="tile-paper px-3 py-2 inline-flex items-center gap-2"><CalendarDays className="w-4 h-4" style={{ color: 'var(--gold)' }} /> Updated {formatted}</span><span className="tile-paper px-3 py-2 inline-flex items-center gap-2"><BookOpen className="w-4 h-4" style={{ color: 'var(--gold)' }} /> Free revision resource</span>{enhancement.yearLabel && <span className="tile-paper px-3 py-2 inline-flex items-center gap-2"><CheckCircle2 className="w-4 h-4" style={{ color: 'var(--green)' }} /> {enhancement.yearLabel}</span>}</div>
    </div></section>

    <main className="page-container section-padding"><div className="grid lg:grid-cols-[minmax(0,1fr)_300px] gap-8 items-start">
      <div className="space-y-7">
        {enhancement.answerFramework?.length > 0 && <section className="card-paper p-5 sm:p-8"><div className="flex items-center gap-3"><ListChecks className="w-6 h-6" style={{ color: 'var(--gold)' }} /><h2 className="text-3xl" style={{ fontFamily: 'var(--font-serif)', color: 'var(--ink)' }}>Board-ready answer framework</h2></div><p className="mt-3 text-sm leading-7" style={{ color: 'var(--muted)' }}>Match the depth of your answer to what the question actually asks. These are presentation guidelines for practice, not a guarantee of marks.</p><div className="grid md:grid-cols-2 gap-4 mt-6">{enhancement.answerFramework.map(([label, text]) => <article key={label} className="tile-paper p-5"><div className="text-sm font-bold" style={{ color: 'var(--gold)' }}>{label}</div><p className="text-sm leading-7 mt-2" style={{ color: 'var(--charcoal)' }}>{text}</p></article>)}</div></section>}

        {enhancement.caseMethod?.length > 0 && <section className="card-paper p-5 sm:p-8"><div className="flex items-center gap-3"><Lightbulb className="w-6 h-6" style={{ color: 'var(--gold)' }} /><h2 className="text-3xl" style={{ fontFamily: 'var(--font-serif)', color: 'var(--ink)' }}>5-step case-study method</h2></div><ol className="mt-6 space-y-3">{enhancement.caseMethod.map((step, index) => <li key={step} className="tile-paper p-4 flex gap-3"><span className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-black flex-shrink-0" style={{ background: 'var(--gold-bg)', color: 'var(--gold)' }}>{index + 1}</span><span className="text-sm leading-6" style={{ color: 'var(--charcoal)' }}>{step}</span></li>)}</ol></section>}

        {guide.sections.map((section, sectionIndex) => <section key={section.title} className="card-paper p-5 sm:p-8">
          <h2 className="text-3xl" style={{ fontFamily: 'var(--font-serif)', color: 'var(--ink)' }}>{section.title}</h2>
          <p className="mt-3 leading-8" style={{ color: 'var(--muted)' }}>{section.text}</p>
          <div className="grid sm:grid-cols-2 gap-3 mt-6">{section.links.map(([path, label]) => <Link key={path} to={path} className="tile-paper p-4 flex items-center justify-between gap-3 text-sm font-semibold"><span>{label}</span><ArrowRight className="w-4 h-4 flex-shrink-0" style={{ color: 'var(--gold)' }} /></Link>)}</div>
          {sectionIndex === 0 && <div className="mt-6 rounded-xl p-4 flex items-start gap-3" style={{ background: 'var(--gold-bg)', color: 'var(--charcoal)' }}><CheckCircle2 className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: 'var(--green)' }} /><p className="text-sm leading-7">Use the linked material actively: recall first, check the explanation second, then revisit the chapter note only where your answer was incomplete.</p></div>}
        </section>)}

        {enhancement.chapterStrategy?.length > 0 && <section className="card-paper p-5 sm:p-8"><h2 className="text-3xl" style={{ fontFamily: 'var(--font-serif)', color: 'var(--ink)' }}>Chapter-by-chapter question focus</h2><div className="grid md:grid-cols-2 gap-4 mt-6">{enhancement.chapterStrategy.map(([chapter, focus]) => <article key={chapter} className="tile-paper p-5"><h3 className="font-semibold" style={{ color: 'var(--ink)' }}>{chapter}</h3><p className="text-sm leading-6 mt-2" style={{ color: 'var(--muted)' }}>{focus}</p></article>)}</div></section>}

        {enhancement.caselets?.length > 0 && <section className="card-paper p-5 sm:p-8"><span className="eyebrow">Original application practice</span><h2 className="text-3xl mt-3" style={{ fontFamily: 'var(--font-serif)', color: 'var(--ink)' }}>{enhancement.caselets.length} caselets with answer guidance</h2><p className="mt-3 text-sm leading-7" style={{ color: 'var(--muted)' }}>These caselets are original practice created for concept application. They are not presented as official CBSE questions.</p><div className="space-y-4 mt-6">{enhancement.caselets.map((item, index) => <details key={`${item.chapter}-${index}`} className="tile-paper p-5"><summary className="cursor-pointer list-none"><div className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--gold)' }}>Case {index + 1} · {item.chapter}</div><p className="mt-2 text-sm leading-7" style={{ color: 'var(--charcoal)' }}>{item.prompt}</p><div className="mt-3 font-semibold" style={{ color: 'var(--ink)' }}>{item.question}</div></summary><div className="mt-4 pt-4 text-sm leading-7" style={{ borderTop: '1px solid var(--border-soft)', color: 'var(--muted)' }}><strong style={{ color: 'var(--green)' }}>Answer guidance:</strong> {item.answer}</div></details>)}</div></section>}

        {enhancement.relatedLearning?.length > 0 && <section className="card-paper p-5 sm:p-8"><h2 className="text-3xl" style={{ fontFamily: 'var(--font-serif)', color: 'var(--ink)' }}>Continue your Business Studies revision</h2><div className="grid sm:grid-cols-2 gap-3 mt-5">{enhancement.relatedLearning.map(([to, label]) => <Link key={to} to={to} className="tile-paper p-4 flex items-center justify-between gap-3 text-sm font-semibold"><span>{label}</span><ArrowRight className="w-4 h-4" style={{ color: 'var(--gold)' }} /></Link>)}</div></section>}

        <section className="card-paper p-5 sm:p-8"><h2 className="text-3xl" style={{ fontFamily: 'var(--font-serif)', color: 'var(--ink)' }}>Frequently asked questions</h2><div className="divide-y mt-5" style={{ borderColor: 'var(--border-soft)' }}>{guide.faqs.map(([question, answer], index) => <details key={question} className="py-4" open={index === 0}><summary className="cursor-pointer font-semibold" style={{ color: 'var(--ink)' }}>{question}</summary><p className="mt-3 leading-7" style={{ color: 'var(--muted)' }}>{answer}</p></details>)}</div></section>
      </div>

      <aside className="space-y-5 lg:sticky lg:top-24"><div className="card-paper p-5"><h2 className="text-xl" style={{ fontFamily: 'var(--font-serif)', color: 'var(--ink)' }}>Editorial transparency</h2><p className="text-sm leading-7 mt-3" style={{ color: 'var(--muted)' }}>This page links to material actually published on Smit Sir Commerce. Original practice is not presented as an official CBSE paper, and students should check the latest official CBSE curriculum and sample papers for current requirements.</p><Link to="/about" className="mt-4 inline-flex items-center gap-2 text-sm font-semibold" style={{ color: 'var(--gold)' }}>About Smit Sir <ArrowRight className="w-4 h-4" /></Link></div><Link to="/cbse-practice" className="btn-primary w-full inline-flex items-center justify-center gap-2">Open Practice Library <ArrowRight className="w-4 h-4" /></Link><Link to="/cbse-notes" className="btn-secondary w-full inline-flex items-center justify-center gap-2">Browse Free Notes</Link></aside>
    </div></main>
  </div>;
}
