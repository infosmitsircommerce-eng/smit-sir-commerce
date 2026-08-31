import { supabase } from './supabase';

export const CLOUD_KEYS = [
  'ssc-daily10-history-v1',
  'ssc-mistake-book-v1',
  'ssc-study-bookmarks-v1',
  'ssc-recent-learning-v1',
  'ssc-revision-plan-v1',
];

function safeParse(value, fallback) {
  try { return value ? JSON.parse(value) : fallback; } catch { return fallback; }
}

export function collectLocalLearningState(userId) {
  const state = {};
  for (const key of CLOUD_KEYS) state[key] = safeParse(localStorage.getItem(key), []);
  state[`ssc-test-attempts-v1:${userId || 'guest'}`] = safeParse(localStorage.getItem(`ssc-test-attempts-v1:${userId || 'guest'}`), []);
  return state;
}

export function applyCloudLearningState(userId, cloudState = {}) {
  for (const [key, value] of Object.entries(cloudState || {})) {
    if (!CLOUD_KEYS.includes(key) && key !== `ssc-test-attempts-v1:${userId}`) continue;
    try { localStorage.setItem(key, JSON.stringify(value ?? [])); } catch { /* ignore */ }
  }
}

export async function syncLearningState(userId) {
  if (!userId) return { ok: false, reason: 'no-user' };
  const local = collectLocalLearningState(userId);
  const existing = await supabase
    .from('student_learning_state')
    .select('state,updated_at')
    .eq('user_id', userId)
    .maybeSingle();

  if (existing.error) return { ok: false, reason: 'table-unavailable', error: existing.error };

  const cloud = existing.data?.state || {};
  const merged = { ...cloud };
  for (const [key, localValue] of Object.entries(local)) {
    const cloudValue = cloud[key];
    if (Array.isArray(localValue) && Array.isArray(cloudValue)) {
      const seen = new Set();
      merged[key] = [...localValue, ...cloudValue].filter((item) => {
        const fingerprint = item?.id || item?.date || item?.createdAt || item?.created_at || JSON.stringify(item);
        if (seen.has(fingerprint)) return false;
        seen.add(fingerprint);
        return true;
      }).slice(0, 250);
    } else if (localValue && (Array.isArray(localValue) ? localValue.length : Object.keys(localValue || {}).length)) {
      merged[key] = localValue;
    }
  }

  const upsert = await supabase.from('student_learning_state').upsert({
    user_id: userId,
    state: merged,
    updated_at: new Date().toISOString(),
  }, { onConflict: 'user_id' });

  if (upsert.error) return { ok: false, reason: 'write-failed', error: upsert.error };
  applyCloudLearningState(userId, merged);
  return { ok: true, state: merged };
}
