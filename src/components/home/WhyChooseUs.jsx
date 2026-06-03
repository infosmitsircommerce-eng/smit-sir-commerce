import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Lightbulb, Target, FileText, ClipboardList, MessageCircle, Wifi } from 'lucide-react';

const reasons = [
  {
    icon: Lightbulb,
    title: 'Concept-First Teaching',
    desc: 'No rote learning. Every chapter is explained until you genuinely understand it — not just memorise for the exam.',
    color: '#d97706',
    bg: '#FFFBEB',
    border: '#FDE68A',
  },
  {
    icon: Target,
    title: 'CBSE Board-Focused Preparation',
    desc: 'Every lecture, note, and test is built around the CBSE NCERT syllabus — exactly what appears in board exams.',
    color: '#2563eb',
    bg: '#EFF6FF',
    border: '#BFDBFE',
  },
  {
    icon: FileText,
    title: 'Chapter-wise Premium Notes',
    desc: 'Detailed PDF notes, mind maps, and revision sheets for Accountancy, Economics, Business Studies, and Entrepreneurship.',
    color: '#059669',
    bg: '#ECFDF5',
    border: '#A7F3D0',
  },
  {
    icon: ClipboardList,
    title: 'Regular Tests & Analysis',
    desc: 'Chapter tests, unit tests, full pre-board papers — with performance analysis after every test so you improve faster.',
    color: '#7c3aed',
    bg: '#F5F3FF',
    border: '#DDD6FE',
  },
  {
    icon: MessageCircle,
    title: 'Doubt Support on WhatsApp',
    desc: 'Ask doubts during class, after class, or on WhatsApp. Our AI Doubt Solver is available 24/7 for quick answers.',
    color: '#16a34a',
    bg: '#F0FDF4',
    border: '#BBF7D0',
  },
  {
    icon: Wifi,
    title: 'Online + Offline Batches',
    desc: 'Flexible batches for students in Mehsana and across India — the same quality teaching, in your preferred format.',
    color: '#0891b2',
    bg: '#ECFEFF',
    border: '#A5F3FC',
  },
];

export default function WhyChooseUs() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '60px' });

  return (
    <section ref={ref} style={{ background: 'var(--bg-white)', padding: '80px 0', borderBottom: '1px solid var(--border)' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 32px' }}>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          style={{ marginBottom: '60px' }}
        >
          <span className="section-subheading">Why Students Choose Us</span>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: '20px' }}>
            <h2 style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: 'clamp(1.875rem, 3.5vw, 2.6rem)',
              fontWeight: 700, color: 'var(--ink)',
              letterSpacing: '-0.025em', lineHeight: 1.12,
              maxWidth: '560px',
            }}>
              Everything you need to{' '}
              <em style={{
                fontStyle: 'italic',
                background: 'linear-gradient(135deg, var(--gold), var(--gold-soft))',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}>score better.</em>
            </h2>
            <p style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: '15px', color: 'var(--muted)',
              maxWidth: '360px', lineHeight: 1.7,
            }}>
              CBSE Commerce coaching built around concept clarity, regular practice, and board results.
            </p>
          </div>
        </motion.div>

        {/* Cards grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '20px',
        }} className="why-grid">
          {reasons.map((r, i) => {
            const Icon = r.icon;
            return (
              <motion.div
                key={r.title}
                initial={{ opacity: 0, y: 24 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: i * 0.1, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                style={{
                  background: 'var(--bg-white)',
                  border: '1px solid var(--border)',
                  borderLeft: `4px solid ${r.color}`,
                  borderRadius: '16px',
                  padding: '32px 28px',
                  transition: 'all 0.25s ease',
                  position: 'relative',
                  overflow: 'hidden',
                  boxShadow: '0 2px 8px rgba(43,33,24,0.04)',
                }}
                whileHover={{
                  y: -6,
                  boxShadow: `0 16px 40px rgba(43,33,24,0.10), 0 0 0 1px ${r.border}`,
                  borderLeftColor: r.color,
                }}
              >
                {/* Background glow */}
                <div style={{
                  position: 'absolute', top: 0, right: 0,
                  width: '120px', height: '120px',
                  background: `radial-gradient(circle, ${r.bg} 0%, transparent 70%)`,
                  pointerEvents: 'none',
                }} />

                {/* Number */}
                <div style={{
                  position: 'absolute', top: '16px', right: '20px',
                  fontFamily: "'Playfair Display', serif",
                  fontSize: '2.4rem', fontWeight: 700,
                  color: r.border,
                  lineHeight: 1,
                  userSelect: 'none',
                  opacity: 0.6,
                }}>
                  0{i + 1}
                </div>

                {/* Icon */}
                <div style={{
                  width: '52px', height: '52px',
                  borderRadius: '14px',
                  background: r.bg,
                  border: `1.5px solid ${r.border}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  marginBottom: '20px',
                  boxShadow: `0 4px 14px ${r.color}20`,
                }}>
                  <Icon style={{ width: '24px', height: '24px', color: r.color }} />
                </div>

                <h3 style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: '16px', fontWeight: 700,
                  color: 'var(--ink)', marginBottom: '10px',
                  lineHeight: 1.3, letterSpacing: '-0.01em',
                }}>
                  {r.title}
                </h3>
                <p style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: '13.5px', color: 'var(--muted)',
                  lineHeight: 1.72, margin: 0,
                }}>
                  {r.desc}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>

      <style>{`
        @media (max-width: 1024px) { .why-grid { grid-template-columns: repeat(2, 1fr) !important; } }
        @media (max-width: 640px)  { .why-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </section>
  );
}
