import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Star, TrendingUp, Award, Users, CheckCircle } from 'lucide-react';
import { testimonials } from '../../data/testimonials';

const credStats = [
  { icon: TrendingUp, value: '91.2%', label: 'Class Average',  color: '#059669', bg: '#ECFDF5', border: '#A7F3D0' },
  { icon: Award,      value: '9',     label: 'CBSE Toppers',   color: '#d97706', bg: '#FFFBEB', border: '#FDE68A' },
  { icon: CheckCircle,value: '100%',  label: 'Pass Rate',      color: '#2563eb', bg: '#EFF6FF', border: '#BFDBFE' },
  { icon: Star,       value: '5★',    label: 'Avg. Rating',    color: '#7c3aed', bg: '#F5F3FF', border: '#DDD6FE' },
];

export default function Testimonials() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '80px' });

  return (
    <section ref={ref} style={{ background: 'var(--bg-white)', padding: '80px 0', borderTop: '1px solid var(--border)' }}>
      <div className="page-container">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          style={{ textAlign: 'center', marginBottom: '48px' }}
        >
          <span className="section-subheading">Student Success Stories</span>
          <h2 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: 'clamp(1.875rem, 3.5vw, 2.6rem)',
            fontWeight: 700, color: 'var(--ink)', marginBottom: '12px',
            letterSpacing: '-0.025em', lineHeight: 1.12,
            marginBottom: '16px',
          }}>
            Real Students. Real Results.
          </h2>
          <p style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: '15px', color: 'var(--muted)',
            maxWidth: '520px', margin: '0 auto 28px', lineHeight: 1.7,
          }}>
            Every review below is from a real student who prepared with Smit Sir Commerce
            and appeared in CBSE Board Exams.
          </p>

          {/* Credibility stats */}
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '10px' }}>
            {credStats.map(s => {
              const Icon = s.icon;
              return (
                <div key={s.label} style={{
                  display: 'inline-flex', alignItems: 'center', gap: '8px',
                  padding: '8px 16px', borderRadius: '999px',
                  background: s.bg, border: `1px solid ${s.border}`,
                  boxShadow: 'var(--shadow-xs)',
                }}>
                  <Icon style={{ width: '13px', height: '13px', color: s.color }} />
                  <span style={{ fontFamily: "'Inter', sans-serif", fontSize: '13px', fontWeight: 700, color: s.color }}>{s.value}</span>
                  <span style={{ fontFamily: "'Inter', sans-serif", fontSize: '12px', color: 'var(--muted)' }}>{s.label}</span>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Testimonial grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '16px',
        }} className="testimonials-grid">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.07, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              style={{
                background: 'var(--bg-white)',
                border: '1px solid var(--border)',
                borderRadius: '16px',
                padding: '24px',
                display: 'flex', flexDirection: 'column',
                transition: 'all 0.2s ease',
                position: 'relative',
              }}
              whileHover={{ y: -3, boxShadow: '0 8px 28px rgba(43,33,24,0.09)', borderColor: 'var(--border)' }}
            >
              {/* Gold top accent */}
              <div style={{
                position: 'absolute', top: 0, left: '24px', right: '24px',
                height: '2px',
                background: 'linear-gradient(90deg, transparent, var(--gold-soft), transparent)',
                borderRadius: '2px',
                opacity: 0,
                transition: 'opacity 0.2s',
              }} className="card-top-line" />

              {/* Stars */}
              <div style={{ display: 'flex', gap: '2px', marginBottom: '14px' }}>
                {[1,2,3,4,5].map(s => (
                  <Star key={s} style={{ width: '14px', height: '14px', color: '#d97706', fill: '#d97706' }} />
                ))}
              </div>

              {/* Quote */}
              <p style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: '14px', lineHeight: 1.72,
                color: 'var(--charcoal)',
                flex: 1, marginBottom: '20px',
                fontStyle: 'italic',
              }}>
                "{t.quote}"
              </p>

              {/* Author */}
              <div style={{
                display: 'flex', alignItems: 'center', gap: '12px',
                paddingTop: '16px',
                borderTop: '1px solid var(--border-soft)',
              }}>
                <div style={{
                  width: '36px', height: '36px',
                  borderRadius: '50%',
                  background: 'var(--gold-bg)',
                  border: '1px solid rgba(184,135,47,0.2)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: "'Inter', sans-serif",
                  fontSize: '13px', fontWeight: 700,
                  color: 'var(--gold)',
                  flexShrink: 0,
                }}>
                  {t.avatar || t.name?.charAt(0) || 'S'}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontFamily: "'Inter', sans-serif", fontSize: '13px', fontWeight: 700, color: 'var(--ink)' }}>
                    {t.name}
                  </div>
                  <div style={{ fontFamily: "'Inter', sans-serif", fontSize: '11px', color: 'var(--subtle)', marginTop: '1px' }}>
                    {t.class} · {t.subject}
                  </div>
                </div>
                <div style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: '12px', fontWeight: 700,
                  padding: '3px 10px', borderRadius: '8px',
                  background: '#ECFDF5', border: '1px solid #A7F3D0',
                  color: '#059669', flexShrink: 0,
                }}>
                  {t.score}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 1024px) { .testimonials-grid { grid-template-columns: repeat(2, 1fr) !important; } }
        @media (max-width: 640px)  { .testimonials-grid { grid-template-columns: 1fr !important; } }
        .testimonials-grid > div:hover .card-top-line { opacity: 1 !important; }
      `}</style>
    </section>
  );
}
