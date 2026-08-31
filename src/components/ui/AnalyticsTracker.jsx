import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { trackEvent } from '../../lib/analytics';
import { captureAcquisition } from '../../lib/acquisition';

export default function AnalyticsTracker() {
  const { pathname, search } = useLocation();
  const { user } = useAuth();

  useEffect(() => {
    const attribution = captureAcquisition(pathname, search);
    trackEvent('page_view', { route: pathname, source: attribution?.first?.source || 'Direct' }, user?.id || null);
  }, [pathname, search, user?.id]);

  return null;
}
