// Use the existing Test Series history format so chapter quizzes appear in My Progress.
export function recordQuizAttempt({ pack, level, questions, answers, userId, displayName }) {
  const score = answers.filter((answer, index) => answer === questions[index].answer).length;
  const total = questions.length, percentage = Math.round(score / total * 100);
  const testName = `${pack.board} Class ${pack.classLevel} · ${pack.title} · ${level === 'Moderate' && pack.board === 'GSEB' ? 'Medium' : level}`;
  const attempt = { id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`, testName, subject: pack.subject, score, total, pct: percentage, createdAt: new Date().toISOString() };
  try {
    const key = `ssc-test-attempts-v1:${userId || 'guest'}`;
    const previous = JSON.parse(localStorage.getItem(key) || '[]');
    localStorage.setItem(key, JSON.stringify([attempt, ...(Array.isArray(previous) ? previous : [])].slice(0, 150)));
    window.dispatchEvent(new CustomEvent('ssc-study-state-changed'));
  } catch { /* A blocked store must not interrupt the result screen. */ }
  if (userId) import('./supabase').then(({ supabase }) => supabase.from('test_attempts').insert({ user_id: userId,
    student_label: (displayName || 'Student').trim().split(/\s+/).map(part => part[0]).join('').toUpperCase().slice(0, 2),
    test_name: testName, subject: pack.subject, score, total_questions: total, percentage, created_at: attempt.createdAt,
  })).catch(() => {});
  return attempt;
}
