import { useState } from 'react';
import { motion } from 'framer-motion';
import { Clock, FileText, BarChart2, Lock, Play, Award, TrendingUp, AlertTriangle } from 'lucide-react';
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
  const score = Math.floor(Math.random() * 30) + 55;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(30,24,18,0.6)', backdropFilter: 'blur(4px)' }}>
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="rounded-2xl p-8 max-w-lg w-full max-h-[90vh] overflow-y-auto"
        style={{ background: 'var(--bg-white)', border: '1px solid var(--border)', boxShadow: '0 24px 64px rgba(30,24,18,0.25)' }}
      >
        <h3 className="text-xl mb-6" style={{ fontFamily: 'var(--font-serif)', fontWeight: 700, color: 'var(--ink)' }}>Result Analysis — {test.name}</h3>
        <div className="grid grid-cols-3 gap-3 mb-6">
          {[
            { value: `${score}%`, label: 'Score',    color: 'var(--gold)'  },
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
            <div className="flex items-center gap-2 font-medium text-sm mb-2" style={{ color: 'var(--green)' }}>
              <TrendingUp className="w-4 h-4" /> Strong Topics
            </div>
            <div className="flex flex-wrap gap-2">
              {['Journal Entries', 'Ledger Posting', 'Trial Balance'].map(t => (
                <span key={t} className="text-xs px-2 py-1 rounded-full" style={{ background: 'rgba(77,124,15,0.07)', color: 'var(--green)', border: '1px solid rgba(77,124,15,0.25)' }}>{t}</span>
              ))}
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2 font-medium text-sm mb-2" style={{ color: '#B4533C' }}>
              <AlertTriangle className="w-4 h-4" /> Weak Topics — Needs Revision
            </div>
            <div className="flex flex-wrap gap-2">
              {['Partnership Dissolution', 'Goodwill Valuation'].map(t => (
                <span key={t} className="text-xs px-2 py-1 rounded-full" style={{ background: 'rgba(180,83,60,0.07)', color: '#B4533C', border: '1px solid rgba(180,83,60,0.25)' }}>{t}</span>
              ))}
            </div>
          </div>
        </div>

        <button onClick={onClose} className="btn-primary w-full">Close Analysis</button>
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
      <motion.div whileHover={{ y: -3 }} className="card-paper flex flex-col p-5">
        <div className="flex items-start justify-between gap-2 mb-3">
          <div>
            <div className="text-xs mb-1" style={{ color: 'var(--subtle)' }}>{test.type}</div>
            <h3 className="text-sm leading-tight" style={{ fontFamily: 'var(--font-sans)', fontWeight: 600, color: 'var(--ink)' }}>{test.name}</h3>
          </div>
          {test.isFree
            ? <span className="text-xs font-semibold px-2 py-0.5 rounded-full flex-shrink-0" style={{ background: 'rgba(77,124,15,0.08)', border: '1px solid rgba(77,124,15,0.25)', color: 'var(--green)' }}>Free</span>
            : <span className="text-xs font-semibold px-2 py-0.5 rounded-full flex-shrink-0" style={{ background: 'var(--gold-bg)', border: '1px solid rgba(184,135,47,0.25)', color: 'var(--gold)' }}>Pro</span>}
        </div>

        <div className="flex flex-wrap gap-3 text-xs mb-4" style={{ color: 'var(--muted)' }}>
          <span className="flex items-center gap-1"><Award className="w-3 h-3" style={{ color: 'var(--gold)' }} /> {test.marks} marks</span>
          <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {test.time}</span>
          <span className="flex items-center gap-1"><FileText className="w-3 h-3" /> {test.questions} Qs</span>
          <span className="font-medium" style={{ color: diffColors[test.difficulty] }}>{test.difficulty}</span>
        </div>

        <div className="mt-auto flex gap-2">
          <button
            onClick={() => setShowAnalysis(true)}
            className="tile-paper flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-medium"
            style={{ color: 'var(--charcoal)' }}
          >
            <BarChart2 className="w-3.5 h-3.5" /> Analysis
          </button>
          <button
            onClick={onComingSoon}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold transition-all"
            style={test.isFree
              ? { background: 'var(--gold-bg)', border: '1px solid rgba(184,135,47,0.3)', color: 'var(--gold)' }
              : { background: 'var(--bg-ivory)', border: '1px solid var(--border)', color: 'var(--subtle)' }}
            onMouseEnter={e => {
              if (test.isFree) { e.currentTarget.style.background = 'var(--gold)'; e.currentTarget.style.color = '#fff'; }
            }}
            onMouseLeave={e => {
              if (test.isFree) { e.currentTarget.style.background = 'var(--gold-bg)'; e.currentTarget.style.color = 'var(--gold)'; }
            }}>
            {test.isFree ? <><Play className="w-3.5 h-3.5" /> Attempt</> : <><Lock className="w-3.5 h-3.5" /> Unlock</>}
          </button>
        </div>
      </motion.div>
    </>
  );
}

export default function TestSeries() {
  const [filterType, setFilterType] = useState('All');
  const [filterClass, setFilterClass] = useState('All');
  const [showComingSoon, setShowComingSoon] = useState(false);

  const filtered = tests.filter((t) => {
    const matchType = filterType === 'All' || t.type === filterType;
    const matchClass = filterClass === 'All' || t.class === Number(filterClass);
    return matchType && matchClass;
  });

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-ivory)' }}>
      <div className="page-hero">
        <div className="page-container text-center">
          <span className="eyebrow">Assess &amp; Improve</span>
          <h1 className="mt-5">Test <em>series.</em></h1>
          <p className="mx-auto">Chapter tests, unit tests, pre-board tests, and full syllabus tests — with detailed performance analysis.</p>
        </div>
      </div>

      <div className="page-container section-padding">
        <div className="flex flex-wrap gap-2 mb-8">
          {testTypes.map((t) => (
            <button key={t} onClick={() => setFilterType(t)} className="px-3 py-1.5 rounded-full text-xs font-medium transition-colors" style={pillStyle(filterType === t)}>{t}</button>
          ))}
        </div>

        <div className="flex justify-start mb-8">
          <div className="toggle-paper">
            {['All', '12', '11'].map((c) => (
              <button key={c} onClick={() => setFilterClass(c)} className={filterClass === c ? 'active' : ''}>
                {c === 'All' ? 'All Classes' : `Class ${c}`}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((test) => <TestCard key={test.id} test={test} onComingSoon={() => setShowComingSoon(true)} />)}
        </div>
        <ComingSoonModal visible={showComingSoon} onClose={() => setShowComingSoon(false)} title="Test Coming Soon!" />
      </div>
    </div>
  );
}
