import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, FileQuestion, GraduationCap, MapPin } from 'lucide-react';

const noteHubs = [
  {
    title: 'Free CBSE Class 12 Business Studies Notes PDF',
    description: 'Chapter-wise Class 12 BST notes covering all published NCERT chapters with exam-focused revision.',
    path: '/cbse/class-12/business-studies-notes',
  },
  {
    title: 'Free CBSE Class 11 Microeconomics Notes PDF',
    description: 'Class 11 Microeconomics notes with concepts, diagrams, numericals and chapter-wise revision support.',
    path: '/cbse/class-11/microeconomics-notes',
  },
  {
    title: 'Free CBSE Class 12 Macroeconomics Notes PDF',
    description: 'Class 12 Macroeconomics notes for clear concepts, board revision and chapter-wise practice.',
    path: '/cbse/class-12/macroeconomics-notes',
  },
];

export default function SeoDiscoveryLinks() {
  return (
    <section className="section-padding" aria-labelledby="free-cbse-commerce-notes" style={{ background: 'var(--bg-white)' }}>
      <div className="page-container">
        <div className="max-w-3xl mb-8">
          <span className="eyebrow">Free CBSE study material</span>
          <h2 id="free-cbse-commerce-notes" className="headline mt-5">
            Free CBSE Commerce Notes for Class 11 &amp; 12
          </h2>
          <p className="mt-4 text-sm leading-7" style={{ color: 'var(--muted)' }}>
            Open subject-wise notes directly. These pages are organised for students searching chapter-wise CBSE Commerce notes, PDFs, revision material and practice resources.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {noteHubs.map((hub) => (
            <article key={hub.path} className="card-paper p-6">
              <BookOpen className="w-6 h-6 mb-4" style={{ color: 'var(--gold)' }} />
              <h3 className="text-xl leading-snug" style={{ fontFamily: 'var(--font-serif)', color: 'var(--ink)' }}>
                <Link to={hub.path}>{hub.title}</Link>
              </h3>
              <p className="text-sm leading-7 mt-3" style={{ color: 'var(--muted)' }}>{hub.description}</p>
              <Link to={hub.path} className="inline-flex items-center gap-1.5 text-sm font-semibold mt-5" style={{ color: 'var(--gold)' }}>
                Open free notes <ArrowRight className="w-4 h-4" />
              </Link>
            </article>
          ))}
        </div>

        <div className="flex flex-wrap gap-3 mt-6">
          <Link to="/cbse-notes" className="btn-primary inline-flex items-center gap-2">
            <GraduationCap className="w-4 h-4" /> Browse all CBSE notes
          </Link>
          <Link to="/cbse-practice" className="btn-outline-ink inline-flex items-center gap-2">
            <FileQuestion className="w-4 h-4" /> CBSE chapter practice
          </Link>
          <Link to="/cbse-pyq" className="btn-outline-ink inline-flex items-center gap-2">
            CBSE PYQ &amp; exam prep
          </Link>
          <Link to="/commerce-coaching-mehsana" className="btn-outline-ink inline-flex items-center gap-2">
            <MapPin className="w-4 h-4" /> Commerce coaching in Mehsana
          </Link>
        </div>
      </div>
    </section>
  );
}
