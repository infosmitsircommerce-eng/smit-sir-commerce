import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight, Lightbulb, ClipboardList, MessageCircleQuestion,
  Library, Users, LineChart, CheckCircle2,
} from 'lucide-react';

const bullets = [
  {
    icon: Lightbulb,
    title: 'Concept-First Teaching',
    desc: 'No rote learning. Every chapter in Accountancy, Economics, and Business Studies is explained until you truly understand it — not just memorise it.',
  },
  {
    icon: ClipboardList,
    title: 'Chapter Tests + Full Mock Papers',
    desc: 'Regular chapter-wise tests after every topic, plus full-syllabus pre-board mock papers — exactly like CBSE board pattern.',
  },
  {
    icon: MessageCircleQuestion,
    title: 'Doubt Solving — After Class & on WhatsApp',
    desc: 'Ask doubts in class, after class, or on WhatsApp. No question is ignored. Our AI Doubt Solver is also available 24/7 on this website.',
  },
  {
    icon: Library,
    title: 'Complete Notes + PYQ Practice',
    desc: 'Chapter-wise PDF notes, mind maps, revision sheets, important questions, and 10 years of previous year question papers — all in one place.',
  },
  {
    icon: Users,
    title: 'Separate Batches for Class 11 & Class 12',
    desc: 'Dedicated batches for Class 11 and Class 12 — online (pan India) and offline (Mehsana). English medium focus, small batch size for personal attention.',
  },
  {
    icon: LineChart,
    title: 'Performance Tracking After Every Test',
    desc: 'After each test, get a detailed analysis of your strong and weak topics so you always know exactly what to improve next.',
  },
];

export default function WhatYouGet() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '80px' });

  return (
    <section ref={ref} className="section-padding"
      style={{ background: 'var(--bg-cream)' }}>
      <div className="page-container">

        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <span className="eyebrow">What You Get</span>
          <h2 className="headline mt-6">
            Why join <em>Smit Sir Commerce?</em>
          </h2>
          <p className="max-w-2xl mx-auto mt-4 text-base leading-relaxed" style={{ color: 'var(--muted)' }}>
            Everything you need to score 90+ in CBSE Commerce boards — in one structured, guided programme.
          </p>
        </motion.div>

        {/* Bullets grid */}
        <div className="grid md:grid-cols-2 gap-4 max-w-4xl mx-auto mb-12">
          {bullets.map((b, i) => {
            const Icon = b.icon;
            return (
              <motion.div
                key={b.title}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: i * 0.07, duration: 0.5 }}
                className="flex items-start gap-4 p-5 rounded-2xl"
                style={{
                  background: 'var(--bg-white)',
                  border: '1px solid var(--border)',
                  boxShadow: 'var(--shadow-sm)',
                  transition: 'border-color 0.25s, box-shadow 0.25s',
                }}
                whileHover={{ y: -3 }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = 'rgba(184,135,47,0.35)';
                  e.currentTarget.style.boxShadow = 'var(--shadow-md)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = 'var(--border)';
                  e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
                }}
              >
                <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: 'var(--gold-bg)', border: '1px solid rgba(184,135,47,0.18)' }}>
                  <Icon style={{ width: '19px', height: '19px', color: 'var(--gold)' }} strokeWidth={1.8} />
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" style={{ color: 'var(--green)' }} />
                    <h3 className="text-sm" style={{ fontFamily: 'var(--font-serif)', fontWeight: 700, color: 'var(--ink)' }}>{b.title}</h3>
                  </div>
                  <p className="text-xs leading-relaxed" style={{ color: 'var(--muted)' }}>{b.desc}</p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="flex flex-col sm:flex-row gap-3 justify-center items-center"
        >
          <Link to="/contact" className="btn-primary flex items-center gap-2 group">
            Book Free Demo Class
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link to="/courses" className="btn-outline-ink flex items-center gap-2">
            View All Courses
          </Link>
        </motion.div>

      </div>
    </section>
  );
}
