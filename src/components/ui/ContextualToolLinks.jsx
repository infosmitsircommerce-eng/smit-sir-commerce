import { Link, useLocation } from 'react-router-dom';
import { Calculator, ArrowRight } from 'lucide-react';
import { getContextualTools, toolClusters } from '../../data/toolClusters';

function clusterForPath(pathname) {
  const path = pathname.toLowerCase();
  if (/(national-income|gdp|gross-domestic|net-domestic|gross-national|net-national|domestic-product|national-product|real-gdp|nominal-gdp)/.test(path)) return toolClusters.find((item) => item.slug === 'national-income-gdp');
  if (/(income-determination|determination-of-income|employment|aggregate-demand|consumption-function|saving-function|investment-multiplier|multiplier)/.test(path)) return toolClusters.find((item) => item.slug === 'income-determination');
  if (/(accounting-ratios|accounting-ratio|ratio-analysis|accountancy-ratio)/.test(path)) return toolClusters.find((item) => item.slug === 'accounting-ratios');
  return null;
}

export default function ContextualToolLinks() {
  const { pathname } = useLocation();
  const tools = getContextualTools(pathname);
  const cluster = clusterForPath(pathname);
  if (!tools.length) return null;

  return (
    <section className="page-container pb-10" aria-labelledby="related-calculators-heading">
      <div className="card-paper p-5 sm:p-7">
        <div className="flex items-start gap-3">
          <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'var(--gold-bg)' }}>
            <Calculator className="w-5 h-5" style={{ color: 'var(--gold)' }} />
          </div>
          <div>
            <span className="eyebrow">Solve the numerical</span>
            <h2 id="related-calculators-heading" className="text-2xl sm:text-3xl mt-2" style={{ fontFamily: 'var(--font-serif)', color: 'var(--ink)' }}>Free calculators for this topic</h2>
            <p className="text-sm leading-7 mt-2" style={{ color: 'var(--muted)' }}>Read the concept, solve it yourself, then use the calculator to verify the formula and step-by-step working.</p>
          </div>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-6">
          {tools.map((tool) => (
            <Link key={tool.slug} to={`/tools/${tool.slug}`} className="tile-paper p-4 flex flex-col justify-between gap-3">
              <div><div className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--gold)' }}>{tool.classLevel}</div><div className="font-semibold mt-1 leading-snug" style={{ color: 'var(--ink)' }}>{tool.title}</div></div>
              <span className="inline-flex items-center gap-1 text-xs font-semibold" style={{ color: 'var(--gold)' }}>Open calculator <ArrowRight className="w-3.5 h-3.5" /></span>
            </Link>
          ))}
        </div>
        {cluster && <Link to={`/tools/topics/${cluster.slug}`} className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold" style={{ color: 'var(--gold)' }}>Open the complete {cluster.title} toolkit <ArrowRight className="w-4 h-4" /></Link>}
      </div>
    </section>
  );
}
