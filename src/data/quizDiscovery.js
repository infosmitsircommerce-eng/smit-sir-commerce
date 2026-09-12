import { verifiedQuizPacks } from './quizPublic.js';
import { gsebMaterials, gsebEconomicsHub } from './gsebMaterials.js';
import { seoMaterials } from './seoMaterials.js';
const slug = text => text.normalize('NFKD').toLowerCase().replace(/[’']/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
export const quizDiscovery = verifiedQuizPacks.filter(p => ['CBSE', 'GSEB'].includes(p.board) && p.subject === 'Economics').map(pack => {
  const gseb = pack.board === 'GSEB';
  const notes = gseb
    ? gsebMaterials.find(m => m.board === pack.board && m.class_level === pack.classLevel && m.subject === pack.subject && m.chapterNumber === pack.chapterNumber)
    : pack.classLevel === 11 ? seoMaterials.find(m => m.hubId?.includes('micro') && m.chapterNumber === Number(pack.id.match(/ch(\d+)$/)?.[1])) : undefined;
  const freeLevelLabel = gseb ? 'Medium' : 'Moderate';
  const params = new URLSearchParams({board: pack.board, class: String(pack.classLevel), subject: pack.subject, pack: pack.id});
  return {
    id: pack.id,
    path: `/${gseb ? 'gseb-economics-quizzes' : 'economics-quizzes'}/class-${pack.classLevel}/${slug(pack.title)}-mcq`,
    title: `${gseb ? 'GSEB ' : ''}${pack.title} MCQ — Class ${pack.classLevel}`,
    description: `Practise ${gseb ? 'GSEB ' : ''}${pack.title} MCQs for Class ${pack.classLevel}. Free Easy and ${freeLevelLabel} quizzes, answer explanations and key concepts; Premium Hard and Extreme levels.`,
    testPath: `/quizzes?${params}`,
    notesPath: notes?.seo_path,
    revisionPath: gseb ? gsebEconomicsHub.path : pack.classLevel === 11 ? '/cbse/class-11/microeconomics-notes' : '/cbse/class-12/economics-revision-guide',
    freeLevelLabel,
    pack,
  };
});
export function getRelatedQuizPages(page) {
  const {pack} = page;
  return quizDiscovery.filter(p => p.id !== page.id && p.pack.board === pack.board && p.pack.classLevel === pack.classLevel && p.pack.subject === pack.subject && p.pack.stream === pack.stream).slice(0, 4);
}
export const quizPageById = Object.fromEntries(quizDiscovery.map(p => [p.id, p]));
export const quizPageByPath = Object.fromEntries(quizDiscovery.map(p => [p.path, p]));
