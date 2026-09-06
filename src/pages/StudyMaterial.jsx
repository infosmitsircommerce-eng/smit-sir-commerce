import { useMemo, useState } from 'react';
import { Download, Eye, FileText, Search, SlidersHorizontal } from 'lucide-react';
import { Link } from 'react-router-dom';
import SEO from '../components/ui/SEO';
import { seoHubs, seoMaterials } from '../data/seoMaterials';
import { gsebMaterials } from '../data/gsebMaterials';

const allMaterials = [...seoMaterials, ...gsebMaterials];
const initialBoard = typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('board')?.toUpperCase() === 'GSEB' ? 'GSEB' : 'CBSE';
const PATH = '/study-material';
const TITLE = 'Free Commerce Notes PDF — CBSE & GSEB | Smit Sir Commerce';
const DESCRIPTION = 'Find and download free CBSE and GSEB Commerce notes quickly by board, class, subject and chapter.';

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'CollectionPage',
  name: TITLE,
  description: DESCRIPTION,
  url: `https://www.smitsircommerce.in${PATH}`,
  isAccessibleForFree: true,
};

function MaterialCard({ material }) {
  const board = (material.board || 'CBSE').toUpperCase();
  const classLevel = material.class ?? material.class_level;
  const fileUrl = material.file_url;
  const viewUrl = material.seo_path || fileUrl;
  const directPdfReady = board === 'CBSE' && Boolean(fileUrl);

  return (
    <article className="rounded-2xl bg-white border p-4 sm:p-5 flex flex-col gap-4" style={{ borderColor: 'var(--border)' }}>
      <div>
        <div className="flex items-center gap-2 flex-wrap mb-2">
          <span className="text-[11px] font-black px-2 py-1 rounded-full" style={{ background: board === 'CBSE' ? '#eef4ff' : '#fff4e6', color: board === 'CBSE' ? '#2457a7' : '#9a4f00' }}>{board}</span>
          <span className="text-[11px] font-bold" style={{ color: 'var(--muted)' }}>Class {classLevel}</span>
          {material.pages && <span className="text-[11px]" style={{ color: 'var(--subtle)' }}>{material.pages} pages</span>}
        </div>
        <h3 className="text-base sm:text-lg font-semibold leading-snug" style={{ color: 'var(--ink)' }}>{material.title}</h3>
        <p className="text-xs mt-1" style={{ color: 'var(--muted)' }}>{material.subject}</p>
      </div>

      <div className="mt-auto grid gap-2">
        {directPdfReady && (
          <a href={fileUrl} download target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-extrabold" style={{ background: 'var(--ink)', color: 'var(--ivory-on-ink)' }}>
            <Download className="w-4 h-4" /> Download PDF
          </a>
        )}
        {viewUrl && (
          <a href={viewUrl} className="flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold" style={{ border: '1px solid var(--border)', color: 'var(--charcoal)', background: '#fff' }}>
            <Eye className="w-4 h-4" /> {directPdfReady ? 'Preview chapter' : 'Open notes'}
          </a>
        )}
      </div>
    </article>
  );
}

export default function StudyMaterial() {
  const [search, setSearch] = useState('');
  const [filterBoard, setFilterBoard] = useState(initialBoard);
  const [filterClass, setFilterClass] = useState('All');
  const [filterSubject, setFilterSubject] = useState('All');

  const boardMaterials = useMemo(() => allMaterials.filter((m) => (m.board || 'CBSE').toUpperCase() === filterBoard), [filterBoard]);
  const subjects = useMemo(() => ['All', ...new Set(boardMaterials.map((m) => m.subject).filter(Boolean))], [boardMaterials]);
  const filtered = useMemo(() => boardMaterials.filter((m) => {
    const classLevel = m.class ?? m.class_level;
    const haystack = `${m.title} ${m.subject || ''} ${m.chapter || ''}`.toLowerCase();
    return haystack.includes(search.toLowerCase()) && (filterClass === 'All' || classLevel === Number(filterClass)) && (filterSubject === 'All' || m.subject === filterSubject);
  }), [boardMaterials, search, filterClass, filterSubject]);

  const selectBoard = (board) => {
    setFilterBoard(board);
    setFilterClass('All');
    setFilterSubject('All');
    setSearch('');
    window.history.replaceState({}, '', `/study-material?board=${board}`);
  };

  const selectClass = (value) => {
    setFilterClass(value);
    setFilterSubject('All');
  };

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-ivory)' }}>
      <SEO title={TITLE} description={DESCRIPTION} path={PATH} structuredData={structuredData} />

      <section className="pt-10 sm:pt-14 pb-7 sm:pb-10 border-b" style={{ borderColor: 'var(--border)', background: '#fff' }}>
        <div className="page-container">
          <div className="max-w-4xl">
            <span className="eyebrow">FREE COMMERCE NOTES</span>
            <h1 className="mt-3 text-4xl sm:text-5xl lg:text-6xl leading-tight" style={{ fontFamily: 'var(--font-serif)', color: 'var(--ink)' }}>Find your PDF in <em>seconds.</em></h1>
            <p className="mt-4 text-base sm:text-lg max-w-2xl" style={{ color: 'var(--muted)' }}>No long scrolling. Choose Board → Class → Subject → Chapter, then download.</p>
          </div>

          <div className="mt-7 rounded-2xl p-4 sm:p-5" style={{ background: 'var(--bg-ivory)', border: '1px solid var(--border)' }}>
            <div className="flex items-center gap-2 mb-4 text-sm font-bold" style={{ color: 'var(--ink)' }}><SlidersHorizontal className="w-4 h-4" /> Quick finder</div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3">
              {['CBSE', 'GSEB'].map((board) => <button key={board} onClick={() => selectBoard(board)} className="rounded-xl px-4 py-3 text-sm font-extrabold" style={filterBoard === board ? { background: 'var(--ink)', color: 'var(--ivory-on-ink)' } : { background: '#fff', border: '1px solid var(--border)', color: 'var(--ink)' }}>{board}</button>)}
              {['11', '12'].map((level) => <button key={level} onClick={() => selectClass(level)} className="rounded-xl px-4 py-3 text-sm font-bold" style={filterClass === level ? { background: 'var(--gold-bg)', border: '1px solid rgba(184,135,47,.35)', color: 'var(--gold)' } : { background: '#fff', border: '1px solid var(--border)', color: 'var(--ink)' }}>Class {level}</button>)}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-[1fr_220px] gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--subtle)' }} />
                <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search chapter name..." className="w-full rounded-xl py-3 pl-10 pr-4 text-sm outline-none" style={{ background: '#fff', border: '1px solid var(--border)', color: 'var(--ink)' }} />
              </div>
              <select value={filterSubject} onChange={(e) => setFilterSubject(e.target.value)} className="rounded-xl px-4 py-3 text-sm outline-none" style={{ background: '#fff', border: '1px solid var(--border)', color: 'var(--ink)' }}>
                {subjects.map((s) => <option key={s} value={s}>{s === 'All' ? 'All Subjects' : s}</option>)}
              </select>
            </div>
          </div>
        </div>
      </section>

      <main className="page-container py-8 sm:py-10">
        <section className="mb-10">
          <div className="flex items-end justify-between gap-4 mb-4">
            <div><span className="eyebrow">DIRECT COLLECTIONS</span><h2 className="text-2xl sm:text-3xl mt-2" style={{ fontFamily: 'var(--font-serif)', color: 'var(--ink)' }}>Popular note folders</h2></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {seoHubs.map((hub) => {
              const count = seoMaterials.filter((m) => m.hubId === hub.id).length;
              return <Link key={hub.id} to={hub.path} className="rounded-2xl bg-white border p-5" style={{ borderColor: 'var(--border)' }}><div className="text-[11px] font-black" style={{ color: 'var(--gold)' }}>CBSE • CLASS {hub.classLevel}</div><h3 className="text-lg font-semibold mt-2" style={{ color: 'var(--ink)' }}>{hub.label}</h3><p className="text-sm mt-1" style={{ color: 'var(--muted)' }}>{count} chapter PDF{count === 1 ? '' : 's'}</p><span className="inline-block mt-4 text-sm font-bold" style={{ color: 'var(--gold)' }}>Open folder →</span></Link>;
            })}
            <a href="/gseb-class-12-economics.html" className="rounded-2xl bg-white border p-5" style={{ borderColor: 'rgba(184,135,47,.35)' }}><div className="text-[11px] font-black" style={{ color: 'var(--gold)' }}>GSEB • CLASS 12</div><h3 className="text-lg font-semibold mt-2" style={{ color: 'var(--ink)' }}>Economics</h3><p className="text-sm mt-1" style={{ color: 'var(--muted)' }}>Chapters 2–11</p><span className="inline-block mt-4 text-sm font-bold" style={{ color: 'var(--gold)' }}>Open folder →</span></a>
          </div>
        </section>

        <section id="all-notes">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-5">
            <div><span className="eyebrow">CHAPTER-WISE DOWNLOADS</span><h2 className="text-2xl sm:text-3xl mt-2" style={{ fontFamily: 'var(--font-serif)', color: 'var(--ink)' }}>{filterBoard} notes</h2></div>
            <div className="text-sm" style={{ color: 'var(--muted)' }}>{filtered.length} result{filtered.length === 1 ? '' : 's'}</div>
          </div>

          {filterBoard === 'GSEB' && <div className="mb-5 rounded-xl px-4 py-3 text-sm" style={{ background: '#fff8e8', border: '1px solid #ead4a4', color: '#73520f' }}>GSEB chapter pages are available now. Direct PDF download buttons will appear here as soon as those PDFs are attached to production.</div>}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filtered.map((material) => <MaterialCard key={material.id} material={material} />)}
          </div>

          {filtered.length === 0 && <div className="rounded-2xl border bg-white text-center py-14 px-5" style={{ borderColor: 'var(--border)' }}><FileText className="w-9 h-9 mx-auto mb-3" style={{ color: 'var(--subtle)' }} /><p style={{ color: 'var(--muted)' }}>No material found. Try another class, subject or chapter name.</p></div>}
        </section>
      </main>

      <a href="#all-notes" className="sm:hidden fixed bottom-20 right-4 z-40 inline-flex items-center gap-2 px-4 py-3 rounded-full text-sm font-extrabold shadow-lg" style={{ background: 'var(--ink)', color: 'var(--ivory-on-ink)' }}><Download className="w-4 h-4" /> Notes</a>
    </div>
  );
}
