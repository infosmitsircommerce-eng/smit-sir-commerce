import { useState } from 'react';
import { motion } from 'framer-motion';
import { PlayCircle, Lock, Clock, User, Filter, Search, BookOpen } from 'lucide-react';
import { lectures, continueWatching } from '../data/lectures';
import ComingSoonModal from '../components/ui/ComingSoonModal';

function LectureCard({ lecture, onComingSoon }) {
  return (
    <motion.div
      whileHover={{ y: -3 }}
      className="card-premium group cursor-pointer"
    >
      {/* Thumbnail */}
      <div className="relative bg-navy-800 rounded-xl mb-4 overflow-hidden" style={{ paddingBottom: '56.25%' }}>
        <div className="absolute inset-0 bg-gradient-to-br from-navy-700 to-navy-900 flex items-center justify-center">
          <div className="text-center">
            <PlayCircle className="w-12 h-12 text-gold-400 mx-auto mb-2 group-hover:scale-110 transition-transform" />
            <div className="text-navy-400 text-xs">{lecture.subject}</div>
          </div>
        </div>
        {/* Tags */}
        <div className="absolute top-2 left-2">
          {lecture.isFree ? (
            <span className="tag-free">Free</span>
          ) : (
            <span className="tag-locked flex items-center gap-1">
              <Lock className="w-3 h-3" /> Premium
            </span>
          )}
        </div>
        {/* Duration */}
        <div className="absolute bottom-2 right-2 bg-navy-950/80 rounded-md px-2 py-0.5 text-xs text-white flex items-center gap-1">
          <Clock className="w-3 h-3" /> {lecture.duration}
        </div>
        {/* Progress bar */}
        {lecture.progress > 0 && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-navy-700">
            <div className="h-full bg-gold-400" style={{ width: `${lecture.progress}%` }} />
          </div>
        )}
      </div>

      <div className="flex items-start justify-between gap-2 mb-2">
        <h3 className="font-semibold text-white text-sm leading-tight flex-1">{lecture.title}</h3>
      </div>
      <div className="flex items-center gap-3 text-navy-400 text-xs mb-3">
        <span className="flex items-center gap-1"><BookOpen className="w-3 h-3" /> {lecture.chapter}</span>
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1 text-navy-500 text-xs">
          <User className="w-3 h-3" /> Smit Sir
        </div>
        {lecture.progress > 0 && (
          <div className="text-gold-400 text-xs font-medium">{lecture.progress}% done</div>
        )}
      </div>

      <button
        onClick={onComingSoon}
        className={`mt-3 w-full py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
          lecture.isFree
            ? 'bg-gold-500/20 hover:bg-gold-500 text-gold-400 hover:text-navy-950 border border-gold-500/30'
            : 'bg-navy-700 hover:bg-navy-600 text-navy-300 border border-navy-600'
        }`}>
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
      <h2 className="font-display font-bold text-xl text-white mb-4">Continue Watching</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {inProgress.map((l) => (
          <div key={l.id} className="flex items-center gap-3 bg-navy-900 border border-navy-700 rounded-xl p-4 hover:border-gold-500/40 transition-colors cursor-pointer">
            <div className="w-12 h-12 bg-navy-800 rounded-lg flex items-center justify-center flex-shrink-0">
              <PlayCircle className="w-6 h-6 text-gold-400" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-white text-sm font-medium truncate">{l.title}</div>
              <div className="text-navy-400 text-xs mb-1">{l.subject}</div>
              <div className="h-1.5 bg-navy-700 rounded-full">
                <div className="h-full bg-gold-400 rounded-full" style={{ width: `${l.progress}%` }} />
              </div>
            </div>
            <div className="text-gold-400 text-xs font-medium">{l.progress}%</div>
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
    <div className="min-h-screen bg-navy-950">
      <div className="hero-bg py-16 border-b border-navy-800/50">
        <div className="page-container text-center">
          <div className="section-subheading">Video Learning Library</div>
          <h1 className="section-heading text-4xl md:text-5xl">
            Online <span className="gradient-text">Lectures</span>
          </h1>
          <p className="text-navy-400 max-w-xl mx-auto">Chapter-wise video lectures for all Commerce subjects by Smit Sir.</p>
        </div>
      </div>

      <div className="page-container section-padding">
        <ContinueWatching />

        {/* Search + Filters */}
        <div className="bg-navy-900/80 border border-navy-700/50 rounded-2xl p-5 mb-8">
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[200px] relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-navy-500" />
              <input
                className="input-field pl-10"
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
                className="input-field min-w-[140px] flex-1"
              >
                {f.options.map((o) => <option key={o} value={o}>{f.label !== 'Class' ? o : o === 'All' ? 'All Classes' : `Class ${o}`}</option>)}
              </select>
            ))}
          </div>
        </div>

        {/* Results count */}
        <div className="text-navy-400 text-sm mb-5">
          Showing <span className="text-gold-400 font-medium">{filtered.length}</span> lectures
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
            <div className="text-4xl mb-3">📹</div>
            <div className="text-navy-400">No lectures found. Try different filters.</div>
          </div>
        )}
      </div>
    </div>
  );
}
