import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, Eye, FileText, Lock, Search, Loader, X, MessageCircle, LogIn } from 'lucide-react';
import { Link } from 'react-router-dom';
import { materialTypes } from '../data/studyMaterial';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

// Premium Lock Modal
function PremiumLockModal({ onClose, isLoggedIn }) {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        style={{ background: 'rgba(30,24,18,0.6)', backdropFilter: 'blur(4px)' }}
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="rounded-2xl p-8 max-w-md w-full relative"
          style={{ background: 'var(--bg-white)', border: '1px solid var(--border)', boxShadow: '0 24px 64px rgba(30,24,18,0.25)' }}
          onClick={(e) => e.stopPropagation()}
        >
          <button onClick={onClose} className="absolute top-4 right-4 transition-colors" style={{ color: 'var(--subtle)' }}>
            <X className="w-5 h-5" />
          </button>

          {/* Lock icon */}
          <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5"
            style={{ background: 'var(--gold-bg)', border: '1px solid rgba(184,135,47,0.3)' }}>
            <Lock className="w-8 h-8" style={{ color: 'var(--gold)' }} />
          </div>

          <h3 className="text-xl text-center mb-2" style={{ fontFamily: 'var(--font-serif)', fontWeight: 700, color: 'var(--ink)' }}>Premium Content</h3>
          <p className="text-sm text-center leading-relaxed mb-6" style={{ color: 'var(--muted)' }}>
            This PDF is exclusive to enrolled students. Join Smit Sir Commerce to get full access to all premium notes, tests, and lectures.
          </p>

          <div className="space-y-3">
            {!isLoggedIn && (
              <Link
                to="/login"
                onClick={onClose}
                className="btn-primary flex items-center justify-center gap-2 w-full py-3 text-sm"
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
              style={{ background: 'rgba(77,124,15,0.08)', border: '1px solid rgba(77,124,15,0.3)', color: 'var(--green)' }}
            >
              <MessageCircle className="w-4 h-4" />
              Contact Smit Sir on WhatsApp
            </a>
            <button
              onClick={onClose}
              className="w-full py-3 rounded-xl text-sm transition-colors"
              style={{ color: 'var(--subtle)' }}
            >
              Maybe Later
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

function MaterialCard({ material, isPremiumUser, onPremiumClick }) {
  const isFree = material.isFree ?? material.is_free;
  const classLevel = material.class ?? material.class_level;
  const fileUrl = material.file_url;

  // Can the user access this material?
  const canAccess = isFree || isPremiumUser;

  return (
    <motion.div whileHover={{ y: -3 }} className="card-paper group flex flex-col p-5">
      <div className="flex items-start gap-3 mb-3">
        <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{ background: 'var(--gold-bg)', border: '1px solid rgba(184,135,47,0.18)' }}>
          <FileText className="w-5 h-5" style={{ color: 'var(--gold)' }} strokeWidth={1.8} />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full"
              style={{ background: 'var(--bg-ivory)', border: '1px solid var(--border)', color: 'var(--charcoal)' }}>
              {material.type}
            </span>
            {isFree
              ? <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ background: 'rgba(77,124,15,0.08)', border: '1px solid rgba(77,124,15,0.25)', color: 'var(--green)' }}>Free</span>
              : <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ background: 'var(--gold-bg)', border: '1px solid rgba(184,135,47,0.25)', color: 'var(--gold)' }}>Premium</span>
            }
          </div>
          <h3 className="text-sm leading-tight" style={{ fontFamily: 'var(--font-sans)', fontWeight: 600, color: 'var(--ink)' }}>{material.title}</h3>
        </div>
      </div>

      <div className="flex items-center gap-3 text-xs mb-4 flex-wrap" style={{ color: 'var(--subtle)' }}>
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
            className="tile-paper flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-medium"
            style={{ color: 'var(--charcoal)' }}
          >
            <Eye className="w-3.5 h-3.5" /> View
          </a>
        ) : (
          <button
            onClick={onPremiumClick}
            className="tile-paper flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-medium"
            style={{ color: 'var(--subtle)' }}
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
            className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold transition-all"
            style={{ background: 'var(--gold-bg)', border: '1px solid rgba(184,135,47,0.3)', color: 'var(--gold)' }}
            onMouseEnter={e => { e.currentTarget.style.background = 'var(--gold)'; e.currentTarget.style.color = '#fff'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'var(--gold-bg)'; e.currentTarget.style.color = 'var(--gold)'; }}
          >
            <Download className="w-3.5 h-3.5" /> Download
          </a>
        ) : (
          <button
            onClick={onPremiumClick}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold transition-colors"
            style={{ background: 'var(--gold-bg)', border: '1px solid rgba(184,135,47,0.2)', color: 'rgba(168,123,42,0.6)' }}
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

  const pillStyle = (active) => active
    ? { background: 'var(--ink)', color: 'var(--ivory-on-ink)', border: '1px solid var(--ink)' }
    : { background: 'var(--bg-white)', color: 'var(--muted)', border: '1px solid var(--border)' };

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

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-ivory)' }}>
      {/* Premium Modal */}
      {showPremiumModal && (
        <PremiumLockModal
          onClose={() => setShowPremiumModal(false)}
          isLoggedIn={!!currentUser}
        />
      )}

      <div className="page-hero">
        <div className="page-container text-center">
          <span className="eyebrow">All Study Resources</span>
          <h1 className="mt-5">Study <em>material.</em></h1>
          <p className="mx-auto">Notes, mind maps, formula sheets, sample papers, PYQs and more — all chapter-wise.</p>

          {/* Premium access banner */}
          {!authLoading && !isPremiumUser && (
            <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium"
              style={{ background: 'var(--gold-bg)', border: '1px solid rgba(184,135,47,0.25)', color: 'var(--gold)' }}>
              <Lock className="w-3.5 h-3.5" />
              {currentUser ? 'Your account doesn\'t have premium access yet' : 'Login or enroll to access premium materials'}
            </div>
          )}
          {!authLoading && isPremiumUser && (
            <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium"
              style={{ background: 'rgba(77,124,15,0.08)', border: '1px solid rgba(77,124,15,0.25)', color: 'var(--green)' }}>
              ✓ You have full premium access
            </div>
          )}
        </div>
      </div>

      <div className="page-container section-padding">
        {/* Material type pills */}
        <div className="flex flex-wrap gap-2 mb-8">
          <button onClick={() => setFilterType('All')} className="px-3 py-1.5 rounded-full text-xs font-medium transition-colors" style={pillStyle(filterType === 'All')}>
            All Types
          </button>
          {materialTypes.map((t) => (
            <button
              key={t}
              onClick={() => setFilterType(t)}
              className="px-3 py-1.5 rounded-full text-xs font-medium transition-colors"
              style={pillStyle(filterType === t)}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Filters */}
        <div className="card-paper p-5 mb-8 flex flex-wrap gap-4">
          <div className="flex-1 min-w-[200px] relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--subtle)' }} />
            <input style={{ ...inputStyle, paddingLeft: '40px' }} placeholder="Search material..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <select value={filterClass} onChange={(e) => setFilterClass(e.target.value)} style={{ ...inputStyle, width: 'auto', minWidth: '140px' }}>
            <option value="All">All Classes</option>
            <option value="11">Class 11</option>
            <option value="12">Class 12</option>
          </select>
          <select value={filterSubject} onChange={(e) => setFilterSubject(e.target.value)} style={{ ...inputStyle, width: 'auto', minWidth: '160px' }}>
            {subjects.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        <div className="text-sm mb-5" style={{ color: 'var(--muted)' }}>
          Showing <span className="font-semibold" style={{ color: 'var(--gold)' }}>{filtered.length}</span> materials
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filtered.map((material) => (
            <MaterialCard
              key={material.id}
              material={material}
              isPremiumUser={isPremiumUser}
              onPremiumClick={() => setShowPremiumModal(true)}
            />
          ))}
        </div>

        {loadingUploaded && (
          <div className="flex items-center justify-center py-16">
            <Loader className="w-6 h-6 animate-spin" style={{ color: 'var(--gold)' }} />
          </div>
        )}
        {!loadingUploaded && filtered.length === 0 && (
          <div className="text-center py-16">
            <FileText className="w-10 h-10 mx-auto mb-3" style={{ color: 'var(--subtle)' }} strokeWidth={1.5} />
            <div style={{ color: 'var(--muted)' }}>No materials found.</div>
          </div>
        )}
      </div>
    </div>
  );
}
