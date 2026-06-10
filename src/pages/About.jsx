import SEO from '../components/ui/SEO';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  GraduationCap, Target, BookOpen, Users, ArrowRight, Award, Star, TrendingUp,
  Lightbulb, Globe2, BarChart3, HeartHandshake, RefreshCw, MapPin,
} from 'lucide-react';
import teacherPhoto from '../assets/teacher-photo-opt.jpg';

const values = [
  { icon: Target,        title: 'Result-Oriented',     desc: 'Every class, note, and test is designed to directly improve your board exam score.' },
  { icon: Lightbulb,     title: 'Concept Clarity',     desc: 'No rote learning. Every concept is explained until it makes complete sense.' },
  { icon: Globe2,        title: 'Real Examples',       desc: 'Real-world business and economics examples to make concepts memorable.' },
  { icon: BarChart3,     title: 'Data-Driven',         desc: 'Performance tracked through tests and analysis to identify improvement areas.' },
  { icon: HeartHandshake,title: 'Student-Friendly',    desc: 'Supportive, pressure-free environment where questions are always welcome.' },
  { icon: RefreshCw,     title: 'Continuous Revision', desc: 'Regular revision sessions, mind maps, and quick notes before exams.' },
];

const credentials = [
  { icon: GraduationCap, label: 'Specialisation',  value: 'CBSE Commerce — Class 11 & 12' },
  { icon: BookOpen,      label: 'Subjects Taught', value: 'Economics · Accountancy · Business Studies · Entrepreneurship' },
  { icon: Users,         label: 'Students Taught', value: '200+ Students — Online & Offline' },
  { icon: TrendingUp,    label: 'Top Result',      value: '95% — Heer Patel, Economics Class 12' },
  { icon: Award,         label: 'Teaching Mode',   value: 'Online (Pan India) + Offline (Mehsana, Gujarat)' },
  { icon: Star,          label: 'Student Rating',  value: '5★ Average from 200+ Students' },
];

const serifH2 = { fontFamily: 'var(--font-serif)', fontWeight: 700, color: 'var(--ink)', letterSpacing: '-0.02em' };

export default function About() {
  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-ivory)' }}>
      <SEO
        title="About Smit Sir — Commerce Teacher Mehsana"
        description="Meet Smit Sir — expert CBSE Commerce teacher in Mehsana, Gujarat. 200+ students trained, 91% score above 80%. Learn about our teaching approach and results."
        path="/about"
      />
      {/* Hero */}
      <div className="page-hero">
        <div className="page-container text-center">
          <span className="eyebrow">Our Story</span>
          <h1 className="mt-5">About <em>Smit Sir Commerce.</em></h1>
        </div>
      </div>

      <div className="page-container section-padding space-y-20">

        {/* ── Meet the Teacher ── */}
        <div>
          <div className="text-center mb-12">
            <span className="eyebrow">Meet Your Teacher</span>
            <h2 className="headline mt-6">The person behind <em>Smit Sir Commerce.</em></h2>
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
                {/* Offset gold frame */}
                <div aria-hidden="true" className="absolute inset-0 rounded-2xl pointer-events-none"
                  style={{ transform: 'translate(14px, 14px)', border: '1px solid rgba(184,135,47,0.4)' }} />
                <div className="relative rounded-2xl overflow-hidden"
                  style={{ border: '1px solid var(--border)', boxShadow: '0 24px 64px rgba(30,24,18,0.14)' }}>
                  <div style={{ height: '3px', background: 'linear-gradient(90deg, var(--gold), var(--gold-soft), var(--gold))' }} />
                  <img
                    src={teacherPhoto}
                    alt="Smit Sir — Commerce Teacher Mehsana"
                    loading="lazy"
                    decoding="async"
                    className="w-full object-cover object-top"
                    style={{ maxHeight: '420px' }}
                  />
                  <div className="flex items-center justify-between gap-3 p-4" style={{ background: 'var(--bg-white)' }}>
                    <div>
                      <div className="text-sm" style={{ fontFamily: 'var(--font-serif)', fontWeight: 700, color: 'var(--ink)' }}>Smit Sir</div>
                      <div className="text-xs" style={{ color: 'var(--gold)' }}>Commerce Expert · Class 11 &amp; 12 CBSE</div>
                      <div className="text-xs flex items-center gap-1 mt-0.5" style={{ color: 'var(--subtle)' }}>
                        <MapPin className="w-3 h-3" /> Mehsana, Gujarat
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold flex-shrink-0"
                      style={{ background: 'rgba(77,124,15,0.08)', border: '1px solid rgba(77,124,15,0.25)', color: 'var(--green)' }}>
                      <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: 'var(--green)' }} />
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
              <p className="leading-relaxed mb-6 text-base" style={{ color: 'var(--charcoal)' }}>
                Smit Sir is a dedicated CBSE Commerce educator based in Mehsana, Gujarat, specialising in Class 11 and 12. With a passion for making complex subjects like Accountancy and Economics genuinely understandable, he has helped 200+ students achieve outstanding results in CBSE board exams.
              </p>
              <p className="leading-relaxed mb-8 text-sm" style={{ color: 'var(--muted)' }}>
                His teaching approach focuses on concept clarity first, then exam application — using real-life business examples, structured notes, regular testing, and personal attention for every student. Both online and offline batches are available to ensure no student is left behind regardless of location.
              </p>

              <div className="space-y-3">
                {credentials.map(({ icon: Icon, label, value }) => (
                  <div key={label} className="flex items-start gap-3 p-3.5 rounded-xl"
                    style={{ background: 'var(--bg-white)', border: '1px solid var(--border)' }}>
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                      style={{ background: 'var(--gold-bg)' }}>
                      <Icon className="w-4 h-4" style={{ color: 'var(--gold)' }} strokeWidth={1.8} />
                    </div>
                    <div>
                      <div className="text-xs font-medium uppercase tracking-wide mb-0.5" style={{ color: 'var(--subtle)' }}>{label}</div>
                      <div className="text-sm font-medium" style={{ color: 'var(--ink)' }}>{value}</div>
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
            <span className="eyebrow">Our Mission</span>
            <h2 className="headline mt-6 mb-5">Commerce education that <em>makes a difference.</em></h2>
            <p className="leading-relaxed mb-4" style={{ color: 'var(--charcoal)' }}>
              Smit Sir Commerce was created with one clear goal — to make Class 11 and 12 CBSE Commerce education genuinely effective, accessible, and result-oriented.
            </p>
            <p className="leading-relaxed mb-4" style={{ color: 'var(--muted)' }}>
              Too many students fear Commerce subjects like Accountancy and Economics because they never got proper conceptual clarity. This platform exists to change that — through chapter-wise lectures, smart study material, regular testing, and personal guidance.
            </p>
            <p className="leading-relaxed mb-6" style={{ color: 'var(--muted)' }}>
              Whether you prefer classroom learning or online study from home, Smit Sir Commerce is designed to give every student the best possible preparation for CBSE board exams.
            </p>
            <Link to="/contact" className="btn-primary flex items-center gap-2 w-fit">
              Join Smit Sir Commerce <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="space-y-4">
            {[
              { icon: Target,        title: 'CBSE Focused',     desc: 'Every resource is built around CBSE board exam patterns and NCERT curriculum.' },
              { icon: BookOpen,      title: 'Complete Content', desc: 'Lectures, notes, quizzes, tests, mind maps — everything in one platform.' },
              { icon: Users,         title: 'Online + Offline', desc: 'Flexible batches for students in the city and across India.' },
              { icon: GraduationCap, title: 'Expert Teaching',  desc: '200+ students successfully prepared for CBSE board exams.' },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="card-paper flex items-start gap-4 p-5">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ background: 'var(--gold-bg)', border: '1px solid rgba(184,135,47,0.18)' }}>
                    <Icon className="w-5 h-5" style={{ color: 'var(--gold)' }} strokeWidth={1.8} />
                  </div>
                  <div>
                    <div className="mb-1" style={{ fontFamily: 'var(--font-serif)', fontWeight: 700, color: 'var(--ink)' }}>{item.title}</div>
                    <div className="text-sm" style={{ color: 'var(--muted)' }}>{item.desc}</div>
                  </div>
                </div>
              );
            })}
          </motion.div>
        </div>

        {/* ── Core Values ── */}
        <div>
          <div className="text-center mb-10">
            <span className="eyebrow">What We Stand For</span>
            <h2 className="headline mt-6">Our <em>core values.</em></h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
            {values.map((v, i) => {
              const Icon = v.icon;
              return (
                <motion.div key={v.title}
                  initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                  className="card-paper p-5">
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-3"
                    style={{ background: 'var(--gold-bg)', border: '1px solid rgba(184,135,47,0.18)' }}>
                    <Icon className="w-5 h-5" style={{ color: 'var(--gold)' }} strokeWidth={1.8} />
                  </div>
                  <h3 className="mb-2 text-sm" style={{ fontFamily: 'var(--font-serif)', fontWeight: 700, color: 'var(--ink)' }}>{v.title}</h3>
                  <p className="text-sm" style={{ color: 'var(--muted)' }}>{v.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* ── Subjects ── */}
        <div className="card-paper p-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl mb-2" style={serifH2}>Subjects we teach</h2>
            <p style={{ color: 'var(--muted)' }}>Complete CBSE Commerce curriculum for Class 11 and 12</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {['Accountancy', 'Business Studies', 'Economics', 'Entrepreneurship', 'Physical Education'].map((subject) => (
              <div key={subject} className="tile-paper text-center p-4">
                <div className="font-semibold text-sm" style={{ color: 'var(--gold)' }}>{subject}</div>
                <div className="text-xs mt-1" style={{ color: 'var(--subtle)' }}>Class 11 &amp; 12</div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
