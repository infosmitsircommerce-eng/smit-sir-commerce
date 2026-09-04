import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, BookOpen, Brain, Calculator, Download, Eye, FileText, Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import SEO from '../components/ui/SEO';
import { materialTypes } from '../data/studyMaterial';
import { seoHubs, seoMaterials } from '../data/seoMaterials';
import { gsebMaterials } from '../data/gsebMaterials';

const allMaterials = [...seoMaterials, ...gsebMaterials];
const initialBoard = typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('board')?.toUpperCase() === 'GSEB' ? 'GSEB' : 'CBSE';
const PATH = '/study-material';
const TITLE = 'Free Commerce Study Material | CBSE & GSEB Class 11 12';
const DESCRIPTION = 'Free chapter-wise Commerce study material for CBSE and GSEB Class 11 and 12. Browse Economics, Business Studies, PDFs, practice resources and useful Commerce tools.';

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'CollectionPage',
  name: TITLE,
  description: DESCRIPTION,
  url: `https://www.smitsircommerce.in${PATH}`,
  isAccessibleForFree: true,
  inLanguage: 'en-IN',
  about: [
    'CBSE Class 11 Commerce study material',
    'CBSE Class 12 Commerce study material',
    'GSEB Commerce study material',
    'Economics notes',
    'Business Studies notes',
    'Commerce practice resources',
  ],
};

function MaterialCard({ material }) {
  const isFree = material.isFree ?? material.is_free;
  const classLevel = material.class ?? material.class_level;
  const board = (material.board || 'CBSE').toUpperCase();
  const fileUrl = material.file_url;
  const viewUrl = material.seo_path || fileUrl;
  const practiceUrl = material.practice_path;

  return (
    <motion.article whileHover={{ y: -3 }} className="card-paper group flex flex-col p-5">
      <div className="flex items-start gap-3 mb-3">
        <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: 'var(--gold-bg)', border: '1px solid rgba(184,135,47,0.18)' }}>
          <FileText className="w-5 h-5" style={{ color: 'var(--gold)' }} strokeWidth={1.8} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ background: board === 'CBSE' ? '#eef4ff' : '#fff4e6', border: board === 'CBSE' ? '1px solid #bfd3ff' : '1px solid #ffd29a', color: board === 'CBSE' ? '#2457a7' : '#9a4f00' }}>{board}</span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ background: 'var(--bg-ivory)', border: '1px solid var(--border)', color: 'var(--charcoal)' }}>{material.type}</span>
            {isFree && <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ background: 'rgba(77,124,15,0.08)', border: '1px solid rgba(77,124,15,0.25)', color: 'var(--green)' }}>Free</span>}
          </div>
          <h3 className="text-sm leading-snug" style={{ fontFamily: 'var(--font-sans)', fontWeight: 650, color: 'var(--ink)' }}>{material.title}</h3>
        </div>
      </div>
      <div className="flex items-center gap-2 text-xs mb-4 flex-wrap" style={{ color: 'var(--subtle)' }}><span>{material.subject}</span><span>•</span><span>Class {classLevel}</span>{material.pages && <><span>•</span><span>{material.pages} pages</span></>}</div>
      <div className="mt-auto grid grid-cols-1 gap-2">
        {viewUrl && <a href={viewUrl} className="tile-paper flex items-center justify-center gap-1.5 py-2.5 text-xs font-semibold" style={{ color: 'var(--charcoal)' }}><Eye className="w-3.5 h-3.5" /> View chapter notes</a>}
        {practiceUrl && <a href={practiceUrl} className="flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-xs font-semibold" style={{ background: '#fff8e8', border: '1px solid #ead4a4', color: '#8a5a0a' }}><Brain className="w-3.5 h-3.5" /> Practice chapter</a>}
        {fileUrl && <a href={fileUrl} download target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-xs font-semibold" style={{ background: 'var(--gold-bg)', border: '1px solid rgba(184,135,47,0.3)', color: 'var(--gold)' }}><Download className="w-3.5 h-3.5" /> Download PDF</a>}
      </div>
    </motion.article>
  );
}

export default function StudyMaterial() {
  const [search, setSearch] = useState('');
  const [filterBoard, setFilterBoard] = useState(initialBoard);
  const [filterClass, setFilterClass] = useState('All');
  const [filterType, setFilterType] = useState('All');
  const [filterSubject, setFilterSubject] = useState('All');

  const boardMaterials = useMemo(() => allMaterials.filter((m) => (m.board || 'CBSE').toUpperCase() === filterBoard), [filterBoard]);
  const subjects = useMemo(() => ['All', ...new Set(boardMaterials.map((m) => m.subject).filter(Boolean))], [boardMaterials]);
  const visibleTypes = useMemo(() => ['All', ...new Set([...materialTypes, ...boardMaterials.map((m) => m.type).filter(Boolean)])], [boardMaterials]);
  const filtered = boardMaterials.filter((m) => {
    const classLevel = m.class ?? m.class_level;
    const haystack = `${m.title} ${m.subject || ''} ${m.chapter || ''}`.toLowerCase();
    return haystack.includes(search.toLowerCase()) && (filterClass === 'All' || classLevel === Number(filterClass)) && (filterType === 'All' || m.type === filterType) && (filterSubject === 'All' || m.subject === filterSubject);
  });
  const selectBoard = (board) => { setFilterBoard(board); setFilterClass('All'); setFilterType('All'); setFilterSubject('All'); setSearch(''); window.history.replaceState({}, '', `/study-material?board=${board}`); };
  const pillStyle = (active) => active ? { background: 'var(--ink)', color: 'var(--ivory-on-ink)', border: '1px solid var(--ink)' } : { background: 'var(--bg-white)', color: 'var(--muted)', border: '1px solid var(--border)' };
  const inputStyle = { background: 'var(--bg-white)', border: '1px solid var(--border)', borderRadius: '12px', color: 'var(--ink)', padding: '12px 16px', fontFamily: 'var(--font-sans)', fontSize: '14px', width: '100%' };

  return <div className="min-h-screen" style={{ background: 'var(--bg-ivory)' }}>
    <SEO title={TITLE} description={DESCRIPTION} path={PATH} structuredData={structuredData} />
    <div className="page-hero"><div className="page-container text-center"><span className="eyebrow">CBSE + GSEB Study Resources</span><h1 className="mt-5">Study <em>material.</em></h1><p className="mx-auto">Choose your board, subject and chapter. CBSE and GSEB resources stay clearly separated.</p><div className="mt-6 inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium" style={{ background: 'rgba(77,124,15,0.08)', border: '1px solid rgba(77,124,15,0.25)', color: 'var(--green)' }}>✓ Published study resources are free to open</div></div></div>
    <div className="page-container section-padding">
      <section className="mb-12" aria-labelledby="study-path-heading">
        <div className="text-center max-w-3xl mx-auto mb-7"><span className="eyebrow">Study smarter</span><h2 id="study-path-heading" className="text-3xl mt-3" style={{ fontFamily: 'var(--font-serif)', color: 'var(--ink)' }}>Move from notes to practice, not random pages</h2><p className="mt-3" style={{ color: 'var(--muted)' }}>Use these connected learning hubs to keep the same subject and chapter context while you revise.</p></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link to="/cbse-notes" className="card-paper p-5 group"><BookOpen className="w-6 h-6 mb-4" style={{ color: 'var(--gold)' }} /><h3 className="text-lg font-semibold" style={{ color: 'var(--ink)' }}>CBSE Commerce notes</h3><p className="text-sm mt-2 leading-6" style={{ color: 'var(--muted)' }}>Browse Class 11 and 12 subject hubs and chapter-wise notes.</p><span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold" style={{ color: 'var(--gold)' }}>Open notes hub <ArrowRight className="w-4 h-4" /></span></Link>
          <Link to="/cbse-practice" className="card-paper p-5 group"><Brain className="w-6 h-6 mb-4" style={{ color: 'var(--gold)' }} /><h3 className="text-lg font-semibold" style={{ color: 'var(--ink)' }}>Chapter practice</h3><p className="text-sm mt-2 leading-6" style={{ color: 'var(--muted)' }}>Continue with MCQs, important questions, case studies and numericals.</p><span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold" style={{ color: 'var(--gold)' }}>Start practice <ArrowRight className="w-4 h-4" /></span></Link>
          <Link to="/tools" className="card-paper p-5 group"><Calculator className="w-6 h-6 mb-4" style={{ color: 'var(--gold)' }} /><h3 className="text-lg font-semibold" style={{ color: 'var(--ink)' }}>Commerce calculators</h3><p className="text-sm mt-2 leading-6" style={{ color: 'var(--muted)' }}>Use formula tools for numerical topics without leaving the learning flow.</p><span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold" style={{ color: 'var(--gold)' }}>Open free tools <ArrowRight className="w-4 h-4" /></span></Link>
          <a href="/gseb-class-12-economics.html" className="card-paper p-5 group"><FileText className="w-6 h-6 mb-4" style={{ color: 'var(--gold)' }} /><h3 className="text-lg font-semibold" style={{ color: 'var(--ink)' }}>GSEB Economics</h3><p className="text-sm mt-2 leading-6" style={{ color: 'var(--muted)' }}>Jump directly to the Class 12 GSEB Economics chapter collection.</p><span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold" style={{ color: 'var(--gold)' }}>Browse GSEB notes <ArrowRight className="w-4 h-4" /></span></a>
        </div>
      </section>
      <section className="mb-12"><div className="text-center max-w-3xl mx-auto mb-7"><span className="eyebrow">Start with your subject</span><h2 className="text-3xl mt-3" style={{ fontFamily: 'var(--font-serif)', color: 'var(--ink)' }}>Free chapter-wise commerce notes</h2><p className="mt-3" style={{ color: 'var(--muted)' }}>Open a complete subject collection or choose an individual chapter below.</p></div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">{seoHubs.map((hub) => { const count = seoMaterials.filter((m) => m.hubId === hub.id).length; return <Link key={hub.id} to={hub.path} className="card-paper p-6 group"><div className="text-xs font-semibold mb-2" style={{ color: 'var(--gold)' }}>CBSE • CLASS {hub.classLevel}</div><h3 className="text-xl mb-2" style={{ fontFamily: 'var(--font-serif)', color: 'var(--ink)' }}>{hub.label} Notes</h3><p className="text-sm mb-4" style={{ color: 'var(--muted)' }}>{count} free chapter PDF{count === 1 ? '' : 's'} available</p><span className="text-sm font-semibold" style={{ color: 'var(--gold)' }}>Browse collection →</span></Link>; })}
          <a href="/gseb-class-12-economics.html" className="card-paper p-6 group" style={{ borderColor: 'rgba(184,135,47,0.35)' }}><div className="text-xs font-semibold mb-2" style={{ color: 'var(--gold)' }}>GSEB • CLASS 12</div><h3 className="text-xl mb-2" style={{ fontFamily: 'var(--font-serif)', color: 'var(--ink)' }}>Class 12 Economics Notes</h3><p className="text-sm mb-4" style={{ color: 'var(--muted)' }}>10 chapters • Chapters 2–11</p><span className="text-sm font-semibold" style={{ color: 'var(--gold)' }}>Browse GSEB collection →</span></a>
        </div>
      </section>
      <div className="text-center mb-10"><div className="text-sm font-semibold mb-3" style={{ color: 'var(--ink)' }}>Choose your board</div><div className="toggle-paper inline-flex max-w-full" role="group" aria-label="Choose board"><button onClick={() => selectBoard('CBSE')} className={filterBoard === 'CBSE' ? 'active' : ''}>CBSE Board</button><button onClick={() => selectBoard('GSEB')} className={filterBoard === 'GSEB' ? 'active' : ''}>GSEB Board</button></div>{filterBoard === 'GSEB' && <p className="text-xs mt-3" style={{ color: 'var(--muted)' }}>Class 12 Economics Chapters 2–11 are published. Chapter 1 has not been uploaded.</p>}</div>
      <div className="material-type-pills flex flex-nowrap sm:flex-wrap gap-2 mb-8 overflow-x-auto scrollbar-hide pb-2">{visibleTypes.map((type) => <button key={type} onClick={() => setFilterType(type)} className="px-3 py-1.5 rounded-full text-xs font-medium transition-colors whitespace-nowrap" style={pillStyle(filterType === type)}>{type === 'All' ? 'All Types' : type}</button>)}</div>
      <div className="card-paper p-4 sm:p-5 mb-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[minmax(260px,1fr)_auto_auto] gap-3 sm:gap-4"><div className="relative sm:col-span-2 lg:col-span-1"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--subtle)' }} /><input style={{ ...inputStyle, paddingLeft: '40px' }} placeholder={`Search ${filterBoard} material...`} value={search} onChange={(e) => setSearch(e.target.value)} /></div><select value={filterClass} onChange={(e) => setFilterClass(e.target.value)} style={inputStyle}><option value="All">All Classes</option><option value="11">Class 11</option><option value="12">Class 12</option></select><select value={filterSubject} onChange={(e) => setFilterSubject(e.target.value)} style={inputStyle}>{subjects.map((s) => <option key={s} value={s}>{s}</option>)}</select></div>
      <div className="text-sm mb-5" style={{ color: 'var(--muted)' }}>Showing <span className="font-semibold" style={{ color: 'var(--gold)' }}>{filtered.length}</span> {filterBoard} materials</div><div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">{filtered.map((material) => <MaterialCard key={material.id} material={material} />)}</div>
      {filtered.length === 0 && <div className="text-center py-16"><FileText className="w-10 h-10 mx-auto mb-3" style={{ color: 'var(--subtle)' }} strokeWidth={1.5} /><div style={{ color: 'var(--muted)' }}>No {filterBoard} materials found for the selected filters.</div></div>}
    </div>
  </div>;
}
