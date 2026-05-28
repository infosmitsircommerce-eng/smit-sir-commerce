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
  {
    class: 'Class 11',
    price: 8999,
    original: 27999,
    discount: 68,
    color: 'from-blue-500/20 to-blue-600/5',
    border: 'border-blue-500/30',
    badge: 'Most Popular',
    badgeColor: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  },
  {
    class: 'Class 12',
    price: 9999,
    original: 29999,
    discount: 67,
    color: 'from-gold-500/20 to-gold-600/5',
    border: 'border-gold-500/40',
    badge: 'Board Exam Focus',
    badgeColor: 'bg-gold-500/20 text-gold-400 border-gold-500/30',
  },
];

const included = [
  '✅ Live + Recorded Lectures',
  '✅ Chapter-wise PDF Notes',
  '✅ Online Quizzes',
  '✅ Full Test Series',
  '✅ Doubt Support',
  '✅ Study Planner',
  '✅ Revision Material',
  '✅ Board Exam Guidance',
];

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
        <div className="text-5xl mb-4">🎉</div>
        <h3 className="font-display font-bold text-xl text-white mb-2">Enquiry Submitted!</h3>
        <p className="text-navy-400">Thank you. Your enquiry has been submitted. Smit Sir Commerce will contact you soon.</p>
        <button onClick={() => setSubmitted(false)} className="btn-primary mt-6">Submit Another Enquiry</button>
      </motion.div>
    );
  }

  return (
    <form name="batch-enquiry" method="POST" data-netlify="true" onSubmit={handleSubmit} className="space-y-4">
      <input type="hidden" name="form-name" value="batch-enquiry" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-navy-400 text-xs mb-1.5">Student Name *</label>
          <input required className="input-field" placeholder="Enter full name" value={form.studentName} onChange={(e) => setForm({...form, studentName: e.target.value})} />
        </div>
        <div>
          <label className="block text-navy-400 text-xs mb-1.5">Class *</label>
          <select required className="input-field" value={form.class} onChange={(e) => setForm({...form, class: e.target.value})}>
            <option value="">Select Class</option>
            <option value="11">Class 11</option>
            <option value="12">Class 12</option>
          </select>
        </div>
        <div>
          <label className="block text-navy-400 text-xs mb-1.5">School Name</label>
          <input className="input-field" placeholder="Your school name" value={form.school} onChange={(e) => setForm({...form, school: e.target.value})} />
        </div>
        <div>
          <label className="block text-navy-400 text-xs mb-1.5">Subject Interested</label>
          <select className="input-field" value={form.subject} onChange={(e) => setForm({...form, subject: e.target.value})}>
            <option value="">All Subjects</option>
            <option value="Accountancy">Accountancy</option>
            <option value="Business Studies">Business Studies</option>
            <option value="Economics">Economics</option>
            <option value="Entrepreneurship">Entrepreneurship</option>
            <option value="Physical Education">Physical Education</option>
          </select>
        </div>
        <div>
          <label className="block text-navy-400 text-xs mb-1.5">Batch Type *</label>
          <select required className="input-field" value={form.batchType} onChange={(e) => setForm({...form, batchType: e.target.value})}>
            <option value="Online">Online Batch</option>
            <option value="Offline">Offline Batch</option>
          </select>
        </div>
        <div>
          <label className="block text-navy-400 text-xs mb-1.5">City *</label>
          <input required className="input-field" placeholder="Your city" value={form.city} onChange={(e) => setForm({...form, city: e.target.value})} />
        </div>
        <div>
          <label className="block text-navy-400 text-xs mb-1.5">Parent Mobile *</label>
          <input required type="tel" className="input-field" placeholder="+91 XXXXX XXXXX" value={form.parentMobile} onChange={(e) => setForm({...form, parentMobile: e.target.value})} />
        </div>
        <div>
          <label className="block text-navy-400 text-xs mb-1.5">Student Mobile</label>
          <input type="tel" className="input-field" placeholder="+91 XXXXX XXXXX" value={form.studentMobile} onChange={(e) => setForm({...form, studentMobile: e.target.value})} />
        </div>
      </div>
      <div>
        <label className="block text-navy-400 text-xs mb-1.5">Message</label>
        <textarea className="input-field resize-none" rows={3} placeholder="Any specific question or requirement..." value={form.message} onChange={(e) => setForm({...form, message: e.target.value})} />
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
    <div className="min-h-screen bg-navy-950">
      <div className="hero-bg py-16 border-b border-navy-800/50">
        <div className="page-container text-center">
          <div className="section-subheading">Join Our Batches</div>
          <h1 className="section-heading text-4xl md:text-5xl">
            {type === 'offline' ? <><span className="gradient-text">Offline</span> Batch</> :
             type === 'online' ? <><span className="gradient-text">Online</span> Batch</> :
             <>Online &amp; <span className="gradient-text">Offline</span> Batches</>}
          </h1>
          <p className="text-navy-400 max-w-xl mx-auto">Choose your preferred learning mode. Both batches offer complete CBSE Commerce preparation.</p>
        </div>
      </div>

      <div className="page-container section-padding">
        {/* Batch toggle */}
        <div className="flex items-center justify-center gap-3 mb-12">
          <button onClick={() => setActiveTab('online')} className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all ${activeTab === 'online' ? 'bg-blue-600 text-white shadow-lg' : 'bg-navy-800 text-navy-300'}`}>
            <Wifi className="w-4 h-4" /> Online Batch
          </button>
          <button onClick={() => setActiveTab('offline')} className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all ${activeTab === 'offline' ? 'bg-gold-500 text-navy-950 shadow-gold' : 'bg-navy-800 text-navy-300'}`}>
            <Users className="w-4 h-4" /> Offline Batch
          </button>
        </div>

        <div className="grid lg:grid-cols-2 gap-10 mb-16">
          {/* Features */}
          <div>
            <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-5 ${activeTab === 'online' ? 'bg-blue-500/20' : 'bg-gold-500/20'}`}>
              {activeTab === 'online' ? <Wifi className="w-7 h-7 text-blue-400" /> : <Users className="w-7 h-7 text-gold-400" />}
            </div>
            <h2 className="font-display font-bold text-3xl text-white mb-2">
              {activeTab === 'online' ? 'Online Batch' : 'Offline Batch'}
            </h2>
            <p className="text-navy-400 mb-6">
              {activeTab === 'online'
                ? 'Learn from anywhere — live classes, recorded lectures, and full digital support.'
                : 'Classroom learning with personal attention, discipline, and direct teacher interaction.'}
            </p>
            <ul className="space-y-3">
              {(activeTab === 'online' ? onlineFeatures : offlineFeatures).map((f) => (
                <li key={f} className="flex items-start gap-3 text-navy-300 text-sm">
                  <CheckCircle className="w-4 h-4 text-gold-400 mt-0.5 flex-shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
          </div>

          {/* Enquiry Form */}
          <div className="card-premium">
            <h3 className="font-display font-bold text-xl text-white mb-2">Admission Enquiry</h3>
            <p className="text-navy-400 text-sm mb-6">Fill in your details and we'll get back to you within 24 hours.</p>
            <EnquiryForm batchType={activeTab === 'online' ? 'Online' : 'Offline'} />
          </div>
        </div>

        {/* Pricing Section */}
        <div className="mb-12">
          <div className="text-center mb-10">
            <div className="section-subheading">Online Batch Pricing</div>
            <h3 className="section-heading">Simple & <span className="gradient-text">Transparent Pricing</span></h3>

            {/* Sale banner */}
            <motion.div
              animate={{ scale: [1, 1.02, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="inline-flex items-center gap-2 bg-red-500/15 border border-red-500/30 rounded-full px-4 py-2 text-red-400 text-sm font-bold mt-3"
            >
              <Zap className="w-4 h-4" />
              Limited Time Offer — Up to 68% OFF
              <Zap className="w-4 h-4" />
            </motion.div>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {pricingPlans.map((plan, i) => (
              <motion.div
                key={plan.class}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.15 }}
                className={`relative bg-gradient-to-b ${plan.color} border-2 ${plan.border} rounded-2xl p-7 overflow-hidden`}
              >
                {/* Discount badge — top right */}
                <div className="absolute top-4 right-4 bg-red-500 text-white text-xs font-black px-2.5 py-1.5 rounded-xl shadow-lg">
                  {plan.discount}% OFF
                </div>

                {/* Class badge */}
                <div className={`inline-flex items-center gap-1.5 border rounded-full px-3 py-1 text-xs font-semibold mb-5 ${plan.badgeColor}`}>
                  <Tag className="w-3 h-3" />
                  {plan.badge}
                </div>

                <div className="font-display font-bold text-white text-2xl mb-4">{plan.class} — Online Batch</div>

                {/* Price */}
                <div className="mb-1">
                  <span className="text-navy-500 text-sm line-through mr-2">₹{plan.original.toLocaleString('en-IN')}</span>
                  <span className="text-red-400 text-xs font-semibold">You save ₹{(plan.original - plan.price).toLocaleString('en-IN')}</span>
                </div>
                <div className="flex items-end gap-2 mb-6">
                  <span className="font-display font-black text-5xl gradient-text">₹{plan.price.toLocaleString('en-IN')}</span>
                  <span className="text-navy-400 text-sm mb-2">/ full course</span>
                </div>

                {/* What's included */}
                <div className="space-y-2 mb-7">
                  {included.map((item) => (
                    <div key={item} className="text-navy-300 text-sm">{item}</div>
                  ))}
                </div>

                {/* CTA */}
                <a
                  href="https://wa.me/916353709585?text=Hello%20Smit%20Sir%2C%20I%20want%20to%20enrol%20in%20the%20Online%20Batch."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary w-full flex items-center justify-center gap-2 text-sm"
                >
                  Enrol Now — ₹{plan.price.toLocaleString('en-IN')} <ArrowRight className="w-4 h-4" />
                </a>

                <p className="text-navy-500 text-xs text-center mt-3 flex items-center justify-center gap-1">
                  <Clock className="w-3 h-3" /> Limited seats — offer ends soon
                </p>
              </motion.div>
            ))}
          </div>

          <p className="text-center text-navy-500 text-sm mt-6">
            * Offline batch pricing available on enquiry · Combo discount for Class 11 + 12 available
          </p>
        </div>

        {/* CTA */}
        <div className="text-center glass-card p-8">
          <h3 className="font-display font-bold text-2xl text-white mb-3">Still Have Questions?</h3>
          <p className="text-navy-400 mb-6">Book a free demo class and decide after experiencing the teaching quality.</p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link to="/contact" className="btn-primary flex items-center gap-2">Book Free Demo Class <ArrowRight className="w-4 h-4" /></Link>
            <a href="https://wa.me/916353709585?text=Hello%20Smit%20Sir%2C%20I%20want%20to%20know%20about%20batch%20admission." className="btn-navy flex items-center gap-2">WhatsApp Us</a>
          </div>
        </div>
      </div>
    </div>
  );
}
