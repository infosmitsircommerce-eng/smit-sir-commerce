import { useEffect, useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Bookmark, BookmarkCheck, Clock3, Search, X } from 'lucide-react';
import { seoHubs, seoMaterials } from '../../data/seoMaterials';

const BOOKMARKS_KEY = 'ssc-bookmarks-v1';
const RECENT_KEY = 'ssc-recent-learning-v1';

const coreItems = [
  { title: 'Free CBSE Notes', subtitle: 'Class 11 & 12 Commerce', path: '/cbse-notes', type: 'Notes' },
  { title: 'Study Material', subtitle: 'Chapter-wise PDFs', path: '/study-material', type: 'Resource' },
  { title: 'Daily 10', subtitle: 'Daily Commerce practice', path: '/daily-practice', type: 'Practice' },
  { title: 'Test Series', subtitle: 'Chapter and full syllabus tests', path: '/test-series', type: 'Tests' },
  { title: 'Study Coach', subtitle: 'Mastery and next study mission', path: '/study-coach', type: 'Coach' },
  { title: 'Flashcards', subtitle: 'Quick concept revision', path: '/flashcards', type: 'Revision' },
  { title: 'Quizzes', subtitle: 'Fast concept practice', path: '/quizzes', type: 'Practice' },
  { title: 'Ask a Doubt', subtitle: 'Commerce doubt support', path: '/ask', type: 'Help' },
  { title: 'Study Toolkit', subtitle: 'Bookmarks, recent learning and revision planner', path: '/study-tools', type: 'Tools' },
];

function read(key) {
  try { return JSON.parse(localStorage.getItem(key) || '[]'); } catch { return []; }
}
function write(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* storage may be blocked */ }
}

export function getBookmarks() { return read(BOOKMARKS_KEY); }
export function getRecentLearning() { return read(RECENT_KEY); }
export function toggleBookmark(item) {
  const current = read(BOOKMARKS_KEY);
  const exists = current.some((entry) => entry.path === item.path);
  const next = exists ? current.filter((entry) => entry.path !== item.path) : [{ ...item, savedAt: new Date().toISOString() }, ...current].slice(0, 100);
  write(BOOKMARKS_KEY, next);
  window.dispatchEvent(new CustomEvent('ssc-study-state-changed'));
  return next;
}

function trackRecent(item) {
  if (!item?.path) return;
  const current = read(RECENT_KEY).filter((entry) => entry.path !== item.path);
  write(RECENT_KEY, [{ ...item, viewedAt: new Date().toISOString() }, ...current].slice(0, 20));
  window.dispatchEvent(new CustomEvent('ssc-study-state-changed'));
}

export default function GlobalStudySearch() {
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [bookmarks, setBookmarks] = useState(() => getBookmarks());

  const index = useMemo(() => [
    ...coreItems,
    ...seoHubs.map((hub) => ({ title: hub.label, subtitle: hub.description, path: hub.path, type: 'Subject' })),
    ...seoMaterials.map((m) => ({ title: m.chapter, subtitle: `Class ${m.class_level} · ${m.subjectLabel}`, path: m.seo_path, type: 'Chapter' })),
  ], []);

  useEffect(() => {
    const onKey = (event) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault(); setOpen(true);
      }
      if (event.key === 'Escape') setOpen(false);
    };
    const onOpen = () => setOpen(true);
    const onState = () => setBookmarks(getBookmarks());
    window.addEventListener('keydown', onKey);
    window.addEventListener('ssc-open-search', onOpen);
    window.addEventListener('ssc-study-state-changed', onState);
    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('ssc-open-search', onOpen);
      window.removeEventListener('ssc-study-state-changed', onState);
    };
  }, []);

  useEffect(() => {
    const item = index.find((entry) => entry.path === location.pathname);
    if (item && location.pathname !== '/') trackRecent(item);
    setOpen(false);
    setQuery('');
  }, [location.pathname, index]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return index.slice(0, 10);
    return index.filter((item) => `${item.title} ${item.subtitle} ${item.type}`.toLowerCase().includes(q)).slice(0, 16);
  }, [query, index]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[180] p-3 sm:p-6 overflow-y-auto" style={{ background: 'rgba(30,24,18,.72)', backdropFilter: 'blur(10px)' }}>
      <div className="max-w-3xl mx-auto mt-10 sm:mt-20 card-paper overflow-hidden">
        <div className="flex items-center gap-3 p-4 border-b" style={{ borderColor: 'var(--border)' }}>
          <Search className="w-5 h-5" style={{ color: 'var(--gold)' }} />
          <input autoFocus value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search chapters, notes, tests, practice…" className="flex-1 bg-transparent outline-none text-base" style={{ color: 'var(--ink)' }} />
          <button onClick={() => setOpen(false)} aria-label="Close search" className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: 'var(--bg-ivory)' }}><X className="w-4 h-4" /></button>
        </div>
        <div className="p-3 sm:p-4 max-h-[65vh] overflow-y-auto">
          {results.length === 0 ? <div className="p-8 text-center text-sm" style={{ color: 'var(--muted)' }}>No matching study resource found.</div> : results.map((item) => {
            const saved = bookmarks.some((entry) => entry.path === item.path);
            return <div key={`${item.type}-${item.path}`} className="flex items-center gap-2 rounded-xl hover:bg-black/[.025] transition-colors">
              <Link to={item.path} className="flex-1 min-w-0 p-3">
                <div className="flex items-center gap-2"><span className="text-[10px] uppercase tracking-wider font-bold" style={{ color: 'var(--gold)' }}>{item.type}</span></div>
                <div className="font-semibold mt-1 truncate" style={{ color: 'var(--ink)' }}>{item.title}</div>
                <div className="text-xs mt-1 truncate" style={{ color: 'var(--muted)' }}>{item.subtitle}</div>
              </Link>
              <button onClick={() => setBookmarks(toggleBookmark(item))} className="w-10 h-10 rounded-xl flex items-center justify-center mr-2" title={saved ? 'Remove bookmark' : 'Bookmark'} style={{ background: saved ? 'var(--gold-bg)' : 'var(--bg-ivory)', color: saved ? 'var(--gold)' : 'var(--muted)' }}>
                {saved ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
              </button>
            </div>;
          })}
        </div>
        <div className="px-4 py-3 flex items-center justify-between text-xs border-t" style={{ borderColor: 'var(--border)', color: 'var(--muted)' }}>
          <span className="inline-flex items-center gap-1"><Clock3 className="w-3.5 h-3.5" /> Ctrl/⌘ + K anywhere</span>
          <Link to="/study-tools" style={{ color: 'var(--gold)' }}>Open Study Toolkit</Link>
        </div>
      </div>
    </div>
  );
}
