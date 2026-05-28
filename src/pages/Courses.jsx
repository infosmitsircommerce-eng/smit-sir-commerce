import SEO from '../components/ui/SEO';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { PlayCircle, FileText, HelpCircle, BookOpen, List, ArrowRight, ChevronDown, ChevronUp } from 'lucide-react';
import { class11Subjects, class12Subjects } from '../data/courses';

function ChapterList({ chapters, subject }) {
  const [showAll, setShowAll] = useState(false);
  const displayed = showAll ? chapters : chapters.slice(0, 5);

  return (
    <div className="space-y-2">
      {displayed.map((ch) => (
        <div key={ch.id} className="flex items-center justify-between py-2.5 px-3 bg-navy-800/50 hover:bg-navy-700/50 rounded-lg transition-colors">
          <span className="text-navy-300 text-sm">{ch.id}. {ch.name}</span>
          <div className="flex items-center gap-2">
            <span className="text-navy-500 text-xs">{ch.lectures} lectures</span>
            <Link to="/lectures" className="text-gold-400 hover:text-gold-300">
              <PlayCircle className="w-4 h-4" />
            </Link>
          </div>
        </div>
      ))}
      {chapters.length > 5 && (
        <button
          onClick={() => setShowAll(!showAll)}
          className="text-gold-400 hover:text-gold-300 text-sm flex items-center gap-1 mt-2"
        >
          {showAll ? <><ChevronUp className="w-4 h-4" /> Show Less</> : <><ChevronDown className="w-4 h-4" /> +{chapters.length - 5} more chapters</>}
        </button>
      )}
    </div>
  );
}

function SubjectDetailCard({ subject }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card-premium"
    >
      {/* Header */}
      <div className="flex items-start gap-4 mb-5">
        <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${subject.color} flex items-center justify-center text-2xl shadow-lg flex-shrink-0`}>
          {subject.icon}
        </div>
        <div className="flex-1">
          <h3 className="font-display font-bold text-xl text-white mb-1">
            Class {subject.class} — {subject.name}
          </h3>
          <p className="text-navy-400 text-sm">
            {subject.chapters.length} chapters · {subject.totalLectures} lectures · {subject.totalNotes} note sets
          </p>
        </div>
      </div>

      {/* Action Grid */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        <Link to="/lectures" className="flex flex-col items-center gap-1 bg-navy-800/50 hover:bg-navy-700 rounded-lg p-3 transition-colors group">
          <PlayCircle className="w-5 h-5 text-blue-400 group-hover:scale-110 transition-transform" />
          <span className="text-xs text-navy-300">Lectures</span>
        </Link>
        <Link to="/study-material" className="flex flex-col items-center gap-1 bg-navy-800/50 hover:bg-navy-700 rounded-lg p-3 transition-colors group">
          <FileText className="w-5 h-5 text-emerald-400 group-hover:scale-110 transition-transform" />
          <span className="text-xs text-navy-300">Notes</span>
        </Link>
        <Link to="/quizzes" className="flex flex-col items-center gap-1 bg-navy-800/50 hover:bg-navy-700 rounded-lg p-3 transition-colors group">
          <HelpCircle className="w-5 h-5 text-purple-400 group-hover:scale-110 transition-transform" />
          <span className="text-xs text-navy-300">Quiz</span>
        </Link>
        <Link to="/test-series" className="flex flex-col items-center gap-1 bg-navy-800/50 hover:bg-navy-700 rounded-lg p-3 transition-colors group">
          <BookOpen className="w-5 h-5 text-gold-400 group-hover:scale-110 transition-transform" />
          <span className="text-xs text-navy-300">Tests</span>
        </Link>
        <Link to="/study-material" className="flex flex-col items-center gap-1 bg-navy-800/50 hover:bg-navy-700 rounded-lg p-3 transition-colors group">
          <FileText className="w-5 h-5 text-orange-400 group-hover:scale-110 transition-transform" />
          <span className="text-xs text-navy-300">Important Q</span>
        </Link>
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex flex-col items-center gap-1 bg-navy-800/50 hover:bg-navy-700 rounded-lg p-3 transition-colors group"
        >
          <List className="w-5 h-5 text-cyan-400 group-hover:scale-110 transition-transform" />
          <span className="text-xs text-navy-300">Chapters</span>
        </button>
      </div>

      {/* Chapters (expandable) */}
      {expanded && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="border-t border-navy-700/50 pt-4"
        >
          <h4 className="text-sm font-semibold text-white mb-3">Chapter Plan</h4>
          <ChapterList chapters={subject.chapters} subject={subject} />
        </motion.div>
      )}
    </motion.div>
  );
}

export default function Courses() {
  const [activeClass, setActiveClass] = useState('12');

  const subjects = activeClass === '12' ? class12Subjects : class11Subjects;

  return (
    <div className="min-h-screen bg-navy-950">
      <SEO
        title="CBSE Commerce Courses — Class 11 & 12"
        description="Complete CBSE Commerce courses in Mehsana — Economics, Accountancy, Business Studies, Entrepreneurship. Chapter-wise lectures, notes, quizzes & test series."
        path="/courses"
      />
      {/* Header */}
      <div className="hero-bg py-16 border-b border-navy-800/50">
        <div className="page-container text-center">
          <div className="section-subheading">Complete CBSE Curriculum</div>
          <h1 className="section-heading text-4xl md:text-5xl">
            Our <span className="gradient-text">Courses</span>
          </h1>
          <p className="text-navy-400 max-w-2xl mx-auto">
            Chapter-wise structured courses for Class 11 and 12 Commerce — lectures, notes, quizzes, and tests all in one place.
          </p>
        </div>
      </div>

      <div className="page-container section-padding">
        {/* Class Toggle */}
        <div className="flex items-center justify-center gap-3 mb-10">
          {['11', '12'].map((cls) => (
            <button
              key={cls}
              onClick={() => setActiveClass(cls)}
              className={`px-8 py-3 rounded-xl font-semibold transition-all duration-300 ${
                activeClass === cls
                  ? 'bg-gold-500 text-navy-950 shadow-gold'
                  : 'bg-navy-800 text-navy-300 hover:bg-navy-700'
              }`}
            >
              Class {cls} Commerce
            </button>
          ))}
        </div>

        {/* Subjects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {subjects.map((subject) => (
            <SubjectDetailCard key={subject.id} subject={subject} />
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-14 text-center glass-card p-8">
          <h3 className="font-display font-bold text-2xl text-white mb-3">Ready to Start Learning?</h3>
          <p className="text-navy-400 mb-6">Book a free demo class and see how Smit Sir Commerce makes Commerce easy and exam-ready.</p>
          <Link to="/contact" className="btn-primary inline-flex items-center gap-2">
            Book Free Demo Class <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
