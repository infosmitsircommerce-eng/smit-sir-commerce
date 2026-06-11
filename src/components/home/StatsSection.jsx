import { motion, useInView } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';

const stats = [
  { end: 200, suffix: '+', label: 'Students Taught',    desc: 'Class 11 & 12 Commerce'   },
  { end: 91,  suffix: '%', label: 'Avg. Board Score',   desc: 'CBSE 2024 batch results'  },
  { end: 120, suffix: '+', label: 'Practice Questions', desc: 'MCQ, HOTS & board level'  },
  { end: 3,   suffix: '+', label: 'Years Teaching',     desc: 'Commerce specialist'      },
  { end: 4,   suffix: '',  label: 'Subjects Covered',   desc: 'Eco · BST · Acc · Entrep.'},
  { end: 5,   suffix: '★', label: 'Student Rating',     desc: 'Google & personal reviews'},
];

const index = ['01', '02', '03', '04', '05', '06'];

function CountUp({ end, suffix, inView, duration = 1800 }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!inView) return;
    let startTime = null;
    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * end));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [inView, end, duration]);
  return <>{count}{suffix}</>;
}

export default function StatsSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '100px' });

  return (
    <section ref={ref} className="section-padding relative overflow-hidden"
      style={{ background: 'linear-gradient(180deg, var(--ink-bg) 0%, var(--ink-bg-2) 50%, var(--ink-bg) 100%)' }}>

      {/* Gold hairlines top & bottom — ledger frame */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[400px] rounded-full opacity-[0.1]"
          style={{ background: 'radial-gradient(ellipse, rgba(201,160,80,0.6) 0%, transparent 65%)' }} />
        <div className="absolute top-0 left-0 right-0 h-px"
          style={{ background: 'linear-gradient(90deg, transparent, rgba(201,160,80,0.45), transparent)' }} />
        <div className="absolute top-[3px] left-0 right-0 h-px"
          style={{ background: 'linear-gradient(90deg, transparent, rgba(201,160,80,0.18), transparent)' }} />
        <div className="absolute bottom-0 left-0 right-0 h-px"
          style={{ background: 'linear-gradient(90deg, transparent, rgba(201,160,80,0.45), transparent)' }} />
        <div className="absolute bottom-[3px] left-0 right-0 h-px"
          style={{ background: 'linear-gradient(90deg, transparent, rgba(201,160,80,0.18), transparent)' }} />
      </div>

      <div className="page-container relative z-10">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-16"
        >
          <span className="eyebrow eyebrow-on-ink mb-6">By the Numbers</span>
          <h2 className="headline headline-on-ink mt-6">
            Everything you need to <em>score better.</em>
          </h2>
        </motion.div>

        {/* Stats ledger grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-px rounded-2xl overflow-hidden"
          style={{ background: 'rgba(201,160,80,0.16)', border: '1px solid rgba(201,160,80,0.16)' }}>
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 28 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.08, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="group relative p-6 sm:p-7 text-center cursor-default"
              style={{ background: 'var(--ink-bg)' }}
            >
              {/* Hover gold wash */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{ background: 'radial-gradient(ellipse at 50% 100%, rgba(201,160,80,0.09) 0%, transparent 70%)' }} />

              {/* Index */}
              <div style={{
                fontFamily: 'var(--font-sans)', fontWeight: 700,
                fontSize: '11px', color: 'rgba(201,160,80,0.55)',
                letterSpacing: '0.18em', marginBottom: '12px',
              }}>{index[i]}</div>

              {/* Big serif numeral */}
              <div style={{
                fontFamily: 'var(--font-serif)', fontWeight: 700,
                fontSize: 'clamp(2.2rem, 4.5vw, 3rem)', lineHeight: 1,
                color: 'var(--gold-bright)', marginBottom: '10px',
              }}>
                {inView
                  ? <CountUp end={stat.end} suffix={stat.suffix} inView={inView} duration={1400 + i * 120} />
                  : `0${stat.suffix}`}
              </div>

              <div className="font-semibold text-xs sm:text-sm leading-tight mb-1" style={{ color: 'var(--ivory-on-ink)' }}>{stat.label}</div>
              <div className="text-xs leading-tight hidden sm:block" style={{ color: 'var(--muted-on-ink)' }}>{stat.desc}</div>
            </motion.div>
          ))}
        </div>

        {/* Bottom trust bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.85 }}
          className="mt-12 flex flex-wrap justify-center items-center gap-x-8 gap-y-2 text-xs"
          style={{ color: 'var(--muted-on-ink)' }}
        >
          {['CBSE Board Focused', 'Class 11 & 12', 'Online & Offline Batches', 'Mehsana, Gujarat', '200+ Students Taught', '9 Board Toppers in 2024'].map((t) => (
            <div key={t} className="flex items-center gap-1.5">
              <span className="w-1 h-1 rounded-full" style={{ background: 'rgba(201,160,80,0.6)' }} />
              <span>{t}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
