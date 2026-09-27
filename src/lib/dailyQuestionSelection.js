// A date-seeded shuffle avoids character-sum collisions and preserves subject coverage.
function randomFor(seedText) {
  let state = 2166136261;
  for (const char of seedText) state = Math.imul(state ^ char.charCodeAt(0), 16777619) >>> 0;
  return () => {
    state = (state + 0x6D2B79F5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
function shuffled(items, random) {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}
export function selectDailyQuestions(bank, dateString) {
  const random = randomFor(dateString);
  const quotas = [['Economics', 4], ['Business Studies', 3], ['Accountancy', 3]];
  const selected = quotas.flatMap(([subject, count]) => shuffled(bank.filter(q => q.subject === subject), random).slice(0, count));
  const ids = new Set(selected.map(q => q.id));
  const remaining = shuffled(bank.filter(q => !ids.has(q.id)), random);
  return shuffled([...selected, ...remaining.slice(0, Math.max(0, 10 - selected.length))], random);
}
