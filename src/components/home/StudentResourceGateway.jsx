import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, Brain, Calculator, FileText, MessageCircleQuestion, Search, Sparkles } from 'lucide-react';

const primaryTiles = [
  {
    icon: FileText,
    label: 'Study Material',
    title: 'Download notes & PDFs',
    text: 'CBSE and GSEB resources arranged by board, class, subject and chapter.',
    to: '/study-material',
    tone: 'dark',
  },
  {
    icon: Brain,
    label: 'Practice',
    title: 'Revise with questions',
    text: 'Daily practice, chapter questions and exam-style revision without confusion.',
    to: '/daily-practice',
  },
  {
    icon: Calculator,
    label: 'Tools',
    title: 'Use free calculators',
    text: 'Commerce tools for formulas, numericals and quick concept support.',
    to: '/tools',
  },
  {
    icon: MessageCircleQuestion,
    label: 'Help',
    title: 'Need help? Contact Smit Sir',
    text: 'Only when you need guidance. No forced demo, no pressure.',
    to: '/contact',
  },
];

const boardLinks = [
  { label: 'CBSE Class 11 & 12', to: '/cbse-notes', helper: 'Notes + revision' },
  { label: 'GSEB Class 12 Eco', to: '/study-material?board=GSEB', helper: 'PDF chapters' },
  { label: 'Business Studies', to: '/cbse/class-12/business-studies-notes', helper: 'Class 12' },
  { label: 'Economics Tools', to: '/tools', helper: 'Calculators' },
];

export default function StudentResourceGateway() {
  return (
    <section className="student-gateway-wrap" style={{
      background: 'linear-gradient(180deg,#fffdf7 0%,#f7f8fc 100%)',
      padding: '34px 0 56px',
      borderTop: '1px solid rgba(184,135,47,.12)',
      borderBottom: '1px solid rgba(15,23,42,.06)',
    }}>
      <div className="page-container">
        <div className="student-gateway-head" style={{
          display: 'grid',
          gridTemplateColumns: '1fr auto',
          gap: 22,
          alignItems: 'end',
          marginBottom: 18,
        }}>
          <div>
            <span className="eyebrow">START HERE</span>
            <h2 style={{
              fontFamily: 'var(--font-serif)',
              color: 'var(--ink)',
              fontSize: 'clamp(2rem,4vw,3rem)',
              lineHeight: 1.05,
              margin: '10px 0 8px',
              letterSpacing: '-.02em',
            }}>
              Student ko jo chahiye, wahi first.
            </h2>
            <p style={{ color: 'var(--muted)', maxWidth: 700, lineHeight: 1.7, fontSize: 15 }}>
              No heavy advertisement. Open the right section, pick your chapter, download the resource, and study. Help is available only when you actually need it.
            </p>
          </div>
          <button
            type="button"
            onClick={() => window.dispatchEvent(new CustomEvent('ssc-open-search'))}
            className="student-search-button"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 10,
              minHeight: 48, padding: '0 18px', borderRadius: 999,
              background: '#fff', border: '1px solid #E8D7AE', color: 'var(--ink)',
              boxShadow: '0 12px 28px rgba(16,24,40,.07)', fontWeight: 850,
            }}
          >
            <Search size={17} /> Search site
          </button>
        </div>

        <div className="student-gateway-grid" style={{
          display: 'grid', gridTemplateColumns: 'repeat(4,minmax(0,1fr))', gap: 14,
        }}>
          {primaryTiles.map((tile) => {
            const Icon = tile.icon;
            const dark = tile.tone === 'dark';
            return (
              <Link
                key={tile.title}
                to={tile.to}
                className="student-gateway-tile"
                style={{
                  display: 'flex', flexDirection: 'column', minHeight: 235,
                  borderRadius: 24, padding: 20, textDecoration: 'none', position: 'relative', overflow: 'hidden',
                  background: dark ? 'linear-gradient(145deg,#151D2D,#263247)' : '#ffffff',
                  border: dark ? '1px solid rgba(232,201,120,.22)' : '1px solid rgba(15,23,42,.08)',
                  boxShadow: dark ? '0 24px 55px rgba(16,24,40,.18)' : '0 18px 42px rgba(16,24,40,.07)',
                  color: dark ? '#fff' : 'var(--ink)',
                  transition: 'transform .22s ease, box-shadow .22s ease',
                }}
              >
                {dark && <Sparkles aria-hidden="true" size={86} style={{ position: 'absolute', right: -22, top: -18, color: 'rgba(232,201,120,.13)' }} />}
                <div style={{
                  width: 50, height: 50, borderRadius: 18, display: 'grid', placeItems: 'center', marginBottom: 18,
                  background: dark ? 'linear-gradient(135deg,#F4D27B,#C9922E)' : '#fff8e7',
                  color: dark ? '#1E1812' : '#9B650E',
                  border: dark ? 'none' : '1px solid #F0E2BF',
                }}>
                  <Icon size={23} strokeWidth={2.35} />
                </div>
                <div style={{
                  fontSize: 11, fontWeight: 900, letterSpacing: '.1em', textTransform: 'uppercase',
                  color: dark ? '#F4D27B' : '#A66F17', marginBottom: 9,
                }}>{tile.label}</div>
                <h3 style={{ fontSize: 20, lineHeight: 1.16, fontWeight: 900, margin: 0, color: dark ? '#fff' : 'var(--ink)' }}>{tile.title}</h3>
                <p style={{ fontSize: 13, lineHeight: 1.65, color: dark ? 'rgba(255,255,255,.75)' : 'var(--muted)', margin: '12px 0 18px' }}>{tile.text}</p>
                <span style={{
                  marginTop: 'auto', display: 'inline-flex', alignItems: 'center', gap: 8,
                  fontSize: 13, fontWeight: 900, color: dark ? '#F4D27B' : '#A66F17',
                }}>
                  Open now <ArrowRight size={15} />
                </span>
              </Link>
            );
          })}
        </div>

        <div className="student-board-strip" style={{
          marginTop: 16,
          display: 'grid',
          gridTemplateColumns: 'repeat(4,minmax(0,1fr))',
          gap: 10,
        }}>
          {boardLinks.map((link) => (
            <Link key={link.label} to={link.to} style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12,
              padding: '14px 15px', borderRadius: 18, background: '#fff',
              border: '1px solid rgba(15,23,42,.08)', textDecoration: 'none',
              boxShadow: '0 10px 26px rgba(16,24,40,.045)',
            }}>
              <span>
                <strong style={{ display: 'block', color: 'var(--ink)', fontSize: 13 }}>{link.label}</strong>
                <small style={{ display: 'block', color: 'var(--muted)', marginTop: 3, fontWeight: 700 }}>{link.helper}</small>
              </span>
              <BookOpen size={17} style={{ color: '#A66F17', flexShrink: 0 }} />
            </Link>
          ))}
        </div>
      </div>

      <style>{`
        .student-gateway-tile:hover { transform: translateY(-4px); box-shadow: 0 26px 60px rgba(16,24,40,.12) !important; }
        @media (max-width: 1024px) {
          .student-gateway-grid { grid-template-columns: repeat(2,minmax(0,1fr)) !important; }
          .student-board-strip { grid-template-columns: repeat(2,minmax(0,1fr)) !important; }
        }
        @media (max-width: 640px) {
          .student-gateway-wrap { padding: 24px 0 38px !important; }
          .student-gateway-head { grid-template-columns: 1fr !important; align-items: start !important; }
          .student-search-button { width: 100%; justify-content: center; }
          .student-gateway-grid, .student-board-strip { grid-template-columns: 1fr !important; }
          .student-gateway-tile { min-height: 190px !important; }
        }
      `}</style>
    </section>
  );
}
