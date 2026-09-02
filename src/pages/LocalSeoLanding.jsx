import { Link, useLocation } from 'react-router-dom';
import { ArrowRight, BookOpen, CheckCircle2, GraduationCap, MapPin, Sparkles } from 'lucide-react';
import SEO from '../components/ui/SEO';
import { localSeoByPath, localSeoPages } from '../data/localSeoPages';

const BASE = 'https://www.smitsircommerce.in';

function buildStructuredData(page) {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        '@id': `${BASE}${page.path}#webpage`,
        url: `${BASE}${page.path}`,
        name: page.h1,
        description: page.description,
        inLanguage: 'en-IN',
        isPartOf: { '@id': `${BASE}/#website` },
        about: { '@id': `${BASE}${page.path}#service` },
      },
      {
        '@type': 'Service',
        '@id': `${BASE}${page.path}#service`,
        name: page.serviceName,
        serviceType: page.serviceType,
        provider: { '@id': `${BASE}/#organization` },
        areaServed: {
          '@type': 'City',
          name: 'Mehsana',
          containedInPlace: { '@type': 'State', name: 'Gujarat' },
        },
        offers: {
          '@type': 'Offer',
          url: `${BASE}/book-demo`,
          description: 'Request a demo class before choosing a Commerce batch.',
        },
      },
      {
        '@type': 'FAQPage',
        mainEntity: page.faqs.map(([question, answer]) => ({
          '@type': 'Question',
          name: question,
          acceptedAnswer: { '@type': 'Answer', text: answer },
        })),
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: `${BASE}/` },
          { '@type': 'ListItem', position: 2, name: 'Commerce Coaching in Mehsana', item: `${BASE}/commerce-coaching-mehsana` },
          { '@type': 'ListItem', position: 3, name: page.h1, item: `${BASE}${page.path}` },
        ],
      },
    ],
  };
}

export default function LocalSeoLanding() {
  const { pathname } = useLocation();
  const page = localSeoByPath[pathname];

  if (!page) {
    return (
      <div className="page-container section-padding text-center">
        <h1 className="headline">Local Commerce page not found</h1>
        <Link to="/commerce-coaching-mehsana" className="btn-primary inline-flex mt-6">Commerce coaching in Mehsana</Link>
      </div>
    );
  }

  const related = localSeoPages.filter((item) => item.path !== page.path);
  const structuredData = buildStructuredData(page);

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-ivory)' }}>
      <SEO title={page.title} description={page.description} path={page.path} structuredData={structuredData} />

      <section className="page-hero">
        <div className="page-container">
          <nav aria-label="Breadcrumb" className="text-sm mb-7 flex flex-wrap items-center gap-2" style={{ color: 'var(--muted)' }}>
            <Link to="/">Home</Link><span>/</span><Link to="/commerce-coaching-mehsana">Commerce coaching in Mehsana</Link><span>/</span><span style={{ color: 'var(--gold)' }}>{page.h1}</span>
          </nav>

          <div className="grid lg:grid-cols-[minmax(0,1fr)_340px] gap-8 items-start">
            <div>
              <span className="eyebrow inline-flex items-center gap-2"><MapPin className="w-4 h-4" /> {page.eyebrow}</span>
              <h1 className="mt-5">{page.h1}</h1>
              <p className="mt-5 text-lg leading-8 max-w-3xl" style={{ color: 'var(--muted)' }}>{page.intro}</p>
              <div className="flex flex-wrap gap-3 mt-7">
                <Link to="/book-demo" className="btn-primary inline-flex items-center gap-2">Book a demo class <ArrowRight className="w-4 h-4" /></Link>
                <Link to="/cbse-notes" className="btn-outline-ink inline-flex items-center gap-2"><BookOpen className="w-4 h-4" /> Free CBSE notes</Link>
              </div>
            </div>

            <aside className="card-paper p-6">
              <GraduationCap className="w-7 h-7 mb-4" style={{ color: 'var(--gold)' }} />
              <h2 className="text-2xl" style={{ fontFamily: 'var(--font-serif)', color: 'var(--ink)' }}>Local Commerce support in Mehsana</h2>
              <p className="text-sm leading-7 mt-3" style={{ color: 'var(--muted)' }}>Use the free resources first, understand the teaching approach, then request a demo before deciding on a batch.</p>
              <Link to="/commerce-coaching-mehsana" className="inline-flex items-center gap-2 text-sm font-semibold mt-5" style={{ color: 'var(--gold)' }}>View complete Mehsana coaching page <ArrowRight className="w-4 h-4" /></Link>
            </aside>
          </div>
        </div>
      </section>

      <main className="page-container section-padding space-y-8">
        <section className="card-paper p-5 sm:p-7 md:p-9">
          <span className="eyebrow">Focused preparation</span>
          <h2 className="text-3xl mt-3" style={{ fontFamily: 'var(--font-serif)', color: 'var(--ink)' }}>{page.sectionTitle}</h2>
          <p className="leading-8 mt-4 max-w-4xl" style={{ color: 'var(--muted)' }}>{page.sectionText}</p>

          <div className="grid sm:grid-cols-2 gap-4 mt-7">
            {page.focus.map(([title, text]) => (
              <article key={title} className="tile-paper p-5">
                <CheckCircle2 className="w-5 h-5 mb-3" style={{ color: 'var(--green)' }} />
                <h3 className="text-xl" style={{ fontFamily: 'var(--font-serif)', color: 'var(--ink)' }}>{title}</h3>
                <p className="text-sm leading-7 mt-2" style={{ color: 'var(--muted)' }}>{text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="grid lg:grid-cols-[1.1fr_.9fr] gap-6">
          <div className="card-paper p-5 sm:p-7 md:p-9">
            <span className="eyebrow">How to start</span>
            <h2 className="text-3xl mt-3" style={{ fontFamily: 'var(--font-serif)', color: 'var(--ink)' }}>See the material, try the teaching approach, then decide</h2>
            <div className="space-y-4 mt-6">
              {[
                ['1', 'Explore the free resources', 'Use the published notes and practice pages to understand the style and depth of the learning material.'],
                ['2', 'Request a demo class', 'A student and parent can understand the teaching approach before making a batch decision.'],
                ['3', 'Build a revision routine', 'Combine class learning with chapter practice, tests and repeated revision on the website.'],
              ].map(([n, title, text]) => (
                <div key={n} className="tile-paper p-4 flex gap-4">
                  <span className="w-9 h-9 rounded-full flex-shrink-0 inline-flex items-center justify-center font-bold" style={{ background: 'var(--gold-bg)', color: 'var(--gold)' }}>{n}</span>
                  <div><h3 className="font-semibold" style={{ color: 'var(--ink)' }}>{title}</h3><p className="text-sm leading-7 mt-1" style={{ color: 'var(--muted)' }}>{text}</p></div>
                </div>
              ))}
            </div>
          </div>

          <div className="card-paper p-5 sm:p-7 md:p-9">
            <span className="eyebrow">Useful links</span>
            <h2 className="text-3xl mt-3" style={{ fontFamily: 'var(--font-serif)', color: 'var(--ink)' }}>Continue your Commerce preparation</h2>
            <div className="space-y-3 mt-6">
              <Link to="/study-material" className="tile-paper p-4 flex items-center justify-between gap-3 font-semibold text-sm"><span>Free study material</span><ArrowRight className="w-4 h-4" style={{ color: 'var(--gold)' }} /></Link>
              <Link to="/cbse-practice" className="tile-paper p-4 flex items-center justify-between gap-3 font-semibold text-sm"><span>Chapter practice</span><ArrowRight className="w-4 h-4" style={{ color: 'var(--gold)' }} /></Link>
              <Link to="/test-series" className="tile-paper p-4 flex items-center justify-between gap-3 font-semibold text-sm"><span>Commerce tests</span><ArrowRight className="w-4 h-4" style={{ color: 'var(--gold)' }} /></Link>
              <Link to="/contact" className="tile-paper p-4 flex items-center justify-between gap-3 font-semibold text-sm"><span>Contact Smit Sir Commerce</span><ArrowRight className="w-4 h-4" style={{ color: 'var(--gold)' }} /></Link>
            </div>
          </div>
        </section>

        <section className="card-paper p-5 sm:p-7 md:p-9">
          <span className="eyebrow">FAQ</span>
          <h2 className="text-3xl mt-3 mb-5" style={{ fontFamily: 'var(--font-serif)', color: 'var(--ink)' }}>Questions students and parents ask</h2>
          <div className="divide-y" style={{ borderColor: 'var(--border-soft)' }}>
            {page.faqs.map(([question, answer], index) => (
              <details key={question} className="py-4" open={index === 0}>
                <summary className="cursor-pointer list-none font-semibold" style={{ color: 'var(--ink)' }}>{question}</summary>
                <p className="mt-3 leading-7" style={{ color: 'var(--muted)' }}>{answer}</p>
              </details>
            ))}
          </div>
        </section>

        <section className="card-paper p-5 sm:p-7 md:p-9">
          <span className="eyebrow">More local Commerce pages</span>
          <h2 className="text-3xl mt-3 mb-5" style={{ fontFamily: 'var(--font-serif)', color: 'var(--ink)' }}>Explore related tuition options in Mehsana</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {related.map((item) => (
              <Link key={item.path} to={item.path} className="tile-paper p-4 flex items-center justify-between gap-3 text-sm font-semibold">
                <span>{item.h1}</span><ArrowRight className="w-4 h-4 flex-shrink-0" style={{ color: 'var(--gold)' }} />
              </Link>
            ))}
          </div>
        </section>

        <section className="card-paper p-6 sm:p-8 md:p-10 text-center">
          <Sparkles className="w-8 h-8 mx-auto mb-4" style={{ color: 'var(--gold)' }} />
          <h2 className="text-3xl" style={{ fontFamily: 'var(--font-serif)', color: 'var(--ink)' }}>Want to see whether the teaching style suits you?</h2>
          <p className="mt-3 max-w-2xl mx-auto" style={{ color: 'var(--muted)' }}>Start with the free resources or request a demo class before choosing a Commerce batch.</p>
          <Link to="/book-demo" className="btn-primary inline-flex items-center gap-2 mt-6">Request a demo class <ArrowRight className="w-4 h-4" /></Link>
        </section>
      </main>
    </div>
  );
}
