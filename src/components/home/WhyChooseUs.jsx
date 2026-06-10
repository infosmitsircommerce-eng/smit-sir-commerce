import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import {
  MessageSquareText, BookOpenCheck, NotebookPen, ClipboardCheck,
  PenLine, MessagesSquare, Globe2, Flame, MonitorSmartphone,
  BarChart3, UserCheck, Target,
} from 'lucide-react';

const reasons = [
  { icon: MessageSquareText,  title: 'Simple Language',         desc: 'Concepts in easy language — no confusion, just clarity.'          },
  { icon: BookOpenCheck,      title: 'NCERT & CBSE Focus',      desc: 'Every topic covered exactly as per CBSE NCERT syllabus.'          },
  { icon: NotebookPen,        title: 'Chapter-Wise Notes',      desc: 'Detailed notes, mind maps, and revision sheets for all subjects.' },
  { icon: ClipboardCheck,     title: 'Regular Quizzes & Tests', desc: 'Chapter tests, unit tests, and full-syllabus test series.'        },
  { icon: PenLine,            title: 'Exam Writing Practice',   desc: 'Board-style answer writing with proper format and scheme.'        },
  { icon: MessagesSquare,     title: 'Doubt Solving Support',   desc: 'All doubts resolved quickly — no question is too small.'          },
  { icon: Globe2,             title: 'Real-Life Examples',      desc: 'Practical examples from business and daily life.'                 },
  { icon: Flame,              title: 'Motivation & Discipline', desc: 'Guidance and motivation especially for weak students.'            },
  { icon: MonitorSmartphone,  title: 'Online + Offline',        desc: 'Flexible — classroom batches or learn from anywhere online.'      },
  { icon: BarChart3,          title: 'Performance Analysis',    desc: 'After every test, detailed analysis of strong and weak topics.'   },
  { icon: UserCheck,          title: 'Personal Guidance',       desc: 'Extra attention and personal support for students who need it.'   },
  { icon: Target,             title: 'Result-Oriented',         desc: 'Every effort focused on one goal — scoring better in boards.'     },
];

export default function WhyChooseUs() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '100px' });

  return (
    <section ref={ref} className="section-padding relative overflow-hidden"
      style={{ background: 'var(--bg-ivory)' }}>

      <div className="page-container relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-14"
        >
          <span className="eyebrow">Why Students Choose Us</span>
          <h2 className="headline mt-6">
            Why choose <em>Smit Sir Commerce?</em>
          </h2>
          <p className="max-w-2xl mx-auto text-base leading-relaxed mt-5" style={{ color: 'var(--muted)' }}>
            More than a coaching class — a complete learning system designed to give you the best possible result in CBSE Commerce.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {reasons.map((reason, i) => {
            const Icon = reason.icon;
            return (
              <motion.div
                key={reason.title}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: i * 0.04, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="group relative rounded-2xl p-5 cursor-default overflow-hidden"
                style={{
                  background: 'var(--bg-white)',
                  border: '1px solid var(--border)',
                  boxShadow: 'var(--shadow-sm)',
                  transition: 'transform 0.25s cubic-bezier(0.4,0,0.2,1), box-shadow 0.25s cubic-bezier(0.4,0,0.2,1), border-color 0.25s cubic-bezier(0.4,0,0.2,1)',
                }}
                whileHover={{ y: -4 }}
                onMouseEnter={e => {
                  e.currentTarget.style.boxShadow = 'var(--shadow-md)';
                  e.currentTarget.style.borderColor = 'rgba(184,135,47,0.35)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
                  e.currentTarget.style.borderColor = 'var(--border)';
                }}
              >
                {/* Index numeral, top-right */}
                <div aria-hidden="true" style={{
                  position: 'absolute', top: '14px', right: '16px',
                  fontFamily: 'var(--font-accent)', fontStyle: 'italic',
                  fontSize: '15px', color: 'var(--subtle)', opacity: 0.7,
                }}>{String(i + 1).padStart(2, '0')}</div>

                <div className="relative z-10">
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-4 transition-all duration-300 group-hover:scale-110"
                    style={{ background: 'var(--gold-bg)', border: '1px solid rgba(184,135,47,0.18)' }}>
                    <Icon style={{ width: '19px', height: '19px', color: 'var(--gold)' }} strokeWidth={1.8} />
                  </div>

                  <h3 className="mb-1.5 text-sm leading-snug" style={{ fontFamily: 'var(--font-serif)', fontWeight: 700, color: 'var(--ink)' }}>
                    {reason.title}
                  </h3>
                  <p className="text-xs leading-relaxed" style={{ color: 'var(--muted)' }}>{reason.desc}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
