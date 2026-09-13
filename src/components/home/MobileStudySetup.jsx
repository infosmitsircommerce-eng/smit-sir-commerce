import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Check, ChevronRight, GraduationCap, Sparkles, X } from 'lucide-react';
import { availableSubjects, readStudentPreferences, saveStudentPreferences } from '../../lib/studentPreferences';
import { trackEvent } from '../../lib/analytics';

const SEEN_KEY = 'ssc-mobile-study-setup-seen-v1';
const GOALS = ['Board exam preparation', 'School tests', 'Concept clarity'];

export default function MobileStudySetup({ profile, onSaved }) {
  const [preferences, setPreferences] = useState(() => readStudentPreferences(profile));
  const [draft, setDraft] = useState(() => readStudentPreferences(profile) || { board: 'CBSE', classLevel: '12', subject: 'Economics', goal: GOALS[0] });
  const [open, setOpen] = useState(false);
  const panel = useRef(null);

  useEffect(() => {
    const account = readStudentPreferences(profile);
    if (account?.source === 'account') {
      const synced = saveStudentPreferences(account);
      setPreferences(synced);
      setDraft(synced);
    }
  }, [profile]);

  useEffect(() => {
    if (preferences || !window.matchMedia('(max-width: 1023px)').matches) return;
    if (window.localStorage.getItem(SEEN_KEY)) return;
    const timer = window.setTimeout(() => {
      setOpen(true);
      void trackEvent('student_setup_view', { placement: 'mobile_home' });
    }, 900);
    return () => window.clearTimeout(timer);
  }, [preferences]);

  useEffect(() => {
    if (!open) return;
    const previous = document.activeElement;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    panel.current?.focus();
    return () => {
      document.body.style.overflow = overflow;
      if (previous?.isConnected) previous.focus();
    };
  }, [open]);

  const subjects = availableSubjects(draft.board, draft.classLevel);
  const subject = subjects.includes(draft.subject) ? draft.subject : subjects[0];
  const updateCourse = (field, value) => {
    const next = { ...draft, [field]: value };
    const nextSubjects = availableSubjects(next.board, next.classLevel);
    if (!nextSubjects.includes(next.subject)) next.subject = nextSubjects[0];
    setDraft(next);
  };
  const close = () => {
    try { window.localStorage.setItem(SEEN_KEY, '1'); } catch { /* Setup remains optional. */ }
    setOpen(false);
    void trackEvent('student_setup_dismiss', { placement: 'mobile_home' });
  };
  const save = () => {
    const next = saveStudentPreferences({ ...draft, subject });
    try { window.localStorage.setItem(SEEN_KEY, '1'); } catch { /* Setup still works for this visit. */ }
    setPreferences(next);
    setOpen(false);
    onSaved?.(next);
    void trackEvent('student_setup_complete', { board: next.board, classLevel: Number(next.classLevel), subject: next.subject, goal: next.goal });
  };

  return <>
    <button type="button" className="mobile-study-path" onClick={() => setOpen(true)} aria-label="Personalize your board, class and subject">
      <span><GraduationCap aria-hidden="true" /></span>
      <span><small>Your study path</small><strong>{preferences ? `${preferences.board} · Class ${preferences.classLevel} · ${preferences.subject}` : 'Choose board, class & subject'}</strong></span>
      <ChevronRight aria-hidden="true" />
    </button>
    {open && createPortal(<div className="mobile-setup-backdrop" onClick={(event) => { if (event.target === event.currentTarget) close(); }}>
      <section ref={panel} role="dialog" aria-modal="true" aria-labelledby="mobile-setup-title" tabIndex={-1} className="mobile-setup-sheet" onKeyDown={(event) => { if (event.key === 'Escape') close(); }}>
        <div className="mobile-setup-handle" aria-hidden="true" />
        <header><div><span><Sparkles aria-hidden="true" /> PERSONALISE IN 20 SECONDS</span><h2 id="mobile-setup-title">Show me what I study.</h2><p>Your choices stay on this device and can be changed anytime.</p></div><button type="button" onClick={close} aria-label="Close study setup"><X aria-hidden="true" /></button></header>
        <div className="mobile-setup-fields">
          <fieldset><legend>Board</legend><div>{['CBSE', 'GSEB'].map(board => <button type="button" key={board} aria-pressed={draft.board === board} onClick={() => updateCourse('board', board)}>{draft.board === board && <Check aria-hidden="true" />}{board}</button>)}</div></fieldset>
          <fieldset><legend>Class</legend><div>{['11', '12'].map(level => <button type="button" key={level} aria-pressed={draft.classLevel === level} onClick={() => updateCourse('classLevel', level)}>{draft.classLevel === level && <Check aria-hidden="true" />}Class {level}</button>)}</div></fieldset>
          <fieldset><legend>Subject</legend><div>{subjects.map(item => <button type="button" key={item} aria-pressed={subject === item} onClick={() => setDraft(current => ({ ...current, subject: item }))}>{subject === item && <Check aria-hidden="true" />}{item}</button>)}</div></fieldset>
          <fieldset><legend>Main goal</legend><div className="mobile-setup-goals">{GOALS.map(goal => <button type="button" key={goal} aria-pressed={draft.goal === goal} onClick={() => setDraft(current => ({ ...current, goal }))}>{draft.goal === goal && <Check aria-hidden="true" />}{goal}</button>)}</div></fieldset>
        </div>
        <button type="button" className="mobile-setup-save" onClick={save}>Build my study desk <ChevronRight aria-hidden="true" /></button>
      </section>
    </div>, document.body)}
  </>;
}
