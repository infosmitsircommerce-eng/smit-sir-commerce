import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Star } from 'lucide-react';
import { testimonials } from '../../data/testimonials';

export default function Testimonials() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '100px' });

  return (
    <section ref={ref} className="section-padding relative overflow-hidden"
      style={{ background: 'var(--bg-ivory)' }}>

      <div className="page-container relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-14"
        >
          <span className="eyebrow">Student Success Stories</span>
          <h2 className="headline mt-6">
            Real students. <em>Real results.</em>
          </h2>
          <p className="max-w-xl mx-auto mt-5 mb-7" style={{ color: 'var(--muted)' }}>
            Every review below is from a real student who prepared with Smit Sir Commerce and appeared in CBSE Board Exams.
          </p>
          {/* Social proof bar */}
          <div className="flex flex-wrap justify-center gap-3">
            {[
              { label: '91.2%',    sub: 'Class Average' },
              { label: '9 Toppers', sub: 'CBSE 2024'     },
              { label: '100%',     sub: 'Pass Rate'      },
              { label: '5★',       sub: 'Avg. Rating'    },
            ].map(s => (
              <div key={s.label} className="flex items-baseline gap-2 px-4 py-2 rounded-full"
                style={{ background: 'var(--bg-white)', border: '1px solid var(--border)' }}>
                <span style={{ fontFamily: 'var(--font-serif)', fontWeight: 700, fontSize: '0.95rem', color: 'var(--gold)' }}>{s.label}</span>
                <span className="text-xs" style={{ color: 'var(--muted)' }}>{s.sub}</span>
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
              className="group relative rounded-2xl p-6 overflow-hidden"
              style={{
                background: 'var(--bg-white)',
                border: '1px solid var(--border)',
                boxShadow: 'var(--shadow-sm)',
                transition: 'transform 0.25s cubic-bezier(0.4,0,0.2,1), box-shadow 0.25s cubic-bezier(0.4,0,0.2,1), border-color 0.25s cubic-bezier(0.4,0,0.2,1)',
              }}
              whileHover={{ y: -4 }}
              onMouseEnter={e => {
                e.currentTarget.style.boxShadow = 'var(--shadow-md)';
                e.currentTarget.style.borderColor = 'rgba(184,135,47,0.35)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
                e.currentTarget.style.borderColor = 'var(--border)';
              }}
            >
              {/* Large Cormorant quote mark */}
              <div aria-hidden="true" className="absolute -top-4 right-2 pointer-events-none select-none"
                style={{
                  fontSize: '110px', lineHeight: 1,
                  fontFamily: 'var(--font-accent)', fontStyle: 'italic',
                  color: 'rgba(184,135,47,0.1)',
                }}>
                ”
              </div>

              {/* Stars */}
              <div className="flex items-center gap-0.5 mb-4">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} className="w-3.5 h-3.5" style={{ fill: 'var(--gold-soft)', color: 'var(--gold-soft)' }} />
                ))}
              </div>

              {/* Quote */}
              <p className="text-sm leading-relaxed mb-6 relative z-10" style={{ color: 'var(--charcoal)' }}>
                “{t.quote}”
              </p>

              {/* Author */}
              <div className="flex items-center gap-3 pt-4" style={{ borderTop: '1px solid var(--border-soft)' }}>
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm flex-shrink-0"
                  style={{
                    fontFamily: 'var(--font-serif)', fontWeight: 700, color: 'var(--gold)',
                    background: 'var(--gold-bg)', border: '1px solid rgba(184,135,47,0.22)',
                  }}>
                  {t.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm" style={{ fontFamily: 'var(--font-serif)', fontWeight: 700, color: 'var(--ink)' }}>{t.name}</div>
                  <div className="text-xs" style={{ color: 'var(--muted)' }}>{t.class} · {t.subject}</div>
                </div>
                <div className="text-sm px-2.5 py-1 rounded-lg flex-shrink-0"
                  style={{
                    fontFamily: 'var(--font-serif)', fontWeight: 700,
                    background: 'rgba(77,124,15,0.07)', border: '1px solid rgba(77,124,15,0.2)', color: 'var(--green)',
                  }}>
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
