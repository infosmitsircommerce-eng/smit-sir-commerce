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

function ResultAnalysis({ test, onClose }) {
  const score = Math.floor(Math.random() * 30) + 55;
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-navy-900 border border-navy-700 rounded-2xl p-8 max-w-lg w-full max-h-[90vh] overflow-y-auto"
      >
        <h3 className="font-display font-bold text-xl text-white mb-6">Result Analysis — {test.name}</h3>
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="bg-navy-800 rounded-xl p-3 text-center">
            <div className="text-gold-400 font-bold text-xl">{score}%</div>
            <div className="text-navy-400 text-xs">Score</div>
          </div>
          <div className="bg-navy-800 rounded-xl p-3 text-center">
            <div className="text-emerald-400 font-bold text-xl">{Math.floor(score/100 * test.questions)}</div>
            <div className="text-navy-400 text-xs">Correct</div>
          </div>
          <div className="bg-navy-800 rounded-xl p-3 text-center">
            <div className="text-blue-400 font-bold text-xl">82%</div>
            <div className="text-navy-400 text-xs">Accuracy</div>
          </div>
        </div>

        <div className="space-y-4 mb-6">
          <div>
            <div className="flex items-center gap-2 text-emerald-400 font-medium text-sm mb-2">
              <TrendingUp className="w-4 h-4" /> Strong Topics
            </div>
            <div className="flex flex-wrap gap-2">
              {['Journal Entries', 'Ledger Posting', 'Trial Balance'].map(t => (
                <span key={t} className="bg-emerald-500/10 text-emerald-400 text-xs px-2 py-1 rounded-full border border-emerald-500/30">{t}</span>
              ))}
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2 text-red-400 font-medium text-sm mb-2">
              <AlertTriangle className="w-4 h-4" /> Weak Topics — Needs Revision
            </div>
            <div className="flex flex-wrap gap-2">
              {['Partnership Dissolution', 'Goodwill Valuation'].map(t => (
                <span key={t} className="bg-red-500/10 text-red-400 text-xs px-2 py-1 rounded-full border border-red-500/30">{t}</span>
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
  const diffColors = { Easy: 'text-emerald-400', Medium: 'text-gold-400', Hard: 'text-red-400' };

  return (
    <>
      {showAnalysis && <ResultAnalysis test={test} onClose={() => setShowAnalysis(false)} />}
      <motion.div whileHover={{ y: -3 }} className="card-premium flex flex-col">
        <div className="flex items-start justify-between gap-2 mb-3">
          <div>
            <div className="text-xs text-navy-400 mb-1">{test.type}</div>
            <h3 className="font-semibold text-white text-sm leading-tight">{test.name}</h3>
          </div>
          {test.isFree ? <span className="tag-free flex-shrink-0">Free</span> : <span className="tag-premium flex-shrink-0">Pro</span>}
        </div>

        <div className="flex flex-wrap gap-3 text-xs text-navy-400 mb-4">
          <span className="flex items-center gap-1"><Award className="w-3 h-3 text-gold-400" /> {test.marks} marks</span>
          <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {test.time}</span>
          <span className="flex items-center gap-1"><FileText className="w-3 h-3" /> {test.questions} Qs</span>
          <span className={`font-medium ${diffColors[test.difficulty]}`}>{test.difficulty}</span>
        </div>

        <div className="mt-auto flex gap-2">
          <button
            onClick={() => setShowAnalysis(true)}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-navy-700 hover:bg-navy-600 text-navy-300 hover:text-white text-xs border border-navy-600 transition-colors"
          >
            <BarChart2 className="w-3.5 h-3.5" /> Analysis
          </button>
          <button
            onClick={onComingSoon}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-medium transition-colors ${
              test.isFree
                ? 'bg-gold-500/20 hover:bg-gold-500 text-gold-400 hover:text-navy-950 border border-gold-500/30'
                : 'bg-navy-700 text-navy-400 border border-navy-600'
            }`}>
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
    <div className="min-h-screen bg-navy-950">
      <div className="hero-bg py-16 border-b border-navy-800/50">
        <div className="page-container text-center">
          <div className="section-subheading">Assess &amp; Improve</div>
          <h1 className="section-heading text-4xl md:text-5xl">Test <span className="gradient-text">Series</span></h1>
          <p className="text-navy-400 max-w-xl mx-auto">Chapter tests, unit tests, pre-board tests, and full syllabus tests — with detailed performance analysis.</p>
        </div>
      </div>

      <div className="page-container section-padding">
        <div className="flex flex-wrap gap-2 mb-8">
          {testTypes.map((t) => (
            <button key={t} onClick={() => setFilterType(t)} className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${filterType === t ? 'bg-gold-500 text-navy-950' : 'bg-navy-800 text-navy-400 hover:bg-navy-700'}`}>{t}</button>
          ))}
        </div>

        <div className="flex gap-3 mb-8">
          {['All', '11', '12'].map((c) => (
            <button key={c} onClick={() => setFilterClass(c)} className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${filterClass === c ? 'bg-gold-500 text-navy-950' : 'bg-navy-800 text-navy-300 hover:bg-navy-700'}`}>
              {c === 'All' ? 'All Classes' : `Class ${c}`}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((test) => <TestCard key={test.id} test={test} onComingSoon={() => setShowComingSoon(true)} />)}
        </div>
        <ComingSoonModal visible={showComingSoon} onClose={() => setShowComingSoon(false)} title="Test Coming Soon!" />
      </div>
    </div>
  );
}
