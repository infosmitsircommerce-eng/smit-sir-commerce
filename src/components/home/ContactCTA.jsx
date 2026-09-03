import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';

export default function ContactCTA() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section ref={ref} className="relative overflow-hidden py-24 sm:py-32"
      style={{ background: 'linear-gradient(180deg, var(--ink-bg) 0%, #120D0A 100%)' }}>
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] rounded-full blur-3xl opacity-[0.16]"
          style={{ background: 'radial-gradient(ellipse, rgba(201,160,80,0.8) 0%, transparent 65%)' }} />
        <div className="absolute top-0 left-0 right-0 h-px"
          style={{ background: 'linear-gradient(90deg, transparent, rgba(201,160,80,0.45), transparent)' }} />
        <div className="absolute top-[3px] left-0 right-0 h-px"
          style={{ background: 'linear-gradient(90deg, transparent, rgba(201,160,80,0.18), transparent)' }} />
        <div className="absolute inset-0 opacity-50"
          style={{ backgroundImage: 'repeating-linear-gradient(180deg, transparent 0px, transparent 55px, rgba(201,160,80,0.05) 55px, rgba(201,160,80,0.05) 56px)' }} />
      </div>

      <div className="page-container relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 16, scale: 0.9 }}
          animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="inline-flex items-center gap-2 rounded-full px-5 py-2 text-sm font-semibold mb-8"
          style={{ background: 'rgba(217,172,92,0.08)', border: '1px solid rgba(217,172,92,0.3)', color: 'var(--gold-bright)' }}
        >
          <Sparkles className="w-3.5 h-3.5" />
          Free Demo Class — No Fees, No Pressure
          <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: '#8FBF6B' }} />
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.1, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          style={{
            fontFamily: 'var(--font-serif)', fontWeight: 700,
            fontSize: 'clamp(2.2rem, 5.5vw, 4rem)',
            letterSpacing: '-0.025em', lineHeight: 1.1,
            color: 'var(--ivory-on-ink)', marginBottom: '22px',
          }}
        >
          Ready to{' '}
          <em style={{
            fontFamily: 'var(--font-accent)', fontStyle: 'italic', fontWeight: 600, fontSize: '1.1em',
            background: 'linear-gradient(135deg, var(--gold-bright), #EDD9AE)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
          }}>score better</em>
          <br />in Commerce?
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.2, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="text-base sm:text-lg max-w-xl mx-auto mb-10 leading-relaxed"
          style={{ color: 'var(--muted-on-ink)' }}
        >
          See how Smit Sir teaches before you decide. One free class — no fees, no pressure.
          Ask questions, understand the teaching approach, and decide without pressure.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.3, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10"
        >
          <Link
            to="/book-demo"
            className="btn-gold flex items-center gap-2 text-base px-8 py-4 w-full sm:w-auto justify-center"
          >
            Book Free Demo Class
            <ArrowRight className="w-5 h-5" />
          </Link>
          <Link
            to="/contact"
            className="flex items-center gap-2 text-base font-semibold px-8 py-4 rounded-xl w-full sm:w-auto justify-center transition-all duration-200 hover:-translate-y-0.5"
            style={{
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.18)',
              color: 'var(--ivory-on-ink)',
            }}
          >
            Send an enquiry
            <ArrowRight className="w-5 h-5" />
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.5 }}
          className="flex flex-wrap justify-center gap-x-8 gap-y-2 text-xs"
          style={{ color: 'var(--muted-on-ink)' }}
        >
          {['Class 11 & 12', 'CBSE Focused', 'Online + Offline', 'Mehsana, Gujarat', 'Contact form available'].map((t) => (
            <div key={t} className="flex items-center gap-1.5">
              <span className="w-1 h-1 rounded-full" style={{ background: 'rgba(201,160,80,0.6)' }} />
              {t}
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
