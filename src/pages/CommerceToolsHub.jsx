import { Link } from 'react-router-dom';
import { Calculator, ArrowRight, BarChart3, Landmark, GraduationCap, Sparkles, Layers3 } from 'lucide-react';
import SEO from '../components/ui/SEO';
import { commerceTools, commerceToolCategories } from '../data/allCommerceTools';
import { toolClusters } from '../data/toolClusters';

const BASE = 'https://www.smitsircommerce.in';

export default function CommerceToolsHub() {
  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        '@id': `${BASE}/tools#webpage`,
        url: `${BASE}/tools`,
        name: 'Free Commerce Calculators for Class 11 & 12',
        description: 'Free Economics and Accountancy calculators with formulas, step-by-step working and exam-focused explanations for Class 11 and Class 12 Commerce students.',
        inLanguage: 'en-IN',
        isPartOf: { '@id': `${BASE}/#website` },
      },
      {
        '@type': 'ItemList',
        name: 'Smit Sir Commerce free calculators',
        itemListElement: commerceTools.map((tool, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          name: tool.h1,
          url: `${BASE}/tools/${tool.slug}`,
        })),
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: `${BASE}/` },
          { '@type': 'ListItem', position: 2, name: 'Commerce Tools', item: `${BASE}/tools` },
        ],
      },
    ],
  };

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-ivory)' }}>
      <SEO
        title="Free Commerce Calculators — Economics & Accountancy Class 11 & 12"
        description="Free Class 11 and 12 Commerce calculators for MPC, MPS, GDP, national income conversions, cost and revenue, money, elasticity and Accountancy ratios with step-by-step working."
        path="/tools"
        structuredData={structuredData}
      />

      <section className="page-hero">
        <div className="page-container text-center">
          <span className="eyebrow">Free Commerce problem solvers</span>
          <h1 className="mt-5">Stop searching formulas. <em>Solve the question.</em></h1>
          <p className="mx-auto max-w-3xl">
            Free Economics and Accountancy calculators built for Class 11 and 12 Commerce students. Enter the values, get the answer, see the formula and understand every step.
          </p>
          <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
            <a href="#economics-tools" className="btn-primary inline-flex items-center gap-2"><BarChart3 className="w-4 h-4" /> Economics calculators</a>
            <a href="#accountancy-tools" className="btn-outline-ink inline-flex items-center gap-2"><Landmark className="w-4 h-4" /> Accountancy ratios</a>
          </div>
        </div>
      </section>

      <section className="page-container pb-8">
        <div className="grid sm:grid-cols-3 gap-4">
          <div className="card-paper p-5"><Calculator className="w-6 h-6 mb-3" style={{ color: 'var(--gold)' }} /><div className="text-2xl font-semibold" style={{ color: 'var(--ink)' }}>{commerceTools.length}</div><p className="text-sm mt-1" style={{ color: 'var(--muted)' }}>free calculators live in one Commerce toolkit</p></div>
          <div className="card-paper p-5"><GraduationCap className="w-6 h-6 mb-3" style={{ color: 'var(--gold)' }} /><div className="text-2xl font-semibold" style={{ color: 'var(--ink)' }}>Class 11 + 12</div><p className="text-sm mt-1" style={{ color: 'var(--muted)' }}>exam-relevant Economics and Accountancy problems</p></div>
          <div className="card-paper p-5"><Sparkles className="w-6 h-6 mb-3" style={{ color: 'var(--gold)' }} /><div className="text-2xl font-semibold" style={{ color: 'var(--ink)' }}>₹0</div><p className="text-sm mt-1" style={{ color: 'var(--muted)' }}>no login, no payment and no hidden answer</p></div>
        </div>
      </section>

      <section className="page-container section-padding pt-8" aria-labelledby="topic-toolkits-heading">
        <div className="max-w-3xl mb-7"><span className="eyebrow">Study by topic</span><h2 id="topic-toolkits-heading" className="headline mt-4">Three high-value Commerce toolkits</h2><p className="mt-3 text-sm leading-7" style={{ color: 'var(--muted)' }}>Instead of searching one formula at a time, open a complete topic cluster and move between related calculators.</p></div>
        <div className="grid md:grid-cols-3 gap-4">
          {toolClusters.map((cluster) => <Link key={cluster.slug} to={`/tools/topics/${cluster.slug}`} className="card-paper p-6 group"><Layers3 className="w-6 h-6" style={{ color: 'var(--gold)' }} /><h3 className="text-2xl mt-4 leading-snug" style={{ fontFamily: 'var(--font-serif)', color: 'var(--ink)' }}>{cluster.title}</h3><p className="text-sm leading-6 mt-3" style={{ color: 'var(--muted)' }}>{cluster.description}</p><span className="inline-flex items-center gap-1.5 mt-5 text-sm font-semibold" style={{ color: 'var(--gold)' }}>Open toolkit <ArrowRight className="w-4 h-4" /></span></Link>)}
        </div>
      </section>

      {commerceToolCategories.map((category) => {
        const tools = commerceTools.filter((tool) => tool.category === category);
        const isEconomics = category === 'Economics';
        return (
          <section key={category} id={`${category.toLowerCase()}-tools`} className="page-container section-padding pt-10">
            <div className="max-w-3xl mb-7">
              <span className="eyebrow">{category}</span>
              <h2 className="headline mt-4">{isEconomics ? 'Economics numerical calculators' : 'Accountancy ratio calculators'}</h2>
              <p className="mt-3 text-sm leading-7" style={{ color: 'var(--muted)' }}>
                {isEconomics
                  ? 'Solve consumption-saving, equilibrium income, GDP and national-income conversions, revenue, costs, money and elasticity numericals without guessing which formula comes next.'
                  : 'Calculate the major Class 12 accounting ratios, periods and common-size percentages from the figures given in the question and see the working clearly.'}
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {tools.map((tool) => (
                <article key={tool.slug} className="card-paper p-5 flex flex-col">
                  <div className="flex items-center justify-between gap-3 mb-4">
                    <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--gold)' }}>{tool.classLevel}</span>
                    <Calculator className="w-5 h-5" style={{ color: 'var(--muted)' }} />
                  </div>
                  <h3 className="text-xl leading-snug" style={{ fontFamily: 'var(--font-serif)', color: 'var(--ink)' }}>
                    <Link to={`/tools/${tool.slug}`}>{tool.title}</Link>
                  </h3>
                  <p className="text-sm leading-6 mt-3 flex-1" style={{ color: 'var(--muted)' }}>{tool.description}</p>
                  <div className="mt-4 rounded-xl p-3 text-xs leading-5" style={{ background: 'var(--gold-bg)', color: 'var(--ink)' }}>{tool.formula}</div>
                  <Link to={`/tools/${tool.slug}`} className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold" style={{ color: 'var(--gold)' }}>
                    Open calculator <ArrowRight className="w-4 h-4" />
                  </Link>
                </article>
              ))}
            </div>
          </section>
        );
      })}

      <section className="page-container pb-16">
        <div className="card-paper p-6 sm:p-8 text-center">
          <span className="eyebrow">From answer to understanding</span>
          <h2 className="text-3xl mt-4" style={{ fontFamily: 'var(--font-serif)', color: 'var(--ink)' }}>Got the number. Now make sure you can score the marks.</h2>
          <p className="mt-3 mx-auto max-w-2xl text-sm leading-7" style={{ color: 'var(--muted)' }}>Use free notes and practice after the calculator. If a recent test paper shows repeated mistakes, you can also request a free paper analysis before deciding about tuition.</p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link to="/cbse-notes" className="btn-primary">Free CBSE notes</Link>
            <Link to="/test-series" className="btn-outline-ink">Practice tests</Link>
            <Link to="/book-demo" className="btn-outline-ink">Free paper analysis</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
