import { useEffect, useId, useRef, useState } from 'react';
import { Check, ChevronDown, Search } from 'lucide-react';

export default function QuizChapterPicker({ packs, selected, onChange }) {
  const id = useId(), trigger = useRef(null), searchInput = useRef(null);
  const [open, setOpen] = useState(false), [query, setQuery] = useState(''), [limit, setLimit] = useState(8);
  useEffect(() => { setOpen(false); setQuery(''); setLimit(8); }, [selected?.id]);
  useEffect(() => { if (open) searchInput.current?.focus(); }, [open]);
  const words = query.toLowerCase().trim().split(/\s+/).filter(Boolean);
  const matches = packs.filter(pack => words.every(word => `${pack.chapter} ${pack.title}`.toLowerCase().includes(word)));
  function choose(pack) { onChange(pack.id); setOpen(false); trigger.current?.focus(); }
  return <div className="ssc-quiz-picker">
    <div className="ssc-study-label-row"><span className="ssc-quiz-field-label">Chapter</span><span>{packs.length} available</span></div>
    <button ref={trigger} type="button" className="ssc-quiz-picker-trigger" aria-label={`Choose chapter: ${selected?.title || 'No chapters'}`} aria-expanded={open} aria-controls={`${id}-chapters`} disabled={!packs.length} onClick={() => setOpen(value => !value)}><span>{selected ? `${selected.chapter} · ${selected.title}` : 'No published chapters'}</span><ChevronDown size={18} aria-hidden="true" /></button>
    {open && <div id={`${id}-chapters`} className="ssc-quiz-picker-panel" onKeyDown={event => { if (event.key === 'Escape') { event.stopPropagation(); setOpen(false); trigger.current?.focus(); } }}>
      <label className="ssc-quiz-field-label" htmlFor={`${id}-search`}>Search chapter list</label>
      <div className="ssc-study-search"><Search size={18} aria-hidden="true" /><input ref={searchInput} id={`${id}-search`} type="search" className="ssc-study-control" value={query} placeholder="Search a chapter or topic" onChange={event => { setQuery(event.target.value); setLimit(8); }} /></div>
      <ul aria-label="Available chapters" className="ssc-quiz-chapter-list">{matches.slice(0, limit).map(pack => <li key={pack.id}><button type="button" aria-pressed={pack.id === selected?.id} onClick={() => choose(pack)}><span><small>{pack.chapter}</small><strong>{pack.title}</strong></span>{pack.id === selected?.id && <Check size={18} aria-hidden="true" />}</button></li>)}</ul>
      {!matches.length && <p role="status">No matching chapters. Try another topic.</p>}
      {matches.length > limit && <button type="button" className="ssc-quiz-more" onClick={() => setLimit(value => value + 8)}>Show {Math.min(8, matches.length - limit)} more chapters</button>}
    </div>}
  </div>;
}
