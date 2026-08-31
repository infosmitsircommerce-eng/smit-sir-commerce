import { useEffect, useMemo, useState } from 'react';
import { CalendarDays, CheckCircle2, Clock3, Loader2, MapPin, Monitor } from 'lucide-react';
import { supabase } from '../../lib/supabase';

function formatDay(value) {
  return new Intl.DateTimeFormat('en-IN', { timeZone: 'Asia/Kolkata', weekday: 'short', day: '2-digit', month: 'short' }).format(new Date(value));
}

function formatTime(value) {
  return new Intl.DateTimeFormat('en-IN', { timeZone: 'Asia/Kolkata', hour: 'numeric', minute: '2-digit', hour12: true }).format(new Date(value));
}

export default function DemoSlotPicker({ selectedId, onSelect }) {
  const [slots, setSlots] = useState([]);
  const [busy, setBusy] = useState(true);
  const [error, setError] = useState('');

  const load = async () => {
    setBusy(true);
    setError('');
    const { data, error: loadError } = await supabase.rpc('list_available_demo_slots');
    if (loadError) setError('Live slots could not be loaded right now. You can still send a demo request below.');
    setSlots(data || []);
    setBusy(false);
  };

  useEffect(() => { load(); }, []);

  const groups = useMemo(() => {
    const map = new Map();
    slots.forEach((slot) => {
      const key = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Kolkata', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date(slot.starts_at));
      if (!map.has(key)) map.set(key, []);
      map.get(key).push(slot);
    });
    return [...map.values()];
  }, [slots]);

  if (busy) return <div className="tile-paper p-6 flex items-center justify-center gap-3 text-sm" style={{ color: 'var(--muted)' }}><Loader2 className="w-4 h-4 animate-spin" /> Loading real available demo slots…</div>;

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <span className="eyebrow">Live availability</span>
          <h2 className="text-3xl mt-2" style={{ fontFamily: 'var(--font-serif)', color: 'var(--ink)' }}>Choose a demo slot</h2>
          <p className="text-sm mt-2" style={{ color: 'var(--muted)' }}>Only times published by Smit Sir appear here. Times are shown in IST.</p>
        </div>
        <button type="button" onClick={load} className="text-xs font-bold" style={{ color: 'var(--gold)' }}>Refresh</button>
      </div>

      {error && <div className="rounded-xl p-3 text-sm" style={{ background: 'rgba(180,83,60,.08)', border: '1px solid rgba(180,83,60,.2)', color: '#B4533C' }}>{error}</div>}

      {!slots.length ? (
        <div className="tile-paper p-5"><CalendarDays className="w-5 h-5" style={{ color: 'var(--gold)' }} /><div className="font-semibold mt-3" style={{ color: 'var(--ink)' }}>No bookable slots are published right now.</div><p className="text-sm mt-1" style={{ color: 'var(--muted)' }}>You can still submit the form below. We’ll contact you to arrange a suitable time.</p></div>
      ) : (
        <div className="space-y-4">
          {groups.map((daySlots) => <div key={daySlots[0].starts_at.slice(0, 10)}>
            <div className="text-sm font-bold mb-2" style={{ color: 'var(--charcoal)' }}>{formatDay(daySlots[0].starts_at)}</div>
            <div className="grid sm:grid-cols-2 gap-2">
              {daySlots.map((slot) => {
                const active = selectedId === slot.id;
                const ModeIcon = slot.mode === 'Online' ? Monitor : MapPin;
                return <button type="button" key={slot.id} onClick={() => onSelect(active ? null : slot)} className="text-left rounded-xl p-4 transition-all" style={{ background: active ? 'var(--gold-bg)' : 'var(--bg-white)', border: active ? '1px solid rgba(184,135,47,.5)' : '1px solid var(--border)', boxShadow: active ? '0 8px 22px rgba(184,135,47,.09)' : 'none' }}>
                  <div className="flex items-center justify-between gap-2"><div className="font-bold" style={{ color: 'var(--ink)' }}>{formatTime(slot.starts_at)}</div>{active && <CheckCircle2 className="w-4 h-4" style={{ color: 'var(--gold)' }} />}</div>
                  <div className="flex flex-wrap gap-x-3 gap-y-1 mt-2 text-xs" style={{ color: 'var(--muted)' }}><span className="inline-flex items-center gap-1"><Clock3 className="w-3.5 h-3.5" /> {slot.duration_minutes} min</span><span className="inline-flex items-center gap-1"><ModeIcon className="w-3.5 h-3.5" /> {slot.mode}</span></div>
                  <div className="text-xs mt-2" style={{ color: 'var(--subtle)' }}>{slot.subject_focus}</div>
                  {slot.capacity > 1 && <div className="text-[11px] mt-2 font-semibold" style={{ color: 'var(--gold)' }}>{slot.remaining} of {slot.capacity} places available</div>}
                </button>;
              })}
            </div>
          </div>)}
        </div>
      )}
    </div>
  );
}
