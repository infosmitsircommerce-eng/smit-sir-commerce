import { Link, useLocation } from 'react-router-dom';
import { ArrowRight, FileSearch } from 'lucide-react';
import { trackEvent } from '../../lib/analytics';
import { getStudyOffer } from '../../data/studyOffers';

export default function StudyRevenueBridge({ subject = '', classLevel = 12, source = 'study-resource', routeAware = false }) {
  const { pathname } = useLocation();
  const offer = getStudyOffer(pathname, { subject, classLevel });
  if (!offer) return null;
  const { product, subject: resolvedSubject, classLevel: resolvedClass, board } = offer;
  const resolvedSource = routeAware ? pathname.replace(/^\//, '') : source;
  const demoHref = `/book-demo?from=${encodeURIComponent(resolvedSource)}&board=${board}&class=${resolvedClass}&subject=${encodeURIComponent(resolvedSubject)}&mode=Either`;
  const productHref = `/board-booster-packs?pack=${product.id}&from=${encodeURIComponent(resolvedSource)}&utm_medium=study-resource&utm_campaign=board_booster_199`;

  const trackRevenueClick = (offer) => {
    trackEvent('study_revenue_click', { offer, productId: product.id, board, subject: resolvedSubject, classLevel: resolvedClass, source: resolvedSource });
  };

  return (
    <div className="card-paper p-5">
      <FileSearch className="w-6 h-6" style={{ color: 'var(--gold)' }} />
      <h2 className="text-xl mt-3" style={{ fontFamily: 'var(--font-serif)', color: 'var(--ink)' }}>
        Try the practice style before choosing a pack
      </h2>
      <p className="text-sm leading-6 mt-2" style={{ color: 'var(--muted)' }}>
        {product.name}: a revision PDF, 3 original tests with answers, a 7-day plan and weak-topic worksheet for ₹199. View a free worked example before reserving.
      </p>
      <Link to={`${productHref}#free-preview`} onClick={() => trackRevenueClick('board-booster-preview')} className="btn-primary w-full inline-flex items-center justify-center gap-2 mt-4">
        See free preview + ₹199 pack <ArrowRight className="w-4 h-4" />
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
