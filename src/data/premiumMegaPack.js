export const PREMIUM_MEGA_PACK_ID = 'commerce-mega-699';

export const PREMIUM_MEGA_INCLUDED_PRODUCT_IDS = [
  'gseb-11-accountancy-part1',
  'gseb-12-economics',
  'cbse-12-economics',
  'cbse-11-microeconomics',
];

export const PREMIUM_MEGA_PACK = {
  id: PREMIUM_MEGA_PACK_ID,
  name: 'Commerce Mega Premium Pack — All Current Premium Resources',
  shortName: 'Commerce Mega Premium',
  price: 699,
  board: 'CBSE + GSEB',
  classLevel: '11 & 12',
  subject: 'Commerce',
  accessPath: '/premium',
  previewPath: '/premium',
  badge: 'BEST VALUE',
  focus: 'One purchase for the complete Premium study ecosystem currently published on Smit Sir Commerce.',
};

export const PREMIUM_MEGA_SECTIONS = [
  {
    title: 'GSEB Std. 11 Accountancy — Part 1',
    meta: '720-page master book + 10 detailed chapter PDFs',
    detail: 'Accounting formats, tables, worked numericals, chapter practice, MCQs and revision.',
    href: '/premium/accountancy',
  },
  {
    title: 'GSEB Std. 12 Economics Premium',
    meta: '10 Premium revision PDFs · 117 pages',
    detail: 'Chapter-wise revision plus Hard + Extreme Premium Economics practice.',
    href: '/premium/economics?board=GSEB',
  },
  {
    title: 'CBSE Class 12 Economics Premium',
    meta: '18 chapter deep-dives · 360 concept explanations · 360 worked challenges',
    detail: 'Macroeconomics and Indian Economic Development with Hard + Extreme worked practice.',
    href: '/premium/economics?board=CBSE',
  },
  {
    title: 'CBSE Class 11 Microeconomics Premium',
    meta: '13 chapter deep-dives · 260 concept explanations · 260 worked challenges',
    detail: 'Concept-first Microeconomics learning with advanced solved practice.',
    href: '/premium/economics?board=CBSE',
  },
  {
    title: 'Premium MCQs, tests & exam practice',
    meta: 'Hard + Extreme questions, worked explanations and Pro-labelled tests',
    detail: 'Includes the Premium-gated quiz/test practice already published across the site.',
    href: '/test-series',
  },
  {
    title: 'Premium study tools',
    meta: 'Exam Mode and other Premium-gated learning features',
    detail: 'Use the serious-practice tools connected to your Premium student account.',
    href: '/exam-mode',
  },
];
