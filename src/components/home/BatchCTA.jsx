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
      style={{ background: 'linear-gradient(180deg, #06041a 0%, #0b0828 100%)' }}>

      {/* Top separator glow */}
      <div className="absolute top-0 left-0 right-0 h-px pointer-events-none"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(245,158,11,0.35), transparent)' }} />

      {/* Ambient glow blobs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -left-32 top-1/2 -translate-y-1/2 w-96 h-96 rounded-full blur-3xl opacity-[0.07]"
          style={{ background: 'radial-gradient(circle, #f59e0b 0%, transparent 70%)' }} />
        <div className="absolute -right-32 top-1/2 -translate-y-1/2 w-96 h-96 rounded-full blur-3xl opacity-[0.06]"
          style={{ background: 'radial-gradient(circle, #6366f1 0%, transparent 70%)' }} />
      </div>

      <div className="page-container relative z-10">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-14"
        >
          <div className="section-subheading">Join a Batch</div>
          <h2 className="section-heading">
            Online &amp; Offline <span className="gradient-text">Batches Available</span>
          </h2>
          <p className="text-navy-400 max-w-xl mx-auto text-sm mt-3">
            Choose what works for you — join our classroom in Mehsana or study from anywhere online.
          </p>
        </motion.div>

        {/* Cards */}
        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">

          {/* ── Offline Batch ── */}
          <motion.div
            initial={{ opacity: 0, x: -32 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.12, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="group relative rounded-2xl overflow-hidden"
            style={{
              background: 'linear-gradient(145deg, rgba(245,158,11,0.07) 0%, rgba(15,13,46,0.6) 60%)',
              border: '1px solid rgba(245,158,11,0.18)',
              boxShadow: '0 0 0 0 rgba(245,158,11,0)',
              transition: 'box-shadow 0.4s ease, border-color 0.4s ease',
            }}
            whileHover={{ y: -6 }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = 'rgba(245,158,11,0.4)';
              e.currentTarget.style.boxShadow = '0 20px 60px rgba(245,158,11,0.1), 0 0 0 1px rgba(245,158,11,0.1)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = 'rgba(245,158,11,0.18)';
              e.currentTarget.style.boxShadow = '0 0 0 0 rgba(245,158,11,0)';
            }}
          >
            {/* Gradient glow at top-left */}
            <div className="absolute top-0 left-0 w-64 h-64 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
              style={{ background: 'radial-gradient(circle, rgba(245,158,11,0.12) 0%, transparent 70%)', transform: 'translate(-40%, -40%)' }} />

            <div className="relative p-8">
              {/* Header row */}
              <div className="flex items-start justify-between mb-7">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center"
                  style={{ background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.25)' }}>
                  <Users className="w-8 h-8 text-gold-400" />
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold"
                  style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)', color: '#f59e0b' }}>
                  <MapPin className="w-3 h-3" />
                  Mehsana, Gujarat
                </div>
              </div>

              <h3 className="font-display font-black text-2xl text-white mb-1">Offline Batch</h3>
              <p className="text-navy-500 text-sm mb-7">In-person classroom · Limited seats</p>

              <ul className="space-y-3.5 mb-8">
                {[
                  'Face-to-face learning with Smit Sir',
                  'Personal attention for every student',
                  'Regular in-class tests & quizzes',
                  'Interactive doubt-solving sessions',
                  'Study notes & materials provided',
                ].map((f) => (
                  <li key={f} className="flex items-center gap-3 text-navy-300 text-sm">
                    <CheckCircle className="w-4 h-4 text-gold-400 flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>

              <Link to="/offline-batch" className="btn-primary flex items-center justify-center gap-2 w-full py-3.5">
                Enquire for Offline Batch <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </motion.div>

          {/* ── Online Batch ── */}
          <motion.div
            initial={{ opacity: 0, x: 32 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.22, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="group relative rounded-2xl overflow-hidden"
            style={{
              background: 'linear-gradient(145deg, rgba(99,102,241,0.07) 0%, rgba(15,13,46,0.6) 60%)',
              border: '1px solid rgba(99,102,241,0.18)',
              transition: 'box-shadow 0.4s ease, border-color 0.4s ease',
            }}
            whileHover={{ y: -6 }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = 'rgba(99,102,241,0.4)';
              e.currentTarget.style.boxShadow = '0 20px 60px rgba(99,102,241,0.12), 0 0 0 1px rgba(99,102,241,0.1)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = 'rgba(99,102,241,0.18)';
              e.currentTarget.style.boxShadow = '0 0 0 0 rgba(99,102,241,0)';
            }}
          >
            {/* Gradient glow at top-right */}
            <div className="absolute top-0 right-0 w-64 h-64 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
              style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%)', transform: 'translate(40%, -40%)' }} />

            <div className="relative p-8">
              {/* Header row */}
              <div className="flex items-start justify-between mb-7">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center"
                  style={{ background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.25)' }}>
                  <Wifi className="w-8 h-8 text-indigo-400" />
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold"
                  style={{ background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.2)', color: '#818cf8' }}>
                  <Globe className="w-3 h-3" />
                  Pan India
                </div>
              </div>

              <h3 className="font-display font-black text-2xl text-white mb-1">Online Batch</h3>
              <p className="text-navy-500 text-sm mb-7">Study from anywhere · Flexible schedule</p>

              <ul className="space-y-3.5 mb-8">
                {[
                  'Live + recorded lectures on demand',
                  'Digital notes & PDF materials',
                  'Flexible learning hours',
                  'Online test series & quizzes',
                  'WhatsApp doubt support included',
                ].map((f) => (
                  <li key={f} className="flex items-center gap-3 text-navy-300 text-sm">
                    <CheckCircle className="w-4 h-4 text-indigo-400 flex-shrink-0" />
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
          className="text-center text-navy-500 text-sm mt-8"
        >
          Still not sure?{' '}
          <a href={WA_LINK} target="_blank" rel="noopener noreferrer"
            className="text-emerald-400 font-semibold hover:text-emerald-300 transition-colors">
            Chat on WhatsApp →
          </a>
        </motion.p>
      </div>
    </section>
  );
}
