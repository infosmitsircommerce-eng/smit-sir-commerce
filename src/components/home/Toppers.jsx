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

const ordinal = ['1st', '2nd', '3rd'];

function PodiumCard({ topper, place, delay, inView, featured = false }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className={`flex-1 rounded-2xl p-4 sm:p-5 text-center relative overflow-hidden ${featured ? '' : 'pb-6 sm:pb-10'}`}
      style={featured ? {
        background: 'linear-gradient(160deg, rgba(217,172,92,0.12) 0%, var(--ink-bg) 70%)',
        border: '1px solid rgba(217,172,92,0.5)',
        boxShadow: '0 0 44px rgba(201,160,80,0.14), 0 20px 60px rgba(0,0,0,0.4)',
      } : {
        background: 'rgba(243,236,221,0.035)',
        border: '1px solid rgba(243,236,221,0.1)',
      }}
    >
      {featured && (
        <div className="absolute top-0 inset-x-0 h-px"
          style={{ background: 'linear-gradient(90deg, transparent, rgba(217,172,92,0.8), transparent)' }} />
      )}
      {/* Ordinal in Cormorant italic */}
      <div style={{
        fontFamily: 'var(--font-accent)', fontStyle: 'italic', fontWeight: 600,
        fontSize: featured ? '1.3rem' : '1.05rem',
        color: 'var(--gold-bright)', marginBottom: '10px', marginTop: featured ? '6px' : 0,
      }}>{ordinal[place]}</div>

      <div className={`${featured ? 'w-14 h-14 sm:w-16 sm:h-16 text-lg sm:text-xl' : 'w-10 h-10 sm:w-12 sm:h-12'} rounded-full flex items-center justify-center mx-auto mb-3`}
        style={{
          fontFamily: 'var(--font-serif)', fontWeight: 700, color: 'var(--gold-bright)',
          background: 'rgba(217,172,92,0.1)',
          border: featured ? '2px solid rgba(217,172,92,0.4)' : '1px solid rgba(217,172,92,0.25)',
          boxShadow: featured ? '0 0 20px rgba(217,172,92,0.15)' : 'none',
        }}>
        {topper.name.charAt(0)}
      </div>
      <div className={`${featured ? 'text-xs sm:text-base' : 'text-xs sm:text-sm'} font-semibold leading-tight mb-1`} style={{ color: 'var(--ivory-on-ink)' }}>{topper.name}</div>
      <div style={{
        fontFamily: 'var(--font-serif)', fontWeight: 700, lineHeight: 1.1,
        fontSize: featured ? 'clamp(1.8rem, 4vw, 2.6rem)' : 'clamp(1.3rem, 3vw, 1.9rem)',
        color: 'var(--gold-bright)',
      }}>{topper.score}</div>
      <div className="text-xs mt-1 truncate" style={{ color: 'var(--muted-on-ink)' }}>{topper.subject}</div>
      {featured && (
        <div className="flex justify-center gap-0.5 mt-2.5">
          {[...Array(5)].map((_, j) => (
            <Star key={j} className="w-2.5 h-2.5" style={{ fill: 'var(--gold-bright)', color: 'var(--gold-bright)' }} />
          ))}
        </div>
      )}
    </motion.div>
  );
}

export default function Toppers() {
  const ref    = useRef(null);
  const inView = useInView(ref, { once: true, margin: '100px' });

  return (
    <section ref={ref} className="section-padding relative overflow-hidden"
      style={{ background: 'linear-gradient(180deg, var(--ink-bg) 0%, var(--ink-bg-2) 100%)' }}>

      {/* Double gold rule, top */}
      <div className="absolute top-0 left-0 right-0 h-px"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(201,160,80,0.45), transparent)' }} />
      <div className="absolute top-[3px] left-0 right-0 h-px"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(201,160,80,0.18), transparent)' }} />

      {/* Ambient gold glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] rounded-full opacity-[0.1] blur-3xl"
          style={{ background: 'radial-gradient(ellipse, rgba(201,160,80,0.8) 0%, transparent 70%)' }} />
      </div>

      <div className="page-container relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-12"
        >
          <span className="eyebrow eyebrow-on-ink">The Honour Roll · CBSE 2024</span>
          <h2 className="headline headline-on-ink mt-6">Our <em>top scorers.</em></h2>
          <p className="max-w-xl mx-auto text-sm mt-4" style={{ color: 'var(--muted-on-ink)' }}>
            These students worked hard and scored outstanding marks in CBSE Board Exams.
          </p>
        </motion.div>

        {/* Podium — 2nd | 1st | 3rd */}
        <div className="flex items-end justify-center gap-4 mb-8 max-w-xl mx-auto">
          <PodiumCard topper={toppers[1]} place={1} delay={0.2} inView={inView} />
          <PodiumCard topper={toppers[0]} place={0} delay={0.1} inView={inView} featured />
          <PodiumCard topper={toppers[2]} place={2} delay={0.3} inView={inView} />
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
                background: 'rgba(243,236,221,0.03)',
                border: '1px solid rgba(243,236,221,0.08)',
              }}
            >
              <div className="w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-1.5 text-xs"
                style={{
                  fontFamily: 'var(--font-serif)', fontWeight: 700, color: 'var(--gold-bright)',
                  background: 'rgba(217,172,92,0.08)', border: '1px solid rgba(217,172,92,0.18)',
                }}>
                {t.name.charAt(0)}
              </div>
              <div className="font-semibold text-xs leading-tight mb-0.5 truncate px-1" style={{ color: 'var(--ivory-on-ink)' }}>{t.name}</div>
              <div style={{ fontFamily: 'var(--font-serif)', fontWeight: 700, fontSize: '1rem', color: 'var(--gold-bright)' }}>{t.score}</div>
              <div className="text-xs truncate" style={{ color: 'var(--muted-on-ink)' }}>{t.subject}</div>
            </motion.div>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 1 }}
          className="text-center text-sm mt-9"
          style={{ fontFamily: 'var(--font-accent)', fontStyle: 'italic', fontSize: '1.05rem', color: 'var(--gold-soft)' }}
        >
          Join Smit Sir Commerce and write your name on this list next year.
        </motion.p>
      </div>
    </section>
  );
}
