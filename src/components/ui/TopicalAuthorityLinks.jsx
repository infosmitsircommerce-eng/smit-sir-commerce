import { Link, useLocation } from 'react-router-dom';
import { ArrowRight, BookOpen, BrainCircuit, Calculator, MapPin } from 'lucide-react';

const CLUSTERS = {
  businessStudies: {
    eyebrow: 'Business Studies learning path',
    title: 'Keep studying Business Studies without starting over',
    description: 'Move between chapter notes, important questions, MCQs and case-study practice so each page strengthens the same subject cluster.',
    links: [
      ['/cbse/class-12/business-studies-notes', 'Class 12 Business Studies notes', BookOpen],
      ['/cbse/class-12/business-studies-important-questions', 'Important questions', BrainCircuit],
      ['/cbse/class-12/business-studies-case-study-questions', 'Case-study questions', BrainCircuit],
      ['/cbse/class-12/business-studies-mcq', 'Business Studies MCQs', BrainCircuit],
      ['/business-studies-tuition-mehsana', 'Business Studies tuition in Mehsana', MapPin],
    ],
  },
  microeconomics: {
    eyebrow: 'Class 11 Economics learning path',
    title: 'Connect Microeconomics notes, numericals and practice',
    description: 'Use the subject hub for theory, then move into important questions, numerical practice and calculators for the same concepts.',
    links: [
      ['/cbse/class-11/microeconomics-notes', 'Class 11 Microeconomics notes', BookOpen],
      ['/cbse/class-11/microeconomics-important-questions', 'Microeconomics important questions', BrainCircuit],
      ['/cbse/class-11/economics-numericals', 'Class 11 Economics numericals', BrainCircuit],
      ['/tools/price-elasticity-demand-calculator', 'Price elasticity calculator', Calculator],
      ['/economics-tuition-mehsana', 'Economics tuition in Mehsana', MapPin],
    ],
  },
  macroeconomics: {
    eyebrow: 'Class 12 Economics learning path',
    title: 'Connect Macroeconomics notes, revision and calculators',
    description: 'Build the chapter concept first, then use revision guides and numerical toolkits to practise the relationships behind the formulas.',
    links: [
      ['/cbse/class-12/macroeconomics-notes', 'Class 12 Macroeconomics notes', BookOpen],
      ['/cbse/class-12/economics-revision-guide', 'Class 12 Economics revision guide', BrainCircuit],
      ['/tools/topics/national-income-gdp', 'National Income & GDP toolkit', Calculator],
      ['/tools/topics/income-determination', 'Income Determination toolkit', Calculator],
      ['/economics-tuition-mehsana', 'Economics tuition in Mehsana', MapPin],
    ],
  },
  accountingRatios: {
    eyebrow: 'Accountancy learning tools',
    title: 'Continue with the Accounting Ratios toolkit',
    description: 'Accountancy on this website is a learning-resource area. Use related calculators and practice tools to verify formulas and working.',
    links: [
      ['/tools/topics/accounting-ratios', 'Accounting Ratios toolkit', Calculator],
      ['/tools/current-ratio-calculator', 'Current Ratio calculator', Calculator],
      ['/tools/debt-equity-ratio-calculator', 'Debt–Equity Ratio calculator', Calculator],
      ['/tools/return-on-investment-calculator', 'ROI / Capital Employed calculator', Calculator],
      ['/tests/class-12-accountancy-ratios-cashflow-exam', 'Ratios & Cash Flow practice test', BrainCircuit],
    ],
  },
  cbseHub: {
    eyebrow: 'Explore the Commerce library',
    title: 'Turn one visit into a complete study session',
    description: 'Choose a subject hub, practise what you read and use the calculators where a chapter includes numericals.',
    links: [
      ['/cbse/class-12/business-studies-notes', 'Class 12 Business Studies notes', BookOpen],
      ['/cbse/class-11/microeconomics-notes', 'Class 11 Microeconomics notes', BookOpen],
      ['/cbse/class-12/macroeconomics-notes', 'Class 12 Macroeconomics notes', BookOpen],
      ['/cbse-practice', 'Chapter-wise Commerce practice', BrainCircuit],
      ['/tools', 'Free Commerce calculators', Calculator],
    ],
  },
  mehsana: {
    eyebrow: 'Mehsana student pathway',
    title: 'Study free first, then decide whether you need guided help',
    description: 'Explore the learning resources, practise weak chapters and use the free paper-analysis/demo option only if guided support would help.',
    links: [
      ['/commerce-coaching-mehsana', 'Commerce tuition in Mehsana', MapPin],
      ['/cbse-notes', 'Free CBSE Commerce notes', BookOpen],
      ['/cbse-practice', 'Chapter-wise Commerce practice', BrainCircuit],
      ['/tools', 'Free Commerce calculators', Calculator],
      ['/book-demo', 'Free paper analysis + demo', ArrowRight],
    ],
  },
};

function getCluster(pathname) {
  const path = pathname.toLowerCase().replace(/\/$/, '');

  if (path === '/cbse-notes' || path === '/cbse-practice' || path === '/study-material') return CLUSTERS.cbseHub;
  if (/(commerce-coaching-mehsana|commerce-classes-mehsana|commerce-tuition-mehsana|economics-tuition-mehsana|business-studies-tuition-mehsana)/.test(path)) return CLUSTERS.mehsana;
  if (/(business-studies|bst-)/.test(path)) return CLUSTERS.businessStudies;
  if (/(microeconomics|price-elasticity|theory-of-demand|production-function|concepts-of-cost|concept-of-revenue|market-equilibrium|producers-equilibrium|economics-numericals)/.test(path)) return CLUSTERS.microeconomics;
  if (/(macroeconomics|national-income|gdp|income-determination|investment-multiplier|money-multiplier|consumption-function|saving-function|equilibrium-income|nfia|net-indirect-tax)/.test(path)) return CLUSTERS.macroeconomics;
  if (/(accounting-ratios|current-ratio|quick-ratio|debt-equity|proprietary-ratio|inventory-turnover|receivables-turnover|working-capital-turnover|profit-ratio|operating-ratio|return-on-investment|trade-payables|collection-period|payment-period|assets-to-debt|interest-coverage|common-size|accountancy-ratios-cashflow)/.test(path)) return CLUSTERS.accountingRatios;
  return null;
}

export default function TopicalAuthorityLinks() {
  const { pathname } = useLocation();
  const cluster = getCluster(pathname);
  if (!cluster) return null;

  const links = cluster.links.filter(([to]) => to !== pathname.replace(/\/$/, ''));

  return (
    <section className="page-container pb-10 lg:pb-14" aria-labelledby="topical-authority-heading">
      <div className="card-paper p-5 sm:p-7 md:p-8">
        <span className="eyebrow">{cluster.eyebrow}</span>
        <h2 id="topical-authority-heading" className="text-2xl sm:text-3xl mt-3" style={{ fontFamily: 'var(--font-serif)', color: 'var(--ink)' }}>
          {cluster.title}
        </h2>
        <p className="text-sm sm:text-base leading-7 mt-3 max-w-3xl" style={{ color: 'var(--muted)' }}>
          {cluster.description}
        </p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-6">
          {links.map(([to, label, Icon]) => (
            <Link key={to} to={to} className="tile-paper p-4 flex items-center justify-between gap-3 group">
              <span className="flex items-center gap-3 min-w-0">
                <span className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'var(--gold-bg)', color: 'var(--gold)' }}>
                  <Icon className="w-4 h-4" />
                </span>
                <span className="font-semibold text-sm leading-snug" style={{ color: 'var(--ink)' }}>{label}</span>
              </span>
              <ArrowRight className="w-4 h-4 flex-shrink-0 transition-transform group-hover:translate-x-1" style={{ color: 'var(--gold)' }} />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
