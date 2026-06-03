import { motion, useInView } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import { Users, FileText, BookOpen, Star, Award, Target } from 'lucide-react';

const stats = [
  { icon: Users,    value: 200, suffix: '+', label: 'Students Taught',      sub: 'Class 11 & 12 Commerce' },
  { icon: FileText, value: 234, suffix: '+', label: 'Premium PDFs',         sub: 'Notes, PYQs, Mind Maps'  },
  { icon: Target,   value: 91,  suffix: '%', label: 'Score Improvement',    sub: 'CBSE Board Average'      },
  { icon: Star,     value: 5,   suffix: '★', label: 'Student Rating',       sub: 'Google Reviews'          },
  { icon: BookOpen, value: 4,   suffix: '',  label: 'Subjects Covered',     sub: 'Eco, BST, Acc, Ent'      },
  { icon: Award,    value: 3,   suffix: '+', label: 'Years Specialisation', sub: 'Commerce Only'           },
];

function CountUp({ end, suffix, inView, duration = 1400 }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!inView) return;
    let st = null;
    const step = (ts) => {
      if (!st) st = ts;
      const p = Math.min((ts - st) / duration, 1);
      const e = 1 - Math.pow(1 - p, 3);
      setCount(Math.floor(e * end));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [inView, end, duration]);
  return <>{count}{suffix}</>;
}

export default function StatsSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.1 });

  return (
    <section ref={ref} style={{
      background: 'var(--bg-white)',
      borderTop: '1px solid var(--border)',
      borderBottom: '1px solid var(--border)',
      padding: '64px 0',
    }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 32px' }}>
        {/* Top label */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          style={{
            display: 'flex', alignItems: 'center', gap: '16px',
            marginBottom: '48px',
          }}
        >
          <div style={{ height: '1px', flex: 1, background: 'var(--border)' }} />
          <span style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: '10.5px', letterSpacing: '0.18em',
            textTransform: 'uppercase', color: 'var(--gold)',
            fontWeight: 600,
          }}>
            Trusted by students &amp; parents across Gujarat
          </span>
          <div style={{ height: '1px', flex: 1, background: 'var(--border)' }} />
        </motion.div>

        {/* Stats grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(6, 1fr)',
          gap: '1px',
          background: 'var(--border)',
          border: '1px solid var(--border)',
          borderRadius: '16px',
          overflow: 'hidden',
        }} className="stats-grid">
          {stats.map((s, i) => {
            const Icon = s.icon;
            return (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 16 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: i * 0.07, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                style={{
                  background: 'var(--bg-white)',
                  padding: '28px 24px',
                  textAlign: 'center',
                  transition: 'background 0.18s',
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-ivory)'}
                onMouseLeave={e => e.currentTarget.style.background = 'var(--bg-white)'}
              >
                <div style={{
                  width: '36px', height: '36px',
                  borderRadius: '8px',
                  background: 'var(--gold-bg)',
                  border: '1px solid rgba(184,135,47,0.15)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto 12px',
                }}>
                  <Icon style={{ width: '16px', height: '16px', color: 'var(--gold)' }} />
                </div>
                <div style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: '1.75rem', fontWeight: 700,
                  color: 'var(--ink)', lineHeight: 1,
                  marginBottom: '4px',
                }}>
                  <CountUp end={s.value} suffix={s.suffix} inView={inView} />
                </div>
                <div style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: '12px', fontWeight: 600,
                  color: 'var(--charcoal)', marginBottom: '2px',
                }}>
                  {s.label}
                </div>
                <div style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: '10.5px', color: 'var(--subtle)',
                }}>
                  {s.sub}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
      <style>{`
        @media (max-width: 1024px) { .stats-grid { grid-template-columns: repeat(3, 1fr) !important; } }
        @media (max-width: 640px)  { .stats-grid { grid-template-columns: repeat(2, 1fr) !important; } }
      `}</style>
    </section>
  );
}
