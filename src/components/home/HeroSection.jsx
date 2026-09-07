import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, BookOpen, CheckCircle, Download, FileText, Sparkles, Star, Trophy } from 'lucide-react';
import teacherPhoto from '../../assets/teacher-photo-opt.jpg';

const trust = [
  { value: '26+', label: 'Free PDFs' },
  { value: '41', label: 'Learning Tools' },
  { value: '11 & 12', label: 'Commerce Classes' },
  { value: 'Clarity', label: 'First Approach' },
];

const badges = [
  { text: 'Concept Clarity' },
  { text: 'Learning with Fun' },
  { text: 'Questions Welcome' },
];

const materialPills = [
  { icon: FileText, text: 'Notes + PDFs' },
  { icon: Download, text: 'Free Material' },
  { icon: Trophy, text: 'Practice Support' },
];

const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] },
});

export default function HeroSection() {
  return (
    <section
      className="home-hero"
      style={{
        background:
          'radial-gradient(circle at 78% 18%, rgba(224,167,43,0.22), transparent 30%), radial-gradient(circle at 12% 82%, rgba(143,92,16,0.12), transparent 35%), linear-gradient(135deg, #ffffff 0%, #fff8e8 52%, #f8fafc 100%)',
        position: 'relative',
        overflow: 'hidden',
        isolation: 'isolate',
      }}
    >
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage:
            'linear-gradient(rgba(143,92,16,0.055) 1px, transparent 1px), linear-gradient(90deg, rgba(143,92,16,0.045) 1px, transparent 1px)',
          backgroundSize: '72px 72px',
          maskImage: 'linear-gradient(180deg, rgba(0,0,0,0.75), transparent 78%)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: '-170px',
          right: '8%',
          width: '510px',
          height: '510px',
          borderRadius: '50%',
          background: 'rgba(224,167,43,0.25)',
          filter: 'blur(54px)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          bottom: '-220px',
          left: '4%',
          width: '560px',
          height: '560px',
          borderRadius: '50%',
          background: 'rgba(183,121,31,0.14)',
          filter: 'blur(64px)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          width: '170px',
          height: '170px',
          borderRadius: '36px',
          border: '1px solid rgba(213,164,56,0.28)',
          transform: 'rotate(18deg)',
          right: '43%',
          top: '70px',
          opacity: 0.7,
          zIndex: 0,
        }}
      />

      <div
        style={{ maxWidth: '1280px', margin: '0 auto', padding: '70px 32px 72px', width: '100%', position: 'relative', zIndex: 1 }}
        className="hero-inner-pad"
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1.18fr 0.82fr',
            gap: '60px',
            alignItems: 'center',
          }}
          className="hero-main-grid"
        >
          <div>
            <motion.div {...fade(0.08)}>
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '9px 14px',
                  borderRadius: '999px',
                  background: 'rgba(255,255,255,0.78)',
                  border: '1px solid #EAD7A7',
                  boxShadow: '0 12px 30px rgba(166,111,23,0.12)',
                  backdropFilter: 'blur(16px)',
                  fontFamily: 'var(--font-sans)',
                  fontSize: '11px',
                  fontWeight: 800,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  color: '#966313',
                }}
              >
                <Sparkles style={{ width: '13px', height: '13px' }} />
                A different way to learn Commerce
              </span>
            </motion.div>

            <motion.h1
              {...fade(0.16)}
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: 'clamp(2.75rem, 5.2vw, 4.35rem)',
                fontWeight: 760,
                lineHeight: 1.04,
                letterSpacing: '-0.04em',
                color: 'var(--ink)',
                margin: '28px 0 22px',
                textWrap: 'balance',
              }}
            >
              In a world chasing marks,
              <br />
              <em
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontStyle: 'normal',
                  fontWeight: 800,
                  fontSize: '1em',
                  background: 'linear-gradient(135deg, #8F5C10 0%, #D5A438 54%, #F3CA69 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  filter: 'drop-shadow(0 10px 20px rgba(213,164,56,0.16))',
                }}
              >
                choose understanding.
              </em>
            </motion.h1>

            <motion.p
              {...fade(0.24)}
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: '17px',
                lineHeight: 1.78,
                color: 'var(--muted)',
                maxWidth: '610px',
                marginBottom: '18px',
              }}
            >
              Marks matter — but they are the result, not the entire purpose of education. Learn Commerce with
              <span className="marker" style={{ color: 'var(--ink)', fontWeight: 700 }}> clarity, curiosity and fun</span>,
              so you understand the “why” behind every concept instead of only memorising the answer.
            </motion.p>

            <motion.div
              {...fade(0.28)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                padding: '13px 16px',
                borderRadius: '18px',
                background: 'linear-gradient(135deg, rgba(255,255,255,0.82), rgba(255,248,232,0.88))',
                border: '1px solid rgba(213,164,56,0.32)',
                boxShadow: '0 16px 36px rgba(166,111,23,0.11)',
                marginBottom: '30px',
              }}
              className="hero-quote-card"
            >
              <Star style={{ width: '17px', height: '17px', color: '#A66F17', flexShrink: 0 }} />
              <span
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: '1.18rem',
                  lineHeight: 1.35,
                  color: 'var(--ink)',
                  fontWeight: 700,
                }}
              >
                Learning with Fun. Marks as a Result.
              </span>
            </motion.div>

            <motion.div {...fade(0.31)} className="hero-material-pills" style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '30px' }}>
              {materialPills.map(({ icon: Icon, text }) => (
                <span
                  key={text}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '7px',
                    padding: '9px 12px',
                    borderRadius: '999px',
                    background: 'rgba(255,255,255,0.72)',
                    border: '1px solid rgba(226,231,240,0.96)',
                    boxShadow: '0 10px 24px rgba(16,24,40,0.06)',
                    fontFamily: 'var(--font-sans)',
                    fontSize: '12px',
                    fontWeight: 750,
                    color: 'var(--charcoal)',
                  }}
                >
                  <Icon style={{ width: '14px', height: '14px', color: '#A66F17' }} />
                  {text}
                </span>
              ))}
            </motion.div>

            <motion.div {...fade(0.34)} style={{ marginBottom: '38px' }}>
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                <Link
                  to="/study-material"
                  className="btn-primary hero-primary-cta"
                  style={{
                    fontSize: '15px',
                    padding: '14px 30px',
                    boxShadow: '0 18px 38px rgba(166,111,23,0.22)',
                  }}
                >
                  Start Learning Free
                  <ArrowRight style={{ width: '15px', height: '15px' }} />
                </Link>
                <Link to="/book-demo" className="btn-outline-ink hero-secondary-cta" style={{ fontSize: '15px', background: 'rgba(255,255,255,0.72)' }}>
                  <BookOpen style={{ width: '14px', height: '14px' }} />
                  Book Free Demo
                </Link>
              </div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  marginTop: '15px',
                  fontFamily: 'var(--font-sans)',
                  fontSize: '13px',
                  color: 'var(--muted)',
                }}
              >
                <CheckCircle style={{ width: '15px', height: '15px', color: 'var(--green)' }} />
                Understand first. Practise confidently. Let better marks follow.
              </div>
            </motion.div>

            <motion.div
              {...fade(0.42)}
              className="hero-trust-grid"
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
                gap: '12px',
              }}
            >
              {trust.map((t, index) => (
                <div
                  key={t.label}
                  className="hero-trust-card"
                  style={{
                    minHeight: '92px',
                    padding: '16px 14px',
                    borderRadius: '18px',
                    background: 'linear-gradient(180deg, rgba(255,255,255,0.86), rgba(255,255,255,0.62))',
                    border: '1px solid rgba(226,231,240,0.96)',
                    boxShadow: '0 16px 36px rgba(16,24,40,0.07)',
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                >
                  <div
                    aria-hidden="true"
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      height: '3px',
                      background: index % 2 === 0 ? 'linear-gradient(90deg, #8F5C10, #D5A438)' : 'linear-gradient(90deg, #D5A438, #F3CA69)',
                    }}
                  />
                  <div
                    style={{
                      fontFamily: 'var(--font-serif)',
                      fontSize: '1.48rem',
                      fontWeight: 780,
                      color: 'var(--ink)',
                      lineHeight: 1,
                    }}
                  >
                    {t.value}
                  </div>
                  <div
                    style={{
                      fontFamily: 'var(--font-sans)',
                      fontSize: '10px',
                      fontWeight: 800,
                      lineHeight: 1.35,
                      letterSpacing: '0.055em',
                      color: 'var(--subtle)',
                      marginTop: '9px',
                      textTransform: 'uppercase',
                    }}
                  >
                    {t.label}
                  </div>
                </div>
              ))}
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 28 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.75, delay: 0.18, ease: [0.22, 1, 0.36, 1] }}
            className="hero-teacher-card"
            style={{ position: 'relative', width: '100%', maxWidth: '440px', justifySelf: 'end' }}
          >
            <div
              aria-hidden="true"
              style={{
                position: 'absolute',
                inset: '9% -9% -7% 8%',
                borderRadius: '34px',
                background: 'rgba(213,164,56,0.24)',
                filter: 'blur(30px)',
                pointerEvents: 'none',
              }}
            />
            <div
              aria-hidden="true"
              style={{
                position: 'absolute',
                inset: '18px -14px -18px 24px',
                borderRadius: '30px',
                border: '1px solid rgba(143,92,16,0.22)',
                transform: 'rotate(3deg)',
                background: 'rgba(255,248,232,0.44)',
              }}
            />

            <motion.div
              initial={{ opacity: 0, y: 18, rotate: -3 }}
              animate={{ opacity: 1, y: 0, rotate: -3 }}
              transition={{ duration: 0.65, delay: 0.55 }}
              className="hero-floating-card hero-floating-left"
              style={{
                position: 'absolute',
                left: '-28px',
                top: '18%',
                zIndex: 4,
                padding: '12px 14px',
                borderRadius: '17px',
                background: 'rgba(255,255,255,0.88)',
                border: '1px solid rgba(213,164,56,0.30)',
                boxShadow: '0 20px 42px rgba(16,24,40,0.13)',
                backdropFilter: 'blur(16px)',
                minWidth: '145px',
              }}
            >
              <div style={{ fontFamily: 'var(--font-serif)', fontWeight: 800, color: 'var(--ink)', fontSize: '1.2rem', lineHeight: 1 }}>Free</div>
              <div style={{ fontFamily: 'var(--font-sans)', color: 'var(--muted)', fontSize: '11px', fontWeight: 750, marginTop: '4px' }}>Notes · PDFs · Tools</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 18, rotate: 4 }}
              animate={{ opacity: 1, y: 0, rotate: 4 }}
              transition={{ duration: 0.65, delay: 0.65 }}
              className="hero-floating-card hero-floating-right"
              style={{
                position: 'absolute',
                right: '-22px',
                bottom: '22%',
                zIndex: 4,
                padding: '12px 14px',
                borderRadius: '17px',
                background: 'rgba(23,19,15,0.88)',
                border: '1px solid rgba(243,202,105,0.35)',
                boxShadow: '0 20px 42px rgba(16,24,40,0.16)',
                backdropFilter: 'blur(16px)',
                minWidth: '150px',
              }}
            >
              <div style={{ fontFamily: 'var(--font-serif)', fontWeight: 800, color: '#F3CA69', fontSize: '1.05rem', lineHeight: 1 }}>Ask Why</div>
              <div style={{ fontFamily: 'var(--font-sans)', color: 'rgba(255,255,255,0.74)', fontSize: '11px', fontWeight: 700, marginTop: '5px' }}>Not only what</div>
            </motion.div>

            <div
              style={{
                position: 'relative',
                background: 'linear-gradient(180deg, rgba(255,255,255,0.98), rgba(255,248,232,0.92))',
                borderRadius: '28px',
                overflow: 'hidden',
                border: '1px solid rgba(224,229,238,0.96)',
                boxShadow: '0 34px 85px rgba(16,24,40,0.18)',
              }}
            >
              <div style={{ height: '5px', background: 'linear-gradient(90deg, #8F5C10, #D5A438, #F3CA69)' }} />

              <div
                className="hero-teacher-photo-frame"
                style={{
                  width: '100%',
                  aspectRatio: '4 / 5',
                  overflow: 'hidden',
                  background: '#eef1f5',
                  position: 'relative',
                }}
              >
                <img
                  src={teacherPhoto}
                  alt="Smit Sir — Commerce Teacher"
                  className="hero-teacher-photo"
                  width="800"
                  height="1000"
                  loading="eager"
                  fetchPriority="high"
                  decoding="async"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    objectPosition: 'center 8%',
                    display: 'block',
                    transform: 'scale(1.012)',
                  }}
                />
                <div
                  aria-hidden="true"
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(180deg, transparent 58%, rgba(23,19,15,0.36) 100%)',
                    pointerEvents: 'none',
                  }}
                />
              </div>

              <div style={{ padding: '18px 19px 20px', background: 'var(--bg-white)' }}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    justifyContent: 'space-between',
                    gap: '12px',
                    marginBottom: '15px',
                  }}
                >
                  <div>
                    <div
                      style={{
                        fontFamily: 'var(--font-serif)',
                        fontSize: '1.22rem',
                        fontWeight: 800,
                        color: 'var(--ink)',
                        lineHeight: 1.1,
                      }}
                    >
                      Smit Sir
                    </div>
                    <div
                      style={{
                        fontFamily: 'var(--font-sans)',
                        fontSize: '12.5px',
                        color: 'var(--muted)',
                        marginTop: '4px',
                      }}
                    >
                      Economics · Business Studies · Entrepreneurship
                    </div>
                  </div>
                  <div
                    className="sticker"
                    style={{
                      padding: '6px 11px',
                      borderRadius: '8px',
                      background: 'rgba(242,205,92,0.38)',
                      border: '1px solid rgba(184,135,47,0.34)',
                      fontFamily: 'var(--font-sans)',
                      fontSize: '10px',
                      fontWeight: 800,
                      color: '#7A5A1E',
                      letterSpacing: '0.055em',
                      whiteSpace: 'nowrap',
                      flexShrink: 0,
                      boxShadow: '0 3px 9px rgba(30,24,18,0.08)',
                    }}
                  >
                    FREE DEMO
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '7px', flexWrap: 'wrap' }}>
                  {badges.map((b) => (
                    <div
                      key={b.text}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '5px',
                        padding: '5px 10px',
                        borderRadius: '999px',
                        background: 'var(--bg-ivory)',
                        border: '1px solid var(--border)',
                        fontFamily: 'var(--font-sans)',
                        fontSize: '10.5px',
                        fontWeight: 650,
                        color: 'var(--charcoal)',
                      }}
                    >
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
        .hero-primary-cta, .hero-secondary-cta, .hero-trust-card, .hero-floating-card {
          transition: transform .22s ease, box-shadow .22s ease, border-color .22s ease;
        }
        .hero-primary-cta:hover, .hero-secondary-cta:hover, .hero-trust-card:hover, .hero-floating-card:hover {
          transform: translateY(-3px);
        }
        .hero-trust-card:hover {
          box-shadow: 0 22px 46px rgba(16,24,40,0.10) !important;
          border-color: rgba(213,164,56,0.42) !important;
        }
        @media (max-width: 1024px) {
          .hero-main-grid { grid-template-columns: 1fr !important; gap: 48px !important; }
          .hero-teacher-card { justify-self: center !important; max-width: 460px !important; }
          .hero-inner-pad { padding-top: 54px !important; padding-bottom: 66px !important; }
        }
        @media (max-width: 760px) {
          .hero-floating-left { left: 10px !important; top: 16px !important; transform: none !important; }
          .hero-floating-right { right: 10px !important; bottom: 98px !important; transform: none !important; }
        }
        @media (max-width: 640px) {
          .hero-inner-pad { padding: 38px 16px 52px !important; }
          .hero-teacher-card { max-width: 360px !important; }
          .hero-trust-grid { grid-template-columns: repeat(2, minmax(0, 1fr)) !important; }
          .hero-main-grid h1 { font-size: clamp(2.2rem, 11vw, 2.85rem) !important; margin-top: 22px !important; }
          .hero-primary-cta, .hero-secondary-cta { width: 100% !important; }
          .hero-teacher-photo-frame { aspect-ratio: 4 / 5 !important; }
          .hero-teacher-photo { object-position: center 6% !important; }
          .hero-quote-card { display: flex !important; width: 100% !important; }
          .hero-material-pills { gap: 8px !important; }
          .hero-floating-card { display: none !important; }
        }
      `}</style>
    </section>
  );
}
