import { seoMaterials } from './seoMaterials.js';
import { gsebMaterials, gsebPremiumEconomicsMaterials } from './gsebMaterials.js';
import { verifiedQuizPacks } from './quizCatalog.js';

export const studyAccessItems = [
  ...[...seoMaterials, ...gsebMaterials].map(item => ({
    id: `note:${item.id}`, kind: 'Notes', title: item.title,
    board: item.board || 'CBSE', classLevel: Number(item.class ?? item.class_level), subject: item.subject,
    path: item.seo_path || item.file_url, pdf: item.file_url || '',
  })),
  ...gsebPremiumEconomicsMaterials.map(item => ({
    id: `note:${item.id}`, kind: 'Notes', title: `${item.title} · Premium revision PDF`,
    board: item.board, classLevel: item.class_level, subject: item.subject,
    path: `/premium/economics?board=GSEB&chapter=${item.chapterNumber}`, pdf: '',
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
