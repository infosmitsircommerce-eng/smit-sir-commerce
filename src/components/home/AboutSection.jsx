import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, ArrowRight, Sparkles } from 'lucide-react';

const features = [
  { icon: '💡', title: 'Simple Explanation',  desc: 'Complex concepts made easy'         },
  { icon: '🌍', title: 'Real-Life Examples',  desc: 'Business & economy connections'      },
  { icon: '🎯', title: 'Board Exam Focus',    desc: 'CBSE pattern and marking scheme'     },
  { icon: '👤', title: 'Personal Guidance',   desc: 'Individual attention to each student'},
  { icon: '📋', title: 'Regular Practice',    desc: 'Daily questions and exercises'       },
  { icon: '❓', title: 'Doubt Solving',       desc: 'No question left unanswered'         },
  { icon: '🔄', title: 'Smart Revision',      desc: 'Mind maps and quick notes'           },
  { icon: '📊', title: 'Test-Based Prep',     desc: 'Track progress through tests'        },
];

export default function AboutSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '100px' });

  return (
    <section ref={ref} className="section-padding section-light">
      <div className="page-container">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">

          {/* Left */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="inline-flex items-center gap-2 bg-gold-500/10 border border-gold-500/30 rounded-full px-4 py-1.5 text-gold-700 text-xs font-semibold mb-5">
              <Sparkles className="w-3.5 h-3.5" />
              About Smit Sir Commerce
            </div>

            <h2 className="section-heading">Commerce Education <span className="gradient-text">That Actually Works</span></h2>

            <p className="leading-relaxed mb-4 text-base" style={{ color: '#111827' }}>
              Smit Sir is a dedicated CBSE Commerce educator based in Mehsana, Gujarat — specialising in Class 11 and Class 12 Accountancy, Economics, Business Studies, and Entrepreneurship. With 200+ students trained and a 5★ average rating, he is known for making complex subjects genuinely simple.
            </p>
            <p className="leading-relaxed mb-4 text-sm" style={{ color: '#1f2937' }}>
              His teaching style focuses on <strong>concept clarity first, exam application second</strong> — using real-life business examples, structured CBSE-pattern notes, regular testing, and personal attention for every student.
            </p>
            <p className="leading-relaxed mb-7 text-sm" style={{ color: '#1f2937' }}>
              Both <strong>online batches (pan India)</strong> and <strong>offline batches (Mehsana)</strong> are available — so no student is left behind regardless of location.
            </p>

            <div className="flex flex-wrap gap-3 mb-8">
              {['NCERT Based', 'Board Exam Focused', 'Concept Clarity', 'Regular Tests'].map((tag) => (
                <span key={tag} className="flex items-center gap-1.5 text-sm text-gold-600 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5 text-gold-600" />
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
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 16 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.05 * i, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="card-light rounded-xl p-4 hover:-translate-y-0.5 transition-all duration-300"
              >
                <div className="text-xl mb-2">{f.icon}</div>
                <div className="font-semibold text-sm mb-0.5" style={{ color: '#111827' }}>{f.title}</div>
                <div className="text-xs" style={{ color: '#374151' }}>{f.desc}</div>
              </motion.div>
            ))}
          </motion.div>

        </div>
      </div>
    </section>
  );
}
