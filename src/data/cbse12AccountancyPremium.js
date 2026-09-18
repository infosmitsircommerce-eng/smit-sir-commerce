export const CBSE_12_ACCOUNTANCY_PRODUCT_ID = 'cbse-12-accountancy';

export const cbse12AccountancyPremiumMaterials = [
  {
    resourceKey: 'part-1-chapter-1',
    part: 1,
    chapterNumber: 1,
    title: 'Partnership Accounting — Fundamentals',
    pages: 54,
    highlights: ['Partnership logic and deed', 'P&L appropriation and capital accounts', 'Working notes and numericals', 'MCQs, cases and exam practice'],
  },
  {
    resourceKey: 'part-1-chapter-2',
    part: 1,
    chapterNumber: 2,
    title: 'Goodwill: Nature and Valuation',
    pages: 20,
    highlights: ['Meaning and factors affecting goodwill', 'Average and super profit methods', 'Capitalisation methods', 'Worked numericals and revision'],
  },
  {
    resourceKey: 'part-1-chapter-3',
    part: 1,
    chapterNumber: 3,
    title: 'Change in Profit-Sharing Ratio',
    pages: 15,
    highlights: ['Old and new ratio logic', 'Sacrifice and gain', 'Goodwill and reserves', 'Revaluation and capital adjustment'],
  },
  {
    resourceKey: 'part-1-chapter-4',
    part: 1,
    chapterNumber: 4,
    title: 'Admission of a Partner',
    pages: 20,
    highlights: ['New and sacrificing ratios', 'Goodwill adjustment', 'Revaluation and special reserves', 'Capital adjustment and practice'],
  },
  {
    resourceKey: 'part-1-chapter-5',
    part: 1,
    chapterNumber: 5,
    title: 'Retirement or Death of a Partner',
    pages: 17,
    highlights: ['New and gaining ratios', 'Goodwill and revaluation', 'Amount due and capital adjustment', 'Death adjustments and Executor’s Account'],
  },
  {
    resourceKey: 'part-1-chapter-6',
    part: 1,
    chapterNumber: 6,
    title: 'Dissolution of a Partnership Firm',
    pages: 17,
    highlights: ['Realisation Account', 'Settlement order and journal entries', 'Special cases and unrecorded items', 'Full closing numericals'],
  },
  {
    resourceKey: 'part-2-chapter-1',
    part: 2,
    chapterNumber: 1,
    title: 'Issue of Share Capital',
    pages: 62,
    highlights: ['Issue and allotment logic', 'Pro-rata and oversubscription', 'Forfeiture and reissue', 'Schedule III and exam practice'],
  },
  {
    resourceKey: 'part-2-chapter-2',
    part: 2,
    chapterNumber: 2,
    title: 'Issue of Debentures',
    pages: 91,
    highlights: ['Issue at par, premium and discount', 'Redemption terms and collateral security', 'Non-cash consideration and interest', '35+ solved numerical patterns'],
  },
  {
    resourceKey: 'part-2-chapter-3',
    part: 2,
    chapterNumber: 3,
    title: 'Financial Statements & Analysis',
    pages: 93,
    highlights: ['Schedule III classification', 'Statement of Profit & Loss', 'Balance Sheet and notes', '30+ worked illustrations, MCQs and cases'],
  },
  {
    resourceKey: 'part-2-chapter-4',
    part: 2,
    chapterNumber: 4,
    title: 'Comparative & Common-Size Statements',
    pages: 132,
    highlights: ['Horizontal and vertical analysis', 'Comparative P&L and Balance Sheet', 'Common-size statements', '40+ solved illustrations and practice'],
  },
];

export const cbse12AccountancyPartStats = [
  { part: 1, label: 'Part I — Partnership Accounts', chapters: 6, pages: 143 },
  { part: 2, label: 'Part II — Company Accounts & Analysis', chapters: 4, pages: 378 },
];

export const CBSE_12_ACCOUNTANCY_TOTAL_PAGES = cbse12AccountancyPremiumMaterials.reduce((sum, item) => sum + item.pages, 0);
