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

const statusConfig = {
  live: { label: 'LIVE NOW', color: 'bg-red-500', textColor: 'text-red-400', border: 'border-red-500/30' },
  upcoming: { label: 'Upcoming', color: 'bg-blue-500', textColor: 'text-blue-400', border: 'border-blue-500/30' },
  completed: { label: 'Completed', color: 'bg-navy-600', textColor: 'text-navy-400', border: 'border-navy-600/30' },
};

function ClassCard({ cls, onComingSoon }) {
  const [reminded, setReminded] = useState(cls.reminder);
  const config = statusConfig[cls.status];

  return (
    <motion.div whileHover={{ y: -3 }} className={`card-premium border ${config.border}`}>
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="flex items-center gap-2">
          {cls.status === 'live' && (
            <span className="flex items-center gap-1.5 bg-red-500/20 text-red-400 text-xs font-bold px-3 py-1 rounded-full border border-red-500/30 animate-pulse">
              <Radio className="w-3 h-3" /> LIVE
            </span>
          )}
          {cls.status === 'upcoming' && (
            <span className="bg-blue-500/20 text-blue-400 text-xs font-semibold px-3 py-1 rounded-full border border-blue-500/30">Upcoming</span>
          )}
          {cls.status === 'completed' && (
            <span className="bg-navy-700 text-navy-400 text-xs font-semibold px-3 py-1 rounded-full">Recorded</span>
          )}
        </div>
        <span className="text-navy-400 text-xs">Class {cls.class}</span>
      </div>

      <h3 className="font-semibold text-white mb-1 leading-tight">{cls.topic}</h3>
      <p className="text-gold-400 text-sm mb-4">{cls.subject}</p>

      <div className="flex flex-wrap gap-3 text-xs text-navy-400 mb-4">
        <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {cls.date}</span>
        <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {cls.time}</span>
        <span className="flex items-center gap-1"><Video className="w-3 h-3" /> {cls.duration}</span>
      </div>

      <div className="flex gap-2">
        {cls.status === 'live' && (
          <button onClick={onComingSoon} className="flex-1 bg-red-500 hover:bg-red-400 text-white font-semibold py-2 rounded-xl text-sm flex items-center justify-center gap-2 transition-colors">
            <Radio className="w-4 h-4" /> Join Live Class
          </button>
        )}
        {cls.status === 'upcoming' && (
          <>
            <button
              onClick={() => setReminded(!reminded)}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-sm border transition-colors ${
                reminded
                  ? 'bg-gold-500/20 text-gold-400 border-gold-500/30'
                  : 'bg-navy-700 text-navy-300 border-navy-600 hover:border-gold-500/40'
              }`}
            >
              <Bell className="w-4 h-4" /> {reminded ? 'Reminder Set' : 'Set Reminder'}
            </button>
          </>
        )}
        {cls.status === 'completed' && (
          <button onClick={onComingSoon} className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-navy-700 hover:bg-navy-600 text-navy-300 text-sm border border-navy-600 transition-colors">
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
    <div className="min-h-screen bg-navy-950">
      <div className="hero-bg py-16 border-b border-navy-800/50">
        <div className="page-container text-center">
          <div className="section-subheading">Real-Time Learning</div>
          <h1 className="section-heading text-4xl md:text-5xl">Live <span className="gradient-text">Classes</span></h1>
          <p className="text-navy-400 max-w-xl mx-auto">Join live sessions with Smit Sir and watch recorded classes whenever you want.</p>
        </div>
      </div>

      <div className="page-container section-padding">
        <div className="flex items-center gap-3 mb-8">
          {['All', 'Live', 'Upcoming', 'Completed'].map((f) => (
            <button key={f} onClick={() => setFilter(f)} className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${filter === f ? 'bg-gold-500 text-navy-950' : 'bg-navy-800 text-navy-300 hover:bg-navy-700'}`}>
              {f}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((cls) => <ClassCard key={cls.id} cls={cls} onComingSoon={() => setShowComingSoon(true)} />)}
        </div>
        <ComingSoonModal visible={showComingSoon} onClose={() => setShowComingSoon(false)} title="Live Class Coming Soon!" />
      </div>
    </div>
  );
}
