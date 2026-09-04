import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, FilterX, Search, SlidersHorizontal, University } from 'lucide-react';
import { getPublishedCommerceResources } from '../../lib/commerceResourceStore';
import { commerceResourceContext } from '../../lib/commerceResourceModel';
import { collegeDegreePath, competitiveUnitPath } from '../../lib/commerceDiscovery';

function unique(values) {
  return [...new Set(values.filter(Boolean))].sort((a, b) => String(a).localeCompare(String(b), undefined, { numeric: true }));
}

export default function CommerceResourceFinder({ stage, degree, exam, onCount, title = 'Find the exact resource' }) {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [university, setUniversity] = useState('');
  const [semester, setSemester] = useState('');
  const [subject, setSubject] = useState('');
  const [resourceType, setResourceType] = useState('');
  const [unit, setUnit] = useState('');

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

  const options = useMemo(() => ({
    universities: unique(resources.map((item) => item.university)),
    semesters: unique(resources.map((item) => item.semester).map(Number)),
    subjects: unique(resources.map((item) => item.subject)),
    types: unique(resources.map((item) => item.resourceType)),
    units: unique(resources.map((item) => item.unit).filter(Boolean).map(Number)),
  }), [resources]);

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return resources.filter((item) => {
      if (university && item.university !== university) return false;
      if (semester && Number(item.semester) !== Number(semester)) return false;
      if (subject && item.subject !== subject) return false;
      if (resourceType && item.resourceType !== resourceType) return false;
      if (unit && Number(item.unit) !== Number(unit)) return false;
      if (!needle) return true;
      const haystack = [
        item.title, item.description, item.university, item.degree, item.semester,
        item.exam, item.unit, item.subject, item.subjectCode, item.academicYear,
        item.resourceType, ...(item.keyTopics || []),
      ].filter(Boolean).join(' ').toLowerCase();
      return haystack.includes(needle);
    });
  }, [resources, query, university, semester, subject, resourceType, unit]);

  const browseCards = useMemo(() => {
    if (stage === 'college') {
      const map = new Map();
      for (const item of resources) {
        if (!item.university || !item.degree) continue;
        const path = collegeDegreePath(item);
        const current = map.get(path) || { path, label: item.university, meta: item.degree, count: 0 };
        current.count += 1;
        map.set(path, current);
      }
      return [...map.values()].sort((a, b) => b.count - a.count || a.label.localeCompare(b.label));
    }

    if (stage === 'competitive') {
      const map = new Map();
      for (const item of resources) {
        if (!item.exam) continue;
        const path = competitiveUnitPath(item);
        const meta = item.unit ? `Unit ${item.unit}` : 'Official syllabus';
        const current = map.get(path) || { path, label: item.exam, meta, count: 0 };
        current.count += 1;
        map.set(path, current);
      }
      return [...map.values()].sort((a, b) => b.count - a.count || a.meta.localeCompare(b.meta, undefined, { numeric: true }));
    }

    return [];
  }, [resources, stage]);

  const hasFilters = query || university || semester || subject || resourceType || unit;
  const reset = () => {
    setQuery('');
    setUniversity('');
    setSemester('');
    setSubject('');
    setResourceType('');
    setUnit('');
  };

  return (
    <section className="mb-12">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
        <div>
          <span className="eyebrow">Commerce Discovery</span>
          <h2 className="text-3xl sm:text-4xl mt-4" style={{ color: 'var(--ink)' }}>{title}</h2>
          <p className="mt-3 max-w-3xl leading-7" style={{ color: 'var(--muted)' }}>
            Filter the published library instead of scrolling through a giant PDF dump. Empty combinations are never created as SEO pages.
          </p>
        </div>
        {!loading && <div className="text-sm font-bold" style={{ color: 'var(--gold)' }}>{filtered.length} of {resources.length} resource{resources.length === 1 ? '' : 's'}</div>}
      </div>

      {!loading && browseCards.length > 0 && (
        <div className="mt-7">
          <div className="text-xs font-black uppercase tracking-widest mb-3" style={{ color: 'var(--subtle)' }}>
            {stage === 'college' ? 'Browse by university' : 'Browse by unit'}
          </div>
          <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-3">
            {browseCards.slice(0, 12).map((card) => (
              <Link key={card.path} to={card.path} className="tile-paper p-4 group">
                <div className="flex items-start justify-between gap-3">
                  {stage === 'college' ? <University className="w-5 h-5 shrink-0" style={{ color: 'var(--gold)' }} /> : <BookOpen className="w-5 h-5 shrink-0" style={{ color: 'var(--gold)' }} />}
                  <span className="text-[10px] font-black uppercase tracking-wider" style={{ color: 'var(--green)' }}>{card.count}</span>
                </div>
                <div className="font-semibold mt-3" style={{ color: 'var(--ink)' }}>{card.label}</div>
                <div className="text-xs mt-1" style={{ color: 'var(--muted)' }}>{card.meta}</div>
                <span className="inline-flex items-center gap-1 mt-3 text-xs font-bold" style={{ color: 'var(--gold)' }}>Browse <ArrowRight className="w-3.5 h-3.5" /></span>
              </Link>
            ))}
          </div>
        </div>
      )}

      <div className="card-paper p-5 sm:p-6 mt-7">
        <div className="flex items-center gap-2 mb-4"><SlidersHorizontal className="w-5 h-5" style={{ color: 'var(--gold)' }} /><strong style={{ color: 'var(--ink)' }}>Filters</strong></div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
          <label className="xl:col-span-2 relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--subtle)' }} />
            <input className="input-field !pl-9" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search title, subject, topic…" />
          </label>

          {stage === 'college' && <>
            <select className="input-field" value={university} onChange={(e) => setUniversity(e.target.value)}>
              <option value="">All universities</option>
              {options.universities.map((value) => <option key={value} value={value}>{value}</option>)}
            </select>
            <select className="input-field" value={semester} onChange={(e) => setSemester(e.target.value)}>
              <option value="">All semesters</option>
              {options.semesters.map((value) => <option key={value} value={value}>Semester {value}</option>)}
            </select>
            <select className="input-field" value={subject} onChange={(e) => setSubject(e.target.value)}>
              <option value="">All subjects</option>
              {options.subjects.map((value) => <option key={value} value={value}>{value}</option>)}
            </select>
          </>}

          {stage === 'competitive' && (
            <select className="input-field" value={unit} onChange={(e) => setUnit(e.target.value)}>
              <option value="">All units</option>
              {options.units.map((value) => <option key={value} value={value}>Unit {value}</option>)}
            </select>
          )}

          <select className="input-field" value={resourceType} onChange={(e) => setResourceType(e.target.value)}>
            <option value="">All resource types</option>
            {options.types.map((value) => <option key={value} value={value}>{value}</option>)}
          </select>
        </div>

        {hasFilters && <button type="button" onClick={reset} className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold" style={{ color: 'var(--gold)' }}><FilterX className="w-4 h-4" /> Clear filters</button>}
      </div>

      {loading ? (
        <div className="card-paper p-7 mt-5 text-sm" style={{ color: 'var(--muted)' }}>Loading published Commerce resources…</div>
      ) : resources.length === 0 ? (
        <div className="card-paper p-7 mt-5">
          <div className="font-semibold" style={{ color: 'var(--ink)' }}>No published material here yet.</div>
          <p className="text-sm leading-6 mt-2" style={{ color: 'var(--muted)' }}>The roadmap stays available, but this discovery layer only shows real published resources.</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="card-paper p-7 mt-5 text-center">
          <Search className="w-7 h-7 mx-auto" style={{ color: 'var(--gold)' }} />
          <div className="font-semibold mt-3" style={{ color: 'var(--ink)' }}>No matching resource</div>
          <p className="text-sm mt-2" style={{ color: 'var(--muted)' }}>Try clearing one filter or using a broader search term.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4 mt-5">
          {filtered.map((resource) => (
            <Link key={resource.slug} to={resource.path} className="card-paper p-5 group">
              <div className="flex items-start justify-between gap-3">
                <div className="text-[10px] font-black uppercase tracking-widest" style={{ color: 'var(--gold)' }}>{resource.resourceType}</div>
                {resource.isOfficial && <span className="text-[9px] font-black uppercase tracking-wider" style={{ color: 'var(--green)' }}>Official</span>}
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
