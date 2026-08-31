import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Clock, FileText, BarChart2, Lock, Play, Award, TrendingUp, AlertTriangle,
  CheckCircle2, ArrowRight, ShieldCheck, Target, Sparkles, BookOpenCheck, Zap
} from 'lucide-react';
import ComingSoonModal from '../components/ui/ComingSoonModal';

const tests = [
  { id: 1, name: 'Partnership Firms Chapter Test', subject: 'Accountancy', class: 12, marks: 25, time: '30 min', questions: 20, difficulty: 'Medium', type: 'Chapter Test', isFree: true },
  { id: 2, name: 'Unit Test 1 — Accountancy Class 12', subject: 'Accountancy', class: 12, marks: 50, time: '1 hr', questions: 40, difficulty: 'Medium', type: 'Unit Test', isFree: false },
  { id: 3, name: 'Full Syllabus Test — Class 12 Accountancy', subject: 'Accountancy', class: 12, marks: 80, time: '3 hrs', questions: 65, difficulty: 'Hard', type: 'Full Syllabus Test', isFree: false },
  { id: 4, name: 'Pre-Board Test — Class 12', subject: 'All Subjects', class: 12, marks: 80, time: '3 hrs', questions: 60, difficulty: 'Hard', type: 'Pre-Board Test', isFree: false },
  { id: 5, name: 'Management Principles Chapter Test', subject: 'Business Studies', class: 12, marks: 25, time: '30 min', questions: 20, difficulty: 'Easy', type: 'Chapter Test', isFree: true },
  { id: 6, name: 'National Income MCQ Test', subject: 'Economics', class: 12, marks: 20, time: '20 min', questions: 20, difficulty: 'Medium', type: 'MCQ Test', isFree: true },
  { id: 7, name: 'Marketing Case Study Test', subject: 'Business Studies', class: 12, marks: 30, time: '40 min', questions: 10, difficulty: 'Hard', type: 'Case-Study Test', isFree: false },
  { id: 8, name: 'Class 11 Accountancy — Unit Test 1', subject: 'Accountancy', class: 11, marks: 40, time: '1 hr', questions: 35, difficulty: 'Medium', type: 'Unit Test', isFree: false },
  { id: 9, name: 'Class 12 Economics — Full Test Series', subject: 'Economics', class: 12, marks: 80, time: '3 hrs', questions: 60, difficulty: 'Hard', type: 'Subject-Wise Test', isFree: false },
];

const testTypes = ['All', 'Chapter Test', 'Unit Test', 'Full Syllabus Test', 'Pre-Board Test', 'MCQ Test', 'Case-Study Test', 'Subject-Wise Test'];

const pillStyle = (active) => active
  ? { background: 'var(--ink)', color: 'var(--ivory-on-ink)', border: '1px solid var(--ink)' }
  : { background: 'var(--bg-white)', color: 'var(--muted)', border: '1px solid var(--border)' };

function ResultAnalysis({ test, onClose }) {
  const score = 72;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(30,24,18,0.6)', backdropFilter: 'blur(4px)' }}>
      <motion.div
        initial={{ scale: 0.92, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="rounded-2xl p-8 max-w-lg w-full max-h-[90vh] overflow-y-auto"
        style={{ background: 'var(--bg-white)', border: '1px solid var(--border)', boxShadow: '0 24px 64px rgba(30,24,18,0.25)' }}
      >
        <div className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: 'var(--gold)' }}>Sample report preview</div>
        <h3 className="text-xl mb-2" style={{ fontFamily: 'var(--font-serif)', fontWeight: 700, color: 'var(--ink)' }}>Performance Analysis</h3>
        <p className="text-sm mb-6" style={{ color: 'var(--muted)' }}>This preview shows the kind of feedback students can expect when full test attempts go live.</p>
        <div className="grid grid-cols-3 gap-3 mb-6">
          {[
            { value: `${score}%`, label: 'Score', color: 'var(--gold)' },
            { value: Math.floor(score / 100 * test.questions), label: 'Correct', color: 'var(--green)' },
            { value: '82%', label: 'Accuracy', color: 'var(--charcoal)' },
          ].map(s => (
            <div key={s.label} className="rounded-xl p-3 text-center" style={{ background: 'var(--bg-ivory)', border: '1px solid var(--border)' }}>
              <div className="text-xl" style={{ fontFamily: 'var(--font-serif)', fontWeight: 700, color: s.color }}>{s.value}</div>
              <div className="text-xs" style={{ color: 'var(--subtle)' }}>{s.label}</div>
            </div>
          ))}
        </div>
        <div className="space-y-4 mb-6">
          <div>
            <div className="flex items-center gap-2 font-medium text-sm mb-2" style={{ color: 'var(--green)' }}><TrendingUp className="w-4 h-4" /> Strong Topics</div>
            <div className="flex flex-wrap gap-2">{['Core concepts', 'Application questions', 'Definitions'].map(t => <span key={t} className="text-xs px-2 py-1 rounded-full" style={{ background: 'rgba(77,124,15,0.07)', color: 'var(--green)', border: '1px solid rgba(77,124,15,0.25)' }}>{t}</span>)}</div>
          </div>
          <div>
            <div className="flex items-center gap-2 font-medium text-sm mb-2" style={{ color: '#B4533C' }}><AlertTriangle className="w-4 h-4" /> Revision Priority</div>
            <div className="flex flex-wrap gap-2">{['Case-study application', 'Higher-order questions'].map(t => <span key={t} className="text-xs px-2 py-1 rounded-full" style={{ background: 'rgba(180,83,60,0.07)', color: '#B4533C', border: '1px solid rgba(180,83,60,0.25)' }}>{t}</span>)}</div>
          </div>
        </div>
        <button onClick={onClose} className="btn-primary w-full">Close Preview</button>
      </motion.div>
    </div>
  );
}

function TestCard({ test, onComingSoon }) {
  const [showAnalysis, setShowAnalysis] = useState(false);
  const diffColors = { Easy: 'var(--green)', Medium: 'var(--gold)', Hard: '#B4533C' };
  return (
    <>
      {showAnalysis && <ResultAnalysis test={test} onClose={() => setShowAnalysis(false)} />}
      <motion.article whileHover={{ y: -4 }} className="card-paper flex flex-col p-5 relative overflow-hidden">
        {!test.isFree && <div className="absolute top-0 left-0 right-0 h-1" style={{ background: 'linear-gradient(90deg, var(--gold), #e7c66c)' }} />}
        <div className="flex items-start justify-between gap-2 mb-3">
          <div>
            <div className="text-xs mb-1" style={{ color: 'var(--subtle)' }}>{test.subject} · {test.type}</div>
            <h3 className="text-base leading-tight" style={{ fontFamily: 'var(--font-sans)', fontWeight: 700, color: 'var(--ink)' }}>{test.name}</h3>
          </div>
          {test.isFree
            ? <span className="text-xs font-semibold px-2 py-1 rounded-full flex-shrink-0" style={{ background: 'rgba(77,124,15,0.08)', border: '1px solid rgba(77,124,15,0.25)', color: 'var(--green)' }}>FREE</span>
            : <span className="text-xs font-semibold px-2 py-1 rounded-full flex-shrink-0" style={{ background: 'var(--gold-bg)', border: '1px solid rgba(184,135,47,0.25)', color: 'var(--gold)' }}>PRO</span>}
        </div>
        <div className="flex flex-wrap gap-3 text-xs mb-5" style={{ color: 'var(--muted)' }}>
          <span className="flex items-center gap-1"><Award className="w-3 h-3" style={{ color: 'var(--gold)' }} /> {test.marks} marks</span>
          <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {test.time}</span>
          <span className="flex items-center gap-1"><FileText className="w-3 h-3" /> {test.questions} Qs</span>
          <span className="font-medium" style={{ color: diffColors[test.difficulty] }}>{test.difficulty}</span>
        </div>
        <div className="mt-auto flex gap-2">
          <button onClick={() => setShowAnalysis(true)} className="tile-paper flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-medium" style={{ color: 'var(--charcoal)' }}>
            <BarChart2 className="w-3.5 h-3.5" /> Report preview
          </button>
          <button onClick={onComingSoon} className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-xs font-semibold transition-all" style={test.isFree ? { background: 'var(--gold)', border: '1px solid var(--gold)', color: '#fff' } : { background: 'var(--ink)', border: '1px solid var(--ink)', color: '#fff' }}>
            {test.isFree ? <><Play className="w-3.5 h-3.5" /> Try Free</> : <><Lock className="w-3.5 h-3.5" /> Get Access</>}
          </button>
        </div>
      </motion.article>
    </>
  );
}

export default function TestSeries() {
  const [filterType, setFilterType] = useState('All');
  const [filterClass, setFilterClass] = useState('All');
  const [showComingSoon, setShowComingSoon] = useState(false);
  const filtered = tests.filter((t) => (filterType === 'All' || t.type === filterType) && (filterClass === 'All' || t.class === Number(filterClass)));
  const freeCount = tests.filter(t => t.isFree).length;
  const proCount = tests.length - freeCount;

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-ivory)' }}>
      <section className="page-hero overflow-hidden">
        <div className="page-container">
          <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_.9fr] gap-10 items-center">
            <div>
              <span className="eyebrow">CBSE Commerce Test Series</span>
              <h1 className="mt-5 max-w-3xl">Don’t just study. <em>Prove you’re exam-ready.</em></h1>
              <p className="mt-5 text-lg max-w-2xl" style={{ color: 'var(--muted)' }}>Chapter tests, MCQs, case studies, unit tests and full-length papers designed to turn revision into measurable exam practice.</p>
              <div className="flex flex-col sm:flex-row gap-3 mt-7">
                <button onClick={() => document.getElementById('test-library')?.scrollIntoView({ behavior: 'smooth' })} className="btn-primary inline-flex items-center justify-center gap-2"><Play className="w-4 h-4" /> Try {freeCount} free tests</button>
                <Link to="/contact" className="btn-secondary inline-flex items-center justify-center gap-2">Get Pro access <ArrowRight className="w-4 h-4" /></Link>
              </div>
              <div className="flex flex-wrap gap-x-5 gap-y-2 mt-6 text-sm" style={{ color: 'var(--muted)' }}>
                <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4" style={{ color: 'var(--green)' }} /> Class 11 &amp; 12</span>
                <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4" style={{ color: 'var(--green)' }} /> Exam-style practice</span>
                <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4" style={{ color: 'var(--green)' }} /> Performance feedback</span>
              </div>
            </div>

            <div className="card-paper p-6 sm:p-8 relative">
              <div className="absolute -top-3 right-5 text-xs font-bold px-3 py-1 rounded-full" style={{ background: 'var(--gold)', color: '#fff' }}>MOST USEFUL BEFORE EXAMS</div>
              <div className="flex items-center gap-3 mb-5"><div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: 'var(--gold-bg)', color: 'var(--gold)' }}><Target className="w-6 h-6" /></div><div><div className="font-bold" style={{ color: 'var(--ink)' }}>Smit Sir Test Series Pro</div><div className="text-sm" style={{ color: 'var(--muted)' }}>Structured practice, not random questions</div></div></div>
              <div className="space-y-3 mb-6">
                {[
                  `${proCount} Pro test formats in the current library`,
                  'Chapter → unit → full-syllabus progression',
                  'Economics, Business Studies & Accountancy practice',
                  'Case-study, MCQ and board-style question formats',
                  'Performance report preview and revision direction',
                ].map(item => <div key={item} className="flex items-start gap-2 text-sm"><CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: 'var(--green)' }} /><span style={{ color: 'var(--charcoal)' }}>{item}</span></div>)}
              </div>
              <Link to="/contact" className="btn-primary w-full inline-flex items-center justify-center gap-2">Ask for Test Series access <ArrowRight className="w-4 h-4" /></Link>
              <p className="text-xs text-center mt-3" style={{ color: 'var(--subtle)' }}>Access and pricing can be confirmed directly before purchase.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="page-container py-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { icon: BookOpenCheck, value: tests.length, label: 'Test options' },
            { icon: Zap, value: freeCount, label: 'Free starters' },
            { icon: Target, value: '11 & 12', label: 'CBSE classes' },
            { icon: ShieldCheck, value: '3', label: 'Core subjects' },
          ].map(({ icon: Icon, value, label }) => <div key={label} className="card-paper p-4 text-center"><Icon className="w-5 h-5 mx-auto mb-2" style={{ color: 'var(--gold)' }} /><div className="text-2xl font-bold" style={{ fontFamily: 'var(--font-serif)', color: 'var(--ink)' }}>{value}</div><div className="text-xs" style={{ color: 'var(--muted)' }}>{label}</div></div>)}
        </div>
      </section>

      <section className="page-container py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {[
            { icon: Target, title: 'Find your weak chapters', text: 'Stop revising everything equally. Use tests to identify the areas that deserve your next hour.' },
            { icon: Clock, title: 'Build exam speed', text: 'Practise with time limits so marks are not lost simply because the paper could not be completed.' },
            { icon: TrendingUp, title: 'Track improvement', text: 'Move from chapter tests to unit and full papers as your confidence and accuracy improve.' },
          ].map(({ icon: Icon, title, text }) => <article key={title} className="card-paper p-6"><Icon className="w-6 h-6 mb-4" style={{ color: 'var(--gold)' }} /><h2 className="text-xl mb-2" style={{ fontFamily: 'var(--font-serif)', color: 'var(--ink)' }}>{title}</h2><p className="text-sm leading-relaxed" style={{ color: 'var(--muted)' }}>{text}</p></article>)}
        </div>
      </section>

      <main id="test-library" className="page-container section-padding">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-7">
          <div><span className="eyebrow">Choose your challenge</span><h2 className="text-3xl mt-3" style={{ fontFamily: 'var(--font-serif)', color: 'var(--ink)' }}>Test library</h2><p className="text-sm mt-2" style={{ color: 'var(--muted)' }}>Start free. Move to Pro when you want deeper and longer exam practice.</p></div>
          <Link to="/contact" className="inline-flex items-center gap-2 text-sm font-semibold" style={{ color: 'var(--gold)' }}>Need help choosing? Ask Smit Sir <ArrowRight className="w-4 h-4" /></Link>
        </div>

        <div className="flex flex-wrap gap-2 mb-6">{testTypes.map(t => <button key={t} onClick={() => setFilterType(t)} className="px-3 py-1.5 rounded-full text-xs font-medium transition-colors" style={pillStyle(filterType === t)}>{t}</button>)}</div>
        <div className="flex justify-start mb-8"><div className="toggle-paper">{['All', '12', '11'].map(c => <button key={c} onClick={() => setFilterClass(c)} className={filterClass === c ? 'active' : ''}>{c === 'All' ? 'All Classes' : `Class ${c}`}</button>)}</div></div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">{filtered.map(test => <TestCard key={test.id} test={test} onComingSoon={() => setShowComingSoon(true)} />)}</div>
        {filtered.length === 0 && <div className="card-paper p-8 text-center"><Sparkles className="w-7 h-7 mx-auto mb-3" style={{ color: 'var(--gold)' }} /><p style={{ color: 'var(--muted)' }}>No tests match these filters yet. Try another test type or class.</p></div>}
      </main>

      <section className="page-container pb-16">
        <div className="rounded-3xl p-7 sm:p-10 text-center" style={{ background: 'var(--ink)', color: 'var(--ivory-on-ink)' }}>
          <span className="text-xs font-bold uppercase tracking-[.2em]" style={{ color: '#e8c86d' }}>Turn revision into marks</span>
          <h2 className="text-3xl sm:text-4xl mt-4 mb-4" style={{ fontFamily: 'var(--font-serif)' }}>Know exactly what to practise next.</h2>
          <p className="max-w-2xl mx-auto mb-7 text-sm sm:text-base" style={{ color: 'rgba(255,255,255,.72)' }}>Try the free tests first. If the format suits you, contact Smit Sir for access to the complete test-series plan.</p>
          <div className="flex flex-col sm:flex-row justify-center gap-3"><button onClick={() => document.getElementById('test-library')?.scrollIntoView({ behavior: 'smooth' })} className="btn-primary inline-flex items-center justify-center gap-2">Try free tests <Play className="w-4 h-4" /></button><Link to="/contact" className="px-5 py-3 rounded-xl font-semibold inline-flex items-center justify-center gap-2" style={{ background: '#fff', color: 'var(--ink)' }}>Get Pro access <ArrowRight className="w-4 h-4" /></Link></div>
        </div>
      </section>

      <ComingSoonModal visible={showComingSoon} onClose={() => setShowComingSoon(false)} title="Test Attempts Coming Soon" />
    </div>
  );
}
