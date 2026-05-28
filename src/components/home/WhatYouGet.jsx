import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, ArrowRight } from 'lucide-react';

const bullets = [
  {
    emoji: '🧠',
    title: 'Concept-First Teaching',
    desc: 'No rote learning. Every chapter in Accountancy, Economics, and Business Studies is explained until you truly understand it — not just memorise it.',
  },
  {
    emoji: '📝',
    title: 'Chapter Tests + Full Mock Papers',
    desc: 'Regular chapter-wise tests after every topic, plus full-syllabus pre-board mock papers — exactly like CBSE board pattern.',
  },
  {
    emoji: '💬',
    title: 'Doubt Solving — After Class & on WhatsApp',
    desc: 'Ask doubts in class, after class, or on WhatsApp. No question is ignored. Our AI Doubt Solver is also available 24/7 on this website.',
  },
  {
    emoji: '📚',
    title: 'Complete Notes + PYQ Practice',
    desc: 'Chapter-wise PDF notes, mind maps, revision sheets, important questions, and 10 years of previous year question papers — all in one place.',
  },
  {
    emoji: '🎓',
    title: 'Separate Batches for Class 11 & Class 12',
    desc: 'Dedicated batches for Class 11 and Class 12 — online (pan India) and offline (Mehsana). English medium focus, small batch size for personal attention.',
  },
  {
    emoji: '📊',
    title: 'Performance Tracking After Every Test',
    desc: 'After each test, get a detailed analysis of your strong and weak topics so you always know exactly what to improve next.',
  },
];

export default function WhatYouGet() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '80px' });

  return (
    <section ref={ref} className="section-padding"
      style={{ background: 'linear-gradient(180deg, #0f0c2e 0%, #080618 100%)' }}>
      <div className="page-container">

        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <div className="section-subheading">What You Get</div>
          <h2 className="section-heading">
            Why Join <span className="gradient-text">Smit Sir Commerce?</span>
          </h2>
          <p className="text-navy-300 max-w-2xl mx-auto mt-3 text-base leading-relaxed">
            Everything you need to score 90+ in CBSE Commerce boards — in one structured, guided programme.
          </p>
        </motion.div>

        {/* Bullets grid */}
        <div className="grid md:grid-cols-2 gap-4 max-w-4xl mx-auto mb-10">
          {bullets.map((b, i) => (
            <motion.div
              key={b.title}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.07, duration: 0.5 }}
              className="flex items-start gap-4 p-5 rounded-2xl group"
              style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.07)',
                transition: 'border-color 0.25s, background 0.25s',
              }}
              whileHover={{ scale: 1.01 }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = 'rgba(212,175,55,0.3)';
                e.currentTarget.style.background = 'rgba(245,158,11,0.06)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)';
                e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
              }}
            >
              {/* Emoji icon */}
              <div className="w-11 h-11 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                style={{ background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.15)' }}>
                {b.emoji}
              </div>

              <div>
                <div className="flex items-center gap-2 mb-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-gold-400 flex-shrink-0" />
                  <h3 className="font-semibold text-white text-sm">{b.title}</h3>
                </div>
                <p className="text-navy-400 text-xs leading-relaxed">{b.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="flex flex-col sm:flex-row gap-3 justify-center items-center"
        >
          <Link to="/contact" className="btn-primary flex items-center gap-2 group">
            Book Free Demo Class
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link to="/courses" className="btn-secondary flex items-center gap-2">
            View All Courses
          </Link>
        </motion.div>

      </div>
    </section>
  );
}
