import { motion, useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import { CheckCircle, Star, X, MessageCircle, Shield } from 'lucide-react';

const plans = [
  {
    class: 'Class 11',
    label: 'Class 11 Study Pack',
    price: 399,
    original: 799,
    badge: null,
    featured: false,
    features: [
      'All Premium PDF Notes',
      'Detailed Chapter-wise PPTs',
      'Extra Practice Questions',
      'Previous Year Questions (PYQ)',
      'Mind Maps & Revision Sheets',
      'WhatsApp Group Access',
      'Student Community Access',
      'Lifetime Access',
    ],
    subjects: ['Accountancy', 'Business Studies', 'Economics', 'Entrepreneurship'],
    cta: 'Get Class 11 Pack',
    whatsapp: 'Hello Smit Sir, I want to buy the Class 11 Study Pack at ₹399. Please share payment details.',
  },
  {
    class: 'Class 12',
    label: 'Class 12 Study Pack',
    price: 499,
    original: 999,
    badge: 'Most Popular',
    featured: true,
    features: [
      'All Premium PDF Notes',
      'Detailed Chapter-wise PPTs',
      'Extra Practice Questions',
      'Previous Year Questions (PYQ)',
      'Mind Maps & Revision Sheets',
      'Sample Papers (Board Pattern)',
      'WhatsApp Group Access',
      'Student Community Access',
      'Board Exam Strategy Guide',
      'Lifetime Access',
    ],
    subjects: ['Accountancy', 'Business Studies', 'Economics', 'Entrepreneurship'],
    cta: 'Get Class 12 Pack',
    whatsapp: 'Hello Smit Sir, I want to buy the Class 12 Study Pack at ₹499. Please share payment details.',
  },
];

function PayModal({ plan, onClose }) {
  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 50,
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px',
      background: 'rgba(30,41,59,0.4)', backdropFilter: 'blur(8px)',
    }} onClick={onClose}>
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 16 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ type: 'spring', damping: 28, stiffness: 320 }}
        style={{
          background: '#fff', borderRadius: '24px', padding: '32px',
          width: '100%', maxWidth: '360px',
          border: '1px solid var(--border)',
          boxShadow: '0 24px 64px rgba(43,33,24,0.14)',
          position: 'relative',
        }}
        onClick={e => e.stopPropagation()}
      >
        <button onClick={onClose} style={{
          position: 'absolute', top: '16px', right: '16px',
          width: '30px', height: '30px', borderRadius: '50%',
          background: 'var(--bg-soft)', border: '1px solid var(--border)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer',
        }}>
          <X style={{ width: '14px', height: '14px', color: 'var(--muted)' }} />
        </button>

        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <div style={{ fontFamily: "'Inter', sans-serif", fontSize: '12px', fontWeight: 600, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '6px' }}>{plan.label}</div>
          <div style={{ fontFamily: "'Playfair Display', serif", fontSize: '2.5rem', fontWeight: 700, color: 'var(--gold)', lineHeight: 1 }}>₹{plan.price}</div>
          <div style={{ fontFamily: "'Inter', sans-serif", fontSize: '11px', color: 'var(--subtle)', marginTop: '4px' }}>One-time · Lifetime Access</div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
          <div style={{ background: 'var(--bg-soft)', borderRadius: '16px', padding: '12px', border: '1px solid var(--border)' }}>
            <img src="/upi-qr.jpg" alt="UPI QR Code" style={{ width: '160px', height: '160px', objectFit: 'contain', display: 'block' }} />
          </div>
        </div>

        <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '12px', color: 'var(--muted)', textAlign: 'center', marginBottom: '16px', lineHeight: 1.6 }}>
          Scan with Google Pay · PhonePe · Paytm<br/>
          <strong style={{ color: 'var(--gold)' }}>Pay exactly ₹{plan.price}</strong>
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px' }}>
          {['Scan QR & pay ₹' + plan.price, 'Screenshot your payment', 'WhatsApp for instant access'].map((s, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontFamily: "'Inter', sans-serif", fontSize: '13px', color: 'var(--charcoal)' }}>
              <div style={{ width: '22px', height: '22px', borderRadius: '50%', background: 'var(--gold-bg)', border: '1px solid rgba(184,135,47,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '10px', color: 'var(--gold)', flexShrink: 0 }}>
                {i + 1}
              </div>
              {s}
            </div>
          ))}
        </div>

        <a href={`https://wa.me/916353709585?text=${encodeURIComponent(plan.whatsapp)}`}
          target="_blank" rel="noopener noreferrer"
          className="btn-whatsapp" style={{ width: '100%', justifyContent: 'center' }}>
          <MessageCircle style={{ width: '15px', height: '15px' }} />
          WhatsApp after payment
        </a>
      </motion.div>
    </div>
  );
}

export default function PricingSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '80px' });
  const [activePlan, setActivePlan] = useState(null);

  return (
    <section ref={ref} style={{ background: 'var(--bg-cream)', padding: '80px 0', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
      <div className="page-container">

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          style={{ textAlign: 'center', marginBottom: '56px' }}
        >
          <span className="section-subheading">Study Packs</span>
          <h2 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: 'clamp(1.875rem, 3.5vw, 2.6rem)',
            fontWeight: 700, color: 'var(--ink)',
            letterSpacing: '-0.025em', lineHeight: 1.12,
            marginBottom: '14px',
          }}>
            Get All Study Material in One Pack
          </h2>
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '15px', color: 'var(--muted)', maxWidth: '500px', margin: '0 auto', lineHeight: 1.7 }}>
            Premium PDFs, PPTs, notes, PYQs, mind maps, WhatsApp group access — one-time payment, lifetime access.
          </p>
        </motion.div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px', maxWidth: '760px', margin: '0 auto 40px' }} className="pricing-grid">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.class}
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.1, duration: 0.55 }}
              style={{
                background: plan.featured ? 'var(--espresso)' : 'var(--bg-white)',
                border: plan.featured ? '1px solid rgba(184,135,47,0.3)' : '1px solid var(--border)',
                borderRadius: '20px',
                padding: '32px',
                display: 'flex', flexDirection: 'column',
                position: 'relative',
                boxShadow: plan.featured ? '0 16px 48px rgba(43,33,24,0.15)' : 'var(--shadow-sm)',
              }}
            >
              {plan.badge && (
                <div style={{
                  position: 'absolute', top: '-14px', left: '50%', transform: 'translateX(-50%)',
                  display: 'flex', alignItems: 'center', gap: '5px',
                  padding: '4px 14px', borderRadius: '999px',
                  background: 'linear-gradient(135deg, var(--gold), var(--gold-soft))',
                  fontFamily: "'Inter', sans-serif",
                  fontSize: '11px', fontWeight: 700,
                  color: 'var(--espresso)',
                  boxShadow: 'var(--shadow-gold)',
                  whiteSpace: 'nowrap',
                }}>
                  <Star style={{ width: '10px', height: '10px', fill: 'currentColor' }} />
                  {plan.badge}
                </div>
              )}

              <div style={{ marginBottom: '20px' }}>
                <div style={{ fontFamily: "'Inter', sans-serif", fontSize: '11px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: plan.featured ? 'var(--gold-soft)' : 'var(--muted)', marginBottom: '12px' }}>
                  {plan.class}
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-end', gap: '10px', marginBottom: '6px' }}>
                  <div style={{ fontFamily: "'Playfair Display', serif", fontSize: '3rem', fontWeight: 700, lineHeight: 1, color: plan.featured ? 'var(--gold-soft)' : 'var(--gold)' }}>
                    ₹{plan.price}
                  </div>
                  <div style={{ marginBottom: '4px' }}>
                    <div style={{ fontFamily: "'Inter', sans-serif", fontSize: '14px', textDecoration: 'line-through', color: plan.featured ? 'rgba(255,255,255,0.3)' : 'var(--subtle)' }}>₹{plan.original}</div>
                    <div style={{ fontFamily: "'Inter', sans-serif", fontSize: '11px', fontWeight: 700, color: '#16a34a' }}>
                      {Math.round((1 - plan.price / plan.original) * 100)}% OFF
                    </div>
                  </div>
                </div>
                <div style={{ fontFamily: "'Inter', sans-serif", fontSize: '11px', color: plan.featured ? 'rgba(255,255,255,0.4)' : 'var(--subtle)' }}>
                  One-time payment · Lifetime access
                </div>
              </div>

              {/* Subjects */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '20px' }}>
                {plan.subjects.map(s => (
                  <span key={s} style={{
                    padding: '3px 10px', borderRadius: '6px',
                    fontFamily: "'Inter', sans-serif", fontSize: '11px', fontWeight: 500,
                    background: plan.featured ? 'rgba(255,255,255,0.08)' : 'var(--bg-ivory)',
                    border: plan.featured ? '1px solid rgba(255,255,255,0.1)' : '1px solid var(--border)',
                    color: plan.featured ? 'rgba(255,255,255,0.7)' : 'var(--charcoal)',
                  }}>{s}</span>
                ))}
              </div>

              {/* Features */}
              <ul style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '28px', flex: 1 }}>
                {plan.features.map(f => (
                  <li key={f} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontFamily: "'Inter', sans-serif", fontSize: '13.5px', color: plan.featured ? 'rgba(255,255,255,0.75)' : 'var(--charcoal)' }}>
                    <CheckCircle style={{ width: '14px', height: '14px', flexShrink: 0, marginTop: '2px', color: plan.featured ? 'var(--gold-soft)' : 'var(--green)' }} />
                    {f}
                  </li>
                ))}
              </ul>

              <button
                onClick={() => setActivePlan(plan)}
                className={plan.featured ? 'btn-primary' : 'btn-secondary'}
                style={{ width: '100%', justifyContent: 'center' }}
              >
                {plan.cta}
              </button>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.4 }}
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontFamily: "'Inter', sans-serif", fontSize: '12px', color: 'var(--muted)' }}
        >
          <Shield style={{ width: '13px', height: '13px', color: 'var(--green)' }} />
          Secure UPI payment · Instant WhatsApp delivery · 200+ students already enrolled
        </motion.div>
      </div>

      {activePlan && <PayModal plan={activePlan} onClose={() => setActivePlan(null)} />}

      <style>{`
        @media (max-width: 640px) { .pricing-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </section>
  );
}
