import { Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { PlayCircle, FileText, HelpCircle, FileDown, PenTool, ArrowRight } from 'lucide-react';

const resources = [
  { icon: PlayCircle, title: 'Free Demo Lecture',   desc: 'Watch a complete class for free before enrolling.',         link: '/lectures'       },
  { icon: FileText,   title: 'Free PDF Notes',       desc: 'Chapter-wise notes for quick revision and exam prep.',      link: '/study-material' },
  { icon: HelpCircle, title: 'Free Quiz',            desc: 'Test your knowledge with chapter-wise MCQs.',              link: '/quizzes'        },
  { icon: FileDown,   title: 'Free Sample Paper',    desc: 'Practice with board-pattern question papers.',             link: '/study-material' },
  { icon: PenTool,    title: 'Answer Writing Guide', desc: 'Learn how to write board answers and score full marks.',    link: '/study-material' },
];

const WA_LINK = 'https://wa.me/916353709585?text=Hello%20Smit%20Sir%2C%20I%20want%20to%20book%20a%20free%20demo%20class%20for%20Class%2011%2F12%20Commerce.';

export default function FreeResources() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '100px' });

  return (
    <section ref={ref} className="section-padding relative overflow-hidden" style={{ background: 'linear-gradient(180deg, #080520 0%, #050318 100%)' }}>
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 right-0 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(245,158,11,0.25), transparent)' }} />
        <div className="absolute top-1/2 right-0 w-96 h-96 rounded-full blur-3xl opacity-[0.06]" style={{ background: 'radial-gradient(circle, rgba(245,158,11,1) 0%, transparent 70%)', transform: 'translateY(-50%)' }} />
      </div>
      <div className="page-container">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-12"
        >
          <div className="section-subheading">Zero Cost, High Value</div>
          <h2 className="section-heading">Start Learning With <span className="gradient-text">Free Resources</span></h2>
          <p className="text-navy-400 max-w-xl mx-auto mt-2 text-sm">
            No registration needed. Access sample material and see exactly what you get before joining.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-10">
          {resources.map((r, i) => {
            const Icon = r.icon;
            return (
              <motion.div
                key={r.title}
                initial={{ opacity: 0, y: 16 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: i * 0.05, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              >
                <Link
                  to={r.link}
                  className="group relative flex flex-col p-5 rounded-2xl overflow-hidden h-full transition-all duration-300 hover:-translate-y-1.5"
                  style={{
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.07)',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.borderColor = 'rgba(245,158,11,0.3)';
                    e.currentTarget.style.boxShadow = '0 16px 40px rgba(0,0,0,0.3), 0 0 0 1px rgba(245,158,11,0.08)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  {/* Top accent line on hover */}
                  <div className="absolute top-0 inset-x-0 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{ background: 'linear-gradient(90deg, transparent, rgba(245,158,11,0.5), transparent)' }} />

                  <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300"
                    style={{ background: 'rgba(245,158,11,0.09)', border: '1px solid rgba(245,158,11,0.18)' }}>
                    <Icon className="w-5 h-5 text-gold-400" />
                  </div>
                  <span className="text-xs font-bold text-emerald-400 mb-2 tracking-wide uppercase">Free</span>
                  <h3 className="font-semibold text-white text-sm mb-1.5 leading-snug">{r.title}</h3>
                  <p className="text-navy-400 text-xs leading-relaxed flex-1">{r.desc}</p>
                  <div className="flex items-center gap-1 text-gold-400 text-xs font-semibold mt-4">
                    Access Now <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.5 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link to="/study-material" className="btn-primary inline-flex items-center gap-2">
            Browse All Free Resources <ArrowRight className="w-4 h-4" />
          </Link>
          <a
            href={WA_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-400 hover:text-emerald-300 transition-colors"
          >
            <svg viewBox="0 0 32 32" className="w-4 h-4" fill="currentColor">
              <path d="M16.002 2.667C8.637 2.667 2.667 8.637 2.667 16c0 2.363.629 4.609 1.73 6.557L2.667 29.333l6.979-1.698A13.264 13.264 0 0 0 16.002 29.333C23.363 29.333 29.333 23.363 29.333 16S23.363 2.667 16.002 2.667zm0 2.4c5.93 0 10.934 4.937 10.934 10.933 0 5.998-5.004 10.934-10.934 10.934a10.9 10.9 0 0 1-5.55-1.516l-.398-.24-4.14 1.006 1.04-3.994-.265-.414A10.897 10.897 0 0 1 5.069 16c0-5.996 5.004-10.933 10.933-10.933zm-3.02 5.6c-.202 0-.53.075-.809.376-.278.3-1.062 1.038-1.062 2.531 0 1.493 1.087 2.937 1.239 3.139.152.201 2.119 3.39 5.22 4.618 2.578.99 3.1.793 3.66.743.56-.049 1.808-.739 2.063-1.454.254-.715.254-1.328.178-1.454-.076-.126-.278-.202-.58-.352-.303-.151-1.793-.884-2.07-.984-.278-.1-.48-.15-.682.151-.202.3-.78.984-.957 1.186-.176.202-.352.227-.654.076-.302-.152-1.275-.47-2.43-1.499-.898-.8-1.504-1.788-1.68-2.09-.177-.3-.019-.463.133-.612.136-.134.303-.352.454-.528.15-.176.2-.3.301-.503.1-.2.05-.376-.025-.527-.076-.15-.672-1.649-.93-2.254-.238-.567-.486-.493-.673-.502a12.1 12.1 0 0 0-.575-.013z"/>
            </svg>
            Ask on WhatsApp
          </a>
        </motion.div>
      </div>
    </section>
  );
}
