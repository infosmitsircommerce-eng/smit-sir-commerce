import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { Phone, ArrowRight, Sparkles } from 'lucide-react';

const WA_LINK = 'https://wa.me/916353709585?text=Hello%20Smit%20Sir%2C%20I%20want%20to%20book%20a%20free%20demo%20class%20for%20Class%2011%2F12%20Commerce.';

export default function ContactCTA() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section ref={ref} className="relative overflow-hidden py-24 sm:py-32"
      style={{ background: 'linear-gradient(180deg, var(--ink-bg) 0%, #120D0A 100%)' }}>

      {/* Dramatic background layers */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Central gold glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] rounded-full blur-3xl opacity-[0.16]"
          style={{ background: 'radial-gradient(ellipse, rgba(201,160,80,0.8) 0%, transparent 65%)' }} />
        {/* Double gold rule, top */}
        <div className="absolute top-0 left-0 right-0 h-px"
          style={{ background: 'linear-gradient(90deg, transparent, rgba(201,160,80,0.45), transparent)' }} />
        <div className="absolute top-[3px] left-0 right-0 h-px"
          style={{ background: 'linear-gradient(90deg, transparent, rgba(201,160,80,0.18), transparent)' }} />
        {/* Faint ruled lines */}
        <div className="absolute inset-0 opacity-50"
          style={{ backgroundImage: 'repeating-linear-gradient(180deg, transparent 0px, transparent 55px, rgba(201,160,80,0.05) 55px, rgba(201,160,80,0.05) 56px)' }} />
      </div>

      <div className="page-container relative z-10 text-center">
        {/* Top badge */}
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

        {/* Main heading */}
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
          Join 200+ students already learning Commerce the right way.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.3, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10"
        >
          <Link
            to="/contact"
            className="btn-gold flex items-center gap-2 text-base px-8 py-4 w-full sm:w-auto justify-center"
          >
            Book Free Demo Class
            <ArrowRight className="w-5 h-5" />
          </Link>

          <a
            href={WA_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-base font-semibold px-8 py-4 rounded-xl w-full sm:w-auto justify-center transition-all duration-200 hover:-translate-y-0.5"
            style={{
              background: 'rgba(143,191,107,0.08)',
              border: '1px solid rgba(143,191,107,0.3)',
              color: '#8FBF6B',
            }}
          >
            <svg viewBox="0 0 32 32" className="w-5 h-5" fill="currentColor">
              <path d="M16.002 2.667C8.637 2.667 2.667 8.637 2.667 16c0 2.363.629 4.609 1.73 6.557L2.667 29.333l6.979-1.698A13.264 13.264 0 0 0 16.002 29.333C23.363 29.333 29.333 23.363 29.333 16S23.363 2.667 16.002 2.667zm0 2.4c5.93 0 10.934 4.937 10.934 10.933 0 5.998-5.004 10.934-10.934 10.934a10.9 10.9 0 0 1-5.55-1.516l-.398-.24-4.14 1.006 1.04-3.994-.265-.414A10.897 10.897 0 0 1 5.069 16c0-5.996 5.004-10.933 10.933-10.933zm-3.02 5.6c-.202 0-.53.075-.809.376-.278.3-1.062 1.038-1.062 2.531 0 1.493 1.087 2.937 1.239 3.139.152.201 2.119 3.39 5.22 4.618 2.578.99 3.1.793 3.66.743.56-.049 1.808-.739 2.063-1.454.254-.715.254-1.328.178-1.454-.076-.126-.278-.202-.58-.352-.303-.151-1.793-.884-2.07-.984-.278-.1-.48-.15-.682.151-.202.3-.78.984-.957 1.186-.176.202-.352.227-.654.076-.302-.152-1.275-.47-2.43-1.499-.898-.8-1.504-1.788-1.68-2.09-.177-.3-.019-.463.133-.612.136-.134.303-.352.454-.528.15-.176.2-.3.301-.503.1-.2.05-.376-.025-.527-.076-.15-.672-1.649-.93-2.254-.238-.567-.486-.493-.673-.502a12.1 12.1 0 0 0-.575-.013z"/>
            </svg>
            WhatsApp Smit Sir
          </a>

          <a
            href="tel:+916353709585"
            className="flex items-center gap-2 text-base font-semibold transition-colors px-4 py-4"
            style={{ color: 'var(--muted-on-ink)' }}
            onMouseEnter={e => { e.currentTarget.style.color = 'var(--ivory-on-ink)'; }}
            onMouseLeave={e => { e.currentTarget.style.color = 'var(--muted-on-ink)'; }}
          >
            <Phone className="w-4 h-4" style={{ color: 'var(--gold-bright)' }} />
            +91 63537 09585
          </a>
        </motion.div>

        {/* Trust row */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.5 }}
          className="flex flex-wrap justify-center gap-x-8 gap-y-2 text-xs"
          style={{ color: 'var(--muted-on-ink)' }}
        >
          {['Class 11 & 12', 'CBSE Focused', 'Online + Offline', 'Mehsana, Gujarat', 'Mon–Sat 9am–8pm'].map((t) => (
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
