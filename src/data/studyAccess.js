import { seoMaterials } from './seoMaterials.js';
import { gsebMaterials, gsebPremiumEconomicsMaterials } from './gsebMaterials.js';
import { ccspMaterials } from './ccspMaterials.js';
import { verifiedQuizPacks } from './quizCatalog.js';
import { cbse12AccountancyPremiumMaterials } from './cbse12AccountancyPremium.js';

export const studyAccessItems = [
  ...[...seoMaterials, ...gsebMaterials, ...ccspMaterials].map(item => ({
    id: `note:${item.id}`, kind: 'Notes', title: item.title,
    board: item.board || 'CBSE', classLevel: Number(item.class ?? item.class_level), subject: item.subject,
    path: item.seo_path || item.file_url, pdf: item.file_url || '',
  })),
  ...gsebPremiumEconomicsMaterials.map(item => ({
    id: `note:${item.id}`, kind: 'Notes', title: `${item.title} · Premium revision PDF`,
    board: item.board, classLevel: item.class_level, subject: item.subject,
    path: `/premium/economics?board=GSEB&chapter=${item.chapterNumber}`, pdf: '',
  })),
  ...cbse12AccountancyPremiumMaterials.map(item => ({
    id: `note:cbse12-accountancy-${item.resourceKey}`, kind: 'Notes',
    title: `Part ${item.part} · Chapter ${item.chapterNumber} · ${item.title} · Premium Master PDF`,
    board: 'CBSE', classLevel: 12, subject: 'Accountancy',
    path: `/premium/cbse-12-accountancy?chapter=${item.resourceKey}`, pdf: '',
  })),
  ...verifiedQuizPacks.map(pack => ({
    id: `test:${pack.id}`, kind: 'Tests', title: `${pack.chapter} · ${pack.title}`,
    board: pack.board, classLevel: pack.classLevel, subject: pack.subject,
    path: `/quizzes?board=${pack.board}&class=${pack.classLevel}&subject=${encodeURIComponent(pack.subject)}&pack=${pack.id}`,
    pack,
  })),
].filter(item => item.path);

export function filterStudyAccess(items, { kind, board, classLevel, subject, search = '' }) {
  const words = search.toLowerCase().trim().split(/\s+/).filter(Boolean);
  return items.filter(item => item.kind === kind && item.board === board && item.classLevel === Number(classLevel)
    && (!subject || item.subject === subject) && words.every(word => `${item.title} ${item.subject}`.toLowerCase().includes(word)));
}
