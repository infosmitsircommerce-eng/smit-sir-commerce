import { useEffect, useRef } from 'react';
import { trackConversion } from '../lib/conversionTracking';

export default function PremiumQrImage(props) {
  const image = useRef(null);
  const tracked = useRef(false);
  useEffect(() => {
    if (!('IntersectionObserver' in window)) return;
    const observer = new IntersectionObserver(entries => {
      if (entries.some(entry => entry.isIntersecting) && !tracked.current && image.current.complete && image.current.naturalWidth) {
        tracked.current = true;
        void trackConversion('premium_qr_open', { offer: 'lifetime-999', surface: 'premium-page' });
        observer.disconnect();
      }
    }, { threshold: 0.5 });
    const observe = () => observer.observe(image.current);
    const element = image.current;
    if (element.complete) observe();
    else element.addEventListener('load', observe);
    return () => { observer.disconnect(); element.removeEventListener('load', observe); };
  }, []);
  return <img ref={image} {...props} />;
}
