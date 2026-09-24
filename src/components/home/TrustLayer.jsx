import { Link } from 'react-router-dom';
import { ArrowRight, BookOpenCheck, Calculator, FileQuestion, Gauge, ShieldCheck } from 'lucide-react';

const proofItems = [
  {
    icon: BookOpenCheck,
    title: 'Understand one chapter free',
    text: 'Open Business Environment and judge the explanation, revision flow and case-study clues before paying for anything.',
    to: '/cbse/class-12/business-studies/business-environment-notes',
    action: 'Open free chapter',
  },
  {
    icon: FileQuestion,
    title: 'Solve a real case study',
    text: 'Try chapter-wise Class 12 Business Studies case questions with answers and see whether the method actually helps you think.',
    to: '/cbse/class-12/business-studies-case-study-questions',
    action: 'Try case studies',
  },
  {
    icon: Calculator,
    title: 'Check a numerical',
    text: 'Use a free Economics calculator, then compare the working with your own method instead of trusting a marketing claim.',
    to: '/tools/net-indirect-tax-calculator',
    action: 'Try a calculator',
  },
  {
    icon: Gauge,
    title: 'Test yourself in 5 minutes',
    text: 'Use the free diagnostic to find a starting point before deciding whether you need more notes, practice or teaching support.',
    to: '/board-exam-diagnostic',
    action: 'Start diagnostic',
  },
];

export default function TrustLayer() {
  return (
    <section className="section-padding" style={{ background: '#fff' }}>
      <div className="page-container">
        <div className="max-w-3xl mx-auto text-center mb-10">
          <span className="eyebrow">Proof before purchase</span>
          <h2 className="headline mt-6">Don’t trust a promise. <em>Test the teaching first.</em></h2>
          <p className="mt-4 text-sm sm:text-base leading-7" style={{ color: 'var(--muted)' }}>
            You do not need to know Smit Sir from YouTube before using this platform. Start with the free material below. If the explanation, practice and tools genuinely help you, then decide whether a paid resource is worth it.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {proofItems.map((item) => {
            const Icon = item.icon;
            return (
              <article key={item.title} className="card-paper p-5 flex flex-col">
                <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
                  style={{ background: 'var(--gold-bg)', border: '1px solid rgba(184,135,47,0.2)' }}>
                  <Icon className="w-5 h-5" style={{ color: 'var(--gold)' }} strokeWidth={1.9} />
                </div>
                <h3 className="text-base mb-2" style={{ fontFamily: 'var(--font-serif)', color: 'var(--ink)', fontWeight: 800 }}>
                  {item.title}
                </h3>
                <p className="text-sm leading-6 flex-1" style={{ color: 'var(--muted)' }}>{item.text}</p>
                <Link to={item.to} className="inline-flex items-center gap-2 mt-4 text-sm font-extrabold" style={{ color: 'var(--gold)' }}>
                  {item.action} <ArrowRight className="w-4 h-4" />
                </Link>
              </article>
            );
          })}
        </div>

        <div className="mt-8 rounded-2xl p-5 sm:p-6 flex flex-col lg:flex-row gap-5 lg:items-center lg:justify-between"
          style={{ background: 'linear-gradient(135deg, #15120d, #231b10)', border: '1px solid rgba(201,160,80,0.28)' }}>
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.15em] mb-2" style={{ color: 'var(--gold-bright)' }}>No fake social proof</div>
            <h3 className="text-xl sm:text-2xl" style={{ fontFamily: 'var(--font-serif)', fontWeight: 800, color: 'var(--ivory-on-ink)' }}>
              The free work is the proof. Paid content comes after trust.
            </h3>
            <p className="text-sm mt-2 max-w-2xl" style={{ color: 'var(--muted-on-ink)' }}>
              No invented topper stories, fake student counts or marks guarantees. Use the free notes, questions and tools first; upgrade only if they are useful to you.
            </p>
          </div>
          <div className="flex flex-wrap gap-3 flex-shrink-0">
            <Link to="/study-material" className="btn-gold inline-flex items-center gap-2">
              Explore Free Resources <ArrowRight className="w-4 h-4" />
            </Link>
            <Link to="/about" className="btn-outline-ink inline-flex items-center gap-2" style={{ borderColor: 'rgba(255,255,255,0.22)', color: 'var(--ivory-on-ink)' }}>
              <ShieldCheck className="w-4 h-4" /> About the Platform
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
