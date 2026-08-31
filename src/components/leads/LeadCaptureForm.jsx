import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Check, Loader2, Send, ShieldCheck } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { trackEvent } from '../../lib/analytics';
import { captureAcquisition } from '../../lib/acquisition';
import { useAuth } from '../../context/AuthContext';

const SUBJECTS = ['Accountancy', 'Economics', 'Business Studies', 'Entrepreneurship', 'Physical Education'];
const DEMO_SUBJECTS = [...SUBJECTS, 'Any Commerce Subject'];
const SOURCES = ['Google', 'Instagram', 'WhatsApp', 'Referral', 'Direct', 'Other'];

export default function LeadCaptureForm({ intent = 'Free Demo', heading = 'Book your free demo', compact = false, demoSlot = null }) {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const attribution = captureAcquisition(location.pathname, location.search);
  const firstTouch = attribution?.first || {};
  const initialSource = firstTouch.source || 'Direct';
  const startedAt = useRef(Date.now());
  const trackedStart = useRef(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [honeypot, setHoneypot] = useState('');
  const [form, setForm] = useState({
    fullName: '', mobile: '', parentMobile: '', classLevel: '12', board: 'CBSE', subjects: ['Economics'],
    studyMode: 'Either', preferredTime: 'Any time', source: initialSource, demoSubject: 'Economics',
    message: '', consent: false,
  });

  useEffect(() => {
    trackEvent('lead_form_view', { intent, source: initialSource, hasSlot: Boolean(demoSlot?.id) }, user?.id || null);
  }, [intent, initialSource, user?.id, demoSlot?.id]);

  useEffect(() => {
    if (!demoSlot) return;
    setForm((previous) => ({
      ...previous,
      studyMode: demoSlot.mode || previous.studyMode,
      demoSubject: demoSlot.subject_focus && demoSlot.subject_focus !== 'Any Commerce Subject' ? demoSlot.subject_focus : previous.demoSubject,
    }));
  }, [demoSlot?.id]);

  const startTracking = () => {
    if (trackedStart.current) return;
    trackedStart.current = true;
    trackEvent('lead_form_start', { intent, source: form.source, hasSlot: Boolean(demoSlot?.id) }, user?.id || null);
  };

  const set = (key) => (event) => {
    startTracking();
    setForm((previous) => ({ ...previous, [key]: event.target.value }));
  };

  const toggleSubject = (subject) => {
    startTracking();
    setForm((previous) => ({
      ...previous,
      subjects: previous.subjects.includes(subject)
        ? previous.subjects.filter((item) => item !== subject)
        : [...previous.subjects, subject],
    }));
  };

  const submit = async (event) => {
    event.preventDefault();
    setError('');

    if (honeypot) {
      navigate('/demo-success', { replace: true });
      return;
    }
    if (Date.now() - startedAt.current < 1200) {
      setError('Please review the form once and submit again.');
      return;
    }
    const digits = form.mobile.replace(/\D/g, '');
    if (digits.length < 10 || digits.length > 15) {
      setError('Please enter a valid mobile number.');
      return;
    }
    const parentDigits = form.parentMobile.replace(/\D/g, '');
    if (form.parentMobile.trim() && (parentDigits.length < 10 || parentDigits.length > 15)) {
      setError('Please enter a valid parent or guardian mobile number.');
      return;
    }
    if (!form.subjects.length) {
      setError('Choose at least one subject.');
      return;
    }
    if (!form.consent) {
      setError('Please confirm that we may contact you about this enquiry.');
      return;
    }

    setBusy(true);
    trackEvent('lead_submit_attempt', { intent, source: form.source, classLevel: Number(form.classLevel), board: form.board, mode: form.studyMode, hasSlot: Boolean(demoSlot?.id) }, user?.id || null);

    const payload = {
      full_name: form.fullName.trim(),
      mobile: form.mobile.trim(),
      parent_mobile: form.parentMobile.trim() || null,
      class_level: Number(form.classLevel),
      board: form.board,
      subjects: form.subjects,
      study_mode: demoSlot?.mode || form.studyMode,
      preferred_contact_time: form.preferredTime,
      source: form.source,
      intent,
      demo_slot_id: demoSlot?.id || null,
      demo_subject: intent === 'Free Demo' ? form.demoSubject : null,
      message: form.message.trim() || null,
      consent: true,
      first_path: firstTouch.path || location.pathname,
      utm_source: firstTouch.utmSource || null,
      utm_medium: firstTouch.utmMedium || null,
      utm_campaign: firstTouch.utmCampaign || null,
    };

    const { error: submitError } = await supabase.from('lead_submissions').insert(payload);
    setBusy(false);

    if (submitError) {
      const slotProblem = /slot|full|available/i.test(submitError.message || '');
      setError(slotProblem ? 'That slot is no longer available. Refresh the slots and choose another time.' : 'We could not save the enquiry right now. You can still contact us on WhatsApp below.');
      trackEvent('lead_submit_error', { intent, source: form.source, hasSlot: Boolean(demoSlot?.id) }, user?.id || null);
      return;
    }

    trackEvent('lead_submit_success', { intent, source: form.source, classLevel: Number(form.classLevel), board: form.board, mode: demoSlot?.mode || form.studyMode, bookedSlot: Boolean(demoSlot?.id) }, user?.id || null);
    navigate('/demo-success', { replace: true, state: { intent, booked: Boolean(demoSlot?.id), slot: demoSlot || null, demoSubject: form.demoSubject } });
  };

  return (
    <form onSubmit={submit} onFocus={startTracking} className={compact ? 'space-y-4' : 'space-y-5'}>
      <div>
        <span className="eyebrow">Admission enquiry</span>
        <h2 className="text-3xl mt-2" style={{ fontFamily: 'var(--font-serif)', color: 'var(--ink)' }}>{heading}</h2>
        <p className="text-sm mt-2 leading-relaxed" style={{ color: 'var(--muted)' }}>{demoSlot ? 'Complete your details to reserve the selected slot. Capacity is re-checked when you submit.' : 'Tell us what you are studying. We will use these details only to respond to this enquiry and help you choose the right learning option.'}</p>
      </div>

      {demoSlot && <div className="rounded-xl p-3 text-sm" style={{ background: 'var(--gold-bg)', border: '1px solid rgba(184,135,47,.28)', color: 'var(--charcoal)' }}><strong>Selected:</strong> {new Intl.DateTimeFormat('en-IN', { timeZone: 'Asia/Kolkata', weekday: 'short', day: '2-digit', month: 'short', hour: 'numeric', minute: '2-digit', hour12: true }).format(new Date(demoSlot.starts_at))} IST · {demoSlot.mode} · {demoSlot.duration_minutes} min</div>}

      <div className="grid sm:grid-cols-2 gap-4">
        <label className="block sm:col-span-2"><span className="text-xs font-semibold" style={{ color: 'var(--muted)' }}>Student name *</span><input required maxLength={80} value={form.fullName} onChange={set('fullName')} className="input-field w-full mt-1.5" placeholder="Your name" autoComplete="name" /></label>
        <label className="block"><span className="text-xs font-semibold" style={{ color: 'var(--muted)' }}>Mobile number *</span><input required value={form.mobile} onChange={set('mobile')} className="input-field w-full mt-1.5" placeholder="+91 XXXXX XXXXX" inputMode="tel" autoComplete="tel" /></label>
        <label className="block"><span className="text-xs font-semibold" style={{ color: 'var(--muted)' }}>Parent / guardian mobile <span className="font-normal">(optional)</span></span><input value={form.parentMobile} onChange={set('parentMobile')} className="input-field w-full mt-1.5" placeholder="+91 XXXXX XXXXX" inputMode="tel" /></label>
        <label className="block"><span className="text-xs font-semibold" style={{ color: 'var(--muted)' }}>Class *</span><select value={form.classLevel} onChange={set('classLevel')} className="input-field w-full mt-1.5"><option value="11">Class 11</option><option value="12">Class 12</option></select></label>
        <label className="block"><span className="text-xs font-semibold" style={{ color: 'var(--muted)' }}>Board *</span><select value={form.board} onChange={set('board')} className="input-field w-full mt-1.5"><option>CBSE</option><option>GSEB</option><option>Other</option></select></label>
        <label className="block"><span className="text-xs font-semibold" style={{ color: 'var(--muted)' }}>Learning mode</span><select disabled={Boolean(demoSlot)} value={demoSlot?.mode || form.studyMode} onChange={set('studyMode')} className="input-field w-full mt-1.5"><option>Either</option><option>Online</option><option>Offline</option></select></label>
        {intent === 'Free Demo' && <label className="block"><span className="text-xs font-semibold" style={{ color: 'var(--muted)' }}>Demo subject</span><select value={form.demoSubject} onChange={set('demoSubject')} className="input-field w-full mt-1.5">{DEMO_SUBJECTS.map((subject) => <option key={subject}>{subject}</option>)}</select></label>}
      </div>

      <div>
        <div className="text-xs font-semibold mb-2" style={{ color: 'var(--muted)' }}>Subjects you need help with *</div>
        <div className="flex flex-wrap gap-2">
          {SUBJECTS.map((subject) => {
            const active = form.subjects.includes(subject);
            return <button type="button" key={subject} onClick={() => toggleSubject(subject)} className="inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-xs font-semibold transition-all" style={{ background: active ? 'var(--gold-bg)' : 'var(--bg-ivory)', border: active ? '1px solid rgba(184,135,47,.45)' : '1px solid var(--border)', color: 'var(--charcoal)' }}>{active && <Check className="w-3.5 h-3.5" />}{subject}</button>;
          })}
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <label className="block"><span className="text-xs font-semibold" style={{ color: 'var(--muted)' }}>Best time to contact</span><select value={form.preferredTime} onChange={set('preferredTime')} className="input-field w-full mt-1.5"><option>Any time</option><option>Morning</option><option>Afternoon</option><option>Evening</option></select></label>
        <label className="block"><span className="text-xs font-semibold" style={{ color: 'var(--muted)' }}>How did you find us?</span><select value={form.source} onChange={set('source')} className="input-field w-full mt-1.5">{SOURCES.map((source) => <option key={source}>{source}</option>)}</select></label>
      </div>

      <label className="block"><span className="text-xs font-semibold" style={{ color: 'var(--muted)' }}>Anything you want help with? <span className="font-normal">(optional)</span></span><textarea maxLength={1000} rows={3} value={form.message} onChange={set('message')} className="input-field w-full mt-1.5 resize-none" placeholder="Example: I struggle with National Income numericals." /></label>

      <div className="absolute -left-[9999px]" aria-hidden="true"><label>Website<input tabIndex="-1" autoComplete="off" value={honeypot} onChange={(e) => setHoneypot(e.target.value)} /></label></div>

      <label className="flex items-start gap-3 rounded-xl p-3" style={{ background: 'var(--bg-ivory)', border: '1px solid var(--border)' }}>
        <input type="checkbox" checked={form.consent} onChange={(e) => { startTracking(); setForm((previous) => ({ ...previous, consent: e.target.checked })); }} className="mt-1" />
        <span className="text-xs leading-relaxed" style={{ color: 'var(--muted)' }}>I agree to be contacted about this enquiry. If I am under 18, my parent/guardian is aware that I am sharing this contact number.</span>
      </label>

      {error && <div className="rounded-xl p-3 text-sm" style={{ background: 'rgba(180,83,60,.08)', border: '1px solid rgba(180,83,60,.2)', color: '#B4533C' }}>{error}</div>}

      <button disabled={busy} className="btn-primary w-full inline-flex items-center justify-center gap-2 py-3.5">{busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}{busy ? 'Checking availability…' : demoSlot ? 'Reserve This Demo Slot' : intent === 'Free Demo' ? 'Request Free Demo' : 'Send Enquiry'}</button>
      <div className="flex items-center justify-center gap-2 text-xs" style={{ color: 'var(--subtle)' }}><ShieldCheck className="w-3.5 h-3.5" /> Your contact details are not shown publicly.</div>
    </form>
  );
}
