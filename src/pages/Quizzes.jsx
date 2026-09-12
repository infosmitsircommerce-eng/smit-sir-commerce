import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { createPortal } from 'react-dom';
import { ArrowLeft, ArrowRight, BadgeCheck, BookOpen, CheckCircle2, ChevronRight, CircleAlert, GraduationCap, Layers3, RotateCcw, ShieldCheck, Sparkles, Target, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { quizPageById } from '../data/quizDiscovery';
import SEO from '../components/ui/SEO';
import { getQuizPacks, quizBoards, quizLevels } from '../data/quizPublic';

const levelMeta = {
  Easy: { label: 'Easy', note: 'Definitions & direct recall', icon: '🌱' },
  Moderate: { label: 'Moderate', note: 'Concept understanding', icon: '🎯' },
  Hard: { label: 'Hard', note: 'Application & tricky choices', icon: '🔥' },
  Extreme: { label: 'Extreme', note: 'High-level application', icon: '⚡' },
};

function StepChip({ active, done, children }) {
  return (
    <div className="flex items-center gap-2 text-xs font-bold">
      <span
        className="w-7 h-7 rounded-full flex items-center justify-center"
        style={{
          background: active || done ? 'var(--gold)' : 'var(--bg-white)',
          color: active || done ? '#fff' : 'var(--subtle)',
          border: active || done ? '1px solid var(--gold)' : '1px solid var(--border)',
        }}
      >
        {done ? '✓' : children[0]}
      </span>
      <span style={{ color: active ? 'var(--ink)' : 'var(--muted)' }}>{children}</span>
    </div>
  );
}

function SourceBadge({ children }) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[11px] font-black" style={{ background: '#eef8ef', color: '#2f6b3a', border: '1px solid #cfe6d2' }}>
      <ShieldCheck className="w-3.5 h-3.5" /> {children}
    </div>
  );
}

function QuizDialog({ children, onClose, resetKey }) {
  const panel = useRef(null);
  useEffect(() => {
    const previous = document.activeElement, overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden'; panel.current?.focus();
    return () => { document.body.style.overflow = overflow; if (previous?.isConnected) previous.focus(); };
  }, []);
  useEffect(() => { panel.current?.scrollTo({ top: 0 }); }, [resetKey]);
  const handleKeyDown = (event) => {
    if (event.key === 'Escape') { event.stopPropagation(); onClose(); }
    if (event.key !== 'Tab') return;
    const nodes = [...panel.current.querySelectorAll('button:not([disabled]), a[href], [tabindex="0"]')];
    const first = nodes[0], last = nodes[nodes.length - 1];
    if (event.shiftKey && (document.activeElement === first || document.activeElement === panel.current)) {
      event.preventDefault(); last?.focus();
    } else if (!event.shiftKey && (document.activeElement === last || document.activeElement === panel.current)) {
      event.preventDefault(); first?.focus();
    }
  };
  return createPortal(
    <div style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(16,20,30,.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '12px', overscrollBehavior: 'contain' }}>
      <div ref={panel} role="dialog" aria-modal="true" aria-label="Chapter quiz" tabIndex={-1} onKeyDown={handleKeyDown}
        style={{ width: 'min(100%, 720px)', maxHeight: 'calc(100dvh - 24px)', overflowY: 'auto', overscrollBehavior: 'contain', borderRadius: '20px', background: '#fff', color: '#172033', boxSizing: 'border-box', padding: 'clamp(16px, 3vw, 28px)', overflowWrap: 'anywhere', boxShadow: '0 20px 70px rgba(0,0,0,.25)' }}>
        {children}
      </div>
    </div>,
    document.body
  );
}

function QuizPlayer({ pack, level, onClose }) {
  const levelLabel = pack.board === 'GSEB' && level === 'Moderate' ? 'Medium' : level;
  const questions = pack.levels[level] || [];
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [finished, setFinished] = useState(false);

  const question = questions[current];

  const next = () => {
    if (selected === null) return;
    const nextAnswers = [...answers, selected];
    if (current + 1 < questions.length) {
      setAnswers(nextAnswers);
      setCurrent((value) => value + 1);
      setSelected(null);
    } else {
      setAnswers(nextAnswers);
      setFinished(true);
    }
  };

  const restart = () => {
    setCurrent(0);
    setSelected(null);
    setAnswers([]);
    setFinished(false);
  };

  if (finished) {
    const correct = answers.filter((answer, index) => answer === questions[index].answer).length;
    const score = Math.round((correct / questions.length) * 100);
    const mistakes = questions
      .map((item, index) => ({ item, selected: answers[index], index }))
      .filter(({ item, selected }) => selected !== item.answer);
    const performance = score >= 90
      ? { icon: '🏆', title: 'Mastered', note: 'Excellent command. Move to the next level.' }
      : score >= 75
        ? { icon: '🔥', title: 'Strong', note: 'Very good. Review the missed concepts once.' }
        : score >= 60
          ? { icon: '🎯', title: 'Building', note: 'You understand the base. Fix the weak spots before moving up.' }
          : { icon: '📚', title: 'Revise first', note: 'Revisit the explanations below, then retry this level.' };

    return (
      <QuizDialog onClose={onClose} resetKey={finished ? 'result' : current}>
            <div className="text-center">
              <div className="text-5xl">{performance.icon}</div>
              <span className="eyebrow mt-4 inline-block">{pack.board} · Class {pack.classLevel} · {pack.subject} · {levelLabel}</span>
              <h2 className="text-3xl mt-3" style={{ fontFamily: 'var(--font-serif)', color: 'var(--ink)' }}>{performance.title}</h2>
              <div className="text-6xl font-black mt-3" style={{ color: 'var(--gold)' }}>{score}%</div>
              <p className="mt-2 text-sm font-semibold" style={{ color: 'var(--charcoal)' }}>{correct} correct out of {questions.length}</p>
              <p className="mt-2 text-sm" style={{ color: 'var(--muted)' }}>{performance.note}</p>
            </div>

            <div className="grid grid-cols-3 gap-3 mt-6">
              <div className="rounded-2xl p-4 text-center" style={{ background: '#eef8ef', border: '1px solid #cfe6d2' }}>
                <div className="text-2xl font-black" style={{ color: '#2f6b3a' }}>{correct}</div>
                <div className="text-[11px] font-bold mt-1" style={{ color: '#50765a' }}>Correct</div>
              </div>
              <div className="rounded-2xl p-4 text-center" style={{ background: '#fff2f0', border: '1px solid #efd0cb' }}>
                <div className="text-2xl font-black" style={{ color: '#8b3328' }}>{mistakes.length}</div>
                <div className="text-[11px] font-bold mt-1" style={{ color: '#8b5b55' }}>To revise</div>
              </div>
              <div className="rounded-2xl p-4 text-center" style={{ background: 'var(--gold-bg)', border: '1px solid rgba(184,135,47,.2)' }}>
                <div className="text-2xl font-black" style={{ color: 'var(--gold)' }}>{levelLabel}</div>
                <div className="text-[11px] font-bold mt-1" style={{ color: 'var(--muted)' }}>Level</div>
              </div>
            </div>

            {mistakes.length > 0 && (
              <div className="mt-6">
                <div className="flex items-center justify-between gap-3 mb-3">
                  <div>
                    <div className="text-sm font-black" style={{ color: 'var(--ink)' }}>Mistakes to revise</div>
                    <div className="text-xs mt-1" style={{ color: 'var(--muted)' }}>Only the concepts you missed — no need to reread everything.</div>
                  </div>
                  <Target className="w-5 h-5 shrink-0" style={{ color: 'var(--gold)' }} />
                </div>
                <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                  {mistakes.map(({ item, index }) => (
                    <div key={index} className="rounded-2xl p-4" style={{ background: 'var(--bg-ivory)', border: '1px solid var(--border-soft)' }}>
                      <div className="text-[10px] font-black uppercase tracking-wider" style={{ color: 'var(--gold)' }}>Question {index + 1}</div>
                      <div className="text-sm font-semibold mt-1 leading-6" style={{ color: 'var(--ink)' }}>{item.q}</div>
                      <div className="text-xs mt-2" style={{ color: '#2f6b3a' }}><strong>Correct answer:</strong> {item.options[item.answer]}</div>
                      <p className="text-xs mt-2 leading-6" style={{ color: 'var(--muted)' }}>{item.explanation}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-3 mt-6">
              <button onClick={restart} className="btn-secondary inline-flex items-center justify-center gap-2"><RotateCcw className="w-4 h-4" /> Retry level</button>
              <button onClick={onClose} className="btn-primary inline-flex items-center justify-center gap-2">Back to levels <CheckCircle2 className="w-4 h-4" /></button>
            </div>

            <p className="text-[11px] mt-4 leading-5 text-center" style={{ color: 'var(--subtle)' }}>Source: {pack.sourceLabel}</p>
          </QuizDialog>
    );
  }

  return (
    <QuizDialog onClose={onClose} resetKey={finished ? 'result' : current}>
          <div className="flex items-start justify-between gap-4">
            <div>
              <SourceBadge>{pack.sourceStatus}</SourceBadge>
              <div className="text-xs font-bold mt-3" style={{ color: 'var(--muted)' }}>{pack.board} · Class {pack.classLevel} · {pack.subject} · {pack.chapter}</div>
              <h2 className="text-2xl mt-1" style={{ fontFamily: 'var(--font-serif)', color: 'var(--ink)' }}>{pack.title} — {levelLabel}</h2>
            </div>
            <button type="button" onClick={onClose} className="w-10 h-10 shrink-0 rounded-full flex items-center justify-center" style={{ border: '1px solid var(--border)', color: 'var(--muted)' }} aria-label="Close quiz">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="mt-5">
            <div className="flex items-center justify-between text-xs font-bold mb-2" style={{ color: 'var(--muted)' }}>
              <span>Question {current + 1} of {questions.length}</span>
              <span>{Math.round(((current + 1) / questions.length) * 100)}%</span>
            </div>
            <div className="h-2 rounded-full overflow-hidden" style={{ background: 'var(--bg-ivory)' }}>
              <div className="h-full transition-all duration-300" style={{ width: `${((current + 1) / questions.length) * 100}%`, background: 'var(--gold)' }} />
            </div>
          </div>

          <h3 className="text-xl sm:text-2xl leading-snug mt-7" style={{ fontFamily: 'var(--font-serif)', color: 'var(--ink)' }}>{question.q}</h3>

          <div className="grid gap-3 mt-5">
            {question.options.map((option, index) => {
              const answered = selected !== null;
              const isCorrect = index === question.answer;
              const isChosen = index === selected;
              let background = '#fff';
              let border = 'var(--border)';
              let color = 'var(--charcoal)';

              if (answered && isCorrect) {
                background = '#eef8ef';
                border = '#9dc8a3';
                color = '#245d2d';
              } else if (answered && isChosen && !isCorrect) {
                background = '#fff2f0';
                border = '#e6a49b';
                color = '#8b3328';
              }

              return (
                <button
                  key={option}
                  type="button"
                  disabled={answered}
                  onClick={() => setSelected(index)}
                  className="w-full text-left rounded-2xl p-4 flex items-start gap-3 transition-all"
                  style={{ background, border: `1px solid ${border}`, color }}
                >
                  <span className="w-8 h-8 rounded-xl flex items-center justify-center text-xs font-black shrink-0" style={{ background: 'var(--bg-ivory)', color: 'var(--gold)' }}>
                    {String.fromCharCode(65 + index)}
                  </span>
                  <span className="font-semibold leading-7">{option}</span>
                </button>
              );
            })}
          </div>

          {selected !== null && (
            <div className="mt-5 rounded-2xl p-4" style={{ background: selected === question.answer ? '#eef8ef' : '#fff8e8', border: selected === question.answer ? '1px solid #cfe6d2' : '1px solid #ead7a2' }}>
              <div className="font-black text-sm" style={{ color: selected === question.answer ? '#2f6b3a' : '#7f5b16' }}>
                {selected === question.answer ? 'Correct' : 'Learn this before moving on'}
              </div>
              <p className="text-sm mt-1 leading-7" style={{ color: 'var(--charcoal)' }}>{question.explanation}</p>
            </div>
          )}

          <button type="button" onClick={next} disabled={selected === null} className="btn-primary w-full mt-5 inline-flex items-center justify-center gap-2 disabled:opacity-40">
            {current + 1 === questions.length ? 'Finish level' : 'Next question'} <ArrowRight className="w-4 h-4" />
          </button>

          <p className="text-[11px] mt-4 leading-5" style={{ color: 'var(--subtle)' }}>Source: {pack.sourceLabel}</p>
        </QuizDialog>
  );
}


function PaymentClaimForm() {
  const [reference, setReference] = useState('');
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  async function submit(event) {
    event.preventDefault();
    setBusy(true);
    setMessage('');
    const { error } = await supabase.rpc('submit_premium_payment_claim', { p_reference: reference.trim() });
    if (error) setMessage(error.code === '23505' ? 'This transaction reference was already submitted or verified.' : error.message);
    else {
      setReference('');
      setMessage('Payment reference submitted. Premium will unlock after Smit Sir verifies receipt.');
    }
    setBusy(false);
  }
  return <form onSubmit={submit} className="rounded-xl p-4 mt-5" style={{ background: 'var(--gold-bg)', border: '1px solid rgba(184,135,47,.24)' }}>
    <label className="text-sm font-bold">Submit your transaction reference
      <input required minLength={6} maxLength={80} pattern="[A-Za-z0-9/\\-]{6,80}" value={reference} onChange={(event) => setReference(event.target.value)} placeholder="Example: UPI transaction reference" className="w-full mt-2 rounded-lg border p-3 bg-white" />
    </label>
    <button disabled={busy} className="btn-primary w-full mt-3">{busy ? 'Submitting…' : 'Submit payment for verification'}</button>
    {message && <p role="status" className="text-sm mt-3 leading-6">{message}</p>}
  </form>;
}

function PremiumOffer({ onClose }) {
  const { user } = useAuth();
  return (
    <QuizDialog onClose={onClose}>
      <div className="flex justify-between items-start gap-4">
        <div><span className="eyebrow">Smit Sir Commerce Premium</span><h2 className="text-3xl mt-3">Go beyond the basics.</h2></div>
        <button type="button" onClick={onClose} aria-label="Close premium details" className="p-2 shrink-0"><X className="w-5 h-5" /></button>
      </div>
      <p className="text-4xl font-black mt-5" style={{ color: 'var(--gold)' }}>₹999</p>
      <p className="font-semibold mt-2">One-time payment · Lifetime access · No subscription</p>
      <p className="text-sm mt-3 leading-6">Lifetime access means no scheduled expiry for your Premium account while Smit Sir Commerce operates. This plan covers digital study resources; personal tuition and live classes are separate.</p>
      <div className="grid sm:grid-cols-2 gap-4 mt-6">
        <div className="rounded-xl p-4" style={{ background: 'var(--gold-bg)' }}>
          <h3 className="font-bold">Premium practice</h3>
          <ul className="list-disc pl-5 space-y-2 mt-3 text-sm leading-6">
            <li>Hard and Extreme chapter quizzes</li>
            <li>Macroeconomics, Microeconomics and Indian Economic Development</li>
            <li>Answer explanations and review of mistakes</li>
            <li>Published Pro test series and exam practice</li>
          </ul>
        </div>
        <div className="rounded-xl p-4" style={{ background: 'var(--bg-ivory)' }}>
          <h3 className="font-bold">Planned additions</h3>
          <ul className="list-disc pl-5 space-y-2 mt-3 text-sm leading-6">
            <li>Extra-detailed chapter notes</li>
            <li>Step-by-step topic explanations and worked examples</li>
            <li>Revision sheets and additional practice sets</li>
          </ul>
          <p className="text-sm mt-3">These materials are being prepared and are not yet available in every chapter.</p>
        </div>
      </div>
      <Link to="/premium" className="btn-secondary w-full mt-5">See full Premium offer</Link>
      <p className="text-sm mt-5 leading-6"><strong>Always free:</strong> Easy and Moderate quizzes, their answer explanations, and currently published free notes.</p>

      <div className="rounded-xl p-5 mt-5" style={{ background: '#f8fafc', border: '1px solid #e2e8f0' }}>
        <h3 className="text-xl font-bold">Pay ₹999 once. Keep learning.</h3>
        <p className="text-sm mt-2 leading-6">Scan this QR with your UPI app and enter ₹999. Check the recipient shown in your payment app before confirming.</p>
        <img src="/premium-payment-qr.jpg" alt="UPI QR supplied by Smit Sir Commerce for the ₹999 lifetime Premium plan"
          width="971" height="975" style={{ display: 'block', width: 'min(100%, 280px)', height: 'auto', objectFit: 'contain', margin: '16px auto', background: '#fff' }} />
        <a href="/premium-payment-qr.jpg" download="Smit-Sir-Premium-QR.jpg" className="btn-secondary w-full">Download QR</a>
        <ol className="list-decimal pl-5 space-y-2 mt-5 text-sm leading-6">
          <li>Create or sign in to your student account.</li>
          <li>Pay ₹999 using the QR above.</li>
          <li>Send the payment receipt, transaction reference and your account email to Smit Sir using the button below.</li>
          <li>After Smit Sir verifies the payment and activates your account, sign in again to access Premium.</li>
        </ol>
        {user && <PaymentClaimForm />}
        <p className="text-sm mt-4 font-semibold">Scanning the QR or sending a receipt does not automatically unlock Premium. Please wait for payment verification; do not pay again while waiting.</p>
        {!user && <Link to="/login" className="btn-primary w-full mt-4">Sign in / create account</Link>}
        <a href="https://wa.me/916353709585?text=Hello%20Smit%20Sir%2C%20please%20verify%20my%20%E2%82%B9999%20lifetime%20Premium%20payment.%20I%20will%20share%20my%20receipt%2C%20transaction%20reference%20and%20student%20account%20email." target="_blank" rel="noopener noreferrer" className="btn-primary w-full mt-4">Send payment details for verification</a>
      </div>
      <button type="button" onClick={onClose} className="btn-secondary w-full mt-3">Continue with free quizzes</button>
    </QuizDialog>
  );
}

export function LevelGrid({ pack, onAttempt }) {
  const { isPremium, isAdmin, loading } = useAuth();
  const [showPremium, setShowPremium] = useState(false);
  const [loadedPack, setLoadedPack] = useState(pack);
  const [fetching, setFetching] = useState(false);
  const [loadError, setLoadError] = useState('');
  async function openLevel(level) {
    setLoadError('');
    if (['Easy', 'Moderate'].includes(level)) { onAttempt?.(); setActiveLevel(level); return; }
    if (!premiumAccess) { setShowPremium(true); return; }
    setFetching(true);
    try {
      const { supabase } = await import('../lib/supabase');
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('Please sign in again.');
      const response = await fetch('/api/premium-quiz', { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + session.access_token }, body: JSON.stringify({ packId: pack.id, level }) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Unable to load quiz.');
      if (!Array.isArray(data.questions) || !data.questions.length) throw new Error('Quiz is unavailable.');
      setLoadedPack({ ...pack, levels: { ...pack.levels, [level]: data.questions } });
      onAttempt?.();
      setActiveLevel(level);
    } catch (error) { setLoadError(error.message); }
    finally { setFetching(false); }
  }
  const premiumAccess = isPremium || isAdmin;
  const [activeLevel, setActiveLevel] = useState(null);

  return (
    <>
      {fetching && <p role="status">Loading your Premium quiz…</p>}
      {loadError && <p role="alert" className="text-red-700">{loadError}</p>}
      {showPremium && <PremiumOffer onClose={() => setShowPremium(false)} />}
      {activeLevel && (['Easy', 'Moderate'].includes(activeLevel) || premiumAccess) && <QuizPlayer pack={loadedPack} level={activeLevel} onClose={() => setActiveLevel(null)} />}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mt-5">
        {quizLevels.map((level) => {
          const questionCount = pack.levelCounts?.[level] || pack.levels[level]?.length || 0;
          const meta = levelMeta[level];
          const premiumLevel = level === 'Hard' || level === 'Extreme';
          const locked = premiumLevel && !premiumAccess;
          return (
            <button
              key={level}
              type="button"
              onClick={() => openLevel(level)}
              disabled={!questionCount || fetching || (premiumLevel && loading)}
              className="tile-paper p-4 text-left disabled:opacity-50" style={{ minHeight: '144px', minWidth: 0 }}
            >
              <div className="text-2xl">{meta.icon}</div>
              <div className="font-black mt-2" style={{ color: 'var(--ink)' }}>{pack.board === 'GSEB' && level === 'Moderate' ? 'Medium' : meta.label}</div>
              <div className="text-xs font-bold mt-1" style={{ color: 'var(--gold)' }}>{premiumLevel ? (loading ? 'Checking access…' : locked ? 'Premium · ₹999 lifetime' : 'Premium unlocked') : 'Free'}</div>
              <p className="text-xs mt-1 leading-5" style={{ color: 'var(--muted)' }}>{meta.note}</p>
              <div className="flex items-center justify-between mt-4 text-xs font-bold">
                <span style={{ color: 'var(--gold)' }}>{questionCount} questions</span>
                <ChevronRight className="w-4 h-4" style={{ color: 'var(--gold)' }} />
              </div>
            </button>
          );
        })}
      </div>
    </>
  );
}

function VerifiedPackCard({ pack }) {
  const totalQuestions = Object.values(pack.levelCounts || {}).reduce((sum, count) => sum + count, 0);

  return (
    <article className="card-paper p-5 sm:p-7" style={{ transform: 'none' }}>
      <div className="grid lg:grid-cols-[minmax(0,1fr)_260px] gap-5">
        <div>
          <SourceBadge>{pack.sourceStatus}</SourceBadge>
          <div className="text-xs font-black uppercase tracking-[.12em] mt-4" style={{ color: 'var(--gold)' }}>{pack.chapter}</div>
          <h3 className="text-2xl sm:text-3xl mt-1" style={{ fontFamily: 'var(--font-serif)', color: 'var(--ink)' }}>{pack.title}</h3>
          <p className="text-sm mt-2 leading-7 max-w-3xl" style={{ color: 'var(--muted)' }}>Every level uses the same verified chapter source but changes the thinking required — from direct recall to high-level application.</p>
          <div className="inline-flex items-center gap-2 mt-4 text-xs font-black px-3 py-2 rounded-full" style={{ background: 'var(--gold-bg)', color: 'var(--gold)', border: '1px solid rgba(184,135,47,.18)' }}>
            <Sparkles className="w-4 h-4" /> {totalQuestions} verified questions · 4 levels
          </div>
        </div>
        <div className="rounded-2xl p-4 min-w-0" style={{ background: 'var(--bg-ivory)', border: '1px solid var(--border-soft)' }}>
          <div className="text-xs font-bold" style={{ color: 'var(--subtle)' }}>Source</div>
          <div className="text-sm font-semibold mt-1 leading-6" style={{ color: 'var(--charcoal)' }}>{pack.sourceLabel}</div>
        </div>
      </div>
      {quizPageById[pack.id] && <Link className="inline-block underline mt-4 text-sm font-bold" to={quizPageById[pack.id].path}>{pack.title} MCQs, answers and revision</Link>}
      <LevelGrid pack={pack} />
    </article>
  );
}

export default function Quizzes() {
  const [params] = useSearchParams();
  const initialStream = params.get('subject');
  const [boardId, setBoardId] = useState(params.get('board') === 'GSEB' ? 'GSEB' : 'CBSE');
  const [classLevel, setClassLevel] = useState(params.get('class') === '12' || initialStream === 'macro' || initialStream === 'ied' ? 12 : 11);
  const [subjectName, setSubjectName] = useState(initialStream === 'Business Studies' ? 'Business Studies' : 'Economics');
  const [streamFilter, setStreamFilter] = useState(initialStream === 'macro' ? 'Macroeconomics' : initialStream === 'ied' ? 'Indian Economic Development' : null);
  const [chapterId, setChapterId] = useState(params.get('pack') || '');
  useEffect(() => {
    const id = params.get('pack');
    const target = getQuizPacks(params.get('board') === 'GSEB' ? 'GSEB' : 'CBSE', Number(params.get('class')) || 12, params.get('subject') || 'Economics').find(pack => pack.id === id);
    if (!target) return;
    setBoardId(target.board); setClassLevel(target.classLevel); setSubjectName(target.subject); setStreamFilter(null); setChapterId(target.id);
  }, [params]);

  const board = quizBoards.find((item) => item.id === boardId) || null;
  const classEntry = board?.classes.find((item) => item.classLevel === classLevel) || null;
  const subject = classEntry?.subjects.find((item) => item.name === subjectName) || null;
  const packs = useMemo(() => boardId && classLevel && subjectName ? getQuizPacks(boardId, classLevel, subjectName) : [], [boardId, classLevel, subjectName]);

  const packGroups = useMemo(() => {
    if (!packs.length) return [];
    const groups = new Map();
    packs.forEach((pack) => {
      const key = pack.stream || (boardId === 'CBSE' && classLevel === 11 && subjectName === 'Economics'
        ? 'Introductory Microeconomics'
        : 'Chapter Quizzes');
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key).push(pack);
    });
    return [...groups.entries()].filter(([name]) => !streamFilter || name === streamFilter).map(([name, items]) => ({
      name,
      items,
      questionCount: items.reduce(
        (total, pack) => total + Object.values(pack.levelCounts || {}).reduce((sum, count) => sum + count, 0),
        0
      ),
    }));
  }, [packs, boardId, classLevel, subjectName, streamFilter]);
  const chapterChoices = packGroups.flatMap(group => group.items);
  const selectedChapter = chapterChoices.find(pack => pack.id === chapterId) || chapterChoices[0];

  const resetAfterBoard = (id) => {
    setStreamFilter(null);
    setBoardId(id);
    setClassLevel(null);
    setSubjectName(null);
  };

  const resetAfterClass = (level) => {
    setStreamFilter(null);
    setClassLevel(level);
    setSubjectName(null);
  };

  const back = () => {
    if (subjectName) setSubjectName(null);
    else if (classLevel) setClassLevel(null);
    else setBoardId(null);
  };

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-ivory)' }}>
      <SEO
        title="Economics MCQ Quizzes — Class 11 Micro & Class 12 Macro, Indian Economy"
        description="Practise 1,240 Economics questions across Class 11 Microeconomics and Class 12 Macroeconomics and Indian Economic Development, with four levels and answer explanations."
        path="/quizzes"
      />

      <section className="pt-8 pb-4">
        <div className="page-container max-w-5xl">
          <span className="eyebrow">Verified Quiz Library</span>
          <h1 className="mt-5">Economics chapter quizzes</h1>
          <p className="mt-5 max-w-3xl">Choose Microeconomics, Macroeconomics or Indian Economic Development, then select a chapter and difficulty.</p>
          <div className="flex flex-wrap gap-3 mt-6">
            <div className="inline-flex items-center gap-2 text-xs font-bold px-3 py-2 rounded-full" style={{ background: '#eef8ef', color: '#2f6b3a', border: '1px solid #cfe6d2' }}><ShieldCheck className="w-4 h-4" /> Easy & Moderate free</div>
            <div className="inline-flex items-center gap-2 text-xs font-bold px-3 py-2 rounded-full" style={{ background: 'var(--gold-bg)', color: 'var(--gold)', border: '1px solid rgba(184,135,47,.2)' }}><Layers3 className="w-4 h-4" /> 4 levels per quiz</div>
          </div>
        </div>
      </section>

      <main className="page-container section-padding max-w-6xl">
        <nav aria-label="Economics quiz subjects" className="grid sm:grid-cols-3 gap-3 mb-6">
          {[
            { name: 'Microeconomics', level: 11, stream: null },
            { name: 'Macroeconomics', level: 12, stream: 'Macroeconomics' },
            { name: 'Indian Economic Development', level: 12, stream: 'Indian Economic Development' },
          ].map((item) => (
            <button key={item.name} type="button"
              aria-pressed={boardId === 'CBSE' && subjectName === 'Economics' && classLevel === item.level && streamFilter === item.stream}
              className="btn-secondary p-4 text-left" style={{ flexDirection: 'column', alignItems: 'flex-start', whiteSpace: 'normal', minWidth: 0, minHeight: '104px', gap: '4px' }}
              onClick={() => { setBoardId('CBSE'); setClassLevel(item.level); setSubjectName('Economics'); setStreamFilter(item.stream); }}>
              <strong>{item.name}</strong><span className="block text-sm mt-1">Class {item.level} · Open chapters</span>
            </button>
          ))}
        </nav>

        <div className="card-paper p-4 sm:p-5 mb-6 overflow-x-auto">
          <div className="flex items-center gap-5 min-w-max">
            <StepChip active={!boardId} done={Boolean(boardId)}>Board</StepChip>
            <ChevronRight className="w-4 h-4" style={{ color: 'var(--subtle)' }} />
            <StepChip active={Boolean(boardId && !classLevel)} done={Boolean(classLevel)}>Class</StepChip>
            <ChevronRight className="w-4 h-4" style={{ color: 'var(--subtle)' }} />
            <StepChip active={Boolean(classLevel && !subjectName)} done={Boolean(subjectName)}>Subject</StepChip>
            <ChevronRight className="w-4 h-4" style={{ color: 'var(--subtle)' }} />
            <StepChip active={Boolean(subjectName)} done={false}>Quiz Levels</StepChip>
          </div>
        </div>

        {boardId && (
          <button type="button" onClick={back} className="inline-flex items-center gap-2 text-sm font-bold mb-5" style={{ color: 'var(--gold)' }}>
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
        )}

        {!boardId && (
          <section>
            <span className="eyebrow">Step 1</span>
            <h2 className="text-3xl sm:text-4xl mt-2" style={{ fontFamily: 'var(--font-serif)', color: 'var(--ink)' }}>Choose your board.</h2>
            <div className="grid md:grid-cols-2 gap-5 mt-7">
              {quizBoards.map((item) => (
                <button key={item.id} type="button" onClick={() => resetAfterBoard(item.id)} className="card-paper p-6 sm:p-8 text-left group">
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ background: 'var(--gold-bg)', color: 'var(--gold)' }}><GraduationCap className="w-7 h-7" /></div>
                  <div className="text-xs font-black uppercase tracking-[.16em] mt-5" style={{ color: 'var(--gold)' }}>{item.id}</div>
                  <h3 className="text-3xl mt-1" style={{ fontFamily: 'var(--font-serif)', color: 'var(--ink)' }}>{item.name}</h3>
                  <p className="mt-3 text-sm leading-7" style={{ color: 'var(--muted)' }}>{item.description}</p>
                  <span className="inline-flex items-center gap-2 mt-5 text-sm font-black" style={{ color: 'var(--gold)' }}>Open board quizzes <ArrowRight className="w-4 h-4" /></span>
                </button>
              ))}
            </div>
          </section>
        )}

        {board && !classLevel && (
          <section>
            <span className="eyebrow">Step 2 · {board.name}</span>
            <h2 className="text-3xl sm:text-4xl mt-2" style={{ fontFamily: 'var(--font-serif)', color: 'var(--ink)' }}>Choose class.</h2>
            <div className="grid sm:grid-cols-2 gap-5 mt-7">
              {board.classes.map((item) => (
                <button key={item.classLevel} type="button" onClick={() => resetAfterClass(item.classLevel)} className="card-paper p-6 text-left">
                  <div className="text-sm font-black uppercase tracking-[.14em]" style={{ color: 'var(--gold)' }}>{board.id}</div>
                  <h3 className="text-3xl mt-2" style={{ fontFamily: 'var(--font-serif)', color: 'var(--ink)' }}>Class {item.classLevel}</h3>
                  <p className="text-sm mt-3" style={{ color: 'var(--muted)' }}>{item.subjects.length ? `${item.subjects.length} subject entr${item.subjects.length === 1 ? 'y' : 'ies'} currently mapped` : 'Subject source mapping is waiting for verification.'}</p>
                  <span className="inline-flex items-center gap-2 mt-5 text-sm font-black" style={{ color: 'var(--gold)' }}>Continue <ArrowRight className="w-4 h-4" /></span>
                </button>
              ))}
            </div>
          </section>
        )}

        {classEntry && !subjectName && (
          <section>
            <span className="eyebrow">Step 3 · {board.name} · Class {classLevel}</span>
            <h2 className="text-3xl sm:text-4xl mt-2" style={{ fontFamily: 'var(--font-serif)', color: 'var(--ink)' }}>Choose subject.</h2>

            {classEntry.sourceNote && (
              <div className="rounded-2xl p-4 mt-5 flex gap-3" style={{ background: '#fff8e8', border: '1px solid #ead7a2' }}>
                <CircleAlert className="w-5 h-5 shrink-0 mt-0.5" style={{ color: '#8a6518' }} />
                <p className="text-sm leading-7" style={{ color: '#6e531d' }}>{classEntry.sourceNote}</p>
              </div>
            )}

            {classEntry.subjects.length > 0 ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-7">
                {classEntry.subjects.map((item) => {
                  const verified = item.status === 'verified';
                  return (
                    <button
                      key={item.id}
                      type="button"
                      disabled={!verified}
                      onClick={() => verified && setSubjectName(item.name)}
                      className="card-paper p-5 text-left disabled:cursor-not-allowed"
                      style={{ opacity: verified ? 1 : .66 }}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: verified ? '#eef8ef' : 'var(--bg-ivory)', color: verified ? '#2f6b3a' : 'var(--subtle)' }}>
                          {verified ? <BadgeCheck className="w-5 h-5" /> : <BookOpen className="w-5 h-5" />}
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full" style={{ background: verified ? '#eef8ef' : '#fff8e8', color: verified ? '#2f6b3a' : '#8a6518' }}>
                          {verified ? 'Verified' : 'Source needed'}
                        </span>
                      </div>
                      <h3 className="text-xl mt-4" style={{ fontFamily: 'var(--font-serif)', color: 'var(--ink)' }}>{item.name}</h3>
                      <p className="text-xs mt-2 leading-6" style={{ color: 'var(--muted)' }}>{verified ? 'Verified quiz content is available.' : 'No quiz will be published until the textbook / reliable source is provided.'}</p>
                      {verified && <span className="inline-flex items-center gap-2 mt-4 text-sm font-black" style={{ color: 'var(--gold)' }}>Open quizzes <ArrowRight className="w-4 h-4" /></span>}
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="card-paper p-7 mt-7 text-center">
                <BookOpen className="w-10 h-10 mx-auto" style={{ color: 'var(--gold)' }} />
                <h3 className="text-2xl mt-3" style={{ fontFamily: 'var(--font-serif)', color: 'var(--ink)' }}>Verified source needed first.</h3>
                <p className="text-sm mt-2 max-w-xl mx-auto leading-7" style={{ color: 'var(--muted)' }}>I have intentionally not guessed the subject list or questions for this class. Once the source books are supplied, subjects can be mapped accurately and each chapter can receive four levels.</p>
              </div>
            )}
          </section>
        )}

        {subject && (
          <section>
            <span className="eyebrow">Step 4 · {board.name} · Class {classLevel} · {subjectName}</span>
            <h2 className="text-3xl sm:text-4xl mt-2" style={{ fontFamily: 'var(--font-serif)', color: 'var(--ink)' }}>Choose chapter quiz and level.</h2>
            <p className="text-sm mt-3 leading-7 max-w-3xl" style={{ color: 'var(--muted)' }}>Easy and Moderate are free. Hard and Extreme are for Premium members — ₹999 one-time lifetime access. Access is activated after payment verification.</p>

            {chapterChoices.length > 0 && <label className="block text-sm font-bold mt-5">Chapter
              <select className="input-field w-full mt-2 min-h-11" value={selectedChapter?.id || ''} onChange={event => setChapterId(event.target.value)}>{chapterChoices.map(pack => <option key={pack.id} value={pack.id}>{pack.chapter} · {pack.title}</option>)}</select>
            </label>}
            <div className="space-y-9 mt-7">
              {packGroups.length > 0 ? packGroups.filter(group => group.items.some(pack => pack.id === selectedChapter?.id)).map((group) => (
                <div key={group.name}>
                  <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-4">
                    <div>
                      <div className="text-xs font-black uppercase tracking-[.14em]" style={{ color: 'var(--gold)' }}>{group.name}</div>
                      <h3 className="text-2xl sm:text-3xl mt-1" style={{ fontFamily: 'var(--font-serif)', color: 'var(--ink)' }}>
                        {group.items.length} chapter {group.items.length === 1 ? 'quiz' : 'quizzes'}
                      </h3>
                    </div>
                    <div className="text-xs font-black px-3 py-2 rounded-full self-start" style={{ background: 'var(--gold-bg)', color: 'var(--gold)', border: '1px solid rgba(184,135,47,.18)' }}>
                      {group.questionCount} verified questions
                    </div>
                  </div>
                  <div className="grid gap-5">
                    {group.items.filter(pack => pack.id === selectedChapter?.id).map((pack) => <VerifiedPackCard key={pack.id} pack={pack} />)}
                  </div>
                </div>
              )) : (
                <div className="card-paper p-7 text-center">
                  <CircleAlert className="w-10 h-10 mx-auto" style={{ color: 'var(--gold)' }} />
                  <h3 className="text-2xl mt-3" style={{ fontFamily: 'var(--font-serif)', color: 'var(--ink)' }}>Source mapped, quiz pack not published yet.</h3>
                  <p className="text-sm mt-2" style={{ color: 'var(--muted)' }}>I will not create questions until the chapter source is checked.</p>
                </div>
              )}
            </div>
          </section>
        )}

        <section className="mt-12 card-paper p-6 sm:p-8">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0" style={{ background: 'var(--gold-bg)', color: 'var(--gold)' }}><Target className="w-6 h-6" /></div>
            <div>
              <span className="eyebrow">Quality rule</span>
              <h2 className="text-2xl mt-2" style={{ fontFamily: 'var(--font-serif)', color: 'var(--ink)' }}>Accuracy before quantity.</h2>
              <p className="text-sm mt-3 leading-7 max-w-3xl" style={{ color: 'var(--muted)' }}>This section will never show a fake “25 questions” card without 25 real questions behind it. Missing source means the subject stays locked until verified material is available.</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
