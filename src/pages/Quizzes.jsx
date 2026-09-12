import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { createPortal } from 'react-dom';
import { ArrowLeft, ArrowRight, BadgeCheck, BookOpen, CheckCircle2, ChevronRight, CircleAlert, GraduationCap, Layers3, RotateCcw, ShieldCheck, Sparkles, Target, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { quizPageById } from '../data/quizDiscovery';
import SEO from '../components/ui/SEO';
import { quizBoards, quizLevels } from '../data/quizPublic';
import { recordQuizAttempt } from '../lib/quizAttempt';
import { quizTracks, resolveQuizSelection, quizSelectionParams } from '../data/quizNavigation';
import QuizChapterPicker from '../components/ui/QuizChapterPicker';
import '../styles/studyAccess.css';
import '../styles/quizHub.css';

const levelMeta = {
  Easy: { label: 'Easy', note: 'Definitions & direct recall', icon: '🌱' },
  Moderate: { label: 'Moderate', note: 'Concept understanding', icon: '🎯' },
  Hard: { label: 'Hard', note: 'Application & tricky choices', icon: '🔥' },
  Extreme: { label: 'Extreme', note: 'High-level application', icon: '⚡' },
};

function SourceBadge({ children }) {
  return <div className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[11px] font-black" style={{ background: '#edf6f1', color: '#126c61', border: '1px solid #d9e6e1' }}><ShieldCheck className="w-3.5 h-3.5" /> {children}</div>;
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
      <div ref={panel} role="dialog" aria-modal="true" aria-label="Chapter quiz" className="ssc-quiz-dialog" tabIndex={-1} onKeyDown={handleKeyDown}
        style={{ width: 'min(100%, 720px)', maxHeight: 'calc(100dvh - 24px)', overflowY: 'auto', overscrollBehavior: 'contain', borderRadius: '20px', background: '#fff', color: '#172033', boxSizing: 'border-box', padding: 'clamp(16px, 3vw, 28px)', overflowWrap: 'anywhere', boxShadow: '0 20px 70px rgba(0,0,0,.25)' }}>
        {children}
      </div>
    </div>,
    document.body
  );
}

function QuizPlayer({ pack, level, onClose }) {
  const { user, displayName } = useAuth();
  const recorded = useRef(false);
  const levelLabel = pack.board === 'GSEB' && level === 'Moderate' ? 'Medium' : level;
  const questions = pack.levels[level] || [];
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [finished, setFinished] = useState(false);
  useEffect(() => {
    if (!finished || recorded.current) return;
    recorded.current = true;
    recordQuizAttempt({ pack, level, questions, answers, userId: user?.id, displayName });
  }, [finished, pack, level, questions, answers, user?.id, displayName]);

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
    recorded.current = false;
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
            <li>All 11 GSEB Class 12 Economics chapters</li>
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

export function LevelGrid({ pack, onAttempt, appearance }) {
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
      <div className={appearance === 'study' ? 'ssc-study-levels' : 'grid grid-cols-2 lg:grid-cols-4 gap-3 mt-5'}>
        {quizLevels.map((level, index) => {
          const questionCount = pack.levelCounts?.[level] || pack.levels[level]?.length || 0;
          const meta = levelMeta[level];
          const premiumLevel = level === 'Hard' || level === 'Extreme';
          const locked = premiumLevel && !premiumAccess;
          if (appearance === 'study') return <button key={level} type="button" className="ssc-study-level" data-level={level} onClick={() => openLevel(level)} disabled={!questionCount || fetching || (premiumLevel && loading)}>
            <div className="ssc-study-level-top"><span className="ssc-study-level-number">0{index + 1}</span><span className="ssc-study-level-access">{premiumLevel ? (loading ? 'Checking…' : locked ? 'Premium' : 'Unlocked') : 'Free'}</span></div>
            <strong>{pack.board === 'GSEB' && level === 'Moderate' ? 'Medium' : meta.label}</strong>
            <span className="ssc-study-level-note">{meta.note}</span>
            <span className="ssc-study-level-footer">{questionCount} questions<ArrowRight size={16} aria-hidden="true" /></span>
          </button>;
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
  return <article className="ssc-quiz-pack" aria-label="Selected chapter test">
    <div className="ssc-study-kicker">CHOOSE YOUR LEVEL</div>
    <h2>{pack.title}</h2>
    <p className="ssc-quiz-pack-note">{Object.values(pack.levelCounts || {}).every(count => count === 10) ? '10 questions per level' : 'Chapter practice'} · Instant answers and explanations</p>
    <LevelGrid key={pack.id} pack={pack} appearance="study" />
    <details className="ssc-quiz-source"><summary>Chapter source & revision</summary><p>{pack.sourceLabel}</p>{quizPageById[pack.id] && <Link to={quizPageById[pack.id].path}>Open chapter revision <ArrowRight size={15} /></Link>}</details>
  </article>;
}

export default function Quizzes() {
  const [params, setParams] = useSearchParams();
  const selection = resolveQuizSelection(params);
  const { boardId, classLevel, subject, board, classEntry, packs, selected, activeTrack } = selection;
  const chapterArea = useRef(null), packArea = useRef(null);
  const [moveFocus, setMoveFocus] = useState('');
  useEffect(() => {
    if (!moveFocus) return;
    const element = moveFocus === 'pack' ? packArea.current : chapterArea.current;
    element?.scrollIntoView({ behavior: 'instant', block: 'start' }); element?.focus({ preventScroll: true });
    setMoveFocus('');
  }, [params, moveFocus]);
  function change(next, focus = '') {
    setParams(quizSelectionParams(next));
    setMoveFocus(focus);
  }
  const current = { boardId, classLevel, subject, trackId: activeTrack?.id };
  return <div className="ssc-quiz-hub">
    <SEO title="Economics MCQ Quizzes — Class 11 Micro & Class 12 Macro, Indian Economy" description="Practise Economics chapter MCQs across Class 11 Microeconomics, Class 12 Macroeconomics, Indian Economic Development and GSEB Economics, with four levels and answer explanations." path="/quizzes" />
    <div className="page-container ssc-quiz-container">
      <section className="ssc-study-access">
        <header className="ssc-study-heading"><span className="ssc-study-kicker"><span /> YOUR PRACTICE DESK</span><h1>Chapter tests, without the searching.</h1><p>Choose a subject. Open a chapter. Practise again anytime.</p></header>
        <nav aria-label="Economics quiz subjects" className="ssc-quiz-tracks">{quizTracks.map(track => <button key={track.id} type="button" aria-pressed={activeTrack?.id === track.id} onClick={() => change({ trackId: track.id, subject: 'Economics' }, 'chapters')}><strong>{track.name}</strong><span>{track.board} · Class {track.classLevel}</span><ArrowRight size={16} aria-hidden="true" /></button>)}</nav>
        <div className="ssc-study-filters">
          <label htmlFor="quiz-board">Board<select id="quiz-board" className="ssc-study-control" value={boardId} onChange={event => change({boardId:event.target.value,classLevel,subject:'Economics'})}>{quizBoards.map(item => <option key={item.id}>{item.id}</option>)}</select></label>
          <label htmlFor="quiz-class">Class<select id="quiz-class" className="ssc-study-control" value={classLevel} onChange={event => change({boardId,classLevel:Number(event.target.value),subject:'Economics'})}>{board.classes.map(item => <option key={item.classLevel} value={item.classLevel}>Class {item.classLevel}</option>)}</select></label>
          <label className="ssc-study-subject" htmlFor="quiz-subject">Subject<select id="quiz-subject" className="ssc-study-control" value={subject} disabled={!classEntry?.subjects.length} onChange={event => change({boardId,classLevel,subject:event.target.value})}>{classEntry?.subjects.length ? classEntry.subjects.map(item => <option key={item.id} value={item.name} disabled={item.status !== 'verified'}>{item.name}{item.status !== 'verified' ? ' · Coming later' : ''}</option>) : <option value={subject}>No published subjects</option>}</select></label>
        </div>
        <section ref={chapterArea} tabIndex={-1} className="ssc-quiz-chapters" aria-label="Chapter selection">
          <p className="ssc-quiz-context" role="status">{activeTrack?.name || subject} · {boardId} Class {classLevel} · {packs.length} chapters</p>
          <QuizChapterPicker packs={packs} selected={selected} onChange={packId => change({...current,packId}, 'pack')} />
        </section>
        <div ref={packArea} tabIndex={-1} className="ssc-quiz-pack-area">
          {selected ? <VerifiedPackCard key={selected.id} pack={selected} /> : <p role="status" className="ssc-study-empty">No published chapter tests for this selection yet. Choose another subject or class above.</p>}
        </div>
        <p className="ssc-quiz-access-note"><ShieldCheck size={16} aria-hidden="true" /><span>Easy & {boardId === 'GSEB' ? 'Medium' : 'Moderate'} are free. Hard & Extreme need Premium. Existing ₹999 lifetime access applies.</span></p>
      </section>
    </div>
  </div>;
}
