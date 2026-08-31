const MISTAKE_KEY = 'ssc-mistake-book-v1';

function read() {
  try { return JSON.parse(localStorage.getItem(MISTAKE_KEY) || '[]'); } catch { return []; }
}

function write(items) {
  try { localStorage.setItem(MISTAKE_KEY, JSON.stringify(items.slice(0, 500))); } catch { /* ignore */ }
  window.dispatchEvent(new CustomEvent('ssc-study-state-changed'));
}

export function addTestMistakes({ testId, testName, subject, topic, questions, answers, source = 'Test Series' }) {
  const existing = read();
  const byId = new Map(existing.map((item) => [item.id, item]));
  (questions || []).forEach((question, index) => {
    if (answers?.[index] === question.answer) return;
    const id = `${source.toLowerCase().replace(/\s+/g, '-')}-${testId || testName || 'test'}-${question.id || index}`;
    const previous = byId.get(id);
    byId.set(id, {
      id,
      subject: question.subject || subject || 'Commerce',
      topic: question.topic || topic || testName || subject || 'Test practice',
      question: question.question,
      options: question.options,
      answer: question.answer,
      explanation: question.explanation || 'Review the underlying concept and try this question again.',
      source,
      timesWrong: (previous?.timesWrong || 0) + 1,
      lastWrongAt: new Date().toISOString(),
      mastered: false,
    });
  });
  const next = [...byId.values()].sort((a, b) => (b.timesWrong || 0) - (a.timesWrong || 0));
  write(next);
  return next;
}

export function getMistakeBook() {
  return read();
}
