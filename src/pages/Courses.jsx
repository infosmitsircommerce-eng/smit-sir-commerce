import SEO from '../components/ui/SEO';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { PlayCircle, FileText, HelpCircle, BookOpen, List, ArrowRight, ChevronDown, ChevronUp } from 'lucide-react';
import { class11Subjects, class12Subjects } from '../data/courses';

function ChapterList({ chapters }) {
  const [showAll, setShowAll] = useState(false);
  const displayed = showAll ? chapters : chapters.slice(0, 5);

  return (
    <div className="space-y-2">
      {displayed.map((ch) => (
        <div key={ch.id} className="tile-paper flex items-center justify-between py-2.5 px-3">
          <span className="text-sm" style={{ color: 'var(--charcoal)' }}>{ch.id}. {ch.name}</span>
          <div className="flex items-center gap-2">
            <span className="text-xs" style={{ color: 'var(--subtle)' }}>{ch.lectures} lectures</span>
            <Link to="/lectures" style={{ color: 'var(--gold)' }}>
              <PlayCircle className="w-4 h-4" />
            </Link>
          </div>
        </div>
      ))}
      {chapters.length > 5 && (
        <button
          onClick={() => setShowAll(!showAll)}
          className="text-sm flex items-center gap-1 mt-2 font-medium"
          style={{ color: 'var(--gold)' }}
        >
          {showAll ? <><ChevronUp className="w-4 h-4" /> Show Less</> : <><ChevronDown className="w-4 h-4" /> +{chapters.length - 5} more chapters</>}
        </button>
      )}
    </div>
  );
}

const ACTIONS = [
  { to: '/lectures',       icon: PlayCircle, label: 'Lectures'    },
  { to: '/study-material', icon: FileText,   label: 'Notes'       },
  { to: '/quizzes',        icon: HelpCircle, label: 'Quiz'        },
  { to: '/test-series',    icon: BookOpen,   label: 'Tests'       },
  { to: '/study-material', icon: FileText,   label: 'Important Q' },
];

function SubjectDetailCard({ subject }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card-paper p-6"
    >
      {/* Header */}
      <div className="flex items-start gap-4 mb-5">
        <div className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
          style={{ background: 'var(--gold-bg)', border: '1px solid rgba(184,135,47,0.22)' }}>
          {subject.icon}
        </div>
        <div className="flex-1">
          <h3 className="text-xl mb-1" style={{ fontFamily: 'var(--font-serif)', fontWeight: 700, color: 'var(--ink)' }}>
            Class {subject.class} — {subject.name}
          </h3>
          <p className="text-sm" style={{ color: 'var(--muted)' }}>
            {subject.chapters.length} chapters · {subject.totalLectures} lectures · {subject.totalNotes} note sets
          </p>
        </div>
      </div>

      {/* Action Grid */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        {ACTIONS.map((a) => {
          const Icon = a.icon;
          return (
            <Link key={a.label} to={a.to} className="tile-paper flex flex-col items-center gap-1 p-3 group">
              <Icon className="w-5 h-5 group-hover:scale-110 transition-transform" style={{ color: 'var(--gold)' }} strokeWidth={1.8} />
              <span className="text-xs" style={{ color: 'var(--charcoal)' }}>{a.label}</span>
            </Link>
          );
        })}
        <button
          onClick={() => setExpanded(!expanded)}
          className="tile-paper flex flex-col items-center gap-1 p-3 group"
        >
          <List className="w-5 h-5 group-hover:scale-110 transition-transform" style={{ color: 'var(--gold)' }} strokeWidth={1.8} />
          <span className="text-xs" style={{ color: 'var(--charcoal)' }}>Chapters</span>
        </button>
      </div>

      {/* Chapters (expandable) */}
      {expanded && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="pt-4"
          style={{ borderTop: '1px solid var(--border-soft)' }}
        >
          <h4 className="text-sm font-semibold mb-3" style={{ color: 'var(--ink)' }}>Chapter Plan</h4>
          <ChapterList chapters={subject.chapters} />
        </motion.div>
      )}
    </motion.div>
  );
}

export default function Courses() {
  const [activeClass, setActiveClass] = useState('12');

  const subjects = activeClass === '12' ? class12Subjects : class11Subjects;

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-ivory)' }}>
      <SEO
        title="CBSE Commerce Courses — Class 11 & 12"
        description="Complete CBSE Commerce courses in Mehsana — Economics, Accountancy, Business Studies, Entrepreneurship. Chapter-wise lectures, notes, quizzes & test series."
        path="/courses"
      />
      {/* Header */}
      <div className="page-hero">
        <div className="page-container text-center">
          <span className="eyebrow">Complete CBSE Curriculum</span>
          <h1 className="mt-5">Our <em>courses.</em></h1>
          <p className="mx-auto">
            Chapter-wise structured courses for Class 11 and 12 Commerce — lectures, notes, quizzes, and tests all in one place.
          </p>
        </div>
      </div>

      <div className="page-container section-padding">
        {/* Class Toggle */}
        <div className="flex items-center justify-center mb-10">
          <div className="toggle-paper">
            {['12', '11'].map((cls) => (
              <button
                key={cls}
                onClick={() => setActiveClass(cls)}
                className={activeClass === cls ? 'active' : ''}
              >
                Class {cls} Commerce
              </button>
            ))}
          </div>
        </div>

        {/* Subjects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {subjects.map((subject) => (
            <SubjectDetailCard key={subject.id} subject={subject} />
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-14 text-center card-paper p-8">
          <h3 className="text-2xl mb-3" style={{ fontFamily: 'var(--font-serif)', fontWeight: 700, color: 'var(--ink)' }}>Ready to start learning?</h3>
          <p className="mb-6" style={{ color: 'var(--muted)' }}>Book a free demo class and see how Smit Sir Commerce makes Commerce easy and exam-ready.</p>
          <Link to="/contact" className="btn-primary inline-flex items-center gap-2">
            Book Free Demo Class <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
