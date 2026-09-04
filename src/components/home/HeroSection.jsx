import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, CheckCircle, Sparkles, GraduationCap, FileText, University } from 'lucide-react';

const trust = [
  { value: '26', label: 'Free PDFs Published' },
  { value: '41', label: 'Commerce Tools' },
  { value: 'School → College', label: 'Growing Commerce Hub' },
  { value: 'NET + GSET', label: 'Exam Expansion' },
];

function indiaDate() {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Kolkata',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(new Date());
  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  return `${values.year}-${values.month}-${values.day}`;
}

function LearningCard() {
  const items = [
    [FileText, 'School Commerce resources', 'Class 11 & 12 remain the strongest library'],
    [University, 'College Commerce', 'B.Com + M.Com semester roadmaps'],
    [GraduationCap, 'Competitive Commerce', 'UGC NET + GSET expansion'],
  ];

  return (
    <div className="hero-learning-card" style={{
      position: 'relative', width: '100%', maxWidth: '430px', justifySelf: 'end',
      borderRadius: '26px', padding: '26px',
      background: 'linear-gradient(150deg,#fffdf7 0%,#ffffff 68%)',
      border: '1px solid rgba(184,135,47,.22)',
      boxShadow: '0 28px 70px rgba(16,24,40,.12)',
    }}>
      <div style={{
        width: 58, height: 58, borderRadius: 18, display: 'grid', placeItems: 'center',
        background: 'linear-gradient(135deg,#F7E7B7,#E4B853)', color: '#5B3B08',
        boxShadow: '0 10px 26px rgba(184,135,47,.18)', marginBottom: 20,
      }}>
        <GraduationCap size={29} />
      </div>
      <span className="eyebrow">Smit Sir Commerce</span>
      <h2 style={{
        fontFamily: 'var(--font-serif)', fontSize: '2rem', color: 'var(--ink)',
        margin: '12px 0 8px', lineHeight: 1.12,
      }}>One place for the Commerce journey.</h2>
      <p style={{ color: 'var(--muted)', lineHeight: 1.7, marginBottom: 20 }}>
        School, college and competitive-exam Commerce resources in one growing platform — with specialist Class 11 & 12 teaching by Smit Sir.
      </p>
      <div style={{ display: 'grid', gap: 10 }}>
        {items.map(([Icon, title, text]) => (
          <div key={title} style={{
            display: 'flex', gap: 12, alignItems: 'center', padding: 13,
            borderRadius: 14, background: '#fffaf0', border: '1px solid #EEE3CA',
          }}>
            <Icon size={18} style={{ color: '#A66F17', flexShrink: 0 }} />
            <div>
              <div style={{ fontWeight: 750, color: 'var(--ink)', fontSize: 13 }}>{title}</div>
              <div style={{ color: 'var(--muted)', fontSize: 11, marginTop: 2 }}>{text}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function JanmashtamiVisual() {
  return (
    <div
      className="hero-janmashtami-card"
      style={{ position: 'relative', width: '100%', maxWidth: '520px', justifySelf: 'end' }}
    >
      <div aria-hidden="true" style={{
        position: 'absolute', inset: '8% -6% -9% 8%', borderRadius: 34,
        background: 'rgba(213,164,56,.22)', filter: 'blur(34px)', pointerEvents: 'none',
      }} />
      <div style={{
        position: 'relative', borderRadius: 28, overflow: 'hidden',
        background: '#f7efe4', border: '1px solid rgba(184,135,47,.28)',
        boxShadow: '0 28px 72px rgba(79,55,20,.18)',
      }}>
        <img
          src="/janmashtami-krishna.webp"
          alt="Baby Krishna with calf and lotus flowers for Janmashtami"
          width="400"
          height="340"
          loading="eager"
          fetchPriority="high"
          decoding="async"
          style={{ width: '100%', height: 'auto', display: 'block' }}
        />
        <div style={{
          padding: '13px 18px 15px', textAlign: 'center',
          background: 'linear-gradient(180deg,#fffdf8,#fff8e7)',
          borderTop: '1px solid rgba(184,135,47,.16)',
        }}>
          <div style={{
            fontFamily: 'var(--font-serif)', fontWeight: 700, color: '#6F4A12',
            fontSize: '1.08rem',
          }}>Janmashtami wishes from Smit Sir Commerce</div>
          <div style={{ fontSize: 11, color: '#8B7352', marginTop: 4 }}>
            Learning with wisdom • Growing with curiosity
          </div>
        </div>
      </div>
    </div>
  );
}

export default function HeroSection() {
  const festival = indiaDate() === '2026-09-04';

  return (
    <section className="home-hero" style={{
      background: festival
        ? 'linear-gradient(135deg,#fffdf8 0%,#fff4d9 50%,#f8fafc 100%)'
        : 'linear-gradient(135deg,#ffffff 0%,#fff8e8 52%,#f8fafc 100%)',
      position: 'relative',
      overflow: 'hidden',
    }}>
      <div aria-hidden="true" style={{
        position: 'absolute', top: '-170px', right: '8%',
        width: 440, height: 440, borderRadius: '50%',
        background: festival ? 'rgba(246,184,71,.26)' : 'rgba(224,167,43,.22)',
        filter: 'blur(48px)', pointerEvents: 'none',
      }} />
      <div aria-hidden="true" style={{
        position: 'absolute', bottom: '-220px', left: '4%',
        width: 520, height: 520, borderRadius: '50%',
        background: 'rgba(183,121,31,.11)', filter: 'blur(58px)', pointerEvents: 'none',
      }} />

      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '58px 32px 64px', width: '100%', position: 'relative' }} className="hero-inner-pad">
        <div className="hero-main-grid" style={{
          display: 'grid', gridTemplateColumns: '1.12fr .88fr',
          gap: 56, alignItems: 'center',
        }}>
          <div>
            <div>
              <span style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                padding: '8px 13px', borderRadius: 999,
                background: 'rgba(255,255,255,.76)', border: '1px solid #EAD7A7',
                boxShadow: '0 8px 24px rgba(166,111,23,.10)',
                fontFamily: 'var(--font-sans)', fontSize: 11, fontWeight: 750,
                letterSpacing: '.09em', textTransform: 'uppercase', color: '#966313',
              }}>
                {festival ? <Sparkles size={13} /> : <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#D5A438' }} />}
                {festival ? 'Janmashtami 2026' : 'School • College • Competitive Commerce'}
              </span>
            </div>

            <h1 style={{
              fontFamily: 'var(--font-serif)',
              fontSize: 'clamp(2.55rem,4.8vw,4rem)', fontWeight: 700,
              lineHeight: 1.08, letterSpacing: '-.025em', color: 'var(--ink)',
              margin: '26px 0 20px',
            }}>
              {festival ? (
                <>
                  Happy Janmashtami
                  <br />
                  <em style={{
                    fontStyle: 'normal', background: 'linear-gradient(135deg,#8D5C10,#DDA72E)',
                    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                  }}>to every learner. 🦚</em>
                </>
              ) : (
                <>
                  Commerce, from school
                  <br />
                  <em style={{
                    fontStyle: 'normal', background: 'linear-gradient(135deg,#A66F17,#E0A72B)',
                    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                  }}>to college & beyond.</em>
                </>
              )}
            </h1>

            <p style={{
              fontFamily: 'var(--font-sans)', fontSize: 16, lineHeight: 1.78,
              color: 'var(--muted)', maxWidth: 590, marginBottom: 18,
            }}>
              {festival
                ? 'May Shri Krishna bless you with wisdom, peace, curiosity and the courage to keep learning. Wishing students and families a joyful and meaningful Janmashtami.'
                : 'A growing Commerce learning platform for Class 11 & 12, B.Com, M.Com, UGC NET and GSET — with notes, practice, tools and exam resources organised around the learner’s stage.'}
            </p>

            <p style={{
              fontFamily: 'var(--font-serif)', fontSize: '1.15rem', lineHeight: 1.5,
              color: 'var(--ink)', fontWeight: 650, maxWidth: 580, marginBottom: 30,
            }}>
              {festival ? 'A small wish from Smit Sir Commerce — learning should carry both knowledge and joy.' : 'Specialist Class 11 & 12 teaching. Broader Commerce resources for everyone.'}
            </p>

            <div style={{ marginBottom: 36 }}>
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                <Link to="/commerce-learning" className="btn-primary hero-primary-cta" style={{ fontSize: 15, padding: '13px 28px' }}>
                  {festival ? 'Explore Commerce Learning Hub' : 'Explore All Commerce'}
                  <ArrowRight style={{ width: 15, height: 15 }} />
                </Link>
                <Link to="/tools" className="btn-outline-ink hero-secondary-cta" style={{ fontSize: 15 }}>
                  <BookOpen style={{ width: 14, height: 14 }} />
                  Free Learning Tools
                </Link>
              </div>
              <div style={{
                display: 'flex', alignItems: 'center', gap: 8, marginTop: 14,
                fontFamily: 'var(--font-sans)', fontSize: 13, color: 'var(--muted)',
              }}>
                <CheckCircle style={{ width: 15, height: 15, color: 'var(--green)' }} />
                {festival ? 'Celebrate the day. Keep learning at your own pace.' : 'Understand first. Practise confidently. Let better marks follow.'}
              </div>
            </div>

            <div className="hero-trust-grid" style={{
              display: 'grid', gridTemplateColumns: 'repeat(4,minmax(0,1fr))', gap: 10,
            }}>
              {trust.map((t) => (
                <div key={t.label} style={{
                  minHeight: 86, padding: '15px 13px', borderRadius: 14,
                  background: 'rgba(255,255,255,.76)', border: '1px solid #E2E7F0',
                  boxShadow: '0 12px 30px rgba(16,24,40,.06)',
                }}>
                  <div style={{ fontFamily: 'var(--font-serif)', fontSize: '1.45rem', fontWeight: 700, color: 'var(--ink)', lineHeight: 1 }}>{t.value}</div>
                  <div style={{ fontFamily: 'var(--font-sans)', fontSize: 10, fontWeight: 700, lineHeight: 1.35, letterSpacing: '.045em', color: 'var(--subtle)', marginTop: 8, textTransform: 'uppercase' }}>{t.label}</div>
                </div>
              ))}
            </div>
          </div>

          {festival ? <JanmashtamiVisual /> : <LearningCard />}
        </div>
      </div>

      <style>{`
        @media (max-width: 1024px) {
          .hero-main-grid { grid-template-columns: 1fr !important; gap: 40px !important; }
          .hero-janmashtami-card, .hero-learning-card { justify-self: center !important; max-width: 520px !important; }
          .hero-inner-pad { padding-top: 48px !important; padding-bottom: 60px !important; }
        }
        @media (max-width: 640px) {
          .hero-inner-pad { padding: 34px 16px 46px !important; }
          .hero-trust-grid { grid-template-columns: repeat(2,minmax(0,1fr)) !important; }
          .hero-main-grid h1 { font-size: clamp(2.15rem,11vw,2.75rem) !important; margin-top: 22px !important; }
          .hero-primary-cta, .hero-secondary-cta { width: 100% !important; justify-content: center !important; }
          .hero-janmashtami-card, .hero-learning-card { max-width: 100% !important; }
        }
      `}</style>
    </section>
  );
}
