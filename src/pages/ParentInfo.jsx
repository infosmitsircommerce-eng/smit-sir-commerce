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

export default function ParentInfo() {
  const [form, setForm] = useState({ parentName: '', studentName: '', class: '', mobile: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-ivory)' }}>
      <div className="page-hero">
        <div className="page-container text-center">
          <span className="eyebrow">For Parents</span>
          <h1 className="mt-5">Parent <em>information.</em></h1>
          <p className="mx-auto">
            We keep parents informed about student progress, test performance, discipline, attendance, and improvement areas.
          </p>
        </div>
      </div>

      <div className="page-container section-padding">
        {/* Trust message */}
        <div className="rounded-2xl p-8 mb-14 text-center"
          style={{ background: 'var(--gold-bg)', border: '1px solid rgba(184,135,47,0.25)' }}>
          <Users className="w-12 h-12 mx-auto mb-4" style={{ color: 'var(--gold)' }} strokeWidth={1.5} />
          <h2 className="text-2xl mb-3" style={{ fontFamily: 'var(--font-serif)', fontWeight: 700, color: 'var(--ink)' }}>Why parents trust Smit Sir Commerce</h2>
          <p className="max-w-2xl mx-auto leading-relaxed" style={{ color: 'var(--charcoal)' }}>
            We understand that choosing the right coaching for your child is a major decision. At Smit Sir Commerce, parents are kept in the loop at every step. From regular test updates to progress reports and direct communication — we are transparent, responsible, and student-focused.
          </p>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-14">
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <motion.div key={f.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="card-paper p-5">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                  style={{ background: 'var(--gold-bg)', border: '1px solid rgba(184,135,47,0.18)' }}>
                  <Icon className="w-6 h-6" style={{ color: 'var(--gold)' }} strokeWidth={1.8} />
                </div>
                <h3 className="mb-2" style={{ fontFamily: 'var(--font-serif)', fontWeight: 700, color: 'var(--ink)' }}>{f.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--muted)' }}>{f.desc}</p>
              </motion.div>
            );
          })}
        </div>

        {/* Student Progress Preview */}
        <div className="card-paper p-7 mb-14">
          <h3 className="text-xl mb-6" style={{ fontFamily: 'var(--font-serif)', fontWeight: 700, color: 'var(--ink)' }}>Sample progress report</h3>
          <div className="grid md:grid-cols-3 gap-4 mb-6">
            {[
              { value: '76%', label: 'Average Test Score',     color: 'var(--gold)'     },
              { value: '87%', label: 'Attendance This Month',  color: 'var(--green)'    },
              { value: '24',  label: 'Lectures Completed',     color: 'var(--charcoal)' },
            ].map(s => (
              <div key={s.label} className="tile-paper rounded-xl p-4 text-center">
                <div className="text-3xl" style={{ fontFamily: 'var(--font-serif)', fontWeight: 700, color: s.color }}>{s.value}</div>
                <div className="text-sm mt-1" style={{ color: 'var(--muted)' }}>{s.label}</div>
              </div>
            ))}
          </div>
          <div className="text-center text-sm" style={{ color: 'var(--subtle)' }}>
            * Full progress tracking will be available after student enrollment
          </div>
        </div>

        {/* Parent Enquiry Form */}
        <div className="grid lg:grid-cols-2 gap-10">
          <div>
            <h3 className="text-2xl mb-4" style={{ fontFamily: 'var(--font-serif)', fontWeight: 700, color: 'var(--ink)' }}>Parent commitment</h3>
            <p className="mb-6 leading-relaxed" style={{ color: 'var(--charcoal)' }}>
              We believe in building a strong three-way relationship between teacher, student, and parent. Your involvement is key to your child's success.
            </p>
            <ul className="space-y-3">
              {['Regular test performance updates', 'WhatsApp updates on batch activities', 'Direct contact with Smit Sir for concerns', 'Monthly progress summary', 'Immediate alert for attendance issues', 'Exam preparation guidance for parents'].map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm" style={{ color: 'var(--charcoal)' }}>
                  <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: 'var(--gold)' }} />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="card-paper p-7">
            <h3 className="font-semibold mb-5" style={{ fontFamily: 'var(--font-serif)', fontWeight: 700, color: 'var(--ink)' }}>Parent enquiry form</h3>
            {submitted ? (
              <div className="text-center py-6">
                <CheckCircle className="w-14 h-14 mx-auto mb-3" style={{ color: 'var(--green)' }} strokeWidth={1.5} />
                <div className="font-semibold" style={{ color: 'var(--ink)' }}>Thank you for reaching out!</div>
                <div className="text-sm mt-1" style={{ color: 'var(--muted)' }}>We'll contact you within 24 hours.</div>
              </div>
            ) : (
              <form onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }} className="space-y-4">
                <div>
                  <label style={labelStyle}>Parent Name *</label>
                  <input required style={inputStyle} placeholder="Your name" value={form.parentName} onChange={(e) => setForm({...form, parentName: e.target.value})} />
                </div>
                <div>
                  <label style={labelStyle}>Student Name *</label>
                  <input required style={inputStyle} placeholder="Student's name" value={form.studentName} onChange={(e) => setForm({...form, studentName: e.target.value})} />
                </div>
                <div>
                  <label style={labelStyle}>Class</label>
                  <select style={inputStyle} value={form.class} onChange={(e) => setForm({...form, class: e.target.value})}>
                    <option value="">Select Class</option>
                    <option value="11">Class 11</option>
                    <option value="12">Class 12</option>
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Mobile Number *</label>
                  <input required type="tel" style={inputStyle} placeholder="+91 XXXXX XXXXX" value={form.mobile} onChange={(e) => setForm({...form, mobile: e.target.value})} />
                </div>
                <div>
                  <label style={labelStyle}>Message</label>
                  <textarea rows={3} style={{ ...inputStyle, resize: 'none' }} placeholder="Your question or concern..." value={form.message} onChange={(e) => setForm({...form, message: e.target.value})} />
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
