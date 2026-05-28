import { motion, useInView } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';

const stats = [
  { end: 200,  suffix: '+', label: 'Students Taught',      desc: 'Class 11 & 12 Commerce',    icon: '🎓' },
  { end: 91,   suffix: '%', label: 'Avg. Board Score',     desc: 'CBSE 2024 batch results',    icon: '📊' },
  { end: 120,  suffix: '+', label: 'Practice Questions',   desc: 'MCQ, HOTS & board level',   icon: '✍️' },
  { end: 3,    suffix: '+', label: 'Years Teaching',       desc: 'Commerce specialist',        icon: '📅' },
  { end: 4,    suffix: '',  label: 'Subjects Covered',     desc: 'Eco · BST · Acc · Entrep.', icon: '📚' },
  { end: 5,    suffix: '★', label: 'Student Rating',       desc: 'Google & personal reviews',  icon: '⭐' },
];

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
      style={{ background: 'linear-gradient(180deg, #030112 0%, #060321 50%, #030112 100%)' }}>

      {/* Atmospheric glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[400px] rounded-full opacity-[0.15]"
          style={{ background: 'radial-gradient(ellipse, rgba(245,158,11,0.6) 0%, transparent 65%)' }} />
        <div className="absolute top-0 left-0 right-0 h-px"
          style={{ background: 'linear-gradient(90deg, transparent, rgba(245,158,11,0.4), transparent)' }} />
        <div className="absolute bottom-0 left-0 right-0 h-px"
          style={{ background: 'linear-gradient(90deg, transparent, rgba(99,102,241,0.3), transparent)' }} />
      </div>

      <div className="page-container relative z-10">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-16"
        >
          <div className="section-subheading">By The Numbers</div>
          <h2 className="section-heading">
            Everything You Need to <span className="gradient-text">Score Better</span>
          </h2>
        </motion.div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 28, scale: 0.92 }}
              animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
              transition={{ delay: i * 0.08, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="group relative rounded-2xl p-5 sm:p-6 text-center overflow-hidden cursor-default"
              style={{
                background: 'rgba(255,255,255,0.025)',
                border: '1px solid rgba(255,255,255,0.07)',
              }}
            >
              {/* Card hover gold glow */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl"
                style={{ background: 'radial-gradient(ellipse at 50% 100%, rgba(245,158,11,0.1) 0%, transparent 70%)' }} />
              {/* Top edge glow on hover */}
              <div className="absolute top-0 inset-x-0 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{ background: 'linear-gradient(90deg, transparent, rgba(245,158,11,0.6), transparent)' }} />

              {/* Icon */}
              <div className="text-2xl sm:text-3xl mb-3 group-hover:scale-110 transition-transform duration-300">{stat.icon}</div>

              {/* Big number */}
              <div className="font-display font-black leading-none mb-2 gradient-text"
                style={{ fontSize: 'clamp(2.5rem, 5vw, 3.5rem)' }}>
                {inView
                  ? <CountUp end={stat.end} suffix={stat.suffix} inView={inView} duration={1400 + i * 120} />
                  : `0${stat.suffix}`}
              </div>

              <div className="text-white font-semibold text-xs sm:text-sm leading-tight mb-1">{stat.label}</div>
              <div className="text-navy-500 text-xs leading-tight hidden sm:block">{stat.desc}</div>
            </motion.div>
          ))}
        </div>

        {/* Bottom trust bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.85 }}
          className="mt-12 flex flex-wrap justify-center items-center gap-x-8 gap-y-2 text-navy-500 text-xs"
        >
          {['CBSE Board Focused', 'Class 11 & 12', 'Online & Offline Batches', 'Mehsana, Gujarat', '200+ Students Taught', '9 Board Toppers in 2024'].map((t) => (
            <div key={t} className="flex items-center gap-1.5">
              <span className="w-1 h-1 bg-gold-500/60 rounded-full" />
              <span>{t}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
