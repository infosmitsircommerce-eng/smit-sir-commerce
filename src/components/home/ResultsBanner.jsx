import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

const RESULTS = [
  { name: 'Heer Patel',     score: '95', subject: 'Economics',        medal: '🥇' },
  { name: 'Niv Patel',      score: '94', subject: 'Accountancy',      medal: '🥈' },
  { name: 'Manan Dunti',    score: '93', subject: 'Accountancy',      medal: '🥉' },
  { name: 'Mann Prajapati', score: '92', subject: 'Economics',        medal: '⭐' },
  { name: 'Laksh Rajput',   score: '91', subject: 'Accountancy',      medal: '⭐' },
  { name: 'Vishal Rajput',  score: '90', subject: 'Business Studies', medal: '⭐' },
  { name: 'Kavya Patel',    score: '89', subject: 'Online Batch',     medal: '⭐' },
  { name: 'Arwa Rupawala',  score: '88', subject: 'All Subjects',     medal: '⭐' },
  { name: 'Hussaina',       score: '86', subject: 'Economics',        medal: '⭐' },
];

const AGG = [
  { value: '91.2%', label: 'Class Average',   color: '#34d399', sub: 'CBSE Board 2024' },
  { value: '95%',   label: 'Highest Score',   color: '#D4AF37', sub: 'Heer Patel · Economics' },
  { value: '9/9',   label: 'Students Passed', color: '#60a5fa', sub: '100% pass rate' },
  { value: '6',     label: 'Scored 90%+',     color: '#f97316', sub: 'Out of 9 students' },
];

export default function ResultsBanner() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '80px' });

  return (
    <section ref={ref} className="section-padding relative overflow-hidden"
      style={{ background: 'linear-gradient(160deg, #0a0f1e 0%, #0d1528 100%)' }}>

      {/* Top glow line */}
      <div className="absolute top-0 left-0 right-0 h-px"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(52,211,153,0.5), transparent)' }} />

      {/* Background radial glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] rounded-full opacity-[0.12] blur-3xl"
          style={{ background: 'radial-gradient(ellipse, #34d399 0%, transparent 70%)' }} />
      </div>

      <div className="page-container relative z-10">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-black mb-4"
            style={{ background: 'rgba(52,211,153,0.12)', border: '1px solid rgba(52,211,153,0.3)', color: '#34d399' }}>
            🏆 CBSE Board Exam Results — 2024
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white mb-2">
            Results That <span style={{ color: '#34d399' }}>Speak for Themselves</span>
          </h2>
          <p className="text-sm max-w-lg mx-auto" style={{ color: '#64748b' }}>
            Every student who prepared with Smit Sir Commerce scored above 85% in the CBSE 2024 Board Exams.
          </p>
        </motion.div>

        {/* Aggregate stat boxes */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-10">
          {AGG.map((a, i) => (
            <motion.div
              key={a.label}
              initial={{ opacity: 0, y: 20, scale: 0.92 }}
              animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
              transition={{ delay: i * 0.08, duration: 0.5 }}
              className="rounded-2xl p-5 text-center"
              style={{
                background: `${a.color}10`,
                border: `1px solid ${a.color}30`,
                boxShadow: `0 8px 24px ${a.color}10`,
              }}
            >
              <div className="text-2xl sm:text-3xl font-black mb-1" style={{ color: a.color }}>{a.value}</div>
              <div className="text-xs font-bold text-white mb-0.5">{a.label}</div>
              <div className="text-[10px]" style={{ color: '#94a3b8' }}>{a.sub}</div>
            </motion.div>
          ))}
        </div>

        {/* Student result chips — horizontal scroll on mobile */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.35 }}
          className="mb-6"
        >
          <p className="text-xs font-semibold mb-3 text-center" style={{ color: '#64748b' }}>
            INDIVIDUAL RESULTS
          </p>
          <div className="flex flex-wrap gap-2 justify-center">
            {RESULTS.map((r, i) => (
              <motion.div
                key={r.name}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={inView ? { opacity: 1, scale: 1 } : {}}
                transition={{ delay: 0.4 + i * 0.06 }}
                className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold"
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  border: `1px solid ${parseInt(r.score) >= 93 ? 'rgba(212,175,55,0.35)' : parseInt(r.score) >= 90 ? 'rgba(52,211,153,0.25)' : 'rgba(255,255,255,0.1)'}`,
                }}
              >
                <span>{r.medal}</span>
                <span className="text-white">{r.name}</span>
                <span className="font-black" style={{ color: parseInt(r.score) >= 93 ? '#D4AF37' : parseInt(r.score) >= 90 ? '#34d399' : '#60a5fa' }}>
                  {r.score}%
                </span>
                <span className="text-xs hidden sm:inline" style={{ color: '#64748b' }}>· {r.subject}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Bottom callout */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.9 }}
          className="rounded-2xl p-5 text-center"
          style={{ background: 'rgba(212,175,55,0.06)', border: '1px solid rgba(212,175,55,0.18)' }}
        >
          <p className="text-sm font-semibold" style={{ color: 'rgba(255,255,255,0.85)' }}>
            🎯 <span style={{ color: '#D4AF37', fontWeight: 900 }}>Your name could be here next year.</span>{' '}
            Join Smit Sir Commerce and get the same focused preparation that delivered these results.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
