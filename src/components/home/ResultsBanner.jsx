import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Star } from 'lucide-react';
import { testimonials } from '../../data/testimonials';

const QUOTES = testimonials.slice(0, 3);

const RESULTS = [
  { name: 'Heer Patel',     score: 95, subject: 'Economics'        },
  { name: 'Niv Patel',      score: 94, subject: 'Accountancy'      },
  { name: 'Manan Dunti',    score: 93, subject: 'Accountancy'      },
  { name: 'Mann Prajapati', score: 92, subject: 'Economics'        },
  { name: 'Laksh Rajput',   score: 91, subject: 'Accountancy'      },
  { name: 'Vishal Rajput',  score: 90, subject: 'Business Studies' },
  { name: 'Kavya Patel',    score: 89, subject: 'Online Batch'     },
  { name: 'Arwa Rupawala',  score: 88, subject: 'All Subjects'     },
  { name: 'Hussaina',       score: 86, subject: 'Economics'        },
];

const AGG = [
  { value: '91.2%', label: 'Class Average',   sub: 'CBSE Board 2024'        },
  { value: '95%',   label: 'Highest Score',   sub: 'Heer Patel · Economics' },
  { value: '9/9',   label: 'Students Passed', sub: '100% pass rate'         },
  { value: '6',     label: 'Scored 90%+',     sub: 'Out of 9 students'      },
];

export default function ResultsBanner() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '80px' });

  return (
    <section ref={ref} className="section-padding relative overflow-hidden"
      style={{ background: 'var(--bg-white)' }}>

      <div className="page-container relative z-10">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <span className="eyebrow">CBSE Board Exam Results — 2024</span>
          <h2 className="headline mt-6 mb-3">
            Results that <em>speak for themselves.</em>
          </h2>
          <p className="text-sm max-w-lg mx-auto" style={{ color: 'var(--muted)' }}>
            Every student who prepared with Smit Sir Commerce scored above 85% in the CBSE 2024 Board Exams.
          </p>
        </motion.div>

        {/* Aggregate row — ledger columns */}
        <div className="grid grid-cols-2 lg:grid-cols-4 mb-12 rounded-2xl overflow-hidden"
          style={{ border: '1px solid var(--border)', background: 'var(--bg-ivory)' }}>
          {AGG.map((a, i) => (
            <motion.div
              key={a.label}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.08, duration: 0.5 }}
              className="p-6 text-center"
              style={{
                borderRight: i % 2 === 0 ? '1px solid var(--border)' : undefined,
                borderLeft: i === 2 ? undefined : undefined,
                borderTop: i >= 2 ? '1px solid var(--border)' : undefined,
              }}
            >
              <div style={{
                fontFamily: 'var(--font-serif)', fontWeight: 700,
                fontSize: 'clamp(1.8rem, 3.5vw, 2.4rem)', lineHeight: 1,
                color: 'var(--gold)', marginBottom: '8px',
              }}>{a.value}</div>
              <div className="text-xs font-bold uppercase tracking-wider mb-0.5" style={{ color: 'var(--ink)' }}>{a.label}</div>
              <div className="text-[11px]" style={{ color: 'var(--subtle)' }}>{a.sub}</div>
            </motion.div>
          ))}
        </div>

        {/* The merit ledger — ruled table */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.35 }}
          className="max-w-2xl mx-auto mb-10"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="flex-1 h-px" style={{ background: 'var(--border)' }} />
            <p className="text-[11px] font-bold tracking-[0.2em] uppercase" style={{ color: 'var(--subtle)' }}>
              Individual Results
            </p>
            <div className="flex-1 h-px" style={{ background: 'var(--border)' }} />
          </div>

          <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)' }}>
            {RESULTS.map((r, i) => (
              <motion.div
                key={r.name}
                initial={{ opacity: 0, x: -12 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: 0.4 + i * 0.05 }}
                className="flex items-center gap-3 px-5 py-3"
                style={{
                  background: i % 2 === 0 ? 'var(--bg-white)' : 'var(--bg-ivory)',
                  borderTop: i > 0 ? '1px solid var(--border-soft)' : 'none',
                }}
              >
                <span style={{
                  fontFamily: 'var(--font-accent)', fontStyle: 'italic',
                  fontSize: '13px', color: 'var(--subtle)', width: '22px', flexShrink: 0,
                }}>{String(i + 1).padStart(2, '0')}</span>
                <span className="text-sm font-semibold flex-1 truncate" style={{ color: 'var(--ink)' }}>{r.name}</span>
                <span className="text-xs hidden sm:block truncate" style={{ color: 'var(--muted)', maxWidth: '160px' }}>{r.subject}</span>
                {/* Dot leaders, like a table of contents */}
                <span aria-hidden="true" className="flex-1 hidden sm:block overflow-hidden whitespace-nowrap text-xs tracking-[0.35em]" style={{ color: 'var(--border)' }}>
                  ······································
                </span>
                <span style={{
                  fontFamily: 'var(--font-serif)', fontWeight: 700, fontSize: '1.05rem',
                  color: r.score >= 93 ? 'var(--gold)' : r.score >= 90 ? 'var(--green)' : 'var(--charcoal)',
                  flexShrink: 0,
                }}>{r.score}%</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* In their words — three voices */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.6 }}
          className="mb-12"
        >
          <div className="flex items-center gap-3 mb-6 max-w-2xl mx-auto">
            <div className="flex-1 h-px" style={{ background: 'var(--border)' }} />
            <p className="text-[11px] font-bold tracking-[0.2em] uppercase" style={{ color: 'var(--subtle)' }}>
              In Their Words
            </p>
            <div className="flex-1 h-px" style={{ background: 'var(--border)' }} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {QUOTES.map((t, i) => (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, y: 16 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.7 + i * 0.08 }}
                className="relative rounded-2xl p-6 overflow-hidden"
                style={{ background: 'var(--bg-ivory)', border: '1px solid var(--border)' }}
              >
                <div aria-hidden="true" className="absolute -top-4 right-2 pointer-events-none select-none"
                  style={{ fontSize: '100px', lineHeight: 1, fontFamily: 'var(--font-accent)', fontStyle: 'italic', color: 'rgba(184,135,47,0.1)' }}>
                  ”
                </div>
                <div className="flex items-center gap-0.5 mb-3">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} className="w-3 h-3" style={{ fill: 'var(--gold-soft)', color: 'var(--gold-soft)' }} />
                  ))}
                </div>
                <p className="text-sm leading-relaxed mb-5 relative z-10" style={{ color: 'var(--charcoal)' }}>
                  “{t.quote}”
                </p>
                <div className="flex items-center gap-3 pt-3" style={{ borderTop: '1px solid var(--border-soft)' }}>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm" style={{ fontFamily: 'var(--font-serif)', fontWeight: 700, color: 'var(--ink)' }}>{t.name}</div>
                    <div className="text-xs" style={{ color: 'var(--muted)' }}>{t.class} · {t.subject}</div>
                  </div>
                  <div className="text-sm px-2.5 py-1 rounded-lg flex-shrink-0"
                    style={{ fontFamily: 'var(--font-serif)', fontWeight: 700, background: 'rgba(77,124,15,0.07)', border: '1px solid rgba(77,124,15,0.2)', color: 'var(--green)' }}>
                    {t.score}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Bottom callout */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.9 }}
          className="rounded-2xl p-6 text-center max-w-2xl mx-auto"
          style={{ background: 'var(--gold-bg)', border: '1px solid rgba(184,135,47,0.25)' }}
        >
          <p className="text-sm" style={{ color: 'var(--charcoal)' }}>
            <span style={{ fontFamily: 'var(--font-accent)', fontStyle: 'italic', fontWeight: 600, fontSize: '1.15rem', color: 'var(--gold)' }}>
              Your name could be here next year.
            </span>
            <br />
            Join Smit Sir Commerce and get the same focused preparation that delivered these results.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
