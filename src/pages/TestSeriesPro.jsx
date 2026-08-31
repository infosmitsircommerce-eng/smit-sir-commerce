import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BarChart3, Crown, Lock, LogIn, Trophy, X } from 'lucide-react';
import BaseTestSeries from './TestSeries';
import TestSeriesSalesFunnel from '../components/test-series/TestSeriesSalesFunnel';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';

const STORAGE_PREFIX = 'ssc-test-attempts-v1';

function storageKey(userId) {
  return `${STORAGE_PREFIX}:${userId || 'guest'}`;
}

function readLocalAttempts(userId) {
  try {
    return JSON.parse(localStorage.getItem(storageKey(userId)) || '[]');
  } catch {
    return [];
  }
}

function writeLocalAttempt(userId, attempt) {
  const existing = readLocalAttempts(userId);
  const next = [attempt, ...existing].slice(0, 100);
  localStorage.setItem(storageKey(userId), JSON.stringify(next));
  return next;
}

function initialsFrom(name = 'Student') {
  return name.trim().split(/\s+/).map((part) => part[0]).join('').toUpperCase().slice(0, 2) || 'ST';
}

function AccessGate({ mode, onClose }) {
  if (!mode) return null;
  const needsLogin = mode === 'login';
  return (
    <div className="fixed inset-0 z-[140] flex items-center justify-center p-4" style={{ background: 'rgba(30,24,18,.72)', backdropFilter: 'blur(8px)' }}>
      <div className="card-paper max-w-md w-full p-7 relative text-center">
        <button onClick={onClose} aria-label="Close" className="absolute right-4 top-4 w-9 h-9 rounded-full flex items-center justify-center" style={{ background: 'var(--bg-ivory)', color: 'var(--muted)' }}><X className="w-4 h-4" /></button>
        <div className="w-14 h-14 rounded-2xl mx-auto flex items-center justify-center" style={{ background: 'var(--gold-bg)', color: 'var(--gold)' }}>{needsLogin ? <LogIn className="w-7 h-7" /> : <Crown className="w-7 h-7" />}</div>
        <h2 className="text-2xl mt-5" style={{ fontFamily: 'var(--font-serif)', color: 'var(--ink)' }}>{needsLogin ? 'Login to unlock Pro tests' : 'This is a Pro test'}</h2>
        <p className="mt-3 text-sm leading-relaxed" style={{ color: 'var(--muted)' }}>{needsLogin ? 'Create or sign in to your student account. Your scores and attempt history can then stay connected to your profile.' : 'Your account is currently on Free access. Pro tests are locked until your profile is upgraded.'}</p>
        <div className="grid gap-3 mt-6">
          {needsLogin ? <Link to="/login" className="btn-primary inline-flex items-center justify-center gap-2"><LogIn className="w-4 h-4" /> Login / Create account</Link> : <Link to="/contact" className="btn-primary inline-flex items-center justify-center gap-2"><Crown className="w-4 h-4" /> Ask for Pro access</Link>}
          <button onClick={onClose} className="btn-secondary">Not now</button>
        </div>
      </div>
    </div>
  );
}

function ProgressModal({ open, onClose, user, displayName, isPremium, refreshToken }) {
  const [cloudAttempts, setCloudAttempts] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [cloudAvailable, setCloudAvailable] = useState(true);
  const localAttempts = useMemo(() => readLocalAttempts(user?.id), [user?.id, refreshToken, open]);

  useEffect(() => {
    if (!open || !user) return;
    let cancelled = false;
    (async () => {
      const attemptsResult = await supabase.from('test_attempts').select('id,test_name,subject,score,total_questions,percentage,created_at').eq('user_id', user.id).order('created_at', { ascending: false }).limit(50);
      if (cancelled) return;
      if (attemptsResult.error) {
        setCloudAvailable(false);
        setCloudAttempts([]);
        setLeaderboard([]);
        return;
      }
      setCloudAvailable(true);
      setCloudAttempts(attemptsResult.data || []);

      const boardResult = await supabase.from('test_attempts').select('user_id,student_label,percentage,created_at').order('created_at', { ascending: false }).limit(250);
      if (cancelled || boardResult.error) return;
      const best = new Map();
      for (const row of boardResult.data || []) {
        const previous = best.get(row.user_id);
        if (!previous || Number(row.percentage) > Number(previous.percentage)) best.set(row.user_id, row);
      }
      setLeaderboard([...best.values()].sort((a, b) => Number(b.percentage) - Number(a.percentage)).slice(0, 10));
    })();
    return () => { cancelled = true; };
  }, [open, user, refreshToken]);

  if (!open) return null;

  const merged = cloudAttempts.length ? cloudAttempts : localAttempts;
  const percentages = merged.map((a) => Number(a.percentage ?? a.pct ?? 0));
  const bestScore = percentages.length ? Math.max(...percentages) : 0;
  const average = percentages.length ? Math.round(percentages.reduce((a, b) => a + b, 0) / percentages.length) : 0;
  const uniqueTests = new Set(merged.map((a) => a.test_name || a.testName)).size;

  return (
    <div className="fixed inset-0 z-[135] overflow-y-auto p-3 sm:p-6" style={{ background: 'rgba(30,24,18,.78)', backdropFilter: 'blur(8px)' }}>
      <div className="max-w-5xl mx-auto card-paper p-5 sm:p-8 relative">
        <button onClick={onClose} aria-label="Close progress" className="absolute right-4 top-4 w-9 h-9 rounded-full flex items-center justify-center" style={{ background: 'var(--bg-ivory)', color: 'var(--muted)' }}><X className="w-4 h-4" /></button>
        <div className="pr-12">
          <div className="eyebrow">Student progress</div>
          <h2 className="text-3xl mt-3" style={{ fontFamily: 'var(--font-serif)', color: 'var(--ink)' }}>{user ? `${displayName}'s Test Dashboard` : 'Your Test Progress'}</h2>
          <p className="mt-2 text-sm" style={{ color: 'var(--muted)' }}>{user ? (isPremium ? 'Premium account · Pro tests unlocked' : 'Free account · Pro tests stay locked') : 'Login to attach progress to a student profile.'}</p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mt-7">
          {[['Attempts', merged.length], ['Tests practised', uniqueTests], ['Best score', `${bestScore}%`], ['Average', `${average}%`]].map(([label, value]) => <div key={label} className="tile-paper p-4 text-center"><div className="text-2xl font-bold" style={{ fontFamily: 'var(--font-serif)', color: 'var(--ink)' }}>{value}</div><div className="text-xs mt-1" style={{ color: 'var(--muted)' }}>{label}</div></div>)}
        </div>

        {!user && <div className="mt-6 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3" style={{ background: 'var(--gold-bg)', border: '1px solid rgba(184,135,47,.25)' }}><div><strong style={{ color: 'var(--ink)' }}>Want saved history?</strong><div className="text-sm mt-1" style={{ color: 'var(--muted)' }}>Login before testing so attempts can be associated with your account.</div></div><Link to="/login" className="btn-primary">Login</Link></div>}

        <div className="grid lg:grid-cols-[1.25fr_.75fr] gap-6 mt-7">
          <section>
            <h3 className="text-xl mb-4" style={{ fontFamily: 'var(--font-serif)', color: 'var(--ink)' }}>Attempt history</h3>
            <div className="space-y-3 max-h-[430px] overflow-y-auto pr-1">
              {merged.length === 0 ? <div className="tile-paper p-6 text-center text-sm" style={{ color: 'var(--muted)' }}>No completed tests yet. Finish a test and your score will appear here.</div> : merged.map((attempt, index) => {
                const name = attempt.test_name || attempt.testName;
                const pct = Number(attempt.percentage ?? attempt.pct ?? 0);
                const date = new Date(attempt.created_at || attempt.createdAt || Date.now());
                return <div key={attempt.id || `${name}-${index}`} className="tile-paper p-4 flex items-center justify-between gap-4"><div><div className="font-semibold" style={{ color: 'var(--ink)' }}>{name}</div><div className="text-xs mt-1" style={{ color: 'var(--muted)' }}>{attempt.subject || 'Commerce'} · {date.toLocaleDateString('en-IN')}</div></div><div className="text-right"><div className="text-xl font-bold" style={{ color: pct >= 80 ? 'var(--green)' : 'var(--gold)' }}>{pct}%</div><div className="text-xs" style={{ color: 'var(--subtle)' }}>{attempt.score}/{attempt.total_questions || attempt.total}</div></div></div>;
              })}
            </div>
          </section>

          <section>
            <h3 className="text-xl mb-4 flex items-center gap-2" style={{ fontFamily: 'var(--font-serif)', color: 'var(--ink)' }}><Trophy className="w-5 h-5" style={{ color: 'var(--gold)' }} /> Leaderboard</h3>
            {!user ? <div className="tile-paper p-5 text-sm" style={{ color: 'var(--muted)' }}>Login to view the student leaderboard.</div> : !cloudAvailable ? <div className="tile-paper p-5 text-sm leading-relaxed" style={{ color: 'var(--muted)' }}>Your device history is working. The shared leaderboard will activate once the <code>test_attempts</code> database table is enabled.</div> : leaderboard.length === 0 ? <div className="tile-paper p-5 text-sm" style={{ color: 'var(--muted)' }}>No leaderboard scores yet.</div> : <div className="space-y-2">{leaderboard.map((row, index) => <div key={`${row.user_id}-${index}`} className="tile-paper p-3 flex items-center gap-3"><span className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold" style={{ background: index < 3 ? 'var(--gold-bg)' : 'var(--bg-ivory)', color: index < 3 ? 'var(--gold)' : 'var(--muted)' }}>{index + 1}</span><span className="flex-1 font-semibold" style={{ color: 'var(--ink)' }}>{row.student_label || 'ST'}</span><span className="font-bold" style={{ color: 'var(--gold)' }}>{Math.round(Number(row.percentage))}%</span></div>)}</div>}
          </section>
        </div>
      </div>
    </div>
  );
}

export default function TestSeriesPro() {
  const { user, isPremium, displayName } = useAuth();
  const navigate = useNavigate();
  const rootRef = useRef(null);
  const activeRef = useRef({ name: '', subject: '' });
  const savedFingerprint = useRef('');
  const [gate, setGate] = useState(null);
  const [showProgress, setShowProgress] = useState(false);
  const [refreshToken, setRefreshToken] = useState(0);

  const handleCapture = (event) => {
    const button = event.target.closest?.('button');
    if (!button) return;
    const label = button.textContent?.trim() || '';
    if (!label.includes('Start Test')) return;
    const card = button.closest('article');
    if (!card) return;
    const isPro = /\bPRO\b/.test(card.textContent || '');
    const heading = card.querySelector('h3')?.textContent?.trim() || 'Commerce Test';
    const meta = card.querySelector('.text-xs')?.textContent || '';
    const subject = meta.split('·')[0]?.trim() || 'Commerce';

    if (isPro && !user) {
      event.preventDefault();
      event.stopPropagation();
      setGate('login');
      return;
    }
    if (isPro && !isPremium) {
      event.preventDefault();
      event.stopPropagation();
      setGate('premium');
      return;
    }
    activeRef.current = { name: heading, subject };
  };

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;
    const observer = new MutationObserver(() => {
      const completed = [...root.querySelectorAll('.eyebrow')].find((node) => node.textContent?.trim() === 'Test completed');
      if (!completed) return;
      const modal = completed.closest('.card-paper');
      const scoreText = [...(modal?.querySelectorAll('h2') || [])].map((node) => node.textContent?.trim()).find((text) => /^\d+\/\d+$/.test(text || ''));
      if (!scoreText) return;
      const [score, total] = scoreText.split('/').map(Number);
      const fingerprint = `${activeRef.current.name}:${score}:${total}`;
      if (!activeRef.current.name || fingerprint === savedFingerprint.current) return;
      savedFingerprint.current = fingerprint;
      const percentage = Math.round((score / total) * 100);
      const attempt = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        userId: user?.id || null,
        testName: activeRef.current.name,
        subject: activeRef.current.subject,
        score,
        total,
        pct: percentage,
        createdAt: new Date().toISOString(),
      };
      writeLocalAttempt(user?.id, attempt);
      setRefreshToken((value) => value + 1);

      if (user) {
        const studentLabel = initialsFrom(displayName);
        supabase.from('test_attempts').insert({
          user_id: user.id,
          student_label: studentLabel,
          test_name: attempt.testName,
          subject: attempt.subject,
          score,
          total_questions: total,
          percentage,
          created_at: attempt.createdAt,
        }).then(() => {});
      }
    });
    observer.observe(root, { childList: true, subtree: true, characterData: true });
    return () => observer.disconnect();
  }, [user, displayName]);

  return (
    <>
      <div ref={rootRef} onClickCapture={handleCapture}><BaseTestSeries /></div>
      <TestSeriesSalesFunnel />

      <button onClick={() => setShowProgress(true)} className="fixed right-4 bottom-24 lg:bottom-6 z-40 rounded-full px-4 py-3 font-semibold shadow-xl inline-flex items-center gap-2" style={{ background: 'var(--ink)', color: '#fff', border: '1px solid rgba(184,135,47,.35)' }}><BarChart3 className="w-4 h-4" /> My Progress</button>

      <AccessGate mode={gate} onClose={() => setGate(null)} />
      <ProgressModal open={showProgress} onClose={() => setShowProgress(false)} user={user} displayName={displayName} isPremium={isPremium} refreshToken={refreshToken} />
    </>
  );
}
