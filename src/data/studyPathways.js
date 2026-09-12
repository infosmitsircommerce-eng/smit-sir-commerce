import { gsebMaterials, gsebEconomicsHub } from './gsebMaterials.js';

const CLUSTERS = {
  businessStudies: {
    eyebrow: 'Business Studies learning path',
    title: 'Keep studying Business Studies without starting over',
    description: 'Move between chapter notes, important questions, MCQs and case-study practice and check the concepts you need to revise.',
    links: [
      ['/cbse/class-12/business-studies-notes', 'Class 12 Business Studies notes'],
      ['/cbse/class-12/business-studies-important-questions', 'Important questions'],
      ['/cbse/class-12/business-studies-case-study-questions', 'Case-study questions'],
      ['/cbse/class-12/business-studies-mcq', 'Business Studies MCQs'],
      ['/business-studies-tuition-mehsana', 'Business Studies tuition in Mehsana'],
    ],
  },
  microeconomics: {
    eyebrow: 'Class 11 Economics learning path',
    title: 'Connect Microeconomics notes, numericals and practice',
    description: 'Revise the theory, practise questions and check your working with the price elasticity calculator.',
    links: [
      ['/cbse/class-11/microeconomics-notes', 'Class 11 Microeconomics notes'],
      ['/cbse/class-11/microeconomics-important-questions', 'Microeconomics important questions'],
      ['/cbse/class-11/economics-numericals', 'Class 11 Economics numericals'],
      ['/tools/topics/price-elasticity-demand', 'Price elasticity numericals + calculator'],
      ['/economics-tuition-mehsana', 'Economics tuition in Mehsana'],
    ],
  },
  macroeconomics: {
    eyebrow: 'Class 12 Economics learning path',
    title: 'Connect Macroeconomics notes, revision and calculators',
    description: 'Build the chapter concept first, then use revision guides and numerical toolkits to practise the relationships behind the formulas.',
    links: [
      ['/cbse/class-12/macroeconomics-notes', 'Class 12 Macroeconomics notes'],
      ['/cbse/class-12/economics-revision-guide', 'Class 12 Economics revision guide'],
      ['/tools/topics/national-income-gdp', 'National Income solved numericals'],
      ['/tools/topics/income-determination', 'MPC, MPS & Multiplier numericals'],
      ['/economics-tuition-mehsana', 'Economics tuition in Mehsana'],
    ],
  },
  accountingRatios: {
    eyebrow: 'Accountancy learning tools',
    title: 'Continue with the Accounting Ratios toolkit',
    description: 'Accountancy on this website is a learning-resource area. Use related calculators and practice tools to verify formulas and working.',
    links: [
      ['/tools/topics/accounting-ratios', 'Accounting Ratios toolkit'],
      ['/tools/current-ratio-calculator', 'Current Ratio calculator'],
      ['/tools/debt-equity-ratio-calculator', 'Debt–Equity Ratio calculator'],
      ['/tools/return-on-investment-calculator', 'ROI / Capital Employed calculator'],
      ['/tests/class-12-accountancy-ratios-cashflow-exam', 'Ratios & Cash Flow practice test'],
    ],
  },
  cbseHub: {
    eyebrow: 'Explore the Commerce library',
    title: 'Turn one visit into a complete study session',
    description: 'Choose a subject hub, practise what you read and use the calculators where a chapter includes numericals.',
    links: [
      ['/cbse/class-12/business-studies-notes', 'Class 12 Business Studies notes'],
      ['/cbse/class-11/microeconomics-notes', 'Class 11 Microeconomics notes'],
      ['/cbse/class-12/macroeconomics-notes', 'Class 12 Macroeconomics notes'],
      ['/cbse-practice', 'Chapter-wise Commerce practice'],
      ['/tools', 'Free Commerce calculators'],
    ],
  },
  mehsana: {
    eyebrow: 'Mehsana student pathway',
    title: 'Study free first, then decide whether you need guided help',
    description: 'Explore the learning resources, practise weak chapters and use the free paper-analysis/demo option only if guided support would help.',
    links: [
      ['/commerce-coaching-mehsana', 'Commerce tuition in Mehsana'],
      ['/cbse-notes', 'Free CBSE Commerce notes'],
      ['/cbse-practice', 'Chapter-wise Commerce practice'],
      ['/tools', 'Free Commerce calculators'],
      ['/book-demo', 'Free paper analysis + demo'],
    ],
  },
};

const GSEB_ECONOMICS = {
  eyebrow: 'GSEB Class 12 Economics learning path',
  title: 'Revise and practise the same GSEB Economics chapter',
  description: 'Use Gujarat Board notes and practice for your chapter. If you need guided help, explore the Economics tuition options in Mehsana.',
  links: [
    [gsebEconomicsHub.path, 'GSEB Class 12 Economics notes'],
    [gsebEconomicsHub.practicePath, 'GSEB Economics chapter questions'],
    ['/gseb/class-12/economics-complete-revision-guide', 'GSEB Economics revision guide'],
    ['/gseb-economics-tuition-mehsana', 'GSEB Economics tuition in Mehsana'],
  ],
};
const ALL_BOARDS = {
  ...CLUSTERS.cbseHub,
  eyebrow: 'CBSE and GSEB Commerce resources',
  links: [
    ['/cbse-notes', 'CBSE Class 11 and 12 Commerce notes'],
    [gsebEconomicsHub.path, 'GSEB Class 12 Economics notes'],
    ['/quizzes', 'Chapter-wise Economics quizzes'],
    ['/tools', 'Economics and Accountancy calculators'],
    ['/commerce-coaching-mehsana', 'Commerce tuition in Mehsana'],
  ],
};
const normalizePath = path => path.split(/[?#]/)[0].replace(/\/$/, '') || '/';

function getCluster(path) {
  // Match board before subject: GSEB OCM and Economics must not lead to CBSE notes.
  const material = gsebMaterials.find(m => normalizePath(m.seo_path) === path);
  if (material?.subject === 'Business Administration') {
    const siblings = gsebMaterials.filter(m => m.subject === material.subject && m.class_level === material.class_level && m.id !== material.id)
      .sort((a, b) => Math.abs(a.chapterNumber - material.chapterNumber) - Math.abs(b.chapterNumber - material.chapterNumber)).slice(0, 3);
    return {
      eyebrow: `GSEB Class ${material.class_level} BA / OCM`,
      title: 'Continue with the next Business Administration topic',
      description: 'Stay with your class and board while revising related chapters. Open the full library to choose another subject.',
      links: [...siblings.map(m => [m.seo_path, `Chapter ${m.chapterNumber}: ${m.chapter}`]), ['/study-material', 'All CBSE and GSEB study material']],
    };
  }
  if (path.startsWith('/gseb-economics-quizzes/') || path.startsWith('/gseb/class-12/') || path.startsWith('/gseb-class-12-economics') || path === '/gseb-economics-tuition-mehsana') {
    return material?.practice_path ? {...GSEB_ECONOMICS, links: [[material.practice_path, `Practise ${material.chapter} questions`], ...GSEB_ECONOMICS.links]} : GSEB_ECONOMICS;
  }
  if (path === '/study-material' || path === '/quizzes') return ALL_BOARDS;
  if (path === '/cbse-notes' || path === '/cbse-practice') return CLUSTERS.cbseHub;
  if (path.endsWith('-mehsana')) {
    if (path.includes('business-studies')) return CLUSTERS.businessStudies;
    if (path.includes('class-11')) return CLUSTERS.microeconomics;
    if (path.includes('economics')) return {...CLUSTERS.macroeconomics, links: [CLUSTERS.microeconomics.links[0], ...CLUSTERS.macroeconomics.links]};
    return {...CLUSTERS.mehsana, links: [CLUSTERS.mehsana.links[1], [gsebEconomicsHub.path, 'GSEB Class 12 Economics notes'], ...CLUSTERS.mehsana.links]};
  }
  if (/(business-studies|bst-)/.test(path)) return CLUSTERS.businessStudies;
  if (path.startsWith('/economics-quizzes/class-11/') || /(microeconomics|price-elasticity|theory-of-demand|production-function|concepts-of-cost|concept-of-revenue|market-equilibrium|producers-equilibrium|economics-numericals)/.test(path)) return CLUSTERS.microeconomics;
  if (path.startsWith('/economics-quizzes/class-12/') || /(macroeconomics|national-income|gdp|income-determination|investment-multiplier|money-multiplier|consumption-function|saving-function|equilibrium-income|nfia|net-indirect-tax)/.test(path)) return CLUSTERS.macroeconomics;
  if (/(accounting-ratios|current-ratio|quick-ratio|debt-equity|proprietary-ratio|inventory-turnover|receivables-turnover|working-capital-turnover|profit-ratio|operating-ratio|return-on-investment|trade-payables|collection-period|payment-period|assets-to-debt|interest-coverage|common-size|accountancy-ratios-cashflow)/.test(path)) return CLUSTERS.accountingRatios;
  return null;
}

export function getStudyPathway(pathname) {
  const path = normalizePath(pathname);
  const cluster = getCluster(path);
  if (!cluster) return null;
  const seen = new Set([path]);
  return {...cluster, links: cluster.links.filter(([to]) => {
    const target = normalizePath(to);
    if (seen.has(target)) return false;
    seen.add(target);
    return true;
  }).slice(0, 5)};
}
