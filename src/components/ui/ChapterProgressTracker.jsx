import { useEffect, useMemo, useState } from 'react';
import { CheckCircle2, Circle, BookOpenCheck } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { materialByPath } from '../../data/seoMaterials';
import { trackEvent } from '../../lib/analytics';
import { useAuth } from '../../context/AuthContext';

const KEY = 'ssc-chapter-progress-v1';

function normalizeItems(value) {
  let candidates = [];

  if (Array.isArray(value)) {
    candidates = value;
  } else if (Array.isArray(value?.items)) {
    // Preserve progress from any older wrapper-object format.
    candidates = value.items;
  } else if (value && typeof value === 'object') {
    // Preserve legacy path-keyed objects instead of deleting student progress.
    candidates = Object.entries(value).map(([path, item]) => {
      if (item && typeof item === 'object') return { path, ...item };
      return null;
    });
  }

  const seen = new Set();
  return candidates
    .filter((item) => item && typeof item === 'object' && typeof item.path === 'string' && item.path.trim())
    .filter((item) => {
      if (seen.has(item.path)) return false;
      seen.add(item.path);
      return true;
    })
    .slice(0, 250);
}

function read() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    return normalizeItems(JSON.parse(raw));
  } catch {
    return [];
  }
}

function write(items) {
  const safeItems = normalizeItems(items);
  try { localStorage.setItem(KEY, JSON.stringify(safeItems)); } catch { /* ignore */ }
  try { window.dispatchEvent(new CustomEvent('ssc-study-state-changed')); } catch { /* ignore */ }
  return safeItems;
}

export default function ChapterProgressTracker() {
  const { pathname } = useLocation();
  const { user } = useAuth();
  const cleanPath = pathname.replace(/\/$/, '');
  const material = materialByPath[cleanPath];
  const [items, setItems] = useState(() => read());

  const current = useMemo(
    () => items.find((item) => item.path === cleanPath),
    [items, cleanPath],
  );

  useEffect(() => {
    if (!material) return;
    setItems((previous) => {
      const safePrevious = normalizeItems(previous);
      const existing = safePrevious.find((item) => item.path === cleanPath);
      const nextItem = {
        path: cleanPath,
        title: material.chapter,
        subject: material.subject,
        classLevel: material.class_level,
        viewedAt: existing?.viewedAt || new Date().toISOString(),
        completed: existing?.completed || false,
        completedAt: existing?.completedAt || null,
      };
      return write([nextItem, ...safePrevious.filter((item) => item.path !== cleanPath)]);
    });
    trackEvent('chapter_view', { chapter: material.chapter, subject: material.subject, classLevel: material.class_level }, user?.id || null);
  }, [cleanPath, material?.id, user?.id]);

  if (!material) return null;

  const toggle = () => {
    const complete = !current?.completed;
    const safeItems = normalizeItems(items);
    const next = write([{
      path: cleanPath,
      title: material.chapter,
      subject: material.subject,
      classLevel: material.class_level,
      viewedAt: current?.viewedAt || new Date().toISOString(),
      completed: complete,
      completedAt: complete ? new Date().toISOString() : null,
    }, ...safeItems.filter((item) => item.path !== cleanPath)]);
    setItems(next);
    trackEvent(complete ? 'chapter_complete' : 'chapter_reopen', { chapter: material.chapter, subject: material.subject }, user?.id || null);
  };

  return (
    <button
      type="button"
      onClick={toggle}
      className="fixed left-3 bottom-[6.8rem] lg:bottom-16 z-[35] rounded-full px-3.5 py-2.5 shadow-lg flex items-center gap-2 text-xs font-bold transition-transform active:scale-95"
      style={{ background: current?.completed ? 'rgba(237,247,231,.97)' : 'rgba(255,255,255,.96)', color: current?.completed ? 'var(--green)' : 'var(--ink)', border: `1px solid ${current?.completed ? 'rgba(77,124,15,.25)' : 'var(--border)'}` }}
      aria-pressed={current?.completed === true}
      title={current?.completed ? 'Mark chapter as not completed' : 'Mark this chapter complete'}
    >
      {current?.completed ? <CheckCircle2 className="w-4 h-4" /> : <Circle className="w-4 h-4" />}
      <BookOpenCheck className="w-4 h-4" />
      {current?.completed ? 'Chapter completed' : 'Mark chapter complete'}
    </button>
  );
}
