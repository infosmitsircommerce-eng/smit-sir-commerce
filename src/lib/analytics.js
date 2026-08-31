import { supabase } from './supabase';

const LOCAL_KEY = 'ssc-analytics-events-v1';

function safeRead() {
  try { return JSON.parse(localStorage.getItem(LOCAL_KEY) || '[]'); } catch { return []; }
}

function safeWrite(events) {
  try { localStorage.setItem(LOCAL_KEY, JSON.stringify(events.slice(-500))); } catch { /* ignore */ }
}

function cleanMetadata(metadata = {}) {
  const allowed = {};
  for (const [key, value] of Object.entries(metadata || {})) {
    if (value == null) continue;
    if (['email','name','phone','answerText','queryText'].includes(key)) continue;
    if (typeof value === 'string') allowed[key] = value.slice(0, 160);
    else if (typeof value === 'number' || typeof value === 'boolean') allowed[key] = value;
  }
  return allowed;
}

export async function trackEvent(eventName, metadata = {}, userId = null) {
  const event = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    event_name: String(eventName).slice(0, 80),
    path: window.location.pathname,
    metadata: cleanMetadata(metadata),
    created_at: new Date().toISOString(),
  };
  const local = [...safeRead(), event];
  safeWrite(local);

  try {
    const { error } = await supabase.from('learning_events').insert({
      user_id: userId || null,
      event_name: event.event_name,
      path: event.path,
      metadata: event.metadata,
      created_at: event.created_at,
    });
    return { ok: !error, local: true, cloud: !error };
  } catch {
    return { ok: true, local: true, cloud: false };
  }
}

export function getLocalAnalyticsEvents() {
  return safeRead();
}
