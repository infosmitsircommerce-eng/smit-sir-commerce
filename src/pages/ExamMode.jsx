import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  AlarmClock, ArrowLeft, ArrowRight, BarChart3, BookmarkCheck, CheckCircle2, Clock3,
  Crown, Expand, Flag, ListChecks, Lock, Play, RotateCcw, Search, ShieldCheck, Target,
  TimerReset, Trophy, XCircle
} from 'lucide-react';
import SEO from '../components/ui/SEO';
import { examTests } from '../data/examBank';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { trackEvent } from '../lib/analytics';

const EXAM_ATTEMPTS_KEY = 'ssc-exam-attempts-v1';
const MISTAKE_KEY = 'ssc-mistake-book-v1';
const RESUME_PREFIX = 'ssc-exam-resume-v1';

function safeRead(key, fallback = []) {
  try { return JSON.parse(localStorage.getItem(key) || JSON.stringify(fallback)); } catch { return fallback; }
}
function safeWrite(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* ignore */ }
}
function formatTime(seconds) {
  const m = Math.max(0, Math.floor(seconds / 60));
  const s = Math.max(0, seconds % 60);
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}
function initials(name = 'Student') {
  return name.trim().split(/\s+/).map((part) => part[0]).join('').toUpperCase().slice(0, 2) || 'ST';
}
function normalizeCustomTest(row) {
  const p = row?.payload || {};
  if (!p?.name || !Array.isArray(p?.questions) || p.questions.length < 1) return null;
  return {
    id: row.slug || row.id,
    slug: row.slug || row.id,
    name: p.name,
    subject: p.subject || 'Commerce',
    classLevel: Number(p.classLevel || 12),
    chapter: p.chapter || 'Custom Test',
    minutes: Number(p.minutes || 20),
    difficulty: p.difficulty || 'Medium',
    isFree: p.isFree !== false,
    board: p.board || 'CBSE',
    questions: p.questions.map((question, index) => ({
      id: question.id || `custom-${index + 1}`,
      topic: question.topic || p.chapter || p.subject || 'Commerce',
      question: question.question,
      options: question.options || [],
      answer: Number(question.answer || 0),
      explanation: question.explanation || 'Review the underlying concept and try again.',
    })).filter((question) => question.question && question.options.length >= 2),
  };
}
function mergeMistakes(test, answers) {
  const existing = safeRead(MISTAKE_KEY, []);
  const byId = new Map(existing.map((item) => [item.id, item]));
  test.questions.forEach((question, index) => {
    if (answers[index] === question.answer) return;
    const id = `exam-${test.id}-${question.id}`;
    const old = byId.get(id);
    byId.set(id, {
      id,
      subject: test.subject,
      topic: question.topic || test.chapter,
      question: question.question,
      options: question.options,
      answer: question.answer,
      explanation: question.explanation,
      source: 'Exam Mode',
      timesWrong: (old?.timesWrong || 0) + 1,
      lastWrongAt: new Date().toISOString(),
      mastered: false,
    });
  });
  safeWrite(MISTAKE_KEY, [...byId.values()].sort((a, b) => (b.timesWrong || 0) - (a.timesWrong || 0)).slice(0, 500));
}
function buildResult(test, answers, secondsByQuestion) {
  let score = 0;
  const topicMap = new Map();
  test.questions.forEach((question, index) => {
    const correct = answers[index] === question.answer;
    if (correct) score += 1;
    const topic = question.topic || test.chapter;
    const current = topicMap.get(topic) || { correct: 0, total: 0, subject: test.subject };
    current.total += 1;
    if (correct) current.correct += 1;
    topicMap.set(topic, current);
  });
  const topicStats = Object.fromEntries([...topicMap.entries()]);
  const percentage = Math.round((score / test.questions.length) * 100);
  return { score, percentage, topicStats, secondsByQuestion };
}

function Library({ tests, onStart }) {
  const [classLevel, setClassLevel] = useState('all');
  const [subject, setSubject] = useState('all');
  const [difficulty, setDifficulty] = useState('all');
  const [access, setAccess] = useState('all');
  const [query, setQuery] = useState('');
  const subjects = [...new Set(tests.map((item) => item.subject))].sort();
  const filtered = tests.filter((item) => {
    if (classLevel !== 'all' && String(item.classLevel) !== classLevel) return false;
    if (subject !== 'all' && item.subject !== subject) return false;
    if (difficulty !== 'all' && item.difficulty !== difficulty) return false;
    if (access === 'free' && !item.isFree) return false;
    if (access === 'pro' && item.isFree) return false;
    const haystack = `${item.name} ${item.subject} ${item.chapter} ${item.questions.map((q) => `${q.topic} ${q.question}`).join(' ')}`.toLowerCase();
    return !query.trim() || haystack.includes(query.trim().toLowerCase());
  });

  return (
    <>
      <section className="page-hero">
        <div className="page-container text-center max-w-4xl">
          <span className="eyebrow">Advanced Exam Mode</span>
          <h1 className="mt-5">Practise like the <em>real exam.</em></h1>
          <p className="mt-5 text-lg leading-relaxed" style={{ color: 'var(--muted)' }}>Timed tests, question palette, mark-for-review, refresh recovery, auto-submit, per-question timing, weak-topic analysis and automatic Mistake Book integration.</p>
          <div className="mt-6 flex flex-wrap justify-center gap-2 text-xs font-semibold" style={{ color: 'var(--muted)' }}>
            <span className="tile-paper px-3 py-2">{tests.length} exam sets</span>
            <span className="tile-paper px-3 py-2">{tests.reduce((sum, item) => sum + item.questions.length, 0)} exam questions</span>
            <span className="tile-paper px-3 py-2">Class 11 + 12</span>
          </div>
        </div>
      </section>

      <main className="page-container section-padding">
        <section className="card-paper p-4 sm:p-5">
          <div className="grid md:grid-cols-[1fr_repeat(4,minmax(0,145px))] gap-3">
            <label className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--muted)' }} />
              <input value={query} onChange={(e) => setQuery(e.target.value)} className="input-field pl-10" placeholder="Search chapter, topic or question…" aria-label="Search exam tests" />
            </label>
            <select className="input-field" value={classLevel} onChange={(e) => setClassLevel(e.target.value)} aria-label="Filter by class"><option value="all">All classes</option><option value="11">Class 11</option><option value="12">Class 12</option></select>
            <select className="input-field" value={subject} onChange={(e) => setSubject(e.target.value)} aria-label="Filter by subject"><option value="all">All subjects</option>{subjects.map((item) => <option key={item}>{item}</option>)}</select>
            <select className="input-field" value={difficulty} onChange={(e) => setDifficulty(e.target.value)} aria-label="Filter by difficulty"><option value="all">All difficulty</option><option>Easy</option><option>Medium</option><option>Hard</option></select>
            <select className="input-field" value={access} onChange={(e) => setAccess(e.target.value)} aria-label="Filter by access"><option value="all">Free + Pro</option><option value="free">Free</option><option value="pro">Pro</option></select>
          </div>
          <div className="text-xs mt-3" style={{ color: 'var(--muted)' }}>{filtered.length} matching exam{filtered.length === 1 ? '' : 's'}</div>
        </section>

        {filtered.length === 0 ? (
          <section className="card-paper p-10 text-center mt-6"><ListChecks className="w-10 h-10 mx-auto" style={{ color: 'var(--gold)' }} /><h2 className="text-2xl mt-4" style={{ fontFamily: 'var(--font-serif)', color: 'var(--ink)' }}>No matching tests</h2><p className="mt-2 text-sm" style={{ color: 'var(--muted)' }}>Clear a filter or search a broader topic.</p></section>
        ) : (
          <section className="grid md:grid-cols-2 xl:grid-cols-3 gap-5 mt-6">
            {filtered.map((item) => (
              <article key={item.id} className="card-paper p-5 flex flex-col">
                <div className="flex items-start justify-between gap-3"><div className="text-xs font-bold" style={{ color: 'var(--gold)' }}>Class {item.classLevel} · {item.subject}</div>{item.isFree ? <span className="text-xs font-bold" style={{ color: 'var(--green)' }}>FREE</span> : <span className="text-xs font-bold inline-flex items-center gap-1"><Crown className="w-3.5 h-3.5" style={{ color: 'var(--gold)' }} /> PRO</span>}</div>
                <h2 className="text-xl mt-3" style={{ fontFamily: 'var(--font-serif)', color: 'var(--ink)' }}>{item.name}</h2>
                <p className="text-sm mt-2 flex-1" style={{ color: 'var(--muted)' }}>{item.chapter}</p>
                <div className="grid grid-cols-3 gap-2 mt-5 text-center text-xs">
                  <div className="tile-paper p-2"><strong className="block" style={{ color: 'var(--ink)' }}>{item.questions.length}</strong><span style={{ color: 'var(--muted)' }}>Questions</span></div>
                  <div className="tile-paper p-2"><strong className="block" style={{ color: 'var(--ink)' }}>{item.minutes}m</strong><span style={{ color: 'var(--muted)' }}>Timer</span></div>
                  <div className="tile-paper p-2"><strong className="block" style={{ color: 'var(--ink)' }}>{item.difficulty}</strong><span style={{ color: 'var(--muted)' }}>Level</span></div>
                </div>
                <button onClick={() => onStart(item)} className="btn-primary mt-5 w-full inline-flex items-center justify-center gap-2"><Play className="w-4 h-4" /> Start Exam</button>
                <Link to={`/tests/${item.slug}`} className="text-center text-xs font-semibold mt-3" style={{ color: 'var(--gold)' }}>View test details</Link>
              </article>
            ))}
          </section>
        )}
      </main>
    </>
  );
}

export default function ExamMode() {
  const { user, isPremium, displayName } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [customTests, setCustomTests] = useState([]);
  const [customLoadState, setCustomLoadState] = useState('loading');
  const [active, setActive] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [marked, setMarked] = useState([]);
  const [current, setCurrent] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [secondsByQuestion, setSecondsByQuestion] = useState([]);
  const [startedAt, setStartedAt] = useState(null);
  const [result, setResult] = useState(null);
  const [confirmSubmit, setConfirmSubmit] = useState(false);
  const [accessMessage, setAccessMessage] = useState(null);
  const questionEnteredAt = useRef(Date.now());
  const autoSubmittedRef = useRef(false);

  const allTests = useMemo(() => [...examTests, ...customTests], [customTests]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const response = await supabase.from('content_items').select('id,slug,payload').eq('type', 'test').eq('status', 'published').limit(100);
      if (cancelled) return;
      if (response.error) { setCustomLoadState('unavailable'); setCustomTests([]); return; }
      setCustomTests((response.data || []).map(normalizeCustomTest).filter(Boolean));
      setCustomLoadState('ready');
    })();
    return () => { cancelled = true; };
  }, []);

  const saveQuestionTime = (index) => {
    const elapsed = Math.max(0, Math.round((Date.now() - questionEnteredAt.current) / 1000));
    setSecondsByQuestion((previous) => previous.map((value, i) => i === index ? value + elapsed : value));
    questionEnteredAt.current = Date.now();
  };

  const start = (test, forceQuestions = null) => {
    if (!test.isFree && !user) { setAccessMessage('Login first to use this Pro exam.'); return; }
    if (!test.isFree && !isPremium) { setAccessMessage('This exam is part of Pro access.'); return; }
    const working = forceQuestions ? { ...test, questions: forceQuestions } : test;
    const resumeKey = `${RESUME_PREFIX}:${user?.id || 'guest'}:${working.id}`;
    const saved = safeRead(resumeKey, null);
    const canResume = saved && !forceQuestions && saved.answers?.length === working.questions.length && saved.secondsLeft > 0 && !saved.submitted;
    setActive(working);
    setAnswers(canResume ? saved.answers : Array(working.questions.length).fill(null));
    setMarked(canResume ? saved.marked : Array(working.questions.length).fill(false));
    setCurrent(canResume ? Math.min(saved.current || 0, working.questions.length - 1) : 0);
    setSecondsLeft(canResume ? saved.secondsLeft : working.minutes * 60);
    setSecondsByQuestion(canResume ? saved.secondsByQuestion || Array(working.questions.length).fill(0) : Array(working.questions.length).fill(0));
    setStartedAt(canResume ? saved.startedAt : new Date().toISOString());
    setResult(null);
    setConfirmSubmit(false);
    autoSubmittedRef.current = false;
    questionEnteredAt.current = Date.now();
    setSearchParams({ test: test.slug });
    trackEvent('exam_start', { test: test.slug, subject: test.subject, classLevel: test.classLevel, resumed: Boolean(canResume) }, user?.id || null);
  };

  useEffect(() => {
    const slug = searchParams.get('test');
    if (!slug || active) return;
    const found = allTests.find((item) => item.slug === slug);
    if (found) start(found);
  }, [allTests.length, searchParams.get('test')]);

  useEffect(() => {
    if (!active || result) return undefined;
    const timer = window.setInterval(() => setSecondsLeft((value) => Math.max(0, value - 1)), 1000);
    return () => window.clearInterval(timer);
  }, [active?.id, result]);

  useEffect(() => {
    if (!active || result || secondsLeft !== 0 || autoSubmittedRef.current) return;
    autoSubmittedRef.current = true;
    submit(true);
  }, [secondsLeft, active?.id, result]);

  useEffect(() => {
    if (!active || result) return;
    const key = `${RESUME_PREFIX}:${user?.id || 'guest'}:${active.id}`;
    safeWrite(key, { answers, marked, current, secondsLeft, secondsByQuestion, startedAt, submitted: false });
  }, [answers, marked, current, secondsLeft, secondsByQuestion, active?.id, result, user?.id]);

  useEffect(() => {
    if (!active || result) return undefined;
    const onKey = (event) => {
      if (event.target?.matches?.('input,textarea,select')) return;
      if (['1','2','3','4'].includes(event.key)) {
        const option = Number(event.key) - 1;
        if (option < active.questions[current].options.length) setAnswers((previous) => previous.map((value, i) => i === current ? option : value));
      } else if (event.key === 'ArrowRight' || event.key.toLowerCase() === 'n') {
        event.preventDefault();
        if (current < active.questions.length - 1) { saveQuestionTime(current); setCurrent((value) => value + 1); }
      } else if (event.key === 'ArrowLeft' || event.key.toLowerCase() === 'p') {
        event.preventDefault();
        if (current > 0) { saveQuestionTime(current); setCurrent((value) => value - 1); }
      } else if (event.key.toLowerCase() === 'r') {
        setMarked((previous) => previous.map((value, i) => i === current ? !value : value));
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [active?.id, current, result]);

  async function submit(auto = false) {
    if (!active || result) return;
    saveQuestionTime(current);
    const finalTimes = secondsByQuestion.map((value, index) => value + (index === current ? Math.max(0, Math.round((Date.now() - questionEnteredAt.current) / 1000)) : 0));
    const built = buildResult(active, answers, finalTimes);
    setResult(built);
    setConfirmSubmit(false);
    mergeMistakes(active, answers);
    const attempt = {
      id: `${Date.now()}-${active.id}`,
      testId: active.id,
      testName: active.name,
      subject: active.subject,
      classLevel: active.classLevel,
      chapter: active.chapter,
      score: built.score,
      total: active.questions.length,
      percentage: built.percentage,
      topicStats: built.topicStats,
      secondsByQuestion: finalTimes,
      startedAt,
      createdAt: new Date().toISOString(),
      autoSubmitted: auto,
    };
    safeWrite(EXAM_ATTEMPTS_KEY, [attempt, ...safeRead(EXAM_ATTEMPTS_KEY, [])].slice(0, 250));
    safeWrite(`${RESUME_PREFIX}:${user?.id || 'guest'}:${active.id}`, { submitted: true });
    trackEvent('exam_complete', { test: active.slug, subject: active.subject, percentage: built.percentage, autoSubmitted: auto }, user?.id || null);
    if (user) {
      await supabase.from('test_attempts').insert({
        user_id: user.id,
        student_label: initials(displayName),
        test_name: active.name,
        subject: active.subject,
        score: built.score,
        total_questions: active.questions.length,
        percentage: built.percentage,
        created_at: attempt.createdAt,
      });
    }
  }

  if (!active) {
    return <div className="min-h-screen" style={{ background: 'var(--bg-ivory)' }}><SEO title="Advanced CBSE Commerce Exam Mode" description="Timed CBSE Commerce exam practice with question palette, mark-for-review, auto-submit, refresh recovery and weak-topic analysis." path="/exam-mode" /><Library tests={allTests} onStart={start} />{customLoadState === 'unavailable' && <div className="page-container pb-8 text-xs text-center" style={{ color: 'var(--muted)' }}>Built-in exam bank is ready. Admin-published tests will appear automatically after the content database table is enabled.</div>}{accessMessage && <div className="fixed inset-0 z-[180] bg-black/60 flex items-center justify-center p-4"><div className="card-paper max-w-sm w-full p-6 text-center"><Lock className="w-8 h-8 mx-auto" style={{ color: 'var(--gold)' }} /><h2 className="text-2xl mt-4" style={{ fontFamily: 'var(--font-serif)', color: 'var(--ink)' }}>Access required</h2><p className="mt-3 text-sm" style={{ color: 'var(--muted)' }}>{accessMessage}</p><div className="grid gap-2 mt-5">{!user ? <Link to="/login" className="btn-primary">Login / Create account</Link> : <Link to="/contact" className="btn-primary">Ask for Pro access</Link>}<button onClick={() => setAccessMessage(null)} className="btn-secondary">Close</button></div></div></div>}</div>;
  }

  if (result) {
    const weakTopics = Object.entries(result.topicStats).map(([topic, stat]) => ({ topic, ...stat, accuracy: Math.round((stat.correct / stat.total) * 100) })).sort((a, b) => a.accuracy - b.accuracy);
    const wrongQuestions = active.questions.filter((question, index) => answers[index] !== question.answer);
    return (
      <div className="min-h-screen py-6 sm:py-10" style={{ background: 'var(--bg-ivory)' }}>
        <SEO title={`${active.name} Result`} description="Private exam result." path="/exam-mode" noindex />
        <main className="page-container max-w-6xl">
          <section className="card-paper p-5 sm:p-8 text-center">
            <Trophy className="w-12 h-12 mx-auto" style={{ color: 'var(--gold)' }} />
            <span className="eyebrow mt-4 inline-block">Exam completed</span>
            <h1 className="text-3xl sm:text-4xl mt-3" style={{ fontFamily: 'var(--font-serif)', color: 'var(--ink)' }}>{active.name}</h1>
            <div className="text-6xl font-black mt-6" style={{ color: result.percentage >= 80 ? 'var(--green)' : 'var(--gold)' }}>{result.percentage}%</div>
            <p className="mt-2" style={{ color: 'var(--muted)' }}>{result.score}/{active.questions.length} correct · Wrong answers added to Mistake Book</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-7 text-sm">
              <div className="tile-paper p-4"><strong className="text-xl block" style={{ color: 'var(--ink)' }}>{result.score}</strong>Correct</div>
              <div className="tile-paper p-4"><strong className="text-xl block" style={{ color: 'var(--ink)' }}>{wrongQuestions.length}</strong>Wrong / skipped</div>
              <div className="tile-paper p-4"><strong className="text-xl block" style={{ color: 'var(--ink)' }}>{marked.filter(Boolean).length}</strong>Marked review</div>
              <div className="tile-paper p-4"><strong className="text-xl block" style={{ color: 'var(--ink)' }}>{Math.round(result.secondsByQuestion.reduce((a, b) => a + b, 0) / Math.max(1, active.questions.length))}s</strong>Avg/question</div>
            </div>
          </section>

          <div className="grid lg:grid-cols-[.8fr_1.2fr] gap-6 mt-6">
            <section className="card-paper p-5 sm:p-6">
              <h2 className="text-2xl flex items-center gap-2" style={{ fontFamily: 'var(--font-serif)', color: 'var(--ink)' }}><Target className="w-6 h-6" style={{ color: 'var(--gold)' }} /> Topic analysis</h2>
              <div className="space-y-3 mt-5">{weakTopics.map((item) => <div key={item.topic} className="tile-paper p-4"><div className="flex justify-between gap-3"><strong style={{ color: 'var(--ink)' }}>{item.topic}</strong><strong style={{ color: item.accuracy >= 80 ? 'var(--green)' : '#B4533C' }}>{item.accuracy}%</strong></div><div className="h-2 rounded-full mt-3 overflow-hidden" style={{ background: 'var(--border-soft)' }}><div className="h-full rounded-full" style={{ width: `${item.accuracy}%`, background: item.accuracy >= 80 ? 'var(--green)' : 'var(--gold)' }} /></div><div className="text-xs mt-2" style={{ color: 'var(--muted)' }}>{item.correct}/{item.total} correct</div></div>)}</div>
              <div className="grid gap-2 mt-5">
                {wrongQuestions.length > 0 && <button onClick={() => start(active, wrongQuestions)} className="btn-primary inline-flex items-center justify-center gap-2"><RotateCcw className="w-4 h-4" /> Retake wrong questions</button>}
                {weakTopics.length > 0 && <button onClick={() => { const weakSet = new Set(weakTopics.filter((item) => item.accuracy < 80).map((item) => item.topic)); const weakQuestions = active.questions.filter((q) => weakSet.has(q.topic || active.chapter)); if (weakQuestions.length) start(active, weakQuestions); }} className="btn-secondary inline-flex items-center justify-center gap-2"><Target className="w-4 h-4" /> Practise weak topics</button>}
                <Link to="/study-coach" className="btn-secondary inline-flex items-center justify-center gap-2"><BarChart3 className="w-4 h-4" /> Open Study Coach</Link>
                <Link to="/daily-practice" className="btn-secondary inline-flex items-center justify-center gap-2"><BookmarkCheck className="w-4 h-4" /> Review Mistake Book</Link>
                <button onClick={() => { setActive(null); setResult(null); setSearchParams({}); }} className="btn-secondary">Back to exam library</button>
              </div>
            </section>

            <section className="card-paper p-5 sm:p-6">
              <h2 className="text-2xl" style={{ fontFamily: 'var(--font-serif)', color: 'var(--ink)' }}>Question review</h2>
              <div className="space-y-4 mt-5 max-h-[720px] overflow-y-auto pr-1">
                {active.questions.map((question, index) => {
                  const correct = answers[index] === question.answer;
                  return <article key={question.id} className="tile-paper p-4"><div className="flex items-start gap-3"><span className="mt-0.5">{correct ? <CheckCircle2 className="w-5 h-5" style={{ color: 'var(--green)' }} /> : <XCircle className="w-5 h-5" style={{ color: '#B4533C' }} />}</span><div className="flex-1"><div className="font-semibold" style={{ color: 'var(--ink)' }}>{index + 1}. {question.question}</div><div className="text-sm mt-2" style={{ color: correct ? 'var(--green)' : '#B4533C' }}>Your answer: {answers[index] == null ? 'Not answered' : question.options[answers[index]]}</div><div className="text-sm mt-1" style={{ color: 'var(--muted)' }}>Correct answer: {question.options[question.answer]}</div><p className="text-sm mt-2 leading-relaxed" style={{ color: 'var(--muted)' }}>{question.explanation}</p><div className="text-xs mt-2" style={{ color: 'var(--subtle)' }}>Time: {result.secondsByQuestion[index] || 0}s · {question.topic}</div></div></div></article>;
                })}
              </div>
            </section>
          </div>
        </main>
      </div>
    );
  }

  const question = active.questions[current];
  const answeredCount = answers.filter((value) => value !== null).length;
  const unanswered = active.questions.length - answeredCount;
  const go = (index) => { saveQuestionTime(current); setCurrent(index); };
  const urgent = secondsLeft <= 120;

  return (
    <div className="min-h-[100dvh]" style={{ background: '#F7F8FC' }}>
      <SEO title={`${active.name} — Exam Mode`} description="Private timed exam attempt." path="/exam-mode" noindex />
      <header className="sticky top-0 z-50 bg-white border-b" style={{ borderColor: 'var(--border)' }}>
        <div className="max-w-[1500px] mx-auto px-3 sm:px-5 h-16 flex items-center gap-3">
          <button onClick={() => setConfirmSubmit(true)} className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'var(--bg-ivory)' }} aria-label="Exit or submit exam"><ArrowLeft className="w-5 h-5" /></button>
          <div className="min-w-0 flex-1"><div className="font-bold text-sm truncate" style={{ color: 'var(--ink)' }}>{active.name}</div><div className="text-[11px]" style={{ color: 'var(--muted)' }}>Q {current + 1}/{active.questions.length} · {answeredCount} answered · {unanswered} unanswered</div></div>
          <button onClick={() => document.documentElement.requestFullscreen?.()} className="hidden sm:flex w-10 h-10 rounded-xl items-center justify-center" style={{ background: 'var(--bg-ivory)' }} title="Full screen"><Expand className="w-4 h-4" /></button>
          <div className="rounded-xl px-3 py-2 flex items-center gap-2 font-black tabular-nums" style={{ background: urgent ? 'rgba(180,83,60,.08)' : 'var(--gold-bg)', color: urgent ? '#B4533C' : 'var(--gold)' }} aria-live="polite"><AlarmClock className="w-4 h-4" /> {formatTime(secondsLeft)}</div>
        </div>
      </header>

      <main className="max-w-[1500px] mx-auto p-3 sm:p-5 grid lg:grid-cols-[minmax(0,1fr)_330px] gap-5 pb-24">
        <section className="card-paper p-5 sm:p-8 min-h-[560px] flex flex-col">
          <div className="flex flex-wrap items-center gap-2 text-xs"><span className="eyebrow">Question {current + 1}</span><span className="rounded-full px-2.5 py-1" style={{ background: 'var(--bg-ivory)', color: 'var(--muted)' }}>{question.topic}</span>{marked[current] && <span className="rounded-full px-2.5 py-1 inline-flex items-center gap-1" style={{ background: 'rgba(184,135,47,.1)', color: 'var(--gold)' }}><Flag className="w-3 h-3" /> Review</span>}</div>
          <h1 className="text-xl sm:text-2xl leading-relaxed mt-5" style={{ fontFamily: 'var(--font-serif)', color: 'var(--ink)' }}>{question.question}</h1>
          <div className="grid gap-3 mt-7" role="radiogroup" aria-label={`Question ${current + 1} options`}>
            {question.options.map((option, index) => {
              const selected = answers[current] === index;
              return <button key={option} onClick={() => setAnswers((previous) => previous.map((value, i) => i === current ? index : value))} role="radio" aria-checked={selected} className="text-left rounded-2xl p-4 sm:p-5 flex items-start gap-3 transition-all" style={{ background: selected ? 'var(--gold-bg)' : 'var(--bg-white)', border: `1.5px solid ${selected ? 'rgba(184,135,47,.48)' : 'var(--border)'}`, color: 'var(--charcoal)' }}><span className="w-8 h-8 rounded-full flex items-center justify-center font-black text-sm flex-shrink-0" style={{ background: selected ? 'var(--gold)' : 'var(--bg-ivory)', color: selected ? '#fff' : 'var(--muted)' }}>{String.fromCharCode(65 + index)}</span><span className="pt-1 leading-relaxed">{option}</span></button>;
            })}
          </div>
          <div className="mt-auto pt-8 flex flex-wrap items-center gap-2 border-t" style={{ borderColor: 'var(--border-soft)' }}>
            <button disabled={current === 0} onClick={() => current > 0 && go(current - 1)} className="btn-secondary disabled:opacity-40 inline-flex items-center gap-2"><ArrowLeft className="w-4 h-4" /> Previous</button>
            <button onClick={() => setMarked((previous) => previous.map((value, i) => i === current ? !value : value))} className="btn-secondary inline-flex items-center gap-2"><Flag className="w-4 h-4" /> {marked[current] ? 'Unmark review' : 'Mark for review'}</button>
            {answers[current] !== null && <button onClick={() => setAnswers((previous) => previous.map((value, i) => i === current ? null : value))} className="btn-secondary">Clear answer</button>}
            <div className="flex-1" />
            {current < active.questions.length - 1 ? <button onClick={() => go(current + 1)} className="btn-primary inline-flex items-center gap-2">Save & Next <ArrowRight className="w-4 h-4" /></button> : <button onClick={() => setConfirmSubmit(true)} className="btn-primary inline-flex items-center gap-2"><ShieldCheck className="w-4 h-4" /> Review & Submit</button>}
          </div>
          <div className="text-[11px] mt-4" style={{ color: 'var(--subtle)' }}>Keyboard: 1–4 answer · ←/P previous · →/N next · R mark for review</div>
        </section>

        <aside className="card-paper p-4 sm:p-5 lg:sticky lg:top-20 lg:self-start">
          <div className="flex items-center justify-between"><h2 className="font-bold" style={{ color: 'var(--ink)' }}>Question palette</h2><TimerReset className="w-5 h-5" style={{ color: 'var(--gold)' }} /></div>
          <div className="grid grid-cols-5 gap-2 mt-4">{active.questions.map((item, index) => {
            const isCurrent = index === current;
            const answered = answers[index] !== null;
            const review = marked[index];
            let bg = 'var(--bg-ivory)'; let color = 'var(--muted)'; let border = 'var(--border)';
            if (answered) { bg = 'rgba(77,124,15,.1)'; color = 'var(--green)'; border = 'rgba(77,124,15,.25)'; }
            if (review) { bg = 'var(--gold-bg)'; color = 'var(--gold)'; border = 'rgba(184,135,47,.3)'; }
            if (answered && review) { bg = 'linear-gradient(135deg, rgba(77,124,15,.1), rgba(184,135,47,.12))'; }
            return <button key={item.id} onClick={() => go(index)} className="aspect-square rounded-xl text-sm font-black relative" aria-label={`Go to question ${index + 1}`} aria-current={isCurrent ? 'step' : undefined} style={{ background: bg, color, border: `2px solid ${isCurrent ? 'var(--ink)' : border}` }}>{index + 1}{review && <span className="absolute -right-1 -top-1 w-2.5 h-2.5 rounded-full" style={{ background: 'var(--gold)' }} />}</button>;
          })}</div>
          <div className="grid grid-cols-2 gap-2 mt-5 text-xs">
            <div className="tile-paper p-3"><strong className="text-lg block" style={{ color: 'var(--green)' }}>{answeredCount}</strong>Answered</div>
            <div className="tile-paper p-3"><strong className="text-lg block" style={{ color: '#B4533C' }}>{unanswered}</strong>Unanswered</div>
            <div className="tile-paper p-3"><strong className="text-lg block" style={{ color: 'var(--gold)' }}>{marked.filter(Boolean).length}</strong>Review</div>
            <div className="tile-paper p-3"><strong className="text-lg block" style={{ color: 'var(--ink)' }}>{active.questions.length}</strong>Total</div>
          </div>
          <button onClick={() => setConfirmSubmit(true)} className="btn-primary w-full mt-5">Submit exam</button>
          <div className="mt-4 rounded-xl p-3 text-xs leading-relaxed" style={{ background: 'var(--bg-ivory)', color: 'var(--muted)' }}><Clock3 className="w-4 h-4 inline mr-1" /> Progress is automatically saved on this device. Refreshing the page can resume the attempt while time remains.</div>
        </aside>
      </main>

      {confirmSubmit && <div className="fixed inset-0 z-[190] bg-black/60 flex items-center justify-center p-4"><div className="card-paper max-w-md w-full p-6"><ShieldCheck className="w-9 h-9" style={{ color: 'var(--gold)' }} /><h2 className="text-2xl mt-4" style={{ fontFamily: 'var(--font-serif)', color: 'var(--ink)' }}>Submit this exam?</h2><p className="text-sm mt-3" style={{ color: 'var(--muted)' }}>You answered <strong>{answeredCount}</strong> of {active.questions.length}. {unanswered > 0 ? `${unanswered} question${unanswered === 1 ? ' is' : 's are'} still unanswered.` : 'All questions have an answer.'}</p><div className="grid gap-2 mt-6"><button onClick={() => submit(false)} className="btn-primary">Submit and see analysis</button><button onClick={() => setConfirmSubmit(false)} className="btn-secondary">Continue exam</button></div></div></div>}
    </div>
  );
}
