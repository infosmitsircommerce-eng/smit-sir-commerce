import { Link, useLocation } from 'react-router-dom';
import { ArrowRight, Crown, FileSearch } from 'lucide-react';
import { trackEvent } from '../../lib/analytics';

export default function StudyRevenueBridge({ subject = '', classLevel = 12, source = 'study-resource', routeAware = false }) {
  const { pathname } = useLocation();
  const inferredSubject = /economics|microeconomics|macroeconomics|national-income/i.test(pathname) ? 'Economics' : 'Business Studies';
  const resolvedSubject = subject || inferredSubject;
  const resolvedClass = pathname.includes('class-11') ? 11 : classLevel;
  const resolvedSource = routeAware ? pathname.replace(/^\//, '') : source;
  const economics = /economics/i.test(resolvedSubject);
  const demoHref = `/book-demo?from=${encodeURIComponent(resolvedSource)}&class=${resolvedClass}&subject=${encodeURIComponent(economics ? 'Economics' : 'Business Studies')}&mode=Either`;
  const productHref = `/board-booster-packs?pack=cbse-12-business-studies&from=${encodeURIComponent(resolvedSource)}&utm_medium=study-resource&utm_campaign=bst_booster_199`;
  const primaryHref = economics ? '/premium' : productHref;

  const trackRevenueClick = (offer) => {
    trackEvent('study_revenue_click', { offer, subject: resolvedSubject, classLevel: resolvedClass, source: resolvedSource });
  };

  return (
    <div className="card-paper p-5">
      {economics ? <Crown className="w-6 h-6" style={{ color: 'var(--gold)' }} /> : <FileSearch className="w-6 h-6" style={{ color: 'var(--gold)' }} />}
      <h2 className="text-xl mt-3" style={{ fontFamily: 'var(--font-serif)', color: 'var(--ink)' }}>
        {economics ? 'Ready for harder Economics practice?' : 'Turn these notes into exam marks'}
      </h2>
      <p className="text-sm leading-6 mt-2" style={{ color: 'var(--muted)' }}>
        {economics
          ? 'Premium unlocks Hard and Extreme Economics quizzes plus 31 chapter deep-dive guides for ₹999 once.'
          : 'Get the Class 12 Business Studies Board Booster: a revision PDF, 3 original tests with answers, a 7-day plan and weak-topic worksheet for ₹199.'}
      </p>
      <Link to={primaryHref} onClick={() => trackRevenueClick(economics ? 'economics-premium-999' : 'bst-booster-199')} className="btn-primary w-full inline-flex items-center justify-center gap-2 mt-4">
        {economics ? 'See Lifetime Premium' : 'See the ₹199 Board Booster'} <ArrowRight className="w-4 h-4" />
      </Link>
      <Link to={demoHref} onClick={() => trackRevenueClick('free-paper-analysis')} className="btn-secondary w-full inline-flex items-center justify-center gap-2 mt-2">Need personal help? Book free analysis</Link>
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
