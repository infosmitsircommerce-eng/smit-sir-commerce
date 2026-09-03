import { Link, useParams } from 'react-router-dom';
import { ArrowRight, BookOpenCheck, Calculator, CheckCircle2, Layers3, Sigma, Target } from 'lucide-react';
import SEO from '../components/ui/SEO';
import { toolClusterBySlug, getClusterTools, toolClusters } from '../data/toolClusters';
import { toolClusterEnhancements } from '../data/highIntentEnhancements';

const BASE = 'https://www.smitsircommerce.in';

export default function ToolTopicCluster() {
  const { clusterSlug } = useParams();
  const cluster = toolClusterBySlug[clusterSlug];

  if (!cluster) {
    return <div className="page-container section-padding text-center"><h1 className="text-4xl" style={{ color: 'var(--ink)' }}>Toolkit not found</h1><Link to="/tools" className="btn-primary inline-flex mt-6">Browse all Commerce calculators</Link></div>;
  }

  const tools = getClusterTools(cluster);
  const enhancement = toolClusterEnhancements[cluster.slug] || {};
  const path = `/tools/topics/${cluster.slug}`;
  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        '@id': `${BASE}${path}#webpage`,
        url: `${BASE}${path}`,
        name: cluster.h1,
        description: cluster.description,
        inLanguage: 'en-IN',
        isPartOf: { '@id': `${BASE}/#website` },
      },
      ...(enhancement.workedExamples?.length ? [{
        '@type': 'LearningResource',
        '@id': `${BASE}${path}#worked-practice`,
        name: enhancement.searchLabel || cluster.h1,
        description: cluster.description,
        url: `${BASE}${path}`,
        isAccessibleForFree: true,
        inLanguage: 'en-IN',
        learningResourceType: ['Worked example', 'Calculator collection'],
        provider: { '@id': `${BASE}/#organization` },
      }] : []),
      {
        '@type': 'ItemList',
        name: cluster.title,
        itemListElement: tools.map((tool, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          name: tool.h1,
          url: `${BASE}/tools/${tool.slug}`,
        })),
      },
      {
        '@type': 'FAQPage',
        mainEntity: cluster.faq.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })),
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: `${BASE}/` },
          { '@type': 'ListItem', position: 2, name: 'Commerce Tools', item: `${BASE}/tools` },
          { '@type': 'ListItem', position: 3, name: cluster.title, item: `${BASE}${path}` },
        ],
      },
    ],
  };

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-ivory)' }}>
      <SEO title={cluster.title} description={cluster.description} path={path} structuredData={structuredData} />

      <section className="page-hero">
        <div className="page-container">
          <nav aria-label="Breadcrumb" className="text-sm flex flex-wrap gap-2 mb-7" style={{ color: 'var(--muted)' }}><Link to="/">Home</Link><span>/</span><Link to="/tools">Commerce Tools</Link><span>/</span><span style={{ color: 'var(--gold)' }}>{cluster.title}</span></nav>
          <span className="eyebrow">Free topic toolkit</span>
          <h1 className="mt-5 max-w-5xl">{cluster.h1}</h1>
          <p className="mt-5 max-w-3xl text-lg leading-8" style={{ color: 'var(--muted)' }}>{cluster.intro}</p>
          <div className="mt-7 flex flex-wrap gap-3"><a href={enhancement.workedExamples?.length ? '#worked-examples' : '#calculators'} className="btn-primary inline-flex items-center gap-2"><BookOpenCheck className="w-4 h-4" /> {enhancement.workedExamples?.length ? 'Start solved practice' : 'Open calculators'}</a><Link to="/cbse-notes" className="btn-outline-ink">Free CBSE notes</Link></div>
        </div>
      </section>

      {enhancement.formulaMap?.length > 0 && <section className="page-container pb-8">
        <div className="card-paper p-6 sm:p-8">
          <div className="flex items-center gap-3"><Sigma className="w-6 h-6" style={{ color: 'var(--gold)' }} /><h2 className="text-3xl" style={{ fontFamily: 'var(--font-serif)', color: 'var(--ink)' }}>Formula map</h2></div>
          <p className="mt-3 text-sm leading-7" style={{ color: 'var(--muted)' }}>Write the relationship first, then substitute the figures. The formula map is a revision aid—not a substitute for understanding the direction of each adjustment.</p>
          <div className="grid md:grid-cols-2 gap-4 mt-6">{enhancement.formulaMap.map(([label, formula, note]) => <article key={label} className="tile-paper p-5"><div className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--gold)' }}>{label}</div><div className="mt-2 font-semibold" style={{ color: 'var(--ink)' }}>{formula}</div><p className="text-sm mt-2 leading-6" style={{ color: 'var(--muted)' }}>{note}</p></article>)}</div>
        </div>
      </section>}

      <section className="page-container pb-8">
        <div className="card-paper p-6 sm:p-8">
          <div className="flex items-center gap-3"><Layers3 className="w-6 h-6" style={{ color: 'var(--gold)' }} /><h2 className="text-3xl" style={{ fontFamily: 'var(--font-serif)', color: 'var(--ink)' }}>What this toolkit covers</h2></div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-6">{cluster.concepts.map((concept) => <div key={concept} className="tile-paper p-4 flex items-start gap-3"><CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: 'var(--green)' }} /><span className="text-sm" style={{ color: 'var(--charcoal)' }}>{concept}</span></div>)}</div>
        </div>
      </section>

      {enhancement.workedExamples?.length > 0 && <section id="worked-examples" className="page-container section-padding pt-8">
        <span className="eyebrow">Original worked practice</span>
        <h2 className="text-3xl sm:text-4xl mt-4" style={{ fontFamily: 'var(--font-serif)', color: 'var(--ink)' }}>{enhancement.workedExamples.length} solved numericals with steps</h2>
        <p className="mt-3 max-w-3xl leading-7" style={{ color: 'var(--muted)' }}>Try each question before opening the solution. These are original learning problems prepared for practice and are not labelled as official CBSE previous-year questions.</p>
        <div className="grid lg:grid-cols-2 gap-4 mt-7">{enhancement.workedExamples.map((example, index) => <details key={`${example.title}-${index}`} className="card-paper p-5 group"><summary className="cursor-pointer list-none"><div className="flex items-start justify-between gap-4"><div><div className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--gold)' }}>Q{index + 1} · {example.level}</div><h3 className="text-xl mt-2" style={{ fontFamily: 'var(--font-serif)', color: 'var(--ink)' }}>{example.title}</h3><p className="text-sm mt-2 leading-6" style={{ color: 'var(--muted)' }}>{example.question}</p></div><span className="text-sm font-bold" style={{ color: 'var(--gold)' }}>Solution</span></div></summary><div className="mt-5 pt-5" style={{ borderTop: '1px solid var(--border-soft)' }}><ol className="space-y-2">{example.working.map((step) => <li key={step} className="text-sm leading-6" style={{ color: 'var(--charcoal)' }}>{step}</li>)}</ol><div className="mt-4 rounded-xl p-4 font-semibold" style={{ background: 'var(--gold-bg)', color: 'var(--ink)' }}>Answer: {example.answer}</div></div></details>)}</div>
      </section>}

      {enhancement.selfTest?.length > 0 && <section className="page-container pb-10">
        <div className="card-paper p-6 sm:p-8"><div className="flex items-center gap-3"><Target className="w-6 h-6" style={{ color: 'var(--gold)' }} /><h2 className="text-3xl" style={{ fontFamily: 'var(--font-serif)', color: 'var(--ink)' }}>Quick self-test</h2></div><p className="text-sm mt-3 leading-7" style={{ color: 'var(--muted)' }}>Solve without a calculator first. Open the answer only after writing your working.</p><div className="grid md:grid-cols-2 gap-3 mt-6">{enhancement.selfTest.map(([q, a], index) => <details key={q} className="tile-paper p-4"><summary className="cursor-pointer font-semibold text-sm" style={{ color: 'var(--ink)' }}>{index + 1}. {q}</summary><p className="mt-3 text-sm" style={{ color: 'var(--green)' }}>Answer: {a}</p></details>)}</div></div>
      </section>}

      <section id="calculators" className="page-container section-padding pt-8">
        <span className="eyebrow">Step-by-step tools</span>
        <h2 className="text-3xl sm:text-4xl mt-4" style={{ fontFamily: 'var(--font-serif)', color: 'var(--ink)' }}>{tools.length} calculator{tools.length === 1 ? '' : 's'} in this topic</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-7">
          {tools.map((tool) => <article key={tool.slug} className="card-paper p-5 flex flex-col"><div className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--gold)' }}>{tool.classLevel} · {tool.category}</div><h3 className="text-xl mt-3 leading-snug" style={{ fontFamily: 'var(--font-serif)', color: 'var(--ink)' }}><Link to={`/tools/${tool.slug}`}>{tool.title}</Link></h3><p className="text-sm leading-6 mt-3 flex-1" style={{ color: 'var(--muted)' }}>{tool.description}</p><div className="mt-4 rounded-xl p-3 text-xs leading-5" style={{ background: 'var(--gold-bg)', color: 'var(--ink)' }}>{tool.formula}</div><Link to={`/tools/${tool.slug}`} className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold" style={{ color: 'var(--gold)' }}>Open calculator <ArrowRight className="w-4 h-4" /></Link></article>)}
        </div>
      </section>

      {enhancement.relatedLearning?.length > 0 && <section className="page-container pb-10"><div className="card-paper p-6 sm:p-8"><h2 className="text-3xl" style={{ fontFamily: 'var(--font-serif)', color: 'var(--ink)' }}>Continue the topic</h2><div className="grid sm:grid-cols-2 gap-3 mt-5">{enhancement.relatedLearning.map(([to, label]) => <Link key={to} to={to} className="tile-paper p-4 flex items-center justify-between gap-3 font-semibold text-sm"><span>{label}</span><ArrowRight className="w-4 h-4" style={{ color: 'var(--gold)' }} /></Link>)}</div></div></section>}

      <section className="page-container pb-10">
        <div className="card-paper p-6 sm:p-8"><span className="eyebrow">Quick answers</span><h2 className="text-3xl mt-4" style={{ fontFamily: 'var(--font-serif)', color: 'var(--ink)' }}>Common questions</h2><div className="mt-5 divide-y" style={{ borderColor: 'var(--border-soft)' }}>{cluster.faq.map(([q, a]) => <div key={q} className="py-5"><h3 className="font-semibold" style={{ color: 'var(--ink)' }}>{q}</h3><p className="text-sm leading-7 mt-2" style={{ color: 'var(--muted)' }}>{a}</p></div>)}</div></div>
      </section>

      <section className="page-container pb-16">
        <h2 className="text-3xl mb-5" style={{ fontFamily: 'var(--font-serif)', color: 'var(--ink)' }}>Explore other Commerce toolkits</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">{toolClusters.filter((item) => item.slug !== cluster.slug).map((item) => <Link key={item.slug} to={`/tools/topics/${item.slug}`} className="card-paper p-5 flex items-center justify-between gap-3"><div><div className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--gold)' }}>Topic toolkit</div><div className="font-semibold mt-1" style={{ color: 'var(--ink)' }}>{item.title}</div></div><ArrowRight className="w-4 h-4 flex-shrink-0" style={{ color: 'var(--gold)' }} /></Link>)}</div>
      </section>
    </div>
  );
}
