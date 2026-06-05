import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, BookOpen, CheckCircle } from 'lucide-react';
import teacherPhoto from '../../assets/teacher-photo-opt.jpg';

const WA = 'https://wa.me/916353709585?text=Hello%20Smit%20Sir%2C%20I%20want%20to%20book%20a%20free%20demo%20class%20for%20Class%2011%2F12%20Commerce.';

const trust = [
  { value: '200+', label: 'Students Taught'  },
  { value: '90%+', label: 'Score Improvement' },
  { value: '234+', label: 'Premium PDFs'      },
  { value: '5★',   label: 'Student Rating'   },
];

const badges = [
  { text: 'CBSE Board Focused'  },
  { text: 'Chapter-wise Notes'  },
  { text: 'Doubt Support'       },
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
      {/* Warm gradient orbs — subtle */}
      <div style={{
        position: 'absolute', top: '-60px', left: '-60px',
        width: '500px', height: '500px',
        background: 'radial-gradient(circle, rgba(184,135,47,0.05) 0%, transparent 65%)',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', bottom: '-40px', right: '-40px',
        width: '400px', height: '400px',
        background: 'radial-gradient(circle, rgba(245,239,227,0.6) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '100px 32px 80px', width: '100%' }} className="hero-inner-pad">
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '72px',
          alignItems: 'center',
        }} className="hero-main-grid">

          {/* ── LEFT ── */}
          <div>
            {/* Eyebrow */}
            <motion.div {...fade(0.08)} style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              background: 'var(--gold-bg)',
              border: '1px solid rgba(184,135,47,0.22)',
              borderRadius: '999px',
              padding: '5px 14px',
              marginBottom: '24px',
            }}>
              <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: 'var(--gold)', flexShrink: 0 }} />
              <span style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: '11px', fontWeight: 600,
                letterSpacing: '0.07em', textTransform: 'uppercase',
                color: 'var(--gold)',
              }}>
                CBSE Commerce · Class 11 &amp; 12 · Mehsana + Online
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1 {...fade(0.16)} style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: 'clamp(2.2rem, 4.2vw, 3.2rem)',
              fontWeight: 700,
              lineHeight: 1.1,
              letterSpacing: '-0.025em',
              color: 'var(--ink)',
              marginBottom: '18px',
            }}>
              Commerce Concepts,<br />
              <em style={{
                fontStyle: 'italic',
                background: 'linear-gradient(135deg, var(--gold), var(--gold-soft))',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}>
                Finally Made Clear.
              </em>
            </motion.h1>

            {/* Subheadline */}
            <motion.p {...fade(0.24)} style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: '15.5px', lineHeight: 1.72,
              color: 'var(--muted)',
              maxWidth: '460px',
              marginBottom: '32px',
            }}>
              Economics, Accountancy, Business Studies and Entrepreneurship —
              taught with concept clarity, board-focused notes, chapter-wise tests,
              and premium study material.
            </motion.p>

            {/* CTA buttons */}
            <motion.div {...fade(0.32)} style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '36px' }}>
              <Link to="/contact" className="btn-primary" style={{ fontSize: '15px', padding: '13px 28px' }}>
                Book Free Demo Class
                <ArrowRight style={{ width: '15px', height: '15px' }} />
              </Link>
              <Link to="/study-material" className="btn-secondary" style={{ fontSize: '15px' }}>
                <BookOpen style={{ width: '14px', height: '14px' }} />
                Explore Study Material
              </Link>
            </motion.div>

            {/* Trust row */}
            <motion.div {...fade(0.4)} style={{
              display: 'flex', gap: '24px', flexWrap: 'wrap',
              paddingTop: '24px',
              borderTop: '1px solid var(--border)',
            }}>
              {trust.map(t => (
                <div key={t.label}>
                  <div style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: '1.4rem', fontWeight: 700,
                    color: 'var(--ink)', lineHeight: 1,
                  }}>{t.value}</div>
                  <div style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: '11px', fontWeight: 500,
                    color: 'var(--muted)', marginTop: '3px',
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
          >
            <div style={{
              background: 'var(--bg-white)',
              borderRadius: '20px',
              overflow: 'hidden',
              border: '1px solid var(--border)',
              boxShadow: '0 20px 56px rgba(43,33,24,0.09)',
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
                      fontFamily: "'Playfair Display', serif",
                      fontSize: '1.1rem', fontWeight: 700,
                      color: 'var(--ink)', lineHeight: 1.1,
                    }}>Smit Sir</div>
                    <div style={{
                      fontFamily: "'Inter', sans-serif",
                      fontSize: '12.5px', color: 'var(--muted)',
                      marginTop: '2px',
                    }}>CBSE Commerce Specialist · Class 11 &amp; 12</div>
                  </div>
                  {/* Admissions badge — subtle, inside info strip */}
                  <div style={{
                    padding: '4px 10px', borderRadius: '6px',
                    background: 'var(--gold-bg)', border: '1px solid rgba(184,135,47,0.25)',
                    fontFamily: "'Inter', sans-serif",
                    fontSize: '10px', fontWeight: 700,
                    color: 'var(--gold)', letterSpacing: '0.04em',
                    whiteSpace: 'nowrap', flexShrink: 0,
                  }}>
                    ADMISSIONS OPEN
                  </div>
                </div>

                {/* Mini badges row */}
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  {badges.map(b => (
                    <div key={b.text} style={{
                      display: 'inline-flex', alignItems: 'center', gap: '4px',
                      padding: '3px 9px', borderRadius: '999px',
                      background: 'var(--bg-ivory)', border: '1px solid var(--border)',
                      fontFamily: "'Inter', sans-serif",
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
          .hero-main-grid { grid-template-columns: 1fr !important; gap: 40px !important; }
          .hero-inner-pad { padding-top: 72px !important; padding-bottom: 80px !important; }
        }
        @media (max-width: 640px) {
          .hero-inner-pad { padding: 70px 16px 80px !important; }
        }
      `}</style>
    </section>
  );
}
