import { Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import {
  Gamepad2, Layers, ListChecks, FileText, Lock, User,
  BarChart3, TrendingUp, BookOpen, Target, Bell, MessageCircle, Sparkles, ArrowRight,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const FREE_FEATURES = [
  { icon: Gamepad2,   text: 'Economics Games (all levels)'     },
  { icon: Layers,     text: 'Flashcard Flipper (all chapters)' },
  { icon: ListChecks, text: 'Chapter Quizzes (basic)'          },
  { icon: FileText,   text: 'Sample notes & previews'          },
];

const PREMIUM_FEATURES = [
  { icon: BarChart3,     text: 'Full Test Series with detailed analysis',   hot: true  },
  { icon: TrendingUp,    text: 'Personal score tracking & progress graph',  hot: false },
  { icon: BookOpen,      text: 'Complete PDF notes for all chapters',       hot: true  },
  { icon: Target,        text: 'Weak-topic reports after every quiz',       hot: false },
  { icon: Bell,          text: 'Exam reminders & study schedule',           hot: false },
  { icon: MessageCircle, text: 'Priority doubt support access',             hot: true  },
];

export default function PremiumUnlock() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '80px' });
  const { user } = useAuth();

  // If already logged in, don't show this
  if (user) return null;

  return (
    <section ref={ref} className="section-padding relative overflow-hidden"
      style={{ background: 'var(--bg-cream)' }}>

      <div className="page-container relative z-10">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-12"
        >
          <span className="eyebrow">Free Account — Takes 30 Seconds</span>
          <h2 className="headline mt-6 mb-3">
            Create your free account &amp; <em>unlock everything.</em>
          </h2>
          <p className="text-sm max-w-lg mx-auto" style={{ color: 'var(--muted)' }}>
            Basic features are open to all. Sign up free to unlock test series, track your scores, and get a personalized study plan.
          </p>
        </motion.div>

        {/* Two-column comparison */}
        <div className="grid md:grid-cols-2 gap-5 max-w-3xl mx-auto mb-10">

          {/* Free column — white */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.1 }}
            className="rounded-2xl p-6"
            style={{ background: 'var(--bg-white)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)' }}
          >
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: 'var(--bg-ivory)', border: '1px solid var(--border)' }}>
                <User style={{ width: '18px', height: '18px', color: 'var(--muted)' }} strokeWidth={1.8} />
              </div>
              <div>
                <div className="text-base" style={{ fontFamily: 'var(--font-serif)', fontWeight: 700, color: 'var(--ink)' }}>Without Account</div>
                <div className="text-xs" style={{ color: 'var(--subtle)' }}>Limited access</div>
              </div>
            </div>
            <ul className="space-y-3">
              {FREE_FEATURES.map(f => {
                const Icon = f.icon;
                return (
                  <li key={f.text} className="flex items-center gap-3">
                    <Icon className="w-4 h-4 flex-shrink-0" style={{ color: 'var(--gold)' }} strokeWidth={1.8} />
                    <span className="text-sm" style={{ color: 'var(--charcoal)' }}>{f.text}</span>
                  </li>
                );
              })}
              {['Full Test Series', 'Score Tracking', 'PDF Notes', 'Weak Topic Reports'].map(t => (
                <li key={t} className="flex items-center gap-3 opacity-45">
                  <Lock className="w-4 h-4 flex-shrink-0" style={{ color: 'var(--subtle)' }} strokeWidth={1.8} />
                  <span className="text-sm line-through" style={{ color: 'var(--subtle)' }}>{t}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Unlocked column — ink */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.15 }}
            className="rounded-2xl p-6 relative overflow-hidden"
            style={{
              background: 'linear-gradient(150deg, var(--ink-bg-2) 0%, var(--ink-bg) 65%)',
              border: '1px solid rgba(217,172,92,0.45)',
              boxShadow: '0 16px 48px rgba(30,24,18,0.18)',
            }}
          >
            <div className="absolute top-0 left-0 right-0 h-px"
              style={{ background: 'linear-gradient(90deg, transparent, rgba(217,172,92,0.8), transparent)' }} />

            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: 'rgba(217,172,92,0.1)', border: '1px solid rgba(217,172,92,0.3)' }}>
                <Sparkles style={{ width: '18px', height: '18px', color: 'var(--gold-bright)' }} strokeWidth={1.8} />
              </div>
              <div>
                <div className="text-base" style={{ fontFamily: 'var(--font-serif)', fontWeight: 700, color: 'var(--ivory-on-ink)' }}>With Free Account</div>
                <div className="text-xs" style={{ color: 'var(--gold-bright)' }}>Full access unlocked</div>
              </div>
            </div>
            <ul className="space-y-3">
              {PREMIUM_FEATURES.map(f => {
                const Icon = f.icon;
                return (
                  <li key={f.text} className="flex items-center gap-3">
                    <Icon className="w-4 h-4 flex-shrink-0" style={{ color: 'var(--gold-bright)' }} strokeWidth={1.8} />
                    <span className="text-sm" style={{ color: 'rgba(243,236,221,0.9)' }}>{f.text}</span>
                    {f.hot && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded-full font-bold flex-shrink-0 tracking-wide"
                        style={{ background: 'rgba(217,172,92,0.15)', color: 'var(--gold-bright)', border: '1px solid rgba(217,172,92,0.3)' }}>
                        HOT
                      </span>
                    )}
                  </li>
                );
              })}
            </ul>
          </motion.div>
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link to="/login" className="btn-gold text-base px-8 py-4">
            Create Free Account — 30 Seconds
            <ArrowRight className="w-4 h-4" />
          </Link>
          <p className="text-xs" style={{ color: 'var(--subtle)' }}>
            No credit card · No spam · Cancel anytime
          </p>
        </motion.div>
      </div>
    </section>
  );
}
