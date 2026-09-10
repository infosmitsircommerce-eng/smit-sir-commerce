import { Link, useLocation } from 'react-router-dom';
import { ArrowRight, Crown, FileSearch } from 'lucide-react';

export default function StudyRevenueBridge({ subject = '', classLevel = 12, source = 'study-resource', routeAware = false }) {
  const { pathname } = useLocation();
  const inferredSubject = /economics|microeconomics|macroeconomics|national-income/i.test(pathname) ? 'Economics' : 'Business Studies';
  const resolvedSubject = subject || inferredSubject;
  const resolvedClass = pathname.includes('class-11') ? 11 : classLevel;
  const resolvedSource = routeAware ? pathname.replace(/^\//, '') : source;
  const economics = /economics/i.test(resolvedSubject);
  const demoHref = `/book-demo?from=${encodeURIComponent(resolvedSource)}&class=${resolvedClass}&subject=${encodeURIComponent(economics ? 'Economics' : 'Business Studies')}&mode=Either`;

  return (
    <div className="card-paper p-5">
      {economics ? <Crown className="w-6 h-6" style={{ color: 'var(--gold)' }} /> : <FileSearch className="w-6 h-6" style={{ color: 'var(--gold)' }} />}
      <h2 className="text-xl mt-3" style={{ fontFamily: 'var(--font-serif)', color: 'var(--ink)' }}>
        {economics ? 'Ready for harder Economics practice?' : 'Still losing marks in this chapter?'}
      </h2>
      <p className="text-sm leading-6 mt-2" style={{ color: 'var(--muted)' }}>
        {economics
          ? 'Premium unlocks Hard and Extreme Economics quizzes plus 31 chapter deep-dive guides for ₹999 once.'
          : 'Request a free 20-minute paper analysis and get a focused improvement plan before choosing tuition.'}
      </p>
      <Link to={economics ? '/premium' : demoHref} className="btn-primary w-full inline-flex items-center justify-center gap-2 mt-4">
        {economics ? 'See Lifetime Premium' : 'Book free paper analysis'} <ArrowRight className="w-4 h-4" />
      </Link>
      {economics && <Link to={demoHref} className="btn-secondary w-full inline-flex items-center justify-center gap-2 mt-2">Need personal help? Book free analysis</Link>}
    </div>
  );
}

export function RouteRevenueBridge() {
  const { pathname } = useLocation();
  const highIntent = pathname.startsWith('/cbse/class-')
    || pathname.startsWith('/practice/cbse/')
    || pathname === '/cbse/class-12/business-studies-case-study-questions';
  if (!highIntent) return null;
  return <div className="page-container pb-8"><StudyRevenueBridge routeAware /></div>;
}
