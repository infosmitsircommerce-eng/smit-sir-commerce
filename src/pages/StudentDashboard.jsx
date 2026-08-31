import { useEffect, useMemo, useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import {
  AlarmClock, BarChart3, BookOpenCheck, Brain, CalendarDays, CheckCircle2,
  Clock3, Flame, GraduationCap, LineChart, Loader2, LogOut, Play,
  Settings, Sparkles, Target, Trophy
} from 'lucide-react';
import SEO from '../components/ui/SEO';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';

const EXAM_ATTEMPTS_KEY = 'ssc-exam-attempts-v1';
const MISTAKE_KEY = 'ssc-mistake-book-v1';
const DAILY_KEY = 'ssc-daily10-history-v1';
const CHAPTER_KEY = 'ssc-chapter-progress-v1';
const TEST_PREFIX = 'ssc-test-attempts-v1';

function read(key, fallback = []) {
  try { return JSON.parse(localStorage.getItem(key) || JSON.stringify(fallback)); } catch { return fallback; }
}
function pctOf(attempt) { return Number(attempt?.percentage ?? attempt?.pct ?? 0); }
function daysUntil(dateString) {
  if (!dateString) return null;
  const target = new Date(`${dateString}T00:00:00`);
  const today = new Date(); today.setHours(0, 0, 0, 0);
  if (Number.isNaN(target.getTime())) return null;
  return Math.max(0, Math.ceil((target - today) / 86400000));
}
function uniqueByFingerprint(items) {
  const seen = new Set();
  return items.filter((item) => {
    const key = item?.id || `${item?.test_name || item?.testName}-${item?.created_at || item?.createdAt}-${pctOf(item)}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function LoggedOut() {
  return <div className="min-h-screen flex items-center justify-center px-4" style={{ background: 'var(--bg-ivory)' }}><div className="card-paper max-w-md w-full p-8 text-center"><div className="w-14 h-14 rounded-2xl mx-auto flex items-center justify-center" style={{ background: 'var(--gold-bg)', color: 'var(--gold)' }}><GraduationCap className="w-7 h-7" /></div><h1 className="text-3xl mt-5" style={{ fontFamily: 'var(--font-serif)', color: 'var(--ink)' }}>Your study dashboard</h1><p className="text-sm mt-3 leading-relaxed" style={{ color: 'var(--muted)' }}>Sign in to see your own tests, mistakes, chapter progress and next study action.</p><Link to="/login" className="btn-primary mt-6 inline-flex w-full items-center justify-center">Login / Create account</Link></div></div>;
}

export default function StudentDashboard() {
  const { user, profile, loading, displayName, initials, isPremium, signOut } = useAuth();
  const navigate = useNavigate();
  const [cloudAttempts, setCloudAttempts] = useState([]);
  const [cloudReady, setCloudReady] = useState(true);
  const [refreshing, setRefreshing] = useState(true);

  const localExamAttempts = useMemo(() => read(EXAM_ATTEMPTS_KEY), [user?.id]);
  const localLegacyAttempts = useMemo(() => read(`${TEST_PREFIX}:${user?.id || 'guest'}`), [user?.id]);
  const mistakes = useMemo(() => read(MISTAKE_KEY), [user?.id]);
  const dailyHistory = useMemo(() => read(DAILY_KEY), [user?.id]);
  const chapterProgress = useMemo(() => read(CHAPTER_KEY), [user?.id]);

  useEffect(() => {
    if (!user?.id) { setRefreshing(false); return; }
    let cancelled = false;
    setRefreshing(true);
    supabase.from('test_attempts')
      .select('id,test_name,subject,score,total_questions,percentage,created_at')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(100)
      .then(({ data, error }) => {
        if (cancelled) return;
        setCloudReady(!error);
        setCloudAttempts(error ? [] : (data || []));
        setRefreshing(false);
      });
    return () => { cancelled = true; };
  }, [user?.id]);

  if (loading) return <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg-ivory)' }}><Loader2 className="w-7 h-7 animate-spin" style={{ color: 'var(--gold)' }} /></div>;
  if (!user) return <LoggedOut />;
  if (profile && profile.onboarding_completed === false) return <Navigate to="/onboarding" replace />;

  const attempts = uniqueByFingerprint(cloudAttempts.length ? cloudAttempts : [...localExamAttempts, ...localLegacyAttempts]);
  const percentages = attempts.map(pctOf).filter((value) => Number.isFinite(value));
  const average = percentages.length ? Math.round(percentages.reduce((sum, value) => sum + value, 0) / percentages.length) : 0;
  const best = percentages.length ? Math.max(...percentages) : 0;
  const pendingMistakes = mistakes.filter((item) => !item.mastered).length;
  const completedChapters = chapterProgress.filter((item) => item.completed).length;
  const examDays = daysUntil(profile?.exam_date);
  const subjects = profile?.subjects?.length ? profile.subjects : [];
  const classLevel = profile?.class_level || user?.user_metadata?.class_level || '—';
  const board = profile?.board || 'Not set';
  const goal = profile?.study_goal || 'Build consistent Commerce practice';

  const nextAction = (() => {
    if (pendingMistakes >= 5) return { icon: Brain, title: 'Clear your Mistake Book', text: `${pendingMistakes} questions still need another look.`, to: '/daily-practice', cta: 'Review mistakes' };
    if (attempts.length === 0) return { icon: AlarmClock, title: 'Take your first measured test', text: 'Start with a free Exam Mode test so your dashboard has real performance data.', to: '/exam-mode', cta: 'Start Exam Mode' };
    if (goal === 'Daily consistency') return { icon: Flame, title: 'Keep today small and consistent', text: 'Do Daily 10, then use Study Coach only if you need a next step.', to: '/daily-practice', cta: 'Do Daily 10' };
    if (goal === 'Concept clarity') return { icon: BookOpenCheck, title: 'Learn, then test the concept', text: 'Open your notes first, then verify understanding with practice.', to: '/cbse-notes', cta: 'Open notes' };
    return { icon: Target, title: 'Use your weakest result to choose revision', text: 'Learning Insights combines your tests, mistakes and chapter progress.', to: '/learning-insights', cta: 'Open Learning Insights' };
  })();

  const recent = attempts.slice(0, 5);
  const recentDaily = dailyHistory.slice(0, 7);
  const dailyAverage = recentDaily.length ? Math.round(recentDaily.reduce((sum, item) => sum + Number(item.percentage ?? item.pct ?? 0), 0) / recentDaily.length) : 0;

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-ivory)' }}>
      <SEO title="My Dashboard" description="Private student dashboard for Smit Sir Commerce." path="/dashboard" noindex />

      <section className="page-hero">
        <div className="page-container">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-lg font-black flex-shrink-0" style={{ background: 'linear-gradient(135deg,#C9A050,#B8872F)', color: '#1E1812' }}>{initials}</div>
              <div><span className="eyebrow">Your study workspace</span><h1 className="mt-2">Welcome back, <em>{displayName}.</em></h1><div className="flex flex-wrap gap-2 mt-3 text-xs font-semibold"><span className="tile-paper px-3 py-2">Class {classLevel}</span><span className="tile-paper px-3 py-2">{board}</span><span className="tile-paper px-3 py-2">{isPremium ? 'Pro access' : 'Free access'}</span></div></div>
            </div>
            <div className="flex flex-wrap gap-2"><Link to="/onboarding?edit=1" className="btn-secondary inline-flex items-center gap-2"><Settings className="w-4 h-4" /> Edit study setup</Link><button onClick={async () => { await signOut(); navigate('/'); }} className="btn-secondary inline-flex items-center gap-2"><LogOut className="w-4 h-4" /> Logout</button></div>
          </div>
        </div>
      </section>

      <main className="page-container section-padding space-y-7">
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { icon: Trophy, label: 'Tests completed', value: refreshing ? '…' : attempts.length },
            { icon: BarChart3, label: 'Average score', value: attempts.length ? `${average}%` : '—' },
            { icon: Brain, label: 'Mistakes to revisit', value: pendingMistakes },
            { icon: CheckCircle2, label: 'Chapters completed', value: completedChapters },
          ].map(({ icon: Icon, label, value }) => <div key={label} className="card-paper p-4 sm:p-5"><Icon className="w-5 h-5" style={{ color: 'var(--gold)' }} /><div className="text-2xl sm:text-3xl font-bold mt-3" style={{ fontFamily: 'var(--font-serif)', color: 'var(--ink)' }}>{value}</div><div className="text-xs mt-1" style={{ color: 'var(--muted)' }}>{label}</div></div>)}
        </section>

        <section className="grid lg:grid-cols-[1.25fr_.75fr] gap-5">
          <div className="rounded-3xl p-6 sm:p-8" style={{ background: 'var(--ink)', color: '#fff' }}>
            <div className="flex items-start gap-4"><div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(231,198,108,.12)', color: '#e7c66c' }}><nextAction.icon className="w-6 h-6" /></div><div><div className="text-xs font-bold uppercase tracking-widest" style={{ color: '#e7c66c' }}>Recommended next action</div><h2 className="text-3xl mt-2" style={{ fontFamily: 'var(--font-serif)' }}>{nextAction.title}</h2><p className="text-sm mt-3 max-w-2xl leading-relaxed" style={{ color: 'var(--muted-on-ink)' }}>{nextAction.text}</p><Link to={nextAction.to} className="btn-gold mt-5 inline-flex items-center gap-2"><Play className="w-4 h-4" /> {nextAction.cta}</Link></div></div>
          </div>

          <div className="card-paper p-6">
            <div className="flex items-center justify-between"><div><span className="eyebrow">Your setup</span><h2 className="text-2xl mt-2" style={{ fontFamily: 'var(--font-serif)', color: 'var(--ink)' }}>What you are preparing for</h2></div><Target className="w-6 h-6" style={{ color: 'var(--gold)' }} /></div>
            <div className="mt-5 text-sm"><div style={{ color: 'var(--muted)' }}>Main goal</div><div className="font-semibold mt-1" style={{ color: 'var(--ink)' }}>{goal}</div></div>
            {examDays !== null && <div className="mt-4 rounded-xl p-4" style={{ background: 'var(--gold-bg)' }}><div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--gold)' }}><CalendarDays className="w-4 h-4" /> Your exam date</div><div className="text-2xl font-bold mt-2" style={{ color: 'var(--ink)' }}>{examDays} day{examDays === 1 ? '' : 's'} left</div><div className="text-xs mt-1" style={{ color: 'var(--muted)' }}>Based only on the date you entered — not an assumed board timetable.</div></div>}
            <div className="flex flex-wrap gap-2 mt-5">{subjects.length ? subjects.map((subject) => <span key={subject} className="text-xs font-semibold px-3 py-2 rounded-full" style={{ background: 'var(--bg-ivory)', color: 'var(--charcoal)', border: '1px solid var(--border)' }}>{subject}</span>) : <span className="text-sm" style={{ color: 'var(--muted)' }}>No subjects selected yet.</span>}</div>
          </div>
        </section>

        <section className="grid lg:grid-cols-[1.2fr_.8fr] gap-5">
          <div className="card-paper p-6 sm:p-8">
            <div className="flex items-center justify-between gap-4"><div><span className="eyebrow">Measured performance</span><h2 className="text-2xl mt-2" style={{ fontFamily: 'var(--font-serif)', color: 'var(--ink)' }}>Recent tests</h2></div><Link to="/learning-insights" className="text-sm font-semibold" style={{ color: 'var(--gold)' }}>See full insights</Link></div>
            <div className="space-y-3 mt-5">
              {recent.length === 0 ? <div className="tile-paper p-6 text-center"><AlarmClock className="w-7 h-7 mx-auto" style={{ color: 'var(--gold)' }} /><div className="font-semibold mt-3" style={{ color: 'var(--ink)' }}>No test results yet</div><p className="text-sm mt-1" style={{ color: 'var(--muted)' }}>Your actual scores will appear here after you complete a test.</p><Link to="/exam-mode" className="btn-primary mt-4 inline-flex">Take a free test</Link></div> : recent.map((attempt, index) => { const pct = pctOf(attempt); const name = attempt.test_name || attempt.testName || 'Commerce Test'; const dateValue = attempt.created_at || attempt.createdAt; return <div key={attempt.id || `${name}-${index}`} className="tile-paper p-4 flex items-center gap-4"><div className="w-11 h-11 rounded-xl flex items-center justify-center font-bold" style={{ background: pct >= 80 ? 'rgba(77,124,15,.08)' : 'var(--gold-bg)', color: pct >= 80 ? 'var(--green)' : 'var(--gold)' }}>{pct}%</div><div className="min-w-0 flex-1"><div className="font-semibold truncate" style={{ color: 'var(--ink)' }}>{name}</div><div className="text-xs mt-1" style={{ color: 'var(--muted)' }}>{attempt.subject || 'Commerce'}{dateValue ? ` · ${new Date(dateValue).toLocaleDateString('en-IN')}` : ''}</div></div></div>; })}
            </div>
            {!cloudReady && <p className="text-xs mt-4" style={{ color: 'var(--muted)' }}>Cloud attempt history was unavailable just now, so this dashboard is using your device progress instead.</p>}
          </div>

          <div className="card-paper p-6 sm:p-8">
            <span className="eyebrow">Consistency</span><h2 className="text-2xl mt-2" style={{ fontFamily: 'var(--font-serif)', color: 'var(--ink)' }}>Daily practice snapshot</h2>
            <div className="grid grid-cols-2 gap-3 mt-5"><div className="tile-paper p-4"><Flame className="w-5 h-5" style={{ color: 'var(--gold)' }} /><div className="text-2xl font-bold mt-2" style={{ color: 'var(--ink)' }}>{recentDaily.length}</div><div className="text-xs" style={{ color: 'var(--muted)' }}>recent Daily 10 sessions</div></div><div className="tile-paper p-4"><LineChart className="w-5 h-5" style={{ color: 'var(--gold)' }} /><div className="text-2xl font-bold mt-2" style={{ color: 'var(--ink)' }}>{recentDaily.length ? `${dailyAverage}%` : '—'}</div><div className="text-xs" style={{ color: 'var(--muted)' }}>recent practice average</div></div></div>
            <Link to="/daily-practice" className="btn-primary w-full mt-5 inline-flex items-center justify-center gap-2"><Clock3 className="w-4 h-4" /> Do today's Daily 10</Link>
          </div>
        </section>

        <section>
          <div className="text-center max-w-2xl mx-auto"><span className="eyebrow">Study path</span><h2 className="text-3xl mt-3" style={{ fontFamily: 'var(--font-serif)', color: 'var(--ink)' }}>Everything here should lead to an action.</h2></div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
            {[
              { icon: BookOpenCheck, title: 'Learn', text: 'Open published chapter notes and mark chapters complete.', to: '/cbse-notes' },
              { icon: AlarmClock, title: 'Test', text: 'Use Exam Mode for timed, measured practice.', to: '/exam-mode' },
              { icon: Brain, title: 'Fix', text: 'Use mistakes and Study Coach to target weak areas.', to: '/study-coach' },
              { icon: BarChart3, title: 'Measure', text: 'Review learning estimates from your actual activity.', to: '/learning-insights' },
            ].map(({ icon: Icon, title, text, to }) => <Link key={title} to={to} className="card-paper p-5 hover:-translate-y-1 transition-transform"><Icon className="w-6 h-6" style={{ color: 'var(--gold)' }} /><h3 className="font-bold mt-4" style={{ color: 'var(--ink)' }}>{title}</h3><p className="text-sm mt-2 leading-relaxed" style={{ color: 'var(--muted)' }}>{text}</p></Link>)}
          </div>
        </section>

        {attempts.length > 0 && <section className="rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4" style={{ background: 'var(--gold-bg)', border: '1px solid rgba(184,135,47,.2)' }}><div><div className="font-semibold" style={{ color: 'var(--ink)' }}>Best measured test score: {best}%</div><div className="text-xs mt-1" style={{ color: 'var(--muted)' }}>Scores are practice results from this platform, not official school grades.</div></div><Link to="/my-data" className="btn-secondary">Manage study data</Link></section>}
      </main>
    </div>
  );
}
