import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

const reasons = [
  { icon: '🗣️', title: 'Simple Language',        desc: 'Concepts in easy language — no confusion, just clarity.',         color: 'from-amber-400/15 to-amber-400/5' },
  { icon: '📚', title: 'NCERT & CBSE Focus',      desc: 'Every topic covered exactly as per CBSE NCERT syllabus.',          color: 'from-indigo-400/15 to-indigo-400/5' },
  { icon: '📖', title: 'Chapter-Wise Notes',      desc: 'Detailed notes, mind maps, and revision sheets for all subjects.', color: 'from-emerald-400/15 to-emerald-400/5' },
  { icon: '✅', title: 'Regular Quizzes & Tests', desc: 'Chapter tests, unit tests, and full-syllabus test series.',        color: 'from-rose-400/15 to-rose-400/5' },
  { icon: '✍️', title: 'Exam Writing Practice',   desc: 'Board-style answer writing with proper format and scheme.',        color: 'from-sky-400/15 to-sky-400/5' },
  { icon: '💬', title: 'Doubt Solving Support',   desc: 'All doubts resolved quickly — no question is too small.',         color: 'from-violet-400/15 to-violet-400/5' },
  { icon: '🌐', title: 'Real-Life Examples',      desc: 'Practical examples from business and daily life.',                color: 'from-teal-400/15 to-teal-400/5' },
  { icon: '💪', title: 'Motivation & Discipline', desc: 'Guidance and motivation especially for weak students.',           color: 'from-orange-400/15 to-orange-400/5' },
  { icon: '🖥️', title: 'Online + Offline',        desc: 'Flexible — classroom batches or learn from anywhere online.',     color: 'from-cyan-400/15 to-cyan-400/5' },
  { icon: '📊', title: 'Performance Analysis',    desc: 'After every test, detailed analysis of strong and weak topics.',  color: 'from-pink-400/15 to-pink-400/5' },
  { icon: '👨‍🏫', title: 'Personal Guidance',      desc: 'Extra attention and personal support for students who need it.',  color: 'from-lime-400/15 to-lime-400/5' },
  { icon: '🎯', title: 'Result-Oriented',         desc: 'Every effort focused on one goal — scoring better in boards.',    color: 'from-gold-400/15 to-gold-400/5' },
];

export default function WhyChooseUs() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '100px' });

  return (
    <section ref={ref} className="section-padding relative overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #F8FAFC 0%, #F1F5F9 100%)' }}>

      {/* Subtle top separator */}
      <div className="absolute top-0 left-0 right-0 h-px"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(212,175,55,0.3), transparent)' }} />

      <div className="page-container relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-14"
        >
          <div className="section-subheading">Why Students Choose Us</div>
          <h2 className="section-heading" style={{ color: '#111827' }}>
            Why Choose <span className="gradient-text">Smit Sir Commerce?</span>
          </h2>
          <p className="max-w-2xl mx-auto text-base leading-relaxed mt-4" style={{ color: '#374151' }}>
            More than a coaching class — a complete learning system designed to give you the best possible result in CBSE Commerce.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {reasons.map((reason, i) => (
            <motion.div
              key={reason.title}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.04, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="group relative bg-white rounded-2xl p-5 cursor-default overflow-hidden"
              style={{
                border: '1px solid rgba(0,0,0,0.06)',
                boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
                transition: 'transform 0.25s cubic-bezier(0.4,0,0.2,1), box-shadow 0.25s cubic-bezier(0.4,0,0.2,1), border-color 0.25s cubic-bezier(0.4,0,0.2,1)',
              }}
              whileHover={{ y: -4 }}
              onMouseEnter={e => {
                e.currentTarget.style.boxShadow = '0 12px 40px rgba(0,0,0,0.1), 0 0 0 1px rgba(212,175,55,0.2)';
                e.currentTarget.style.borderColor = 'rgba(212,175,55,0.25)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,0.04)';
                e.currentTarget.style.borderColor = 'rgba(0,0,0,0.06)';
              }}
            >
              {/* Hover background wash */}
              <div className={`absolute inset-0 bg-gradient-to-br ${reason.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl pointer-events-none`} />

              <div className="relative z-10">
                {/* Icon bubble */}
                <div className="w-12 h-12 rounded-xl flex items-center justify-center text-xl mb-4 transition-all duration-300 group-hover:scale-110"
                  style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.12)' }}>
                  {reason.icon}
                </div>

                <h3 className="font-semibold text-gray-900 mb-1.5 text-sm leading-snug group-hover:text-amber-700 transition-colors">
                  {reason.title}
                </h3>
                <p className="text-xs leading-relaxed" style={{ color: '#374151' }}>{reason.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
