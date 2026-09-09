import { verifiedQuizPacks } from './quizPublic.js';
const slug = text => text.normalize('NFKD').toLowerCase().replace(/[’']/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
export const quizDiscovery = verifiedQuizPacks.filter(p => p.board === 'CBSE' && p.subject === 'Economics').map(pack => ({
  id: pack.id,
  path: `/economics-quizzes/class-${pack.classLevel}/${slug(pack.title)}-mcq`,
  title: `${pack.title} MCQ — Class ${pack.classLevel}`,
  description: `Practise ${pack.title} MCQs for Class ${pack.classLevel}. Free Easy and Moderate quizzes, answer explanations and key concepts; Premium Hard and Extreme levels.`,
  pack,
}));
export const quizPageById = Object.fromEntries(quizDiscovery.map(p => [p.id, p]));
export const quizPageByPath = Object.fromEntries(quizDiscovery.map(p => [p.path, p]));
