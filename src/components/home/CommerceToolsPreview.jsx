import { Link } from 'react-router-dom';
import { Calculator, ArrowRight, TrendingUp } from 'lucide-react';
import { commerceTools } from '../../data/allCommerceTools';

const featuredSlugs = [
  'mpc-mps-calculator',
  'consumption-function-calculator',
  'domestic-national-aggregate-converter',
  'tr-ar-mr-calculator',
  'current-ratio-calculator',
  'gross-profit-ratio-calculator',
];

export default function CommerceToolsPreview() {
  const featured = featuredSlugs.map((slug) => commerceTools.find((tool) => tool.slug === slug)).filter(Boolean);
  return (
    <section className="section-padding" style={{ background: 'var(--bg-ivory)' }} aria-labelledby="commerce-calculators-home">
      <div className="page-container">
        <div className="max-w-3xl mb-8">
          <span className="eyebrow">New · 41 free problem solvers</span>
          <h2 id="commerce-calculators-home" className="headline mt-5">Confused by the formula? Calculate it and see every step.</h2>
          <p className="mt-4 text-sm leading-7" style={{ color: 'var(--muted)' }}>MPC, MPS, consumption and saving functions, GDP conversions, national income, TR-AR-MR, costs and Class 12 Accountancy ratios — built as free interactive tools for Commerce students.</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {featured.map((tool) => (
            <Link key={tool.slug} to={`/tools/${tool.slug}`} className="card-paper p-5 group">
              <div className="flex items-center justify-between gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'var(--gold-bg)' }}><Calculator className="w-5 h-5" style={{ color: 'var(--gold)' }} /></div>
                <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--muted)' }}>{tool.category}</span>
              </div>
              <h3 className="text-xl mt-4 leading-snug" style={{ fontFamily: 'var(--font-serif)', color: 'var(--ink)' }}>{tool.title}</h3>
              <p className="text-xs leading-5 mt-3" style={{ color: 'var(--muted)' }}>{tool.formula}</p>
              <span className="inline-flex items-center gap-1.5 mt-4 text-sm font-semibold" style={{ color: 'var(--gold)' }}>Solve now <ArrowRight className="w-4 h-4" /></span>
            </Link>
          ))}
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link to="/tools" className="btn-primary inline-flex items-center gap-2"><TrendingUp className="w-4 h-4" /> Open all 41 free Commerce calculators</Link>
          <Link to="/cbse-notes" className="btn-outline-ink">Free CBSE notes</Link>
        </div>
      </div>
    </section>
  );
}
