import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { trackEvent } from '../../lib/analytics';

export default function AnalyticsTracker() {
  const { pathname } = useLocation();
  const { user } = useAuth();

  useEffect(() => {
    trackEvent('page_view', { route: pathname }, user?.id || null);
  }, [pathname, user?.id]);

  return null;
}
