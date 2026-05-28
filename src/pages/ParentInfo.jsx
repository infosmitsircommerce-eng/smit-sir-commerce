import { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, TrendingUp, Calendar, BarChart2, CreditCard, Phone, CheckCircle, Send, Users } from 'lucide-react';

const features = [
  { icon: TrendingUp, title: 'Student Progress', desc: 'Track your child\'s chapter completion and learning progress across all subjects.' },
  { icon: BarChart2, title: 'Test Performance', desc: 'View scores from chapter tests, unit tests, and mock board exams with detailed analysis.' },
  { icon: Calendar, title: 'Attendance Record', desc: 'Monitor class attendance for both online and offline batches.' },
  { icon: CreditCard, title: 'Fee Status', desc: 'Check fee payment status and upcoming payment reminders.' },
  { icon: Shield, title: 'Safe Learning', desc: 'Safe and structured learning environment — online or offline.' },
  { icon: Phone, title: 'Direct Contact', desc: 'Contact Smit Sir directly for updates, concerns, or guidance.' },
];

export default function ParentInfo() {
  const [form, setForm] = useState({ parentName: '', studentName: '', class: '', mobile: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="min-h-screen bg-navy-950">
      <div className="hero-bg py-16 border-b border-navy-800/50">
        <div className="page-container text-center">
          <div className="section-subheading">For Parents</div>
          <h1 className="section-heading text-4xl md:text-5xl">Parent <span className="gradient-text">Information</span></h1>
          <p className="text-navy-400 max-w-2xl mx-auto">
            We keep parents informed about student progress, test performance, discipline, attendance, and improvement areas.
          </p>
        </div>
      </div>

      <div className="page-container section-padding">
        {/* Trust message */}
        <div className="bg-gradient-to-r from-gold-500/10 to-gold-600/5 border border-gold-500/20 rounded-2xl p-8 mb-14 text-center">
          <Users className="w-12 h-12 text-gold-400 mx-auto mb-4" />
          <h2 className="font-display font-bold text-2xl text-white mb-3">Why Parents Trust Smit Sir Commerce</h2>
          <p className="text-navy-300 max-w-2xl mx-auto leading-relaxed">
            We understand that choosing the right coaching for your child is a major decision. At Smit Sir Commerce, parents are kept in the loop at every step. From regular test updates to progress reports and direct communication — we are transparent, responsible, and student-focused.
          </p>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-14">
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <motion.div key={f.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="card-premium">
                <div className="w-12 h-12 bg-gold-500/10 rounded-xl flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6 text-gold-400" />
                </div>
                <h3 className="font-semibold text-white mb-2">{f.title}</h3>
                <p className="text-navy-400 text-sm leading-relaxed">{f.desc}</p>
              </motion.div>
            );
          })}
        </div>

        {/* Student Progress Preview */}
        <div className="card-premium mb-14">
          <h3 className="font-display font-bold text-xl text-white mb-6">Sample Progress Report</h3>
          <div className="grid md:grid-cols-3 gap-4 mb-6">
            <div className="bg-navy-800/50 rounded-xl p-4 text-center">
              <div className="text-3xl font-bold text-gold-400">76%</div>
              <div className="text-navy-400 text-sm mt-1">Average Test Score</div>
            </div>
            <div className="bg-navy-800/50 rounded-xl p-4 text-center">
              <div className="text-3xl font-bold text-emerald-400">87%</div>
              <div className="text-navy-400 text-sm mt-1">Attendance This Month</div>
            </div>
            <div className="bg-navy-800/50 rounded-xl p-4 text-center">
              <div className="text-3xl font-bold text-blue-400">24</div>
              <div className="text-navy-400 text-sm mt-1">Lectures Completed</div>
            </div>
          </div>
          <div className="text-center text-navy-500 text-sm">
            * Full progress tracking will be available after student enrollment
          </div>
        </div>

        {/* Parent Enquiry Form */}
        <div className="grid lg:grid-cols-2 gap-10">
          <div>
            <h3 className="font-display font-bold text-2xl text-white mb-4">Parent Commitment</h3>
            <p className="text-navy-300 mb-6 leading-relaxed">
              We believe in building a strong three-way relationship between teacher, student, and parent. Your involvement is key to your child's success.
            </p>
            <ul className="space-y-3">
              {['Regular test performance updates', 'WhatsApp updates on batch activities', 'Direct contact with Smit Sir for concerns', 'Monthly progress summary', 'Immediate alert for attendance issues', 'Exam preparation guidance for parents'].map((item) => (
                <li key={item} className="flex items-start gap-3 text-navy-300 text-sm">
                  <CheckCircle className="w-4 h-4 text-gold-400 mt-0.5 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="card-premium">
            <h3 className="font-semibold text-white mb-5">Parent Enquiry Form</h3>
            {submitted ? (
              <div className="text-center py-6">
                <CheckCircle className="w-14 h-14 text-emerald-400 mx-auto mb-3" />
                <div className="text-white font-semibold">Thank you for reaching out!</div>
                <div className="text-navy-400 text-sm mt-1">We'll contact you within 24 hours.</div>
              </div>
            ) : (
              <form onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }} className="space-y-4">
                <div>
                  <label className="block text-navy-400 text-xs mb-1.5">Parent Name *</label>
                  <input required className="input-field" placeholder="Your name" value={form.parentName} onChange={(e) => setForm({...form, parentName: e.target.value})} />
                </div>
                <div>
                  <label className="block text-navy-400 text-xs mb-1.5">Student Name *</label>
                  <input required className="input-field" placeholder="Student's name" value={form.studentName} onChange={(e) => setForm({...form, studentName: e.target.value})} />
                </div>
                <div>
                  <label className="block text-navy-400 text-xs mb-1.5">Class</label>
                  <select className="input-field" value={form.class} onChange={(e) => setForm({...form, class: e.target.value})}>
                    <option value="">Select Class</option>
                    <option value="11">Class 11</option>
                    <option value="12">Class 12</option>
                  </select>
                </div>
                <div>
                  <label className="block text-navy-400 text-xs mb-1.5">Mobile Number *</label>
                  <input required type="tel" className="input-field" placeholder="+91 XXXXX XXXXX" value={form.mobile} onChange={(e) => setForm({...form, mobile: e.target.value})} />
                </div>
                <div>
                  <label className="block text-navy-400 text-xs mb-1.5">Message</label>
                  <textarea className="input-field resize-none" rows={3} placeholder="Your question or concern..." value={form.message} onChange={(e) => setForm({...form, message: e.target.value})} />
                </div>
                <button type="submit" className="btn-primary w-full flex items-center justify-center gap-2">
                  <Send className="w-4 h-4" /> Send Enquiry
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
