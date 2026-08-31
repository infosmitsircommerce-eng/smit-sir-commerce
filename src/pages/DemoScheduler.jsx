import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft, CalendarCheck2, CalendarClock, CheckCircle2, Clock3, ExternalLink,
  Loader2, MapPin, MessageCircle, Monitor, Plus, RefreshCw, ShieldCheck, UserCheck, UserX
} from 'lucide-react';
import SEO from '../components/ui/SEO';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';

const SUBJECTS = ['Any Commerce Subject', 'Accountancy', 'Economics', 'Business Studies', 'Entrepreneurship', 'Physical Education'];
const BOOKING_STATUSES = ['Booked', 'Completed', 'No-show', 'Cancelled'];

function formatDate(value) {
  if (!value) return '—';
  return new Intl.DateTimeFormat('en-IN', { timeZone: 'Asia/Kolkata', weekday: 'short', day: '2-digit', month: 'short', hour: 'numeric', minute: '2-digit', hour12: true }).format(new Date(value));
}
function dateKey(value) {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Kolkata', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date(value));
}
function addDaysKey(days) {
  return dateKey(new Date(Date.now() + days * 86400000));
}
function digits(value) { return String(value || '').replace(/\D/g, ''); }
function whatsappUrl(number, text) { return `https://wa.me/${digits(number)}?text=${encodeURIComponent(text)}`; }
function googleCalendarUrl(slot, lead, booking) {
  if (!slot) return '#';
  const start = new Date(slot.starts_at);
  const end = new Date(start.getTime() + Number(slot.duration_minutes || 45) * 60000);
  const stamp = (date) => date.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}Z$/, 'Z');
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: `Free Commerce Demo — ${lead?.full_name || 'Student'}`,
    dates: `${stamp(start)}/${stamp(end)}`,
    details: `Class ${lead?.class_level || ''} ${lead?.board || ''} · ${booking?.demo_subject || slot.subject_focus || 'Commerce'} · ${lead?.mobile || ''}`,
    location: slot.mode === 'Offline' ? 'Mehsana, Gujarat' : 'Online',
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}
function downloadIcs(slot, lead, booking) {
  if (!slot) return;
  const start = new Date(slot.starts_at);
  const end = new Date(start.getTime() + Number(slot.duration_minutes || 45) * 60000);
  const stamp = (date) => date.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}Z$/, 'Z');
  const clean = (value) => String(value || '').replace(/[;,\\]/g, ' ');
  const body = ['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//Smit Sir Commerce//Demo//EN','BEGIN:VEVENT',`UID:${booking?.id || crypto.randomUUID()}@smitsircommerce.in`,`DTSTAMP:${stamp(new Date())}`,`DTSTART:${stamp(start)}`,`DTEND:${stamp(end)}`,`SUMMARY:${clean(`Free Commerce Demo - ${lead?.full_name || 'Student'}`)}`,`DESCRIPTION:${clean(`Class ${lead?.class_level || ''} ${lead?.board || ''} | ${booking?.demo_subject || slot.subject_focus || ''} | ${lead?.mobile || ''}`)}`,`LOCATION:${clean(slot.mode === 'Offline' ? 'Mehsana, Gujarat' : 'Online')}`,'END:VEVENT','END:VCALENDAR'].join('\r\n');
  const blob = new Blob([body], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a'); a.href = url; a.download = `demo-${lead?.full_name || 'student'}.ics`; document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url);
}

function Restricted({ loggedIn }) {
  return <div className="min-h-screen flex items-center justify-center px-4" style={{ background: 'var(--bg-ivory)' }}><SEO title="Demo Scheduler" description="Restricted owner area." path="/admin/demos" noindex /><div className="card-paper max-w-lg w-full p-8 text-center"><ShieldCheck className="w-10 h-10 mx-auto" style={{ color: 'var(--gold)' }} /><h1 className="text-3xl mt-4" style={{ fontFamily: 'var(--font-serif)', color: 'var(--ink)' }}>{loggedIn ? 'Owner access required' : 'Owner login required'}</h1><p className="text-sm mt-3" style={{ color: 'var(--muted)' }}>Demo schedules and student contact details are private owner data.</p><Link to={loggedIn ? '/dashboard' : '/login'} className="btn-primary inline-flex mt-6">{loggedIn ? 'Back to dashboard' : 'Login'}</Link></div></div>;
}

export default function DemoScheduler() {
  const { user, isAdmin, loading } = useAuth();
  const [slots, setSlots] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [leads, setLeads] = useState([]);
  const [busy, setBusy] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [form, setForm] = useState({ startsAt: '', duration: 45, mode: 'Online', subject: 'Any Commerce Subject', capacity: 1, note: '' });

  const refresh = async () => {
    if (!isAdmin) return;
    setBusy(true); setMessage('');
    const [slotRes, bookingRes, leadRes] = await Promise.all([
      supabase.from('demo_slots').select('*').order('starts_at', { ascending: true }).limit(1000),
      supabase.from('demo_bookings').select('*').order('booked_at', { ascending: false }).limit(3000),
      supabase.from('leads').select('id,full_name,mobile,parent_mobile,class_level,board,subjects,study_mode,source,status,next_follow_up,owner_notes').limit(3000),
    ]);
    const error = slotRes.error || bookingRes.error || leadRes.error;
    if (error) setMessage(`Some demo data could not be loaded: ${error.message}`);
    setSlots(slotRes.data || []); setBookings(bookingRes.data || []); setLeads(leadRes.data || []); setBusy(false);
  };
  useEffect(() => { refresh(); }, [isAdmin]);

  const leadMap = useMemo(() => new Map(leads.map((lead) => [lead.id, lead])), [leads]);
  const slotMap = useMemo(() => new Map(slots.map((slot) => [slot.id, slot])), [slots]);
  const activeSlots = slots.filter((slot) => slot.is_active && new Date(slot.starts_at) > new Date());
  const today = addDaysKey(0); const tomorrow = addDaysKey(1);
  const bookedRows = bookings.filter((booking) => booking.status === 'Booked');
  const todayBookings = bookedRows.filter((booking) => dateKey(slotMap.get(booking.slot_id)?.starts_at) === today);
  const tomorrowBookings = bookedRows.filter((booking) => dateKey(slotMap.get(booking.slot_id)?.starts_at) === tomorrow);
  const pastUnmarked = bookedRows.filter((booking) => { const slot = slotMap.get(booking.slot_id); return slot && new Date(slot.starts_at) < new Date(); });
  const completed = bookings.filter((booking) => booking.status === 'Completed').length;
  const noShows = bookings.filter((booking) => booking.status === 'No-show').length;
  const overdue = leads.filter((lead) => lead.next_follow_up && new Date(lead.next_follow_up) <= new Date() && !['Joined','Lost'].includes(lead.status)).length;

  const sourceStats = useMemo(() => {
    const sources = [...new Set(leads.map((lead) => lead.source || 'Direct'))];
    return sources.map((source) => {
      const sourceLeads = leads.filter((lead) => (lead.source || 'Direct') === source);
      const ids = new Set(sourceLeads.map((lead) => lead.id));
      const sourceBookings = bookings.filter((booking) => ids.has(booking.lead_id));
      return { source, leads: sourceLeads.length, booked: sourceBookings.filter((b) => b.status !== 'Cancelled').length, attended: sourceBookings.filter((b) => b.status === 'Completed').length, joined: sourceLeads.filter((lead) => lead.status === 'Joined').length };
    }).sort((a, b) => b.leads - a.leads);
  }, [leads, bookings]);

  const createSlot = async (event) => {
    event.preventDefault(); setMessage('');
    if (!form.startsAt) { setMessage('Choose a date and time first.'); return; }
    const start = new Date(form.startsAt);
    if (start <= new Date()) { setMessage('Demo slots must be in the future.'); return; }
    setSaving(true);
    const { error } = await supabase.from('demo_slots').insert({ starts_at: start.toISOString(), duration_minutes: Number(form.duration), mode: form.mode, subject_focus: form.subject, capacity: Number(form.capacity), owner_note: form.note.trim() || null, created_by: user.id });
    setSaving(false);
    if (error) setMessage(`Could not create slot: ${error.message}`); else { setMessage('Demo slot published. Students can now book it.'); setForm({ startsAt: '', duration: 45, mode: 'Online', subject: 'Any Commerce Subject', capacity: 1, note: '' }); refresh(); }
  };

  const patchSlot = async (id, patch) => {
    const { error } = await supabase.from('demo_slots').update({ ...patch, updated_at: new Date().toISOString() }).eq('id', id);
    if (error) setMessage(`Could not update slot: ${error.message}`); else refresh();
  };
  const patchBooking = async (booking, patch, successText) => {
    setMessage('');
    const { error } = await supabase.from('demo_bookings').update(patch).eq('id', booking.id);
    if (error) setMessage(/full|available|slot/i.test(error.message || '') ? 'That replacement slot is no longer available.' : `Could not update booking: ${error.message}`);
    else { setMessage(successText); refresh(); }
  };
  const patchLead = async (leadId, patch, successText) => {
    const { error } = await supabase.from('leads').update(patch).eq('id', leadId);
    if (error) setMessage(`Could not update follow-up: ${error.message}`); else { setMessage(successText); refresh(); }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg-ivory)' }}><Loader2 className="w-8 h-8 animate-spin" style={{ color: 'var(--gold)' }} /></div>;
  if (!user) return <Restricted loggedIn={false} />;
  if (!isAdmin) return <Restricted loggedIn />;

  const renderBooking = (booking) => {
    const lead = leadMap.get(booking.lead_id); const slot = slotMap.get(booking.slot_id);
    if (!lead || !slot) return null;
    const reminderText = `Hello ${lead.full_name}, reminder from Smit Sir Commerce: your free demo is ${dateKey(slot.starts_at) === today ? 'today' : 'scheduled'} at ${formatDate(slot.starts_at)} IST (${slot.mode}) for ${booking.demo_subject || slot.subject_focus}. Reply here if you need to reschedule.`;
    const confirmText = `Hello ${lead.full_name}, your free Commerce demo is confirmed for ${formatDate(slot.starts_at)} IST (${slot.mode}) for ${booking.demo_subject || slot.subject_focus}. Reply here if you need any help before the demo.`;
    const nextAction = booking.status === 'Booked' && new Date(slot.starts_at) < new Date() ? 'Demo time passed — record attendance now.' : booking.status === 'Booked' && dateKey(slot.starts_at) === today ? 'Send reminder and prepare for today’s demo.' : booking.status === 'Booked' ? 'Confirmation sent? Keep the slot confirmed.' : booking.status === 'Completed' ? 'Follow up after the demo and answer admission questions.' : booking.status === 'No-show' ? 'Offer a reschedule if the student is still interested.' : 'No action unless the student asks to rebook.';
    return <article key={booking.id} className="tile-paper p-5">
      <div className="flex items-start justify-between gap-3"><div><h3 className="text-xl" style={{ fontFamily: 'var(--font-serif)', color: 'var(--ink)' }}>{lead.full_name}</h3><div className="text-sm mt-1" style={{ color: 'var(--muted)' }}>{lead.mobile} · Class {lead.class_level || '—'} · {lead.board || '—'}</div></div><span className="text-xs font-bold rounded-full px-2.5 py-1" style={{ background: booking.status === 'Completed' ? 'rgba(77,124,15,.09)' : 'var(--gold-bg)', color: booking.status === 'Completed' ? 'var(--green)' : 'var(--gold)' }}>{booking.status}</span></div>
      <div className="grid sm:grid-cols-2 gap-3 mt-4 text-sm"><div><div className="text-xs" style={{ color: 'var(--subtle)' }}>Demo</div><div className="font-semibold mt-1" style={{ color: 'var(--charcoal)' }}>{formatDate(slot.starts_at)} IST</div></div><div><div className="text-xs" style={{ color: 'var(--subtle)' }}>Mode / subject</div><div className="font-semibold mt-1" style={{ color: 'var(--charcoal)' }}>{slot.mode} · {booking.demo_subject || slot.subject_focus}</div></div></div>
      <div className="rounded-xl p-3 mt-4 text-sm" style={{ background: 'var(--gold-bg)', color: 'var(--charcoal)' }}><strong>Recommended next action:</strong> {nextAction}</div>
      <div className="grid sm:grid-cols-2 gap-3 mt-4"><label><span className="text-xs font-semibold" style={{ color: 'var(--muted)' }}>Attendance</span><select value={booking.status} onChange={(e) => patchBooking(booking, { status: e.target.value }, `Demo marked ${e.target.value}.`)} className="input-field w-full mt-1.5">{BOOKING_STATUSES.map((status) => <option key={status}>{status}</option>)}</select></label><label><span className="text-xs font-semibold" style={{ color: 'var(--muted)' }}>Reschedule</span><select value={booking.slot_id} disabled={booking.status !== 'Booked'} onChange={(e) => patchBooking(booking, { slot_id: e.target.value }, 'Demo rescheduled.')} className="input-field w-full mt-1.5"><option value={booking.slot_id}>{formatDate(slot.starts_at)} · current</option>{activeSlots.filter((item) => item.id !== booking.slot_id).map((item) => <option value={item.id} key={item.id}>{formatDate(item.starts_at)} · {item.mode}</option>)}</select></label></div>
      <label className="block mt-3"><span className="text-xs font-semibold" style={{ color: 'var(--muted)' }}>Demo notes</span><textarea key={`${booking.id}-${booking.updated_at}`} defaultValue={booking.demo_notes || ''} rows={2} onBlur={(e) => { if (e.target.value !== (booking.demo_notes || '')) patchBooking(booking, { demo_notes: e.target.value.trim() || null }, 'Demo notes saved.'); }} className="input-field w-full mt-1.5 resize-none" placeholder="Topics discussed, parent questions, student needs…" /></label>
      <label className="block mt-3"><span className="text-xs font-semibold" style={{ color: 'var(--muted)' }}>Next follow-up</span><input type="datetime-local" value={lead.next_follow_up ? new Date(new Date(lead.next_follow_up).getTime() - new Date(lead.next_follow_up).getTimezoneOffset() * 60000).toISOString().slice(0,16) : ''} onChange={(e) => patchLead(lead.id, { next_follow_up: e.target.value ? new Date(e.target.value).toISOString() : null }, 'Follow-up saved.')} className="input-field w-full mt-1.5" /></label>
      <div className="flex flex-wrap gap-2 mt-4"><a href={whatsappUrl(lead.mobile, booking.status === 'Booked' && dateKey(slot.starts_at) === today ? reminderText : confirmText)} target="_blank" rel="noopener noreferrer" className="btn-primary inline-flex items-center gap-2"><MessageCircle className="w-4 h-4" /> {dateKey(slot.starts_at) === today ? 'Reminder' : 'Confirm'}</a>{lead.parent_mobile && <a href={whatsappUrl(lead.parent_mobile, confirmText)} target="_blank" rel="noopener noreferrer" className="btn-secondary">Parent WhatsApp</a>}<a href={googleCalendarUrl(slot, lead, booking)} target="_blank" rel="noopener noreferrer" className="btn-secondary inline-flex items-center gap-2"><CalendarCheck2 className="w-4 h-4" /> Google Calendar</a><button type="button" onClick={() => downloadIcs(slot, lead, booking)} className="btn-secondary">.ics</button><a href={`tel:${lead.mobile}`} className="btn-secondary">Call</a></div>
    </article>;
  };

  return <div className="min-h-screen" style={{ background: 'var(--bg-ivory)' }}><SEO title="Demo Scheduling Center" description="Restricted demo scheduling and follow-up center." path="/admin/demos" noindex />
    <header className="sticky top-0 z-40 border-b" style={{ background: 'rgba(250,246,238,.96)', borderColor: 'var(--border)', backdropFilter: 'blur(16px)' }}><div className="page-container py-4 flex flex-wrap items-center justify-between gap-3"><div><div className="text-xs font-black tracking-[.18em]" style={{ color: 'var(--gold)' }}>DEMO OPERATIONS</div><h1 className="text-2xl mt-1" style={{ fontFamily: 'var(--font-serif)', color: 'var(--ink)' }}>Schedule → Attend → Follow up</h1></div><div className="flex gap-2"><Link to="/admin" className="btn-secondary inline-flex items-center gap-2"><ArrowLeft className="w-4 h-4" /> Owner Hub</Link><Link to="/admin/leads" className="btn-secondary">CRM</Link><button onClick={refresh} className="btn-primary inline-flex items-center gap-2"><RefreshCw className={`w-4 h-4 ${busy ? 'animate-spin' : ''}`} /> Refresh</button></div></div></header>
    <main className="page-container py-8 space-y-7">
      {message && <div className="rounded-xl p-4 text-sm" style={{ background: 'var(--gold-bg)', border: '1px solid rgba(184,135,47,.25)', color: 'var(--charcoal)' }}>{message}</div>}
      <section className="grid grid-cols-2 lg:grid-cols-6 gap-3">{[['Today',todayBookings.length,CalendarClock],['Tomorrow',tomorrowBookings.length,CalendarCheck2],['Upcoming',bookedRows.length,Clock3],['Attendance pending',pastUnmarked.length,UserCheck],['Completed',completed,CheckCircle2],['Follow-ups due',overdue,MessageCircle]].map(([label,value,Icon]) => <div key={label} className="card-paper p-4"><Icon className="w-5 h-5" style={{ color: 'var(--gold)' }} /><div className="text-2xl font-bold mt-3" style={{ fontFamily: 'var(--font-serif)', color: 'var(--ink)' }}>{busy ? '…' : value}</div><div className="text-xs mt-1" style={{ color: 'var(--muted)' }}>{label}</div></div>)}</section>

      <section className="grid lg:grid-cols-[.75fr_1.25fr] gap-5 items-start">
        <form onSubmit={createSlot} className="card-paper p-5 sm:p-6 lg:sticky lg:top-24"><span className="eyebrow">Availability</span><h2 className="text-2xl mt-2" style={{ fontFamily: 'var(--font-serif)', color: 'var(--ink)' }}>Publish a real slot</h2><p className="text-sm mt-2" style={{ color: 'var(--muted)' }}>Students can book only active future slots you publish here.</p><div className="space-y-3 mt-5"><label className="block"><span className="text-xs font-semibold" style={{ color: 'var(--muted)' }}>Date & time</span><input required type="datetime-local" value={form.startsAt} onChange={(e) => setForm({ ...form, startsAt: e.target.value })} className="input-field w-full mt-1.5" /></label><div className="grid grid-cols-2 gap-3"><label><span className="text-xs font-semibold" style={{ color: 'var(--muted)' }}>Minutes</span><input type="number" min="15" max="180" value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })} className="input-field w-full mt-1.5" /></label><label><span className="text-xs font-semibold" style={{ color: 'var(--muted)' }}>Capacity</span><input type="number" min="1" max="20" value={form.capacity} onChange={(e) => setForm({ ...form, capacity: e.target.value })} className="input-field w-full mt-1.5" /></label></div><label className="block"><span className="text-xs font-semibold" style={{ color: 'var(--muted)' }}>Mode</span><select value={form.mode} onChange={(e) => setForm({ ...form, mode: e.target.value })} className="input-field w-full mt-1.5"><option>Online</option><option>Offline</option></select></label><label className="block"><span className="text-xs font-semibold" style={{ color: 'var(--muted)' }}>Subject focus</span><select value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} className="input-field w-full mt-1.5">{SUBJECTS.map((subject) => <option key={subject}>{subject}</option>)}</select></label><label className="block"><span className="text-xs font-semibold" style={{ color: 'var(--muted)' }}>Private owner note</span><input value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} className="input-field w-full mt-1.5" placeholder="Optional" /></label><button disabled={saving} className="btn-primary w-full inline-flex items-center justify-center gap-2"><Plus className="w-4 h-4" /> {saving ? 'Publishing…' : 'Publish Slot'}</button></div>
          <div className="mt-6 border-t pt-5" style={{ borderColor: 'var(--border)' }}><div className="text-sm font-bold" style={{ color: 'var(--ink)' }}>Future slots</div><div className="space-y-2 mt-3 max-h-80 overflow-y-auto">{activeSlots.length ? activeSlots.map((slot) => { const booked = bookings.filter((b) => b.slot_id === slot.id && b.status === 'Booked').length; return <div key={slot.id} className="tile-paper p-3"><div className="flex justify-between gap-2"><div><div className="text-sm font-semibold" style={{ color: 'var(--charcoal)' }}>{formatDate(slot.starts_at)} IST</div><div className="text-xs mt-1" style={{ color: 'var(--muted)' }}>{slot.mode} · {slot.subject_focus} · {booked}/{slot.capacity} booked</div></div><button type="button" onClick={() => patchSlot(slot.id, { is_active: false })} className="text-xs font-bold" style={{ color: '#B4533C' }}>Close</button></div></div>; }) : <p className="text-sm" style={{ color: 'var(--muted)' }}>No future slots published.</p>}</div></div>
        </form>

        <div className="space-y-5">
          <section className="card-paper p-5 sm:p-6"><span className="eyebrow">Today & next</span><h2 className="text-3xl mt-2" style={{ fontFamily: 'var(--font-serif)', color: 'var(--ink)' }}>Demo agenda</h2><div className="space-y-4 mt-5">{bookedRows.length ? bookedRows.sort((a,b) => new Date(slotMap.get(a.slot_id)?.starts_at || 0) - new Date(slotMap.get(b.slot_id)?.starts_at || 0)).map(renderBooking) : <div className="tile-paper p-8 text-center"><CalendarClock className="w-8 h-8 mx-auto" style={{ color: 'var(--gold)' }} /><div className="font-semibold mt-3" style={{ color: 'var(--ink)' }}>No active demo bookings</div><p className="text-sm mt-1" style={{ color: 'var(--muted)' }}>Bookings appear automatically when a student reserves a published slot.</p></div>}</div></section>

          <section className="card-paper p-5 sm:p-6"><span className="eyebrow">Conversion quality</span><h2 className="text-2xl mt-2" style={{ fontFamily: 'var(--font-serif)', color: 'var(--ink)' }}>Source → booked → attended → joined</h2>{sourceStats.length ? <div className="overflow-x-auto mt-4"><table className="w-full min-w-[560px] text-sm"><thead><tr className="text-left border-b" style={{ borderColor: 'var(--border)', color: 'var(--muted)' }}><th className="py-2">Source</th><th>Leads</th><th>Booked</th><th>Attended</th><th>Joined</th></tr></thead><tbody>{sourceStats.map((row) => <tr key={row.source} className="border-b" style={{ borderColor: 'var(--border)' }}><td className="py-3 font-semibold" style={{ color: 'var(--charcoal)' }}>{row.source}</td><td>{row.leads}</td><td>{row.booked}</td><td>{row.attended}</td><td>{row.joined}</td></tr>)}</tbody></table></div> : <p className="text-sm mt-4" style={{ color: 'var(--muted)' }}>Conversion data will appear after real enquiries and demos.</p>}</section>

          {(completed || noShows) > 0 && <section className="card-paper p-5 sm:p-6"><div className="flex items-center gap-2"><UserCheck className="w-5 h-5" style={{ color: 'var(--gold)' }} /><strong style={{ color: 'var(--ink)' }}>{completed} completed</strong><span style={{ color: 'var(--muted)' }}>·</span><UserX className="w-5 h-5" style={{ color: '#B4533C' }} /><strong style={{ color: 'var(--ink)' }}>{noShows} no-show</strong></div></section>}
        </div>
      </section>
    </main>
  </div>;
}
