import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, BookOpen, FileText, FlaskConical, TrendingUp, Briefcase, Lightbulb, Activity } from 'lucide-react';

const SUBJECTS = {
  12: [
    {
      id: 'acc-12',
      code: 'ACC',
      name: 'Accountancy',
      icon: TrendingUp,
      color: '#2563eb',
      bg: '#EFF6FF',
      border: '#BFDBFE',
      lectures: 67,
      pdfs: 42,
      chapters: 11,
      tags: ['Partnership Accounts', 'Share Capital', 'Cash Flow', 'Ratios'],
      desc: 'Partnership firms, share capital, financial statements, analysis and cash flow.',
    },
    {
      id: 'bst-12',
      code: 'BST',
      name: 'Business Studies',
      icon: Briefcase,
      color: '#7c3aed',
      bg: '#F5F3FF',
      border: '#DDD6FE',
      lectures: 55,
      pdfs: 34,
      chapters: 12,
      tags: ['Management', 'Marketing', 'Finance', 'Consumer Protection'],
      desc: 'Management functions, business finance, marketing, and consumer protection chapters.',
    },
    {
      id: 'eco-12',
      code: 'ECO',
      name: 'Economics',
      icon: FlaskConical,
      color: '#059669',
      bg: '#ECFDF5',
      border: '#A7F3D0',
      lectures: 48,
      pdfs: 33,
      chapters: 11,
      tags: ['Macroeconomics', 'National Income', 'Indian Economy', 'LPG'],
      desc: 'Macroeconomics, national income, money & banking, Indian economic development.',
    },
  ],
  11: [
    {
      id: 'acc-11',
      code: 'ACC',
      name: 'Accountancy',
      icon: TrendingUp,
      color: '#2563eb',
      bg: '#EFF6FF',
      border: '#BFDBFE',
      lectures: 52,
      pdfs: 33,
      chapters: 10,
      tags: ['Journal & Ledger', 'Trial Balance', 'Final Accounts', 'BRS'],
      desc: 'Recording transactions, bank reconciliation, depreciation, and financial statements.',
    },
    {
      id: 'bst-11',
      code: 'BST',
      name: 'Business Studies',
      icon: Briefcase,
      color: '#7c3aed',
      bg: '#F5F3FF',
      border: '#DDD6FE',
      lectures: 41,
      pdfs: 29,
      chapters: 10,
      tags: ['Forms of Business', 'Business Services', 'Trade', 'Finance'],
      desc: 'Business organisation, services, finance sources, trade and entrepreneurship basics.',
    },
    {
      id: 'eco-11',
      code: 'ECO',
      name: 'Economics',
      icon: FlaskConical,
      color: '#059669',
      bg: '#ECFDF5',
      border: '#A7F3D0',
      lectures: 43,
      pdfs: 29,
      chapters: 9,
      tags: ['Statistics', 'Indian Economy', 'Demand & Supply', 'Market'],
      desc: 'Statistics for economics, Indian economic development, microeconomics fundamentals.',
    },
    {
      id: 'ent-11',
      code: 'ENT',
      name: 'Entrepreneurship',
      icon: Lightbulb,
      color: '#d97706',
      bg: '#FFFBEB',
      border: '#FDE68A',
      lectures: 24,
      pdfs: 14,
      chapters: 7,
      tags: ['Entrepreneur', 'Business Plan', 'Market Study', 'Finance'],
      desc: 'Entrepreneurial journey, business arithmetic, market analysis, and resource mobilisation.',
    },
    {
      id: 'pe-11',
      code: 'PE',
      name: 'Physical Education',
      icon: Activity,
      color: '#dc2626',
      bg: '#FEF2F2',
      border: '#FECACA',
      lectures: 33,
      pdfs: 20,
      chapters: 10,
      tags: ['Olympic Movement', 'Sports Science', 'Fitness', 'Doping'],
      desc: 'Physical fitness, sports science, Olympic movement, biomechanics and sports psychology.',
    },
  ],
};

function SubjectCard({ subject, index }) {
  const Icon = subject.icon;
  return (
    <motion.div
      key={subject.id}
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      style={{
        background: '#fff',
        border: '1px solid var(--border)',
        borderRadius: '20px',
        padding: '28px',
        display: 'flex',
        flexDirection: 'column',
        transition: 'all 0.25s ease',
        cursor: 'default',
        boxShadow: '0 2px 12px rgba(43,33,24,0.05)',
        overflow: 'hidden',
        position: 'relative',
      }}
      whileHover={{
        y: -6,
        boxShadow: `0 20px 50px rgba(43,33,24,0.12), 0 0 0 1px ${subject.border}`,
      }}
    >
      {/* Top color accent bar */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: `linear-gradient(90deg, ${subject.color}, ${subject.color}88)` }} />
      {/* Subject code + icon */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '14px' }}>
        <div style={{
          width: '44px', height: '44px', borderRadius: '10px',
          background: subject.bg, border: `1px solid ${subject.border}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
        }}>
          <Icon style={{ width: '20px', height: '20px', color: subject.color }} />
        </div>
        <span style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: '10px', fontWeight: 800,
          letterSpacing: '0.14em',
          color: subject.color,
          background: subject.bg,
          border: `1px solid ${subject.border}`,
          padding: '2px 8px', borderRadius: '4px',
        }}>{subject.code}</span>
      </div>

      {/* Name */}
      <div style={{
        fontFamily: "'Playfair Display', serif",
        fontSize: '1.1rem', fontWeight: 700,
        color: 'var(--ink)', marginBottom: '6px', lineHeight: 1.2,
      }}>{subject.name}</div>

      {/* Description */}
      <p style={{
        fontFamily: "'DM Sans', sans-serif",
        fontSize: '12.5px', color: 'var(--muted)',
        lineHeight: 1.6, marginBottom: '14px', flex: 1,
      }}>{subject.desc}</p>

      {/* Stats row */}
      <div style={{
        display: 'flex', gap: '12px',
        padding: '10px 0',
        borderTop: '1px solid var(--border-soft)',
        borderBottom: '1px solid var(--border-soft)',
        marginBottom: '14px',
      }}>
        {[
          { icon: BookOpen, val: subject.lectures, label: 'Lectures' },
          { icon: FileText, val: subject.pdfs,     label: 'PDFs'     },
          { icon: BookOpen, val: subject.chapters,  label: 'Chapters' },
        ].map(s => {
          const SIcon = s.icon;
          return (
            <div key={s.label} style={{ flex: 1, textAlign: 'center' }}>
              <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '15px', fontWeight: 700, color: 'var(--ink)', lineHeight: 1 }}>{s.val}</div>
              <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '10px', color: 'var(--subtle)', marginTop: '2px' }}>{s.label}</div>
            </div>
          );
        })}
      </div>

      {/* Badges */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', marginBottom: '16px' }}>
        {['Board Focused', 'PDF Notes', 'Tests Included'].map(b => (
          <span key={b} style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: '10px', fontWeight: 600,
            padding: '2px 8px', borderRadius: '4px',
            background: 'var(--bg-ivory)',
            border: '1px solid var(--border)',
            color: 'var(--muted)',
          }}>{b}</span>
        ))}
      </div>

      {/* Topic chips */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginBottom: '16px' }}>
        {subject.tags.map(t => (
          <span key={t} style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: '10.5px',
            padding: '2px 8px', borderRadius: '4px',
            background: subject.bg, border: `1px solid ${subject.border}`,
            color: subject.color, fontWeight: 500,
          }}>{t}</span>
        ))}
      </div>

      {/* CTAs */}
      <div style={{ display: 'flex', gap: '8px' }}>
        <Link to="/courses" style={{
          flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px',
          padding: '9px 12px', borderRadius: '8px',
          background: 'var(--bg-ivory)', border: '1px solid var(--border)',
          fontFamily: "'DM Sans', sans-serif", fontSize: '12px', fontWeight: 600,
          color: 'var(--charcoal)', textDecoration: 'none',
          transition: 'all 0.18s',
        }}
          onMouseEnter={e => { e.currentTarget.style.background = subject.bg; e.currentTarget.style.color = subject.color; e.currentTarget.style.borderColor = subject.border; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'var(--bg-ivory)'; e.currentTarget.style.color = 'var(--charcoal)'; e.currentTarget.style.borderColor = 'var(--border)'; }}
        >
          View Subject
        </Link>
        <Link to="/study-material" style={{
          flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px',
          padding: '9px 12px', borderRadius: '8px',
          background: subject.color,
          fontFamily: "'DM Sans', sans-serif", fontSize: '12px', fontWeight: 600,
          color: '#fff', textDecoration: 'none',
          transition: 'opacity 0.18s',
        }}
          onMouseEnter={e => e.currentTarget.style.opacity = '0.88'}
          onMouseLeave={e => e.currentTarget.style.opacity = '1'}
        >
          <FileText style={{ width: '11px', height: '11px' }} />
          Explore PDFs
        </Link>
      </div>
    </motion.div>
  );
}

export default function CoursesPreview() {
  const [activeClass, setActiveClass] = useState(12);

  const subjects = SUBJECTS[activeClass];
  const gridCols = subjects.length <= 3 ? 3 : subjects.length === 4 ? 4 : 3;

  return (
    <section style={{ background: 'var(--bg-white)', padding: '80px 0', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 32px' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '56px' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            background: 'var(--gold-bg)', border: '1px solid rgba(184,135,47,0.22)',
            borderRadius: '999px', padding: '5px 16px', marginBottom: '20px',
          }}>
            <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: 'var(--gold)' }} />
            <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '11px', fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase', color: 'var(--gold)' }}>CBSE Commerce Curriculum</span>
          </div>
          <h2 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: 'clamp(2rem, 3.5vw, 2.8rem)',
            fontWeight: 700, color: 'var(--ink)',
            letterSpacing: '-0.025em', lineHeight: 1.12,
            marginBottom: '14px',
          }}>
            Choose your <em className="squiggle" style={{ fontFamily: 'var(--font-accent)', fontStyle: 'italic', fontWeight: 600, fontSize: '1.08em', color: 'var(--ink)' }}>commerce track.</em>
          </h2>
          <p style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: '15px', color: 'var(--muted)',
            maxWidth: '520px', margin: '0 auto 32px',
            lineHeight: 1.7,
          }}>
            Explore complete Class 11 and Class 12 Commerce subjects — lectures, premium PDFs, chapter tests, and board-focused preparation.
          </p>

          {/* Segmented tab switcher */}
          <div style={{
            display: 'inline-flex',
            background: 'var(--bg-soft)',
            border: '1px solid var(--border)',
            borderRadius: '12px',
            padding: '4px',
            gap: '2px',
            position: 'relative',
          }}>
            {[12, 11].map(cls => (
              <button
                key={cls}
                onClick={() => setActiveClass(cls)}
                style={{
                  position: 'relative',
                  padding: '9px 28px',
                  borderRadius: '9px',
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: '14px', fontWeight: 600,
                  color: activeClass === cls ? 'var(--ink)' : 'var(--subtle)',
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'color 0.18s',
                  zIndex: 1,
                }}
              >
                {activeClass === cls && (
                  <motion.div
                    layoutId="tab-bg"
                    style={{
                      position: 'absolute', inset: 0,
                      background: '#fff',
                      borderRadius: '9px',
                      boxShadow: 'var(--shadow-sm)',
                      border: '1px solid var(--border)',
                    }}
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
                <span style={{ position: 'relative', zIndex: 1 }}>Class {cls}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Subject cards grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeClass}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            style={{
              display: 'grid',
              gridTemplateColumns: `repeat(${Math.min(gridCols, 3)}, 1fr)`,
              gap: '18px',
              marginBottom: '32px',
            }}
            className="courses-subject-grid"
          >
            {subjects.map((s, i) => (
              <SubjectCard key={s.id} subject={s} index={i} />
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Bottom CTA */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', flexWrap: 'wrap' }}>
          <Link to="/courses" style={{
            display: 'inline-flex', alignItems: 'center', gap: '7px',
            padding: '12px 28px', borderRadius: '10px',
            background: 'var(--bg-ivory)',
            border: '1.5px solid var(--ink)',
            fontFamily: "'DM Sans', sans-serif",
            fontSize: '14px', fontWeight: 600,
            color: 'var(--ink)', textDecoration: 'none',
            transition: 'all 0.18s',
          }}
            onMouseEnter={e => { e.currentTarget.style.background = 'var(--ink)'; e.currentTarget.style.color = '#fff'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'var(--bg-ivory)'; e.currentTarget.style.color = 'var(--ink)'; }}
          >
            Explore All Courses
            <ArrowRight style={{ width: '14px', height: '14px' }} />
          </Link>
          <Link to="/study-material" className="btn-primary">
            View Study Material
            <FileText style={{ width: '14px', height: '14px' }} />
          </Link>
        </div>
      </div>

      <style>{`
        @media (max-width: 1100px) { .courses-subject-grid { grid-template-columns: repeat(2, 1fr) !important; } }
        @media (max-width: 600px)  { .courses-subject-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </section>
  );
}
