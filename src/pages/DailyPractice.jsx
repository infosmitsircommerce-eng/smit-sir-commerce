import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowRight, BookOpenCheck, Brain, CheckCircle2, Flame, RotateCcw,
  Target, Trophy, XCircle, Zap
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import SEO from '../components/ui/SEO';

const DAILY_HISTORY_KEY = 'ssc-daily10-history-v1';
const MISTAKE_KEY = 'ssc-mistake-book-v1';
const TEST_ATTEMPT_PREFIX = 'ssc-test-attempts-v1';

const q = (id, subject, topic, question, options, answer, explanation) => ({
  id, subject, topic, question, options, answer, explanation,
});

const QUESTION_BANK = [
  q('eco-ni-1', 'Economics', 'National Income', 'National Income is commonly measured as:', ['GDP at MP', 'NNP at FC', 'NDP at MP', 'GNP at MP'], 1, 'In standard CBSE terminology, National Income is NNP at Factor Cost.'),
  q('eco-ni-2', 'Economics', 'National Income', 'Which item is excluded from national income because it is not payment for current production?', ['Wages', 'Rent', 'Transfer payment', 'Profit'], 2, 'Transfer payments redistribute income without payment for current productive services.'),
  q('eco-ni-3', 'Economics', 'National Income', 'Value added is equal to value of output minus:', ['Wages', 'Intermediate consumption', 'Profit', 'Depreciation only'], 1, 'Value added removes the value of intermediate goods and services used in production.'),
  q('eco-money-1', 'Economics', 'Money & Banking', 'CRR is the percentage of deposits commercial banks keep with:', ['Customers', 'RBI', 'Stock exchanges', 'Insurance companies'], 1, 'Cash Reserve Ratio is maintained with the central bank.'),
  q('eco-money-2', 'Economics', 'Money & Banking', 'A rise in repo rate generally tends to:', ['Encourage borrowing', 'Reduce borrowing', 'Raise exports automatically', 'Reduce taxes'], 1, 'A higher repo rate raises banks’ cost of borrowing and can reduce credit growth.'),
  q('eco-ad-1', 'Economics', 'Income Determination', 'If MPC = 0.75, the simple investment multiplier is:', ['2', '3', '4', '5'], 2, 'Multiplier = 1/(1−MPC) = 1/0.25 = 4.'),
  q('eco-bop-1', 'Economics', 'Balance of Payments', 'The current account of BOP includes:', ['Only FDI', 'Goods and services plus income/transfers', 'Only loans', 'Only gold reserves'], 1, 'The current account covers trade in goods/services and income/transfers.'),
  q('bst-principles-1', 'Business Studies', 'Principles of Management', 'Who proposed the 14 Principles of Management?', ['Taylor', 'Fayol', 'Maslow', 'Drucker'], 1, 'Henri Fayol developed the 14 Principles of Management.'),
  q('bst-principles-2', 'Business Studies', 'Principles of Management', 'Unity of Direction means:', ['One employee, one boss', 'One head and one plan for similar activities', 'Equal pay for all', 'No delegation'], 1, 'Activities with the same objective should have one head and one plan.'),
  q('bst-principles-3', 'Business Studies', 'Principles of Management', 'Scalar Chain refers to:', ['Pay levels', 'Formal line of authority', 'Marketing channel', 'Production sequence'], 1, 'Scalar Chain is the formal chain of authority from top to bottom.'),
  q('bst-planning-1', 'Business Studies', 'Planning', 'Which management function decides in advance what is to be done?', ['Staffing', 'Planning', 'Directing', 'Controlling'], 1, 'Planning sets objectives and decides actions in advance.'),
  q('bst-staffing-1', 'Business Studies', 'Staffing', 'Recruitment is a process of:', ['Selecting the final candidate only', 'Searching for prospective employees', 'Training only', 'Promotion only'], 1, 'Recruitment creates a pool of prospective employees from which selection can be made.'),
  q('bst-marketing-1', 'Business Studies', 'Marketing', 'Packaging is mainly a decision under which element of the marketing mix?', ['Product', 'Price', 'Place', 'Promotion'], 0, 'Packaging is part of the product decision.'),
  q('bst-marketing-2', 'Business Studies', 'Marketing', 'A temporary “buy 1 get 1” offer is an example of:', ['Advertising', 'Sales promotion', 'Personal selling', 'Public relations'], 1, 'Short-term purchase incentives are sales promotion tools.'),
  q('bst-consumer-1', 'Business Studies', 'Consumer Protection', 'The right to be informed primarily protects consumers by ensuring:', ['Free products', 'Accurate product information', 'Unlimited credit', 'No bills'], 1, 'Consumers should receive correct information about quality, quantity, price and other relevant details.'),
  q('acc-partnership-1', 'Accountancy', 'Partnership Fundamentals', 'If the partnership deed is silent, profits and losses are shared:', ['In capital ratio', 'Equally', 'In sales ratio', 'In old ratio'], 1, 'In the absence of an agreement, partners share profits and losses equally.'),
  q('acc-partnership-2', 'Accountancy', 'Partnership Fundamentals', 'Partner salary is treated as:', ['Operating expense', 'Appropriation of profit', 'Current asset', 'Capital loss'], 1, 'Partner salary is an appropriation of profit, not a normal business expense.'),
  q('acc-goodwill-1', 'Accountancy', 'Goodwill', 'Goodwill represents:', ['Physical cash', 'Business reputation and earning capacity', 'Only liabilities', 'Only inventory'], 1, 'Goodwill is an intangible asset arising from reputation and expected earning capacity.'),
  q('acc-admission-1', 'Accountancy', 'Admission of a Partner', 'Sacrificing ratio is normally calculated at the time of:', ['Admission', 'Dissolution', 'Every purchase', 'Issue of debentures'], 0, 'On admission, old partners may sacrifice part of their profit share for the new partner.'),
  q('acc-retirement-1', 'Accountancy', 'Retirement of a Partner', 'Gaining ratio is commonly calculated at the time of:', ['Admission only', 'Retirement or death', 'Purchase of machinery', 'Cash withdrawal'], 1, 'Remaining partners may gain the outgoing partner’s share on retirement or death.'),
  q('acc-revaluation-1', 'Accountancy', 'Revaluation', 'An increase in the value of an asset is recorded on which side of Revaluation Account?', ['Debit', 'Credit', 'Neither side', 'Cash side'], 1, 'Appreciation of an asset is a gain and is credited to Revaluation Account.'),
  q('acc-dissolution-1', 'Accountancy', 'Dissolution', 'Assets transferred to Realisation Account are generally recorded on its:', ['Credit side', 'Debit side', 'Cash side', 'Capital side'], 1, 'Assets to be realised are transferred to the debit side of Realisation Account.'),
  q('acc-shares-1', 'Accountancy', 'Share Capital', 'Shares issued above face value are issued at:', ['Discount', 'Premium', 'Par only', 'Loss'], 1, 'The excess over face value is securities premium.'),
  q('acc-debentures-1', 'Accountancy', 'Debentures', 'Debenture holders are:', ['Owners', 'Creditors', 'Employees', 'Customers'], 1, 'Debenture holders lend money to the company and are creditors.'),
  q('acc-cashflow-1', 'Accountancy', 'Cash Flow Statement', 'Cash generated from the main revenue-producing activities is classified as:', ['Operating activity', 'Investing activity', 'Financing activity', 'Non-cash activity'], 0, 'Core revenue-producing cash flows are operating activities.'),
  q('eco-demand-1', 'Economics', 'Demand & Elasticity', 'When price falls and total expenditure rises, demand is:', ['Perfectly inelastic', 'Elastic', 'Unit elastic', 'Zero'], 1, 'Under the total expenditure method, price and expenditure moving in opposite directions indicate elastic demand.'),
  q('eco-opportunity-1', 'Economics', 'Opportunity Cost', 'Opportunity cost is best described as:', ['Money paid only', 'Value of the next best alternative forgone', 'Total fixed cost', 'Accounting profit'], 1, 'Opportunity cost is the value of the next best option that is given up.'),
  q('bst-controlling-1', 'Business Studies', 'Controlling', 'The first step in the controlling process is:', ['Corrective action', 'Setting performance standards', 'Measurement only', 'Comparing deviations'], 1, 'Control begins by setting standards against which actual performance can be measured.'),
  q('bst-directing-1', 'Business Studies', 'Directing', 'Which of the following is a non-financial incentive?', ['Bonus', 'Commission', 'Job enrichment', 'Profit sharing'], 2, 'Job enrichment increases responsibility, challenge and growth without being direct monetary payment.'),
  q('acc-ratio-1', 'Accountancy', 'Accounting Ratios', 'Current Ratio compares:', ['Current assets with current liabilities', 'Sales with profit', 'Fixed assets with debt', 'Cash with capital only'], 0, 'Current Ratio = Current Assets ÷ Current Liabilities.'),
];

function safeRead(key, fallback = []) {
  try { return JSON.parse(localStorage.getItem(key) || JSON.stringify(fallback)); }
  catch { return fallback; }
}

function safeWrite(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* ignore storage failures */ }
}

function dayKey(date = new Date()) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function seededQuestions(dateString) {
  const seed = [...dateString].reduce((sum, ch) => sum + ch.charCodeAt(0), 0);
  return [...QUESTION_BANK]
    .map((item, index) => ({ item, rank: (index * 37 + seed * 17) % 997 }))
    .sort((a, b) => a.rank - b.rank)
    .slice(0, 10)
    .map(({ item }) => item);
}

function computeStreak(history) {
  const dates = new Set(history.map((item) => item.date));
  let cursor = new Date();
  if (!dates.has(dayKey(cursor))) cursor.setDate(cursor.getDate() - 1);
  let streak = 0;
  while (dates.has(dayKey(cursor))) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}

function addMistakes(questions, answers) {
  const existing = safeRead(MISTAKE_KEY, []);
  const byId = new Map(existing.map((item) => [item.id, item]));
  questions.forEach((item, index) => {
    if (answers[index] === item.answer) return;
    const old = byId.get(item.id);
    byId.set(item.id, {
      ...item,
      timesWrong: (old?.timesWrong || 0) + 1,
      lastWrongAt: new Date().toISOString(),
      mastered: false,
    });
  });
  safeWrite(MISTAKE_KEY, [...byId.values()].sort((a, b) => (b.timesWrong || 0) - (a.timesWrong || 0)));
}

function buildRadar(history, testAttempts) {
  const topics = new Map();
  history.forEach((entry) => {
    Object.entries(entry.topicStats || {}).forEach(([topic, stat]) => {
      const current = topics.get(topic) || { correct: 0, total: 0, subject: stat.subject || 'Commerce' };
      current.correct += Number(stat.correct || 0);
      current.total += Number(stat.total || 0);
      topics.set(topic, current);
    });
  });

  const topicRows = [...topics.entries()].map(([topic, stat]) => ({
    topic,
    subject: stat.subject,
    accuracy: stat.total ? Math.round((stat.correct / stat.total) * 100) : 0,
    attempts: stat.total,
  }));

  if (topicRows.length) return topicRows.sort((a, b) => a.accuracy - b.accuracy || b.attempts - a.attempts).slice(0, 5);

  return testAttempts
    .map((attempt) => ({
      topic: attempt.test_name || attempt.testName || 'Commerce Test',
      subject: attempt.subject || 'Commerce',
      accuracy: Number(attempt.percentage ?? attempt.pct ?? 0),
      attempts: 1,
    }))
    .sort((a, b) => a.accuracy - b.accuracy)
    .slice(0, 5);
}

function MistakeBook({ mistakes, onChange }) {
  const [active, setActive] = useState(null);
  const [choice, setChoice] = useState(null);

  const retry = (item) => { setActive(item); setChoice(null); };
  const answer = (index) => {
    setChoice(index);
    if (index === active.answer) {
      const next = mistakes.map((item) => item.id === active.id ? { ...item, mastered: true } : item);
      safeWrite(MISTAKE_KEY, next);
      onChange(next);
    }
  };

  const pending = mistakes.filter((item) => !item.mastered);
  const mastered = mistakes.filter((item) => item.mastered);

  return (
    <section className="card-paper p-5 sm:p-7">
      <div className="flex items-start justify-between gap-4">
        <div>
          <span className="eyebrow">Mistake Book</span>
          <h2 className="text-2xl mt-3" style={{ fontFamily: 'var(--font-serif)', color: 'var(--ink)' }}>Your wrong answers become your revision list.</h2>
          <p className="text-sm mt-2" style={{ color: 'var(--muted)' }}>Every wrong Daily 10 answer is saved here automatically. Retry it until you get it right.</p>
        </div>
        <div className="text-right flex-shrink-0"><div className="text-3xl font-bold" style={{ color: 'var(--gold)' }}>{pending.length}</div><div className="text-xs" style={{ color: 'var(--muted)' }}>to fix</div></div>
      </div>

      {active && (
        <div className="rounded-2xl p-5 mt-6" style={{ background: 'var(--bg-ivory)', border: '1px solid var(--border)' }}>
          <div className="text-xs font-semibold" style={{ color: 'var(--gold)' }}>{active.subject} · {active.topic}</div>
          <div className="font-semibold mt-2" style={{ color: 'var(--ink)' }}>{active.question}</div>
          <div className="grid gap-2 mt-4">
            {active.options.map((option, index) => {
              const selected = choice === index;
              const correct = choice !== null && index === active.answer;
              return <button key={option} onClick={() => answer(index)} disabled={choice !== null && choice === active.answer} className="text-left rounded-xl p-3 text-sm" style={{ border: `1px solid ${correct ? 'rgba(77,124,15,.45)' : selected ? 'rgba(184,135,47,.5)' : 'var(--border)'}`, background: correct ? 'rgba(77,124,15,.07)' : selected ? 'var(--gold-bg)' : 'var(--bg-white)', color: 'var(--charcoal)' }}><strong className="mr-2">{String.fromCharCode(65 + index)}.</strong>{option}</button>;
            })}
          </div>
          {choice !== null && <div className="text-sm mt-4" style={{ color: choice === active.answer ? 'var(--green)' : '#B4533C' }}>{choice === active.answer ? 'Correct — marked as mastered.' : `Not yet. ${active.explanation}`}</div>}
        </div>
      )}

      <div className="grid sm:grid-cols-2 gap-3 mt-6">
        {pending.slice(0, 6).map((item) => <button key={item.id} onClick={() => retry(item)} className="tile-paper p-4 text-left"><div className="text-xs" style={{ color: 'var(--gold)' }}>{item.subject} · {item.topic}</div><div className="font-semibold text-sm mt-1 line-clamp-2" style={{ color: 'var(--ink)' }}>{item.question}</div><div className="text-xs mt-2" style={{ color: 'var(--muted)' }}>Wrong {item.timesWrong || 1}× · Tap to retry</div></button>)}
      </div>

      {!pending.length && <div className="tile-paper p-6 text-center mt-6"><CheckCircle2 className="w-8 h-8 mx-auto" style={{ color: 'var(--green)' }} /><div className="font-semibold mt-3" style={{ color: 'var(--ink)' }}>Mistake book is clear.</div><div className="text-sm mt-1" style={{ color: 'var(--muted)' }}>{mastered.length ? `${mastered.length} mistakes mastered so far.` : 'Complete Daily 10 and any wrong answers will appear here.'}</div></div>}
    </section>
  );
}

export default function DailyPractice() {
  const { user } = useAuth();
  const today = dayKey();
  const dailyQuestions = useMemo(() => seededQuestions(today), [today]);
  const [history, setHistory] = useState(() => safeRead(DAILY_HISTORY_KEY, []));
  const [mistakes, setMistakes] = useState(() => safeRead(MISTAKE_KEY, []));
  const completed = history.find((item) => item.date === today);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [finished, setFinished] = useState(Boolean(completed));

  const testAttempts = useMemo(() => safeRead(`${TEST_ATTEMPT_PREFIX}:${user?.id || 'guest'}`, []), [user?.id, finished]);
  const radar = useMemo(() => buildRadar(history, testAttempts), [history, testAttempts]);
  const streak = computeStreak(history);
  const score = dailyQuestions.reduce((sum, item, i) => sum + (answers[i] === item.answer ? 1 : 0), 0);

  const submit = () => {
    const topicStats = {};
    dailyQuestions.forEach((item, i) => {
      const stat = topicStats[item.topic] || { subject: item.subject, correct: 0, total: 0 };
      stat.total += 1;
      if (answers[i] === item.answer) stat.correct += 1;
      topicStats[item.topic] = stat;
    });
    const entry = { date: today, score, total: dailyQuestions.length, percentage: Math.round((score / dailyQuestions.length) * 100), topicStats };
    const nextHistory = [entry, ...history.filter((item) => item.date !== today)].slice(0, 120);
    safeWrite(DAILY_HISTORY_KEY, nextHistory);
    addMistakes(dailyQuestions, answers);
    setHistory(nextHistory);
    setMistakes(safeRead(MISTAKE_KEY, []));
    setFinished(true);
  };

  const practiseAgain = () => { setIndex(0); setAnswers({}); setFinished(false); };
  const result = completed || history.find((item) => item.date === today);

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-ivory)' }}>
      <SEO title="Daily 10 Commerce Practice" description="Daily CBSE Commerce questions, weak-topic radar and a personal mistake book for Class 11 and 12 students." path="/daily-practice" />

      <section className="page-hero">
        <div className="page-container">
          <div className="grid lg:grid-cols-[1.15fr_.85fr] gap-8 items-center">
            <div>
              <span className="eyebrow">Your daily study loop</span>
              <h1 className="mt-5">10 questions. <em>Every day. Get sharper.</em></h1>
              <p className="text-lg mt-5 max-w-2xl" style={{ color: 'var(--muted)' }}>Daily 10 finds what you get wrong, builds your Mistake Book and turns your practice history into a Weak Topic Radar.</p>
              <div className="flex flex-wrap gap-3 mt-6">
                <span className="tile-paper px-4 py-2 text-sm inline-flex items-center gap-2"><Flame className="w-4 h-4" style={{ color: 'var(--gold)' }} /> {streak}-day streak</span>
                <span className="tile-paper px-4 py-2 text-sm inline-flex items-center gap-2"><Brain className="w-4 h-4" style={{ color: 'var(--gold)' }} /> {mistakes.filter(m => !m.mastered).length} mistakes to fix</span>
              </div>
            </div>
            <div className="card-paper p-6 sm:p-7">
              <div className="flex items-center gap-3"><div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: 'var(--gold-bg)', color: 'var(--gold)' }}><Zap className="w-6 h-6" /></div><div><div className="font-bold" style={{ color: 'var(--ink)' }}>Today’s Daily 10</div><div className="text-sm" style={{ color: 'var(--muted)' }}>{today}</div></div></div>
              <div className="grid grid-cols-3 gap-2 mt-5 text-center">{[['10','questions'],['3','subjects'],[result ? `${result.percentage}%` : '—','today']].map(([value,label]) => <div key={label} className="tile-paper p-3"><div className="text-xl font-bold" style={{ color: 'var(--ink)' }}>{value}</div><div className="text-xs" style={{ color: 'var(--muted)' }}>{label}</div></div>)}</div>
            </div>
          </div>
        </div>
      </section>

      <section className="page-container py-8 grid lg:grid-cols-[1.25fr_.75fr] gap-6 items-start">
        <div className="card-paper p-5 sm:p-7">
          {!finished ? (
            <>
              <div className="flex items-center justify-between gap-4"><div><span className="eyebrow">Daily 10</span><h2 className="text-2xl mt-3" style={{ fontFamily: 'var(--font-serif)', color: 'var(--ink)' }}>Question {index + 1} of 10</h2></div><div className="text-sm font-semibold" style={{ color: 'var(--gold)' }}>{Object.keys(answers).length}/10 answered</div></div>
              <div className="h-2 rounded-full mt-5 overflow-hidden" style={{ background: 'var(--border-soft)' }}><div className="h-full" style={{ width: `${((index + 1) / 10) * 100}%`, background: 'var(--gold)' }} /></div>
              <div className="mt-7"><div className="text-xs font-semibold" style={{ color: 'var(--gold)' }}>{dailyQuestions[index].subject} · {dailyQuestions[index].topic}</div><h3 className="text-xl mt-2 leading-relaxed" style={{ color: 'var(--ink)' }}>{dailyQuestions[index].question}</h3><div className="grid gap-3 mt-5">{dailyQuestions[index].options.map((option, optionIndex) => { const selected = answers[index] === optionIndex; return <button key={option} onClick={() => setAnswers(prev => ({ ...prev, [index]: optionIndex }))} className="rounded-xl p-4 text-left" style={{ border: selected ? '2px solid var(--gold)' : '1px solid var(--border)', background: selected ? 'var(--gold-bg)' : 'var(--bg-white)', color: 'var(--charcoal)' }}><strong className="mr-2">{String.fromCharCode(65 + optionIndex)}.</strong>{option}</button>; })}</div></div>
              <div className="flex justify-between gap-3 mt-7"><button disabled={index === 0} onClick={() => setIndex(i => i - 1)} className="btn-secondary disabled:opacity-40">Previous</button>{index < 9 ? <button disabled={answers[index] === undefined} onClick={() => setIndex(i => i + 1)} className="btn-primary disabled:opacity-40">Next</button> : <button disabled={Object.keys(answers).length < 10} onClick={submit} className="btn-primary disabled:opacity-40">Finish Daily 10</button>}</div>
            </>
          ) : (
            <div className="text-center py-4"><Trophy className="w-12 h-12 mx-auto" style={{ color: 'var(--gold)' }} /><span className="eyebrow inline-block mt-4">Today complete</span><h2 className="text-4xl mt-3" style={{ fontFamily: 'var(--font-serif)', color: 'var(--ink)' }}>{result?.score ?? score}/10</h2><p className="mt-2" style={{ color: 'var(--muted)' }}>{result?.percentage ?? Math.round(score * 10)}% · Your weak topics and mistake book have been updated.</p><button onClick={practiseAgain} className="btn-secondary mt-6 inline-flex items-center justify-center gap-2"><RotateCcw className="w-4 h-4" /> Practise today again</button></div>
          )}
        </div>

        <aside className="card-paper p-5 sm:p-6">
          <div className="flex items-center gap-3"><div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: 'var(--gold-bg)', color: 'var(--gold)' }}><Target className="w-5 h-5" /></div><div><div className="font-bold" style={{ color: 'var(--ink)' }}>Weak Topic Radar</div><div className="text-xs" style={{ color: 'var(--muted)' }}>Lowest accuracy comes first</div></div></div>
          <div className="space-y-3 mt-5">{radar.length ? radar.map((item, i) => <div key={`${item.topic}-${i}`} className="tile-paper p-3"><div className="flex items-center justify-between gap-3"><div><div className="font-semibold text-sm" style={{ color: 'var(--ink)' }}>{item.topic}</div><div className="text-xs mt-1" style={{ color: 'var(--muted)' }}>{item.subject}</div></div><div className="text-xl font-bold" style={{ color: item.accuracy < 60 ? '#B4533C' : item.accuracy < 80 ? 'var(--gold)' : 'var(--green)' }}>{Math.round(item.accuracy)}%</div></div><div className="h-1.5 rounded-full mt-3 overflow-hidden" style={{ background: 'var(--border-soft)' }}><div className="h-full" style={{ width: `${Math.max(4, item.accuracy)}%`, background: item.accuracy < 60 ? '#B4533C' : 'var(--gold)' }} /></div></div>) : <div className="tile-paper p-5 text-sm text-center" style={{ color: 'var(--muted)' }}>Complete Daily 10 or a test series attempt and your weak areas will appear here.</div>}</div>
          <Link to="/test-series" className="btn-secondary w-full mt-5 inline-flex items-center justify-center gap-2">Take a full test <ArrowRight className="w-4 h-4" /></Link>
        </aside>
      </section>

      <section className="page-container pb-16"><MistakeBook mistakes={mistakes} onChange={setMistakes} /></section>

      <section className="page-container pb-16"><div className="rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-5" style={{ background: 'var(--ink)', color: '#fff' }}><div><div className="text-sm font-semibold" style={{ color: '#e7c66c' }}>The goal isn’t more studying. It’s smarter revision.</div><h2 className="text-2xl mt-2" style={{ fontFamily: 'var(--font-serif)' }}>Daily practice → mistakes → weak topics → targeted tests.</h2></div><Link to="/cbse-notes" className="btn-primary flex-shrink-0 inline-flex items-center gap-2"><BookOpenCheck className="w-4 h-4" /> Revise notes</Link></div></section>
    </div>
  );
}
