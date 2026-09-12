import { BOARD_BOOSTER_PRODUCTS } from './boardBoosterProducts.js';

export function getStudyOffer(pathname, { subject = '', classLevel = 12 } = {}) {
  const path = pathname.replace(/\/$/, '');
  const board = /(?:^|\/)gseb(?:\/|$)/.test(path) ? 'GSEB' : 'CBSE';
  const resolvedClass = Number(path.match(/class-(11|12)(?:\/|-|$)/)?.[1] || classLevel);
  const resolvedSubject = subject || (/business-studies/i.test(path) ? 'Business Studies' : /economics|microeconomics|macroeconomics|indian-economic-development|national-income/i.test(path) ? 'Economics' : '');
  const product = BOARD_BOOSTER_PRODUCTS.find(item => item.board === board && item.classLevel === resolvedClass && item.subject === resolvedSubject);
  // Only recommend a paid pack when its board, class and subject match the resource.
  if (!product) return null;
  return { product, board, classLevel: resolvedClass, subject: resolvedSubject };
}
