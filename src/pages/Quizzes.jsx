import { useState } from 'react';
import { motion } from 'framer-motion';
import { Clock, HelpCircle, BarChart2, Lock, Search, Play, RefreshCw } from 'lucide-react';
import { quizzes, quizCategories, difficultyLevels } from '../data/quizzes';

const difficultyColors = {
  Easy: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/30',
  Medium: 'text-gold-400 bg-gold-400/10 border-gold-400/30',
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
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-navy-900 border border-navy-700 rounded-2xl p-8 max-w-md w-full">
          <div className="text-center mb-6">
            <div className="text-5xl mb-3">{score >= 80 ? '🏆' : score >= 60 ? '🎯' : '📚'}</div>
            <h3 className="font-display font-bold text-2xl text-white">Quiz Complete!</h3>
            <div className={`font-bold text-5xl mt-2 ${score >= 80 ? 'text-emerald-400' : score >= 60 ? 'text-gold-400' : 'text-red-400'}`}>{score}%</div>
          </div>
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-3 text-center">
              <div className="text-emerald-400 font-bold text-2xl">{correct}</div>
              <div className="text-navy-400 text-xs">Correct</div>
            </div>
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3 text-center">
              <div className="text-red-400 font-bold text-2xl">{questions.length - correct}</div>
              <div className="text-navy-400 text-xs">Wrong</div>
            </div>
          </div>
          <div className="bg-navy-800/50 rounded-xl p-3 mb-6 text-sm text-navy-400 text-center">
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
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-navy-900 border border-navy-700 rounded-2xl p-6 max-w-lg w-full">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="text-navy-400 text-sm">Question {current + 1} of {questions.length}</div>
          <button onClick={onClose} className="text-navy-500 hover:text-white text-xl">✕</button>
        </div>
        {/* Progress bar */}
        <div className="h-1.5 bg-navy-800 rounded-full mb-6">
          <div className="h-full bg-gold-500 rounded-full transition-all" style={{ width: `${((current + 1) / questions.length) * 100}%` }} />
        </div>
        {/* Question */}
        <h3 className="font-semibold text-white text-base mb-5 leading-relaxed">{q.q}</h3>
        {/* Options */}
        <div className="space-y-3 mb-6">
          {q.options.map((opt, idx) => {
            let style = 'bg-navy-800/50 border-navy-700 text-navy-300 hover:border-gold-500/50 hover:text-white cursor-pointer';
            if (selected !== null) {
              if (idx === q.answer) style = 'bg-emerald-500/20 border-emerald-500 text-emerald-300 cursor-default';
              else if (idx === selected && selected !== q.answer) style = 'bg-red-500/20 border-red-500 text-red-300 cursor-default';
              else style = 'bg-navy-800/30 border-navy-800 text-navy-500 cursor-default';
            }
            return (
              <button key={idx} onClick={() => handleSelect(idx)} className={`w-full flex items-center gap-3 p-3 rounded-xl border text-sm text-left transition-all ${style}`}>
                <span className="w-7 h-7 rounded-lg bg-navy-700/50 flex items-center justify-center font-bold text-xs flex-shrink-0">{optionLabels[idx]}</span>
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
      <motion.div whileHover={{ y: -3 }} className="card-premium flex flex-col">
        <div className="flex items-start justify-between gap-2 mb-3">
          <div>
            <div className="text-xs text-navy-400 mb-1">{quiz.subject} · Class {quiz.class}</div>
            <h3 className="font-semibold text-white text-sm leading-tight">{quiz.title}</h3>
          </div>
          {quiz.isFree ? <span className="tag-free flex-shrink-0">Free</span> : <span className="tag-premium flex-shrink-0">Pro</span>}
        </div>

        <div className="bg-navy-800/40 rounded-lg px-3 py-2 text-xs text-navy-400 mb-3">{quiz.chapter}</div>

        <div className="flex flex-wrap gap-2 mb-4">
          <span className={`text-xs px-2 py-1 rounded-full border ${difficultyColors[quiz.difficulty]}`}>
            {quiz.difficulty}
          </span>
          <span className="flex items-center gap-1 text-navy-400 text-xs">
            <HelpCircle className="w-3 h-3" /> {quiz.questions} Qs
          </span>
          <span className="flex items-center gap-1 text-navy-400 text-xs">
            <Clock className="w-3 h-3" /> {quiz.timeLimit}
          </span>
          <span className="flex items-center gap-1 text-navy-400 text-xs">
            <BarChart2 className="w-3 h-3" /> {quiz.attempts} attempts
          </span>
        </div>

        <div className="mt-auto">
          <div className="text-xs text-navy-500 bg-navy-800/40 rounded-lg px-2 py-1 mb-3">{quiz.category}</div>
          <button
            onClick={() => quiz.isFree && setShowQuiz(true)}
            className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium transition-colors ${
              quiz.isFree
                ? 'bg-gold-500/20 hover:bg-gold-500 text-gold-400 hover:text-navy-950 border border-gold-500/30'
                : 'bg-navy-700 text-navy-400 cursor-not-allowed border border-navy-600'
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
    <div className="min-h-screen bg-navy-950">
      <div className="hero-bg py-16 border-b border-navy-800/50">
        <div className="page-container text-center">
          <div className="section-subheading">Test Your Knowledge</div>
          <h1 className="section-heading text-4xl md:text-5xl">Quizzes &amp; <span className="gradient-text">Practice</span></h1>
          <p className="text-navy-400 max-w-xl mx-auto">Chapter-wise quizzes, MCQs, HOTS, case studies, and board exam practice.</p>
        </div>
      </div>

      <div className="page-container section-padding">
        {/* Category pills */}
        <div className="flex flex-wrap gap-2 mb-8">
          <button onClick={() => setFilterCategory('All')} className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${filterCategory === 'All' ? 'bg-gold-500 text-navy-950' : 'bg-navy-800 text-navy-400 hover:bg-navy-700'}`}>All</button>
          {quizCategories.map((c) => (
            <button key={c} onClick={() => setFilterCategory(c)} className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${filterCategory === c ? 'bg-gold-500 text-navy-950' : 'bg-navy-800 text-navy-400 hover:bg-navy-700'}`}>{c}</button>
          ))}
        </div>

        <div className="bg-navy-900/80 border border-navy-700/50 rounded-2xl p-5 mb-8 flex flex-wrap gap-4">
          <div className="flex-1 min-w-[200px] relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-navy-500" />
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

        <div className="text-navy-400 text-sm mb-5">
          Showing <span className="text-gold-400 font-medium">{filtered.length}</span> quizzes
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filtered.map((quiz) => <QuizCard key={quiz.id} quiz={quiz} />)}
        </div>
      </div>
    </div>
  );
}
