import { useState } from 'react';
import { motion } from 'framer-motion';
import { Download, Eye, FileText, Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import { materialTypes } from '../data/studyMaterial';
import { seoHubs, seoMaterials } from '../data/seoMaterials';

const BUILT_IN_MATERIALS = [
  {
    id: 'economics-12-chapter-1',
    title: 'Introduction to Macroeconomics - Chapter 1',
    subject: 'Economics',
    board: 'CBSE',
    class_level: 12,
    chapter: 'Introduction to Macroeconomics',
    type: 'PDF Notes',
    pages: 20,
    is_free: true,
    file_url: '/materials/class-12/economics/chapter-1-introduction-to-macroeconomics.pdf',
  },
  {
    id: 'cbse-business-studies-12-chapter-01',
    title: 'Chapter 1 - Nature and Significance of Management',
    subject: 'Business Studies',
    board: 'CBSE',
    class_level: 12,
    chapter: 'Nature and Significance of Management',
    type: 'PDF Notes',
    pages: 46,
    is_free: true,
    file_url: '/materials/cbse/class-12/business-studies/chapter-01-nature-and-significance-of-management.pdf',
  },
  {
    id: 'cbse-business-studies-12-chapter-02',
    title: 'Chapter 2 - Principles of Management',
    subject: 'Business Studies',
    board: 'CBSE',
    class_level: 12,
    chapter: 'Principles of Management',
    type: 'PDF Notes',
    pages: 50,
    is_free: true,
    file_url: '/materials/cbse/class-12/business-studies/chapter-02-principles-of-management.pdf',
  },
  {
    id: 'cbse-business-studies-12-chapter-03',
    title: 'Chapter 3 - Business Environment',
    subject: 'Business Studies',
    board: 'CBSE',
    class_level: 12,
    chapter: 'Business Environment',
    type: 'PDF Notes',
    pages: 44,
    is_free: true,
    file_url: '/materials/cbse/class-12/business-studies/chapter-03-business-environment.pdf',
  },
  {
    id: 'cbse-business-studies-12-chapter-04',
    title: 'Chapter 4 - Planning',
    subject: 'Business Studies',
    board: 'CBSE',
    class_level: 12,
    chapter: 'Planning',
    type: 'PDF Notes',
    pages: 44,
    is_free: true,
    file_url: '/materials/cbse/class-12/business-studies/chapter-04-planning.pdf',
  },
  {
    id: 'cbse-business-studies-12-chapter-05',
    title: 'Chapter 5 - Organising',
    subject: 'Business Studies',
    board: 'CBSE',
    class_level: 12,
    chapter: 'Organising',
    type: 'PDF Notes',
    pages: 48,
    is_free: true,
    file_url: '/materials/cbse/class-12/business-studies/chapter-05-organising.pdf',
  },
  {
    id: 'cbse-business-studies-12-chapter-06',
    title: 'Chapter 6 - Staffing',
    subject: 'Business Studies',
    board: 'CBSE',
    class_level: 12,
    chapter: 'Staffing',
    type: 'PDF Notes',
    pages: 51,
    is_free: true,
    file_url: '/materials/cbse/class-12/business-studies/chapter-06-staffing.pdf',
  },
  {
    id: 'cbse-business-studies-12-chapter-07',
    title: 'Chapter 7 - Directing',
    subject: 'Business Studies',
    board: 'CBSE',
    class_level: 12,
    chapter: 'Directing',
    type: 'PDF Notes',
    pages: 43,
    is_free: true,
    file_url: '/materials/cbse/class-12/business-studies/chapter-07-directing.pdf',
  },
  {
    id: 'cbse-business-studies-12-chapter-08',
    title: 'Chapter 8 - Controlling',
    subject: 'Business Studies',
    board: 'CBSE',
    class_level: 12,
    chapter: 'Controlling',
    type: 'PDF Notes',
    pages: 46,
    is_free: true,
    file_url: '/materials/cbse/class-12/business-studies/chapter-08-controlling.pdf',
  },
  {
    id: 'cbse-business-studies-12-chapter-09',
    title: 'Chapter 9 - Financial Management',
    subject: 'Business Studies',
    board: 'CBSE',
    class_level: 12,
    chapter: 'Financial Management',
    type: 'PDF Notes',
    pages: 48,
    is_free: true,
    file_url: '/materials/cbse/class-12/business-studies/chapter-09-financial-management.pdf',
  },
  {
    id: 'cbse-business-studies-12-chapter-10',
    title: 'Chapter 10 - Financial Markets',
    subject: 'Business Studies',
    board: 'CBSE',
    class_level: 12,
    chapter: 'Financial Markets',
    type: 'PDF Notes',
    pages: 49,
    is_free: true,
    file_url: '/materials/cbse/class-12/business-studies/chapter-10-financial-markets.pdf',
  },
  {
    id: 'cbse-business-studies-12-chapter-11',
    title: 'Chapter 11 - Marketing Management',
    subject: 'Business Studies',
    board: 'CBSE',
    class_level: 12,
    chapter: 'Marketing Management',
    type: 'PDF Notes',
    pages: 51,
    is_free: true,
    file_url: '/materials/cbse/class-12/business-studies/chapter-11-marketing-management.pdf',
  },
  {
    id: 'cbse-business-studies-12-chapter-12',
    title: 'Chapter 12 - Consumer Protection',
    subject: 'Business Studies',
    board: 'CBSE',
    class_level: 12,
    chapter: 'Consumer Protection',
    type: 'PDF Notes',
    pages: 50,
    is_free: true,
    file_url: '/materials/cbse/class-12/business-studies/chapter-12-consumer-protection.pdf',
  },
  {
    id: 'cbse-microeconomics-11-chapter-01',
    title: 'Chapter 1 - Economics and Economy',
    subject: 'Economics',
    board: 'CBSE',
    class_level: 11,
    chapter: 'Economics and Economy',
    type: 'PDF Notes',
    pages: 15,
    is_free: true,
    file_url: '/materials/cbse/class-11/microeconomics/chapter-01-economics-and-economy.pdf',
  },
  {
    id: 'cbse-microeconomics-11-chapter-02',
    title: 'Chapter 2 - Central Problems of an Economy',
    subject: 'Economics',
    board: 'CBSE',
    class_level: 11,
    chapter: 'Central Problems of an Economy',
    type: 'PDF Notes',
    pages: 13,
    is_free: true,
    file_url: '/materials/cbse/class-11/microeconomics/chapter-02-central-problems-of-economy.pdf',
  },
  {
    id: 'cbse-microeconomics-11-chapter-03',
    title: 'Chapter 3 - Consumer\'s Equilibrium - Utility Analysis',
    subject: 'Economics',
    board: 'CBSE',
    class_level: 11,
    chapter: 'Consumer\'s Equilibrium - Utility Analysis',
    type: 'PDF Notes',
    pages: 11,
    is_free: true,
    file_url: '/materials/cbse/class-11/microeconomics/chapter-03-consumers-equilibrium-utility.pdf',
  },
  {
    id: 'cbse-microeconomics-11-chapter-04',
    title: 'Chapter 4 - Consumer\'s Equilibrium - Indifference Curve Analysis',
    subject: 'Economics',
    board: 'CBSE',
    class_level: 11,
    chapter: 'Consumer\'s Equilibrium - Indifference Curve Analysis',
    type: 'PDF Notes',
    pages: 10,
    is_free: true,
    file_url: '/materials/cbse/class-11/microeconomics/chapter-04-indifference-curve-analysis.pdf',
  },
  {
    id: 'cbse-microeconomics-11-chapter-05',
    title: 'Chapter 5 - Theory of Demand',
    subject: 'Economics',
    board: 'CBSE',
    class_level: 11,
    chapter: 'Theory of Demand',
    type: 'PDF Notes',
    pages: 10,
    is_free: true,
    file_url: '/materials/cbse/class-11/microeconomics/chapter-05-theory-of-demand.pdf',
  },
  {
    id: 'cbse-microeconomics-11-chapter-06',
    title: 'Chapter 6 - Price Elasticity of Demand',
    subject: 'Economics',
    board: 'CBSE',
    class_level: 11,
    chapter: 'Price Elasticity of Demand',
    type: 'PDF Notes',
    pages: 7,
    is_free: true,
    file_url: '/materials/cbse/class-11/microeconomics/chapter-06-price-elasticity-of-demand.pdf',
  },
  {
    id: 'cbse-microeconomics-11-chapter-07',
    title: 'Chapter 7 - Production Function and Returns to a Factor',
    subject: 'Economics',
    board: 'CBSE',
    class_level: 11,
    chapter: 'Production Function and Returns to a Factor',
    type: 'PDF Notes',
    pages: 8,
    is_free: true,
    file_url: '/materials/cbse/class-11/microeconomics/chapter-07-production-function.pdf',
  },
  {
    id: 'cbse-microeconomics-11-chapter-08',
    title: 'Chapter 8 - Concepts of Cost',
    subject: 'Economics',
    board: 'CBSE',
    class_level: 11,
    chapter: 'Concepts of Cost',
    type: 'PDF Notes',
    pages: 14,
    is_free: true,
    file_url: '/materials/cbse/class-11/microeconomics/chapter-08-concepts-of-cost.pdf',
  },
  {
    id: 'cbse-microeconomics-11-chapter-09',
    title: 'Chapter 9 - Concept of Revenue',
    subject: 'Economics',
    board: 'CBSE',
    class_level: 11,
    chapter: 'Concept of Revenue',
    type: 'PDF Notes',
    pages: 11,
    is_free: true,
    file_url: '/materials/cbse/class-11/microeconomics/chapter-09-concept-of-revenue.pdf',
  },
  {
    id: 'cbse-microeconomics-11-chapter-10',
    title: 'Chapter 10 - Producer\'s Equilibrium',
    subject: 'Economics',
    board: 'CBSE',
    class_level: 11,
    chapter: 'Producer\'s Equilibrium',
    type: 'PDF Notes',
    pages: 11,
    is_free: true,
    file_url: '/materials/cbse/class-11/microeconomics/chapter-10-producers-equilibrium.pdf',
  },
  {
    id: 'cbse-microeconomics-11-chapter-11',
    title: 'Chapter 11 - Supply',
    subject: 'Economics',
    board: 'CBSE',
    class_level: 11,
    chapter: 'Supply',
    type: 'PDF Notes',
    pages: 12,
    is_free: true,
    file_url: '/materials/cbse/class-11/microeconomics/chapter-11-supply.pdf',
  },
  {
    id: 'cbse-microeconomics-11-chapter-12',
    title: 'Chapter 12 - Forms of Market',
    subject: 'Economics',
    board: 'CBSE',
    class_level: 11,
    chapter: 'Forms of Market',
    type: 'PDF Notes',
    pages: 11,
    is_free: true,
    file_url: '/materials/cbse/class-11/microeconomics/chapter-12-forms-of-market.pdf',
  },
  {
    id: 'cbse-microeconomics-11-chapter-13',
    title: 'Chapter 13 - Market Equilibrium',
    subject: 'Economics',
    board: 'CBSE',
    class_level: 11,
    chapter: 'Market Equilibrium',
    type: 'PDF Notes',
    pages: 11,
    is_free: true,
    file_url: '/materials/cbse/class-11/microeconomics/chapter-13-market-equilibrium.pdf',
  },
];

function MaterialCard({ material }) {
  const isFree = material.isFree ?? material.is_free;
  const classLevel = material.class ?? material.class_level;
  const board = (material.board || 'CBSE').toUpperCase();
  const fileUrl = material.file_url;

  return (
    <motion.div whileHover={{ y: -3 }} className="card-paper group flex flex-col p-5">
      <div className="flex items-start gap-3 mb-3">
        <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{ background: 'var(--gold-bg)', border: '1px solid rgba(184,135,47,0.18)' }}>
          <FileText className="w-5 h-5" style={{ color: 'var(--gold)' }} strokeWidth={1.8} />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full"
              style={{ background: board === 'CBSE' ? '#eef4ff' : '#fff4e6', border: board === 'CBSE' ? '1px solid #bfd3ff' : '1px solid #ffd29a', color: board === 'CBSE' ? '#2457a7' : '#9a4f00' }}>
              {board}
            </span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full"
              style={{ background: 'var(--bg-ivory)', border: '1px solid var(--border)', color: 'var(--charcoal)' }}>
              {material.type}
            </span>
            {isFree
              ? <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ background: 'rgba(77,124,15,0.08)', border: '1px solid rgba(77,124,15,0.25)', color: 'var(--green)' }}>Free</span>
              : <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ background: 'var(--gold-bg)', border: '1px solid rgba(184,135,47,0.25)', color: 'var(--gold)' }}>Premium</span>
            }
          </div>
          <h3 className="text-sm leading-tight" style={{ fontFamily: 'var(--font-sans)', fontWeight: 600, color: 'var(--ink)' }}>
            <Link to={material.seo_path}>{material.title}</Link>
          </h3>
        </div>
      </div>

      <div className="flex items-center gap-3 text-xs mb-4 flex-wrap" style={{ color: 'var(--subtle)' }}>
        <span>{material.subject}</span>
        <span>•</span>
        <span>Class {classLevel}</span>
        {material.pages && <><span>•</span><span>{material.pages} pages</span></>}
      </div>

      <div className="mt-auto flex gap-2">
        {/* VIEW BUTTON */}
        {fileUrl && (
          <Link
            to={material.seo_path}
            className="tile-paper flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-medium"
            style={{ color: 'var(--charcoal)' }}
          >
            <Eye className="w-3.5 h-3.5" /> View notes
          </Link>
        )}

        {/* DOWNLOAD BUTTON */}
        {fileUrl && (
          <a
            href={fileUrl}
            download
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold transition-all"
            style={{ background: 'var(--gold-bg)', border: '1px solid rgba(184,135,47,0.3)', color: 'var(--gold)' }}
            onMouseEnter={e => { e.currentTarget.style.background = 'var(--gold)'; e.currentTarget.style.color = '#fff'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'var(--gold-bg)'; e.currentTarget.style.color = 'var(--gold)'; }}
          >
            <Download className="w-3.5 h-3.5" /> Download
          </a>
        )}
      </div>
    </motion.div>
  );
}

export default function StudyMaterial() {
  const [search, setSearch] = useState('');
  const [filterBoard, setFilterBoard] = useState('CBSE');
  const [filterClass, setFilterClass] = useState('All');
  const [filterType, setFilterType] = useState('All');
  const [filterSubject, setFilterSubject] = useState('All');
  const uploadedMaterials = seoMaterials;
  const subjects = ['All', 'Accountancy', 'Business Studies', 'Economics', 'Entrepreneurship', 'Physical Education', 'All Subjects'];

  const filtered = uploadedMaterials.filter((m) => {
    const classLevel = m.class ?? m.class_level;
    const board = (m.board || 'CBSE').toUpperCase();
    const matchBoard = board === filterBoard;
    const matchSearch = m.title.toLowerCase().includes(search.toLowerCase()) || m.subject.toLowerCase().includes(search.toLowerCase());
    const matchClass = filterClass === 'All' || classLevel === Number(filterClass);
    const matchType = filterType === 'All' || m.type === filterType;
    const matchSubject = filterSubject === 'All' || m.subject === filterSubject;
    return matchBoard && matchSearch && matchClass && matchType && matchSubject;
  });

  const pillStyle = (active) => active
    ? { background: 'var(--ink)', color: 'var(--ivory-on-ink)', border: '1px solid var(--ink)' }
    : { background: 'var(--bg-white)', color: 'var(--muted)', border: '1px solid var(--border)' };

  const inputStyle = {
    background: 'var(--bg-white)',
    border: '1px solid var(--border)',
    borderRadius: '12px',
    color: 'var(--ink)',
    padding: '12px 16px',
    fontFamily: 'var(--font-sans)',
    fontSize: '14px',
    width: '100%',
  };

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-ivory)' }}>
      <div className="page-hero">
        <div className="page-container text-center">
          <span className="eyebrow">All Study Resources</span>
          <h1 className="mt-5">Study <em>material.</em></h1>
          <p className="mx-auto">Notes, mind maps, formula sheets, sample papers, PYQs and more — all chapter-wise.</p>

          <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium"
            style={{ background: 'rgba(77,124,15,0.08)', border: '1px solid rgba(77,124,15,0.25)', color: 'var(--green)' }}>
            ✓ All currently published PDFs are free
          </div>
        </div>
      </div>

      <div className="page-container section-padding">
        <section className="mb-12" aria-labelledby="seo-collections-title">
          <div className="text-center max-w-3xl mx-auto mb-7">
            <span className="eyebrow">Start with your subject</span>
            <h2 id="seo-collections-title" className="text-3xl mt-3" style={{ fontFamily: 'var(--font-serif)', color: 'var(--ink)' }}>Free chapter-wise CBSE notes</h2>
            <p className="mt-3" style={{ color: 'var(--muted)' }}>Open a complete subject collection or choose an individual chapter below.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {seoHubs.map((hub) => {
              const count = seoMaterials.filter((material) => material.hubId === hub.id).length;
              return (
                <Link key={hub.id} to={hub.path} className="card-paper p-6 group">
                  <div className="text-xs font-semibold mb-2" style={{ color: 'var(--gold)' }}>CBSE • CLASS {hub.classLevel}</div>
                  <h3 className="text-xl mb-2" style={{ fontFamily: 'var(--font-serif)', color: 'var(--ink)' }}>{hub.label} Notes</h3>
                  <p className="text-sm mb-4" style={{ color: 'var(--muted)' }}>{count} free chapter PDF{count === 1 ? '' : 's'} available</p>
                  <span className="text-sm font-semibold" style={{ color: 'var(--gold)' }}>Browse collection →</span>
                </Link>
              );
            })}
          </div>
        </section>

        {/* Board selector */}
        <div className="text-center mb-10">
          <div className="text-sm font-semibold mb-3" style={{ color: 'var(--ink)' }}>Choose your board</div>
          <div className="toggle-paper inline-flex">
            <button onClick={() => setFilterBoard('CBSE')} className="active">CBSE Board</button>
            <button disabled aria-disabled="true" title="GSEB notes are coming soon" className="opacity-55 cursor-not-allowed">GSEB — Coming soon</button>
          </div>
        </div>

        {/* Material type pills */}
        <div className="flex flex-wrap gap-2 mb-8">
          <button onClick={() => setFilterType('All')} className="px-3 py-1.5 rounded-full text-xs font-medium transition-colors" style={pillStyle(filterType === 'All')}>
            All Types
          </button>
          {materialTypes.map((t) => (
            <button
              key={t}
              onClick={() => setFilterType(t)}
              className="px-3 py-1.5 rounded-full text-xs font-medium transition-colors"
              style={pillStyle(filterType === t)}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Filters */}
        <div className="card-paper p-5 mb-8 flex flex-wrap gap-4">
          <div className="flex-1 min-w-[200px] relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--subtle)' }} />
            <input style={{ ...inputStyle, paddingLeft: '40px' }} placeholder="Search material..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <select value={filterClass} onChange={(e) => setFilterClass(e.target.value)} style={{ ...inputStyle, width: 'auto', minWidth: '140px' }}>
            <option value="All">All Classes</option>
            <option value="11">Class 11</option>
            <option value="12">Class 12</option>
          </select>
          <select value={filterSubject} onChange={(e) => setFilterSubject(e.target.value)} style={{ ...inputStyle, width: 'auto', minWidth: '160px' }}>
            {subjects.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        <div className="text-sm mb-5" style={{ color: 'var(--muted)' }}>
          Showing <span className="font-semibold" style={{ color: 'var(--gold)' }}>{filtered.length}</span> materials
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filtered.map((material) => (
            <MaterialCard key={material.id} material={material} />
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16">
            <FileText className="w-10 h-10 mx-auto mb-3" style={{ color: 'var(--subtle)' }} strokeWidth={1.5} />
            <div style={{ color: 'var(--muted)' }}>No CBSE materials found for the selected filters.</div>
          </div>
        )}
      </div>
    </div>
  );
}
