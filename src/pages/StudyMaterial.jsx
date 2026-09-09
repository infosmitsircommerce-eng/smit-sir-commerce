import { useMemo, useState } from 'react';
import { ArrowRight, BookOpen, Brain, CheckCircle2, Download, Eye, FileText, ListChecks, GraduationCap, Search, SlidersHorizontal, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import SEO from '../components/ui/SEO';
import { seoHubs, seoMaterials } from '../data/seoMaterials';
import { gsebMaterials } from '../data/gsebMaterials';

const allMaterials = [...seoMaterials, ...gsebMaterials];
const initialBoard = typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('board')?.toUpperCase() === 'GSEB' ? 'GSEB' : 'CBSE';
const PATH = '/study-material';
const TITLE = 'Free Commerce Notes PDF — CBSE & GSEB Class 11 and 12 | Smit Sir Commerce';
const DESCRIPTION = 'Free Commerce study material for CBSE and GSEB students: Class 11 and 12 Economics, Business Studies, Accountancy resources, GSEB Class 12 Business Administration (OCM) and Economics PDFs, quizzes and study tools.';

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'CollectionPage',
  name: TITLE,
  description: DESCRIPTION,
  url: `https://www.smitsircommerce.in${PATH}`,
  isAccessibleForFree: true,
  about: ['Commerce notes', 'CBSE Commerce', 'GSEB Economics', 'GSEB Business Administration', 'Class 11 Commerce', 'Class 12 Commerce', 'Economics', 'Business Studies', 'Accountancy'],
};

const classLevelOf = (material) => material.class ?? material.class_level;

const startGuide = [
  { title: 'Choose board', text: 'Start with CBSE or GSEB so you do not waste time.' },
  { title: 'Pick class', text: 'Select Class 11 or Class 12 and then the subject.' },
  { title: 'Open chapter', text: 'Use direct chapter notes or download the PDF.' },
  { title: 'Practise', text: 'After notes, revise with questions, tests and quizzes.' },
];

const subjectBlocks = [
  { title: 'CBSE Class 11 Commerce Notes', text: 'Microeconomics, Statistics and foundation Commerce resources.', to: '/cbse-notes' },
  { title: 'CBSE Class 12 Commerce Notes', text: 'Economics and Business Studies revision-focused resources.', to: '/cbse-notes' },
  { title: 'GSEB Class 12 OCM & Economics PDFs', text: 'OCM Chapters 1–4 and Economics Chapters 2–11 with direct PDF access.', to: '/study-material?board=GSEB' },
  { title: 'Tools + Practice + Quizzes', text: 'Calculators, daily questions and chapter-wise Commerce quizzes.', to: '/quizzes' },
  { title: 'Smit Sir Teacher Guides', text: 'Common mistakes, numericals, case studies, answer writing and revision plans.', to: '/teacher-guides' },
];

const trustPoints = ['Made by Smit Thaker', 'Commerce teacher', 'Free material for students', 'CBSE + GSEB focused'];

function SmartLink({ to, className, style, children, ...props }) {
  if (to.startsWith('#')) return <a href={to} className={className} style={style} {...props}>{children}</a>;
  return <Link to={to} className={className} style={style} {...props}>{children}</Link>;
}

function QuickAction({ icon: Icon, title, text, to, primary }) {
  return (
    <SmartLink to={to} className="ssc-quick-action-card ssc-hover-lift rounded-2xl p-4 sm:p-5 flex items-center gap-4" aria-label={title}>
      <div className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0" style={{ background: primary ? 'linear-gradient(135deg, #172033, #253147)' : 'var(--brand-soft)', color: primary ? 'var(--ivory-on-ink)' : 'var(--gold)' }}>
        <Icon className="w-5 h-5" strokeWidth={2.4} />
      </div>
      <div className="min-w-0">
        <h3 className="font-black text-base" style={{ color: 'var(--ink)' }}>{title}</h3>
        <p className="text-xs mt-0.5 leading-relaxed" style={{ color: 'var(--muted)' }}>{text}</p>
      </div>
      <ArrowRight className="w-4 h-4 ml-auto shrink-0" style={{ color: 'var(--gold)' }} />
    </SmartLink>
  );
}

function MaterialCard({ material }) {
  const board = (material.board || 'CBSE').toUpperCase();
  const classLevel = classLevelOf(material);
  const fileUrl = material.file_url;
  const viewUrl = material.seo_path || fileUrl;
  const directPdfReady = Boolean(fileUrl);

  return (
    <article className="ssc-material-card rounded-[1.4rem] p-4 sm:p-5 flex flex-col gap-4">
      <div className="flex items-start gap-3">
        <div className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0" style={{ background: board === 'CBSE' ? '#eef4ff' : '#fff4e6', color: board === 'CBSE' ? '#2457a7' : '#9a4f00', border: '1px solid rgba(184,135,47,0.16)' }}>
          <FileText className="w-5 h-5" strokeWidth={2.3} />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap mb-2">
            <span className="text-[11px] font-black px-2.5 py-1 rounded-full" style={{ background: board === 'CBSE' ? '#eef4ff' : '#fff4e6', color: board === 'CBSE' ? '#2457a7' : '#9a4f00', border: '1px solid rgba(23,32,51,0.06)' }}>{board}</span>
            <span className="text-[11px] font-bold px-2.5 py-1 rounded-full" style={{ background: '#f8fafc', color: 'var(--charcoal)', border: '1px solid var(--border-soft)' }}>Class {classLevel}</span>
            {material.is_free && <span className="text-[11px] font-black px-2.5 py-1 rounded-full" style={{ background: '#f1f8e8', color: 'var(--green)', border: '1px solid rgba(77,124,15,0.20)' }}>Free</span>}
          </div>
          <h3 className="text-[15px] sm:text-base font-black leading-snug" style={{ color: 'var(--ink)' }}>{material.title}</h3>
          <p className="text-xs mt-2" style={{ color: 'var(--muted)' }}>{material.subject} • {material.pages ? `${material.pages} pages` : 'PDF notes'}</p>
        </div>
      </div>

      <div className="mt-auto grid gap-2">
        {directPdfReady && (
          <a href={fileUrl} download target="_blank" rel="noopener noreferrer" className="ssc-download-btn flex items-center justify-center gap-2 px-4 py-3 text-sm font-black">
            <Download className="w-4 h-4" /> Download PDF
          </a>
        )}
        {viewUrl && (
          <a href={viewUrl} className="ssc-quiet-btn flex items-center justify-center gap-2 rounded-2xl px-4 py-2.5 text-sm font-bold">
            <Eye className="w-4 h-4" /> View chapter notes
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
  const classLevels = useMemo(() => ['All', ...new Set(boardMaterials.map(classLevelOf).filter(Boolean).sort((a, b) => Number(a) - Number(b)))], [boardMaterials]);
  const filtered = useMemo(() => [...boardMaterials].filter((m) => {
    const classLevel = classLevelOf(m);
    const haystack = `${m.title} ${m.subject || ''} ${m.chapter || ''} ${m.board || ''}`.toLowerCase();
    return haystack.includes(search.toLowerCase()) && (filterClass === 'All' || classLevel === Number(filterClass)) && (filterSubject === 'All' || m.subject === filterSubject);
  }).sort((a, b) => (Number(classLevelOf(a)) - Number(classLevelOf(b))) || ((a.chapterNumber || 0) - (b.chapterNumber || 0)) || a.title.localeCompare(b.title)), [boardMaterials, search, filterClass, filterSubject]);

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

  const quickActions = [
    { icon: Download, title: 'All notes', text: 'Jump straight to chapter PDFs.', to: '#all-notes', primary: true },
    { icon: GraduationCap, title: 'GSEB Economics', 'GSEB Business Administration', text: 'Class 12 chapters 2–11.', to: '/study-material?board=GSEB' },
    { icon: Brain, title: 'Practice', text: 'Daily questions and tests.', to: '/daily-practice' },
    { icon: Gamepad2, title: 'Games', text: 'Real-life Commerce revision.', to: '/quizzes' },
  ];

  return (
    <div className="ssc-premium-canvas min-h-screen">
      <SEO title={TITLE} description={DESCRIPTION} path={PATH} structuredData={structuredData} />

      <section className="pt-8 sm:pt-12 pb-7 sm:pb-10">
        <div className="page-container">
          <div className="ssc-hero-panel px-5 py-7 sm:p-8 lg:p-10">
            <div className="ssc-hero-content grid lg:grid-cols-[1.15fr_.85fr] gap-8 items-center">
              <div>
                <span className="eyebrow">FREE COMMERCE STUDY MATERIAL</span>
                <h1 className="mt-4 text-4xl sm:text-5xl lg:text-6xl leading-tight" style={{ fontFamily: 'var(--font-serif)', color: 'var(--ink)' }}>
                  Everything important in <span className="ssc-gold-text">one place.</span>
                </h1>
                <p className="mt-4 text-base sm:text-lg max-w-2xl" style={{ color: 'var(--muted)' }}>
                  CBSE and GSEB Commerce notes, Economics PDFs, Business Administration (OCM) notes, Business Studies resources, Accountancy support, practice tools and chapter-wise quizzes — arranged so students can find material fast.
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <a href="#all-notes" className="btn-primary min-h-12 px-5"><Download className="w-4 h-4" /> Download notes</a>
                  <Link to="/quizzes" className="btn-outline-ink min-h-12 px-5"><ListChecks className="w-4 h-4" /> Take quizzes</Link><Link to="/teacher-guides" className="btn-outline-ink min-h-12 px-5"><BookOpen className="w-4 h-4" /> Teacher Guides</Link>
                </div>
              </div>

              <div className="ssc-glass-card rounded-[1.6rem] p-5 sm:p-6">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-11 h-11 rounded-2xl flex items-center justify-center" style={{ background: 'var(--brand-soft)', color: 'var(--gold)' }}><Sparkles className="w-5 h-5" /></div>
                  <div>
                    <h2 className="text-lg font-black" style={{ color: 'var(--ink)' }}>Student-first library</h2>
                    <p className="text-xs" style={{ color: 'var(--muted)' }}>Notes first. Practice next. Demo only when needed.</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-2xl p-4" style={{ background: '#fff', border: '1px solid var(--border-soft)' }}><div className="text-2xl font-black" style={{ color: 'var(--ink)' }}>{allMaterials.length}</div><p className="text-xs" style={{ color: 'var(--muted)' }}>Total resources</p></div>
                  <div className="rounded-2xl p-4" style={{ background: '#fff', border: '1px solid var(--border-soft)' }}><div className="text-2xl font-black" style={{ color: 'var(--ink)' }}>{gsebMaterials.length}</div><p className="text-xs" style={{ color: 'var(--muted)' }}>GSEB PDFs</p></div>
                  <div className="rounded-2xl p-4 col-span-2 flex items-center gap-3" style={{ background: 'linear-gradient(135deg, #172033, #253147)', color: 'var(--ivory-on-ink)' }}>
                    <CheckCircle2 className="w-5 h-5" style={{ color: 'var(--gold-bright)' }} />
                    <p className="text-sm font-bold text-white">Direct PDF download is connected for available files.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {quickActions.map((action) => <QuickAction key={action.title} {...action} />)}
          </div>
        </div>
      </section>

      <section className="page-container pb-7">
        <div className="grid lg:grid-cols-[1fr_.72fr] gap-4">
          <div className="ssc-glass-card rounded-[1.8rem] p-5 sm:p-6">
            <span className="eyebrow">START HERE ROADMAP</span>
            <h2 className="text-2xl sm:text-3xl mt-3 mb-5" style={{ fontFamily: 'var(--font-serif)', color: 'var(--ink)' }}>New student? Follow this simple path.</h2>
            <div className="grid sm:grid-cols-4 gap-3">
              {startGuide.map((step, index) => (
                <div key={step.title} className="rounded-2xl p-4" style={{ background: '#fff', border: '1px solid var(--border-soft)' }}>
                  <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-black mb-3" style={{ background: index === 0 ? 'linear-gradient(135deg, #8F5C10, #D5A438)' : 'var(--brand-soft)', color: index === 0 ? '#fff' : 'var(--gold)' }}>{index + 1}</div>
                  <h3 className="font-black text-sm" style={{ color: 'var(--ink)' }}>{step.title}</h3>
                  <p className="text-xs mt-2 leading-relaxed" style={{ color: 'var(--muted)' }}>{step.text}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="ssc-glass-card rounded-[1.8rem] p-5 sm:p-6">
            <span className="eyebrow">TRUST</span>
            <h2 className="text-2xl mt-3" style={{ fontFamily: 'var(--font-serif)', color: 'var(--ink)' }}>Built for real students.</h2>
            <div className="grid gap-2 mt-5">
              {trustPoints.map((point) => (
                <div key={point} className="flex items-center gap-3 rounded-2xl p-3" style={{ background: '#fff', border: '1px solid var(--border-soft)' }}>
                  <CheckCircle2 className="w-4 h-4 shrink-0" style={{ color: 'var(--green)' }} />
                  <span className="text-sm font-bold" style={{ color: 'var(--charcoal)' }}>{point}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="page-container pb-7">
        <div className="ssc-finder-shell p-4 sm:p-5">
          <div className="flex items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-2 text-sm font-black" style={{ color: 'var(--ink)' }}><SlidersHorizontal className="w-4 h-4" /> Quick finder</div>
            <span className="hidden sm:inline-flex text-xs font-bold px-3 py-1 rounded-full" style={{ background: 'var(--brand-soft)', color: 'var(--gold)' }}>Board → Class → Subject → Chapter</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3">
            {['CBSE', 'GSEB'].map((board) => <button key={board} type="button" onClick={() => selectBoard(board)} className="ssc-chip-button px-4 py-3 text-sm" data-active={filterBoard === board}>{board}</button>)}
            {classLevels.map((level) => <button key={level} type="button" onClick={() => selectClass(String(level))} className="ssc-chip-button px-4 py-3 text-sm" data-active={String(filterClass) === String(level)}>{level === 'All' ? 'All Classes' : `Class ${level}`}</button>)}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-[1fr_220px] gap-3">
            <label className="relative block">
              <span className="sr-only">Search chapter name</span>
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--subtle)' }} />
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search chapter name, subject or board..." className="w-full rounded-2xl py-3 pl-10 pr-4 text-sm outline-none" style={{ background: '#fff', border: '1px solid var(--border)', color: 'var(--ink)' }} />
            </label>
            <select value={filterSubject} onChange={(e) => setFilterSubject(e.target.value)} className="rounded-2xl px-4 py-3 text-sm font-bold outline-none" style={{ background: '#fff', border: '1px solid var(--border)', color: 'var(--ink)' }} aria-label="Filter by subject">
              {subjects.map((s) => <option key={s} value={s}>{s === 'All' ? 'All Subjects' : s}</option>)}
            </select>
          </div>
        </div>
      </section>

      <main className="page-container pb-10 sm:pb-14">
        <section className="mb-10">
          <div className="flex items-end justify-between gap-4 mb-4">
            <div><span className="eyebrow">DIRECT COLLECTIONS</span><h2 className="text-2xl sm:text-3xl mt-2" style={{ fontFamily: 'var(--font-serif)', color: 'var(--ink)' }}>Popular folders</h2></div>
            <Link to="/cbse-notes" className="hidden sm:inline-flex items-center gap-2 text-sm font-black" style={{ color: 'var(--gold)' }}>CBSE notes <ArrowRight className="w-4 h-4" /></Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
            {subjectBlocks.map((block) => (
              <Link key={block.title} to={block.to} className="ssc-quick-action-card ssc-hover-lift rounded-2xl p-5">
                <div className="w-11 h-11 rounded-2xl flex items-center justify-center mb-4" style={{ background: 'var(--brand-soft)', color: 'var(--gold)' }}><BookOpen className="w-5 h-5" /></div>
                <h3 className="text-lg font-black" style={{ color: 'var(--ink)' }}>{block.title}</h3>
                <p className="text-sm mt-2 leading-relaxed" style={{ color: 'var(--muted)' }}>{block.text}</p>
                <span className="inline-flex items-center gap-1 mt-4 text-sm font-black" style={{ color: 'var(--gold)' }}>Open <ArrowRight className="w-4 h-4" /></span>
              </Link>
            ))}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {seoHubs.map((hub) => {
              const count = seoMaterials.filter((m) => m.hubId === hub.id).length;
              return <Link key={hub.id} to={hub.path} className="ssc-quick-action-card ssc-hover-lift rounded-2xl p-5"><div className="w-11 h-11 rounded-2xl flex items-center justify-center mb-4" style={{ background: '#eef4ff', color: '#2457a7' }}><BookOpen className="w-5 h-5" /></div><div className="text-[11px] font-black" style={{ color: 'var(--gold)' }}>CBSE • CLASS {hub.classLevel}</div><h3 className="text-lg font-black mt-2" style={{ color: 'var(--ink)' }}>{hub.label}</h3><p className="text-sm mt-1" style={{ color: 'var(--muted)' }}>{count} chapter PDF{count === 1 ? '' : 's'}</p><span className="inline-flex items-center gap-1 mt-4 text-sm font-black" style={{ color: 'var(--gold)' }}>Open folder <ArrowRight className="w-4 h-4" /></span></Link>;
            })}
            <Link to="/study-material?board=GSEB" className="ssc-quick-action-card ssc-hover-lift rounded-2xl p-5"><div className="w-11 h-11 rounded-2xl flex items-center justify-center mb-4" style={{ background: '#fff4e6', color: '#9a4f00' }}><GraduationCap className="w-5 h-5" /></div><div className="text-[11px] font-black" style={{ color: 'var(--gold)' }}>GSEB • CLASS 12</div><h3 className="text-lg font-black mt-2" style={{ color: 'var(--ink)' }}>OCM & Economics PDFs</h3><p className="text-sm mt-1" style={{ color: 'var(--muted)' }}>OCM 1–4 • Economics 2–11</p><span className="inline-flex items-center gap-1 mt-4 text-sm font-black" style={{ color: 'var(--gold)' }}>Open folder <ArrowRight className="w-4 h-4" /></span></Link>
          </div>
        </section>

        <section id="all-notes">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-5">
            <div><span className="eyebrow">CHAPTER-WISE DOWNLOADS</span><h2 className="text-2xl sm:text-3xl mt-2" style={{ fontFamily: 'var(--font-serif)', color: 'var(--ink)' }}>{filterBoard} notes</h2></div>
            <div className="text-sm font-bold px-3 py-2 rounded-full self-start sm:self-auto" style={{ color: 'var(--gold)', background: 'var(--brand-soft)', border: '1px solid rgba(184,135,47,0.16)' }}>{filtered.length} result{filtered.length === 1 ? '' : 's'}</div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filtered.map((material) => <MaterialCard key={material.id} material={material} />)}
          </div>

          {filtered.length === 0 && <div className="ssc-glass-card rounded-3xl text-center py-14 px-5"><FileText className="w-9 h-9 mx-auto mb-3" style={{ color: 'var(--subtle)' }} /><p style={{ color: 'var(--muted)' }}>No material found. Try another class, subject or chapter name.</p></div>}
        </section>
      </main>

      <a href="#all-notes" className="sm:hidden fixed bottom-20 right-4 z-40 inline-flex items-center gap-2 px-4 py-3 rounded-full text-sm font-black shadow-lg" style={{ background: 'var(--ink)', color: 'var(--ivory-on-ink)' }}><Download className="w-4 h-4" /> Notes</a>
    </div>
  );
}
