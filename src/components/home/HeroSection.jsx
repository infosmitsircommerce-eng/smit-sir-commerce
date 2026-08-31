import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, BookOpen, CheckCircle } from 'lucide-react';
import teacherPhoto from '../../assets/teacher-photo-opt.jpg';

const trust = [
  { value: '26', label: 'Free PDFs Published' },
  { value: '11 & 12', label: 'CBSE Classes' },
  { value: '4', label: 'Commerce Subjects' },
  { value: '2', label: 'Learning Modes' },
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
    <section className="home-hero" style={{
      background: 'linear-gradient(135deg, #ffffff 0%, #fff8e8 52%, #f8fafc 100%)',
      position: 'relative',
      overflow: 'hidden',
    }}>
      <div aria-hidden="true" style={{
        position: 'absolute', top: '-170px', right: '8%',
        width: '440px', height: '440px', borderRadius: '50%',
        background: 'rgba(224,167,43,0.22)', filter: 'blur(48px)',
        pointerEvents: 'none',
      }} />
      <div aria-hidden="true" style={{
        position: 'absolute', bottom: '-220px', left: '4%',
        width: '520px', height: '520px', borderRadius: '50%',
        background: 'rgba(183,121,31,0.12)', filter: 'blur(58px)',
        pointerEvents: 'none',
      }} />

      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '58px 32px 64px', width: '100%', position: 'relative' }} className="hero-inner-pad">
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1.18fr 0.82fr',
          gap: '56px',
          alignItems: 'center',
        }} className="hero-main-grid">
          <div>
            <motion.div {...fade(0.08)}>
              <span style={{
                display: 'inline-flex', alignItems: 'center', gap: '8px',
                padding: '8px 13px', borderRadius: '999px',
                background: 'rgba(255,255,255,0.72)',
                border: '1px solid #EAD7A7',
                boxShadow: '0 8px 24px rgba(166,111,23,0.10)',
                fontFamily: 'var(--font-sans)', fontSize: '11px', fontWeight: 700,
                letterSpacing: '0.09em', textTransform: 'uppercase', color: '#966313',
              }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#D5A438' }} />
                CBSE Commerce · Class 11 &amp; 12 · Mehsana + Online
              </span>
            </motion.div>

            <motion.h1 {...fade(0.16)} style={{
              fontFamily: 'var(--font-serif)',
              fontSize: 'clamp(2.5rem, 4.8vw, 3.8rem)',
              fontWeight: 700,
              lineHeight: 1.12,
              letterSpacing: '-0.025em',
              color: 'var(--ink)',
              margin: '26px 0 20px',
            }}>
              Commerce concepts,
              <br />
              <em style={{
                fontFamily: 'var(--font-serif)',
                fontStyle: 'normal',
                fontWeight: 750,
                fontSize: '1em',
                background: 'linear-gradient(135deg, #A66F17, #E0A72B)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
              }}>
                finally made clear.
              </em>
            </motion.h1>

            <motion.p {...fade(0.24)} style={{
              fontFamily: 'var(--font-sans)',
              fontSize: '16px', lineHeight: 1.72,
              color: 'var(--muted)',
              maxWidth: '470px',
              marginBottom: '34px',
            }}>
              Economics, Accountancy, Business Studies and Entrepreneurship —
              taught with <span className="marker" style={{ color: 'var(--ink)', fontWeight: 600 }}>concept clarity</span>,
              board-focused notes, chapter-wise practice, and published study material.
            </motion.p>

            <motion.div {...fade(0.32)} style={{ marginBottom: '36px' }}>
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                <Link to="/contact" className="btn-primary hero-primary-cta" style={{ fontSize: '15px', padding: '13px 28px' }}>
                  Book Free Demo Class
                  <ArrowRight style={{ width: '15px', height: '15px' }} />
                </Link>
                <Link to="/cbse-notes" className="btn-outline-ink hero-secondary-cta" style={{ fontSize: '15px' }}>
                  <BookOpen style={{ width: '14px', height: '14px' }} />
                  Explore Free Notes
                </Link>
              </div>
              <div style={{
                display: 'flex', alignItems: 'center', gap: '8px', marginTop: '14px',
                fontFamily: 'var(--font-sans)', fontSize: '13px', color: 'var(--muted)',
              }}>
                <CheckCircle style={{ width: '15px', height: '15px', color: 'var(--green)' }} />
                First demo class is free — no pressure.
              </div>
            </motion.div>

            <motion.div {...fade(0.4)} className="hero-trust-grid" style={{
              display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
              gap: '10px',
            }}>
              {trust.map((t) => (
                <div key={t.label} style={{
                  minHeight: '86px', padding: '15px 13px',
                  borderRadius: '14px',
                  background: 'rgba(255,255,255,0.74)',
                  border: '1px solid #E2E7F0',
                  boxShadow: '0 12px 30px rgba(16,24,40,0.06)',
                }}>
                  <div style={{
                    fontFamily: 'var(--font-serif)', fontSize: '1.45rem',
                    fontWeight: 700, color: 'var(--ink)', lineHeight: 1,
                  }}>{t.value}</div>
                  <div style={{
                    fontFamily: 'var(--font-sans)', fontSize: '10px',
                    fontWeight: 700, lineHeight: 1.35, letterSpacing: '0.045em',
                    color: 'var(--subtle)', marginTop: '8px', textTransform: 'uppercase',
                  }}>{t.label}</div>
                </div>
              ))}
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 28 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.75, delay: 0.18, ease: [0.22, 1, 0.36, 1] }}
            className="hero-teacher-card"
            style={{ position: 'relative', width: '100%', maxWidth: '430px', justifySelf: 'end' }}
          >
            <div aria-hidden="true" style={{
              position: 'absolute', inset: '12% -8% -8% 10%',
              borderRadius: '28px',
              background: 'rgba(213,164,56,0.22)',
              filter: 'blur(28px)', pointerEvents: 'none',
            }} />

            <div style={{
              position: 'relative',
              background: 'var(--bg-white)',
              borderRadius: '22px',
              overflow: 'hidden',
              border: '1px solid #E0E5EE',
              boxShadow: '0 28px 70px rgba(16,24,40,0.16)',
            }}>
              <div style={{ height: '4px', background: 'linear-gradient(90deg, #8F5C10, #D5A438, #F3CA69)' }} />

              <div className="hero-teacher-photo-frame" style={{
                width: '100%',
                aspectRatio: '4 / 5',
                overflow: 'hidden',
                background: '#eef1f5',
              }}>
                <img
                  src={teacherPhoto}
                  alt="Smit Sir — CBSE Commerce Teacher"
                  className="hero-teacher-photo"
                  loading="eager"
                  fetchPriority="high"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    objectPosition: 'center 8%',
                    display: 'block',
                  }}
                />
              </div>

              <div style={{ padding: '15px 18px 17px', background: 'var(--bg-white)' }}>
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
                  <div className="sticker" style={{
                    padding: '5px 11px', borderRadius: '7px',
                    background: 'rgba(242,205,92,0.35)', border: '1px solid rgba(184,135,47,0.3)',
                    fontFamily: 'var(--font-sans)',
                    fontSize: '10px', fontWeight: 700,
                    color: '#7A5A1E', letterSpacing: '0.05em',
                    whiteSpace: 'nowrap', flexShrink: 0,
                    boxShadow: '0 2px 6px rgba(30,24,18,0.08)',
                  }}>
                    ADMISSIONS OPEN
                  </div>
                </div>

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
          .hero-teacher-card { justify-self: center !important; max-width: 460px !important; }
          .hero-inner-pad { padding-top: 52px !important; padding-bottom: 64px !important; }
        }
        @media (max-width: 640px) {
          .hero-inner-pad { padding: 34px 16px 48px !important; }
          .hero-teacher-card { max-width: 360px !important; }
          .hero-trust-grid { grid-template-columns: repeat(2, minmax(0, 1fr)) !important; }
          .hero-main-grid h1 { font-size: clamp(2.15rem, 11vw, 2.7rem) !important; margin-top: 22px !important; }
          .hero-primary-cta, .hero-secondary-cta { width: 100% !important; }
          .hero-teacher-photo-frame { aspect-ratio: 4 / 5 !important; }
          .hero-teacher-photo { object-position: center 6% !important; }
        }
      `}</style>
    </section>
  );
}
