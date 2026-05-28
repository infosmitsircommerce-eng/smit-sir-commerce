import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Star, Quote } from 'lucide-react';
import { testimonials } from '../../data/testimonials';

export default function Testimonials() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '100px' });

  return (
    <section ref={ref} className="section-padding relative overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #F8FAFC 0%, #EEF2FF 100%)' }}>

      {/* Subtle separator */}
      <div className="absolute top-0 left-0 right-0 h-px"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(212,175,55,0.25), transparent)' }} />

      {/* Faint decorative circles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full opacity-[0.04]"
          style={{ background: 'radial-gradient(circle, #f59e0b 0%, transparent 70%)' }} />
        <div className="absolute -bottom-24 -left-24 w-80 h-80 rounded-full opacity-[0.04]"
          style={{ background: 'radial-gradient(circle, #6366f1 0%, transparent 70%)' }} />
      </div>

      <div className="page-container relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-14"
        >
          <div className="section-subheading">Student Success Stories</div>
          <h2 className="section-heading" style={{ color: '#111827' }}>
            Real Students. <span className="gradient-text">Real Results.</span>
          </h2>
          <p className="text-gray-600 max-w-xl mx-auto mt-4 mb-6">
            Every review below is from a real student who prepared with Smit Sir Commerce and appeared in CBSE Board Exams.
          </p>
          {/* Social proof bar */}
          <div className="flex flex-wrap justify-center gap-3">
            {[
              { emoji: '📊', label: '91.2%', sub: 'Class Average' },
              { emoji: '🏆', label: '9 Toppers', sub: 'CBSE 2024' },
              { emoji: '💯', label: '100%', sub: 'Pass Rate' },
              { emoji: '⭐', label: '5★', sub: 'Avg. Rating' },
            ].map(s => (
              <div key={s.label} className="flex items-center gap-2 px-4 py-2 rounded-full"
                style={{ background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.15)' }}>
                <span className="text-sm">{s.emoji}</span>
                <span className="font-black text-sm" style={{ color: '#92400e' }}>{s.label}</span>
                <span className="text-xs text-gray-500">{s.sub}</span>
              </div>
            ))}
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.06, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="group relative bg-white rounded-2xl p-6 overflow-hidden"
              style={{
                border: '1px solid rgba(0,0,0,0.06)',
                boxShadow: '0 2px 16px rgba(0,0,0,0.05)',
                transition: 'transform 0.25s cubic-bezier(0.4,0,0.2,1), box-shadow 0.25s cubic-bezier(0.4,0,0.2,1)',
              }}
              whileHover={{ y: -4 }}
              onMouseEnter={e => {
                e.currentTarget.style.boxShadow = '0 16px 48px rgba(0,0,0,0.1), 0 0 0 1px rgba(212,175,55,0.2)';
                e.currentTarget.style.borderColor = 'rgba(212,175,55,0.25)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.boxShadow = '0 2px 16px rgba(0,0,0,0.05)';
                e.currentTarget.style.borderColor = 'rgba(0,0,0,0.06)';
              }}
            >
              {/* Large decorative quote mark */}
              <div className="absolute -top-3 -right-1 opacity-[0.04] pointer-events-none select-none"
                style={{ fontSize: '120px', lineHeight: 1, fontFamily: 'Georgia, serif', color: '#111' }}>
                "
              </div>

              {/* Gold accent top line */}
              <div className="absolute top-0 left-6 right-6 h-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full"
                style={{ background: 'linear-gradient(90deg, transparent, rgba(212,175,55,0.5), transparent)' }} />

              {/* Stars */}
              <div className="flex items-center gap-0.5 mb-4">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} className="w-3.5 h-3.5 text-gold-400 fill-gold-400" />
                ))}
              </div>

              {/* Quote */}
              <p className="text-sm leading-relaxed mb-6 relative z-10" style={{ color: '#1f2937' }}>
                "{t.quote}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-gold-500 text-sm flex-shrink-0"
                  style={{ background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.2)' }}>
                  {t.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-sm" style={{ color: '#111827' }}>{t.name}</div>
                  <div className="text-xs" style={{ color: '#4B5563' }}>{t.class} · {t.subject}</div>
                </div>
                <div className="font-bold text-sm px-2.5 py-1 rounded-lg flex-shrink-0"
                  style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)', color: '#059669' }}>
                  {t.score}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
