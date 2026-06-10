import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  CheckCircle2, ArrowRight, Lightbulb, Globe2, Target, UserCheck,
  ClipboardList, MessageCircleQuestion, RefreshCw, BarChart3,
} from 'lucide-react';

const features = [
  { icon: Lightbulb,              title: 'Simple Explanation',  desc: 'Complex concepts made easy'          },
  { icon: Globe2,                 title: 'Real-Life Examples',  desc: 'Business & economy connections'       },
  { icon: Target,                 title: 'Board Exam Focus',    desc: 'CBSE pattern and marking scheme'      },
  { icon: UserCheck,              title: 'Personal Guidance',   desc: 'Individual attention to each student' },
  { icon: ClipboardList,          title: 'Regular Practice',    desc: 'Daily questions and exercises'        },
  { icon: MessageCircleQuestion,  title: 'Doubt Solving',       desc: 'No question left unanswered'          },
  { icon: RefreshCw,              title: 'Smart Revision',      desc: 'Mind maps and quick notes'            },
  { icon: BarChart3,              title: 'Test-Based Prep',     desc: 'Track progress through tests'         },
];

export default function AboutSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '100px' });

  return (
    <section ref={ref} className="section-padding" style={{ background: 'var(--bg-white)' }}>
      <div className="page-container">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">

          {/* Left */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="eyebrow">About Smit Sir Commerce</span>

            <h2 className="headline mt-6 mb-5">Commerce education <em>that actually works.</em></h2>

            <p className="leading-relaxed mb-4 text-base" style={{ color: 'var(--charcoal)' }}>
              Smit Sir is a dedicated CBSE Commerce educator based in Mehsana, Gujarat — specialising in Class 11 and Class 12 Accountancy, Economics, Business Studies, and Entrepreneurship. With 200+ students trained and a 5★ average rating, he is known for making complex subjects genuinely simple.
            </p>
            <p className="leading-relaxed mb-4 text-sm" style={{ color: 'var(--muted)' }}>
              His teaching style focuses on <strong style={{ color: 'var(--ink)' }}>concept clarity first, exam application second</strong> — using real-life business examples, structured CBSE-pattern notes, regular testing, and personal attention for every student.
            </p>
            <p className="leading-relaxed mb-7 text-sm" style={{ color: 'var(--muted)' }}>
              Both <strong style={{ color: 'var(--ink)' }}>online batches (pan India)</strong> and <strong style={{ color: 'var(--ink)' }}>offline batches (Mehsana)</strong> are available — so no student is left behind regardless of location.
            </p>

            <div className="flex flex-wrap gap-x-5 gap-y-2 mb-8">
              {['NCERT Based', 'Board Exam Focused', 'Concept Clarity', 'Regular Tests'].map((tag) => (
                <span key={tag} className="flex items-center gap-1.5 text-sm font-medium" style={{ color: 'var(--gold)' }}>
                  <CheckCircle2 className="w-3.5 h-3.5" style={{ color: 'var(--gold)' }} />
                  {tag}
                </span>
              ))}
            </div>

            <Link to="/about" className="btn-primary flex items-center gap-2 w-fit group">
              Learn More About Us
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>

          {/* Right — Feature Grid */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="grid grid-cols-2 gap-3"
          >
            {features.map((f, i) => {
              const Icon = f.icon;
              return (
                <motion.div
                  key={f.title}
                  initial={{ opacity: 0, y: 16 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.05 * i, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  className="rounded-xl p-4 hover:-translate-y-0.5 transition-all duration-300"
                  style={{ background: 'var(--bg-ivory)', border: '1px solid var(--border)' }}
                >
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center mb-3"
                    style={{ background: 'var(--gold-bg)', border: '1px solid rgba(184,135,47,0.18)' }}>
                    <Icon style={{ width: '16px', height: '16px', color: 'var(--gold)' }} strokeWidth={1.8} />
                  </div>
                  <div className="text-sm mb-0.5" style={{ fontFamily: 'var(--font-serif)', fontWeight: 700, color: 'var(--ink)' }}>{f.title}</div>
                  <div className="text-xs" style={{ color: 'var(--muted)' }}>{f.desc}</div>
                </motion.div>
              );
            })}
          </motion.div>

        </div>
      </div>
    </section>
  );
}
