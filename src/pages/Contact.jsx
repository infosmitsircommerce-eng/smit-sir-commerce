import SEO from '../components/ui/SEO';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Phone, Mail, MapPin, Instagram, MessageCircle, Send, CheckCircle } from 'lucide-react';

const inputStyle = {
  background: 'var(--bg-ivory)',
  border: '1px solid var(--border)',
  borderRadius: '12px',
  color: 'var(--ink)',
  padding: '12px 16px',
  fontFamily: 'var(--font-sans)',
  fontSize: '14px',
  width: '100%',
};

const labelStyle = {
  display: 'block',
  fontSize: '12px',
  fontWeight: 600,
  color: 'var(--muted)',
  marginBottom: '6px',
};

export default function Contact() {
  const [form, setForm] = useState({ name: '', mobile: '', class: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        access_key: '73a84b9a-a32e-446b-af2e-e288ed652ba3',
        subject: 'New Contact Message - Smit Sir Commerce',
        ...form,
      }),
    });
    if (res.ok) setSubmitted(true);
  };

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-ivory)' }}>
      <SEO
        title="Contact — Book Free Demo Class"
        description="Contact Smit Sir Commerce in Mehsana, Gujarat. Call +91 63537 09585 to book a free demo class for CBSE Class 11 & 12 Commerce."
        path="/contact"
      />
      <div className="page-hero">
        <div className="page-container text-center">
          <span className="eyebrow">Get in Touch</span>
          <h1 className="mt-5">Contact <em>us.</em></h1>
          <p className="mx-auto">Have questions about batch admission or courses? We're here to help.</p>
        </div>
      </div>

      <div className="page-container section-padding">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Info */}
          <div>
            <h2 className="text-2xl mb-6" style={{ fontFamily: 'var(--font-serif)', fontWeight: 700, color: 'var(--ink)' }}>Reach out to us</h2>

            <div className="space-y-4 mb-8">
              <a href="tel:+916353709585" className="card-paper flex items-start gap-4 p-4 group">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: 'var(--gold-bg)', border: '1px solid rgba(184,135,47,0.18)' }}>
                  <Phone className="w-5 h-5" style={{ color: 'var(--gold)' }} strokeWidth={1.8} />
                </div>
                <div>
                  <div className="font-semibold" style={{ color: 'var(--ink)' }}>Call Us</div>
                  <div style={{ color: 'var(--gold)' }}>+91 63537 09585</div>
                  <div className="text-xs mt-0.5" style={{ color: 'var(--subtle)' }}>Mon–Sat, 9am–8pm</div>
                </div>
              </a>

              <a
                href="https://wa.me/916353709585?text=Hello%20Smit%20Sir%2C%20I%20want%20to%20know%20about%20Class%2011%2F12%20Commerce%20batch%20admission."
                target="_blank"
                rel="noopener noreferrer"
                className="card-paper flex items-start gap-4 p-4 group"
              >
                <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: 'rgba(77,124,15,0.07)', border: '1px solid rgba(77,124,15,0.2)' }}>
                  <MessageCircle className="w-5 h-5" style={{ color: 'var(--green)' }} strokeWidth={1.8} />
                </div>
                <div>
                  <div className="font-semibold" style={{ color: 'var(--ink)' }}>WhatsApp</div>
                  <div style={{ color: 'var(--green)' }}>Message on WhatsApp</div>
                  <div className="text-xs mt-0.5" style={{ color: 'var(--subtle)' }}>Quick response guaranteed</div>
                </div>
              </a>

              <a href="mailto:infosmitsircommerce@gmail.com" className="card-paper flex items-start gap-4 p-4 group">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: 'var(--gold-bg)', border: '1px solid rgba(184,135,47,0.18)' }}>
                  <Mail className="w-5 h-5" style={{ color: 'var(--gold)' }} strokeWidth={1.8} />
                </div>
                <div>
                  <div className="font-semibold" style={{ color: 'var(--ink)' }}>Email</div>
                  <div style={{ color: 'var(--gold)' }}>infosmitsircommerce@gmail.com</div>
                </div>
              </a>

              <div className="card-paper flex items-start gap-4 p-4">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: 'var(--bg-ivory)', border: '1px solid var(--border)' }}>
                  <MapPin className="w-5 h-5" style={{ color: 'var(--muted)' }} strokeWidth={1.8} />
                </div>
                <div>
                  <div className="font-semibold" style={{ color: 'var(--ink)' }}>Location</div>
                  <div className="text-sm" style={{ color: 'var(--muted)' }}>Mehsana, Gujarat, India</div>
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div>
              <h3 className="font-semibold mb-4" style={{ color: 'var(--ink)' }}>Follow Us</h3>
              <a href="https://instagram.com/smitthker" target="_blank" rel="noopener noreferrer"
                className="btn-outline-ink inline-flex items-center gap-2 text-sm py-2.5 px-4">
                <Instagram className="w-4 h-4" /> @smitthker
              </a>
            </div>
          </div>

          {/* Contact Form */}
          <div className="card-paper p-7">
            <h3 className="text-xl mb-6" style={{ fontFamily: 'var(--font-serif)', fontWeight: 700, color: 'var(--ink)' }}>Send a message</h3>
            {submitted ? (
              <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center py-8">
                <CheckCircle className="w-16 h-16 mx-auto mb-4" style={{ color: 'var(--green)' }} strokeWidth={1.5} />
                <h4 className="text-xl mb-2" style={{ fontFamily: 'var(--font-serif)', fontWeight: 700, color: 'var(--ink)' }}>Message sent!</h4>
                <p style={{ color: 'var(--muted)' }}>Thank you. Smit Sir Commerce will contact you soon.</p>
                <button onClick={() => { setSubmitted(false); setForm({ name: '', mobile: '', class: '', message: '' }); }} className="btn-primary mt-6">
                  Send Another Message
                </button>
              </motion.div>
            ) : (
              <form name="contact" method="POST" data-netlify="true" onSubmit={handleSubmit} className="space-y-4">
                <input type="hidden" name="form-name" value="contact" />
                <div>
                  <label style={labelStyle}>Your Name *</label>
                  <input required name="name" style={inputStyle} placeholder="Enter your name" value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} />
                </div>
                <div>
                  <label style={labelStyle}>Mobile Number *</label>
                  <input required name="mobile" type="tel" style={inputStyle} placeholder="+91 XXXXX XXXXX" value={form.mobile} onChange={(e) => setForm({...form, mobile: e.target.value})} />
                </div>
                <div>
                  <label style={labelStyle}>Class</label>
                  <select name="class" style={inputStyle} value={form.class} onChange={(e) => setForm({...form, class: e.target.value})}>
                    <option value="">Select Class</option>
                    <option value="11">Class 11</option>
                    <option value="12">Class 12</option>
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Message</label>
                  <textarea required name="message" rows={4} style={{ ...inputStyle, resize: 'none' }} placeholder="How can we help you?" value={form.message} onChange={(e) => setForm({...form, message: e.target.value})} />
                </div>
                <button type="submit" className="btn-primary w-full flex items-center justify-center gap-2">
                  <Send className="w-4 h-4" /> Send Message
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
