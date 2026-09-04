import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, GraduationCap, Target, University } from 'lucide-react';

const pathways = [
  {
    icon: BookOpen,
    eyebrow: 'School Commerce',
    title: 'Class 11 & 12',
    text: 'The strongest part of the platform today: notes, PDFs, practice, tests and learning tools.',
    to: '/cbse-notes',
    badge: 'Available now',
  },
  {
    icon: University,
    eyebrow: 'College Commerce',
    title: 'B.Com & M.Com',
    text: 'Semester-wise architecture is ready for university-specific notes, MCQs, PYQs and revision material.',
    to: '/college-commerce',
    badge: 'Expanding',
  },
  {
    icon: Target,
    eyebrow: 'Competitive Commerce',
    title: 'UGC NET & GSET',
    text: 'Dedicated Commerce exam hubs for syllabus, unit-wise notes, MCQs, previous papers and mock tests.',
    to: '/commerce-exams',
    badge: 'Expanding',
  },
];

export default function CommerceJourneyPreview() {
  return (
    <section className="section-padding" style={{ background: 'var(--bg-ivory)', borderBottom: '1px solid var(--border-soft)' }}>
      <div className="page-container">
        <div className="max-w-3xl mb-8">
          <span className="eyebrow">More than Class 11 &amp; 12</span>
          <h2 className="text-3xl sm:text-4xl mt-4" style={{ color: 'var(--ink)' }}>
            One Commerce platform. <em>Every stage of the journey.</em>
          </h2>
          <p className="mt-4 leading-7" style={{ color: 'var(--muted)' }}>
            Smit Sir Commerce is expanding from its Class 11 &amp; 12 foundation into college and Commerce competitive-exam resources, while Smit Sir's personal teaching specialisation remains clearly focused on school Commerce.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-5">
          {pathways.map(({ icon: Icon, eyebrow, title, text, to, badge }) => (
            <Link key={title} to={to} className="card-paper p-6 group">
              <div className="flex items-start justify-between gap-4">
                <div className="w-11 h-11 rounded-xl grid place-items-center" style={{ background: 'var(--gold-bg)' }}>
                  <Icon className="w-5 h-5" style={{ color: 'var(--gold)' }} />
                </div>
                <span className="text-[10px] uppercase tracking-widest font-black" style={{ color: badge === 'Available now' ? 'var(--green)' : 'var(--gold)' }}>{badge}</span>
              </div>
              <div className="text-xs uppercase tracking-widest font-bold mt-5" style={{ color: 'var(--gold)' }}>{eyebrow}</div>
              <h3 className="text-2xl mt-2" style={{ color: 'var(--ink)' }}>{title}</h3>
              <p className="text-sm leading-7 mt-3" style={{ color: 'var(--muted)' }}>{text}</p>
              <span className="inline-flex items-center gap-1.5 mt-5 text-sm font-bold" style={{ color: 'var(--gold)' }}>Explore <ArrowRight className="w-4 h-4" /></span>
            </Link>
          ))}
        </div>

        <div className="mt-7">
          <Link to="/commerce-learning" className="btn-primary inline-flex items-center gap-2">
            Explore the complete Commerce hub <GraduationCap className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
