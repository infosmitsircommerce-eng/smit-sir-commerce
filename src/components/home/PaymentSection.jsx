import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { MessageCircle, CheckCircle, Smartphone } from 'lucide-react';

const steps = [
  { step: '01', text: 'Scan the QR code with any UPI app (Google Pay, PhonePe, Paytm)' },
  { step: '02', text: 'Enter the exact amount and complete the payment' },
  { step: '03', text: 'Take a screenshot of your payment confirmation' },
  { step: '04', text: 'WhatsApp us the screenshot — we confirm your seat instantly' },
];

export default function PaymentSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '80px' });

  return (
    <section ref={ref} style={{ background: 'var(--bg-white)', padding: '80px 0', borderTop: '1px solid var(--border)' }}>
      <div className="page-container">

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          style={{ textAlign: 'center', marginBottom: '56px' }}
        >
          <span className="section-subheading">Fee Payment</span>
          <h2 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: 'clamp(1.75rem, 3vw, 2.4rem)',
            fontWeight: 700, color: 'var(--ink)',
            letterSpacing: '-0.025em', lineHeight: 1.12,
            marginBottom: '12px',
          }}>
            Pay Fees or Book a <span className="gradient-text">Free Demo</span>
          </h2>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '14px', color: 'var(--muted)', maxWidth: '480px', margin: '0 auto', lineHeight: 1.7 }}>
            Scan the UPI QR code below using any payment app. Zero extra charges.
          </p>
        </motion.div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '60px', alignItems: 'center', maxWidth: '900px', margin: '0 auto' }} className="payment-grid">

          {/* QR Code */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.1 }}
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}
          >
            <div style={{
              background: 'var(--bg-white)',
              borderRadius: '20px', padding: '20px',
              border: '1.5px solid var(--border)',
              boxShadow: 'var(--shadow-md)',
            }}>
              <img
                src="/upi-qr.jpg"
                alt="UPI QR Code — Smit Sir Commerce"
                style={{ width: '220px', height: '220px', objectFit: 'contain', display: 'block', borderRadius: '10px' }}
              />
              <div style={{ marginTop: '14px', textAlign: 'center' }}>
                <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '14px', fontWeight: 700, color: 'var(--ink)' }}>
                  Smit Sir Commerce
                </div>
                <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '11px', color: 'var(--muted)', marginTop: '3px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                  <Smartphone style={{ width: '11px', height: '11px' }} />
                  Google Pay · PhonePe · Paytm
                </div>
              </div>
            </div>

            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '6px',
              padding: '6px 14px', borderRadius: '999px',
              background: '#F0FDF4', border: '1px solid #BBF7D0',
              fontFamily: "'DM Sans', sans-serif",
              fontSize: '12px', fontWeight: 600, color: '#15803d',
            }}>
              <CheckCircle style={{ width: '13px', height: '13px' }} />
              0% transaction fee · Instant payment
            </div>
          </motion.div>

          {/* Steps */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h3 style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: '16px', fontWeight: 700,
              color: 'var(--ink)', marginBottom: '24px',
            }}>
              How to pay in 4 steps
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '28px' }}>
              {steps.map((s, i) => (
                <motion.div
                  key={s.step}
                  initial={{ opacity: 0, x: 16 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.25 + i * 0.07 }}
                  style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}
                >
                  <div style={{
                    width: '36px', height: '36px', borderRadius: '10px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0,
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: '12px', fontWeight: 700,
                    background: 'var(--gold-bg)', border: '1px solid rgba(184,135,47,0.22)',
                    color: 'var(--gold)',
                  }}>
                    {s.step}
                  </div>
                  <div style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: '14px', lineHeight: 1.65,
                    color: 'var(--charcoal)', paddingTop: '8px',
                  }}>
                    {s.text}
                  </div>
                </motion.div>
              ))}
            </div>

            <a
              href="https://wa.me/916353709585?text=Hello%20Smit%20Sir%2C%20I%20have%20made%20the%20payment.%20Please%20confirm%20my%20seat."
              target="_blank" rel="noopener noreferrer"
              className="btn-whatsapp" style={{ display: 'inline-flex' }}>
              <MessageCircle style={{ width: '15px', height: '15px' }} />
              WhatsApp after payment
            </a>

            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '12px', color: 'var(--subtle)', marginTop: '12px' }}>
              For batch fees, demo booking, or any queries — we respond within 1 hour.
            </p>
          </motion.div>
        </div>
      </div>
      <style>{`
        @media (max-width: 768px) { .payment-grid { grid-template-columns: 1fr !important; gap: 40px !important; } }
      `}</style>
    </section>
  );
}
