import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, BrainCircuit, CheckCircle2, GraduationCap } from 'lucide-react';

const steps = [
  {
    number: '01',
    icon: BookOpen,
    title: 'Read free chapter notes',
    text: 'Choose your class and subject, then open one chapter at a time instead of searching through random PDFs.',
    to: '/cbse-notes',
    action: 'Open free notes',
  },
  {
    number: '02',
    icon: BrainCircuit,
    title: 'Practise immediately',
    text: 'After reading, use MCQs, revision prompts and chapter-specific practice while the concept is still fresh.',
    to: '/cbse-practice',
    action: 'Start practice',
  },
  {
    number: '03',
    icon: GraduationCap,
    title: 'Get teaching support',
    text: 'If a chapter still feels difficult, book a free demo class and learn it with guided explanation instead of staying stuck.',
    to: '/book-demo',
    action: 'Book free demo',
  },
];

export default function StudentJourney() {
  return (
    <section className="section-light section-padding" style={{ background: 'linear-gradient(180deg, #fff 0%, #fff9ec 100%)' }}>
      <div className="page-container">
        <div className="max-w-3xl mb-8 sm:mb-10">
          <span className="eyebrow">Simple student flow</span>
          <h2 className="headline mt-4">Don’t just collect PDFs. <em>Learn chapter by chapter.</em></h2>
          <p className="mt-4" style={{ color: 'var(--muted)' }}>
            The website is organised around one useful study loop: understand the chapter, practise it, then get help only when you need it.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-5">
          {steps.map(({ number, icon: Icon, title, text, to, action }) => (
            <article key={number} className="card-paper p-5 sm:p-6 flex flex-col">
              <div className="flex items-center justify-between gap-4 mb-5">
                <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: 'var(--gold-bg)', color: 'var(--gold)' }}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-xs font-black tracking-[0.18em]" style={{ color: 'var(--subtle)' }}>{number}</span>
              </div>
              <h3 className="text-xl font-bold mb-3" style={{ color: 'var(--ink)' }}>{title}</h3>
              <p className="text-sm leading-relaxed flex-1" style={{ color: 'var(--muted)' }}>{text}</p>
              <Link to={to} className="mt-5 min-h-12 tile-paper px-4 py-3 inline-flex items-center justify-between gap-3 font-semibold text-sm" style={{ color: 'var(--ink)' }}>
                {action}<ArrowRight className="w-4 h-4" style={{ color: 'var(--gold)' }} />
              </Link>
            </article>
          ))}
        </div>

        <div className="mt-5 sm:mt-7 rounded-2xl px-4 sm:px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3" style={{ background: '#101828', color: '#fff' }}>
          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: 'var(--gold-bright)' }} />
            <div>
              <strong className="block text-sm">Published study material, clear next steps.</strong>
              <span className="text-xs sm:text-sm" style={{ color: 'var(--muted-on-ink)' }}>Free notes stay free to view or download, and every chapter should lead you toward practice—not a dead end.</span>
            </div>
          </div>
          <Link to="/cbse-notes" className="btn-primary min-h-12 flex-shrink-0">Start studying <ArrowRight className="w-4 h-4" /></Link>
        </div>
      </div>
    </section>
  );
}
