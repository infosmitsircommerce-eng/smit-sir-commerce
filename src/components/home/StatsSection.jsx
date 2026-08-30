import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

const stats = [
  { value: '26', label: 'Free PDFs', desc: 'Published and working' },
  { value: '13', label: 'Microeconomics Chapters', desc: 'Class 11 CBSE' },
  { value: '12', label: 'Business Studies Chapters', desc: 'Class 12 CBSE' },
  { value: '2', label: 'Classes Covered', desc: 'Class 11 and 12' },
  { value: '4', label: 'Core Subjects', desc: 'Eco · BST · Acc · Entrep.' },
  { value: '2', label: 'Learning Modes', desc: 'Online and offline' },
];
const trustPoints = ['CBSE board focused', 'Class 11 and 12', 'Free published PDF notes', 'Online and offline batches', 'Mehsana, Gujarat', 'Free demo class'];

export default function StatsSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '100px' });
  return (
    <section ref={ref} className="section-padding relative overflow-hidden" style={{ background: 'linear-gradient(180deg, var(--ink-bg) 0%, var(--ink-bg-2) 50%, var(--ink-bg) 100%)' }}>
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[400px] rounded-full opacity-[0.1]" style={{ background: 'radial-gradient(ellipse, rgba(201,160,80,0.6) 0%, transparent 65%)' }} />
        <div className="absolute top-0 left-0 right-0 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(201,160,80,0.45), transparent)' }} />
        <div className="absolute bottom-0 left-0 right-0 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(201,160,80,0.45), transparent)' }} />
      </div>
      <div className="page-container relative z-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.45 }} className="text-center mb-16">
          <span className="eyebrow eyebrow-on-ink mb-6">What Is Available Now</span>
          <h2 className="headline headline-on-ink mt-6">Real resources, <em>clearly counted.</em></h2>
        </motion.div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-px rounded-2xl overflow-hidden" style={{ background: 'rgba(201,160,80,0.16)', border: '1px solid rgba(201,160,80,0.16)' }}>
          {stats.map((stat, index) => (
            <motion.div key={stat.label} initial={{ opacity: 0, y: 24 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: index * 0.06, duration: 0.4 }} className="p-6 sm:p-7 text-center" style={{ background: 'var(--ink-bg)' }}>
              <div style={{ fontFamily: 'var(--font-serif)', fontWeight: 700, fontSize: 'clamp(2rem, 4vw, 2.8rem)', lineHeight: 1, color: 'var(--gold-bright)', marginBottom: '10px' }}>{stat.value}</div>
              <div className="font-semibold text-xs sm:text-sm leading-tight mb-1" style={{ color: 'var(--ivory-on-ink)' }}>{stat.label}</div>
              <div className="text-xs leading-tight hidden sm:block" style={{ color: 'var(--muted-on-ink)' }}>{stat.desc}</div>
            </motion.div>
          ))}
        </div>
        <motion.div initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ delay: 0.55 }} className="mt-12 flex flex-wrap justify-center items-center gap-x-8 gap-y-2 text-xs" style={{ color: 'var(--muted-on-ink)' }}>
          {trustPoints.map((point) => <div key={point} className="flex items-center gap-1.5"><span className="w-1 h-1 rounded-full" style={{ background: 'rgba(201,160,80,0.6)' }} /><span>{point}</span></div>)}
        </motion.div>
      </div>
    </section>
  );
}
