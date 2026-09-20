import { seoMaterials } from './seoMaterials.js';
import { gsebMaterials, gsebPremiumEconomicsMaterials } from './gsebMaterials.js';
import { ccspMaterials } from './ccspMaterials.js';
import { verifiedQuizPacks } from './quizCatalog.js';
import { cbse12AccountancyPremiumMaterials } from './cbse12AccountancyPremium.js';
import { cbse12BusinessStudiesPremiumMaterials } from './cbse12BusinessStudiesPremium.js';

const publicNotes = [...seoMaterials, ...gsebMaterials, ...ccspMaterials].map(item => {
  const isCbse12BstQuick = (item.board || 'CBSE') === 'CBSE'
    && Number(item.class ?? item.class_level) === 12
    && item.subject === 'Business Studies';

  return {
    id: `note:${item.id}`,
    kind: 'Notes',
    title: isCbse12BstQuick ? `${item.title} · FREE Quick Notes` : item.title,
    board: item.board || 'CBSE',
    classLevel: Number(item.class ?? item.class_level),
    subject: item.subject,
    path: item.seo_path || item.file_url,
    pdf: item.file_url || '',
    access: 'free',
    edition: isCbse12BstQuick ? 'quick' : 'standard',
  };
});

export const studyAccessItems = [
  ...publicNotes,
  ...gsebPremiumEconomicsMaterials.map(item => ({
    id: `note:${item.id}`, kind: 'Notes', title: `${item.title} · Premium revision PDF`,
    board: item.board, classLevel: item.class_level, subject: item.subject,
    path: `/premium/economics?board=GSEB&chapter=${item.chapterNumber}`, pdf: '',
    access: 'premium', edition: 'premium',
  })),
  ...cbse12AccountancyPremiumMaterials.map(item => ({
    id: `note:cbse12-accountancy-${item.resourceKey}`, kind: 'Notes',
    title: `Part ${item.part} · Chapter ${item.chapterNumber} · ${item.title} · Premium Master PDF`,
    board: 'CBSE', classLevel: 12, subject: 'Accountancy',
    path: `/premium/cbse-12-accountancy?chapter=${item.resourceKey}`, pdf: '',
    access: 'premium', edition: 'premium',
  })),
  ...cbse12BusinessStudiesPremiumMaterials.map(item => ({
    id: `note:cbse12-bst-${item.resourceKey}`, kind: 'Notes',
    title: `Chapter ${item.chapterNumber} · ${item.title} · ${item.pages}-page Detailed Premium Master`,
    board: 'CBSE', classLevel: 12, subject: 'Business Studies',
    path: `/premium/cbse-12-business-studies?chapter=${item.resourceKey}`, pdf: '',
    access: 'premium', edition: 'master',
  })),
  ...verifiedQuizPacks.map(pack => ({
    id: `test:${pack.id}`, kind: 'Tests', title: `${pack.chapter} · ${pack.title}`,
    board: pack.board, classLevel: pack.classLevel, subject: pack.subject,
    path: `/quizzes?board=${pack.board}&class=${pack.classLevel}&subject=${encodeURIComponent(pack.subject)}&pack=${pack.id}`,
    pack,
  })),
].filter(item => item.path);

const noteItems = studyAccessItems.filter(item => item.kind === 'Notes');
export const studyResourceStats = {
  notesTotal: noteItems.length,
  freeNotes: noteItems.filter(item => item.access !== 'premium').length,
  premiumNotes: noteItems.filter(item => item.access === 'premium').length,
  testsTotal: studyAccessItems.filter(item => item.kind === 'Tests').length,
  totalResources: studyAccessItems.length,
};

export function filterStudyAccess(items, { kind, board, classLevel, subject, search = '' }) {
  const words = search.toLowerCase().trim().split(/\s+/).filter(Boolean);
  return items.filter(item => item.kind === kind && item.board === board && item.classLevel === Number(classLevel)
    && (!subject || item.subject === subject) && words.every(word => `${item.title} ${item.subject}`.toLowerCase().includes(word)));
}
