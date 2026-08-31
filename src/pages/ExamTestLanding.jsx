import { Link, useParams } from 'react-router-dom';
import { ArrowRight, CheckCircle2, Clock3, FileQuestion, Lock, Play, Target } from 'lucide-react';
import SEO from '../components/ui/SEO';
import { examTestBySlug } from '../data/examBank';

export default function ExamTestLanding() {
  const { testSlug } = useParams();
  const test = examTestBySlug[testSlug];
  if (!test) {
    return <div className="min-h-screen flex items-center justify-center px-4" style={{ background: 'var(--bg-ivory)' }}><SEO title="Test Not Found" description="The requested test could not be found." path={`/tests/${testSlug || ''}`} noindex /><div className="card-paper max-w-lg w-full p-8 text-center"><FileQuestion className="w-10 h-10 mx-auto" style={{ color: 'var(--gold)' }} /><h1 className="text-3xl mt-4" style={{ fontFamily: 'var(--font-serif)', color: 'var(--ink)' }}>Test not found</h1><Link to="/exam-mode" className="btn-primary inline-flex mt-6">Browse Exam Mode</Link></div></div>;
  }

  const path = `/tests/${test.slug}`;
  const faq = [
    { question: `Is the ${test.name} timed?`, answer: `Yes. Exam Mode gives this test a ${test.minutes}-minute countdown with automatic submission when time ends.` },
    { question: 'Can I mark questions for review?', answer: 'Yes. You can mark questions, use the question palette, move between questions, and review unanswered questions before submitting.' },
    { question: 'What happens after submission?', answer: 'You receive score, topic-wise accuracy, question explanations, time-per-question data, and weak-topic guidance. Incorrect answers are also added to the Mistake Book on the device.' },
  ];
  const structuredData = [
    {
      '@context': 'https://schema.org',
      '@type': 'LearningResource',
      name: test.name,
      description: `CBSE Class ${test.classLevel} ${test.subject} timed practice test covering ${test.chapter}.`,
      educationalLevel: `Class ${test.classLevel}`,
      learningResourceType: 'Practice test',
      teaches: test.chapter,
      isAccessibleForFree: test.isFree,
      provider: { '@type': 'Organization', name: 'Smit Sir Commerce', url: 'https://www.smitsircommerce.in' },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faq.map((item) => ({ '@type': 'Question', name: item.question, acceptedAnswer: { '@type': 'Answer', text: item.answer } })),
    },
  ];

  return <div className="min-h-screen" style={{ background: 'var(--bg-ivory)' }}>
    <SEO title={`${test.name} — CBSE Class ${test.classLevel} ${test.subject}`} description={`Take a ${test.minutes}-minute CBSE Class ${test.classLevel} ${test.subject} practice exam on ${test.chapter} with answers, explanations and weak-topic analysis.`} path={path} structuredData={structuredData} />
    <section className="page-hero"><div className="page-container"><div className="max-w-4xl"><span className="eyebrow">CBSE Class {test.classLevel} · {test.subject}</span><h1 className="mt-5">{test.name}</h1><p className="mt-5 text-lg leading-relaxed max-w-3xl" style={{ color: 'var(--muted)' }}>A focused {test.difficulty.toLowerCase()} practice exam covering {test.chapter}. Use the full exam interface with timer, question palette, mark-for-review, auto-submit, refresh recovery and detailed performance analysis.</p><div className="flex flex-wrap gap-3 mt-7"><Link to={`/exam-mode?test=${test.slug}`} className="btn-primary inline-flex items-center gap-2"><Play className="w-4 h-4" /> Start Exam Mode</Link><Link to="/test-series" className="btn-secondary">All Test Series</Link></div></div></div></section>
    <main className="page-container section-padding"><div className="grid lg:grid-cols-[1fr_320px] gap-7 items-start"><div className="space-y-6"><section className="card-paper p-6 sm:p-8"><h2 className="text-3xl" style={{ fontFamily: 'var(--font-serif)', color: 'var(--ink)' }}>What this test includes</h2><div className="grid sm:grid-cols-2 gap-3 mt-6">{[` ${test.questions.length} multiple-choice questions`, `${test.minutes}-minute real countdown`, 'Mark-for-review + question palette', 'Automatic submit when time expires', 'Resume protection after accidental refresh', 'Answer explanations after submission', 'Topic-wise weak-area analysis', 'Wrong answers added to Mistake Book'].map((item) => <div key={item} className="tile-paper p-4 flex gap-3"><CheckCircle2 className="w-5 h-5 flex-shrink-0" style={{ color: 'var(--green)' }} /><span className="text-sm" style={{ color: 'var(--charcoal)' }}>{item.trim()}</span></div>)}</div></section><section className="card-paper p-6 sm:p-8"><h2 className="text-3xl" style={{ fontFamily: 'var(--font-serif)', color: 'var(--ink)' }}>Topics represented</h2><div className="flex flex-wrap gap-2 mt-5">{[...new Set(test.questions.map((q) => q.topic))].map((topic) => <span key={topic} className="rounded-full px-3 py-2 text-sm font-semibold" style={{ background: 'var(--gold-bg)', color: 'var(--gold)' }}>{topic}</span>)}</div></section><section className="card-paper p-6 sm:p-8"><h2 className="text-3xl" style={{ fontFamily: 'var(--font-serif)', color: 'var(--ink)' }}>Frequently asked questions</h2><div className="divide-y mt-4" style={{ borderColor: 'var(--border-soft)' }}>{faq.map((item) => <details key={item.question} className="py-4"><summary className="font-semibold cursor-pointer" style={{ color: 'var(--ink)' }}>{item.question}</summary><p className="mt-3 text-sm leading-relaxed" style={{ color: 'var(--muted)' }}>{item.answer}</p></details>)}</div></section></div><aside className="card-paper p-6 lg:sticky lg:top-24"><h2 className="text-xl" style={{ fontFamily: 'var(--font-serif)', color: 'var(--ink)' }}>Exam details</h2><dl className="space-y-3 text-sm mt-5"><div className="flex justify-between"><dt style={{ color: 'var(--muted)' }}>Class</dt><dd className="font-bold">{test.classLevel}</dd></div><div className="flex justify-between"><dt style={{ color: 'var(--muted)' }}>Subject</dt><dd className="font-bold">{test.subject}</dd></div><div className="flex justify-between"><dt style={{ color: 'var(--muted)' }}>Questions</dt><dd className="font-bold">{test.questions.length}</dd></div><div className="flex justify-between"><dt style={{ color: 'var(--muted)' }}>Time</dt><dd className="font-bold inline-flex items-center gap-1"><Clock3 className="w-4 h-4" /> {test.minutes} min</dd></div><div className="flex justify-between"><dt style={{ color: 'var(--muted)' }}>Difficulty</dt><dd className="font-bold">{test.difficulty}</dd></div><div className="flex justify-between"><dt style={{ color: 'var(--muted)' }}>Access</dt><dd className="font-bold inline-flex items-center gap-1">{test.isFree ? 'Free' : <><Lock className="w-4 h-4" /> Pro</>}</dd></div></dl><Link to={`/exam-mode?test=${test.slug}`} className="btn-primary w-full mt-6 inline-flex items-center justify-center gap-2">Start now <ArrowRight className="w-4 h-4" /></Link><div className="mt-4 text-xs flex items-start gap-2" style={{ color: 'var(--muted)' }}><Target className="w-4 h-4 flex-shrink-0" /> Designed for practice and revision, not an official CBSE examination.</div></aside></div></main>
  </div>;
}
