import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, FileQuestion, Wrench } from 'lucide-react';
import { freeNoteCount, premiumResourceCount, quizChapterCount, quizQuestionCount, toolCount, totalNoteCount } from '../../data/platformStats';

const stats = [
  { value: totalNoteCount.toLocaleString('en-IN'), label: 'Notes & study guides', desc: `${freeNoteCount} free + ${premiumResourceCount} Premium`, to: '/study-material', icon: BookOpen },
  { value: quizQuestionCount.toLocaleString('en-IN'), label: 'Quiz questions', desc: `${quizChapterCount} verified chapter packs`, to: '/quizzes', icon: FileQuestion },
  { value: toolCount.toLocaleString('en-IN'), label: 'Commerce tools', desc: 'Calculators and study utilities', to: '/tools', icon: Wrench },
];
const trustPoints = ['CBSE + GSEB', 'Class 11 and 12', 'Free and Premium clearly separated', 'Counts generated from the live catalog'];

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
        <div className="grid sm:grid-cols-3 gap-px rounded-2xl overflow-hidden" style={{ background: 'rgba(201,160,80,0.16)', border: '1px solid rgba(201,160,80,0.16)' }}>
          {stats.map((stat, index) => (
            <motion.div key={stat.label} initial={{ opacity: 0, y: 24 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: index * 0.06, duration: 0.4 }} style={{ background: 'var(--ink-bg)' }}>
              <Link to={stat.to} className="flex sm:block items-center gap-5 p-6 sm:p-8 sm:text-center h-full" aria-label={`Explore ${stat.value} ${stat.label}`}>
                <span className="grid place-items-center w-12 h-12 sm:mx-auto sm:mb-5 rounded-2xl flex-shrink-0" style={{ color: 'var(--gold-bright)', background: 'rgba(201,160,80,.12)', border: '1px solid rgba(201,160,80,.22)' }}><stat.icon className="w-5 h-5" aria-hidden="true" /></span>
                <span>
                  <span className="block" style={{ fontFamily: 'var(--font-serif)', fontWeight: 700, fontSize: 'clamp(2.25rem, 5vw, 3.5rem)', lineHeight: 1, color: 'var(--gold-bright)', marginBottom: '10px' }}>{stat.value}</span>
                  <span className="block font-bold text-sm sm:text-base leading-tight mb-2" style={{ color: 'var(--ivory-on-ink)' }}>{stat.label}</span>
                  <span className="block text-xs leading-5" style={{ color: 'var(--muted-on-ink)' }}>{stat.desc}</span>
                </span>
              </Link>
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
