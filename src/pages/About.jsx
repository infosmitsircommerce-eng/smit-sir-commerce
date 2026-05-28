import SEO from '../components/ui/SEO';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { GraduationCap, Target, BookOpen, Users, ArrowRight, CheckCircle, Award, Star, TrendingUp } from 'lucide-react';
import teacherPhoto from '../assets/teacher-photo-opt.jpg';

const values = [
  { icon: '🎯', title: 'Result-Oriented',     desc: 'Every class, note, and test is designed to directly improve your board exam score.' },
  { icon: '💡', title: 'Concept Clarity',     desc: 'No rote learning. Every concept is explained until it makes complete sense.' },
  { icon: '🌍', title: 'Real Examples',       desc: 'Real-world business and economics examples to make concepts memorable.' },
  { icon: '📊', title: 'Data-Driven',         desc: 'Performance tracked through tests and analysis to identify improvement areas.' },
  { icon: '👥', title: 'Student-Friendly',    desc: 'Supportive, pressure-free environment where questions are always welcome.' },
  { icon: '🔄', title: 'Continuous Revision', desc: 'Regular revision sessions, mind maps, and quick notes before exams.' },
];

const credentials = [
  { icon: GraduationCap, label: 'Specialisation',    value: 'CBSE Commerce — Class 11 & 12' },
  { icon: BookOpen,      label: 'Subjects Taught',   value: 'Economics · Accountancy · Business Studies · Entrepreneurship' },
  { icon: Users,         label: 'Students Taught',   value: '200+ Students — Online & Offline' },
  { icon: TrendingUp,    label: 'Top Result',         value: '95% — Heer Patel, Economics Class 12' },
  { icon: Award,         label: 'Teaching Mode',      value: 'Online (Pan India) + Offline (Mehsana, Gujarat)' },
  { icon: Star,          label: 'Student Rating',     value: '5★ Average from 200+ Students' },
];

export default function About() {
  return (
    <div className="min-h-screen bg-navy-950">
      <SEO
        title="About Smit Sir — Commerce Teacher Mehsana"
        description="Meet Smit Sir — expert CBSE Commerce teacher in Mehsana, Gujarat. 200+ students trained, 91% score above 80%. Learn about our teaching approach and results."
        path="/about"
      />
      {/* Hero */}
      <div className="hero-bg py-16 border-b border-navy-800/50">
        <div className="page-container text-center">
          <div className="section-subheading">Our Story</div>
          <h1 className="section-heading text-4xl md:text-5xl">
            About <span className="gradient-text">Smit Sir Commerce</span>
          </h1>
        </div>
      </div>

      <div className="page-container section-padding space-y-20">

        {/* ── Meet the Teacher ── */}
        <div>
          <div className="text-center mb-12">
            <div className="section-subheading">Meet Your Teacher</div>
            <h2 className="section-heading">The Person Behind <span className="gradient-text">Smit Sir Commerce</span></h2>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Photo */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="flex justify-center lg:justify-start"
            >
              <div className="relative w-full max-w-sm">
                <div className="absolute inset-0 rounded-2xl blur-2xl opacity-20"
                  style={{ background: 'radial-gradient(ellipse, rgba(245,158,11,0.6) 0%, transparent 70%)' }} />
                <div className="relative rounded-2xl overflow-hidden"
                  style={{ border: '1px solid rgba(212,175,55,0.35)', boxShadow: '0 20px 60px rgba(0,0,0,0.4)' }}>
                  <img
                    src={teacherPhoto}
                    alt="Smit Sir — Commerce Teacher Mehsana"
                    loading="lazy"
                    decoding="async"
                    className="w-full object-cover object-top"
                    style={{ maxHeight: '420px' }}
                  />
                  <div className="absolute bottom-0 left-0 right-0 h-28 pointer-events-none"
                    style={{ background: 'linear-gradient(to top, rgba(8,6,32,0.95) 0%, transparent 100%)' }} />
                  <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                    <div>
                      <div className="font-display font-bold text-white text-sm">Smit Sir</div>
                      <div className="text-gold-400 text-xs">Commerce Expert · Class 11 & 12 CBSE</div>
                      <div className="text-navy-400 text-xs">📍 Mehsana, Gujarat</div>
                    </div>
                    <div className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold"
                      style={{ background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.3)', color: '#34d399' }}>
                      <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                      Active
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Credentials */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <p className="text-navy-300 leading-relaxed mb-6 text-base">
                Smit Sir is a dedicated CBSE Commerce educator based in Mehsana, Gujarat, specialising in Class 11 and 12. With a passion for making complex subjects like Accountancy and Economics genuinely understandable, he has helped 200+ students achieve outstanding results in CBSE board exams.
              </p>
              <p className="text-navy-400 leading-relaxed mb-8 text-sm">
                His teaching approach focuses on concept clarity first, then exam application — using real-life business examples, structured notes, regular testing, and personal attention for every student. Both online and offline batches are available to ensure no student is left behind regardless of location.
              </p>

              <div className="space-y-3">
                {credentials.map(({ icon: Icon, label, value }) => (
                  <div key={label} className="flex items-start gap-3 p-3.5 rounded-xl"
                    style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                      style={{ background: 'rgba(245,158,11,0.1)' }}>
                      <Icon className="w-4 h-4 text-gold-400" />
                    </div>
                    <div>
                      <div className="text-navy-400 text-xs font-medium uppercase tracking-wide mb-0.5">{label}</div>
                      <div className="text-white text-sm font-medium">{value}</div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>

        {/* ── Mission ── */}
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <div className="section-subheading">Our Mission</div>
            <h2 className="section-heading">Commerce Education That <span className="gradient-text">Makes a Difference</span></h2>
            <p className="text-navy-300 leading-relaxed mb-4">
              Smit Sir Commerce was created with one clear goal — to make Class 11 and 12 CBSE Commerce education genuinely effective, accessible, and result-oriented.
            </p>
            <p className="text-navy-300 leading-relaxed mb-4">
              Too many students fear Commerce subjects like Accountancy and Economics because they never got proper conceptual clarity. This platform exists to change that — through chapter-wise lectures, smart study material, regular testing, and personal guidance.
            </p>
            <p className="text-navy-300 leading-relaxed mb-6">
              Whether you prefer classroom learning or online study from home, Smit Sir Commerce is designed to give every student the best possible preparation for CBSE board exams.
            </p>
            <Link to="/contact" className="btn-primary flex items-center gap-2 w-fit">
              Join Smit Sir Commerce <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="space-y-4">
            {[
              { icon: Target,       title: 'CBSE Focused',    desc: 'Every resource is built around CBSE board exam patterns and NCERT curriculum.' },
              { icon: BookOpen,     title: 'Complete Content', desc: 'Lectures, notes, quizzes, tests, mind maps — everything in one platform.' },
              { icon: Users,        title: 'Online + Offline', desc: 'Flexible batches for students in the city and across India.' },
              { icon: GraduationCap,title: 'Expert Teaching',  desc: '200+ students successfully prepared for CBSE board exams.' },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="flex items-start gap-4 card-premium">
                  <div className="w-10 h-10 bg-gold-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Icon className="w-5 h-5 text-gold-400" />
                  </div>
                  <div>
                    <div className="font-semibold text-white mb-1">{item.title}</div>
                    <div className="text-navy-400 text-sm">{item.desc}</div>
                  </div>
                </div>
              );
            })}
          </motion.div>
        </div>

        {/* ── Core Values ── */}
        <div>
          <div className="text-center mb-10">
            <div className="section-subheading">What We Stand For</div>
            <h2 className="section-heading">Our <span className="gradient-text">Core Values</span></h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
            {values.map((v, i) => (
              <motion.div key={v.title}
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                className="card-premium">
                <div className="text-3xl mb-3">{v.icon}</div>
                <h3 className="font-semibold text-white mb-2">{v.title}</h3>
                <p className="text-navy-400 text-sm">{v.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* ── Subjects ── */}
        <div className="glass-card p-8">
          <div className="text-center mb-8">
            <h2 className="font-display font-bold text-2xl text-white mb-2">Subjects We Teach</h2>
            <p className="text-navy-400">Complete CBSE Commerce curriculum for Class 11 and 12</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {['Accountancy', 'Business Studies', 'Economics', 'Entrepreneurship', 'Physical Education'].map((subject) => (
              <div key={subject} className="text-center p-4 bg-navy-800/50 rounded-xl hover:bg-navy-700/50 transition-colors">
                <div className="text-gold-400 font-semibold text-sm">{subject}</div>
                <div className="text-navy-500 text-xs mt-1">Class 11 &amp; 12</div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
