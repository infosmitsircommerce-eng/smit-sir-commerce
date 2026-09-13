import { lazy, Suspense, useEffect, useId, useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ArrowUpRight, Bookmark, BookmarkCheck, BookOpen, ListChecks, Search } from 'lucide-react';
import { studyAccessItems, filterStudyAccess } from '../../data/studyAccess';
import '../../styles/studyAccess.css';
import { trackEvent } from '../../lib/analytics';

const QuizLevels = lazy(() => Promise.all([import('../../pages/Quizzes'), import('../../data/quizPublic')]).then(([module, catalog]) => ({
  default: function FinderQuizLevels({ pack, ...props }) {
    return <module.LevelGrid {...props} pack={catalog.verifiedQuizPacks.find(item => item.id === pack.id) || pack} />;
  },
})));
const PREFS = 'ssc-resource-finder-v1';
const RECENTS = 'ssc-resource-recents-v1';
const SAVED = 'ssc-resource-saved-v1';
function read(key, fallback) { try { return JSON.parse(localStorage.getItem(key)) || fallback; } catch { return fallback; } }
function write(key, value) { try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* Finder works without storage. */ } }

export default function StudyAccessFinder({ defaultKind = 'Notes', inlineTests = false, pdfOnly = false, onNavigate }) {
  const { search: routeSearch } = useLocation();
  const id = useId();
  const [filters, setFilters] = useState(() => {
    const saved = read(PREFS, {}), params = new URLSearchParams(routeSearch);
    return { kind: defaultKind, board: params.get('board')?.toUpperCase() === 'GSEB' ? 'GSEB' : params.get('board') ? 'CBSE' : saved.board || 'CBSE',
      classLevel: ['11', '12'].includes(params.get('class')) ? params.get('class') : saved.classLevel || '12', subject: params.get('subject') || saved.subject || '', search: params.get('search') || '' };
  });
  const [chosenId, setChosenId] = useState(() => new URLSearchParams(routeSearch).get('pack') ? `test:${new URLSearchParams(routeSearch).get('pack')}` : read(PREFS, {}).chosenId || '');
  const [recents, setRecents] = useState(() => read(RECENTS, []));
  const [saved, setSaved] = useState(() => read(SAVED, []));
  const availableItems = useMemo(() => pdfOnly ? studyAccessItems.filter(item => item.kind === 'Notes' && item.pdf) : studyAccessItems, [pdfOnly]);
  const subjects = useMemo(() => [...new Set(availableItems.filter(item => item.kind === filters.kind && item.board === filters.board && item.classLevel === Number(filters.classLevel)).map(item => item.subject))], [availableItems, filters.kind, filters.board, filters.classLevel]);
  const subject = subjects.includes(filters.subject) ? filters.subject : subjects[0] || '';
  const items = useMemo(() => filterStudyAccess(availableItems, { ...filters, subject }), [availableItems, filters, subject]);
  const chosen = items.find(item => item.id === chosenId) || items[0];

  useEffect(() => { write(PREFS, { board: filters.board, classLevel: filters.classLevel, subject, chosenId: chosen?.id || '' }); }, [filters.board, filters.classLevel, subject, chosen?.id]);
  useEffect(() => {
    const params = new URLSearchParams(routeSearch);
    if (params.has('pack')) setChosenId(`test:${params.get('pack')}`);
    if (pdfOnly || ['board', 'class', 'subject', 'search'].some(key => params.has(key))) setFilters(current => ({
      ...current,
      kind: pdfOnly ? 'Notes' : current.kind,
      board: params.has('board') ? params.get('board')?.toUpperCase() === 'GSEB' ? 'GSEB' : 'CBSE' : current.board,
      classLevel: ['11', '12'].includes(params.get('class')) ? params.get('class') : current.classLevel,
      subject: params.has('subject') ? params.get('subject') : current.subject,
      search: params.has('search') ? params.get('search') || '' : params.has('subject') ? '' : current.search,
    }));
  }, [routeSearch, pdfOnly]);
  function update(field, value) { setFilters(current => ({ ...current, [field]: value, ...(field !== 'search' ? { search: '' } : {}) })); setChosenId(''); }
  function remember(item, action = 'open') {
    const entry = { id: item.id, title: item.title, path: item.path, board: item.board, classLevel: item.classLevel, subject: item.subject, kind: item.kind, viewedAt: new Date().toISOString() };
    const next = [entry, ...read(RECENTS, []).filter(old => old.id !== item.id)].slice(0, 5);
    write(RECENTS, next); setRecents(next); window.dispatchEvent(new CustomEvent('ssc-study-state-changed')); onNavigate?.();
    void trackEvent('resource_open', { resourceId: item.id, resourceType: item.kind, action, board: item.board, classLevel: item.classLevel, subject: item.subject, hasPdf: Boolean(item.pdf) });
  }
  function save() {
    if (!chosen) return;
    const next = saved.some(item => item.id === chosen.id) ? saved.filter(item => item.id !== chosen.id)
      : [{ id: chosen.id, title: chosen.title, path: chosen.path, board: chosen.board, classLevel: chosen.classLevel, subject: chosen.subject, kind: chosen.kind }, ...saved].slice(0, 20);
    setSaved(next); write(SAVED, next);
    window.dispatchEvent(new CustomEvent('ssc-study-state-changed'));
    void trackEvent(saved.some(item => item.id === chosen.id) ? 'resource_unsave' : 'resource_save', { resourceId: chosen.id, resourceType: chosen.kind, board: chosen.board, classLevel: chosen.classLevel, subject: chosen.subject });
  }
  const isSaved = chosen && saved.some(item => item.id === chosen.id);
  return <section className="ssc-study-access" aria-label={pdfOnly ? 'Find downloadable PDFs' : 'Find notes and tests'}>
    <header className="ssc-study-heading">
      <span className="ssc-study-kicker"><span /> YOUR STUDY DESK</span>
      <h2>{pdfOnly ? 'Choose your PDF' : 'Find notes or a chapter test'}</h2>
      <p>{pdfOnly ? 'Only published PDFs appear here. Pick a chapter and download.' : 'Pick a chapter. Start learning. Come back anytime.'}</p>
    </header>
    {!pdfOnly && <div className="ssc-study-tabs" role="group" aria-label="Resource type">{['Notes', 'Tests'].map(kind => <button type="button" key={kind} aria-pressed={filters.kind === kind} onClick={() => update('kind', kind)}>{kind === 'Notes' ? <BookOpen size={18} /> : <ListChecks size={18} />} {kind}</button>)}</div>}
    <div className="ssc-study-filters">
      <label htmlFor={`${id}-board`}>Board<select id={`${id}-board`} className="ssc-study-control" value={filters.board} onChange={event => update('board', event.target.value)}><option>CBSE</option><option>GSEB</option></select></label>
      <label htmlFor={`${id}-class`}>Class<select id={`${id}-class`} className="ssc-study-control" value={filters.classLevel} onChange={event => update('classLevel', event.target.value)}><option value="11">Class 11</option><option value="12">Class 12</option></select></label>
      <label className="ssc-study-subject" htmlFor={`${id}-subject`}>Subject<select id={`${id}-subject`} className="ssc-study-control" value={subject} disabled={!subjects.length} onChange={event => update('subject', event.target.value)}>{subjects.length ? subjects.map(name => <option key={name}>{name}</option>) : <option value="">No published content yet</option>}</select></label>
    </div>
    <label className="ssc-study-field" htmlFor={`${id}-search`}>Search chapters<div className="ssc-study-search"><Search size={18} aria-hidden="true" /><input id={`${id}-search`} className="ssc-study-control" value={filters.search} onChange={event => update('search', event.target.value)} placeholder="Find a topic, e.g. inflation" type="search" /></div></label>
    <label className="ssc-study-field" htmlFor={`${id}-chapter`}><span className="ssc-study-label-row">Chapter <span>{items.length} available</span></span><select id={`${id}-chapter`} aria-label="Chapter" className="ssc-study-control" value={chosen?.id || ''} disabled={!items.length} onChange={event => setChosenId(event.target.value)}>{items.length ? items.map(item => <option key={item.id} value={item.id}>{item.title}</option>) : <option value="">No matching chapters</option>}</select></label>
    {!chosen && <p role="status" className="ssc-study-empty">{subjects.length ? 'No matching chapter. Try a shorter search or clear the search box.' : 'No published content for this selection. Choose another class, board or resource type.'}</p>}
    {chosen && <div className="ssc-study-selected">
      <div className="ssc-study-selection"><span>{pdfOnly ? 'PDF READY' : chosen.kind === 'Tests' ? 'CHOOSE YOUR LEVEL' : 'READY TO READ'}</span><button type="button" className="ssc-study-save" onClick={save} aria-pressed={Boolean(isSaved)} aria-label={isSaved ? 'Saved for revision' : 'Save for revision'}>{isSaved ? <BookmarkCheck size={17} /> : <Bookmark size={17} />} {isSaved ? 'Saved' : 'Save'}</button></div>
      <p className="ssc-study-chosen">{chosen.title}</p>
      {pdfOnly ? <div className="ssc-study-actions"><a className="ssc-study-open" href={chosen.pdf} download target="_blank" rel="noopener noreferrer" onClick={() => remember(chosen, 'pdf_download')}>Download PDF<ArrowUpRight size={18} /></a><Link className="ssc-study-pdf" to={chosen.path} onClick={() => remember(chosen, 'chapter_read')}>Read chapter notes<ArrowUpRight size={16} /></Link></div>
        : chosen.kind === 'Tests' && inlineTests ? <Suspense fallback={<p role="status" className="ssc-study-empty">Loading test levels…</p>}><QuizLevels key={chosen.id} pack={chosen.pack} appearance="study" onAttempt={() => remember(chosen, 'test_start')} /></Suspense>
        : <div className="ssc-study-actions"><Link className="ssc-study-open" to={chosen.path} onClick={() => remember(chosen, chosen.kind === 'Notes' ? 'chapter_open' : 'test_choose')}>{chosen.kind === 'Notes' ? 'Open notes' : 'Choose test level'}<ArrowUpRight size={18} /></Link>{chosen.pdf && <a className="ssc-study-pdf" href={chosen.pdf} target="_blank" rel="noopener noreferrer" onClick={() => remember(chosen, 'pdf_open')}>Open PDF<ArrowUpRight size={16} /></a>}</div>}
    </div>}
    {!pdfOnly && (saved.length > 0 || recents.length > 0) && <details className="ssc-study-history"><summary>Recent & saved chapters</summary>{[['Saved', saved], ['Recent', recents]].map(([label, entries]) => entries.length > 0 && <div key={label}><h3>{label}</h3><ul>{entries.slice(0, 5).map(item => <li key={item.id}><Link to={item.path} onClick={() => remember(item)}><span>{item.title}</span><small>{item.board} · Class {item.classLevel} · {item.kind}</small></Link></li>)}</ul></div>)}</details>}
  </section>;
}
