import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, Brain, Download, FileText, MessageCircleQuestion, Search, Sparkles, Wrench } from 'lucide-react';

const quickPaths = [
  { label: 'CBSE Notes', path: '/cbse-notes' },
  { label: 'GSEB PDFs', path: '/study-material?board=GSEB' },
  { label: 'Practice', path: '/daily-practice' },
  { label: 'Tools', path: '/tools' },
];

const resourceRows = [
  { icon: FileText, title: 'Chapter-wise notes', text: 'Open board → class → subject → chapter.' },
  { icon: Download, title: 'Direct downloads', text: 'Grab PDFs without hunting across pages.' },
  { icon: Brain, title: 'Practice after reading', text: 'Revise with questions, games and tests.' },
  { icon: MessageCircleQuestion, title: 'Need guidance?', text: 'Contact Smit Sir only when help is needed.' },
];

function ResourcePanel() {
  return (
    <div className="hero-resource-panel" style={{
      position: 'relative', width: '100%', maxWidth: 470, justifySelf: 'end',
      borderRadius: 30, padding: 22,
      background: 'linear-gradient(160deg,#162033 0%,#253147 58%,#101827 100%)',
      border: '1px solid rgba(244,210,123,.25)',
      boxShadow: '0 32px 80px rgba(16,24,40,.26)',
      overflow: 'hidden',
    }}>
      <Sparkles aria-hidden="true" size={120} style={{ position: 'absolute', right: -34, top: -32, color: 'rgba(244,210,123,.12)' }} />
      <div style={{ position: 'relative' }}>
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12,
          marginBottom: 18,
        }}>
          <div>
            <div style={{ color: '#F4D27B', fontSize: 11, fontWeight: 900, letterSpacing: '.12em', textTransform: 'uppercase' }}>Resource Library</div>
            <h2 style={{ color: '#fff', fontSize: 25, lineHeight: 1.12, fontWeight: 900, margin: '7px 0 0' }}>Study faster. Search less.</h2>
          </div>
          <div style={{
            width: 52, height: 52, borderRadius: 18, display: 'grid', placeItems: 'center',
            background: 'linear-gradient(135deg,#F6D881,#C8922F)', color: '#1E1812', flexShrink: 0,
          }}>
            <BookOpen size={25} strokeWidth={2.4} />
          </div>
        </div>

        <div style={{ display: 'grid', gap: 10 }}>
          {resourceRows.map(({ icon: Icon, title, text }) => (
            <div key={title} style={{
              display: 'flex', gap: 13, alignItems: 'center', padding: '13px 14px',
              borderRadius: 18, background: 'rgba(255,255,255,.075)',
              border: '1px solid rgba(255,255,255,.10)',
              backdropFilter: 'blur(10px)',
            }}>
              <div style={{
                width: 38, height: 38, borderRadius: 14, display: 'grid', placeItems: 'center',
                background: 'rgba(244,210,123,.13)', color: '#F4D27B', flexShrink: 0,
              }}>
                <Icon size={18} strokeWidth={2.35} />
              </div>
              <div>
                <div style={{ color: '#fff', fontWeight: 850, fontSize: 14 }}>{title}</div>
                <div style={{ color: 'rgba(255,255,255,.68)', fontSize: 12, marginTop: 2 }}>{text}</div>
              </div>
            </div>
          ))}
        </div>

        <Link to="/study-material" style={{
          marginTop: 16, minHeight: 50, borderRadius: 17,
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 9,
          background: '#F4D27B', color: '#1E1812', fontWeight: 950,
          textDecoration: 'none', boxShadow: '0 16px 36px rgba(244,210,123,.24)',
        }}>
          Open free study material <ArrowRight size={16} />
        </Link>
      </div>
    </div>
  );
}

export default function HeroSection() {
  return (
    <section className="home-hero" style={{
      background: 'radial-gradient(circle at 75% 5%, rgba(244,210,123,.28), transparent 34%), linear-gradient(135deg,#fffdf7 0%,#fff7e5 45%,#f7f8fc 100%)',
      position: 'relative',
      overflow: 'hidden',
      borderBottom: '1px solid rgba(184,135,47,.14)',
    }}>
      <div aria-hidden="true" style={{
        position: 'absolute', top: '-180px', right: '10%',
        width: 470, height: 470, borderRadius: '50%',
        background: 'rgba(224,167,43,.19)', filter: 'blur(52px)', pointerEvents: 'none',
      }} />
      <div aria-hidden="true" style={{
        position: 'absolute', bottom: '-260px', left: '-6%',
        width: 560, height: 560, borderRadius: '50%',
        background: 'rgba(23,32,51,.07)', filter: 'blur(58px)', pointerEvents: 'none',
      }} />

      <div className="hero-inner-pad" style={{ maxWidth: 1280, margin: '0 auto', padding: '54px 32px 56px', width: '100%', position: 'relative' }}>
        <div className="hero-main-grid" style={{
          display: 'grid', gridTemplateColumns: '1.07fr .93fr',
          gap: 52, alignItems: 'center',
        }}>
          <div>
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '8px 13px', borderRadius: 999,
              background: 'rgba(255,255,255,.82)', border: '1px solid #EAD7A7',
              boxShadow: '0 8px 24px rgba(166,111,23,.10)',
              fontFamily: 'var(--font-sans)', fontSize: 11, fontWeight: 850,
              letterSpacing: '.1em', textTransform: 'uppercase', color: '#966313',
            }}>
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#D5A438', boxShadow: '0 0 0 5px rgba(213,164,56,.13)' }} />
              Free Commerce Resource Hub
            </span>

            <h1 style={{
              fontFamily: 'var(--font-serif)',
              fontSize: 'clamp(2.55rem,4.95vw,4.25rem)', fontWeight: 800,
              lineHeight: 1.04, letterSpacing: '-.035em', color: 'var(--ink)',
              margin: '24px 0 18px',
            }}>
              Notes chahiye?
              <br />
              <em style={{
                fontStyle: 'normal', background: 'linear-gradient(135deg,#A66F17,#E0A72B)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
              }}>Direct yahi milega.</em>
            </h1>

            <p style={{
              fontFamily: 'var(--font-sans)', fontSize: 17, lineHeight: 1.78,
              color: 'var(--muted)', maxWidth: 650, marginBottom: 22,
            }}>
              Smit Sir Commerce is now built like a clean study library: free notes, PDFs, practice, games and tools first. No unnecessary demo pressure — just open, download and study.
            </p>

            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 18 }}>
              <Link to="/study-material" className="btn-primary hero-primary-cta" style={{ fontSize: 15, padding: '13px 26px' }}>
                <FileText style={{ width: 15, height: 15 }} /> Open Study Material
              </Link>
              <button
                type="button"
                onClick={() => window.dispatchEvent(new CustomEvent('ssc-open-search'))}
                className="btn-outline-ink hero-secondary-cta"
                style={{ fontSize: 15, cursor: 'pointer' }}
              >
                <Search style={{ width: 14, height: 14 }} /> Search Chapter
              </button>
            </div>

            <div className="hero-chip-row" style={{ display: 'flex', gap: 9, flexWrap: 'wrap', marginBottom: 26 }}>
              {quickPaths.map((item) => (
                <Link key={item.label} to={item.path} style={{
                  display: 'inline-flex', alignItems: 'center', gap: 7,
                  padding: '9px 12px', borderRadius: 999, background: '#fff',
                  border: '1px solid rgba(15,23,42,.08)', color: 'var(--ink)',
                  textDecoration: 'none', fontSize: 12, fontWeight: 850,
                  boxShadow: '0 8px 22px rgba(16,24,40,.05)',
                }}>
                  {item.label} <ArrowRight size={12} style={{ color: '#A66F17' }} />
                </Link>
              ))}
            </div>

            <div className="hero-promise-strip" style={{
              display: 'grid', gridTemplateColumns: 'repeat(3,minmax(0,1fr))', gap: 10,
              maxWidth: 650,
            }}>
              {[
                ['No clutter', 'Resources first'],
                ['Free access', 'Notes + tools'],
                ['Need help?', 'Contact Smit Sir'],
              ].map(([title, text]) => (
                <div key={title} style={{
                  padding: '14px 14px', borderRadius: 16, background: 'rgba(255,255,255,.78)',
                  border: '1px solid rgba(15,23,42,.07)', boxShadow: '0 12px 30px rgba(16,24,40,.055)',
                }}>
                  <div style={{ fontWeight: 950, color: 'var(--ink)', fontSize: 14 }}>{title}</div>
                  <div style={{ color: 'var(--muted)', fontSize: 12, marginTop: 4, fontWeight: 700 }}>{text}</div>
                </div>
              ))}
            </div>
          </div>

          <ResourcePanel />
        </div>
      </div>

      <style>{`
        @media (max-width: 1024px) {
          .hero-main-grid { grid-template-columns: 1fr !important; gap: 36px !important; }
          .hero-resource-panel { justify-self: center !important; max-width: 560px !important; }
          .hero-inner-pad { padding-top: 46px !important; padding-bottom: 54px !important; }
        }
        @media (max-width: 640px) {
          .hero-inner-pad { padding: 32px 16px 42px !important; }
          .hero-main-grid h1 { font-size: clamp(2.25rem,11vw,2.9rem) !important; margin-top: 20px !important; }
          .hero-primary-cta, .hero-secondary-cta { width: 100% !important; justify-content: center !important; }
          .hero-promise-strip { grid-template-columns: 1fr !important; }
          .hero-chip-row a { flex: 1 1 calc(50% - 6px); justify-content: center; }
          .hero-resource-panel { max-width: 100% !important; padding: 18px !important; }
        }
      `}</style>
    </section>
  );
}
