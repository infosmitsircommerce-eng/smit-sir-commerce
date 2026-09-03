import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BarChart3, BookOpen, CheckCircle2, ClipboardCheck, RefreshCcw, Share2, Target, TrendingUp } from 'lucide-react';
import SEO from '../components/ui/SEO';
import { buildRecoveryReport, leakTypes, readinessBand, recoverySubjects } from '../data/marksRecovery';
import { trackEvent } from '../lib/analytics';

const BASE = 'https://www.smitsircommerce.in';
const STORAGE_KEY = 'ssc-marks-recovery-history-v1';

function readHistory() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); } catch { return []; }
}
function writeHistory(items) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(items.slice(0, 12))); } catch { /* local-only feature */ }
}
function sendGoogleEvent(name, metadata = {}) {
  if (typeof window.gtag === 'function') window.gtag('event', name, metadata);
}

export default function MarksRecovery() {
  const [subjectKey, setSubjectKey] = useState('class-12-economics');
  const [score, setScore] = useState('');
  const [maxScore, setMaxScore] = useState('80');
  const [leakMarks, setLeakMarks] = useState(Object.fromEntries(leakTypes.map((item) => [item.id, ''])));
  const [weakTopicIds, setWeakTopicIds] = useState([]);
  const [report, setReport] = useState(null);
  const [history, setHistory] = useState([]);
  const [entryId, setEntryId] = useState(null);
  const [retestScore, setRetestScore] = useState('');
  const [shareStatus, setShareStatus] = useState('');
  const subject = recoverySubjects[subjectKey];

  useEffect(() => { setHistory(readHistory()); }, []);
  useEffect(() => {
    setWeakTopicIds([]);
    setReport(null);
    setRetestScore('');
  }, [subjectKey]);

  const totalStatedLeak = useMemo(() => Object.values(leakMarks).reduce((sum, value) => sum + (Number(value) || 0), 0), [leakMarks]);

  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebApplication',
        '@id': `${BASE}/marks-recovery#app`,
        name: 'Commerce Marks Leak & Recovery Engine',
        url: `${BASE}/marks-recovery`,
        applicationCategory: 'EducationalApplication',
        operatingSystem: 'Any',
        isAccessibleForFree: true,
        description: 'Free Commerce diagnostic that maps where marks are being lost, creates a Commerce Readiness Score and builds a personalised recovery plan for Class 11 and 12 students.',
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'INR' },
        provider: { '@id': `${BASE}/#organization` },
      },
      {
        '@type': 'LearningResource',
        name: 'Commerce Marks Recovery Diagnostic',
        url: `${BASE}/marks-recovery`,
        learningResourceType: 'Diagnostic assessment',
        educationalLevel: ['Class 11', 'Class 12'],
        isAccessibleForFree: true,
        teaches: ['Error analysis', 'Weak-topic identification', 'Exam recovery planning'],
      },
      {
        '@type': 'FAQPage',
        mainEntity: [
          { '@type': 'Question', name: 'What is a marks leak?', acceptedAnswer: { '@type': 'Answer', text: 'A marks leak is a repeatable reason marks are being lost, such as a concept gap, formula mistake, question interpretation, answer structure, time pressure or a careless error.' } },
          { '@type': 'Question', name: 'Is the Commerce Readiness Score a predicted board mark?', acceptedAnswer: { '@type': 'Answer', text: 'No. It is a study-planning estimate based on the score and mistake information entered by the student. It is not a board-exam prediction or guarantee.' } },
          { '@type': 'Question', name: 'Does the tool require a login?', acceptedAnswer: { '@type': 'Answer', text: 'No. Detailed diagnostic history is stored in the student’s browser. Anonymous aggregate events can be used to understand common Commerce mistake patterns.' } },
        ],
      },
    ],
  };

  function toggleTopic(id) {
    setWeakTopicIds((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
  }

  function generateReport(event) {
    event.preventDefault();
    const numericScore = Number(score);
    const numericMax = Number(maxScore);
    if (!Number.isFinite(numericScore) || !Number.isFinite(numericMax) || numericMax <= 0 || numericScore < 0 || numericScore > numericMax) return;
    const nextReport = buildRecoveryReport({ subjectKey, score: numericScore, maxScore: numericMax, leakMarks, weakTopicIds });
    setReport(nextReport);
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    setEntryId(id);
    const nextEntry = {
      id,
      createdAt: new Date().toISOString(),
      subjectKey,
      subjectLabel: nextReport.subject?.label,
      score: nextReport.currentScore,
      maxScore: nextReport.maxScore,
      readiness: nextReport.readiness,
      recoverable: nextReport.recoverable,
      topLeak: nextReport.topLeak?.id,
      weakTopicIds,
    };
    const nextHistory = [nextEntry, ...history].slice(0, 12);
    setHistory(nextHistory);
    writeHistory(nextHistory);

    const metadata = {
      subject: nextReport.subject?.subject || 'Unknown',
      class_level: nextReport.subject?.classLevel || 'Unknown',
      top_leak: nextReport.topLeak?.id || 'none',
      readiness_band: readinessBand(nextReport.readiness),
      weak_topic_count: nextReport.weakTopics.length,
    };
    trackEvent('marks_recovery_generated', metadata);
    sendGoogleEvent('marks_recovery_generated', metadata);
  }

  function saveRetest() {
    if (!report || !entryId) return;
    const value = Number(retestScore);
    if (!Number.isFinite(value) || value < 0 || value > report.maxScore) return;
    const recovered = Math.round((value - report.currentScore) * 10) / 10;
    const nextHistory = history.map((item) => item.id === entryId ? { ...item, retestScore: value, recovered } : item);
    setHistory(nextHistory);
    writeHistory(nextHistory);
    const metadata = { subject: report.subject?.subject || 'Unknown', recovered_band: recovered > 5 ? '6+' : recovered > 0 ? '1-5' : recovered === 0 ? '0' : 'negative' };
    trackEvent('marks_recovery_retest_saved', metadata);
    sendGoogleEvent('marks_recovery_retest_saved', metadata);
  }

  async function shareScorecard() {
    if (!report) return;
    const topicText = report.weakTopics[0]?.label ? ` Weak focus: ${report.weakTopics[0].label}.` : '';
    const text = `My Commerce Readiness Score: ${report.readiness}/100 (${report.band}). Biggest marks leak: ${report.topLeak?.label}.${topicText} Check your own marks leaks free:`;
    const url = `${BASE}/marks-recovery`;
    try {
      if (navigator.share) await navigator.share({ title: 'My Commerce Readiness Score', text, url });
      else await navigator.clipboard.writeText(`${text} ${url}`);
      setShareStatus('Scorecard ready to share');
      trackEvent('marks_recovery_shared', { subject: report.subject?.subject || 'Unknown', readiness_band: readinessBand(report.readiness) });
      sendGoogleEvent('marks_recovery_shared', { subject: report.subject?.subject || 'Unknown' });
    } catch { setShareStatus('Share cancelled'); }
  }

  function startAgain() {
    setScore('');
    setLeakMarks(Object.fromEntries(leakTypes.map((item) => [item.id, ''])));
    setWeakTopicIds([]);
    setReport(null);
    setRetestScore('');
    setEntryId(null);
    setShareStatus('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-ivory)' }}>
      <SEO
        title="Commerce Marks Leak & Recovery Engine — Free Class 11 & 12 Diagnostic"
        description="Find why you are losing marks in Commerce, calculate a Commerce Readiness Score and get a personalised 5-day recovery plan for Economics, Business Studies and Accountancy."
        path="/marks-recovery"
        structuredData={structuredData}
      />

      <section className="page-hero">
        <div className="page-container text-center">
          <span className="eyebrow">Free Commerce diagnostic</span>
          <h1 className="mt-5">Don’t just ask, “How many marks?” <em>Find where they leaked.</em></h1>
          <p className="mx-auto max-w-3xl">Turn one test score into a marks-leak map, Commerce Readiness Score and a focused 5-day recovery plan. No login and no paid AI required.</p>
          <div className="mt-7 flex flex-wrap justify-center gap-3 text-xs font-semibold" style={{ color: 'var(--muted)' }}>
            <span className="tile-paper px-4 py-2">Concept gaps</span><span className="tile-paper px-4 py-2">Formula mistakes</span><span className="tile-paper px-4 py-2">Answer structure</span><span className="tile-paper px-4 py-2">Time loss</span>
          </div>
        </div>
      </section>

      <section className="page-container pb-10">
        <form onSubmit={generateReport} className="grid lg:grid-cols-[.92fr_1.08fr] gap-6 items-start">
          <div className="card-paper p-5 sm:p-7">
            <div className="flex items-center gap-3 mb-6"><Target className="w-6 h-6" style={{ color: 'var(--gold)' }} /><div><h2 className="text-2xl" style={{ fontFamily: 'var(--font-serif)', color: 'var(--ink)' }}>1. Your test snapshot</h2><p className="text-xs mt-1" style={{ color: 'var(--muted)' }}>Use your latest school, tuition or practice test.</p></div></div>
            <label className="block text-sm font-semibold" style={{ color: 'var(--ink)' }}>Subject
              <select value={subjectKey} onChange={(e) => setSubjectKey(e.target.value)} className="mt-2 w-full rounded-xl border px-4 py-3" style={{ borderColor: 'var(--border)', background: 'var(--bg-white)' }}>
                {Object.entries(recoverySubjects).map(([key, item]) => <option key={key} value={key}>{item.label}</option>)}
              </select>
            </label>
            <div className="grid grid-cols-2 gap-3 mt-4">
              <label className="text-sm font-semibold" style={{ color: 'var(--ink)' }}>Your marks<input required type="number" step="any" min="0" value={score} onChange={(e) => setScore(e.target.value)} placeholder="43" className="mt-2 w-full rounded-xl border px-4 py-3" style={{ borderColor: 'var(--border)', background: 'var(--bg-white)' }} /></label>
              <label className="text-sm font-semibold" style={{ color: 'var(--ink)' }}>Out of<input required type="number" step="any" min="1" value={maxScore} onChange={(e) => setMaxScore(e.target.value)} placeholder="80" className="mt-2 w-full rounded-xl border px-4 py-3" style={{ borderColor: 'var(--border)', background: 'var(--bg-white)' }} /></label>
            </div>

            <div className="mt-7"><h3 className="font-semibold" style={{ color: 'var(--ink)' }}>2. Which topics felt weak?</h3><p className="text-xs mt-1" style={{ color: 'var(--muted)' }}>Select only the areas that actually caused difficulty.</p><div className="flex flex-wrap gap-2 mt-4">{subject?.topics.map((topic) => {
              const selected = weakTopicIds.includes(topic.id);
              return <button key={topic.id} type="button" onClick={() => toggleTopic(topic.id)} className="rounded-full border px-3 py-2 text-xs font-semibold" style={{ borderColor: selected ? 'var(--gold)' : 'var(--border)', background: selected ? 'var(--gold-bg)' : 'var(--bg-white)', color: 'var(--ink)' }}>{selected ? '✓ ' : ''}{topic.label}</button>;
            })}</div></div>
          </div>

          <div className="card-paper p-5 sm:p-7">
            <div className="flex items-center gap-3 mb-2"><ClipboardCheck className="w-6 h-6" style={{ color: 'var(--gold)' }} /><h2 className="text-2xl" style={{ fontFamily: 'var(--font-serif)', color: 'var(--ink)' }}>3. Estimate where marks were lost</h2></div>
            <p className="text-sm leading-6" style={{ color: 'var(--muted)' }}>Use your checked paper if possible. Enter approximate marks lost in each category. The engine treats this as your self-reported estimate, not an official evaluation.</p>
            <div className="mt-5 space-y-3">{leakTypes.map((item) => <label key={item.id} className="tile-paper p-4 grid grid-cols-[1fr_88px] gap-4 items-center"><div><div className="font-semibold text-sm" style={{ color: 'var(--ink)' }}>{item.label}</div><div className="text-xs leading-5 mt-1" style={{ color: 'var(--muted)' }}>{item.description}</div></div><input type="number" step="0.5" min="0" value={leakMarks[item.id]} onChange={(e) => setLeakMarks((prev) => ({ ...prev, [item.id]: e.target.value }))} placeholder="0" className="w-full rounded-xl border px-3 py-2.5 text-center" style={{ borderColor: 'var(--border)', background: 'var(--bg-white)' }} /></label>)}</div>
            <div className="mt-4 text-xs" style={{ color: 'var(--muted)' }}>Total marked loss: <strong style={{ color: 'var(--ink)' }}>{totalStatedLeak || 0}</strong></div>
            <button type="submit" className="btn-primary mt-6 w-full inline-flex items-center justify-center gap-2"><BarChart3 className="w-4 h-4" /> Build my Marks Leak Map</button>
          </div>
        </form>
      </section>

      {report && <>
        <section className="page-container pb-10" id="recovery-report">
          <div className="grid lg:grid-cols-[.85fr_1.15fr] gap-6 items-start">
            <div className="card-paper p-6 sm:p-8 lg:sticky lg:top-24">
              <span className="eyebrow">Commerce Readiness Score</span>
              <div className="mt-4 flex items-end gap-2"><div className="text-6xl font-bold" style={{ color: 'var(--ink)' }}>{report.readiness}</div><div className="text-xl pb-2" style={{ color: 'var(--muted)' }}>/100</div></div>
              <div className="mt-3 inline-flex rounded-full px-3 py-1.5 text-xs font-semibold" style={{ background: 'var(--gold-bg)', color: 'var(--gold)' }}>{report.band}</div>
              <div className="grid grid-cols-2 gap-3 mt-6"><div className="tile-paper p-4"><div className="text-2xl font-semibold" style={{ color: 'var(--ink)' }}>{report.currentScore}/{report.maxScore}</div><div className="text-xs mt-1" style={{ color: 'var(--muted)' }}>current test</div></div><div className="tile-paper p-4"><div className="text-2xl font-semibold" style={{ color: 'var(--ink)' }}>{report.recoverable}</div><div className="text-xs mt-1" style={{ color: 'var(--muted)' }}>self-reported potentially recoverable marks</div></div></div>
              <div className="mt-5 rounded-xl p-4 text-sm leading-6" style={{ background: 'var(--bg-ivory)', color: 'var(--muted)' }}><strong style={{ color: 'var(--ink)' }}>Biggest leak:</strong> {report.topLeak?.label}. This is the first behaviour to attack before randomly rereading the whole syllabus.</div>
              <button type="button" onClick={shareScorecard} className="btn-outline-ink mt-5 w-full inline-flex items-center justify-center gap-2"><Share2 className="w-4 h-4" /> Share my scorecard</button>
              {shareStatus && <div className="text-xs text-center mt-2" style={{ color: 'var(--muted)' }}>{shareStatus}</div>}
              <p className="text-[11px] leading-5 mt-5" style={{ color: 'var(--subtle)' }}>This readiness score is a study-planning estimate from the information you entered. It is not a board-exam mark prediction or guarantee.</p>
            </div>

            <div className="space-y-6">
              <div className="card-paper p-6 sm:p-8"><span className="eyebrow">Marks Leak Map</span><h2 className="text-3xl mt-3" style={{ fontFamily: 'var(--font-serif)', color: 'var(--ink)' }}>Where your marks are disappearing</h2><div className="mt-6 space-y-4">{report.leakRows.map((item) => {
                const width = totalStatedLeak > 0 ? Math.max(3, (item.marks / totalStatedLeak) * 100) : 3;
                return <div key={item.id}><div className="flex justify-between gap-3 text-sm"><span style={{ color: 'var(--ink)' }}>{item.label}</span><strong style={{ color: 'var(--ink)' }}>{item.marks} marks</strong></div><div className="mt-2 h-2.5 rounded-full overflow-hidden" style={{ background: 'var(--border-soft)' }}><div className="h-full rounded-full" style={{ width: `${width}%`, background: 'var(--gold)' }} /></div></div>;
              })}</div></div>

              {report.weakTopics.length > 0 && <div className="card-paper p-6 sm:p-8"><span className="eyebrow">Weak-topic actions</span><h2 className="text-3xl mt-3" style={{ fontFamily: 'var(--font-serif)', color: 'var(--ink)' }}>Repair the exact chapters, not the whole book</h2><div className="grid sm:grid-cols-2 gap-3 mt-5">{report.weakTopics.map((topic) => <Link key={topic.id} to={topic.resource} className="tile-paper p-4"><div className="font-semibold" style={{ color: 'var(--ink)' }}>{topic.label}</div><p className="text-xs leading-5 mt-2" style={{ color: 'var(--muted)' }}>{topic.action}</p><span className="inline-flex items-center gap-1 mt-3 text-xs font-semibold" style={{ color: 'var(--gold)' }}>Open recovery resource <ArrowRight className="w-3.5 h-3.5" /></span></Link>)}</div></div>}

              <div className="card-paper p-6 sm:p-8"><span className="eyebrow">5-day recovery sprint</span><h2 className="text-3xl mt-3" style={{ fontFamily: 'var(--font-serif)', color: 'var(--ink)' }}>Your next five study moves</h2><div className="mt-6 space-y-4">{report.plan.map((item) => <div key={item.day} className="tile-paper p-4 flex gap-4"><div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 text-xs font-bold" style={{ background: 'var(--gold-bg)', color: 'var(--gold)' }}>{item.day.replace('Day ', 'D')}</div><div><div className="font-semibold" style={{ color: 'var(--ink)' }}>{item.title}</div><p className="text-sm leading-6 mt-1" style={{ color: 'var(--muted)' }}>{item.task}</p><Link to={item.resource} className="inline-flex items-center gap-1 mt-2 text-xs font-semibold" style={{ color: 'var(--gold)' }}>Start this step <ArrowRight className="w-3.5 h-3.5" /></Link></div></div>)}</div></div>
            </div>
          </div>
        </section>

        <section className="page-container pb-10">
          <div className="card-paper p-6 sm:p-8 grid lg:grid-cols-[1fr_.8fr] gap-6 items-center">
            <div><span className="eyebrow">Close the loop</span><h2 className="text-3xl mt-3" style={{ fontFamily: 'var(--font-serif)', color: 'var(--ink)' }}>Retest and measure recovered marks</h2><p className="text-sm leading-7 mt-3" style={{ color: 'var(--muted)' }}>After your recovery sprint, attempt another comparable test. Progress should be measured by errors removed and marks recovered, not by how many videos you watched.</p></div>
            <div className="tile-paper p-5"><label className="text-sm font-semibold" style={{ color: 'var(--ink)' }}>New score out of {report.maxScore}<input type="number" min="0" max={report.maxScore} step="any" value={retestScore} onChange={(e) => setRetestScore(e.target.value)} placeholder={`${Math.min(report.maxScore, report.currentScore + 5)}`} className="mt-2 w-full rounded-xl border px-4 py-3" style={{ borderColor: 'var(--border)', background: 'var(--bg-white)' }} /></label><button type="button" onClick={saveRetest} className="btn-primary w-full mt-3 inline-flex justify-center items-center gap-2"><TrendingUp className="w-4 h-4" /> Save retest</button>{retestScore !== '' && Number(retestScore) >= 0 && Number(retestScore) <= report.maxScore && <div className="mt-3 text-sm text-center" style={{ color: 'var(--muted)' }}>Change: <strong style={{ color: 'var(--ink)' }}>{Math.round((Number(retestScore) - report.currentScore) * 10) / 10 > 0 ? '+' : ''}{Math.round((Number(retestScore) - report.currentScore) * 10) / 10} marks</strong></div>}</div>
          </div>
        </section>

        <section className="page-container pb-10">
          <div className="card-paper p-6 sm:p-8 text-center"><BookOpen className="w-7 h-7 mx-auto" style={{ color: 'var(--gold)' }} /><h2 className="text-3xl mt-4" style={{ fontFamily: 'var(--font-serif)', color: 'var(--ink)' }}>Want a human to check the pattern?</h2><p className="text-sm leading-7 mt-3 mx-auto max-w-2xl" style={{ color: 'var(--muted)' }}>Bring your recent Commerce paper for a free paper analysis. The automated map gives you a starting point; a real review can catch context the self-diagnostic cannot see.</p><div className="mt-5 flex flex-wrap justify-center gap-3"><Link to="/book-demo?source=marks-recovery" className="btn-primary">Free paper analysis</Link><Link to="/test-series" className="btn-outline-ink">Take a practice test</Link></div></div>
        </section>

        <section className="page-container pb-16 text-center"><button type="button" onClick={startAgain} className="btn-outline-ink inline-flex items-center gap-2"><RefreshCcw className="w-4 h-4" /> Analyse another test</button></section>
      </>}

      {!report && history.length > 0 && <section className="page-container pb-16"><div className="card-paper p-6 sm:p-8"><span className="eyebrow">Saved on this device</span><h2 className="text-2xl mt-3" style={{ fontFamily: 'var(--font-serif)', color: 'var(--ink)' }}>Recent recovery checks</h2><div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-5">{history.slice(0, 6).map((item) => <div key={item.id} className="tile-paper p-4"><div className="text-xs" style={{ color: 'var(--muted)' }}>{new Date(item.createdAt).toLocaleDateString('en-IN')}</div><div className="font-semibold mt-1" style={{ color: 'var(--ink)' }}>{item.subjectLabel}</div><div className="text-sm mt-2" style={{ color: 'var(--muted)' }}>Readiness {item.readiness}/100 · Test {item.score}/{item.maxScore}</div>{item.retestScore != null && <div className="text-xs mt-2 font-semibold" style={{ color: item.recovered > 0 ? 'var(--green)' : 'var(--muted)' }}>Retest {item.retestScore}/{item.maxScore} · {item.recovered > 0 ? '+' : ''}{item.recovered} marks</div>}</div>)}</div></div></section>}

      <section className="page-container pb-16"><div className="grid sm:grid-cols-3 gap-4"><div className="card-paper p-5"><CheckCircle2 className="w-5 h-5" style={{ color: 'var(--gold)' }} /><h2 className="font-semibold mt-3" style={{ color: 'var(--ink)' }}>Detailed scores stay local</h2><p className="text-xs leading-5 mt-2" style={{ color: 'var(--muted)' }}>Your marks history is stored in this browser. No name, phone number or answer sheet is required.</p></div><div className="card-paper p-5"><BarChart3 className="w-5 h-5" style={{ color: 'var(--gold)' }} /><h2 className="font-semibold mt-3" style={{ color: 'var(--ink)' }}>Mistakes become data</h2><p className="text-xs leading-5 mt-2" style={{ color: 'var(--muted)' }}>Anonymous aggregate categories can help Smit Sir Commerce understand which Commerce mistakes appear most often.</p></div><div className="card-paper p-5"><TrendingUp className="w-5 h-5" style={{ color: 'var(--gold)' }} /><h2 className="font-semibold mt-3" style={{ color: 'var(--ink)' }}>Recovery, not completion</h2><p className="text-xs leading-5 mt-2" style={{ color: 'var(--muted)' }}>The loop ends with a retest so students measure actual improvement rather than just resource consumption.</p></div></div></section>
    </div>
  );
}
