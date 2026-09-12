import { useEffect, useRef } from 'react';
import { trackConversion } from '../lib/conversionTracking';

export default function PremiumPaymentDialog({ title, onClose }) {
  const dialog = useRef(null);
  const tracked = useRef(false);
  useEffect(() => {
    const element = dialog.current;
    const previousOverflow = document.body.style.overflow;
    element.showModal();
    if (!tracked.current) {
      tracked.current = true;
      void trackConversion('premium_qr_open', { offer: 'lifetime-999', surface: 'notes-dialog', resource: title });
    }
    document.body.style.overflow = 'hidden';
    return () => { element.close(); document.body.style.overflow = previousOverflow; };
  }, []);
  return <dialog ref={dialog} aria-labelledby="premium-qr-title" onCancel={event => { event.preventDefault(); onClose(); }} onClick={event => { if (event.target === event.currentTarget) onClose(); }}
    className="rounded-3xl p-0 border-0" style={{ width: 'min(440px, calc(100vw - 24px))', maxHeight: 'calc(100dvh - 24px)', background: '#fffaf0', color: '#172033', boxShadow: '0 24px 90px rgba(0,0,0,.28)' }}>
    <div className="p-5 sm:p-6">
      <div className="flex items-start justify-between gap-4"><div><span className="eyebrow">Premium revision PDF</span><h2 id="premium-qr-title" className="text-2xl mt-2">Unlock with Premium</h2></div><button autoFocus onClick={onClose} aria-label="Close payment QR" className="btn-secondary shrink-0" style={{ padding: '10px 14px' }}>✕</button></div>
      <p className="mt-3 text-sm font-semibold">{title}</p>
      <p className="mt-3"><strong className="text-2xl">₹999</strong> · One-time lifetime Premium access</p>
      <img src="/premium-payment-qr.jpg" width="971" height="975" alt="Smit Sir Commerce Premium UPI payment QR" className="w-full rounded-xl mt-4" style={{ maxHeight: 'min(300px, 40dvh)', objectFit: 'contain', background: '#fff' }} />
      <a href="/premium-payment-qr.jpg" download="Smit-Sir-Premium-QR.jpg" className="btn-secondary w-full mt-3">Download QR</a>
      <p className="text-sm leading-6 mt-4">Scan in your UPI app and confirm the recipient before paying. Premium opens after Smit Sir verifies your payment. Already paid? Submit your reference; please do not pay again.</p>
      <a href="/premium#premium-payment" className="btn-primary w-full mt-4">Sign in / submit payment reference</a>
    </div>
  </dialog>;
}
