import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, BarChart3, BookOpen, Brain, CheckCircle2, Clock3, Flame, Target, Trophy } from 'lucide-react';
import SEO from '../components/ui/SEO';
import { useAuth } from '../context/AuthContext';

const DAILY_HISTORY_KEY = 'ssc-daily10-history-v1';
const MISTAKE_KEY = 'ssc-mistake-book-v1';
const TEST_ATTEMPT_PREFIX = 'ssc-test-attempts-v1';

const TOPICS = [
  { subject: 'Economics', topic: 'National Income' },
  { subject: 'Economics', topic: 'Money & Banking' },
  { subject: 'Economics', topic: 'Income Determination' },
  { subject: 'Economics', topic: 'Balance of Payments' },
  { subject: 'Economics', topic: 'Demand & Elasticity' },
  { subject: 'Economics', topic: 'Opportunity Cost' },
  { subject: 'Business Studies', topic: 'Principles of Management' },
  { subject: 'Business Studies', topic: 'Planning' },
  { subject: 'Business Studies', topic: 'Staffing' },
  { subject: 'Business Studies', topic: 'Directing' },
  { subject: 'Business Studies', topic: 'Controlling' },
  { subject: 'Business Studies', topic: 'Marketing' },
  { subject: 'Business Studies', topic: 'Consumer Protection' },
  { subject: 'Accountancy', topic: 'Partnership Fundamentals' },
  { subject: 'Accountancy', topic: 'Goodwill' },
  { subject: 'Accountancy', topic: 'Admission of a Partner' },
  { subject: 'Accountancy', topic: 'Retirement of a Partner' },
  { subject: 'Accountancy', topic: 'Revaluation' },
  { subject: 'Accountancy', topic: 'Dissolution' },
  { subject: 'Accountancy', topic: 'Share Capital' },
  { subject: 'Accountancy', topic: 'Debentures' },
  { subject: 'Accountancy', topic: 'Accounting Ratios' },
  { subject: 'Accountancy', topic: 'Cash Flow Statement' },
];

function read(key, fallback = []) {
  try { return JSON.parse(localStorage.getItem(key) || JSON.stringify(fallback)); }
  catch { return fallback; }
}

function testKey(userId) {
  return `${TEST_ATTEMPT_PREFIX}:${userId || 'guest'}`;
}

function buildMastery(userId) {
  const history = read(DAILY_HISTORY_KEY, []);
  const mistakes = read(MISTAKE_KEY, []);
  const tests = read(testKey(userId), []);

  const dailyByTopic = new Map();
  history.forEach((entry) => {
    Object.entries(entry.topicStats || {}).forEach(([topic, stat]) => {
      const old = dailyByTopic.get(topic) || { correct: 0, total: 0, subject: stat.subject || 'Commerce' };
      old.correct += Number(stat.correct || 0);
      old.total += Number(stat.total || 0);
      dailyByTopic.set(topic, old);
    });
  });

  const subjectTests = new Map();
  tests.forEach((attempt) => {
    const subject = attempt.subject || 'Commerce';
    const arr = subjectTests.get(subject) || [];
    arr.push(Number(attempt.percentage ?? attempt.pct ?? 0));
    subjectTests.set(subject, arr);
  });

  return TOPICS.map((item) => {
    const daily = dailyByTopic.get(item.topic);
    const relatedMistakes = mistakes.filter((m) => m.topic === item.topic);
    const solvedMistakes = relatedMistakes.filter((m) => m.mastered).length;
    const testScores = subjectTests.get(item.subject) || [];

    const dailyScore = daily?.total ? Math.round((daily.correct / daily.total) * 100) : null;
    const mistakeScore = relatedMistakes.length ? Math.round((solvedMistakes / relatedMistakes.length) * 100) : null;
    const testScore = testScores.length ? Math.round(testScores.reduce((a, b) => a + b, 0) / testScores.length) : null;

    const parts = [];
    if (dailyScore !== null) parts.push({ value: dailyScore, weight: 0.6 });
    if (mistakeScore !== null) parts.push({ value: mistakeScore, weight: 0.25 });
    if (testScore !== null) parts.push({ value: testScore, weight: 0.15 });

    const totalWeight = parts.reduce((sum, p) => sum + p.weight, 0);
    const score = totalWeight ? Math.round(parts.reduce((sum, p) => sum + p.value * p.weight, 0) / totalWeight) : 0;
    const evidence = (daily?.total || 0) + relatedMistakes.length + testScores.length;

    return { ...item, score, evidence, dailyScore, mistakeScore, testScore };
  });
}

function masteryLabel(score, evidence) {
  if (!evidence) return 'Not started';
  if (score >= 85) return 'Mastered';
  if (score >= 65) return 'Strong';
  if (score >= 40) return 'Developing';
  return 'Needs focus';
}

function missionFor(row, minutes) {
  const revise = Math.max(4, Math.round(minutes * 0.35));
  const practice = Math.max(4, Math.round(minutes * 0.4));
  const test = Math.max(2, minutes - revise - practice);
  return [
    { icon: BookOpen, title: `Revise ${row.topic}`, meta: `${revise} min · read key concepts`, to: '/study-material' },
    { icon: Brain, title: 'Do targeted practice', meta: `${practice} min · Daily 10 + Mistake Book`, to: '/daily-practice' },
    { icon: Target, title: 'Finish with a test', meta: `${test} min · prove retention`, to: '/test-series' },
  ];
}

export default function StudyCoach() {
  const { user } = useAuth();
  const [minutes, setMinutes] = useState(20);
  const [subject, setSubject] = useState('All');
  const mastery = useMemo(() => buildMastery(user?.id), [user?.id]);
  const started = mastery.filter((r) => r.evidence > 0);
  const weakest = [...(started.length ? started : mastery)].sort((a, b) => a.score - b.score || b.evidence - a.evidence)[0];
  const visible = mastery.filter((r) => subject === 'All' || r.subject === subject).sort((a, b) => a.score - b.score || b.evidence - a.evidence);
  const overall = started.length ? Math.round(started.reduce((s, r) => s + r.score, 0) / started.length) : 0;
  const masteredCount = mastery.filter((r) => r.evidence > 0 && r.score >= 85).length;
  const mission = missionFor(weakest, minutes);

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-ivory)' }}>
      <SEO title="Personal Study Coach & Chapter Mastery" description="See chapter mastery, weak areas and a personalized Commerce study mission based on your practice history." path="/study-coach" />

      <section className="page-hero overflow-hidden">
        <div className="page-container grid lg:grid-cols-[1.05fr_.95fr] gap-8 items-center">
          <div>
            <span className="eyebrow">Personal Study Coach</span>
            <h1 className="mt-5 max-w-3xl">Stop wondering what to study. <em>Start with what matters most.</em></h1>
            <p className="mt-5 text-lg max-w-2xl" style={{ color: 'var(--muted)' }}>Your mastery estimate combines Daily 10 performance, resolved mistakes and saved test scores to point you toward the next best topic.</p>
            <div className="flex flex-wrap gap-3 mt-7">
              <Link to="/daily-practice" className="btn-primary inline-flex items-center gap-2"><Flame className="w-4 h-4" /> Build mastery now</Link>
              <Link to="/test-series" className="btn-secondary inline-flex items-center gap-2">Take a test <ArrowRight className="w-4 h-4" /></Link>
            </div>
          </div>

          <div className="card-paper p-6 sm:p-8">
            <div className="flex items-center justify-between gap-4">
              <div><div className="text-sm" style={{ color: 'var(--muted)' }}>Current learning signal</div><div className="text-4xl font-bold mt-1" style={{ color: 'var(--gold)', fontFamily: 'var(--font-serif)' }}>{overall}%</div><div className="text-xs mt-1" style={{ color: 'var(--subtle)' }}>average across practised topics</div></div>
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center" style={{ background: 'var(--gold-bg)', color: 'var(--gold)' }}><BarChart3 className="w-8 h-8" /></div>
            </div>
            <div className="grid grid-cols-2 gap-3 mt-6">
              <div className="tile-paper p-4 text-center"><div className="text-2xl font-bold" style={{ color: 'var(--ink)' }}>{started.length}</div><div className="text-xs" style={{ color: 'var(--muted)' }}>topics practised</div></div>
              <div className="tile-paper p-4 text-center"><div className="text-2xl font-bold" style={{ color: 'var(--green)' }}>{masteredCount}</div><div className="text-xs" style={{ color: 'var(--muted)' }}>mastered</div></div>
            </div>
          </div>
        </div>
      </section>

      <section className="page-container py-8">
        <div className="card-paper p-5 sm:p-7" style={{ border: '1px solid rgba(184,135,47,.32)' }}>
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-5">
            <div>
              <span className="eyebrow">What should I study now?</span>
              <h2 className="text-3xl mt-3" style={{ fontFamily: 'var(--font-serif)', color: 'var(--ink)' }}>{weakest.topic}</h2>
              <p className="text-sm mt-2" style={{ color: 'var(--muted)' }}>{weakest.evidence ? `Current mastery estimate: ${weakest.score}% · ${masteryLabel(weakest.score, weakest.evidence)}` : 'You have not practised this topic yet, so it is a good place to begin.'}</p>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              {[10, 20, 30, 45].map((m) => <button key={m} onClick={() => setMinutes(m)} className="px-3 py-2 rounded-full text-sm font-semibold" style={minutes === m ? { background: 'var(--ink)', color: '#fff' } : { background: 'var(--bg-white)', border: '1px solid var(--border)', color: 'var(--muted)' }}><Clock3 className="w-3.5 h-3.5 inline mr-1" />{m} min</button>)}
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-4 mt-7">
            {mission.map(({ icon: Icon, title, meta, to }, i) => <Link key={title} to={to} className="tile-paper p-5 block transition-transform hover:-translate-y-1"><div className="flex items-center justify-between"><div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'var(--gold-bg)', color: 'var(--gold)' }}><Icon className="w-5 h-5" /></div><span className="text-xs font-bold" style={{ color: 'var(--subtle)' }}>STEP {i + 1}</span></div><div className="font-bold mt-4" style={{ color: 'var(--ink)' }}>{title}</div><div className="text-sm mt-1" style={{ color: 'var(--muted)' }}>{meta}</div></Link>)}
          </div>
        </div>
      </section>

      <section className="page-container section-padding">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-5 mb-7">
          <div><span className="eyebrow">Chapter Mastery</span><h2 className="text-3xl mt-3" style={{ fontFamily: 'var(--font-serif)', color: 'var(--ink)' }}>Know exactly where you stand.</h2></div>
          <div className="toggle-paper">{['All', 'Economics', 'Business Studies', 'Accountancy'].map((s) => <button key={s} onClick={() => setSubject(s)} className={subject === s ? 'active' : ''}>{s === 'Business Studies' ? 'BST' : s}</button>)}</div>
        </div>

        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
          {visible.map((row) => {
            const label = masteryLabel(row.score, row.evidence);
            return <motion.div key={`${row.subject}-${row.topic}`} whileHover={{ y: -3 }} className="card-paper p-5"><div className="flex items-start justify-between gap-3"><div><div className="text-xs" style={{ color: 'var(--gold)' }}>{row.subject}</div><div className="font-bold mt-1" style={{ color: 'var(--ink)' }}>{row.topic}</div></div><div className="text-right"><div className="text-xl font-bold" style={{ color: row.score >= 85 ? 'var(--green)' : row.score >= 40 ? 'var(--gold)' : '#B4533C' }}>{row.score}%</div><div className="text-[11px]" style={{ color: 'var(--subtle)' }}>{label}</div></div></div><div className="h-2 rounded-full mt-4 overflow-hidden" style={{ background: 'var(--border-soft)' }}><div className="h-full rounded-full" style={{ width: `${row.score}%`, background: row.score >= 85 ? 'var(--green)' : 'var(--gold)' }} /></div><div className="flex items-center justify-between mt-4 text-xs" style={{ color: 'var(--muted)' }}><span>{row.evidence ? `${row.evidence} learning signals` : 'No practice yet'}</span>{row.score >= 85 ? <span className="inline-flex items-center gap-1" style={{ color: 'var(--green)' }}><CheckCircle2 className="w-3.5 h-3.5" /> Mastered</span> : <Link to="/daily-practice" className="inline-flex items-center gap-1" style={{ color: 'var(--gold)' }}>Improve <ArrowRight className="w-3 h-3" /></Link>}</div></motion.div>;
          })}
        </div>

        <div className="mt-7 rounded-2xl p-4 text-sm flex items-start gap-3" style={{ background: 'var(--bg-white)', border: '1px solid var(--border)', color: 'var(--muted)' }}><Trophy className="w-5 h-5 flex-shrink-0" style={{ color: 'var(--gold)' }} /><p><strong style={{ color: 'var(--ink)' }}>How mastery works:</strong> it is a study estimate, not an official grade. It becomes more useful as you complete Daily 10 questions, fix mistakes and take tests.</p></div>
      </section>
    </div>
  );
}
