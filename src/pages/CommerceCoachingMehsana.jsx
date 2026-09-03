import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, CheckCircle2, GraduationCap, MapPin, Monitor, School, Sparkles, Users } from 'lucide-react';
import SEO from '../components/ui/SEO';

const BASE = 'https://www.smitsircommerce.in';
const PATH = '/commerce-coaching-mehsana';

const subjects = [
  ['Economics', 'Concept clarity, diagrams, numericals, application questions and exam-focused revision.'],
  ['Business Studies', 'Chapter-wise explanation, case studies, important questions and answer-writing practice.'],
  ['Entrepreneurship', 'Clear concepts, practical examples, application-based questions and revision support.'],
  ['Physical Education', 'Simple explanations, structured theory revision and exam-oriented preparation.'],
];

const advantages = [
  'Class 11 and Class 12 learning support',
  'Learning-first teaching with exam application',
  'Chapter-wise notes and revision resources',
  'Regular tests and weak-topic correction',
  'Offline learning in Mehsana with online support available',
  'Free Commerce resources students can use between classes',
];

const faqs = [
  {
    question: 'Where is Smit Sir Commerce coaching available?',
    answer: 'Smit Sir Commerce serves students in Mehsana, Gujarat, with offline learning support and also provides online learning options for students who cannot attend locally.',
  },
  {
    question: 'Which subjects does Smit Sir personally teach?',
    answer: 'Smit Sir personally teaches Economics, Business Studies, Entrepreneurship and Physical Education for Class 11 and 12 students.',
  },
  {
    question: 'Are Accountancy resources available?',
    answer: 'Yes. The website provides free Accountancy calculators and learning resources as separate study support. Accountancy is not presented as a personal tuition subject.',
  },
  {
    question: 'Can I take a demo class before joining?',
    answer: 'Yes. Students and parents can request a free paper analysis or demo before deciding on a batch. There is no admission commitment just to try the teaching approach.',
  },
  {
    question: 'Are free Commerce notes and tools available?',
    answer: 'Yes. Smit Sir Commerce publishes free chapter-wise notes, practice resources and Commerce calculators that students can use independently of tuition.',
  },
];

const structuredData = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebPage',
      '@id': `${BASE}${PATH}#webpage`,
      url: `${BASE}${PATH}`,
      name: 'Commerce Coaching in Mehsana for Class 11 & 12',
      description: 'Class 11 and 12 Commerce coaching in Mehsana with Economics, Business Studies and Entrepreneurship teaching, plus free Commerce notes, Accountancy learning tools, practice and demo support.',
      inLanguage: 'en-IN',
      about: { '@id': `${BASE}${PATH}#service` },
      isPartOf: { '@id': `${BASE}/#website` },
    },
    {
      '@type': 'Service',
      '@id': `${BASE}${PATH}#service`,
      name: 'Class 11 & 12 Commerce Coaching in Mehsana',
      serviceType: 'Class 11 and Class 12 Commerce learning support',
      provider: { '@id': `${BASE}/#organization` },
      areaServed: { '@type': 'City', name: 'Mehsana' },
      availableChannel: [
        {
          '@type': 'ServiceChannel',
          name: 'Offline learning in Mehsana',
          serviceLocation: { '@type': 'City', name: 'Mehsana' },
        },
        {
          '@type': 'ServiceChannel',
          name: 'Online learning support',
          serviceUrl: `${BASE}/online-batch`,
        },
      ],
      offers: {
        '@type': 'Offer',
        url: `${BASE}/book-demo`,
        description: 'Request a free paper analysis and demo before choosing a batch.',
      },
    },
    {
      '@type': 'FAQPage',
      mainEntity: faqs.map((faq) => ({
        '@type': 'Question',
        name: faq.question,
        acceptedAnswer: { '@type': 'Answer', text: faq.answer },
      })),
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: `${BASE}/` },
        { '@type': 'ListItem', position: 2, name: 'Commerce Coaching in Mehsana', item: `${BASE}${PATH}` },
      ],
    },
  ],
};

export default function CommerceCoachingMehsana() {
  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-ivory)' }}>
      <SEO
        title="Commerce Coaching in Mehsana — Class 11 & 12"
        description="Commerce coaching in Mehsana for Class 11 and 12 with Economics, Business Studies and Entrepreneurship teaching, plus free notes, practice tools, paper analysis and demo support."
        path={PATH}
        structuredData={structuredData}
      />

      <section className="page-hero">
        <div className="page-container">
          <nav aria-label="Breadcrumb" className="text-sm mb-7 flex items-center gap-2" style={{ color: 'var(--muted)' }}>
            <Link to="/">Home</Link><span>/</span><span style={{ color: 'var(--gold)' }}>Commerce Coaching in Mehsana</span>
          </nav>

          <div className="grid lg:grid-cols-[minmax(0,1fr)_360px] gap-9 items-start">
            <div>
              <span className="eyebrow inline-flex items-center gap-2"><MapPin className="w-4 h-4" /> Mehsana, Gujarat</span>
              <h1 className="mt-5">Commerce Coaching in Mehsana for <em>Class 11 &amp; 12</em></h1>
              <p className="mt-5 text-lg leading-relaxed max-w-3xl" style={{ color: 'var(--muted)' }}>
                Learn with concept clarity first, then practise for exams. Smit Sir personally teaches Economics, Business Studies, Entrepreneurship and Physical Education, with structured revision and weak-topic support.
              </p>

              <div className="flex flex-wrap gap-3 mt-7">
                <Link to="/book-demo" className="btn-primary inline-flex items-center gap-2">
                  Free paper analysis + demo <ArrowRight className="w-4 h-4" />
                </Link>
                <Link to="/cbse-notes" className="btn-outline-ink inline-flex items-center gap-2">
                  <BookOpen className="w-4 h-4" /> Free Commerce notes
                </Link>
              </div>

              <div className="flex flex-wrap gap-2 mt-6 text-sm" style={{ color: 'var(--muted)' }}>
                {['Class 11', 'Class 12', 'Economics', 'Business Studies', 'Entrepreneurship'].map((item) => (
                  <span key={item} className="tile-paper px-3 py-2">{item}</span>
                ))}
              </div>
            </div>

            <aside className="card-paper p-6 sm:p-7">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-5" style={{ background: 'var(--gold-bg)', color: 'var(--gold)' }}>
                <GraduationCap className="w-6 h-6" />
              </div>
              <h2 className="text-2xl" style={{ fontFamily: 'var(--font-serif)', color: 'var(--ink)' }}>Try the learning approach first</h2>
              <p className="text-sm leading-7 mt-3" style={{ color: 'var(--muted)' }}>
                Bring a recent test paper, identify where marks were lost and experience the teaching approach before making an admission decision.
              </p>
              <div className="space-y-3 mt-5">
                <Link to="/offline-batch" className="tile-paper p-3 flex items-center justify-between gap-3 text-sm font-semibold">
                  <span className="inline-flex items-center gap-2"><Users className="w-4 h-4" /> Offline in Mehsana</span><ArrowRight className="w-4 h-4" style={{ color: 'var(--gold)' }} />
                </Link>
                <Link to="/online-batch" className="tile-paper p-3 flex items-center justify-between gap-3 text-sm font-semibold">
                  <span className="inline-flex items-center gap-2"><Monitor className="w-4 h-4" /> Online support</span><ArrowRight className="w-4 h-4" style={{ color: 'var(--gold)' }} />
                </Link>
              </div>
            </aside>
          </div>
        </div>
      </section>

      <main className="page-container section-padding space-y-8">
        <section className="card-paper p-5 sm:p-7 md:p-9" aria-labelledby="subjects-heading">
          <span className="eyebrow">What Smit Sir personally teaches</span>
          <h2 id="subjects-heading" className="text-3xl mt-3 mb-3" style={{ fontFamily: 'var(--font-serif)', color: 'var(--ink)' }}>Understanding first. Exam application next.</h2>
          <p className="max-w-3xl leading-7 mb-7" style={{ color: 'var(--muted)' }}>
            The aim is not only to finish chapters. Students should understand why a concept works, practise the questions that expose weak areas and then revise until they can apply the idea confidently in an examination.
          </p>
          <div className="grid sm:grid-cols-2 gap-4">
            {subjects.map(([title, description]) => (
              <article key={title} className="tile-paper p-5">
                <School className="w-5 h-5 mb-3" style={{ color: 'var(--gold)' }} />
                <h3 className="text-xl" style={{ fontFamily: 'var(--font-serif)', color: 'var(--ink)' }}>{title}</h3>
                <p className="text-sm leading-7 mt-2" style={{ color: 'var(--muted)' }}>{description}</p>
              </article>
            ))}
          </div>
          <div className="tile-paper p-4 mt-5 text-sm leading-7" style={{ color: 'var(--muted)' }}>
            <strong style={{ color: 'var(--ink)' }}>Accountancy resources:</strong> the website includes free Accountancy calculators and learning tools for students. These are separate from Smit Sir&apos;s personal teaching-subject list.
          </div>
        </section>

        <section className="grid lg:grid-cols-2 gap-6">
          <div className="card-paper p-5 sm:p-7 md:p-9">
            <span className="eyebrow">Why this learning system</span>
            <h2 className="text-3xl mt-3 mb-6" style={{ fontFamily: 'var(--font-serif)', color: 'var(--ink)' }}>A complete path from clarity to practice</h2>
            <ul className="space-y-4">
              {advantages.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: 'var(--green)' }} />
                  <span className="leading-7" style={{ color: 'var(--muted)' }}>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="card-paper p-5 sm:p-7 md:p-9">
            <span className="eyebrow">Mehsana + online</span>
            <h2 className="text-3xl mt-3 mb-4" style={{ fontFamily: 'var(--font-serif)', color: 'var(--ink)' }}>Local teaching connected to free digital resources</h2>
            <p className="leading-8" style={{ color: 'var(--muted)' }}>
              Students in Mehsana can explore offline learning while using the same website for chapter notes, practice pages, calculators, tests and revision support. Students elsewhere can continue with the public learning resources and enquire about online options.
            </p>
            <div className="grid sm:grid-cols-2 gap-3 mt-6">
              <Link to="/study-material" className="tile-paper p-4 flex items-center justify-between gap-3 font-semibold text-sm"><span>Study material</span><ArrowRight className="w-4 h-4" style={{ color: 'var(--gold)' }} /></Link>
              <Link to="/tools" className="tile-paper p-4 flex items-center justify-between gap-3 font-semibold text-sm"><span>Commerce calculators</span><ArrowRight className="w-4 h-4" style={{ color: 'var(--gold)' }} /></Link>
              <Link to="/about" className="tile-paper p-4 flex items-center justify-between gap-3 font-semibold text-sm"><span>About Smit Sir</span><ArrowRight className="w-4 h-4" style={{ color: 'var(--gold)' }} /></Link>
              <Link to="/contact" className="tile-paper p-4 flex items-center justify-between gap-3 font-semibold text-sm"><span>Contact</span><ArrowRight className="w-4 h-4" style={{ color: 'var(--gold)' }} /></Link>
            </div>
          </div>
        </section>

        <section className="card-paper p-5 sm:p-7 md:p-9" aria-labelledby="process-heading">
          <span className="eyebrow">How students can start</span>
          <h2 id="process-heading" className="text-3xl mt-3 mb-7" style={{ fontFamily: 'var(--font-serif)', color: 'var(--ink)' }}>Try before you decide</h2>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              ['1', 'Explore free resources', 'Use the notes, calculators and practice pages to see how concepts are explained.'],
              ['2', 'Bring a test paper', 'Request a free paper analysis so the weak topic or mistake pattern is identified first.'],
              ['3', 'Choose what fits', 'Experience the demo and then decide whether online or offline support is useful for you.'],
            ].map(([number, title, text]) => (
              <article key={number} className="tile-paper p-5">
                <span className="w-9 h-9 rounded-full inline-flex items-center justify-center font-bold" style={{ background: 'var(--gold-bg)', color: 'var(--gold)' }}>{number}</span>
                <h3 className="text-xl mt-4" style={{ fontFamily: 'var(--font-serif)', color: 'var(--ink)' }}>{title}</h3>
                <p className="text-sm leading-7 mt-2" style={{ color: 'var(--muted)' }}>{text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="card-paper p-5 sm:p-7 md:p-9" aria-labelledby="faq-heading">
          <span className="eyebrow">Local coaching FAQ</span>
          <h2 id="faq-heading" className="text-3xl mt-3 mb-5" style={{ fontFamily: 'var(--font-serif)', color: 'var(--ink)' }}>Questions students and parents ask</h2>
          <div className="divide-y" style={{ borderColor: 'var(--border-soft)' }}>
            {faqs.map((faq, index) => (
              <details key={faq.question} className="py-4" open={index === 0}>
                <summary className="cursor-pointer list-none font-semibold flex justify-between gap-4" style={{ color: 'var(--ink)' }}>
                  {faq.question}<span aria-hidden="true" style={{ color: 'var(--gold)' }}>+</span>
                </summary>
                <p className="mt-3 leading-7 max-w-4xl" style={{ color: 'var(--muted)' }}>{faq.answer}</p>
              </details>
            ))}
          </div>
        </section>

        <section className="card-paper p-6 sm:p-8 md:p-10 text-center">
          <Sparkles className="w-8 h-8 mx-auto mb-4" style={{ color: 'var(--gold)' }} />
          <h2 className="text-3xl" style={{ fontFamily: 'var(--font-serif)', color: 'var(--ink)' }}>In a world chasing marks, choose understanding.</h2>
          <p className="mt-4 max-w-2xl mx-auto leading-7" style={{ color: 'var(--muted)' }}>Start with a free paper analysis or demo. No admission is required just to understand the teaching approach.</p>
          <Link to="/book-demo" className="btn-primary inline-flex items-center gap-2 mt-6">Request free analysis + demo <ArrowRight className="w-4 h-4" /></Link>
        </section>
      </main>
    </div>
  );
}
