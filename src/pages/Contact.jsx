import SEO from '../components/ui/SEO';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Phone, Mail, MapPin, Instagram, Youtube, MessageCircle, Send, CheckCircle } from 'lucide-react';

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
    <div className="min-h-screen bg-navy-950">
      <SEO
        title="Contact — Book Free Demo Class"
        description="Contact Smit Sir Commerce in Mehsana, Gujarat. Call +91 63537 09585 to book a free demo class for CBSE Class 11 & 12 Commerce."
        path="/contact"
      />
      <div className="hero-bg py-16 border-b border-navy-800/50">
        <div className="page-container text-center">
          <div className="section-subheading">Get in Touch</div>
          <h1 className="section-heading text-4xl md:text-5xl">Contact <span className="gradient-text">Us</span></h1>
          <p className="text-navy-400 max-w-xl mx-auto">Have questions about batch admission or courses? We're here to help.</p>
        </div>
      </div>

      <div className="page-container section-padding">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Info */}
          <div>
            <h2 className="font-display font-bold text-2xl text-white mb-6">Reach Out to Us</h2>

            <div className="space-y-5 mb-8">
              <a href="tel:+916353709585" className="flex items-start gap-4 p-4 card-premium hover:border-gold-500/40 transition-colors group">
                <div className="w-12 h-12 bg-gold-500/10 rounded-xl flex items-center justify-center group-hover:bg-gold-500/20 transition-colors">
                  <Phone className="w-5 h-5 text-gold-400" />
                </div>
                <div>
                  <div className="text-white font-semibold">Call Us</div>
                  <div className="text-gold-400">+91 63537 09585</div>
                  <div className="text-navy-500 text-xs mt-0.5">Mon–Sat, 9am–8pm</div>
                </div>
              </a>

              <a
                href="https://wa.me/916353709585?text=Hello%20Smit%20Sir%2C%20I%20want%20to%20know%20about%20Class%2011%2F12%20Commerce%20batch%20admission."
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-4 p-4 card-premium hover:border-green-500/40 transition-colors group"
              >
                <div className="w-12 h-12 bg-green-500/10 rounded-xl flex items-center justify-center group-hover:bg-green-500/20 transition-colors">
                  <MessageCircle className="w-5 h-5 text-green-400" />
                </div>
                <div>
                  <div className="text-white font-semibold">WhatsApp</div>
                  <div className="text-green-400">Message on WhatsApp</div>
                  <div className="text-navy-500 text-xs mt-0.5">Quick response guaranteed</div>
                </div>
              </a>

              <a href="mailto:infosmitsircommerce@gmail.com" className="flex items-start gap-4 p-4 card-premium hover:border-blue-500/40 transition-colors group">
                <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center group-hover:bg-blue-500/20 transition-colors">
                  <Mail className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <div className="text-white font-semibold">Email</div>
                  <div className="text-blue-400">infosmitsircommerce@gmail.com</div>
                </div>
              </a>

              <div className="flex items-start gap-4 p-4 card-premium">
                <div className="w-12 h-12 bg-navy-700 rounded-xl flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-navy-400" />
                </div>
                <div>
                  <div className="text-white font-semibold">Location</div>
                  <div className="text-navy-400 text-sm">Mehsana, Gujarat, India</div>
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div>
              <h3 className="font-semibold text-white mb-4">Follow Us</h3>
              <div className="flex items-center gap-4">
                <a href="https://instagram.com/smitthker" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:opacity-90 transition-opacity">
                  <Instagram className="w-4 h-4" /> @smitthker
                </a>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="card-premium">
            <h3 className="font-display font-bold text-xl text-white mb-6">Send a Message</h3>
            {submitted ? (
              <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center py-8">
                <CheckCircle className="w-16 h-16 text-emerald-400 mx-auto mb-4" />
                <h4 className="font-bold text-xl text-white mb-2">Message Sent!</h4>
                <p className="text-navy-400">Thank you. Smit Sir Commerce will contact you soon.</p>
                <button onClick={() => { setSubmitted(false); setForm({ name: '', mobile: '', class: '', message: '' }); }} className="btn-primary mt-6">
                  Send Another Message
                </button>
              </motion.div>
            ) : (
              <form name="contact" method="POST" data-netlify="true" onSubmit={handleSubmit} className="space-y-4">
                <input type="hidden" name="form-name" value="contact" />
                <div>
                  <label className="block text-navy-400 text-xs mb-1.5">Your Name *</label>
                  <input required name="name" className="input-field" placeholder="Enter your name" value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} />
                </div>
                <div>
                  <label className="block text-navy-400 text-xs mb-1.5">Mobile Number *</label>
                  <input required name="mobile" type="tel" className="input-field" placeholder="+91 XXXXX XXXXX" value={form.mobile} onChange={(e) => setForm({...form, mobile: e.target.value})} />
                </div>
                <div>
                  <label className="block text-navy-400 text-xs mb-1.5">Class</label>
                  <select name="class" className="input-field" value={form.class} onChange={(e) => setForm({...form, class: e.target.value})}>
                    <option value="">Select Class</option>
                    <option value="11">Class 11</option>
                    <option value="12">Class 12</option>
                  </select>
                </div>
                <div>
                  <label className="block text-navy-400 text-xs mb-1.5">Message</label>
                  <textarea required name="message" className="input-field resize-none" rows={4} placeholder="How can we help you?" value={form.message} onChange={(e) => setForm({...form, message: e.target.value})} />
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
