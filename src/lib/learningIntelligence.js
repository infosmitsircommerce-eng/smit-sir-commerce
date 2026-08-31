function safeRead(key, fallback = []) {
  try { return JSON.parse(localStorage.getItem(key) || JSON.stringify(fallback)); } catch { return fallback; }
}

export function getUnifiedLearningSnapshot(userId) {
  const daily = safeRead('ssc-daily10-history-v1', []);
  const mistakes = safeRead('ssc-mistake-book-v1', []);
  const examAttempts = safeRead('ssc-exam-attempts-v1', []);
  const oldAttempts = safeRead(`ssc-test-attempts-v1:${userId || 'guest'}`, []);
  const chapterProgress = safeRead('ssc-chapter-progress-v1', []);
  const topicMap = new Map();

  const bump = (topic, subject, correct, total, source) => {
    if (!topic || !total) return;
    const current = topicMap.get(topic) || { topic, subject: subject || 'Commerce', correct: 0, total: 0, sources: new Set() };
    current.correct += Number(correct || 0);
    current.total += Number(total || 0);
    current.sources.add(source);
    topicMap.set(topic, current);
  };

  daily.forEach((entry) => {
    Object.entries(entry.topicStats || {}).forEach(([topic, stat]) => bump(topic, stat.subject, stat.correct, stat.total, 'Daily 10'));
  });

  mistakes.forEach((item) => bump(item.topic || item.subject || 'Mistake Book', item.subject, item.mastered ? 1 : 0, 1, 'Mistake Book'));

  examAttempts.forEach((attempt) => {
    Object.entries(attempt.topicStats || {}).forEach(([topic, stat]) => bump(topic, stat.subject || attempt.subject, stat.correct, stat.total, 'Exam Mode'));
  });

  oldAttempts.forEach((attempt) => {
    const topic = attempt.testName || attempt.test_name || 'Test Series';
    const pct = Number(attempt.pct ?? attempt.percentage ?? 0);
    bump(topic, attempt.subject || 'Commerce', pct, 100, 'Test Series');
  });

  const topics = [...topicMap.values()].map((item) => ({
    topic: item.topic,
    subject: item.subject,
    accuracy: item.total ? Math.round((item.correct / item.total) * 100) : 0,
    attempts: item.total,
    sources: [...item.sources],
  })).sort((a, b) => a.accuracy - b.accuracy || b.attempts - a.attempts);

  const completedChapters = chapterProgress.filter((item) => item.completed).length;
  const viewedChapters = new Set(chapterProgress.map((item) => item.path)).size;
  const scores = [...examAttempts, ...oldAttempts].map((item) => Number(item.percentage ?? item.pct ?? 0)).filter(Number.isFinite);

  return {
    topics,
    weakest: topics.slice(0, 5),
    strongest: [...topics].sort((a, b) => b.accuracy - a.accuracy || b.attempts - a.attempts).slice(0, 5),
    attempts: examAttempts.length + oldAttempts.length,
    averageScore: scores.length ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0,
    pendingMistakes: mistakes.filter((item) => !item.mastered).length,
    completedChapters,
    viewedChapters,
  };
}
