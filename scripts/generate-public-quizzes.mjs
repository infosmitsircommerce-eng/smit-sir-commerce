import { writeFile } from 'node:fs/promises';
import { quizBoards, verifiedQuizPacks } from '../src/data/quizzes.js';
const packs = verifiedQuizPacks.map(({ levels, ...metadata }) => ({ ...metadata,
  levelCounts: Object.fromEntries(Object.entries(levels).map(([level, questions]) => [level, questions.length])),
  levels: { Easy: levels.Easy, Moderate: levels.Moderate },
}));
const content = `// Public quiz catalog: Premium question bodies are served by the authenticated API.\nexport const quizBoards = ${JSON.stringify(quizBoards)};\nexport const quizLevels = ['Easy', 'Moderate', 'Hard', 'Extreme'];\nexport const verifiedQuizPacks = ${JSON.stringify(packs)};\nexport function getQuizPacks(board, classLevel, subject) { return verifiedQuizPacks.filter(p => p.board === board && p.classLevel === classLevel && p.subject === subject); }\n`;
await writeFile(new URL('../src/data/quizPublic.js', import.meta.url), content);
console.log(`Generated ${packs.length} public quiz packs; Hard/Extreme question bodies excluded.`);
