export const GSEB_11_ACCOUNTANCY_PRODUCT_ID = 'gseb-11-accountancy-part1';

export const gseb11AccountancyPremiumMaterials = [
  {
    resourceKey: 'chapter-1',
    chapterNumber: 1,
    title: 'Accounting and Its Terminology',
    pages: 97,
    highlights: ['Complete terminology foundation', 'Practical transaction logic', 'Worked numericals', 'Board-style questions and revision'],
  },
  {
    resourceKey: 'chapter-2',
    chapterNumber: 2,
    title: 'Dual Effect of Transactions and Types of Accounts',
    pages: 50,
    highlights: ['Transaction classification', 'Types of accounts', 'Debit-credit analysis', 'Worked accounting tables'],
  },
  {
    resourceKey: 'chapter-3',
    chapterNumber: 3,
    title: 'Introduction to Goods and Services Tax',
    pages: 50,
    highlights: ['GST concepts and terminology', 'CGST, SGST and IGST', 'Input-output GST', 'Worked tax calculations'],
  },
  {
    resourceKey: 'chapter-4',
    chapterNumber: 4,
    title: 'Journal',
    pages: 76,
    highlights: ['Journal format and narration', '60+ worked entry patterns', 'Discount, bank and GST entries', 'Practical journal tables'],
  },
  {
    resourceKey: 'chapter-5',
    chapterNumber: 5,
    title: 'Accounting Equation and Business Transactions',
    pages: 48,
    highlights: ['Assets = Capital + Liabilities', 'Transaction effects', 'Equation tables', 'Worked numerical sequences'],
  },
  {
    resourceKey: 'chapter-6',
    chapterNumber: 6,
    title: 'Subsidiary Books',
    pages: 84,
    highlights: ['Purchase and Sales Books', 'Returns and debit-credit notes', 'GST and columnar formats', '45+ worked accounting tables'],
  },
  {
    resourceKey: 'chapter-7',
    chapterNumber: 7,
    title: 'Cash Book and Its Types',
    pages: 42,
    highlights: ['Simple, two-column and three-column Cash Book', 'Contra entries', 'Bank and discount columns', 'Petty Cash and imprest system'],
  },
  {
    resourceKey: 'chapter-8',
    chapterNumber: 8,
    title: 'Journal Proper',
    pages: 95,
    highlights: ['Opening and special entries', 'Transfers and closing entries', 'Adjustments and rectification', 'Comprehensive practical journal work'],
  },
  {
    resourceKey: 'chapter-9',
    chapterNumber: 9,
    title: 'Ledger - Posting',
    pages: 93,
    highlights: ['Posting from every major book', 'Proper ledger accounts', 'Balancing', '50+ worked posting patterns'],
  },
  {
    resourceKey: 'chapter-10',
    chapterNumber: 10,
    title: 'Trial Balance',
    pages: 83,
    highlights: ['Ledger balance classification', 'Trial Balance methods', 'Errors and suspense', '20+ Trial Balance problems and drills'],
  },
];

export const gseb11AccountancyPremiumBook = {
  resourceKey: 'complete-book',
  title: 'GSEB Std. 11 Accountancy Part 1 - Premium Complete Book',
  pages: 720,
  chapterPages: gseb11AccountancyPremiumMaterials.reduce((total, item) => total + item.pages, 0),
  chapterCount: gseb11AccountancyPremiumMaterials.length,
};

export const gseb11AccountancyPremiumBenefits = [
  'All 10 Part 1 chapters in one organised Premium library',
  'Detailed explanations built around accounting logic, not memorised rules',
  'Accounting-style tables and correct formats throughout practical chapters',
  'Worked illustrations and step-by-step numerical explanations',
  'Question-answer practice, MCQs, revision drills and common-error guidance',
  'Chapter-wise access plus a single 720-page complete-book edition',
];
