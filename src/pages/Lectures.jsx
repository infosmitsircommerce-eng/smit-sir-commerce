import { useState } from 'react';
import { motion } from 'framer-motion';
import { PlayCircle, Lock, Clock, User, Search, BookOpen, Video } from 'lucide-react';
import { lectures, continueWatching } from '../data/lectures';
import ComingSoonModal from '../components/ui/ComingSoonModal';

const inputStyle = {
  background: 'var(--bg-white)',
  border: '1px solid var(--border)',
  borderRadius: '12px',
  color: 'var(--ink)',
  padding: '12px 16px',
  fontFamily: 'var(--font-sans)',
  fontSize: '14px',
  width: '100%',
};

function LectureCard({ lecture, onComingSoon }) {
  return (
    <motion.div
      whileHover={{ y: -3 }}
      className="card-paper group cursor-pointer p-5"
    >
      {/* Thumbnail */}
      <div className="relative rounded-xl mb-4 overflow-hidden" style={{ paddingBottom: '56.25%', background: 'var(--ink-bg)' }}>
        <div className="absolute inset-0 flex items-center justify-center"
          style={{ background: 'linear-gradient(135deg, var(--ink-bg-2), var(--ink-bg))' }}>
          <div className="text-center">
            <PlayCircle className="w-12 h-12 mx-auto mb-2 group-hover:scale-110 transition-transform" style={{ color: 'var(--gold-bright)' }} strokeWidth={1.5} />
            <div className="text-xs" style={{ color: 'var(--muted-on-ink)' }}>{lecture.subject}</div>
          </div>
        </div>
        {/* Tags */}
        <div className="absolute top-2 left-2">
          {lecture.isFree ? (
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ background: 'rgba(143,191,107,0.15)', border: '1px solid rgba(143,191,107,0.35)', color: '#8FBF6B' }}>Free</span>
          ) : (
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full flex items-center gap-1" style={{ background: 'rgba(217,172,92,0.15)', border: '1px solid rgba(217,172,92,0.35)', color: 'var(--gold-bright)' }}>
              <Lock className="w-3 h-3" /> Premium
            </span>
          )}
        </div>
        {/* Duration */}
        <div className="absolute bottom-2 right-2 rounded-md px-2 py-0.5 text-xs flex items-center gap-1"
          style={{ background: 'rgba(24,19,16,0.85)', color: 'var(--ivory-on-ink)' }}>
          <Clock className="w-3 h-3" /> {lecture.duration}
        </div>
        {/* Progress bar */}
        {lecture.progress > 0 && (
          <div className="absolute bottom-0 left-0 right-0 h-1" style={{ background: 'rgba(243,236,221,0.15)' }}>
            <div className="h-full" style={{ width: `${lecture.progress}%`, background: 'var(--gold-bright)' }} />
          </div>
        )}
      </div>

      <div className="flex items-start justify-between gap-2 mb-2">
        <h3 className="text-sm leading-tight flex-1" style={{ fontFamily: 'var(--font-sans)', fontWeight: 600, color: 'var(--ink)' }}>{lecture.title}</h3>
      </div>
      <div className="flex items-center gap-3 text-xs mb-3" style={{ color: 'var(--subtle)' }}>
        <span className="flex items-center gap-1"><BookOpen className="w-3 h-3" /> {lecture.chapter}</span>
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1 text-xs" style={{ color: 'var(--subtle)' }}>
          <User className="w-3 h-3" /> Smit Sir
        </div>
        {lecture.progress > 0 && (
          <div className="text-xs font-medium" style={{ color: 'var(--gold)' }}>{lecture.progress}% done</div>
        )}
      </div>

      <button
        onClick={onComingSoon}
        className="mt-3 w-full py-2 rounded-lg text-sm font-semibold transition-all flex items-center justify-center gap-2"
        style={lecture.isFree
          ? { background: 'var(--gold-bg)', border: '1px solid rgba(184,135,47,0.3)', color: 'var(--gold)' }
          : { background: 'var(--bg-ivory)', border: '1px solid var(--border)', color: 'var(--muted)' }}
        onMouseEnter={e => {
          if (lecture.isFree) { e.currentTarget.style.background = 'var(--gold)'; e.currentTarget.style.color = '#fff'; }
        }}
        onMouseLeave={e => {
          if (lecture.isFree) { e.currentTarget.style.background = 'var(--gold-bg)'; e.currentTarget.style.color = 'var(--gold)'; }
        }}>
        {lecture.isFree ? <><PlayCircle className="w-4 h-4" /> Watch Now</> : <><Lock className="w-4 h-4" /> Unlock</>}
      </button>
    </motion.div>
  );
}

function ContinueWatching() {
  const inProgress = continueWatching.filter(l => l.progress < 100 && l.progress > 0);
  if (!inProgress.length) return null;

  return (
    <div className="mb-10">
      <h2 className="text-xl mb-4" style={{ fontFamily: 'var(--font-serif)', fontWeight: 700, color: 'var(--ink)' }}>Continue Watching</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {inProgress.map((l) => (
          <div key={l.id} className="card-paper flex items-center gap-3 p-4 cursor-pointer">
            <div className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ background: 'var(--gold-bg)', border: '1px solid rgba(184,135,47,0.18)' }}>
              <PlayCircle className="w-6 h-6" style={{ color: 'var(--gold)' }} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium truncate" style={{ color: 'var(--ink)' }}>{l.title}</div>
              <div className="text-xs mb-1" style={{ color: 'var(--subtle)' }}>{l.subject}</div>
              <div className="h-1.5 rounded-full" style={{ background: 'var(--border-soft)' }}>
                <div className="h-full rounded-full" style={{ width: `${l.progress}%`, background: 'var(--gold)' }} />
              </div>
            </div>
            <div className="text-xs font-medium" style={{ color: 'var(--gold)' }}>{l.progress}%</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function LecturesPage() {
  const [search, setSearch] = useState('');
  const [filterClass, setFilterClass] = useState('All');
  const [filterSubject, setFilterSubject] = useState('All');
  const [filterType, setFilterType] = useState('All');
  const [showComingSoon, setShowComingSoon] = useState(false);

  const subjects = ['All', 'Accountancy', 'Business Studies', 'Economics', 'Entrepreneurship', 'Physical Education'];

  const filtered = lectures.filter((l) => {
    const matchSearch = l.title.toLowerCase().includes(search.toLowerCase()) ||
      l.subject.toLowerCase().includes(search.toLowerCase());
    const matchClass = filterClass === 'All' || l.class === Number(filterClass);
    const matchSubject = filterSubject === 'All' || l.subject === filterSubject;
    const matchType = filterType === 'All' || (filterType === 'Free' ? l.isFree : !l.isFree);
    return matchSearch && matchClass && matchSubject && matchType;
  });

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-ivory)' }}>
      <div className="page-hero">
        <div className="page-container text-center">
          <span className="eyebrow">Video Learning Library</span>
          <h1 className="mt-5">Online <em>lectures.</em></h1>
          <p className="mx-auto">Chapter-wise video lectures for all Commerce subjects by Smit Sir.</p>
        </div>
      </div>

      <div className="page-container section-padding">
        <ContinueWatching />

        {/* Search + Filters */}
        <div className="card-paper p-5 mb-8">
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[200px] relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--subtle)' }} />
              <input
                style={{ ...inputStyle, paddingLeft: '40px' }}
                placeholder="Search lectures..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            {[
              { label: 'Class', value: filterClass, onChange: setFilterClass, options: ['All', '11', '12'] },
              { label: 'Subject', value: filterSubject, onChange: setFilterSubject, options: subjects },
              { label: 'Type', value: filterType, onChange: setFilterType, options: ['All', 'Free', 'Premium'] },
            ].map((f) => (
              <select
                key={f.label}
                value={f.value}
                onChange={(e) => f.onChange(e.target.value)}
                style={{ ...inputStyle, width: 'auto', minWidth: '140px', flex: 1 }}
              >
                {f.options.map((o) => <option key={o} value={o}>{f.label !== 'Class' ? o : o === 'All' ? 'All Classes' : `Class ${o}`}</option>)}
              </select>
            ))}
          </div>
        </div>

        {/* Results count */}
        <div className="text-sm mb-5" style={{ color: 'var(--muted)' }}>
          Showing <span className="font-semibold" style={{ color: 'var(--gold)' }}>{filtered.length}</span> lectures
        </div>

        {/* Lecture Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filtered.map((lecture) => (
            <LectureCard key={lecture.id} lecture={lecture} onComingSoon={() => setShowComingSoon(true)} />
          ))}
        </div>
        <ComingSoonModal visible={showComingSoon} onClose={() => setShowComingSoon(false)} title="Video Coming Soon!" />

        {filtered.length === 0 && (
          <div className="text-center py-16">
            <Video className="w-10 h-10 mx-auto mb-3" style={{ color: 'var(--subtle)' }} strokeWidth={1.5} />
            <div style={{ color: 'var(--muted)' }}>No lectures found. Try different filters.</div>
          </div>
        )}
      </div>
    </div>
  );
}
