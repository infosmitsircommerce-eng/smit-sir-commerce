import { lazy, Suspense, useEffect, useId, useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Bookmark, BookmarkCheck, BookOpen, ListChecks } from 'lucide-react';
import { studyAccessItems, filterStudyAccess } from '../../data/studyAccess';

const QuizLevels = lazy(() => import('../../pages/Quizzes').then(module => ({ default: module.LevelGrid })));
const PREFS = 'ssc-resource-finder-v1';
const RECENTS = 'ssc-resource-recents-v1';
const SAVED = 'ssc-resource-saved-v1';
function read(key, fallback) { try { return JSON.parse(localStorage.getItem(key)) || fallback; } catch { return fallback; } }
function write(key, value) { try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* Finder works without storage. */ } }

export default function StudyAccessFinder({ defaultKind = 'Notes', inlineTests = false, onNavigate }) {
  const { search: routeSearch } = useLocation();
  const id = useId();
  const [filters, setFilters] = useState(() => {
    const saved = read(PREFS, {}), params = new URLSearchParams(routeSearch);
    return { kind: defaultKind, board: params.get('board')?.toUpperCase() === 'GSEB' ? 'GSEB' : params.get('board') ? 'CBSE' : saved.board || 'CBSE',
      classLevel: ['11', '12'].includes(params.get('class')) ? params.get('class') : saved.classLevel || '12', subject: params.get('subject') || saved.subject || '', search: '' };
  });
  const [chosenId, setChosenId] = useState(() => new URLSearchParams(routeSearch).get('pack') ? `test:${new URLSearchParams(routeSearch).get('pack')}` : read(PREFS, {}).chosenId || '');
  const [recents, setRecents] = useState(() => read(RECENTS, []));
  const [saved, setSaved] = useState(() => read(SAVED, []));
  const subjects = useMemo(() => [...new Set(studyAccessItems.filter(item => item.kind === filters.kind && item.board === filters.board && item.classLevel === Number(filters.classLevel)).map(item => item.subject))], [filters.kind, filters.board, filters.classLevel]);
  const subject = subjects.includes(filters.subject) ? filters.subject : subjects[0] || '';
  const items = useMemo(() => filterStudyAccess(studyAccessItems, { ...filters, subject }), [filters, subject]);
  const chosen = items.find(item => item.id === chosenId) || items[0];

  useEffect(() => { write(PREFS, { board: filters.board, classLevel: filters.classLevel, subject, chosenId: chosen?.id || '' }); }, [filters.board, filters.classLevel, subject, chosen?.id]);
  useEffect(() => {
    const params = new URLSearchParams(routeSearch);
    if (params.has('pack')) setChosenId(`test:${params.get('pack')}`);
    if (params.has('subject')) setFilters(current => ({ ...current, subject: params.get('subject'), search: '' }));
    if (params.has('board') || params.has('class')) setFilters(current => ({ ...current, board: params.get('board')?.toUpperCase() === 'GSEB' ? 'GSEB' : params.has('board') ? 'CBSE' : current.board, classLevel: ['11', '12'].includes(params.get('class')) ? params.get('class') : current.classLevel }));
  }, [routeSearch]);
  function update(field, value) { setFilters(current => ({ ...current, [field]: value, ...(field !== 'search' ? { search: '' } : {}) })); setChosenId(''); }
  function remember(item) {
    const entry = { id: item.id, title: item.title, path: item.path, board: item.board, classLevel: item.classLevel, subject: item.subject, kind: item.kind };
    const next = [entry, ...read(RECENTS, []).filter(old => old.id !== item.id)].slice(0, 5);
    write(RECENTS, next); setRecents(next); onNavigate?.();
  }
  function save() {
    if (!chosen) return;
    const next = saved.some(item => item.id === chosen.id) ? saved.filter(item => item.id !== chosen.id)
      : [{ id: chosen.id, title: chosen.title, path: chosen.path, board: chosen.board, classLevel: chosen.classLevel, subject: chosen.subject, kind: chosen.kind }, ...saved].slice(0, 20);
    setSaved(next); write(SAVED, next);
  }
  const isSaved = chosen && saved.some(item => item.id === chosen.id);
  return <section className="card-paper p-4 sm:p-6" aria-label="Find notes and tests" style={{ minWidth: 0 }}>
    <h2 className="text-xl sm:text-2xl" style={{ fontFamily: 'var(--font-serif)' }}>Find notes or a chapter test</h2>
    <p className="text-sm mt-2" style={{ color: 'var(--muted)' }}>Choose once. Open directly. Your recent chapters stay here for next time.</p>
    <div className="flex gap-2 mt-4" role="group" aria-label="Resource type">{['Notes', 'Tests'].map(kind => <button type="button" key={kind} className={filters.kind === kind ? 'btn-primary' : 'btn-secondary'} aria-pressed={filters.kind === kind} onClick={() => update('kind', kind)}>{kind === 'Notes' ? <BookOpen className="w-4 h-4" /> : <ListChecks className="w-4 h-4" />} {kind}</button>)}</div>
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-4">
      <label className="text-sm font-semibold" htmlFor={`${id}-board`}>Board<select id={`${id}-board`} className="input-field w-full mt-1 min-h-11" value={filters.board} onChange={event => update('board', event.target.value)}><option>CBSE</option><option>GSEB</option></select></label>
      <label className="text-sm font-semibold" htmlFor={`${id}-class`}>Class<select id={`${id}-class`} className="input-field w-full mt-1 min-h-11" value={filters.classLevel} onChange={event => update('classLevel', event.target.value)}><option value="11">Class 11</option><option value="12">Class 12</option></select></label>
      <label className="text-sm font-semibold col-span-2 sm:col-span-1 min-w-0" htmlFor={`${id}-subject`}>Subject<select id={`${id}-subject`} className="input-field w-full mt-1 min-h-11" value={subject} disabled={!subjects.length} onChange={event => update('subject', event.target.value)}>{subjects.length ? subjects.map(name => <option key={name}>{name}</option>) : <option value="">No published content yet</option>}</select></label>
    </div>
    <label className="block text-sm font-semibold mt-3" htmlFor={`${id}-search`}>Search chapters<input id={`${id}-search`} className="input-field w-full mt-1 min-h-11" value={filters.search} onChange={event => update('search', event.target.value)} placeholder="Type a topic, e.g. inflation" type="search" /></label>
    <label className="block text-sm font-semibold mt-3" htmlFor={`${id}-chapter`}>Chapter<select id={`${id}-chapter`} className="input-field w-full mt-1 min-h-11" value={chosen?.id || ''} disabled={!items.length} onChange={event => setChosenId(event.target.value)}>{items.length ? items.map(item => <option key={item.id} value={item.id}>{item.title}</option>) : <option value="">No matching chapters</option>}</select></label>
    {!chosen && <p role="status" className="text-sm mt-3">{subjects.length ? 'No matching chapter. Try a shorter search or clear the search box.' : 'No published content for this selection. Choose another class, board or resource type.'}</p>}
    {chosen && <div className="mt-4">
      <p className="text-sm font-semibold break-words" style={{ color: 'var(--ink)' }}>{chosen.title}</p>
      {chosen.kind === 'Tests' && inlineTests ? <Suspense fallback={<p role="status" className="mt-3">Loading test levels…</p>}><QuizLevels key={chosen.id} pack={chosen.pack} onAttempt={() => remember(chosen)} /></Suspense>
        : <div className="flex flex-wrap gap-2 mt-3"><Link className="btn-primary" to={chosen.path} onClick={() => remember(chosen)}>{chosen.kind === 'Notes' ? 'Open notes' : 'Choose test level'}</Link>{chosen.pdf && <a className="btn-secondary" href={chosen.pdf} target="_blank" rel="noopener noreferrer" onClick={() => remember(chosen)}>Open PDF</a>}</div>}
      <button type="button" className="btn-secondary mt-3 min-h-11" onClick={save} aria-pressed={Boolean(isSaved)}>{isSaved ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />} {isSaved ? 'Saved for revision' : 'Save for revision'}</button>
    </div>}
    {(saved.length > 0 || recents.length > 0) && <details className="mt-5"><summary className="cursor-pointer font-semibold text-sm min-h-11 flex items-center">Recent & saved chapters</summary>{[['Saved', saved], ['Recent', recents]].map(([label, entries]) => entries.length > 0 && <div key={label} className="mt-3"><h3 className="text-sm font-bold">{label}</h3><ul className="mt-2 space-y-2">{entries.slice(0, 5).map(item => <li key={item.id}><Link className="block rounded-xl border p-3 text-sm min-h-11" to={item.path} onClick={() => remember(item)}><span className="block font-semibold">{item.title}</span><span className="text-xs" style={{ color: 'var(--muted)' }}>{item.board} · Class {item.classLevel} · {item.kind}</span></Link></li>)}</ul></div>)}</details>}
  </section>;
}
