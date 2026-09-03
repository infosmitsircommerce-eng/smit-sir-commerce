import { Link, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ArrowRight, BookOpen, Calculator, CheckCircle2, Languages } from 'lucide-react';
import SEO from '../components/ui/SEO';
import { localizedPageByPath, languageLinksForPage } from '../data/localizedPilot';

const BASE = 'https://www.smitsircommerce.in';

function LanguagePill({ to, active, children }) {
  return (
    <Link
      to={to}
      className="rounded-full px-4 py-2 text-sm font-semibold transition"
      style={active
        ? { background: 'linear-gradient(135deg,#C9A050,#B8872F)', color: '#17120a' }
        : { background: '#fff', color: '#253047', border: '1px solid #e5e7eb' }}
    >
      {children}
    </Link>
  );
}

export default function LocalizedPilotPage() {
  const { pathname } = useLocation();
  const page = localizedPageByPath[pathname];

  if (!page) {
    return (
      <main className="page-container section-padding" style={{ color: 'var(--ink)' }}>
        <h1 className="text-4xl font-bold">Localized page not found</h1>
        <p className="mt-4">This multilingual pilot currently includes selected Commerce learning pages only.</p>
        <Link to="/" className="btn-primary mt-6 inline-flex">Go to English homepage</Link>
      </main>
    );
  }

  const languageLinks = languageLinksForPage(page);
  const isHindi = page.lang === 'hi';
  const labels = isHindi ? {
    language: 'भाषा', free: 'Free learning resource', keyIdeas: 'याद रखने वाली बातें', explanation: 'Concept explanation', resources: 'Practice और calculators', faq: 'अक्सर पूछे जाने वाले सवाल', open: 'खोलें', note: 'नोट: कुछ linked calculators/resources अभी English interface में खुलते हैं। Localized pilot का उद्देश्य concept support और search discovery को test करना है।', cta: 'अपनी तैयारी check करें', ctaBody: 'Concept समझने के बाद practice करें और जहाँ marks कट रहे हैं वहाँ Marks Recovery से weak area identify करें।', marks: 'Marks Recovery खोलें', pack: 'Free Study Pack देखें',
  } : {
    language: 'ભાષા', free: 'Free learning resource', keyIdeas: 'યાદ રાખવાના મુદ્દા', explanation: 'Concept સમજ', resources: 'Practice અને calculators', faq: 'વારંવાર પૂછાતા પ્રશ્નો', open: 'ખોલો', note: 'નોંધ: કેટલાક linked calculators/resources હાલમાં English interfaceમાં ખુલશે. આ localized pilot concept support અને search discovery test કરવા માટે છે.', cta: 'તમારી તૈયારી check કરો', ctaBody: 'Concept સમજ્યા પછી practice કરો અને જ્યાં marks કપાય છે ત્યાં Marks Recoveryથી weak area identify કરો.', marks: 'Marks Recovery ખોલો', pack: 'Free Study Pack જુઓ',
  };

  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'LearningResource',
        name: page.title,
        description: page.description,
        url: page.url,
        inLanguage: page.languageTag,
        isAccessibleForFree: true,
        dateModified: page.updated,
        learningResourceType: 'Study guide',
        provider: { '@id': `${BASE}/#organization` },
      },
      {
        '@type': 'FAQPage',
        mainEntity: page.faqs.map(([question, answer]) => ({
          '@type': 'Question',
          name: question,
          acceptedAnswer: { '@type': 'Answer', text: answer },
        })),
      },
    ],
  };

  return (
    <>
      <SEO title={page.title} description={page.description} path={page.path} structuredData={structuredData} />
      <Helmet><html lang={page.lang} /></Helmet>

      <main style={{ background: 'linear-gradient(180deg,#fffaf0 0%,#f8fafc 42%,#ffffff 100%)', color: '#192235' }}>
        <section className="page-container pt-8 pb-10 lg:pt-12 lg:pb-14">
          <div className="flex flex-wrap items-center gap-2 mb-7" aria-label={labels.language}>
            <Languages className="h-5 w-5" style={{ color: '#B8872F' }} />
            <LanguagePill to={languageLinks.en} active={false}>English</LanguagePill>
            <LanguagePill to={languageLinks.hi} active={page.lang === 'hi'}>हिन्दी</LanguagePill>
            <LanguagePill to={languageLinks.gu} active={page.lang === 'gu'}>ગુજરાતી</LanguagePill>
          </div>

          <div className="max-w-4xl">
            <div className="text-sm font-bold uppercase tracking-[0.16em]" style={{ color: '#A8751D' }}>{page.eyebrow}</div>
            <h1 className="mt-4 text-4xl md:text-5xl lg:text-6xl font-bold leading-tight" style={{ fontFamily: 'var(--font-serif)', color: '#152033' }}>{page.heading}</h1>
            <p className="mt-6 text-lg md:text-xl leading-8" style={{ color: '#526078' }}>{page.intro}</p>
            <div className="mt-6 inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold" style={{ background: '#fff4d6', color: '#7a5514', border: '1px solid #edd59b' }}>
              <BookOpen className="h-4 w-4" /> {labels.free}
            </div>
          </div>
        </section>

        <section className="page-container pb-12">
          <div className="grid gap-4 md:grid-cols-2">
            {page.points.map((point) => (
              <div key={point} className="rounded-2xl bg-white p-5 shadow-sm" style={{ border: '1px solid #ece8de' }}>
                <div className="flex gap-3"><CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" style={{ color: '#B8872F' }} /><p className="font-medium leading-7">{point}</p></div>
              </div>
            ))}
          </div>
        </section>

        <section className="page-container pb-12">
          <h2 className="text-3xl font-bold" style={{ fontFamily: 'var(--font-serif)' }}>{labels.explanation}</h2>
          <div className="mt-6 grid gap-5">
            {page.sections.map(([title, text]) => (
              <article key={title} className="rounded-3xl bg-white p-6 md:p-8" style={{ border: '1px solid #e7e9ee', boxShadow: '0 12px 35px rgba(25,34,53,.05)' }}>
                <h3 className="text-xl md:text-2xl font-bold">{title}</h3>
                <p className="mt-3 leading-8" style={{ color: '#58667c' }}>{text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="page-container pb-12">
          <div className="rounded-3xl p-6 md:p-8" style={{ background: '#0d2346', color: '#fff' }}>
            <div className="flex items-center gap-3"><Calculator className="h-6 w-6" style={{ color: '#f2cc68' }} /><h2 className="text-2xl md:text-3xl font-bold">{labels.resources}</h2></div>
            <div className="mt-6 grid gap-3 md:grid-cols-2">
              {page.resources.map(([path, label]) => (
                <Link key={`${path}-${label}`} to={path} className="flex items-center justify-between gap-3 rounded-2xl px-4 py-4 transition hover:-translate-y-0.5" style={{ background: 'rgba(255,255,255,.08)', border: '1px solid rgba(255,255,255,.14)' }}>
                  <span>{label}</span><ArrowRight className="h-4 w-4 shrink-0" />
                </Link>
              ))}
            </div>
            <p className="mt-5 text-sm leading-6" style={{ color: 'rgba(255,255,255,.66)' }}>{labels.note}</p>
          </div>
        </section>

        <section className="page-container pb-12">
          <h2 className="text-3xl font-bold" style={{ fontFamily: 'var(--font-serif)' }}>{labels.faq}</h2>
          <div className="mt-5 space-y-4">
            {page.faqs.map(([question, answer]) => (
              <details key={question} className="rounded-2xl bg-white p-5" style={{ border: '1px solid #e7e9ee' }}>
                <summary className="cursor-pointer font-bold">{question}</summary>
                <p className="mt-3 leading-7" style={{ color: '#58667c' }}>{answer}</p>
              </details>
            ))}
          </div>
        </section>

        <section className="page-container pb-16">
          <div className="rounded-3xl p-7 md:p-10 text-center" style={{ background: 'linear-gradient(135deg,#fff0c7,#fff9ea)', border: '1px solid #e8cc87' }}>
            <h2 className="text-3xl font-bold" style={{ fontFamily: 'var(--font-serif)' }}>{labels.cta}</h2>
            <p className="mx-auto mt-3 max-w-2xl leading-7" style={{ color: '#5e5544' }}>{labels.ctaBody}</p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Link to="/marks-recovery" className="btn-primary">{labels.marks}</Link>
              <Link to="/free-commerce-study-pack" className="rounded-xl px-5 py-3 font-semibold" style={{ background: '#fff', border: '1px solid #d8c28c', color: '#694d16' }}>{labels.pack}</Link>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
