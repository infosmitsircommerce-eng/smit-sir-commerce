const PREFERENCES_KEY = 'ssc-student-preferences-v2';
const FINDER_KEY = 'ssc-resource-finder-v1';

export const SUBJECTS_BY_COURSE = {
  'CBSE-11': ['Economics'],
  'CBSE-12': ['Economics', 'Business Studies'],
  'GSEB-11': ['Business Administration'],
  'GSEB-12': ['Economics', 'Business Administration'],
};

function safeRead(key) {
  if (typeof window === 'undefined') return null;
  try {
    const value = JSON.parse(window.localStorage.getItem(key) || 'null');
    return value && typeof value === 'object' ? value : null;
  } catch {
    return null;
  }
}

export function availableSubjects(board = 'CBSE', classLevel = '12') {
  return SUBJECTS_BY_COURSE[`${board}-${classLevel}`] || ['Economics'];
}

export function normalizeStudentPreferences(value) {
  if (!value) return null;
  const board = value.board === 'GSEB' ? 'GSEB' : 'CBSE';
  const classLevel = String(value.classLevel ?? value.class_level) === '11' ? '11' : '12';
  const subjects = availableSubjects(board, classLevel);
  const requestedSubject = value.subject || value.subjects?.[0];
  return {
    board,
    classLevel,
    subject: subjects.includes(requestedSubject) ? requestedSubject : subjects[0],
    goal: value.goal || value.study_goal || 'Board exam preparation',
    setupCompleted: value.setupCompleted !== false,
    updatedAt: value.updatedAt || null,
  };
}

export function readStudentPreferences(profile = null) {
  const account = normalizeStudentPreferences(profile);
  if (account) return { ...account, source: 'account' };
  const saved = normalizeStudentPreferences(safeRead(PREFERENCES_KEY));
  if (saved) return { ...saved, source: 'device' };
  const finder = normalizeStudentPreferences(safeRead(FINDER_KEY));
  return finder ? { ...finder, source: 'finder' } : null;
}

export function saveStudentPreferences(value) {
  const preferences = {
    ...normalizeStudentPreferences(value),
    setupCompleted: true,
    updatedAt: new Date().toISOString(),
  };
  if (typeof window === 'undefined') return preferences;
  try {
    window.localStorage.setItem(PREFERENCES_KEY, JSON.stringify(preferences));
    const currentFinder = safeRead(FINDER_KEY) || {};
    window.localStorage.setItem(FINDER_KEY, JSON.stringify({
      ...currentFinder,
      board: preferences.board,
      classLevel: preferences.classLevel,
      subject: preferences.subject,
    }));
  } catch {
    // Personalisation is an enhancement; navigation remains usable without storage.
  }
  window.dispatchEvent(new CustomEvent('ssc-student-preferences-changed', { detail: preferences }));
  window.dispatchEvent(new CustomEvent('ssc-study-state-changed'));
  return preferences;
}

export function studyPath(path, preferences) {
  if (!preferences || !['/study-material', '/quizzes', '/test-series'].includes(path)) return path;
  const params = new URLSearchParams({
    board: preferences.board,
    class: preferences.classLevel,
    subject: preferences.subject,
  });
  return `${path}?${params}`;
}
