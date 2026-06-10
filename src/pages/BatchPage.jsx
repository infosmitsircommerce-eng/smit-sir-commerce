import { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, Wifi, CheckCircle, Send, ArrowRight, Tag, Zap, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

const offlineFeatures = [
  'Classroom learning with personal attention',
  'Face-to-face interaction with Smit Sir',
  'Regular chapter and unit tests',
  'Doubt-solving sessions in class',
  'Board exam preparation guidance',
  'Limited seats — individual attention',
  'Study discipline and regular monitoring',
  'Direct teacher interaction for all doubts',
];

const onlineFeatures = [
  'Live and recorded lectures anytime',
  'Digital notes and study material',
  'Online quizzes and practice tests',
  'Doubt support via messaging',
  'Flexible learning — study anywhere',
  'Best for students outside the city',
  'Complete test series access',
  'Recorded revision support',
];

const pricingPlans = [
  { class: 'Class 11', price: 8999, original: 27999, discount: 68, badge: 'Most Popular',     featured: false },
  { class: 'Class 12', price: 9999, original: 29999, discount: 67, badge: 'Board Exam Focus', featured: true  },
];

const included = [
  'Live + Recorded Lectures',
  'Chapter-wise PDF Notes',
  'Online Quizzes',
  'Full Test Series',
  'Doubt Support',
  'Study Planner',
  'Revision Material',
  'Board Exam Guidance',
];

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

function EnquiryForm({ batchType, onSuccess }) {
  const [form, setForm] = useState({
    studentName: '', class: '', school: '', subject: '', batchType: batchType || 'Online', parentMobile: '', studentMobile: '', city: '', message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        access_key: '73a84b9a-a32e-446b-af2e-e288ed652ba3',
        subject: 'New Batch Enquiry - Smit Sir Commerce',
        ...form,
      }),
    });
    if (res.ok) { setSubmitted(true); onSuccess && onSuccess(); }
  };

  if (submitted) {
    return (
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center py-8">
        <CheckCircle className="w-14 h-14 mx-auto mb-4" style={{ color: 'var(--green)' }} strokeWidth={1.5} />
        <h3 className="text-xl mb-2" style={{ fontFamily: 'var(--font-serif)', fontWeight: 700, color: 'var(--ink)' }}>Enquiry submitted!</h3>
        <p style={{ color: 'var(--muted)' }}>Thank you. Your enquiry has been submitted. Smit Sir Commerce will contact you soon.</p>
        <button onClick={() => setSubmitted(false)} className="btn-primary mt-6">Submit Another Enquiry</button>
      </motion.div>
    );
  }

  return (
    <form name="batch-enquiry" method="POST" data-netlify="true" onSubmit={handleSubmit} className="space-y-4">
      <input type="hidden" name="form-name" value="batch-enquiry" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label style={labelStyle}>Student Name *</label>
          <input required style={inputStyle} placeholder="Enter full name" value={form.studentName} onChange={(e) => setForm({...form, studentName: e.target.value})} />
        </div>
        <div>
          <label style={labelStyle}>Class *</label>
          <select required style={inputStyle} value={form.class} onChange={(e) => setForm({...form, class: e.target.value})}>
            <option value="">Select Class</option>
            <option value="11">Class 11</option>
            <option value="12">Class 12</option>
          </select>
        </div>
        <div>
          <label style={labelStyle}>School Name</label>
          <input style={inputStyle} placeholder="Your school name" value={form.school} onChange={(e) => setForm({...form, school: e.target.value})} />
        </div>
        <div>
          <label style={labelStyle}>Subject Interested</label>
          <select style={inputStyle} value={form.subject} onChange={(e) => setForm({...form, subject: e.target.value})}>
            <option value="">All Subjects</option>
            <option value="Accountancy">Accountancy</option>
            <option value="Business Studies">Business Studies</option>
            <option value="Economics">Economics</option>
            <option value="Entrepreneurship">Entrepreneurship</option>
            <option value="Physical Education">Physical Education</option>
          </select>
        </div>
        <div>
          <label style={labelStyle}>Batch Type *</label>
          <select required style={inputStyle} value={form.batchType} onChange={(e) => setForm({...form, batchType: e.target.value})}>
            <option value="Online">Online Batch</option>
            <option value="Offline">Offline Batch</option>
          </select>
        </div>
        <div>
          <label style={labelStyle}>City *</label>
          <input required style={inputStyle} placeholder="Your city" value={form.city} onChange={(e) => setForm({...form, city: e.target.value})} />
        </div>
        <div>
          <label style={labelStyle}>Parent Mobile *</label>
          <input required type="tel" style={inputStyle} placeholder="+91 XXXXX XXXXX" value={form.parentMobile} onChange={(e) => setForm({...form, parentMobile: e.target.value})} />
        </div>
        <div>
          <label style={labelStyle}>Student Mobile</label>
          <input type="tel" style={inputStyle} placeholder="+91 XXXXX XXXXX" value={form.studentMobile} onChange={(e) => setForm({...form, studentMobile: e.target.value})} />
        </div>
      </div>
      <div>
        <label style={labelStyle}>Message</label>
        <textarea rows={3} style={{ ...inputStyle, resize: 'none' }} placeholder="Any specific question or requirement..." value={form.message} onChange={(e) => setForm({...form, message: e.target.value})} />
      </div>
      <button type="submit" className="btn-primary w-full flex items-center justify-center gap-2">
        <Send className="w-4 h-4" /> Submit Enquiry
      </button>
    </form>
  );
}

export default function BatchPage({ type = 'both' }) {
  const [activeTab, setActiveTab] = useState(type === 'offline' ? 'offline' : 'online');

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-ivory)' }}>
      <div className="page-hero">
        <div className="page-container text-center">
          <span className="eyebrow">Join Our Batches</span>
          <h1 className="mt-5">
            {type === 'offline' ? <><em>Offline</em> batch.</> :
             type === 'online' ? <><em>Online</em> batch.</> :
             <>Online &amp; <em>offline</em> batches.</>}
          </h1>
          <p className="mx-auto">Choose your preferred learning mode. Both batches offer complete CBSE Commerce preparation.</p>
        </div>
      </div>

      <div className="page-container section-padding">
        {/* Batch toggle */}
        <div className="flex items-center justify-center mb-12">
          <div className="toggle-paper">
            <button onClick={() => setActiveTab('online')} className={activeTab === 'online' ? 'active' : ''}>
              <span className="inline-flex items-center gap-2"><Wifi className="w-4 h-4" /> Online Batch</span>
            </button>
            <button onClick={() => setActiveTab('offline')} className={activeTab === 'offline' ? 'active' : ''}>
              <span className="inline-flex items-center gap-2"><Users className="w-4 h-4" /> Offline Batch</span>
            </button>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-10 mb-16">
          {/* Features */}
          <div>
            <div className="w-14 h-14 rounded-xl flex items-center justify-center mb-5"
              style={{ background: 'var(--gold-bg)', border: '1px solid rgba(184,135,47,0.22)' }}>
              {activeTab === 'online'
                ? <Wifi className="w-7 h-7" style={{ color: 'var(--gold)' }} strokeWidth={1.6} />
                : <Users className="w-7 h-7" style={{ color: 'var(--gold)' }} strokeWidth={1.6} />}
            </div>
            <h2 className="text-3xl mb-2" style={{ fontFamily: 'var(--font-serif)', fontWeight: 700, color: 'var(--ink)', letterSpacing: '-0.02em' }}>
              {activeTab === 'online' ? 'Online Batch' : 'Offline Batch'}
            </h2>
            <p className="mb-6" style={{ color: 'var(--muted)' }}>
              {activeTab === 'online'
                ? 'Learn from anywhere — live classes, recorded lectures, and full digital support.'
                : 'Classroom learning with personal attention, discipline, and direct teacher interaction.'}
            </p>
            <ul className="space-y-3">
              {(activeTab === 'online' ? onlineFeatures : offlineFeatures).map((f) => (
                <li key={f} className="flex items-start gap-3 text-sm" style={{ color: 'var(--charcoal)' }}>
                  <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: 'var(--gold)' }} />
                  {f}
                </li>
              ))}
            </ul>
          </div>

          {/* Enquiry Form */}
          <div className="card-paper p-7">
            <h3 className="text-xl mb-2" style={{ fontFamily: 'var(--font-serif)', fontWeight: 700, color: 'var(--ink)' }}>Admission enquiry</h3>
            <p className="text-sm mb-6" style={{ color: 'var(--muted)' }}>Fill in your details and we'll get back to you within 24 hours.</p>
            <EnquiryForm batchType={activeTab === 'online' ? 'Online' : 'Offline'} />
          </div>
        </div>

        {/* Pricing Section */}
        <div className="mb-12">
          <div className="text-center mb-10">
            <span className="eyebrow">Online Batch Pricing</span>
            <h3 className="headline mt-6">Simple &amp; <em>transparent pricing.</em></h3>

            {/* Sale banner */}
            <div className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold mt-5"
              style={{ background: 'rgba(180,83,60,0.08)', border: '1px solid rgba(180,83,60,0.3)', color: '#B4533C' }}>
              <Zap className="w-4 h-4" />
              Limited Time Offer — Up to 68% OFF
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {pricingPlans.map((plan, i) => (
              <motion.div
                key={plan.class}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.15 }}
                className="relative rounded-2xl p-7 overflow-hidden"
                style={plan.featured ? {
                  background: 'linear-gradient(150deg, var(--ink-bg-2) 0%, var(--ink-bg) 65%)',
                  border: '1px solid rgba(217,172,92,0.5)',
                  boxShadow: '0 20px 56px rgba(30,24,18,0.18)',
                } : {
                  background: 'var(--bg-white)',
                  border: '1px solid var(--border)',
                  boxShadow: 'var(--shadow-sm)',
                }}
              >
                {plan.featured && (
                  <div className="absolute top-0 inset-x-0 h-px"
                    style={{ background: 'linear-gradient(90deg, transparent, rgba(217,172,92,0.8), transparent)' }} />
                )}

                {/* Discount badge — top right */}
                <div className="absolute top-4 right-4 text-xs font-bold px-2.5 py-1.5 rounded-lg"
                  style={{ background: 'rgba(180,83,60,0.1)', border: '1px solid rgba(180,83,60,0.35)', color: plan.featured ? '#E0937D' : '#B4533C' }}>
                  {plan.discount}% OFF
                </div>

                {/* Class badge */}
                <div className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold mb-5"
                  style={plan.featured
                    ? { background: 'rgba(217,172,92,0.1)', border: '1px solid rgba(217,172,92,0.3)', color: 'var(--gold-bright)' }
                    : { background: 'var(--gold-bg)', border: '1px solid rgba(184,135,47,0.25)', color: 'var(--gold)' }}>
                  <Tag className="w-3 h-3" />
                  {plan.badge}
                </div>

                <div className="text-2xl mb-4" style={{ fontFamily: 'var(--font-serif)', fontWeight: 700, color: plan.featured ? 'var(--ivory-on-ink)' : 'var(--ink)' }}>
                  {plan.class} — Online Batch
                </div>

                {/* Price */}
                <div className="mb-1">
                  <span className="text-sm line-through mr-2" style={{ color: plan.featured ? 'var(--muted-on-ink)' : 'var(--subtle)' }}>₹{plan.original.toLocaleString('en-IN')}</span>
                  <span className="text-xs font-semibold" style={{ color: plan.featured ? '#E0937D' : '#B4533C' }}>You save ₹{(plan.original - plan.price).toLocaleString('en-IN')}</span>
                </div>
                <div className="flex items-end gap-2 mb-6">
                  <span className="text-5xl" style={{ fontFamily: 'var(--font-serif)', fontWeight: 700, color: plan.featured ? 'var(--gold-bright)' : 'var(--gold)' }}>
                    ₹{plan.price.toLocaleString('en-IN')}
                  </span>
                  <span className="text-sm mb-2" style={{ color: plan.featured ? 'var(--muted-on-ink)' : 'var(--muted)' }}>/ full course</span>
                </div>

                {/* What's included */}
                <div className="space-y-2 mb-7">
                  {included.map((item) => (
                    <div key={item} className="flex items-center gap-2 text-sm" style={{ color: plan.featured ? 'rgba(243,236,221,0.85)' : 'var(--charcoal)' }}>
                      <CheckCircle className="w-3.5 h-3.5 flex-shrink-0" style={{ color: plan.featured ? 'var(--gold-bright)' : 'var(--gold)' }} />
                      {item}
                    </div>
                  ))}
                </div>

                {/* CTA */}
                <a
                  href="https://wa.me/916353709585?text=Hello%20Smit%20Sir%2C%20I%20want%20to%20enrol%20in%20the%20Online%20Batch."
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${plan.featured ? 'btn-gold' : 'btn-primary'} w-full flex items-center justify-center gap-2 text-sm`}
                >
                  Enrol Now — ₹{plan.price.toLocaleString('en-IN')} <ArrowRight className="w-4 h-4" />
                </a>

                <p className="text-xs text-center mt-3 flex items-center justify-center gap-1" style={{ color: plan.featured ? 'var(--muted-on-ink)' : 'var(--subtle)' }}>
                  <Clock className="w-3 h-3" /> Limited seats — offer ends soon
                </p>
              </motion.div>
            ))}
          </div>

          <p className="text-center text-sm mt-6" style={{ color: 'var(--subtle)' }}>
            * Offline batch pricing available on enquiry · Combo discount for Class 11 + 12 available
          </p>
        </div>

        {/* CTA */}
        <div className="text-center card-paper p-8">
          <h3 className="text-2xl mb-3" style={{ fontFamily: 'var(--font-serif)', fontWeight: 700, color: 'var(--ink)' }}>Still have questions?</h3>
          <p className="mb-6" style={{ color: 'var(--muted)' }}>Book a free demo class and decide after experiencing the teaching quality.</p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link to="/contact" className="btn-primary flex items-center gap-2">Book Free Demo Class <ArrowRight className="w-4 h-4" /></Link>
            <a href="https://wa.me/916353709585?text=Hello%20Smit%20Sir%2C%20I%20want%20to%20know%20about%20batch%20admission." className="btn-outline-ink flex items-center gap-2">WhatsApp Us</a>
          </div>
        </div>
      </div>
    </div>
  );
}
