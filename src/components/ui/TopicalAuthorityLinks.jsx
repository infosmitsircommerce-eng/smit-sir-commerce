import { Link, useLocation } from 'react-router-dom';
import { ArrowRight, BookOpen } from 'lucide-react';

import { getStudyPathway } from '../../data/studyPathways';

export default function TopicalAuthorityLinks() {
  const { pathname } = useLocation();
  const cluster = getStudyPathway(pathname);
  if (!cluster) return null;

  const links = cluster.links;

  return (
    <section className="page-container pb-10 lg:pb-14" aria-labelledby="topical-authority-heading">
      <div className="card-paper p-5 sm:p-7 md:p-8">
        <span className="eyebrow">{cluster.eyebrow}</span>
        <h2 id="topical-authority-heading" className="text-2xl sm:text-3xl mt-3" style={{ fontFamily: 'var(--font-serif)', color: 'var(--ink)' }}>
          {cluster.title}
        </h2>
        <p className="text-sm sm:text-base leading-7 mt-3 max-w-3xl" style={{ color: 'var(--muted)' }}>
          {cluster.description}
        </p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-6">
          {links.map(([to, label]) => (
            <Link key={to} to={to} className="tile-paper p-4 flex items-center justify-between gap-3 group">
              <span className="flex items-center gap-3 min-w-0">
                <span className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'var(--gold-bg)', color: 'var(--gold)' }}>
                  <BookOpen className="w-4 h-4" />
                </span>
                <span className="font-semibold text-sm leading-snug" style={{ color: 'var(--ink)' }}>{label}</span>
              </span>
              <ArrowRight className="w-4 h-4 flex-shrink-0 transition-transform group-hover:translate-x-1" style={{ color: 'var(--gold)' }} />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
