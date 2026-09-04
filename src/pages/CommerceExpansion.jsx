import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  ArrowRight, BookOpen, BriefcaseBusiness, CheckCircle2, FileText,
  GraduationCap, LibraryBig, Sparkles, Target, University, ScrollText,
} from 'lucide-react';
import SEO from '../components/ui/SEO';
import { bcomSemesters, mcomSemesters, commerceExamUnits, collegeResourceTypes, examResourceTypes } from '../data/commerceExpansion';
import { getPublishedCommerceResources } from '../lib/commerceResourceStore';
import { commerceResourceContext } from '../lib/commerceResourceModel';

const BASE = 'https://www.smitsircommerce.in';

function Badge({ children }) {
  return <span className="inline-flex items-center rounded-full px-3 py-1 text-[11px] font-bold tracking-wide uppercase" style={{ background: 'var(--gold-bg)', color: 'var(--gold)', border: '1px solid rgba(184,135,47,.22)' }}>{children}</span>;
}

function ComingSoon() {
  return <span className="inline-flex items-center rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-wider" style={{ background: 'rgba(99,102,241,.08)', color: '#5b5bd6', border: '1px solid rgba(99,102,241,.18)' }}>Coming Soon</span>;
}

function ResourcePills({ items }) {
  return <div className="flex flex-wrap gap-2 mt-4">{items.map((item) => <span key={item} className="text-xs px-2.5 py-1.5 rounded-lg" style={{ background: 'var(--bg-ivory)', border: '1px solid var(--border)', color: 'var(--muted)' }}>{item}</span>)}</div>;
}

function PlatformHero({ eyebrow, title, accent, description, children }) {
  return (
    <section className="page-hero">
      <div className="page-container">
        <Badge>{eyebrow}</Badge>
        <h1 className="mt-5 max-w-5xl">{title} <em>{accent}</em></h1>
        <p className="mt-5 text-lg leading-relaxed max-w-4xl" style={{ color: 'var(--muted)' }}>{description}</p>
        {children}
      </div>
    </section>
  );
}

function SemesterGrid({ degree, semesters }) {
  return (
    <section>
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-5 mb-7">
        <div>
          <Badge>{degree} semester map</Badge>
          <h2 className="text-3xl sm:text-4xl mt-4" style={{ color: 'var(--ink)' }}>{degree} semester-wise resource structure</h2>
          <p className="mt-3 max-w-3xl leading-7" style={{ color: 'var(--muted)' }}>
            The subject names below are common Commerce subject areas, not a claim that every university follows the same syllabus. Exact university, CBCS/NEP, elective and academic-year mapping will be attached when the corresponding material is uploaded.
          </p>
        </div>
        <ComingSoon />
      </div>
      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
        {semesters.map((sem) => (
          <article key={sem.semester} className="card-paper p-5 sm:p-6">
            <div className="flex items-center justify-between gap-3 mb-5">
              <div>
                <div className="text-xs font-bold uppercase tracking-[.16em]" style={{ color: 'var(--gold)' }}>{degree}</div>
                <h3 className="text-2xl mt-1" style={{ color: 'var(--ink)' }}>Semester {sem.semester}</h3>
              </div>
              <div className="w-11 h-11 rounded-xl grid place-items-center font-black" style={{ background: 'var(--gold-bg)', color: 'var(--gold)' }}>{sem.semester}</div>
            </div>
            <ul className="space-y-2.5">
              {sem.subjects.map((subject) => (
                <li key={subject} className="flex items-start gap-2.5 text-sm leading-6" style={{ color: 'var(--charcoal)' }}>
                  <CheckCircle2 className="w-4 h-4 mt-1 shrink-0" style={{ color: 'var(--green)' }} />
                  <span>{subject}</span>
                </li>
              ))}
            </ul>
            <ResourcePills items={collegeResourceTypes} />
          </article>
        ))}
      </div>
    </section>
  );
}

function PublishedResourceList({ stage, degree, exam, onCount, heading = 'Published resources' }) {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    setLoading(true);
    getPublishedCommerceResources({ stage, degree, exam })
      .then((items) => {
        if (!active) return;
        setResources(items);
        onCount?.(items.length);
      })
      .catch(() => {
        if (!active) return;
        setResources([]);
        onCount?.(0);
      })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [stage, degree, exam, onCount]);

  return (
    <section className="mb-10">
      <div className="flex items-center justify-between gap-3 mb-5">
        <div><Badge>Live library</Badge><h2 className="text-3xl mt-3" style={{ color: 'var(--ink)' }}>{heading}</h2></div>
        {!loading && resources.length > 0 && <span className="text-xs font-black uppercase tracking-widest" style={{ color: 'var(--green)' }}>{resources.length} available</span>}
      </div>
      {loading ? (
        <div className="card-paper p-6 text-sm" style={{ color: 'var(--muted)' }}>Checking the published library…</div>
      ) : resources.length === 0 ? (
        <div className="card-paper p-6">
          <ComingSoon />
          <p className="text-sm leading-7 mt-3" style={{ color: 'var(--muted)' }}>No verified resource has been published in this section yet. The semester or unit roadmap stays visible while material is being added.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
          {resources.map((resource) => (
            <Link key={resource.slug} to={resource.path} className="card-paper p-5 group">
              <div className="text-[10px] font-black uppercase tracking-widest" style={{ color: 'var(--gold)' }}>{resource.resourceType}</div>
              <h3 className="text-lg font-semibold mt-2" style={{ color: 'var(--ink)' }}>{resource.title}</h3>
              <p className="text-xs mt-2" style={{ color: 'var(--subtle)' }}>{commerceResourceContext(resource)}</p>
              <p className="text-sm leading-6 mt-3 line-clamp-3" style={{ color: 'var(--muted)' }}>{resource.description}</p>
              <span className="inline-flex items-center gap-1.5 mt-4 text-sm font-bold" style={{ color: 'var(--gold)' }}>Open resource <ArrowRight className="w-4 h-4" /></span>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}

function CommerceLearningHome() {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    '@id': `${BASE}/commerce-learning#collection`,
    url: `${BASE}/commerce-learning`,
    name: 'Commerce Learning Hub',
    description: 'Commerce learning resources from school to college and competitive exams.',
    about: ['Class 11 Commerce', 'Class 12 Commerce', 'B.Com', 'M.Com', 'UGC NET Commerce', 'GSET Commerce'],
    isPartOf: { '@id': `${BASE}/#website` },
  };

  const cards = [
    { icon: BookOpen, label: 'School Commerce', title: 'Class 11 & 12', text: 'The strongest and most complete part of the platform today: CBSE/GSEB notes, practice, tests and learning tools.', to: '/cbse-notes', status: 'Available now' },
    { icon: University, label: 'College Commerce', title: 'B.Com & M.Com', text: 'Semester-wise college resource architecture ready for notes, PDFs, MCQs, PYQs and university-specific material.', to: '/college-commerce', status: 'Expanding' },
    { icon: Target, label: 'Competitive Commerce', title: 'UGC NET & GSET', text: 'Commerce exam hubs for syllabus, unit-wise notes, MCQs, previous papers, mock tests and revision.', to: '/commerce-exams', status: 'Expanding' },
  ];

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-ivory)' }}>
      <SEO title="Commerce Learning Hub — School, College & Competitive Exams" description="A growing Commerce learning platform for Class 11 & 12, B.Com, M.Com, UGC NET Commerce and GSET Commerce with notes, PDFs, MCQs, PYQs, practice and tools." path="/commerce-learning" structuredData={structuredData} />
      <PlatformHero
        eyebrow="The complete Commerce journey"
        title="Commerce, from school to college"
        accent="and beyond."
        description="Smit Sir Commerce is growing into a complete Commerce learning platform. Smit Sir's personal teaching specialisation remains Class 11 & 12 Commerce, while the wider website is being organised for college students and Commerce competitive-exam aspirants too."
      >
        <div className="flex flex-wrap gap-3 mt-7">
          <Link to="/cbse-notes" className="btn-primary inline-flex items-center gap-2">Start with free school notes <ArrowRight className="w-4 h-4" /></Link>
          <Link to="/college-commerce" className="btn-outline-ink inline-flex items-center gap-2">Explore college roadmap</Link>
        </div>
      </PlatformHero>

      <main className="page-container section-padding">
        <section className="grid lg:grid-cols-3 gap-5">
          {cards.map(({ icon: Icon, label, title, text, to, status }) => (
            <Link key={title} to={to} className="card-paper p-6 group">
              <div className="flex items-center justify-between gap-3 mb-5">
                <div className="w-12 h-12 rounded-xl grid place-items-center" style={{ background: 'var(--gold-bg)' }}><Icon className="w-6 h-6" style={{ color: 'var(--gold)' }} /></div>
                <span className="text-[10px] uppercase tracking-widest font-black" style={{ color: status === 'Available now' ? 'var(--green)' : 'var(--gold)' }}>{status}</span>
              </div>
              <div className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--gold)' }}>{label}</div>
              <h2 className="text-2xl mt-2" style={{ color: 'var(--ink)' }}>{title}</h2>
              <p className="text-sm leading-7 mt-3" style={{ color: 'var(--muted)' }}>{text}</p>
              <span className="inline-flex items-center gap-1.5 text-sm font-bold mt-5" style={{ color: 'var(--gold)' }}>Open section <ArrowRight className="w-4 h-4" /></span>
            </Link>
          ))}
        </section>

        <section className="mt-12 rounded-2xl p-6 sm:p-8" style={{ background: '#fff', border: '1px solid var(--border)' }}>
          <Badge>Important distinction</Badge>
          <h2 className="text-3xl mt-4" style={{ color: 'var(--ink)' }}>Broad resource platform. Focused teaching specialisation.</h2>
          <p className="mt-4 leading-8 max-w-4xl" style={{ color: 'var(--muted)' }}>
            The website can organise useful Commerce material across school, B.Com, M.Com and competitive exams without pretending that Smit Sir personally teaches every subject listed on the platform. Personal teaching remains focused on Class 11 & 12 Commerce, especially the subjects explicitly listed on the About page.
          </p>
        </section>
      </main>
    </div>
  );
}

function CollegeHome() {
  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-ivory)' }}>
      <SEO title="College Commerce Study Material — B.Com & M.Com" description="College Commerce study-material hub for B.Com semesters 1–6 and M.Com semesters 1–4. University-specific notes, PDFs, MCQs, PYQs and revision resources will be added progressively." path="/college-commerce" />
      <PlatformHero
        eyebrow="College Commerce"
        title="One organised home for"
        accent="B.Com & M.Com."
        description="The college section is being built semester by semester. Instead of publishing hundreds of empty pages, the platform starts with a clear degree and semester map. Individual subject pages will become public when real material is available."
      >
        <div className="flex flex-wrap gap-3 mt-7">
          <Link to="/college-commerce/bcom" className="btn-primary inline-flex items-center gap-2">B.Com Semester 1–6 <ArrowRight className="w-4 h-4" /></Link>
          <Link to="/college-commerce/mcom" className="btn-outline-ink inline-flex items-center gap-2">M.Com Semester 1–4</Link>
        </div>
      </PlatformHero>
      <main className="page-container section-padding">
        <div className="grid md:grid-cols-2 gap-5">
          <Link to="/college-commerce/bcom" className="card-paper p-7">
            <University className="w-8 h-8" style={{ color: 'var(--gold)' }} />
            <div className="flex items-center gap-3 mt-5"><h2 className="text-3xl" style={{ color: 'var(--ink)' }}>Bachelor of Commerce</h2><ComingSoon /></div>
            <p className="mt-3 leading-7" style={{ color: 'var(--muted)' }}>Six-semester structure with subject placeholders ready for university-specific notes, MCQs, important questions and previous papers.</p>
            <span className="inline-flex items-center gap-1.5 mt-5 font-bold text-sm" style={{ color: 'var(--gold)' }}>Explore B.Com map <ArrowRight className="w-4 h-4" /></span>
          </Link>
          <Link to="/college-commerce/mcom" className="card-paper p-7">
            <GraduationCap className="w-8 h-8" style={{ color: 'var(--gold)' }} />
            <div className="flex items-center gap-3 mt-5"><h2 className="text-3xl" style={{ color: 'var(--ink)' }}>Master of Commerce</h2><ComingSoon /></div>
            <p className="mt-3 leading-7" style={{ color: 'var(--muted)' }}>Four-semester postgraduate structure ready for advanced Commerce notes, research-focused material, MCQs, PYQs and revision resources.</p>
            <span className="inline-flex items-center gap-1.5 mt-5 font-bold text-sm" style={{ color: 'var(--gold)' }}>Explore M.Com map <ArrowRight className="w-4 h-4" /></span>
          </Link>
        </div>

        <section className="mt-10 card-paper p-6 sm:p-8">
          <Badge>Built for university variation</Badge>
          <h2 className="text-3xl mt-4" style={{ color: 'var(--ink)' }}>University mapping comes before subject-page SEO.</h2>
          <p className="mt-4 leading-8" style={{ color: 'var(--muted)' }}>
            B.Com and M.Com syllabi differ across universities, NEP/CBCS structures, electives and academic years. When material is uploaded, it can be tagged by degree, university, semester, subject and year so students reach the correct version instead of a generic PDF with the wrong syllabus.
          </p>
        </section>
      </main>
    </div>
  );
}

function DegreePage({ degree }) {
  const isBcom = degree === 'B.Com';
  const semesters = isBcom ? bcomSemesters : mcomSemesters;
  const path = isBcom ? '/college-commerce/bcom' : '/college-commerce/mcom';
  const semesterLabel = isBcom ? 'Semesters 1–6' : 'Semesters 1–4';
  const [publishedCount, setPublishedCount] = useState(null);
  const hasPublished = Number(publishedCount) > 0;

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-ivory)' }}>
      <SEO
        title={`${degree} Study Material — ${semesterLabel}`}
        description={hasPublished
          ? `Free and published ${degree} Commerce material organised by university, semester and subject, with notes, PDFs, MCQs and PYQs as available.`
          : `${degree} semester-wise Commerce resource roadmap. Common subject areas are shown while university-specific notes, PDFs, MCQs and PYQs are being prepared.`}
        path={path}
        noindex={publishedCount === null ? true : !hasPublished}
      />
      <PlatformHero
        eyebrow={`${degree} resource library`}
        title={`${degree} Commerce material`}
        accent={hasPublished ? 'is now going live.' : 'is being built properly.'}
        description={hasPublished
          ? `Published ${degree} resources are organised by university, semester and exact subject. The semester map remains below so new material can be added without changing the structure.`
          : `The ${degree} section is visible now so the structure is ready before files arrive. It stays out of search while the library is only a roadmap and becomes indexable after genuine ${degree} material is published.`}
      >
        <div className="mt-6">{hasPublished ? <span className="inline-flex items-center rounded-full px-3 py-1 text-[11px] font-black uppercase tracking-wider" style={{ background: 'rgba(77,124,15,.09)', color: 'var(--green)', border: '1px solid rgba(77,124,15,.24)' }}>{publishedCount} published resource{publishedCount === 1 ? '' : 's'}</span> : <ComingSoon />}</div>
      </PlatformHero>
      <main className="page-container section-padding">
        <PublishedResourceList stage="college" degree={degree} onCount={setPublishedCount} heading={`Published ${degree} resources`} />
        <SemesterGrid degree={degree} semesters={semesters} />
        <section className="mt-12 card-paper p-6 sm:p-8">
          <h2 className="text-2xl" style={{ color: 'var(--ink)' }}>Upload workflow</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-5">
            {['Choose university', 'Choose semester', 'Choose exact subject', 'Attach notes / MCQs / PYQs'].map((item, index) => (
              <div key={item} className="tile-paper p-4">
                <div className="text-xs font-black" style={{ color: 'var(--gold)' }}>STEP {index + 1}</div>
                <div className="font-semibold mt-2" style={{ color: 'var(--ink)' }}>{item}</div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

function ExamHome() {
  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-ivory)' }}>
      <SEO title="Commerce Competitive Exams — UGC NET & GSET" description="Commerce competitive-exam hub for UGC NET Commerce and GSET Commerce with syllabus structure, unit-wise notes, MCQs, previous papers, mock tests and revision resources." path="/commerce-exams" />
      <PlatformHero
        eyebrow="Competitive Commerce"
        title="Commerce preparation for"
        accent="NET & SET."
        description="A dedicated exam layer is being added for Commerce aspirants. UGC NET Commerce and GSET Commerce will have separate exam hubs while sharing high-quality unit-wise Commerce learning resources where the syllabus overlaps."
      />
      <main className="page-container section-padding">
        <div className="grid md:grid-cols-2 gap-5">
          <Link to="/ugc-net-commerce" className="card-paper p-7">
            <ScrollText className="w-8 h-8" style={{ color: 'var(--gold)' }} />
            <div className="text-xs font-black uppercase tracking-widest mt-5" style={{ color: 'var(--gold)' }}>UGC NET · NTA</div>
            <h2 className="text-3xl mt-2" style={{ color: 'var(--ink)' }}>Commerce — Subject 08 / 008</h2>
            <p className="mt-3 leading-7" style={{ color: 'var(--muted)' }}>Paper 1 plus Commerce subject preparation, with space ready for the official syllabus PDF, unit notes, MCQs, previous papers and mock tests.</p>
            <span className="inline-flex items-center gap-1.5 mt-5 font-bold text-sm" style={{ color: 'var(--gold)' }}>Open UGC NET Commerce <ArrowRight className="w-4 h-4" /></span>
          </Link>
          <Link to="/gset-commerce" className="card-paper p-7">
            <Target className="w-8 h-8" style={{ color: 'var(--gold)' }} />
            <div className="text-xs font-black uppercase tracking-widest mt-5" style={{ color: 'var(--gold)' }}>Gujarat SET</div>
            <h2 className="text-3xl mt-2" style={{ color: 'var(--ink)' }}>Commerce — Code 17</h2>
            <p className="mt-3 leading-7" style={{ color: 'var(--muted)' }}>Dedicated GSET Commerce structure for syllabus, unit-wise notes, MCQs, previous papers, mock tests and revision resources.</p>
            <span className="inline-flex items-center gap-1.5 mt-5 font-bold text-sm" style={{ color: 'var(--gold)' }}>Open GSET Commerce <ArrowRight className="w-4 h-4" /></span>
          </Link>
        </div>
      </main>
    </div>
  );
}

function ExamPage({ type }) {
  const isNet = type === 'UGC NET';
  const path = isNet ? '/ugc-net-commerce' : '/gset-commerce';
  const code = isNet ? '08 / 008' : '17';
  const label = isNet ? 'UGC NET Commerce' : 'GSET Commerce';
  const description = isNet
    ? 'UGC NET Commerce preparation hub for subject 08/008 with Paper 1, Commerce syllabus structure, unit-wise notes, MCQs, previous papers, mock tests and revision.'
    : 'GSET Commerce preparation hub for subject code 17 with syllabus structure, unit-wise notes, MCQs, previous papers, mock tests and revision.';

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-ivory)' }}>
      <SEO title={`${label} — Syllabus, Notes, MCQs & PYQs`} description={description} path={path} />
      <PlatformHero
        eyebrow={`${label} · Code ${code}`}
        title={`${label} preparation,`}
        accent="organised unit by unit."
        description={isNet
          ? 'This hub separates UGC NET Paper 1 from the Commerce subject paper. Commerce is subject code 08 in the official UGC subject list and appears as 008 in NTA answer-key material.'
          : 'This hub follows the official GSET Commerce subject identity: Code 17. The resource library is ready for the official syllabus PDF, unit notes, MCQs, previous papers, mock tests and revision material.'}
      >
        <ResourcePills items={examResourceTypes} />
      </PlatformHero>

      <main className="page-container section-padding">
        <PublishedResourceList stage="competitive" exam={label} heading={`${label} published resources`} />
        {isNet && (
          <section className="card-paper p-6 sm:p-8 mb-8">
            <div className="flex items-center gap-3"><LibraryBig className="w-6 h-6" style={{ color: 'var(--gold)' }} /><h2 className="text-2xl" style={{ color: 'var(--ink)' }}>Paper 1 — Teaching & Research Aptitude</h2></div>
            <p className="mt-3 leading-7" style={{ color: 'var(--muted)' }}>A separate Paper 1 resource area is reserved for syllabus, notes, practice and previous-paper preparation. Materials will be activated only after they are uploaded and verified.</p>
            <div className="mt-4"><ComingSoon /></div>
          </section>
        )}

        <section>
          <div className="flex flex-wrap items-center justify-between gap-3 mb-7">
            <div>
              <Badge>Commerce subject map</Badge>
              <h2 className="text-3xl sm:text-4xl mt-4" style={{ color: 'var(--ink)' }}>10 Commerce units</h2>
            </div>
            <ComingSoon />
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {commerceExamUnits.map((unit, index) => (
              <article key={unit} className="card-paper p-5 flex gap-4">
                <div className="w-10 h-10 rounded-xl grid place-items-center shrink-0 font-black" style={{ background: 'var(--gold-bg)', color: 'var(--gold)' }}>{index + 1}</div>
                <div>
                  <h3 className="font-semibold leading-6" style={{ color: 'var(--ink)' }}>{unit}</h3>
                  <div className="mt-2 text-xs" style={{ color: 'var(--subtle)' }}>Notes · MCQs · PYQs · Revision</div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-10 card-paper p-6 sm:p-8">
          <div className="flex items-start gap-3">
            <Sparkles className="w-6 h-6 mt-1 shrink-0" style={{ color: 'var(--gold)' }} />
            <div>
              <h2 className="text-2xl" style={{ color: 'var(--ink)' }}>No duplicate-content mess.</h2>
              <p className="mt-3 leading-7" style={{ color: 'var(--muted)' }}>
                Where NET and GSET Commerce cover the same unit, the platform can maintain one strong unit resource and connect both exam hubs to it. Exam-specific syllabus documents, PYQs, notifications and mock formats can remain separate.
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default function CommerceExpansion() {
  const { pathname } = useLocation();
  if (pathname === '/commerce-learning') return <CommerceLearningHome />;
  if (pathname === '/college-commerce') return <CollegeHome />;
  if (pathname === '/college-commerce/bcom') return <DegreePage degree="B.Com" />;
  if (pathname === '/college-commerce/mcom') return <DegreePage degree="M.Com" />;
  if (pathname === '/commerce-exams') return <ExamHome />;
  if (pathname === '/ugc-net-commerce') return <ExamPage type="UGC NET" />;
  if (pathname === '/gset-commerce') return <ExamPage type="GSET" />;
  return null;
}
