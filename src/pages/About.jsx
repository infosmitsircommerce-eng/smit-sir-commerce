import SEO from '../components/ui/SEO';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  GraduationCap, Target, BookOpen, ArrowRight, Lightbulb, Globe2,
  HeartHandshake, MessageCircleQuestion, ShieldCheck, MapPin, CheckCircle2,
} from 'lucide-react';
import teacherPhoto from '../assets/teacher-photo-opt.jpg';

const BASE = 'https://www.smitsircommerce.in';

const values = [
  { icon: Lightbulb, title: 'Understanding First', desc: 'The goal is not blind memorisation. Concepts should make sense before students are asked to reproduce them in an exam.' },
  { icon: MessageCircleQuestion, title: 'Questions Are Welcome', desc: 'Students should be able to ask why, challenge confusion and explore a concept without feeling embarrassed.' },
  { icon: Globe2, title: 'Connect It to Real Life', desc: 'Economics and Business Studies become easier when students can see how ideas work outside the textbook.' },
  { icon: Target, title: 'Exam Application Matters', desc: 'Marks still matter, so understanding is followed by structured practice, answer-writing and revision.' },
  { icon: HeartHandshake, title: 'Low-Pressure Learning', desc: 'The aim is confidence and curiosity — not fear-based motivation or unnecessary comparison.' },
  { icon: ShieldCheck, title: 'Transparent Claims', desc: 'No invented topper stories, fake student counts or unrealistic marks guarantees are used to sell classes.' },
];

const subjects = ['Economics', 'Business Studies', 'Entrepreneurship', 'Physical Education'];

const structuredData = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'AboutPage',
      '@id': `${BASE}/about#webpage`,
      url: `${BASE}/about`,
      name: 'About Smit Sir Commerce',
      description: 'Learn about Smit Sir, his teaching philosophy, subjects taught and the transparent learning approach behind Smit Sir Commerce.',
      inLanguage: 'en-IN',
      about: { '@id': `${BASE}/about#smit-thaker` },
      isPartOf: { '@id': `${BASE}/#website` },
    },
    {
      '@type': 'Person',
      '@id': `${BASE}/about#smit-thaker`,
      name: 'Smit Thaker',
      alternateName: 'Smit Sir',
      url: `${BASE}/about`,
      jobTitle: 'Commerce Educator',
      worksFor: { '@id': `${BASE}/#organization` },
      knowsAbout: ['Economics', 'Business Studies', 'Entrepreneurship', 'Physical Education', 'Commerce education'],
      homeLocation: { '@type': 'City', name: 'Mehsana, Gujarat, India' },
    },
  ],
};

export default function About() {
  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-ivory)' }}>
      <SEO
        title="About Smit Sir — Learning-First Commerce Teacher Mehsana"
        description="Meet Smit Sir and learn the philosophy behind Smit Sir Commerce: concept clarity, curiosity, real examples, exam application and transparent Class 11 & 12 support."
        path="/about"
        structuredData={structuredData}
      />

      <div className="page-hero">
        <div className="page-container text-center">
          <span className="eyebrow">Meet the teacher</span>
          <h1 className="mt-5">Not just teaching answers. <em>Teaching understanding.</em></h1>
          <p className="mx-auto max-w-3xl mt-4">
            Smit Sir Commerce is built around a simple belief: marks matter, but they should be the result of learning — not the entire purpose of it.
          </p>
        </div>
      </div>

      <div className="page-container section-padding space-y-16">
        <section className="grid lg:grid-cols-[0.82fr_1.18fr] gap-12 items-center">
          <motion.div initial={{ opacity: 0, x: -24 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="flex justify-center lg:justify-start">
            <div className="relative w-full max-w-sm">
              <div aria-hidden="true" className="absolute inset-0 rounded-2xl pointer-events-none" style={{ transform: 'translate(14px, 14px)', border: '1px solid rgba(184,135,47,0.4)' }} />
              <div className="relative rounded-2xl overflow-hidden" style={{ border: '1px solid var(--border)', boxShadow: '0 24px 64px rgba(30,24,18,0.14)', background: 'var(--bg-white)' }}>
                <div style={{ height: '3px', background: 'linear-gradient(90deg, var(--gold), var(--gold-soft), var(--gold))' }} />
                <img src={teacherPhoto} alt="Smit Sir — Commerce Educator in Mehsana" loading="lazy" decoding="async" className="w-full object-cover object-top" style={{ maxHeight: '430px' }} />
                <div className="p-5">
                  <div className="text-xl" style={{ fontFamily: 'var(--font-serif)', fontWeight: 700, color: 'var(--ink)' }}>Smit Sir</div>
                  <div className="text-sm mt-1" style={{ color: 'var(--gold)' }}>Commerce Educator · Class 11 &amp; 12 Support</div>
                  <div className="text-xs flex items-center gap-1 mt-2" style={{ color: 'var(--subtle)' }}><MapPin className="w-3 h-3" /> Mehsana, Gujarat, India</div>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 24 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <span className="eyebrow">What I want students to experience</span>
            <h2 className="headline mt-6 mb-5">Commerce should <em>make sense</em> before it makes marks.</h2>
            <p className="leading-7 mb-4" style={{ color: 'var(--charcoal)' }}>
              I do not want a student to finish a chapter only knowing what to write in an exam. I want them to understand why the concept exists, where it appears in real life, and how one idea connects to another.
            </p>
            <p className="leading-7 mb-4" style={{ color: 'var(--muted)' }}>
              That does not mean ignoring marks. Exams are real, answer-writing matters and practice matters. The difference is the order: first understand, then apply, then practise, then improve the result.
            </p>
            <p className="leading-7 mb-7" style={{ color: 'var(--muted)' }}>
              Smit Sir Commerce combines this learning-first philosophy with free notes, practice resources, calculators, diagnostics and direct support so students can learn with more clarity and less unnecessary fear.
            </p>

            <div className="grid sm:grid-cols-2 gap-3 mb-7">
              {[
                'Concept clarity before memorisation',
                'Questions without embarrassment',
                'Real-life examples and application',
                'Exam practice after understanding',
              ].map(item => (
                <div key={item} className="flex items-start gap-2 text-sm" style={{ color: 'var(--charcoal)' }}>
                  <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: 'var(--green)' }} />
                  {item}
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-3">
              <Link to="/book-demo" className="btn-primary inline-flex items-center gap-2">Free Paper Analysis / Demo <ArrowRight className="w-4 h-4" /></Link>
              <Link to="/contact" className="btn-outline-ink inline-flex items-center gap-2">Contact Smit Sir</Link>
            </div>
          </motion.div>
        </section>

        <section className="card-paper p-6 sm:p-8">
          <div className="grid lg:grid-cols-[0.8fr_1.2fr] gap-8 items-start">
            <div>
              <span className="eyebrow">Teaching scope</span>
              <h2 className="text-2xl sm:text-3xl mt-5" style={{ fontFamily: 'var(--font-serif)', fontWeight: 700, color: 'var(--ink)' }}>What Smit Sir personally teaches</h2>
              <p className="text-sm leading-6 mt-3" style={{ color: 'var(--muted)' }}>
                This is kept separate from the wider free resource library so students and parents always know the difference between personal teaching and website learning tools.
              </p>
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              {subjects.map(subject => (
                <div key={subject} className="tile-paper p-4 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: 'var(--gold-bg)' }}><BookOpen className="w-4 h-4" style={{ color: 'var(--gold)' }} /></div>
                  <div>
                    <div className="font-semibold text-sm" style={{ color: 'var(--ink)' }}>{subject}</div>
                    <div className="text-xs mt-1" style={{ color: 'var(--subtle)' }}>Class 11 &amp; 12 support</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-6 rounded-xl p-4 text-sm leading-6" style={{ background: 'var(--bg-ivory)', border: '1px solid var(--border)', color: 'var(--muted)' }}>
            <strong style={{ color: 'var(--ink)' }}>Accountancy transparency:</strong> the website provides Accountancy calculators and learning resources, but those resources are separate from the personal teaching-subject list above.
          </div>
        </section>

        <section>
          <div className="text-center mb-10">
            <span className="eyebrow">What the brand stands for</span>
            <h2 className="headline mt-6">Learning with fun. <em>Marks as a result.</em></h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {values.map((v, i) => {
              const Icon = v.icon;
              return (
                <motion.article key={v.title} initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }} className="card-paper p-5">
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-3" style={{ background: 'var(--gold-bg)', border: '1px solid rgba(184,135,47,0.18)' }}>
                    <Icon className="w-5 h-5" style={{ color: 'var(--gold)' }} strokeWidth={1.8} />
                  </div>
                  <h3 className="mb-2" style={{ fontFamily: 'var(--font-serif)', fontWeight: 700, color: 'var(--ink)' }}>{v.title}</h3>
                  <p className="text-sm leading-6" style={{ color: 'var(--muted)' }}>{v.desc}</p>
                </motion.article>
              );
            })}
          </div>
        </section>

        <section className="rounded-2xl p-6 sm:p-8 text-center" style={{ background: 'linear-gradient(135deg, #17130e, #2b2113)', border: '1px solid rgba(201,160,80,0.28)' }}>
          <GraduationCap className="w-9 h-9 mx-auto mb-4" style={{ color: 'var(--gold-bright)' }} />
          <h2 className="text-2xl sm:text-3xl" style={{ fontFamily: 'var(--font-serif)', fontWeight: 700, color: 'var(--ivory-on-ink)' }}>You should understand the teaching before you pay for it.</h2>
          <p className="text-sm sm:text-base leading-7 max-w-2xl mx-auto mt-3" style={{ color: 'var(--muted-on-ink)' }}>
            Start with a free paper analysis or demo. Bring your latest test paper, see where marks were lost, ask questions and decide whether the teaching approach fits you. No admission is required just to try the analysis.
          </p>
          <Link to="/book-demo" className="btn-gold inline-flex items-center gap-2 mt-6">Start Free <ArrowRight className="w-4 h-4" /></Link>
        </section>
      </div>
    </div>
  );
}
