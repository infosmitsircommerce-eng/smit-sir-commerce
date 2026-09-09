import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, BookOpen, CheckCircle, Download, FileText, ListChecks, PlayCircle, Sparkles, Star, Trophy } from 'lucide-react';
import teacherPhoto from '../../assets/teacher-photo-opt.jpg';

const trust = [
  { value: '26+', label: 'Free PDFs' },
  { value: '41', label: 'Commerce Tools' },
  { value: 'CBSE + GSEB', label: 'Board Focus' },
  { value: '11 & 12', label: 'Commerce Classes' },
];

const actionCards = [
  { icon: FileText, title: 'Study Material', text: 'Notes, PDFs and chapter-wise resources.', to: '/study-material' },
  { icon: ListChecks, title: 'Chapter Quizzes', text: 'Micro, Macro and Indian Economy quizzes.', to: '/quizzes' },
  { icon: Trophy, title: 'Practice & Tests', text: 'Daily questions, quizzes and exam mode.', to: '/daily-practice' },
];

const materialPills = [
  { icon: FileText, text: 'Notes + PDFs' },
  { icon: Download, text: 'Free Material' },
  { icon: ListChecks, text: 'Chapter Quizzes' },
];

const startSteps = ['Choose your board', 'Pick class & subject', 'Open notes', 'Test your understanding'];

const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.58, delay, ease: [0.22, 1, 0.36, 1] },
});

export default function HeroSection() {
  return (
    <section
      className="home-hero"
      style={{
        background:
          'radial-gradient(circle at 78% 16%, rgba(224,167,43,0.24), transparent 30%), radial-gradient(circle at 10% 82%, rgba(143,92,16,0.12), transparent 36%), linear-gradient(135deg, #ffffff 0%, #fff8e8 50%, #f8fafc 100%)',
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
            'linear-gradient(rgba(143,92,16,0.052) 1px, transparent 1px), linear-gradient(90deg, rgba(143,92,16,0.04) 1px, transparent 1px)',
          backgroundSize: '80px 80px',
          maskImage: 'linear-gradient(180deg, rgba(0,0,0,0.76), transparent 82%)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 'auto 8% -1px 8%',
          height: '1px',
          background: 'linear-gradient(90deg, transparent, rgba(213,164,56,0.45), transparent)',
          zIndex: 1,
        }}
      />

      <div
        className="hero-inner-pad"
        style={{ maxWidth: '1280px', margin: '0 auto', padding: '72px 32px 76px', width: '100%', position: 'relative', zIndex: 2 }}
      >
        <div
          className="hero-main-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: '1.12fr 0.88fr',
            gap: '58px',
            alignItems: 'center',
          }}
        >
          <div>
            <motion.div {...fade(0.06)}>
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '9px 14px',
                  borderRadius: '999px',
                  background: 'rgba(255,255,255,0.82)',
                  border: '1px solid #EAD7A7',
                  boxShadow: '0 12px 30px rgba(166,111,23,0.12)',
                  backdropFilter: 'blur(16px)',
                  fontFamily: 'var(--font-sans)',
                  fontSize: '11px',
                  fontWeight: 850,
                  letterSpacing: '0.11em',
                  textTransform: 'uppercase',
                  color: '#966313',
                }}
              >
                <Sparkles style={{ width: '13px', height: '13px' }} />
                Smit Sir Commerce
              </span>
            </motion.div>

            <motion.h1
              {...fade(0.14)}
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: 'clamp(2.9rem, 5.5vw, 4.6rem)',
                fontWeight: 780,
                lineHeight: 1.02,
                letterSpacing: '-0.045em',
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
                  fontWeight: 850,
                  background: 'linear-gradient(135deg, #8F5C10 0%, #D5A438 55%, #F3CA69 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  filter: 'drop-shadow(0 12px 22px rgba(213,164,56,0.16))',
                }}
              >
                choose understanding.
              </em>
            </motion.h1>

            <motion.p
              {...fade(0.22)}
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: '17px',
                lineHeight: 1.78,
                color: 'var(--muted)',
                maxWidth: '630px',
                marginBottom: '18px',
              }}
            >
              Free Commerce notes, PDFs, practice, tools and chapter-wise quizzes for students who want clarity first — then marks as the natural result.
            </motion.p>

            <motion.div
              {...fade(0.28)}
              className="hero-quote-card"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                padding: '14px 17px',
                borderRadius: '20px',
                background: 'linear-gradient(135deg, rgba(255,255,255,0.88), rgba(255,248,232,0.92))',
                border: '1px solid rgba(213,164,56,0.36)',
                boxShadow: '0 18px 42px rgba(166,111,23,0.12)',
                marginBottom: '28px',
              }}
            >
              <Star style={{ width: '17px', height: '17px', color: '#A66F17', flexShrink: 0 }} />
              <span style={{ fontFamily: 'var(--font-serif)', fontSize: '1.18rem', lineHeight: 1.35, color: 'var(--ink)', fontWeight: 760 }}>
                Learning with Fun. Marks as a Result.
              </span>
            </motion.div>

            <motion.div {...fade(0.32)} className="hero-material-pills" style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '28px' }}>
              {materialPills.map(({ icon: Icon, text }) => (
                <span
                  key={text}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '7px',
                    padding: '9px 12px',
                    borderRadius: '999px',
                    background: 'rgba(255,255,255,0.76)',
                    border: '1px solid rgba(226,231,240,0.96)',
                    boxShadow: '0 10px 24px rgba(16,24,40,0.06)',
                    fontFamily: 'var(--font-sans)',
                    fontSize: '12px',
                    fontWeight: 780,
                    color: 'var(--charcoal)',
                  }}
                >
                  <Icon style={{ width: '14px', height: '14px', color: '#A66F17' }} />
                  {text}
                </span>
              ))}
            </motion.div>

            <motion.div {...fade(0.36)} style={{ marginBottom: '34px' }}>
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                <Link to="/study-material" className="btn-primary hero-primary-cta" style={{ fontSize: '15px', padding: '15px 30px', boxShadow: '0 18px 38px rgba(166,111,23,0.23)' }}>
                  Open Study Material
                  <ArrowRight style={{ width: '15px', height: '15px' }} />
                </Link>
                <Link to="/quizzes" className="btn-outline-ink hero-secondary-cta" style={{ fontSize: '15px', background: 'rgba(255,255,255,0.74)' }}>
                  <PlayCircle style={{ width: '15px', height: '15px' }} />
                  Start Chapter Quiz
                </Link>
                <Link to="/book-demo" className="btn-outline-ink hero-demo-cta" style={{ fontSize: '14px', background: 'rgba(255,255,255,0.48)', borderColor: 'rgba(23,32,51,0.10)' }}>
                  <BookOpen style={{ width: '14px', height: '14px' }} />
                  Demo later
                </Link>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '15px', fontFamily: 'var(--font-sans)', fontSize: '13px', color: 'var(--muted)' }}>
                <CheckCircle style={{ width: '15px', height: '15px', color: 'var(--green)' }} />
                Start free. No confusion. Notes first, practice next.
              </div>
            </motion.div>

            <motion.div {...fade(0.42)} className="hero-trust-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: '12px' }}>
              {trust.map((t, index) => (
                <div
                  key={t.label}
                  className="hero-trust-card"
                  style={{
                    minHeight: '94px',
                    padding: '16px 14px',
                    borderRadius: '18px',
                    background: 'linear-gradient(180deg, rgba(255,255,255,0.88), rgba(255,255,255,0.62))',
                    border: '1px solid rgba(226,231,240,0.96)',
                    boxShadow: '0 16px 36px rgba(16,24,40,0.07)',
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                >
                  <div aria-hidden="true" style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: index % 2 === 0 ? 'linear-gradient(90deg, #8F5C10, #D5A438)' : 'linear-gradient(90deg, #D5A438, #F3CA69)' }} />
                  <div style={{ fontFamily: 'var(--font-serif)', fontSize: '1.32rem', fontWeight: 820, color: 'var(--ink)', lineHeight: 1.05 }}>{t.value}</div>
                  <div style={{ fontFamily: 'var(--font-sans)', fontSize: '10px', fontWeight: 820, lineHeight: 1.35, letterSpacing: '0.055em', color: 'var(--subtle)', marginTop: '9px', textTransform: 'uppercase' }}>{t.label}</div>
                </div>
              ))}
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 28 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.75, delay: 0.18, ease: [0.22, 1, 0.36, 1] }}
            className="hero-teacher-card"
            style={{ position: 'relative', width: '100%', maxWidth: '448px', justifySelf: 'end' }}
          >
            <div aria-hidden="true" style={{ position: 'absolute', inset: '8% -8% -7% 8%', borderRadius: '36px', background: 'rgba(213,164,56,0.25)', filter: 'blur(30px)', pointerEvents: 'none' }} />
            <div style={{ position: 'relative', borderRadius: '34px', padding: '12px', background: 'linear-gradient(135deg, rgba(255,255,255,0.92), rgba(255,248,232,0.82))', border: '1px solid rgba(213,164,56,0.34)', boxShadow: '0 26px 72px rgba(16,24,40,0.16)' }}>
              <div style={{ borderRadius: '26px', overflow: 'hidden', background: '#fff', border: '1px solid rgba(255,255,255,0.85)', minHeight: '520px' }}>
                <img src={teacherPhoto} alt="Smit Thaker, Commerce teacher" loading="eager" decoding="async" style={{ width: '100%', height: '520px', objectFit: 'cover', objectPosition: 'center top', display: 'block' }} />
              </div>
              <div style={{ position: 'absolute', left: '24px', right: '24px', bottom: '24px', borderRadius: '22px', padding: '16px', background: 'rgba(23,32,51,0.86)', color: 'var(--ivory-on-ink)', backdropFilter: 'blur(16px)', border: '1px solid rgba(255,255,255,0.12)', boxShadow: '0 18px 38px rgba(16,24,40,0.2)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '44px', height: '44px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(213,164,56,0.16)', color: 'var(--gold-bright)' }}>
                    <BookOpen style={{ width: '20px', height: '20px' }} />
                  </div>
                  <div>
                    <div style={{ fontFamily: 'var(--font-serif)', fontSize: '1.12rem', fontWeight: 820, color: '#fff' }}>Smit Thaker</div>
                    <div style={{ fontSize: '12px', color: 'var(--muted-on-ink)', fontWeight: 700 }}>Commerce Teacher • Notes + Clarity</div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        <motion.div {...fade(0.5)} style={{ marginTop: '30px', display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '14px' }} className="hero-action-grid">
          {actionCards.map(({ icon: Icon, title, text, to }) => (
            <Link key={title} to={to} className="hero-action-card" style={{ display: 'flex', gap: '14px', alignItems: 'center', padding: '17px', borderRadius: '22px', background: 'rgba(255,255,255,0.80)', border: '1px solid rgba(226,231,240,0.96)', boxShadow: '0 16px 36px rgba(16,24,40,0.07)', textDecoration: 'none' }}>
              <div style={{ width: '46px', height: '46px', borderRadius: '16px', flexShrink: 0, background: 'var(--brand-soft)', color: 'var(--gold)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon style={{ width: '20px', height: '20px' }} /></div>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontFamily: 'var(--font-sans)', fontSize: '14px', fontWeight: 850, color: 'var(--ink)' }}>{title}</div>
                <p style={{ marginTop: '3px', fontSize: '12px', lineHeight: 1.45, color: 'var(--muted)' }}>{text}</p>
              </div>
              <ArrowRight style={{ width: '16px', height: '16px', color: 'var(--gold)', marginLeft: 'auto', flexShrink: 0 }} />
            </Link>
          ))}
        </motion.div>

        <motion.div {...fade(0.56)} style={{ marginTop: '16px', padding: '16px 18px', borderRadius: '22px', background: 'rgba(255,255,255,0.72)', border: '1px solid rgba(226,231,240,0.96)', display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '12px', fontWeight: 900, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#966313' }}>Start here</span>
          {startSteps.map((step, index) => (
            <span key={step} style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: 750, color: 'var(--charcoal)' }}>
              <span style={{ width: '24px', height: '24px', borderRadius: '999px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', background: index === 0 ? 'linear-gradient(135deg, #8F5C10, #D5A438)' : 'rgba(213,164,56,0.12)', color: index === 0 ? '#fff' : '#8F5C10', fontSize: '11px', fontWeight: 900 }}>{index + 1}</span>
              {step}
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
