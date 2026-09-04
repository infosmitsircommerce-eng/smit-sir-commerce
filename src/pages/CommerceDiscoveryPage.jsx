import { useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, BookOpen, Search, University } from 'lucide-react';
import SEO from '../components/ui/SEO';
import { getPublishedCommerceResources } from '../lib/commerceResourceStore';
import { commerceResourceContext, slugifyResource } from '../lib/commerceResourceModel';
import {
  collegeDegreePath,
  collegeSemesterPath,
  collegeSubjectPath,
  competitiveUnitPath,
  findCollegeCollection,
  findCompetitiveCollection,
} from '../lib/commerceDiscovery';

function unique(values) {
  return [...new Set(values.filter(Boolean))].sort((a, b) => String(a).localeCompare(String(b), undefined, { numeric: true }));
}

function ResourceCards({ resources }) {
  const [query, setQuery] = useState('');
  const [type, setType] = useState('');
  const types = useMemo(() => unique(resources.map((item) => item.resourceType)), [resources]);
  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return resources.filter((item) => {
      if (type && item.resourceType !== type) return false;
      if (!needle) return true;
      return [item.title, item.description, item.subject, item.resourceType, ...(item.keyTopics || [])]
        .filter(Boolean).join(' ').toLowerCase().includes(needle);
    });
  }, [resources, query, type]);

  return (
    <section className="mt-8">
      <div className="grid sm:grid-cols-[1fr_220px] gap-3 card-paper p-4">
        <label className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--subtle)' }} />
          <input className="input-field !pl-9" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search this collection…" />
        </label>
        <select className="input-field" value={type} onChange={(e) => setType(e.target.value)}>
          <option value="">All resource types</option>
          {types.map((value) => <option key={value}>{value}</option>)}
        </select>
      </div>

      <div className="flex items-center justify-between gap-3 mt-5 mb-3">
        <h2 className="text-2xl" style={{ color: 'var(--ink)' }}>Published material</h2>
        <span className="text-xs font-black uppercase tracking-widest" style={{ color: 'var(--green)' }}>{filtered.length} result{filtered.length === 1 ? '' : 's'}</span>
      </div>

      {filtered.length === 0 ? (
        <div className="card-paper p-6 text-sm" style={{ color: 'var(--muted)' }}>No resource matches the current filter.</div>
      ) : (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((resource) => (
            <Link key={resource.slug} to={resource.path} className="card-paper p-5 group">
              <div className="flex items-start justify-between gap-3">
                <span className="text-[10px] font-black uppercase tracking-widest" style={{ color: 'var(--gold)' }}>{resource.resourceType}</span>
                {resource.isOfficial && <span className="text-[9px] font-black uppercase tracking-widest" style={{ color: 'var(--green)' }}>Official</span>}
              </div>
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

function CollegeDiscovery({ resources, params, pathname }) {
  const { matches, semester, subjectSlug } = findCollegeCollection(resources, params);
  const sample = matches[0];

  if (!sample) {
    return <EmptyDiscovery pathname={pathname} back="/college-commerce" label="College Commerce" />;
  }

  const isSubject = Boolean(subjectSlug);
  const isSemester = Boolean(semester) && !isSubject;
  const university = sample.university;
  const degree = sample.degree;
  const subject = isSubject ? sample.subject : null;

  const title = isSubject
    ? `${subject} — ${degree} Semester ${semester} ${university}`
    : isSemester
      ? `${degree} Semester ${semester} Study Material — ${university}`
      : `${degree} Study Material — ${university}`;

  const description = isSubject
    ? `Published ${subject} resources for ${degree} Semester ${semester} at ${university}, including notes, PDFs, MCQs, PYQs and revision material when available.`
    : isSemester
      ? `Browse published ${degree} Semester ${semester} Commerce resources for ${university} by subject and resource type.`
      : `Browse published ${degree} Commerce resources for ${university} by semester, subject and resource type.`;

  let drilldown = [];
  if (!semester) {
    const semesterValues = unique(matches.map((item) => Number(item.semester)));
    drilldown = semesterValues.map((value) => {
      const item = matches.find((resource) => Number(resource.semester) === value);
      const count = matches.filter((resource) => Number(resource.semester) === value).length;
      return { path: collegeSemesterPath(item), title: `Semester ${value}`, meta: `${count} resource${count === 1 ? '' : 's'}` };
    });
  } else if (!isSubject) {
    const subjects = unique(matches.map((item) => item.subject));
    drilldown = subjects.map((value) => {
      const item = matches.find((resource) => resource.subject === value);
      const count = matches.filter((resource) => resource.subject === value).length;
      return { path: collegeSubjectPath(item), title: value, meta: `${count} resource${count === 1 ? '' : 's'}` };
    });
  }

  const parentPath = isSubject
    ? collegeSemesterPath(sample)
    : isSemester
      ? collegeDegreePath(sample)
      : degree === 'B.Com' ? '/college-commerce/bcom' : '/college-commerce/mcom';

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-ivory)' }}>
      <SEO title={title} description={description} path={pathname} />
      <section className="page-hero">
        <div className="page-container">
          <Link to={parentPath} className="inline-flex items-center gap-2 text-sm font-semibold" style={{ color: 'var(--gold)' }}><ArrowLeft className="w-4 h-4" /> Back</Link>
          <div className="mt-5 text-xs font-black uppercase tracking-widest" style={{ color: 'var(--gold)' }}>College Commerce Discovery</div>
          <h1 className="mt-4 max-w-5xl">{title}</h1>
          <p className="mt-4 max-w-3xl text-lg leading-8" style={{ color: 'var(--muted)' }}>{description}</p>
          <div className="mt-5 inline-flex items-center gap-2 text-sm font-bold" style={{ color: 'var(--green)' }}><University className="w-4 h-4" /> {matches.length} published resource{matches.length === 1 ? '' : 's'}</div>
        </div>
      </section>

      <main className="page-container section-padding">
        {drilldown.length > 0 && (
          <section>
            <div className="text-xs font-black uppercase tracking-widest" style={{ color: 'var(--subtle)' }}>{!semester ? 'Choose semester' : 'Choose subject'}</div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 mt-4">
              {drilldown.map((item) => (
                <Link key={item.path} to={item.path} className="tile-paper p-5 group">
                  <div className="font-semibold" style={{ color: 'var(--ink)' }}>{item.title}</div>
                  <div className="text-xs mt-2" style={{ color: 'var(--muted)' }}>{item.meta}</div>
                  <span className="inline-flex items-center gap-1 mt-3 text-xs font-bold" style={{ color: 'var(--gold)' }}>Open <ArrowRight className="w-3.5 h-3.5" /></span>
                </Link>
              ))}
            </div>
          </section>
        )}

        <ResourceCards resources={matches} />
      </main>
    </div>
  );
}

function CompetitiveDiscovery({ resources, params, pathname }) {
  const { matches, unit, syllabus } = findCompetitiveCollection(resources, params);
  const sample = matches[0];

  if (!sample) {
    return <EmptyDiscovery pathname={pathname} back="/commerce-exams" label="Commerce Exams" />;
  }

  const unitLabel = syllabus ? 'Official Syllabus' : `Unit ${unit}`;
  const title = `${sample.exam} ${unitLabel} Resources`;
  const description = `Browse published ${sample.exam} ${unitLabel.toLowerCase()} material by resource type, including notes, MCQs, PYQs, syllabus and revision resources when available.`;
  const parent = sample.exam === 'UGC NET Commerce' ? '/ugc-net-commerce' : sample.exam === 'GSET Commerce' ? '/gset-commerce' : '/commerce-exams';

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-ivory)' }}>
      <SEO title={title} description={description} path={pathname} />
      <section className="page-hero">
        <div className="page-container">
          <Link to={parent} className="inline-flex items-center gap-2 text-sm font-semibold" style={{ color: 'var(--gold)' }}><ArrowLeft className="w-4 h-4" /> Back to {sample.exam}</Link>
          <div className="mt-5 text-xs font-black uppercase tracking-widest" style={{ color: 'var(--gold)' }}>Competitive Commerce Discovery</div>
          <h1 className="mt-4 max-w-5xl">{title}</h1>
          <p className="mt-4 max-w-3xl text-lg leading-8" style={{ color: 'var(--muted)' }}>{description}</p>
          <div className="mt-5 inline-flex items-center gap-2 text-sm font-bold" style={{ color: 'var(--green)' }}><BookOpen className="w-4 h-4" /> {matches.length} published resource{matches.length === 1 ? '' : 's'}</div>
        </div>
      </section>
      <main className="page-container section-padding"><ResourceCards resources={matches} /></main>
    </div>
  );
}

function EmptyDiscovery({ pathname, back, label }) {
  return (
    <div className="min-h-[65vh] grid place-items-center px-4" style={{ background: 'var(--bg-ivory)' }}>
      <SEO title="Commerce Collection Not Available" description="This Commerce collection has no published resources." path={pathname} noindex />
      <div className="card-paper p-8 max-w-xl text-center">
        <Search className="w-8 h-8 mx-auto" style={{ color: 'var(--gold)' }} />
        <h1 className="text-2xl mt-4" style={{ color: 'var(--ink)' }}>No published resources in this collection.</h1>
        <p className="text-sm leading-6 mt-3" style={{ color: 'var(--muted)' }}>Empty combinations are intentionally kept out of search. Try the parent library instead.</p>
        <Link to={back} className="btn-primary inline-flex mt-6">{label}</Link>
      </div>
    </div>
  );
}

export default function CommerceDiscoveryPage() {
  const params = useParams();
  const { pathname } = useLocation();
  const [resources, setResources] = useState(null);

  useEffect(() => {
    let active = true;
    getPublishedCommerceResources()
      .then((items) => { if (active) setResources(items); })
      .catch(() => { if (active) setResources([]); });
    return () => { active = false; };
  }, []);

  if (resources === null) {
    return (
      <div className="min-h-[55vh] grid place-items-center" style={{ background: 'var(--bg-ivory)' }}>
        <SEO title="Commerce Discovery" description="Loading Commerce resources." path={pathname} noindex />
        <div className="text-sm" style={{ color: 'var(--muted)' }}>Loading Commerce library…</div>
      </div>
    );
  }

  if (pathname.startsWith('/college/')) return <CollegeDiscovery resources={resources} params={params} pathname={pathname} />;
  if (pathname.startsWith('/competitive/')) return <CompetitiveDiscovery resources={resources} params={params} pathname={pathname} />;
  return <EmptyDiscovery pathname={pathname} back="/commerce-learning" label="Commerce Learning Hub" />;
}
