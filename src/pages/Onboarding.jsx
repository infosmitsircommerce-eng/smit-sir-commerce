import { useMemo, useState } from 'react';
import { Navigate, useNavigate, useSearchParams } from 'react-router-dom';
import { BookOpenCheck, Check, GraduationCap, Loader2, Sparkles, Target } from 'lucide-react';
import SEO from '../components/ui/SEO';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';

const SUBJECTS = ['Accountancy', 'Economics', 'Business Studies', 'Entrepreneurship', 'Physical Education'];
const GOALS = [
  { value: 'Board exam preparation', label: 'Board exam preparation', text: 'Structured revision, tests and weak-topic practice.' },
  { value: 'School tests', label: 'School tests', text: 'Stay ready for unit tests and regular assessments.' },
  { value: 'Concept clarity', label: 'Concept clarity', text: 'Focus on understanding before speed and marks.' },
  { value: 'Daily consistency', label: 'Daily consistency', text: 'Build a sustainable study routine with short practice.' },
];

export default function Onboarding() {
  const { user, profile, loading, fetchProfile } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const editing = searchParams.get('edit') === '1';
  const [classLevel, setClassLevel] = useState(String(profile?.class_level || 12));
  const [board, setBoard] = useState(profile?.board || 'CBSE');
  const [subjects, setSubjects] = useState(profile?.subjects?.length ? profile.subjects : ['Accountancy', 'Economics', 'Business Studies']);
  const [goal, setGoal] = useState(profile?.study_goal || 'Board exam preparation');
  const [examDate, setExamDate] = useState(profile?.exam_date || '');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const selectedCount = subjects.length;
  const recommendation = useMemo(() => {
    if (goal === 'Daily consistency') return 'Daily 10 + Study Coach';
    if (goal === 'Concept clarity') return 'Notes + Ask AI + chapter practice';
    if (goal === 'School tests') return 'Notes + Test Series';
    return 'Exam Mode + Mistake Book + Learning Insights';
  }, [goal]);

  if (loading) return <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg-ivory)' }}><Loader2 className="w-7 h-7 animate-spin" style={{ color: 'var(--gold)' }} /></div>;
  if (!user) return <Navigate to="/login" replace />;
  if (profile?.onboarding_completed && !editing) return <Navigate to="/dashboard" replace />;

  const toggleSubject = (subject) => {
    setSubjects((current) => current.includes(subject) ? current.filter((item) => item !== subject) : [...current, subject]);
  };

  const save = async (event) => {
    event.preventDefault();
    setError('');
    if (!subjects.length) { setError('Choose at least one subject.'); return; }
    setSaving(true);
    const { error: saveError } = await supabase.rpc('update_student_preferences', {
      p_class_level: Number(classLevel),
      p_board: board,
      p_subjects: subjects,
      p_study_goal: goal,
      p_exam_date: examDate || null,
    });
    if (saveError) {
      setError(saveError.message || 'Could not save your study setup.');
      setSaving(false);
      return;
    }
    await fetchProfile(user.id);
    setSaving(false);
    navigate('/dashboard', { replace: true });
  };

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-ivory)' }}>
      <SEO title={editing ? 'Edit Your Study Setup' : 'Set Up Your Study Plan'} description="Private student onboarding for Smit Sir Commerce." path="/onboarding" noindex />
      <section className="page-hero">
        <div className="page-container max-w-4xl text-center">
          <div className="w-14 h-14 rounded-2xl mx-auto flex items-center justify-center" style={{ background: 'var(--gold-bg)', color: 'var(--gold)' }}><Sparkles className="w-7 h-7" /></div>
          <span className="eyebrow mt-5 inline-block">{editing ? 'Update your setup' : '60-second setup'}</span>
          <h1 className="mt-4">Make the platform work <em>for your study goal.</em></h1>
          <p className="mt-4 max-w-2xl mx-auto" style={{ color: 'var(--muted)' }}>Choose what you study and what you are preparing for. Your dashboard will use these preferences to prioritise the right tools instead of showing generic cards.</p>
        </div>
      </section>

      <main className="page-container pb-16 max-w-5xl">
        <form onSubmit={save} className="space-y-5">
          <section className="card-paper p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-5"><GraduationCap className="w-5 h-5" style={{ color: 'var(--gold)' }} /><div><div className="font-bold" style={{ color: 'var(--ink)' }}>1. Class & board</div><div className="text-xs" style={{ color: 'var(--muted)' }}>This controls which material should be prioritised.</div></div></div>
            <div className="grid sm:grid-cols-2 gap-4">
              <label className="block"><span className="text-sm font-semibold" style={{ color: 'var(--ink)' }}>Class</span><select value={classLevel} onChange={(e) => setClassLevel(e.target.value)} className="input-field w-full mt-2"><option value="11">Class 11</option><option value="12">Class 12</option></select></label>
              <label className="block"><span className="text-sm font-semibold" style={{ color: 'var(--ink)' }}>Board</span><select value={board} onChange={(e) => setBoard(e.target.value)} className="input-field w-full mt-2"><option>CBSE</option><option>GSEB</option><option>Other</option></select></label>
            </div>
            {board !== 'CBSE' && <div className="mt-4 rounded-xl p-4 text-sm" style={{ background: 'var(--gold-bg)', color: 'var(--charcoal)', border: '1px solid rgba(184,135,47,.22)' }}>Some published chapter notes are currently CBSE-focused. Your board preference is still saved so board-specific material can be prioritised as it is added.</div>}
          </section>

          <section className="card-paper p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-5"><BookOpenCheck className="w-5 h-5" style={{ color: 'var(--gold)' }} /><div><div className="font-bold" style={{ color: 'var(--ink)' }}>2. Your subjects</div><div className="text-xs" style={{ color: 'var(--muted)' }}>{selectedCount} selected</div></div></div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {SUBJECTS.map((subject) => { const active = subjects.includes(subject); return <button key={subject} type="button" onClick={() => toggleSubject(subject)} className="rounded-xl p-4 text-left flex items-center justify-between gap-3 transition-all" style={{ background: active ? 'var(--gold-bg)' : 'var(--bg-white)', border: active ? '1px solid rgba(184,135,47,.45)' : '1px solid var(--border)', color: 'var(--ink)' }}><span className="font-semibold text-sm">{subject}</span><span className="w-6 h-6 rounded-full flex items-center justify-center" style={{ background: active ? 'var(--gold)' : 'var(--bg-ivory)', color: active ? '#fff' : 'var(--muted)' }}>{active && <Check className="w-4 h-4" />}</span></button>; })}
            </div>
          </section>

          <section className="card-paper p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-5"><Target className="w-5 h-5" style={{ color: 'var(--gold)' }} /><div><div className="font-bold" style={{ color: 'var(--ink)' }}>3. Main study goal</div><div className="text-xs" style={{ color: 'var(--muted)' }}>You can change this later.</div></div></div>
            <div className="grid sm:grid-cols-2 gap-3">
              {GOALS.map((item) => <button type="button" key={item.value} onClick={() => setGoal(item.value)} className="rounded-xl p-4 text-left" style={{ background: goal === item.value ? 'var(--gold-bg)' : 'var(--bg-white)', border: goal === item.value ? '1px solid rgba(184,135,47,.45)' : '1px solid var(--border)' }}><div className="font-semibold" style={{ color: 'var(--ink)' }}>{item.label}</div><div className="text-xs mt-1 leading-relaxed" style={{ color: 'var(--muted)' }}>{item.text}</div></button>)}
            </div>
            <label className="block mt-5 max-w-sm"><span className="text-sm font-semibold" style={{ color: 'var(--ink)' }}>Exam date <span style={{ color: 'var(--muted)', fontWeight: 400 }}>(optional)</span></span><input type="date" value={examDate} onChange={(e) => setExamDate(e.target.value)} className="input-field w-full mt-2" /></label>
          </section>

          <section className="rounded-2xl p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-5" style={{ background: 'var(--ink)', color: '#fff' }}>
            <div><div className="text-xs font-bold uppercase tracking-wider" style={{ color: '#e7c66c' }}>Your recommended path</div><div className="font-semibold mt-2">{recommendation}</div><div className="text-xs mt-1" style={{ color: 'var(--muted-on-ink)' }}>This is a study recommendation, not an official academic assessment.</div></div>
            <button disabled={saving} className="btn-gold inline-flex items-center justify-center gap-2 min-w-[180px]">{saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}{saving ? 'Saving…' : editing ? 'Save changes' : 'Build my dashboard'}</button>
          </section>

          {error && <div className="rounded-xl p-4 text-sm" style={{ background: 'rgba(180,83,60,.08)', color: '#B4533C', border: '1px solid rgba(180,83,60,.2)' }}>{error}</div>}
        </form>
      </main>
    </div>
  );
}
