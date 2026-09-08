import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, GraduationCap, Lightbulb, ListChecks } from 'lucide-react';
import SEO from '../components/ui/SEO';
import { teacherContentGuides } from '../data/teacherContentGuides';

const groups = [
  {
    title: 'GSEB Class 12 Economics',
    description: 'Teacher-style revision, common mistakes, banking, answer writing, important questions and visual revision.',
    icon: GraduationCap,
    filter: (guide) => guide.path.startsWith('/gseb/'),
  },
  {
    title: 'CBSE Class 12 Economics',
    description: 'National Income numericals, common mistakes and Economics exam-analysis guides.',
    icon: Lightbulb,
    filter: (guide) => guide.path.startsWith('/cbse/class-12/national-income') || guide.path.startsWith('/class-12-economics-'),
  },
  {
    title: 'CBSE Class 12 Business Studies',
    description: 'Case-study strategy, chapter clues and long-answer writing.',
    icon: ListChecks,
    filter: (guide) => guide.path.startsWith('/cbse/class-12/business-studies-'),
  },
  {
    title: 'Class 12 Commerce Revision Plans',
    description: 'Realistic seven-day and thirty-day revision systems built around recall, practice and error correction.',
    icon: BookOpen,
    filter: (guide) => guide.path.startsWith('/class-12-commerce-'),
  },
];

export default function TeacherGuidesHub() {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Smit Sir Teacher Guides',
    url: 'https://www.smitsircommerce.in/teacher-guides',
    description: 'Teacher-prepared Commerce guides for GSEB Economics, CBSE Economics, Business Studies, numericals, case studies and revision strategy.',
    hasPart: teacherContentGuides.map((guide) => ({
      '@type': 'LearningResource',
      name: guide.title,
      url: `https://www.smitsircommerce.in${guide.path}`,
    })),
  };

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-ivory)' }}>
      <SEO
        title="Smit Sir Teacher Guides — Economics, Business Studies & Revision"
        description="Free teacher-prepared Commerce guides for GSEB and CBSE students: Economics mistakes, numericals, diagrams, Business Studies case studies and revision plans."
        path="/teacher-guides"
        structuredData={structuredData}
      />

      <section className="page-hero">
        <div className="page-container max-w-5xl">
          <span className="eyebrow">Smit Sir Content Library</span>
          <h1 className="mt-5">Commerce explained like a teacher would explain it after class.</h1>
          <p className="mt-5 text-lg leading-8 max-w-3xl" style={{ color: 'var(--muted)' }}>
            These are not random SEO articles. Each guide is built around one student problem: a confusing concept, a repeated mistake, a numerical method, a case-study clue, answer presentation or exam revision.
          </p>
          <div className="flex flex-wrap gap-3 mt-7">
            <Link to="/study-material" className="btn-primary inline-flex items-center gap-2">Open Study Material <ArrowRight className="w-4 h-4" /></Link>
            <Link to="/book-demo" className="btn-secondary inline-flex items-center gap-2">Free Paper Analysis + Demo</Link>
          </div>
        </div>
      </section>

      <main className="page-container section-padding space-y-8">
        {groups.map(({ title, description, icon: Icon, filter }) => {
          const guides = teacherContentGuides.filter(filter);
          return (
            <section key={title} className="card-paper p-5 sm:p-7 md:p-9">
              <div className="flex items-start gap-3">
                <Icon className="w-6 h-6 mt-1" style={{ color: 'var(--gold)' }} />
                <div>
                  <h2 className="text-3xl" style={{ fontFamily: 'var(--font-serif)', color: 'var(--ink)' }}>{title}</h2>
                  <p className="mt-2 leading-7 max-w-3xl" style={{ color: 'var(--muted)' }}>{description}</p>
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-4 mt-7">
                {guides.map((guide) => (
                  <Link key={guide.path} to={guide.path} className="tile-paper p-5 group">
                    <div className="text-xs font-black uppercase tracking-[.12em]" style={{ color: 'var(--gold)' }}>{guide.eyebrow}</div>
                    <h3 className="text-xl mt-2" style={{ fontFamily: 'var(--font-serif)', color: 'var(--ink)' }}>{guide.shortTitle}</h3>
                    <p className="text-sm leading-7 mt-2" style={{ color: 'var(--muted)' }}>{guide.description}</p>
                    <span className="inline-flex items-center gap-2 mt-4 text-sm font-semibold" style={{ color: 'var(--gold)' }}>Open guide <ArrowRight className="w-4 h-4" /></span>
                  </Link>
                ))}
              </div>
            </section>
          );
        })}

        <section className="card-paper p-6 sm:p-8 text-center">
          <h2 className="text-3xl" style={{ fontFamily: 'var(--font-serif)', color: 'var(--ink)' }}>The method behind every guide</h2>
          <p className="mt-4 max-w-3xl mx-auto leading-8" style={{ color: 'var(--muted)' }}>
            Understand the concept, identify the common mistake, practise without notes, check the explanation, then repeat only the weak area. The goal is not to read more pages. The goal is to remember and apply more of what you study.
          </p>
        </section>
      </main>
    </div>
  );
}
