import { commerceToolBySlug } from './allCommerceTools.js';

export const toolClusters = [
  {
    slug: 'national-income-gdp',
    title: 'National Income & GDP Calculators',
    h1: 'National Income & GDP Calculator Toolkit for Class 12 Economics',
    description: 'Solve GDP, NDP, GNP, NNP, national income, real GDP, nominal GDP, GDP deflator, NFIA and market-price/factor-cost conversions with free step-by-step calculators.',
    intro: 'National Income numericals become difficult when students know each formula separately but are unsure which adjustment comes next. This toolkit groups the most useful Class 12 GDP and National Income calculators in one place so you can move from the given aggregate to the required aggregate step by step.',
    toolSlugs: [
      'domestic-national-aggregate-converter',
      'national-income-income-method-calculator',
      'national-income-expenditure-method-calculator',
      'national-income-value-added-method-calculator',
      'gdp-to-ndp-calculator',
      'gdp-deflator-calculator',
      'real-gdp-calculator',
      'nominal-gdp-calculator',
      'factor-cost-from-market-price-calculator',
      'market-price-from-factor-cost-calculator',
      'nfia-calculator',
      'net-indirect-tax-calculator',
    ],
    concepts: ['GDP, NDP, GNP and NNP', 'Domestic versus national aggregates', 'Gross versus net aggregates', 'Market price versus factor cost', 'NFIA and net indirect taxes', 'Real GDP, nominal GDP and GDP deflator', 'Income, expenditure and value-added methods'],
    faq: [
      ['How do I convert GDP into National Income?', 'Start from the given aggregate, add NFIA to move from domestic to national, subtract depreciation to move from gross to net, and subtract net indirect taxes to move from market price to factor cost. The exact steps depend on the starting aggregate.'],
      ['Which method is used to calculate National Income?', 'Class 12 Economics commonly studies the income method, expenditure method and value-added or product method. Separate calculators are provided for all three.'],
      ['Are these calculators free?', 'Yes. Every calculator in this toolkit is free and shows the formula and working, not only the final number.'],
    ],
  },
  {
    slug: 'income-determination',
    title: 'Income Determination, MPC & Multiplier Calculators',
    h1: 'Income Determination, MPC, MPS & Multiplier Toolkit for Class 12 Economics',
    description: 'Calculate MPC, MPS, APC, APS, consumption, saving, investment multiplier, equilibrium income and change in income with free Class 12 Economics tools.',
    intro: 'Income Determination questions connect several formulas: consumption, saving, MPC, MPS, multiplier and equilibrium income. This cluster keeps those relationships together so students can understand the sequence instead of memorising isolated formulas.',
    toolSlugs: [
      'mpc-mps-calculator',
      'apc-aps-calculator',
      'consumption-function-calculator',
      'saving-function-calculator',
      'investment-multiplier-calculator',
      'equilibrium-income-calculator',
      'multiplier-income-change-calculator',
    ],
    concepts: ['MPC and MPS', 'APC and APS', 'Consumption function', 'Saving function', 'Investment multiplier', 'Equilibrium income', 'Change in income due to change in investment'],
    faq: [
      ['What is the relation between MPC and MPS?', 'In the simple consumption-saving model, MPC + MPS = 1. If one is known, the other can be calculated immediately.'],
      ['How is the investment multiplier calculated?', 'The simple multiplier is k = 1/(1 − MPC), which is also equal to 1/MPS.'],
      ['How do I calculate equilibrium income?', 'In a simple two-sector model with C = C̄ + MPC×Y and autonomous investment I, equilibrium income is Y = (C̄ + I)/(1 − MPC).'],
    ],
  },
  {
    slug: 'accounting-ratios',
    title: 'Class 12 Accountancy Ratio Calculators',
    h1: 'Accounting Ratio Calculators for Class 12 Accountancy',
    description: 'Calculate liquidity, solvency, activity and profitability ratios with free Class 12 Accountancy calculators and step-by-step working.',
    intro: 'Accounting Ratios contains many formulas that look similar but use different numerators, denominators and averages. This toolkit groups the major Class 12 ratios so students can select the correct formula, enter the figures and verify their working.',
    toolSlugs: [
      'current-ratio-calculator',
      'quick-ratio-calculator',
      'debt-equity-ratio-calculator',
      'proprietary-ratio-calculator',
      'inventory-turnover-ratio-calculator',
      'trade-receivables-turnover-ratio-calculator',
      'working-capital-turnover-ratio-calculator',
      'net-profit-ratio-calculator',
      'operating-ratio-calculator',
      'return-on-investment-calculator',
      'trade-payables-turnover-ratio-calculator',
      'average-collection-period-calculator',
      'average-payment-period-calculator',
      'gross-profit-ratio-calculator',
      'operating-profit-ratio-calculator',
      'total-assets-to-debt-ratio-calculator',
      'interest-coverage-ratio-calculator',
      'common-size-statement-calculator',
    ],
    concepts: ['Liquidity ratios', 'Solvency ratios', 'Activity or turnover ratios', 'Profitability ratios', 'Average collection and payment periods', 'Return on investment', 'Common-size analysis'],
    faq: [
      ['Which ratios are included?', 'The toolkit includes liquidity, solvency, turnover and profitability ratios, along with collection/payment periods and common-size analysis.'],
      ['Should I memorise every ratio?', 'You should know the formula and meaning, but practice is equally important. Use the calculators to verify your working after solving the question yourself.'],
      ['Are the answers exam-ready?', 'The calculators show formula and substitution steps. In an exam, follow the terminology and presentation required by your school or board.'],
    ],
  },
];

export const toolClusterBySlug = Object.fromEntries(toolClusters.map((cluster) => [cluster.slug, cluster]));

export function getClusterTools(cluster) {
  return (cluster?.toolSlugs || []).map((slug) => commerceToolBySlug[slug]).filter(Boolean);
}

export function getContextualToolSlugs(pathname = '') {
  const path = String(pathname).toLowerCase();
  if (!(path.startsWith('/cbse/') || path.startsWith('/practice/cbse/'))) return [];

  if (/(national-income|gdp|gross-domestic|net-domestic|gross-national|net-national|domestic-product|national-product|real-gdp|nominal-gdp)/.test(path)) {
    return ['domestic-national-aggregate-converter', 'national-income-income-method-calculator', 'national-income-expenditure-method-calculator', 'gdp-deflator-calculator'];
  }
  if (/(income-determination|determination-of-income|employment|aggregate-demand|consumption-function|saving-function|investment-multiplier|multiplier)/.test(path)) {
    return ['mpc-mps-calculator', 'consumption-function-calculator', 'investment-multiplier-calculator', 'equilibrium-income-calculator'];
  }
  if (/(price-elasticity-of-demand|elasticity-of-demand)/.test(path)) return ['price-elasticity-demand-calculator'];
  if (/(concept-of-revenue|revenue-curves|tr-ar-mr)/.test(path)) return ['tr-ar-mr-calculator'];
  if (/(concepts-of-cost|cost-curves)/.test(path)) return ['cost-curves-calculator'];
  if (/(producers-equilibrium|producer-equilibrium)/.test(path)) return ['cost-curves-calculator', 'tr-ar-mr-calculator'];
  if (/(accounting-ratios|accounting-ratio|ratio-analysis|accountancy-ratio)/.test(path)) return ['current-ratio-calculator', 'quick-ratio-calculator', 'debt-equity-ratio-calculator', 'gross-profit-ratio-calculator'];
  return [];
}

export function getContextualTools(pathname = '') {
  return getContextualToolSlugs(pathname).map((slug) => commerceToolBySlug[slug]).filter(Boolean);
}
