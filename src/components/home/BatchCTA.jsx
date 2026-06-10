import { Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { ArrowRight, Users, Wifi, MapPin, Globe, CheckCircle } from 'lucide-react';

const WA_LINK = 'https://wa.me/916353709585?text=Hello%20Smit%20Sir%2C%20I%20want%20to%20book%20a%20free%20demo%20class%20for%20Class%2011%2F12%20Commerce.';

export default function BatchCTA() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '100px' });

  return (
    <section ref={ref} className="section-padding relative overflow-hidden"
      style={{ background: 'var(--bg-cream)' }}>

      <div className="page-container relative z-10">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-14"
        >
          <span className="eyebrow">Join a Batch</span>
          <h2 className="headline mt-6">
            Online &amp; offline <em>batches available.</em>
          </h2>
          <p className="max-w-xl mx-auto text-sm mt-4" style={{ color: 'var(--muted)' }}>
            Choose what works for you — join our classroom in Mehsana or study from anywhere online.
          </p>
        </motion.div>

        {/* Cards */}
        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">

          {/* ── Offline Batch — flagship ink card ── */}
          <motion.div
            initial={{ opacity: 0, x: -32 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.12, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="group relative rounded-2xl overflow-hidden"
            style={{
              background: 'linear-gradient(150deg, var(--ink-bg-2) 0%, var(--ink-bg) 65%)',
              border: '1px solid rgba(201,160,80,0.35)',
              boxShadow: '0 20px 56px rgba(30,24,18,0.16)',
              transition: 'box-shadow 0.4s ease, border-color 0.4s ease',
            }}
            whileHover={{ y: -6 }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(217,172,92,0.6)'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(201,160,80,0.35)'; }}
          >
            {/* Gold hairline top */}
            <div className="absolute top-0 inset-x-0 h-px"
              style={{ background: 'linear-gradient(90deg, transparent, rgba(217,172,92,0.7), transparent)' }} />
            <div className="absolute top-0 left-0 w-64 h-64 rounded-full pointer-events-none opacity-60"
              style={{ background: 'radial-gradient(circle, rgba(201,160,80,0.12) 0%, transparent 70%)', transform: 'translate(-40%, -40%)' }} />

            <div className="relative p-8">
              <div className="flex items-start justify-between mb-7">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center"
                  style={{ background: 'rgba(217,172,92,0.1)', border: '1px solid rgba(217,172,92,0.3)' }}>
                  <Users className="w-7 h-7" style={{ color: 'var(--gold-bright)' }} strokeWidth={1.6} />
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold"
                  style={{ background: 'rgba(217,172,92,0.08)', border: '1px solid rgba(217,172,92,0.25)', color: 'var(--gold-bright)' }}>
                  <MapPin className="w-3 h-3" />
                  Mehsana, Gujarat
                </div>
              </div>

              <h3 style={{ fontFamily: 'var(--font-serif)', fontWeight: 700, fontSize: '1.5rem', color: 'var(--ivory-on-ink)', marginBottom: '4px' }}>Offline Batch</h3>
              <p className="text-sm mb-7" style={{ color: 'var(--muted-on-ink)' }}>In-person classroom · Limited seats</p>

              <ul className="space-y-3.5 mb-8">
                {[
                  'Face-to-face learning with Smit Sir',
                  'Personal attention for every student',
                  'Regular in-class tests & quizzes',
                  'Interactive doubt-solving sessions',
                  'Study notes & materials provided',
                ].map((f) => (
                  <li key={f} className="flex items-center gap-3 text-sm" style={{ color: 'rgba(243,236,221,0.8)' }}>
                    <CheckCircle className="w-4 h-4 flex-shrink-0" style={{ color: 'var(--gold-bright)' }} />
                    {f}
                  </li>
                ))}
              </ul>

              <Link to="/offline-batch" className="btn-gold flex items-center justify-center gap-2 w-full py-3.5">
                Enquire for Offline Batch <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </motion.div>

          {/* ── Online Batch — white card ── */}
          <motion.div
            initial={{ opacity: 0, x: 32 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.22, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="group relative rounded-2xl overflow-hidden"
            style={{
              background: 'var(--bg-white)',
              border: '1px solid var(--border)',
              boxShadow: 'var(--shadow-sm)',
              transition: 'box-shadow 0.4s ease, border-color 0.4s ease',
            }}
            whileHover={{ y: -6 }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = 'rgba(184,135,47,0.4)';
              e.currentTarget.style.boxShadow = 'var(--shadow-md)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = 'var(--border)';
              e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
            }}
          >
            <div className="relative p-8">
              <div className="flex items-start justify-between mb-7">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center"
                  style={{ background: 'var(--gold-bg)', border: '1px solid rgba(184,135,47,0.2)' }}>
                  <Wifi className="w-7 h-7" style={{ color: 'var(--gold)' }} strokeWidth={1.6} />
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold"
                  style={{ background: 'var(--gold-bg)', border: '1px solid rgba(184,135,47,0.22)', color: 'var(--gold)' }}>
                  <Globe className="w-3 h-3" />
                  Pan India
                </div>
              </div>

              <h3 style={{ fontFamily: 'var(--font-serif)', fontWeight: 700, fontSize: '1.5rem', color: 'var(--ink)', marginBottom: '4px' }}>Online Batch</h3>
              <p className="text-sm mb-7" style={{ color: 'var(--muted)' }}>Study from anywhere · Flexible schedule</p>

              <ul className="space-y-3.5 mb-8">
                {[
                  'Live + recorded lectures on demand',
                  'Digital notes & PDF materials',
                  'Flexible learning hours',
                  'Online test series & quizzes',
                  'WhatsApp doubt support included',
                ].map((f) => (
                  <li key={f} className="flex items-center gap-3 text-sm" style={{ color: 'var(--charcoal)' }}>
                    <CheckCircle className="w-4 h-4 flex-shrink-0" style={{ color: 'var(--gold)' }} />
                    {f}
                  </li>
                ))}
              </ul>

              <Link to="/online-batch" className="btn-primary flex items-center justify-center gap-2 w-full py-3.5">
                Enquire for Online Batch <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </motion.div>
        </div>

        {/* WhatsApp nudge */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.7 }}
          className="text-center text-sm mt-8"
          style={{ color: 'var(--muted)' }}
        >
          Still not sure?{' '}
          <a href={WA_LINK} target="_blank" rel="noopener noreferrer"
            className="font-semibold transition-colors" style={{ color: 'var(--green)' }}>
            Chat on WhatsApp →
          </a>
        </motion.p>
      </div>
    </section>
  );
}
