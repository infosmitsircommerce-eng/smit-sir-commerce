import { Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { useAuth } from '../../context/AuthContext';

const FREE_FEATURES = [
  { icon: '🎮', text: 'Economics Games (all levels)' },
  { icon: '🃏', text: 'Flashcard Flipper (all chapters)' },
  { icon: '📝', text: 'Chapter Quizzes (basic)' },
  { icon: '📄', text: 'Sample notes & previews' },
];

const PREMIUM_FEATURES = [
  { icon: '📊', text: 'Full Test Series with detailed analysis', hot: true },
  { icon: '📈', text: 'Personal score tracking & progress graph', hot: false },
  { icon: '📚', text: 'Complete PDF notes for all chapters', hot: true },
  { icon: '🎯', text: 'Weak-topic reports after every quiz', hot: false },
  { icon: '🔔', text: 'Exam reminders & study schedule', hot: false },
  { icon: '💬', text: 'Priority doubt support access', hot: true },
];

export default function PremiumUnlock() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '80px' });
  const { user } = useAuth();

  // If already logged in, don't show this
  if (user) return null;

  return (
    <section ref={ref} className="section-padding relative overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #070420 0%, #050218 100%)' }}>

      {/* Top glow line */}
      <div className="absolute top-0 left-0 right-0 h-px"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(212,175,55,0.4), transparent)' }} />

      {/* Ambient */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/2 right-0 w-96 h-96 rounded-full opacity-[0.08] blur-3xl -translate-y-1/2 translate-x-1/3"
          style={{ background: 'radial-gradient(circle, #D4AF37 0%, transparent 70%)' }} />
        <div className="absolute top-1/2 left-0 w-96 h-96 rounded-full opacity-[0.06] blur-3xl -translate-y-1/2 -translate-x-1/3"
          style={{ background: 'radial-gradient(circle, #60a5fa 0%, transparent 70%)' }} />
      </div>

      <div className="page-container relative z-10">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-black mb-4"
            style={{ background: 'rgba(212,175,55,0.12)', border: '1px solid rgba(212,175,55,0.3)', color: '#D4AF37' }}>
            🔓 Free Account — Takes 30 Seconds
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white mb-3">
            Create Your Free Account &<br />
            <span style={{ color: '#D4AF37' }}>Unlock Everything</span>
          </h2>
          <p className="text-sm max-w-lg mx-auto" style={{ color: 'rgba(255,255,255,0.5)' }}>
            Basic features are open to all. Sign up free to unlock test series, track your scores, and get a personalized study plan.
          </p>
        </motion.div>

        {/* Two-column comparison */}
        <div className="grid md:grid-cols-2 gap-5 max-w-3xl mx-auto mb-8">

          {/* Free column */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.1 }}
            className="rounded-2xl p-6"
            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}
          >
            <div className="flex items-center gap-2 mb-5">
              <span className="text-lg">👤</span>
              <div>
                <div className="font-black text-white text-base">Without Account</div>
                <div className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>Limited access</div>
              </div>
            </div>
            <ul className="space-y-3">
              {FREE_FEATURES.map(f => (
                <li key={f.text} className="flex items-center gap-3">
                  <span className="text-base flex-shrink-0">{f.icon}</span>
                  <span className="text-sm" style={{ color: 'rgba(255,255,255,0.6)' }}>{f.text}</span>
                </li>
              ))}
              {/* Locked items preview */}
              {['Full Test Series', 'Score Tracking', 'PDF Notes', 'Weak Topic Reports'].map(t => (
                <li key={t} className="flex items-center gap-3 opacity-40">
                  <span className="text-base flex-shrink-0">🔒</span>
                  <span className="text-sm line-through" style={{ color: 'rgba(255,255,255,0.4)' }}>{t}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Premium / Signed In column */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.15 }}
            className="rounded-2xl p-6 relative overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, rgba(212,175,55,0.1) 0%, rgba(10,15,44,0.8) 100%)',
              border: '1.5px solid rgba(212,175,55,0.35)',
              boxShadow: '0 0 40px rgba(212,175,55,0.08)',
            }}
          >
            {/* Glow top */}
            <div className="absolute top-0 left-0 right-0 h-0.5 rounded-full"
              style={{ background: 'linear-gradient(90deg, transparent, rgba(212,175,55,0.7), transparent)' }} />

            <div className="flex items-center gap-2 mb-5">
              <span className="text-lg">✨</span>
              <div>
                <div className="font-black text-white text-base">With Free Account</div>
                <div className="text-xs" style={{ color: '#D4AF37' }}>Full access unlocked</div>
              </div>
            </div>
            <ul className="space-y-3">
              {PREMIUM_FEATURES.map(f => (
                <li key={f.text} className="flex items-center gap-3">
                  <span className="text-base flex-shrink-0">{f.icon}</span>
                  <span className="text-sm text-white">{f.text}</span>
                  {f.hot && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full font-black flex-shrink-0"
                      style={{ background: 'rgba(212,175,55,0.2)', color: '#D4AF37', border: '1px solid rgba(212,175,55,0.3)' }}>
                      HOT
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-3"
        >
          <Link
            to="/login"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl font-black text-navy-950 text-base transition-all active:scale-95"
            style={{ background: 'linear-gradient(135deg, #D4AF37, #F0C040)', boxShadow: '0 8px 30px rgba(212,175,55,0.35)' }}
          >
            🚀 Create Free Account — 30 Seconds
          </Link>
          <p className="text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>
            No credit card · No spam · Cancel anytime
          </p>
        </motion.div>
      </div>
    </section>
  );
}
