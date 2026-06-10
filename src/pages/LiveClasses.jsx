import { useState } from 'react';
import { motion } from 'framer-motion';
import { Video, Calendar, Clock, Bell, PlayCircle, Radio } from 'lucide-react';
import ComingSoonModal from '../components/ui/ComingSoonModal';

const liveClasses = [
  { id: 1, topic: 'Admission of Partner — Complete Chapter', subject: 'Accountancy', class: 12, date: '2026-05-22', time: '4:00 PM', duration: '1.5 hrs', status: 'upcoming', reminder: false },
  { id: 2, topic: 'National Income — Circular Flow of Income', subject: 'Economics', class: 12, date: '2026-05-20', time: '5:30 PM', duration: '1 hr', status: 'live', reminder: true },
  { id: 3, topic: 'Marketing Mix — 4Ps with Case Studies', subject: 'Business Studies', class: 12, date: '2026-05-19', time: '4:00 PM', duration: '1 hr', status: 'completed', reminder: false },
  { id: 4, topic: 'LPG — Liberalisation, Privatisation, Globalisation', subject: 'Economics', class: 12, date: '2026-05-17', time: '4:30 PM', duration: '1 hr', status: 'completed', reminder: false },
  { id: 5, topic: 'Cash Flow Statement — Full Concept', subject: 'Accountancy', class: 12, date: '2026-05-24', time: '3:00 PM', duration: '2 hrs', status: 'upcoming', reminder: false },
  { id: 6, topic: 'Demand Analysis — Class 11', subject: 'Economics', class: 11, date: '2026-05-21', time: '6:00 PM', duration: '1 hr', status: 'upcoming', reminder: false },
];

function ClassCard({ cls, onComingSoon }) {
  const [reminded, setReminded] = useState(cls.reminder);

  return (
    <motion.div whileHover={{ y: -3 }} className="card-paper p-5"
      style={cls.status === 'live' ? { borderColor: 'rgba(180,83,60,0.4)' } : undefined}>
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="flex items-center gap-2">
          {cls.status === 'live' && (
            <span className="flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full animate-pulse"
              style={{ background: 'rgba(180,83,60,0.1)', color: '#B4533C', border: '1px solid rgba(180,83,60,0.3)' }}>
              <Radio className="w-3 h-3" /> LIVE
            </span>
          )}
          {cls.status === 'upcoming' && (
            <span className="text-xs font-semibold px-3 py-1 rounded-full"
              style={{ background: 'var(--gold-bg)', color: 'var(--gold)', border: '1px solid rgba(184,135,47,0.25)' }}>Upcoming</span>
          )}
          {cls.status === 'completed' && (
            <span className="text-xs font-semibold px-3 py-1 rounded-full"
              style={{ background: 'var(--bg-ivory)', color: 'var(--subtle)', border: '1px solid var(--border)' }}>Recorded</span>
          )}
        </div>
        <span className="text-xs" style={{ color: 'var(--subtle)' }}>Class {cls.class}</span>
      </div>

      <h3 className="mb-1 leading-tight text-sm" style={{ fontFamily: 'var(--font-sans)', fontWeight: 600, color: 'var(--ink)' }}>{cls.topic}</h3>
      <p className="text-sm mb-4" style={{ color: 'var(--gold)' }}>{cls.subject}</p>

      <div className="flex flex-wrap gap-3 text-xs mb-4" style={{ color: 'var(--muted)' }}>
        <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {cls.date}</span>
        <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {cls.time}</span>
        <span className="flex items-center gap-1"><Video className="w-3 h-3" /> {cls.duration}</span>
      </div>

      <div className="flex gap-2">
        {cls.status === 'live' && (
          <button onClick={onComingSoon}
            className="flex-1 font-semibold py-2 rounded-xl text-sm flex items-center justify-center gap-2 transition-all text-white"
            style={{ background: '#B4533C' }}
            onMouseEnter={e => { e.currentTarget.style.background = '#9E4631'; }}
            onMouseLeave={e => { e.currentTarget.style.background = '#B4533C'; }}>
            <Radio className="w-4 h-4" /> Join Live Class
          </button>
        )}
        {cls.status === 'upcoming' && (
          <button
            onClick={() => setReminded(!reminded)}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-sm font-medium transition-all"
            style={reminded
              ? { background: 'var(--gold-bg)', color: 'var(--gold)', border: '1px solid rgba(184,135,47,0.3)' }
              : { background: 'var(--bg-ivory)', color: 'var(--charcoal)', border: '1px solid var(--border)' }}
          >
            <Bell className="w-4 h-4" /> {reminded ? 'Reminder Set' : 'Set Reminder'}
          </button>
        )}
        {cls.status === 'completed' && (
          <button onClick={onComingSoon} className="tile-paper flex-1 flex items-center justify-center gap-1.5 py-2 text-sm font-medium"
            style={{ color: 'var(--charcoal)' }}>
            <PlayCircle className="w-4 h-4" /> Watch Recording
          </button>
        )}
      </div>
    </motion.div>
  );
}

export default function LiveClasses() {
  const [filter, setFilter] = useState('All');
  const [showComingSoon, setShowComingSoon] = useState(false);

  const filtered = liveClasses.filter((c) => filter === 'All' || c.status === filter.toLowerCase());

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-ivory)' }}>
      <div className="page-hero">
        <div className="page-container text-center">
          <span className="eyebrow">Real-Time Learning</span>
          <h1 className="mt-5">Live <em>classes.</em></h1>
          <p className="mx-auto">Join live sessions with Smit Sir and watch recorded classes whenever you want.</p>
        </div>
      </div>

      <div className="page-container section-padding">
        <div className="flex justify-start mb-8">
          <div className="toggle-paper">
            {['All', 'Live', 'Upcoming', 'Completed'].map((f) => (
              <button key={f} onClick={() => setFilter(f)} className={filter === f ? 'active' : ''}>
                {f}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((cls) => <ClassCard key={cls.id} cls={cls} onComingSoon={() => setShowComingSoon(true)} />)}
        </div>
        <ComingSoonModal visible={showComingSoon} onClose={() => setShowComingSoon(false)} title="Live Class Coming Soon!" />
      </div>
    </div>
  );
}
