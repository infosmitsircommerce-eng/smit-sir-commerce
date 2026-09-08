import { verifiedQuizPacks, quizLevels } from '../src/data/quizzes.js';

const errors = [];
const ids = new Set();

function fail(message) {
  errors.push(message);
}

for (const pack of verifiedQuizPacks) {
  if (!pack?.id) {
    fail('Quiz pack without id.');
    continue;
  }
  if (ids.has(pack.id)) fail(`Duplicate quiz pack id: ${pack.id}`);
  ids.add(pack.id);

  if (!pack.title || !pack.board || !pack.classLevel || !pack.subject) {
    fail(`${pack.id}: missing core metadata.`);
  }
  if (!pack.sourceLabel || !pack.sourceStatus) {
    fail(`${pack.id}: missing source label/status.`);
  }

  const keys = Object.keys(pack.levels || {});
  for (const level of quizLevels) {
    if (!keys.includes(level)) {
      fail(`${pack.id}: missing level ${level}.`);
      continue;
    }

    const questions = pack.levels[level];
    if (!Array.isArray(questions) || questions.length === 0) {
      fail(`${pack.id} / ${level}: no questions.`);
      continue;
    }

    // Full CBSE Micro/Macro/IED banks are intentionally standardized to 10 per level.
    if (/^cbse-(11-micro|12-macro|12-ied)-/.test(pack.id) && questions.length !== 10) {
      fail(`${pack.id} / ${level}: expected 10 questions, found ${questions.length}.`);
    }

    const seenQuestions = new Set();
    questions.forEach((question, index) => {
      const prefix = `${pack.id} / ${level} / Q${index + 1}`;
      if (!question?.q?.trim()) fail(`${prefix}: missing question text.`);
      if (seenQuestions.has(question?.q)) fail(`${prefix}: duplicate question text inside level.`);
      seenQuestions.add(question?.q);

      if (!Array.isArray(question?.options) || question.options.length !== 4) {
        fail(`${prefix}: expected exactly 4 options.`);
      } else {
        const normalized = question.options.map((option) => String(option).trim().toLowerCase());
        if (new Set(normalized).size !== 4) fail(`${prefix}: duplicate answer options.`);
      }

      if (!Number.isInteger(question?.answer) || question.answer < 0 || question.answer > 3) {
        fail(`${prefix}: invalid answer index ${question?.answer}.`);
      }
      if (!question?.explanation?.trim()) fail(`${prefix}: missing explanation.`);
    });
  }

  const unexpectedLevels = keys.filter((level) => !quizLevels.includes(level));
  if (unexpectedLevels.length) {
    fail(`${pack.id}: unexpected levels: ${unexpectedLevels.join(', ')}.`);
  }
}

const cbseMicro = verifiedQuizPacks.filter((pack) => /^cbse-11-micro-/.test(pack.id));
const cbseMacro = verifiedQuizPacks.filter((pack) => /^cbse-12-macro-/.test(pack.id));
const cbseIed = verifiedQuizPacks.filter((pack) => /^cbse-12-ied-/.test(pack.id));

if (cbseMicro.length !== 13) fail(`Expected 13 Micro packs, found ${cbseMicro.length}.`);
if (cbseMacro.length !== 5) fail(`Expected 5 Macro packs, found ${cbseMacro.length}.`);
if (cbseIed.length !== 13) fail(`Expected 13 IED packs, found ${cbseIed.length}.`);

const countQuestions = (packs) => packs.reduce(
  (total, pack) => total + Object.values(pack.levels || {}).reduce((sum, questions) => sum + questions.length, 0),
  0
);

const microQuestions = countQuestions(cbseMicro);
const macroQuestions = countQuestions(cbseMacro);
const iedQuestions = countQuestions(cbseIed);

if (microQuestions !== 520) fail(`Expected 520 Micro questions, found ${microQuestions}.`);
if (macroQuestions !== 200) fail(`Expected 200 Macro questions, found ${macroQuestions}.`);
if (iedQuestions !== 520) fail(`Expected 520 IED questions, found ${iedQuestions}.`);

if (errors.length) {
  console.error(`[quiz-audit] FAILED with ${errors.length} issue(s):`);
  errors.forEach((error) => console.error(` - ${error}`));
  process.exit(1);
}

console.log('[quiz-audit] PASS');
console.log(`[quiz-audit] Micro: ${cbseMicro.length} packs / ${microQuestions} questions`);
console.log(`[quiz-audit] Macro: ${cbseMacro.length} packs / ${macroQuestions} questions`);
console.log(`[quiz-audit] IED: ${cbseIed.length} packs / ${iedQuestions} questions`);
console.log(`[quiz-audit] Total catalog packs checked: ${verifiedQuizPacks.length}`);
