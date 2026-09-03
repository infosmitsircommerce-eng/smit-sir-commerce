import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BadgeCheck, BookOpenCheck, MessageCircleQuestion, ShieldCheck, ArrowRight } from 'lucide-react';

const trustItems = [
  {
    icon: BadgeCheck,
    title: 'Clear teaching scope',
    text: 'Smit Sir personally teaches Economics, Business Studies, Entrepreneurship and Physical Education for Class 11 & 12 support.',
  },
  {
    icon: BookOpenCheck,
    title: 'Learning before memorising',
    text: 'Concept clarity, real examples and questioning come first. Exam practice is used to strengthen learning — not replace it.',
  },
  {
    icon: MessageCircleQuestion,
    title: 'Try before you decide',
    text: 'Students can start with a free paper analysis or demo. You do not need to leave an existing tuition just to understand where marks are being lost.',
  },
  {
    icon: ShieldCheck,
    title: 'Transparent, no fake claims',
    text: 'No invented topper stories, fake student counts or unrealistic marks guarantees. The website shows real published resources and a clear contact path.',
  },
];

export default function TrustLayer() {
  return (
    <section className="section-padding" style={{ background: '#fff' }}>
      <div className="page-container">
        <div className="max-w-3xl mx-auto text-center mb-10">
          <span className="eyebrow">Why students & parents can trust the platform</span>
          <h2 className="headline mt-6">Clear teaching. Clear expectations. <em>No unnecessary pressure.</em></h2>
          <p className="mt-4 text-sm sm:text-base leading-7" style={{ color: 'var(--muted)' }}>
            Smit Sir Commerce is built around one simple idea: students should know what they are learning, why it matters, who is teaching them, and what support they can actually expect before they enrol.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {trustItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.article
                key={item.title}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.06 }}
                className="card-paper p-5"
              >
                <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
                  style={{ background: 'var(--gold-bg)', border: '1px solid rgba(184,135,47,0.2)' }}>
                  <Icon className="w-5 h-5" style={{ color: 'var(--gold)' }} strokeWidth={1.9} />
                </div>
                <h3 className="text-base mb-2" style={{ fontFamily: 'var(--font-serif)', color: 'var(--ink)', fontWeight: 700 }}>
                  {item.title}
                </h3>
                <p className="text-sm leading-6" style={{ color: 'var(--muted)' }}>{item.text}</p>
              </motion.article>
            );
          })}
        </div>

        <div className="mt-8 rounded-2xl p-5 sm:p-6 flex flex-col lg:flex-row gap-5 lg:items-center lg:justify-between"
          style={{ background: 'linear-gradient(135deg, #15120d, #231b10)', border: '1px solid rgba(201,160,80,0.28)' }}>
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.15em] mb-2" style={{ color: 'var(--gold-bright)' }}>Start without pressure</div>
            <h3 className="text-xl sm:text-2xl" style={{ fontFamily: 'var(--font-serif)', fontWeight: 700, color: 'var(--ivory-on-ink)' }}>
              Bring your latest test paper. Understand the mistake before choosing a class.
            </h3>
            <p className="text-sm mt-2 max-w-2xl" style={{ color: 'var(--muted-on-ink)' }}>
              Free paper analysis shows where marks were lost, which concepts need work, and what to improve next. Admission is not required for the analysis.
            </p>
          </div>
          <div className="flex flex-wrap gap-3 flex-shrink-0">
            <Link to="/book-demo" className="btn-gold inline-flex items-center gap-2">
              Free Paper Analysis <ArrowRight className="w-4 h-4" />
            </Link>
            <Link to="/about" className="btn-outline-ink inline-flex items-center gap-2" style={{ borderColor: 'rgba(255,255,255,0.22)', color: 'var(--ivory-on-ink)' }}>
              Meet Smit Sir
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
