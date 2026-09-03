import { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Calculator, ArrowLeft, ArrowRight, BookOpen, RotateCcw, Lightbulb, CheckCircle2 } from 'lucide-react';
import SEO from '../components/ui/SEO';
import { commerceToolBySlug, commerceTools } from '../data/allCommerceTools';

const BASE = 'https://www.smitsircommerce.in';

export default function CommerceToolPage() {
  const { toolSlug } = useParams();
  const tool = commerceToolBySlug[toolSlug];
  const initialValues = useMemo(() => Object.fromEntries((tool?.fields || []).map((f) => [f.key, ''])), [tool]);
  const [values, setValues] = useState(initialValues);
  const [result, setResult] = useState(null);

  if (!tool) {
    return (
      <div className="page-container section-padding text-center">
        <h1 className="text-4xl" style={{ color: 'var(--ink)' }}>Calculator not found</h1>
        <Link to="/tools" className="btn-primary inline-flex mt-6">Browse Commerce tools</Link>
      </div>
    );
  }

  const path = `/tools/${tool.slug}`;
  const related = commerceTools.filter((item) => item.category === tool.category && item.slug !== tool.slug).slice(0, 5);
  const faqs = [
    { q: `What formula does the ${tool.title} use?`, a: `This calculator uses: ${tool.formula}. The result section also shows the working step by step.` },
    { q: `Is this ${tool.title} free?`, a: 'Yes. The calculator is free to use and does not require a login.' },
    { q: 'Can I use the answer directly in an exam?', a: 'Use the calculator to understand and check your working. In an exam, show the formula, substitution and calculation in the format required by your teacher or board.' },
  ];
  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebApplication',
        '@id': `${BASE}${path}#calculator`,
        name: tool.h1,
        url: `${BASE}${path}`,
        applicationCategory: 'EducationalApplication',
        operatingSystem: 'Any',
        isAccessibleForFree: true,
        description: tool.description,
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'INR' },
        provider: { '@id': `${BASE}/#organization` },
      },
      {
        '@type': 'LearningResource',
        '@id': `${BASE}${path}#learning-resource`,
        name: tool.h1,
        description: tool.description,
        educationalLevel: tool.classLevel,
        learningResourceType: 'Calculator',
        teaches: tool.formula,
        isAccessibleForFree: true,
        inLanguage: 'en-IN',
        url: `${BASE}${path}`,
      },
      {
        '@type': 'FAQPage',
        mainEntity: faqs.map((faq) => ({ '@type': 'Question', name: faq.q, acceptedAnswer: { '@type': 'Answer', text: faq.a } })),
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: `${BASE}/` },
          { '@type': 'ListItem', position: 2, name: 'Commerce Tools', item: `${BASE}/tools` },
          { '@type': 'ListItem', position: 3, name: tool.title, item: `${BASE}${path}` },
        ],
      },
    ],
  };

  function onSubmit(event) {
    event.preventDefault();
    setResult(tool.calculate(values));
  }

  function loadExample() {
    const next = Object.fromEntries(tool.fields.map((f) => [f.key, f.placeholder]));
    setValues(next);
    setResult(tool.calculate(next));
  }

  function reset() {
    setValues(initialValues);
    setResult(null);
  }

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-ivory)' }}>
      <SEO title={`${tool.title} — Free ${tool.classLevel} ${tool.category} Tool`} description={tool.description} path={path} structuredData={structuredData} />

      <section className="page-container pt-8 sm:pt-12">
        <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 text-xs" style={{ color: 'var(--muted)' }}>
          <Link to="/">Home</Link><span>/</span><Link to="/tools">Tools</Link><span>/</span><span>{tool.title}</span>
        </nav>
      </section>

      <section className="page-container pt-7 pb-8">
        <Link to="/tools" className="inline-flex items-center gap-1.5 text-sm font-semibold mb-5" style={{ color: 'var(--gold)' }}><ArrowLeft className="w-4 h-4" /> All Commerce tools</Link>
        <div className="max-w-4xl">
          <div className="flex flex-wrap gap-2 mb-4">
            <span className="eyebrow">{tool.category}</span>
            <span className="eyebrow">{tool.classLevel}</span>
          </div>
          <h1 className="headline">{tool.h1}</h1>
          <p className="mt-4 text-base leading-8 max-w-3xl" style={{ color: 'var(--muted)' }}>{tool.description}</p>
        </div>
      </section>

      <section className="page-container pb-10">
        <div className="grid lg:grid-cols-[1.03fr_.97fr] gap-6 items-start">
          <form onSubmit={onSubmit} className="card-paper p-5 sm:p-7">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: 'var(--gold-bg)' }}><Calculator className="w-5 h-5" style={{ color: 'var(--gold)' }} /></div>
              <div><h2 className="text-2xl" style={{ fontFamily: 'var(--font-serif)', color: 'var(--ink)' }}>Enter the question values</h2><p className="text-xs mt-1" style={{ color: 'var(--muted)' }}>Use the same unit throughout monetary calculations.</p></div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              {tool.fields.map((f) => (
                <label key={f.key} className="block">
                  <span className="text-sm font-semibold" style={{ color: 'var(--ink)' }}>{f.label}</span>
                  <input
                    type="number"
                    step="any"
                    inputMode="decimal"
                    value={values[f.key] ?? ''}
                    onChange={(e) => setValues((prev) => ({ ...prev, [f.key]: e.target.value }))}
                    placeholder={f.placeholder}
                    className="mt-2 w-full rounded-xl border px-4 py-3 outline-none"
                    style={{ borderColor: 'var(--border)', background: 'var(--bg-white)', color: 'var(--ink)' }}
                  />
                  {f.helper && <span className="text-xs mt-1.5 block leading-5" style={{ color: 'var(--subtle)' }}>{f.helper}</span>}
                </label>
              ))}
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <button type="submit" className="btn-primary inline-flex items-center gap-2"><Calculator className="w-4 h-4" /> Calculate</button>
              <button type="button" onClick={loadExample} className="btn-outline-ink">Try example</button>
              <button type="button" onClick={reset} className="btn-outline-ink inline-flex items-center gap-2"><RotateCcw className="w-4 h-4" /> Reset</button>
            </div>
          </form>

          <aside className="card-paper p-5 sm:p-7 lg:sticky lg:top-28">
            <span className="eyebrow">Formula</span>
            <div className="mt-4 rounded-2xl p-5 text-lg leading-8 font-semibold" style={{ background: 'var(--gold-bg)', color: 'var(--ink)' }}>{tool.formula}</div>

            {!result && <div className="mt-6 text-sm leading-7" style={{ color: 'var(--muted)' }}><Lightbulb className="w-5 h-5 mb-2" style={{ color: 'var(--gold)' }} />Enter your figures and press Calculate. The full working will appear here — not just the final answer.</div>}

            {result?.error && <div className="mt-6 rounded-xl p-4 text-sm" style={{ background: 'rgba(185,28,28,0.08)', color: '#991b1b' }}>{result.error}</div>}

            {result && !result.error && (
              <div className="mt-6">
                <div className="rounded-2xl p-5" style={{ background: 'var(--ink-bg)', color: 'var(--ivory-on-ink)' }}>
                  <div className="text-xs uppercase tracking-widest" style={{ color: 'var(--gold-bright)' }}>Answer</div>
                  <div className="text-2xl sm:text-3xl font-semibold mt-2">{result.primary}</div>
                  {result.secondary && <div className="text-sm mt-2" style={{ color: 'var(--muted-on-ink)' }}>{result.secondary}</div>}
                </div>
                <div className="mt-5 space-y-3">
                  <h3 className="font-semibold" style={{ color: 'var(--ink)' }}>Step-by-step working</h3>
                  {result.steps?.map((step, index) => <div key={`${step}-${index}`} className="flex gap-3 text-sm leading-6"><CheckCircle2 className="w-4 h-4 mt-1 flex-shrink-0" style={{ color: 'var(--gold)' }} /><span style={{ color: 'var(--muted)' }}>{step}</span></div>)}
                </div>
                {result.note && <div className="mt-5 rounded-xl p-4 text-xs leading-6" style={{ background: 'var(--bg-ivory)', color: 'var(--muted)' }}>{result.note}</div>}
              </div>
            )}
          </aside>
        </div>
      </section>

      <section className="page-container pb-10">
        <div className="card-paper p-6 sm:p-8">
          <span className="eyebrow">Worked example</span>
          <h2 className="text-3xl mt-4" style={{ fontFamily: 'var(--font-serif)', color: 'var(--ink)' }}>How this formula is used</h2>
          <p className="mt-4 text-sm leading-7" style={{ color: 'var(--muted)' }}>{tool.example}</p>
          <button type="button" onClick={loadExample} className="mt-5 btn-outline-ink">Load this example into the calculator</button>
        </div>
      </section>

      <section className="page-container pb-10">
        <div className="grid lg:grid-cols-[1.2fr_.8fr] gap-6">
          <div className="card-paper p-6 sm:p-8">
            <span className="eyebrow">Quick FAQ</span>
            <div className="mt-5 space-y-6">
              {faqs.map((faq) => <div key={faq.q}><h3 className="text-lg font-semibold" style={{ color: 'var(--ink)' }}>{faq.q}</h3><p className="text-sm leading-7 mt-2" style={{ color: 'var(--muted)' }}>{faq.a}</p></div>)}
            </div>
          </div>
          <div className="card-paper p-6 sm:p-8">
            <BookOpen className="w-6 h-6" style={{ color: 'var(--gold)' }} />
            <h2 className="text-2xl mt-4" style={{ fontFamily: 'var(--font-serif)', color: 'var(--ink)' }}>Don’t stop at the calculator</h2>
            <p className="text-sm leading-7 mt-3" style={{ color: 'var(--muted)' }}>The calculator checks a numerical. Your exam still rewards concept clarity, correct formula selection and written working.</p>
            <div className="mt-5 flex flex-col gap-2 items-start">
              <Link to="/cbse-notes" className="inline-flex items-center gap-1.5 text-sm font-semibold" style={{ color: 'var(--gold)' }}>Free CBSE notes <ArrowRight className="w-4 h-4" /></Link>
              <Link to="/test-series" className="inline-flex items-center gap-1.5 text-sm font-semibold" style={{ color: 'var(--gold)' }}>Practice test series <ArrowRight className="w-4 h-4" /></Link>
              <Link to="/book-demo" className="inline-flex items-center gap-1.5 text-sm font-semibold" style={{ color: 'var(--gold)' }}>Free paper analysis / demo <ArrowRight className="w-4 h-4" /></Link>
            </div>
          </div>
        </div>
      </section>

      <section className="page-container pb-16">
        <h2 className="text-3xl mb-5" style={{ fontFamily: 'var(--font-serif)', color: 'var(--ink)' }}>Related {tool.category} calculators</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {related.map((item) => <Link key={item.slug} to={`/tools/${item.slug}`} className="card-paper p-5 flex items-center justify-between gap-3"><div><div className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--gold)' }}>{item.classLevel}</div><div className="font-semibold mt-1" style={{ color: 'var(--ink)' }}>{item.title}</div></div><ArrowRight className="w-4 h-4 flex-shrink-0" style={{ color: 'var(--gold)' }} /></Link>)}
        </div>
      </section>
    </div>
  );
}
