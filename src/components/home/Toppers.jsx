import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Star } from 'lucide-react';

const toppers = [
  { rank: 1, name: 'Heer Patel',     score: '95%', subject: 'Economics',        class: 'Class 12' },
  { rank: 2, name: 'Niv Patel',      score: '94%', subject: 'Accountancy',      class: 'Class 12' },
  { rank: 3, name: 'Manan Dunti',    score: '93%', subject: 'Accountancy',      class: 'Class 12' },
  { rank: 4, name: 'Mann Prajapati', score: '92%', subject: 'Economics',        class: 'Class 12' },
  { rank: 5, name: 'Laksh Rajput',   score: '91%', subject: 'Accountancy',      class: 'Class 12' },
  { rank: 6, name: 'Vishal Rajput',  score: '90%', subject: 'Business Studies', class: 'Class 12' },
  { rank: 7, name: 'Kavya Patel',    score: '89%', subject: 'Online Batch',     class: 'Class 11' },
  { rank: 8, name: 'Arwa Rupawala',  score: '88%', subject: 'All Subjects',     class: 'Class 11' },
  { rank: 9, name: 'Hussaina',       score: '86%', subject: 'Economics',        class: 'Class 11' },
];

export default function Toppers() {
  const ref    = useRef(null);
  const inView = useInView(ref, { once: true, margin: '100px' });

  return (
    <section ref={ref} className="section-padding relative overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #060321 0%, #040218 100%)' }}>

      {/* Top separator */}
      <div className="absolute top-0 left-0 right-0 h-px"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(245,158,11,0.3), transparent)' }} />

      {/* Ambient glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] rounded-full opacity-[0.1] blur-3xl"
          style={{ background: 'radial-gradient(ellipse, rgba(245,158,11,0.8) 0%, transparent 70%)' }} />
      </div>

      <div className="page-container relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-12"
        >
          <div className="section-subheading">Proud of Our Students</div>
          <h2 className="section-heading">Our <span className="gradient-text">Top Scorers</span></h2>
          <p className="text-navy-400 max-w-xl mx-auto text-sm mt-3">
            These students worked hard and scored outstanding marks in CBSE Board Exams.
          </p>
        </motion.div>

        {/* Podium — 2nd | 1st | 3rd */}
        <div className="flex items-end justify-center gap-4 mb-8 max-w-xl mx-auto">
          {/* 2nd */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="flex-1 rounded-2xl p-4 sm:p-5 text-center pb-6 sm:pb-10 relative overflow-hidden"
            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}
          >
            <div className="text-2xl mb-2">🥈</div>
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center mx-auto mb-2 font-bold text-gold-400"
              style={{ background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.2)' }}>
              {toppers[1].name.charAt(0)}
            </div>
            <div className="font-bold text-white text-xs sm:text-sm leading-tight mb-1">{toppers[1].name}</div>
            <div className="font-display font-black text-xl sm:text-3xl gradient-text">{toppers[1].score}</div>
            <div className="text-navy-500 text-xs mt-0.5 truncate">{toppers[1].subject}</div>
          </motion.div>

          {/* 1st — tallest, gold glow */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="flex-1 rounded-2xl p-4 sm:p-5 text-center relative overflow-hidden"
            style={{
              background: 'linear-gradient(145deg, rgba(245,158,11,0.1) 0%, rgba(15,13,46,0.8) 100%)',
              border: '1.5px solid rgba(245,158,11,0.35)',
              boxShadow: '0 0 40px rgba(245,158,11,0.12), 0 20px 60px rgba(0,0,0,0.4)',
            }}
          >
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 text-base sm:text-xl">👑</div>
            <div className="text-2xl mb-2 mt-2">🥇</div>
            <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mx-auto mb-2 font-bold text-gold-400 text-base sm:text-xl"
              style={{ background: 'rgba(245,158,11,0.12)', border: '2px solid rgba(245,158,11,0.3)', boxShadow: '0 0 20px rgba(245,158,11,0.15)' }}>
              {toppers[0].name.charAt(0)}
            </div>
            <div className="font-bold text-white text-xs sm:text-base leading-tight mb-1">{toppers[0].name}</div>
            <div className="font-display font-black text-2xl sm:text-4xl gradient-text">{toppers[0].score}</div>
            <div className="text-navy-500 text-xs mt-0.5 truncate">{toppers[0].subject}</div>
            <div className="flex justify-center gap-0.5 mt-2">
              {[...Array(5)].map((_, j) => (
                <Star key={j} className="w-2.5 h-2.5 fill-gold-400 text-gold-400" />
              ))}
            </div>
          </motion.div>

          {/* 3rd */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.3, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="flex-1 rounded-2xl p-4 sm:p-5 text-center pb-6 sm:pb-10 relative overflow-hidden"
            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}
          >
            <div className="text-2xl mb-2">🥉</div>
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center mx-auto mb-2 font-bold text-gold-400"
              style={{ background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.2)' }}>
              {toppers[2].name.charAt(0)}
            </div>
            <div className="font-bold text-white text-xs sm:text-sm leading-tight mb-1">{toppers[2].name}</div>
            <div className="font-display font-black text-xl sm:text-3xl gradient-text">{toppers[2].score}</div>
            <div className="text-navy-500 text-xs mt-0.5 truncate">{toppers[2].subject}</div>
          </motion.div>
        </div>

        {/* Ranks 4–9 */}
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 sm:gap-3">
          {toppers.slice(3).map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 12 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.5 + i * 0.06 }}
              className="rounded-xl p-3 text-center transition-all duration-200 hover:-translate-y-0.5 cursor-default"
              style={{
                background: 'rgba(255,255,255,0.025)',
                border: '1px solid rgba(255,255,255,0.06)',
              }}
            >
              <div className="w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-1.5 text-xs font-bold text-gold-400"
                style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.15)' }}>
                {t.name.charAt(0)}
              </div>
              <div className="font-semibold text-white text-xs leading-tight mb-0.5 truncate px-1">{t.name}</div>
              <div className="font-display font-black text-base gradient-text">{t.score}</div>
              <div className="text-navy-500 text-xs truncate">{t.subject}</div>
            </motion.div>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 1 }}
          className="text-center text-navy-500 text-sm mt-8"
        >
          Join Smit Sir Commerce and write your name on this list next year!
        </motion.p>
      </div>
    </section>
  );
}
