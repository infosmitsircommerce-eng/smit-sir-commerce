import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Brain, Lightbulb, MessageCircleQuestion, Sparkles } from 'lucide-react';

const pillars = [
  {
    icon: Brain,
    title: 'Understand',
    text: 'No blind memorisation. Build the concept from the ground up and understand why it works.',
  },
  {
    icon: MessageCircleQuestion,
    title: 'Question',
    text: '“Why?” is welcome here. Good learning starts when students feel free to ask and explore.',
  },
  {
    icon: Sparkles,
    title: 'Enjoy',
    text: 'Learning becomes easier when curiosity replaces unnecessary fear and pressure.',
  },
];

const brandLines = [
  'In a world chasing marks, choose understanding.',
  'Don’t just study Commerce. Understand it.',
  'Marks measure a paper. Learning changes a mind.',
  'Understand first. Perform better.',
  'Learning with Fun. Marks as a Result.',
];

export default function LearningPhilosophy() {
  return (
    <section className="section-padding" style={{ background: 'linear-gradient(180deg, #fffdf8 0%, #fff7e7 100%)' }}>
      <div className="page-container">
        <div className="grid lg:grid-cols-[1.05fr_0.95fr] gap-8 lg:gap-12 items-start">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.55 }}
          >
            <span className="eyebrow">THE SMIT SIR COMMERCE PHILOSOPHY</span>
            <h2 className="mt-5 text-4xl sm:text-5xl leading-tight" style={{ fontFamily: 'var(--font-serif)', color: 'var(--ink)' }}>
              Education should create
              <span style={{ display: 'block', color: 'var(--gold)' }}>understanding — not just answers.</span>
            </h2>
            <p className="mt-5 text-base sm:text-lg leading-8 max-w-2xl" style={{ color: 'var(--muted)' }}>
              Marks matter, but they are the outcome — not the entire purpose of learning. The real goal is to understand the “why”, connect ideas to real life, ask better questions, and become confident enough to think for yourself.
            </p>
            <div className="mt-7 rounded-2xl p-5 sm:p-6" style={{ background: 'rgba(255,255,255,0.82)', border: '1px solid #E8D7AA', boxShadow: '0 18px 45px rgba(122,90,30,0.08)' }}>
              <div className="flex items-start gap-3">
                <Lightbulb className="w-5 h-5 mt-1 flex-shrink-0" style={{ color: 'var(--gold)' }} />
                <div>
                  <div className="text-xl sm:text-2xl font-semibold" style={{ fontFamily: 'var(--font-serif)', color: 'var(--ink)' }}>
                    Commerce should make sense before it makes marks.
                  </div>
                  <p className="mt-2 text-sm sm:text-base leading-7" style={{ color: 'var(--muted)' }}>
                    Learn with clarity. Practise with confidence. Let better performance grow from real understanding.
                  </p>
                </div>
              </div>
            </div>
            <div className="flex flex-wrap gap-3 mt-7">
              <Link to="/cbse-notes" className="btn-primary inline-flex items-center gap-2">
                Start Learning Free <ArrowRight className="w-4 h-4" />
              </Link>
              <Link to="/book-demo" className="btn-secondary inline-flex items-center gap-2">
                Experience a Free Demo
              </Link>
            </div>
          </motion.div>

          <div className="space-y-4">
            {pillars.map((pillar, index) => {
              const Icon = pillar.icon;
              return (
                <motion.div
                  key={pillar.title}
                  initial={{ opacity: 0, x: 18 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.25 }}
                  transition={{ duration: 0.45, delay: index * 0.08 }}
                  className="card-paper p-5 sm:p-6"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'var(--gold-bg)' }}>
                      <Icon className="w-5 h-5" style={{ color: 'var(--gold)' }} />
                    </div>
                    <div>
                      <h3 className="text-2xl" style={{ fontFamily: 'var(--font-serif)', color: 'var(--ink)' }}>{pillar.title}</h3>
                      <p className="mt-2 leading-7 text-sm sm:text-base" style={{ color: 'var(--muted)' }}>{pillar.text}</p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        <div className="mt-12 sm:mt-16">
          <div className="text-center mb-6">
            <span className="eyebrow">WORDS WE WANT STUDENTS TO REMEMBER</span>
          </div>
          <div className="grid md:grid-cols-5 gap-3">
            {brandLines.map((line, index) => (
              <div
                key={line}
                className="rounded-2xl p-5 min-h-[150px] flex flex-col justify-between"
                style={{
                  background: index === 0 ? 'linear-gradient(145deg, #1d2738 0%, #2c3b50 100%)' : 'rgba(255,255,255,0.84)',
                  border: index === 0 ? '1px solid rgba(213,164,56,0.45)' : '1px solid #E7E2D8',
                  boxShadow: '0 14px 34px rgba(16,24,40,0.07)',
                }}
              >
                <div className="text-xs font-bold tracking-[0.16em] uppercase" style={{ color: index === 0 ? '#E7C56B' : 'var(--gold)' }}>
                  0{index + 1}
                </div>
                <p className="mt-5 text-lg leading-7" style={{ fontFamily: 'var(--font-serif)', color: index === 0 ? '#fffdf8' : 'var(--ink)' }}>
                  {line}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
