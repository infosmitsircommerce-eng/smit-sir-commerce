import { useState } from 'react';
import { motion } from 'framer-motion';
import { Clock, HelpCircle, BarChart2, Lock, Search, Play, RefreshCw } from 'lucide-react';
import { quizzes, quizCategories, difficultyLevels } from '../data/quizzes';

const difficultyColors = {
  Easy: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/30',
  Medium: 'text-amber-600 bg-amber-50 border-gold-400/30',
  Hard: 'text-red-400 bg-red-400/10 border-red-400/30',
};

function QuizPlayer({ quiz, onClose }) {
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [finished, setFinished] = useState(false);

  const questions = quiz.questionList;
  const q = questions[current];
  const optionLabels = ['A', 'B', 'C', 'D'];

  function handleSelect(idx) {
    if (selected !== null) return;
    setSelected(idx);
  }

  function handleNext() {
    const newAnswers = [...answers, selected];
    if (current + 1 < questions.length) {
      setAnswers(newAnswers);
      setCurrent(current + 1);
      setSelected(null);
    } else {
      setAnswers(newAnswers);
      setFinished(true);
    }
  }

  function handleRestart() {
    setCurrent(0); setSelected(null); setAnswers([]); setFinished(false);
  }

  if (finished) {
    const correct = answers.filter((a, i) => a === questions[i].answer).length;
    const score = Math.round((correct / questions.length) * 100);
    return (
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white border border-gray-200 rounded-2xl p-8 max-w-md w-full">
          <div className="text-center mb-6">
            <div className="text-5xl mb-3">{score >= 80 ? '🏆' : score >= 60 ? '🎯' : '📚'}</div>
            <h3 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: '1.5rem', color: 'var(--ink)' }}>Quiz Complete!</h3>
            <div className={`font-bold text-5xl mt-2 ${score >= 80 ? 'text-emerald-400' : score >= 60 ? 'text-amber-600' : 'text-red-400'}`}>{score}%</div>
          </div>
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-3 text-center">
              <div className="text-emerald-400 font-bold text-2xl">{correct}</div>
              <div className="text-gray-500 text-xs">Correct</div>
            </div>
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3 text-center">
              <div className="text-red-400 font-bold text-2xl">{questions.length - correct}</div>
              <div className="text-gray-500 text-xs">Wrong</div>
            </div>
          </div>
          <div className="bg-gray-100/50 rounded-xl p-3 mb-6 text-sm text-gray-500 text-center">
            {score >= 80 ? 'Excellent work! Keep it up 🌟' : score >= 60 ? 'Good effort! Revise the missed ones.' : 'Need more practice. Revise the chapter.'}
          </div>
          <div className="flex gap-3">
            <button onClick={handleRestart} className="flex-1 btn-navy flex items-center justify-center gap-2"><RefreshCw className="w-4 h-4" /> Try Again</button>
            <button onClick={onClose} className="flex-1 btn-primary">Done</button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white border border-gray-200 rounded-2xl p-6 max-w-lg w-full">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="text-gray-500 text-sm">Question {current + 1} of {questions.length}</div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-900 text-xl">✕</button>
        </div>
        {/* Progress bar */}
        <div className="h-1.5 bg-gray-100 rounded-full mb-6">
          <div className="h-full bg-gold-500 rounded-full transition-all" style={{ width: `${((current + 1) / questions.length) * 100}%` }} />
        </div>
        {/* Question */}
        <h3 className="font-semibold text-base mb-5 leading-relaxed" style={{ color: 'var(--ink)', fontFamily: "'DM Sans', sans-serif" }}>{q.q}</h3>
        {/* Options */}
        <div className="space-y-3 mb-6">
          {q.options.map((opt, idx) => {
            let style = 'bg-gray-100/50 border-gray-200 text-gray-600 hover:border-gold-500/50 hover:text-gray-900 cursor-pointer';
            if (selected !== null) {
              if (idx === q.answer) style = 'bg-emerald-500/20 border-emerald-500 text-emerald-300 cursor-default';
              else if (idx === selected && selected !== q.answer) style = 'bg-red-500/20 border-red-500 text-red-300 cursor-default';
              else style = 'bg-gray-100/30 border-gray-200 text-gray-400 cursor-default';
            }
            return (
              <button key={idx} onClick={() => handleSelect(idx)} className={`w-full flex items-center gap-3 p-3 rounded-xl border text-sm text-left transition-all ${style}`}>
                <span className="w-7 h-7 rounded-lg bg-gray-200/50 flex items-center justify-center font-bold text-xs flex-shrink-0">{optionLabels[idx]}</span>
                {opt}
              </button>
            );
          })}
        </div>
        <button onClick={handleNext} disabled={selected === null} className="btn-primary w-full disabled:opacity-40 disabled:cursor-not-allowed">
          {current + 1 === questions.length ? 'Finish Quiz' : 'Next Question →'}
        </button>
      </motion.div>
    </div>
  );
}

function QuizCard({ quiz }) {
  const [showQuiz, setShowQuiz] = useState(false);
  const hasQuestions = quiz.questionList && quiz.questionList.length > 0;

  return (
    <>
      {showQuiz && hasQuestions && <QuizPlayer quiz={quiz} onClose={() => setShowQuiz(false)} />}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -4, boxShadow: '0 16px 40px rgba(43,33,24,0.12)' }}
        className="card-premium flex flex-col"
      >
        <div className="flex items-start justify-between gap-2 mb-3">
          <div>
            <div className="text-xs mb-1" style={{ color: 'var(--muted)', fontFamily: "'DM Sans', sans-serif" }}>{quiz.subject} · Class {quiz.class}</div>
            <h3 className="font-semibold text-sm leading-tight" style={{ color: 'var(--ink)', fontFamily: "'DM Sans', sans-serif", fontWeight: 600 }}>{quiz.title}</h3>
          </div>
          {quiz.isFree ? <span className="tag-free flex-shrink-0">Free</span> : <span className="tag-premium flex-shrink-0">Pro</span>}
        </div>

        <div className="rounded-lg px-3 py-2 text-xs mb-3" style={{ background: 'var(--bg-ivory)', color: 'var(--muted)', border: '1px solid var(--border-soft)', fontFamily: "'DM Sans', sans-serif" }}>{quiz.chapter}</div>

        <div className="flex flex-wrap gap-2 mb-4">
          <span className={`text-xs px-2 py-1 rounded-full border ${difficultyColors[quiz.difficulty]}`}>
            {quiz.difficulty}
          </span>
          <span className="flex items-center gap-1 text-xs" style={{ color: 'var(--muted)' }}>
            <HelpCircle className="w-3 h-3" /> {quiz.questions} Qs
          </span>
          <span className="flex items-center gap-1 text-xs" style={{ color: 'var(--muted)' }}>
            <Clock className="w-3 h-3" /> {quiz.timeLimit}
          </span>
          <span className="flex items-center gap-1 text-xs" style={{ color: 'var(--muted)' }}>
            <BarChart2 className="w-3 h-3" /> {quiz.attempts} attempts
          </span>
        </div>

        <div className="mt-auto">
          <div className="text-xs rounded-lg px-2 py-1 mb-3" style={{ color: 'var(--subtle)', background: 'var(--bg-ivory)', border: '1px solid var(--border-soft)' }}>{quiz.category}</div>
          <button
            onClick={() => quiz.isFree && setShowQuiz(true)}
            className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium transition-colors ${
              quiz.isFree
                ? 'bg-amber-50 hover:bg-gold-500 text-amber-600 hover:text-navy-950 border border-amber-200'
                : 'bg-gray-200 text-gray-500 cursor-not-allowed border border-gray-300'
            }`}
          >
            {quiz.isFree ? <><Play className="w-4 h-4" /> Start Quiz</> : <><Lock className="w-4 h-4" /> Unlock Quiz</>}
          </button>
        </div>
      </motion.div>
    </>
  );
}

export default function Quizzes() {
  const [search, setSearch] = useState('');
  const [filterClass, setFilterClass] = useState('All');
  const [filterCategory, setFilterCategory] = useState('All');
  const [filterDifficulty, setFilterDifficulty] = useState('All');

  const filtered = quizzes.filter((q) => {
    const matchSearch = q.title.toLowerCase().includes(search.toLowerCase()) || q.subject.toLowerCase().includes(search.toLowerCase());
    const matchClass = filterClass === 'All' || q.class === Number(filterClass);
    const matchCategory = filterCategory === 'All' || q.category === filterCategory;
    const matchDifficulty = filterDifficulty === 'All' || q.difficulty === filterDifficulty;
    return matchSearch && matchClass && matchCategory && matchDifficulty;
  });

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-ivory)' }}>
      <div style={{ background: 'var(--bg-white)', borderBottom: '1px solid var(--border)', padding: '72px 0 56px' }}>
        <div className="page-container text-center">
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'var(--gold-bg)', border: '1px solid rgba(184,135,47,0.22)', borderRadius: '999px', padding: '5px 16px', marginBottom: '20px' }}
          >
            <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: 'var(--gold)' }} />
            <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '11px', fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase', color: 'var(--gold)' }}>Test Your Knowledge</span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 }}
            style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 700, color: 'var(--ink)', letterSpacing: '-0.025em', lineHeight: 1.12, marginBottom: '14px' }}
          >
            Quizzes &amp; <em style={{ fontStyle: 'italic', background: 'linear-gradient(135deg, var(--gold), var(--gold-soft))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Practice</em>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.14 }}
            style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '15px', color: 'var(--muted)', maxWidth: '480px', margin: '0 auto', lineHeight: 1.7 }}
          >
            Chapter-wise quizzes, MCQs, HOTS, case studies, and board exam practice.
          </motion.p>
        </div>
      </div>

      <div className="page-container section-padding">
        {/* Category pills */}
        <div className="flex flex-wrap gap-2 mb-8">
          <button onClick={() => setFilterCategory('All')} className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${filterCategory === 'All' ? 'bg-gold-500 text-navy-950' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}>All</button>
          {quizCategories.map((c) => (
            <button key={c} onClick={() => setFilterCategory(c)} className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${filterCategory === c ? 'bg-gold-500 text-navy-950' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}>{c}</button>
          ))}
        </div>

        <div className="rounded-2xl p-5 mb-8 flex flex-wrap gap-4" style={{ background: 'var(--bg-white)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)' }}>
          <div className="flex-1 min-w-[200px] relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input className="input-field pl-10" placeholder="Search quizzes..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <select value={filterClass} onChange={(e) => setFilterClass(e.target.value)} className="input-field min-w-[140px]">
            <option value="All">All Classes</option>
            <option value="11">Class 11</option>
            <option value="12">Class 12</option>
          </select>
          <select value={filterDifficulty} onChange={(e) => setFilterDifficulty(e.target.value)} className="input-field min-w-[140px]">
            <option value="All">All Difficulty</option>
            {difficultyLevels.map((d) => <option key={d} value={d}>{d}</option>)}
          </select>
        </div>

        <div className="text-gray-500 text-sm mb-5">
          Showing <span className="text-amber-600 font-medium">{filtered.length}</span> quizzes
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filtered.map((quiz) => <QuizCard key={quiz.id} quiz={quiz} />)}
        </div>
      </div>
    </div>
  );
}
