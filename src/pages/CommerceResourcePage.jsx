import { useEffect, useState } from 'react';
import { Link, Navigate, useLocation, useParams } from 'react-router-dom';
import { ArrowLeft, BookOpen, Download, ExternalLink, FileText, Loader2, ShieldCheck } from 'lucide-react';
import SEO from '../components/ui/SEO';
import { getPublishedCommerceResource } from '../lib/commerceResourceStore';
import { commerceResourceContext, resourceSeoTitle } from '../lib/commerceResourceModel';

const BASE = 'https://www.smitsircommerce.in';

function backPath(resource) {
  if (resource?.stage === 'college') {
    if (resource.degree === 'B.Com') return '/college-commerce/bcom';
    if (resource.degree === 'M.Com') return '/college-commerce/mcom';
    return '/college-commerce';
  }
  if (resource?.stage === 'competitive') {
    if (resource.exam === 'UGC NET Commerce') return '/ugc-net-commerce';
    if (resource.exam === 'GSET Commerce') return '/gset-commerce';
    return '/commerce-exams';
  }
  return '/study-material';
}

export default function CommerceResourcePage() {
  const { resourceSlug } = useParams();
  const location = useLocation();
  const [resource, setResource] = useState(null);
  const [state, setState] = useState('loading');

  useEffect(() => {
    let active = true;
    setState('loading');
    getPublishedCommerceResource(resourceSlug)
      .then((item) => {
        if (!active) return;
        setResource(item);
        setState(item ? 'ready' : 'missing');
      })
      .catch(() => {
        if (!active) return;
        setState('missing');
      });
    return () => { active = false; };
  }, [resourceSlug]);

  if (state === 'loading') {
    return (
      <div className="min-h-[65vh] grid place-items-center" style={{ background: 'var(--bg-ivory)' }}>
        <SEO title="Commerce Resource" description="Loading Commerce resource." path={location.pathname} noindex />
        <div className="text-center"><Loader2 className="w-7 h-7 animate-spin mx-auto" style={{ color: 'var(--gold)' }} /><p className="text-sm mt-3" style={{ color: 'var(--muted)' }}>Loading resource…</p></div>
      </div>
    );
  }

  if (!resource) {
    return (
      <div className="min-h-[65vh] grid place-items-center px-4" style={{ background: 'var(--bg-ivory)' }}>
        <SEO title="Commerce Resource Not Found" description="This Commerce resource is not published." path={location.pathname} noindex />
        <div className="card-paper p-8 max-w-xl text-center">
          <FileText className="w-9 h-9 mx-auto" style={{ color: 'var(--gold)' }} />
          <h1 className="text-2xl mt-4" style={{ color: 'var(--ink)' }}>This resource is not published yet.</h1>
          <p className="text-sm leading-6 mt-3" style={{ color: 'var(--muted)' }}>It may still be a draft, archived, or the link may be outdated.</p>
          <Link to="/commerce-learning" className="btn-primary inline-flex mt-6">Open Commerce Learning Hub</Link>
        </div>
      </div>
    );
  }

  if (resource.path && resource.path !== location.pathname) return <Navigate to={resource.path} replace />;

  const fileUrl = resource.fileUrl || resource.externalUrl || '';
  const source = resource.sourceLabel || (resource.isOfficial ? (resource.exam || resource.university || 'Official source') : 'Smit Sir Commerce resource library');
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'LearningResource',
    '@id': `${BASE}${resource.path}#resource`,
    url: `${BASE}${resource.path}`,
    name: resource.title,
    description: resource.description,
    learningResourceType: resource.resourceType,
    educationalLevel: commerceResourceContext(resource),
    inLanguage: resource.language || 'en-IN',
    isAccessibleForFree: resource.isFree !== false,
    ...(fileUrl ? { associatedMedia: { '@type': 'MediaObject', contentUrl: fileUrl } } : {}),
    ...(resource.sourceLabel ? { publisher: { '@type': 'Organization', name: resource.sourceLabel } } : {}),
  };

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-ivory)' }}>
      <SEO
        title={resource.seoTitle || resourceSeoTitle(resource)}
        description={resource.seoDescription || resource.description}
        path={resource.path}
        type="article"
        publishedTime={resource.publishedAt || resource.updatedAt}
        modifiedTime={resource.updatedAt || resource.publishedAt}
        structuredData={structuredData}
      />

      <section className="page-hero">
        <div className="page-container">
          <Link to={backPath(resource)} className="inline-flex items-center gap-2 text-sm font-semibold" style={{ color: 'var(--gold)' }}>
            <ArrowLeft className="w-4 h-4" /> Back to {resource.stage === 'college' ? 'College Commerce' : resource.stage === 'competitive' ? 'Commerce Exams' : 'Study Material'}
          </Link>
          <div className="flex flex-wrap gap-2 mt-5">
            <span className="eyebrow">{resource.resourceType}</span>
            {resource.isOfficial && <span className="eyebrow">Official source</span>}
            {resource.isFree !== false && <span className="eyebrow">Free access</span>}
          </div>
          <h1 className="mt-5 max-w-5xl">{resource.title}</h1>
          <p className="mt-4 text-sm font-semibold" style={{ color: 'var(--gold)' }}>{commerceResourceContext(resource)}</p>
          <p className="mt-5 max-w-4xl text-lg leading-8" style={{ color: 'var(--muted)' }}>{resource.description}</p>

          {fileUrl && (
            <div className="flex flex-wrap gap-3 mt-7">
              <a href={fileUrl} target="_blank" rel="noopener noreferrer" className="btn-primary inline-flex items-center gap-2">
                {resource.fileUrl ? <Download className="w-4 h-4" /> : <ExternalLink className="w-4 h-4" />}
                {resource.fileUrl ? 'Open / Download PDF' : 'Open verified source'}
              </a>
              <Link to="/commerce-learning" className="btn-outline-ink inline-flex items-center gap-2"><BookOpen className="w-4 h-4" /> Explore Commerce Hub</Link>
            </div>
          )}
        </div>
      </section>

      <main className="page-container section-padding">
        <div className="grid lg:grid-cols-[1.2fr_.8fr] gap-6">
          <article className="card-paper p-6 sm:p-8">
            <h2 className="text-2xl" style={{ color: 'var(--ink)' }}>About this resource</h2>
            <p className="mt-4 leading-8" style={{ color: 'var(--muted)' }}>{resource.description}</p>

            {resource.keyTopics?.length > 0 && <>
              <h2 className="text-2xl mt-8" style={{ color: 'var(--ink)' }}>Topics covered</h2>
              <ul className="mt-4 space-y-2">{resource.keyTopics.map((topic) => <li key={topic} className="text-sm leading-6" style={{ color: 'var(--charcoal)' }}>• {topic}</li>)}</ul>
            </>}

            {resource.notes && <>
              <h2 className="text-2xl mt-8" style={{ color: 'var(--ink)' }}>Study guidance</h2>
              <p className="mt-4 leading-8 whitespace-pre-line" style={{ color: 'var(--muted)' }}>{resource.notes}</p>
            </>}
          </article>

          <aside className="space-y-5">
            <section className="card-paper p-6">
              <ShieldCheck className="w-6 h-6" style={{ color: 'var(--gold)' }} />
              <h2 className="text-xl mt-4" style={{ color: 'var(--ink)' }}>Resource details</h2>
              <dl className="mt-4 space-y-3 text-sm">
                <div><dt className="font-semibold" style={{ color: 'var(--ink)' }}>Source</dt><dd className="mt-1" style={{ color: 'var(--muted)' }}>{source}</dd></div>
                {resource.academicYear && <div><dt className="font-semibold" style={{ color: 'var(--ink)' }}>Academic year</dt><dd className="mt-1" style={{ color: 'var(--muted)' }}>{resource.academicYear}</dd></div>}
                {resource.subjectCode && <div><dt className="font-semibold" style={{ color: 'var(--ink)' }}>Subject code</dt><dd className="mt-1" style={{ color: 'var(--muted)' }}>{resource.subjectCode}</dd></div>}
                {resource.pages && <div><dt className="font-semibold" style={{ color: 'var(--ink)' }}>Pages</dt><dd className="mt-1" style={{ color: 'var(--muted)' }}>{resource.pages}</dd></div>}
                <div><dt className="font-semibold" style={{ color: 'var(--ink)' }}>Access</dt><dd className="mt-1" style={{ color: 'var(--muted)' }}>{resource.isFree === false ? 'Restricted' : 'Free'}</dd></div>
              </dl>
            </section>

            {resource.isOfficial && (
              <section className="rounded-2xl p-5" style={{ background: '#fff8e8', border: '1px solid #ead4a4' }}>
                <div className="font-bold" style={{ color: '#7a520d' }}>Official-source material</div>
                <p className="text-sm leading-6 mt-2" style={{ color: '#765f35' }}>This item is labelled separately so an official syllabus or notice is not confused with notes created or organised by Smit Sir Commerce.</p>
              </section>
            )}
          </aside>
        </div>
      </main>
    </div>
  );
}
