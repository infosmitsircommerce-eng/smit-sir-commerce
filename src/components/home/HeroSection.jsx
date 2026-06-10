import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, BookOpen, CheckCircle } from 'lucide-react';
import teacherPhoto from '../../assets/teacher-photo-opt.jpg';

const trust = [
  { value: '200+', label: 'Students Taught'   },
  { value: '91%',  label: 'Avg. Board Score'  },
  { value: '234+', label: 'Premium PDFs'      },
  { value: '5★',   label: 'Student Rating'    },
];

const badges = [
  { text: 'CBSE Board Focused' },
  { text: 'Chapter-wise Notes' },
  { text: 'Doubt Support'      },
];

const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] },
});

export default function HeroSection() {
  return (
    <section style={{
      background: 'var(--bg-ivory)',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Ruled-paper lines — faint ledger texture */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: 'repeating-linear-gradient(180deg, transparent 0px, transparent 47px, rgba(184,135,47,0.055) 47px, rgba(184,135,47,0.055) 48px)',
        pointerEvents: 'none',
      }} />
      {/* Ledger margin line on the left, like an account book */}
      <div style={{
        position: 'absolute', top: 0, bottom: 0, left: 'max(24px, calc(50vw - 660px))',
        width: '1px', background: 'rgba(184,135,47,0.14)',
        pointerEvents: 'none',
      }} className="hidden lg:block" />
      {/* Warm gradient orbs — subtle */}
      <div style={{
        position: 'absolute', top: '-60px', left: '-60px',
        width: '520px', height: '520px',
        background: 'radial-gradient(circle, rgba(184,135,47,0.07) 0%, transparent 65%)',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', bottom: '-40px', right: '-40px',
        width: '400px', height: '400px',
        background: 'radial-gradient(circle, rgba(243,236,221,0.7) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />
      {/* Giant watermark rupee — Cormorant, barely there */}
      <div aria-hidden="true" style={{
        position: 'absolute', right: '-2%', top: '46%', transform: 'translateY(-50%)',
        fontFamily: 'var(--font-accent)', fontStyle: 'italic', fontWeight: 600,
        fontSize: 'clamp(20rem, 38vw, 34rem)', lineHeight: 1,
        color: 'rgba(184,135,47,0.045)',
        pointerEvents: 'none', userSelect: 'none',
      }} className="hidden md:block">₹</div>

      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '104px 32px 84px', width: '100%', position: 'relative' }} className="hero-inner-pad">
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1.05fr 0.95fr',
          gap: '72px',
          alignItems: 'center',
        }} className="hero-main-grid">

          {/* ── LEFT ── */}
          <div>
            {/* Eyebrow */}
            <motion.div {...fade(0.08)}>
              <span className="eyebrow">CBSE Commerce · Class 11 &amp; 12 · Mehsana + Online</span>
            </motion.div>

            {/* Headline */}
            <motion.h1 {...fade(0.16)} style={{
              fontFamily: 'var(--font-serif)',
              fontSize: 'clamp(2.5rem, 4.8vw, 3.8rem)',
              fontWeight: 700,
              lineHeight: 1.08,
              letterSpacing: '-0.025em',
              color: 'var(--ink)',
              margin: '26px 0 20px',
            }}>
              Commerce Concepts,
              <br />
              <em style={{
                fontFamily: 'var(--font-accent)',
                fontStyle: 'italic',
                fontWeight: 600,
                fontSize: '1.12em',
                background: 'linear-gradient(135deg, var(--gold), var(--gold-soft))',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}>
                finally made clear.
              </em>
            </motion.h1>

            {/* Subheadline */}
            <motion.p {...fade(0.24)} style={{
              fontFamily: 'var(--font-sans)',
              fontSize: '16px', lineHeight: 1.72,
              color: 'var(--muted)',
              maxWidth: '470px',
              marginBottom: '34px',
            }}>
              Economics, Accountancy, Business Studies and Entrepreneurship —
              taught with concept clarity, board-focused notes, chapter-wise tests,
              and premium study material.
            </motion.p>

            {/* CTA buttons */}
            <motion.div {...fade(0.32)} style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '40px' }}>
              <Link to="/contact" className="btn-primary" style={{ fontSize: '15px', padding: '13px 28px' }}>
                Book Free Demo Class
                <ArrowRight style={{ width: '15px', height: '15px' }} />
              </Link>
              <Link to="/study-material" className="btn-outline-ink" style={{ fontSize: '15px' }}>
                <BookOpen style={{ width: '14px', height: '14px' }} />
                Explore Study Material
              </Link>
            </motion.div>

            {/* Trust row — ledger columns */}
            <motion.div {...fade(0.4)} style={{
              display: 'flex', flexWrap: 'wrap',
              borderTop: '1px solid var(--border)',
              borderBottom: '1px solid var(--border-soft)',
            }}>
              {trust.map((t, i) => (
                <div key={t.label} style={{
                  padding: '18px 26px 16px 0',
                  marginRight: '26px',
                  borderRight: i < trust.length - 1 ? '1px solid var(--border-soft)' : 'none',
                }}>
                  <div style={{
                    fontFamily: 'var(--font-serif)',
                    fontSize: '1.55rem', fontWeight: 700,
                    color: 'var(--ink)', lineHeight: 1,
                  }}>{t.value}</div>
                  <div style={{
                    fontFamily: 'var(--font-sans)',
                    fontSize: '11px', fontWeight: 600,
                    letterSpacing: '0.04em',
                    color: 'var(--subtle)', marginTop: '5px',
                    textTransform: 'uppercase',
                  }}>{t.label}</div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* ── RIGHT — Teacher card ── */}
          <motion.div
            initial={{ opacity: 0, x: 28 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.75, delay: 0.18, ease: [0.22, 1, 0.36, 1] }}
            style={{ position: 'relative' }}
          >
            {/* Offset gold hairline frame behind the card */}
            <div aria-hidden="true" style={{
              position: 'absolute', inset: 0,
              transform: 'translate(14px, 14px)',
              border: '1px solid rgba(184,135,47,0.4)',
              borderRadius: '20px',
              pointerEvents: 'none',
            }} />

            <div style={{
              position: 'relative',
              background: 'var(--bg-white)',
              borderRadius: '20px',
              overflow: 'hidden',
              border: '1px solid var(--border)',
              boxShadow: '0 24px 64px rgba(30,24,18,0.12)',
            }}>
              {/* Gold accent top */}
              <div style={{ height: '3px', background: 'linear-gradient(90deg, var(--gold), var(--gold-soft), var(--gold))' }} />

              {/* Photo */}
              <img
                src={teacherPhoto}
                alt="Smit Sir — CBSE Commerce Teacher"
                style={{
                  width: '100%',
                  height: '440px',
                  objectFit: 'cover',
                  objectPosition: 'center 8%',
                  display: 'block',
                }}
              />

              {/* Info strip */}
              <div style={{ padding: '18px 22px 20px', background: 'var(--bg-white)' }}>
                <div style={{
                  display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px',
                  marginBottom: '14px',
                }}>
                  <div>
                    <div style={{
                      fontFamily: 'var(--font-serif)',
                      fontSize: '1.15rem', fontWeight: 700,
                      color: 'var(--ink)', lineHeight: 1.1,
                    }}>Smit Sir</div>
                    <div style={{
                      fontFamily: 'var(--font-sans)',
                      fontSize: '12.5px', color: 'var(--muted)',
                      marginTop: '3px',
                    }}>CBSE Commerce Specialist · Class 11 &amp; 12</div>
                  </div>
                  <div style={{
                    padding: '4px 10px', borderRadius: '6px',
                    background: 'var(--gold-bg)', border: '1px solid rgba(184,135,47,0.25)',
                    fontFamily: 'var(--font-sans)',
                    fontSize: '10px', fontWeight: 700,
                    color: 'var(--gold)', letterSpacing: '0.05em',
                    whiteSpace: 'nowrap', flexShrink: 0,
                  }}>
                    ADMISSIONS OPEN
                  </div>
                </div>

                {/* Mini badges row */}
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  {badges.map(b => (
                    <div key={b.text} style={{
                      display: 'inline-flex', alignItems: 'center', gap: '5px',
                      padding: '4px 10px', borderRadius: '999px',
                      background: 'var(--bg-ivory)', border: '1px solid var(--border)',
                      fontFamily: 'var(--font-sans)',
                      fontSize: '10.5px', fontWeight: 500, color: 'var(--charcoal)',
                    }}>
                      <CheckCircle style={{ width: '9px', height: '9px', color: 'var(--green)' }} />
                      {b.text}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <style>{`
        @media (max-width: 1024px) {
          .hero-main-grid { grid-template-columns: 1fr !important; gap: 44px !important; }
          .hero-inner-pad { padding-top: 72px !important; padding-bottom: 80px !important; }
        }
        @media (max-width: 640px) {
          .hero-inner-pad { padding: 64px 16px 72px !important; }
        }
      `}</style>
    </section>
  );
}
