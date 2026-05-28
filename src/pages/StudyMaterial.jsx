import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, Eye, FileText, Lock, Search, Loader, X, MessageCircle, LogIn } from 'lucide-react';
import { Link } from 'react-router-dom';
import { materialTypes } from '../data/studyMaterial';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

const typeColors = {
  'PDF Notes': 'text-blue-400 bg-blue-400/10',
  'Revision Sheet': 'text-emerald-400 bg-emerald-400/10',
  'Mind Map': 'text-purple-400 bg-purple-400/10',
  'Formula Sheet': 'text-gold-400 bg-gold-400/10',
  'One-Shot Notes': 'text-orange-400 bg-orange-400/10',
  'Case Study': 'text-red-400 bg-red-400/10',
  'Important Questions': 'text-cyan-400 bg-cyan-400/10',
  'Board Exam Notes': 'text-pink-400 bg-pink-400/10',
  'Sample Paper': 'text-indigo-400 bg-indigo-400/10',
  'PYQ': 'text-yellow-400 bg-yellow-400/10',
  'Practice Sheet': 'text-teal-400 bg-teal-400/10',
  'NCERT Solutions': 'text-lime-400 bg-lime-400/10',
};

// Premium Lock Modal
function PremiumLockModal({ onClose, isLoggedIn }) {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(4px)' }}
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="bg-navy-900 border border-navy-700 rounded-2xl p-8 max-w-md w-full relative"
          style={{ boxShadow: '0 0 60px rgba(212,175,55,0.15), 0 24px 60px rgba(0,0,0,0.5)' }}
          onClick={(e) => e.stopPropagation()}
        >
          <button onClick={onClose} className="absolute top-4 right-4 text-navy-400 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>

          {/* Lock icon */}
          <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5"
            style={{ background: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.3)' }}>
            <Lock className="w-8 h-8 text-gold-400" />
          </div>

          <h3 className="text-white font-bold text-xl text-center mb-2">Premium Content</h3>
          <p className="text-navy-400 text-sm text-center leading-relaxed mb-6">
            This PDF is exclusive to enrolled students. Join Smit Sir Commerce to get full access to all premium notes, tests, and lectures.
          </p>

          <div className="space-y-3">
            {!isLoggedIn && (
              <Link
                to="/login"
                onClick={onClose}
                className="flex items-center justify-center gap-2 w-full py-3 rounded-xl font-semibold text-sm transition-all"
                style={{ background: 'rgba(212,175,55,0.15)', border: '1px solid rgba(212,175,55,0.3)', color: '#D4AF37' }}
              >
                <LogIn className="w-4 h-4" />
                Login to Your Account
              </Link>
            )}
            <a
              href="https://wa.me/917990083625?text=Hi%20Smit%20Sir%2C%20I%20want%20to%20access%20the%20premium%20study%20material.%20Please%20help%20me%20enroll."
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-3 rounded-xl font-semibold text-sm transition-all"
              style={{ background: 'rgba(37,211,102,0.12)', border: '1px solid rgba(37,211,102,0.3)', color: '#25d366' }}
            >
              <MessageCircle className="w-4 h-4" />
              Contact Smit Sir on WhatsApp
            </a>
            <button
              onClick={onClose}
              className="w-full py-3 rounded-xl text-sm text-navy-400 hover:text-white transition-colors"
            >
              Maybe Later
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

function MaterialCard({ material, currentUser, isPremiumUser, onPremiumClick }) {
  const color = typeColors[material.type] || 'text-navy-400 bg-navy-400/10';
  const isFree = material.isFree ?? material.is_free;
  const classLevel = material.class ?? material.class_level;
  const fileUrl = material.file_url;

  // Can the user access this material?
  const canAccess = isFree || isPremiumUser;

  return (
    <motion.div whileHover={{ y: -3 }} className="card-premium group flex flex-col">
      <div className="flex items-start gap-3 mb-3">
        <div className="w-10 h-10 rounded-lg bg-navy-800 flex items-center justify-center flex-shrink-0">
          <FileText className="w-5 h-5 text-gold-400" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${color}`}>{material.type}</span>
            {isFree
              ? <span className="tag-free">Free</span>
              : <span className="tag-premium">Premium</span>
            }
          </div>
          <h3 className="font-semibold text-white text-sm leading-tight">{material.title}</h3>
        </div>
      </div>

      <div className="flex items-center gap-3 text-navy-400 text-xs mb-4 flex-wrap">
        <span>{material.subject}</span>
        <span>•</span>
        <span>Class {classLevel}</span>
        {material.pages && <><span>•</span><span>{material.pages} pages</span></>}
      </div>

      <div className="mt-auto flex gap-2">
        {/* VIEW BUTTON */}
        {canAccess && fileUrl ? (
          <a
            href={fileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-navy-800 hover:bg-navy-700 text-navy-300 hover:text-white text-xs transition-colors"
          >
            <Eye className="w-3.5 h-3.5" /> View
          </a>
        ) : (
          <button
            onClick={onPremiumClick}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-navy-800 hover:bg-navy-700 text-navy-400 hover:text-gold-400 text-xs transition-colors"
          >
            <Lock className="w-3.5 h-3.5" /> View
          </button>
        )}

        {/* DOWNLOAD BUTTON */}
        {canAccess && fileUrl ? (
          <a
            href={fileUrl}
            download
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs transition-colors bg-gold-500/20 hover:bg-gold-500 text-gold-400 hover:text-navy-950 border border-gold-500/30"
          >
            <Download className="w-3.5 h-3.5" /> Download
          </a>
        ) : (
          <button
            onClick={onPremiumClick}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs transition-colors"
            style={{ background: 'rgba(212,175,55,0.08)', border: '1px solid rgba(212,175,55,0.2)', color: 'rgba(212,175,55,0.6)' }}
          >
            <Lock className="w-3.5 h-3.5" /> Unlock
          </button>
        )}
      </div>
    </motion.div>
  );
}

export default function StudyMaterial() {
  const [search, setSearch] = useState('');
  const [filterClass, setFilterClass] = useState('All');
  const [filterType, setFilterType] = useState('All');
  const [filterSubject, setFilterSubject] = useState('All');
  const [uploadedMaterials, setUploadedMaterials] = useState([]);
  const [loadingUploaded, setLoadingUploaded] = useState(true);
  const [showPremiumModal, setShowPremiumModal] = useState(false);

  // Use global AuthContext
  const { user: currentUser, isPremium: isPremiumUser, loading: authLoading } = useAuth();

  // Load materials
  useEffect(() => {
    supabase.from('study_materials').select('*').order('created_at', { ascending: false })
      .then(({ data }) => { setUploadedMaterials(data || []); setLoadingUploaded(false); });
  }, []);

  const subjects = ['All', 'Accountancy', 'Business Studies', 'Economics', 'Entrepreneurship', 'Physical Education', 'All Subjects'];

  const filtered = uploadedMaterials.filter((m) => {
    const classLevel = m.class ?? m.class_level;
    const matchSearch = m.title.toLowerCase().includes(search.toLowerCase()) || m.subject.toLowerCase().includes(search.toLowerCase());
    const matchClass = filterClass === 'All' || classLevel === Number(filterClass);
    const matchType = filterType === 'All' || m.type === filterType;
    const matchSubject = filterSubject === 'All' || m.subject === filterSubject;
    return matchSearch && matchClass && matchType && matchSubject;
  });

  return (
    <div className="min-h-screen bg-navy-950">
      {/* Premium Modal */}
      {showPremiumModal && (
        <PremiumLockModal
          onClose={() => setShowPremiumModal(false)}
          isLoggedIn={!!currentUser}
        />
      )}

      <div className="hero-bg py-16 border-b border-navy-800/50">
        <div className="page-container text-center">
          <div className="section-subheading">All Study Resources</div>
          <h1 className="section-heading text-4xl md:text-5xl">Study <span className="gradient-text">Material</span></h1>
          <p className="text-navy-400 max-w-xl mx-auto">Notes, mind maps, formula sheets, sample papers, PYQs and more — all chapter-wise.</p>

          {/* Premium access banner */}
          {!authLoading && !isPremiumUser && (
            <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium"
              style={{ background: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.25)', color: '#D4AF37' }}>
              <Lock className="w-3.5 h-3.5" />
              {currentUser ? 'Your account doesn\'t have premium access yet' : 'Login or enroll to access premium materials'}
            </div>
          )}
          {!authLoading && isPremiumUser && (
            <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium"
              style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.25)', color: '#10b981' }}>
              ✓ You have full premium access
            </div>
          )}
        </div>
      </div>

      <div className="page-container section-padding">
        {/* Material type pills */}
        <div className="flex flex-wrap gap-2 mb-8">
          <button onClick={() => setFilterType('All')} className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${filterType === 'All' ? 'bg-gold-500 text-navy-950' : 'bg-navy-800 text-navy-400 hover:bg-navy-700'}`}>
            All Types
          </button>
          {materialTypes.map((t) => (
            <button
              key={t}
              onClick={() => setFilterType(t)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${filterType === t ? 'bg-gold-500 text-navy-950' : 'bg-navy-800 text-navy-400 hover:bg-navy-700'}`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Filters */}
        <div className="bg-navy-900/80 border border-navy-700/50 rounded-2xl p-5 mb-8 flex flex-wrap gap-4">
          <div className="flex-1 min-w-[200px] relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-navy-500" />
            <input className="input-field pl-10" placeholder="Search material..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <select value={filterClass} onChange={(e) => setFilterClass(e.target.value)} className="input-field min-w-[140px]">
            <option value="All">All Classes</option>
            <option value="11">Class 11</option>
            <option value="12">Class 12</option>
          </select>
          <select value={filterSubject} onChange={(e) => setFilterSubject(e.target.value)} className="input-field min-w-[160px]">
            {subjects.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        <div className="text-navy-400 text-sm mb-5">
          Showing <span className="text-gold-400 font-medium">{filtered.length}</span> materials
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filtered.map((material) => {
            const isFree = material.isFree ?? material.is_free;
            return (
              <MaterialCard
                key={material.id}
                material={material}
                currentUser={currentUser}
                isPremiumUser={isPremiumUser}
                onPremiumClick={() => setShowPremiumModal(true)}
              />
            );
          })}
        </div>

        {loadingUploaded && (
          <div className="flex items-center justify-center py-16">
            <Loader className="w-6 h-6 text-gold-400 animate-spin" />
          </div>
        )}
        {!loadingUploaded && filtered.length === 0 && (
          <div className="text-center py-16">
            <div className="text-4xl mb-3">📄</div>
            <div className="text-navy-400">No materials found. Upload PDFs from the Admin Panel.</div>
          </div>
        )}
      </div>
    </div>
  );
}
