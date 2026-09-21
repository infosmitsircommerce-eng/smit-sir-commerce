import { useEffect, useRef } from 'react';
import { trackConversion } from '../lib/conversionTracking';

export default function PremiumPaymentDialog({ title, onClose, productId = 'gseb-12-economics' }) {
  const dialog = useRef(null);
  const tracked = useRef(false);

  useEffect(() => {
    const element = dialog.current;
    const previousOverflow = document.body.style.overflow;
    element.showModal();
    if (!tracked.current) {
      tracked.current = true;
      void trackConversion('board_booster_access_prompt', { productId, surface: 'notes-dialog', resource: title });
    }
    document.body.style.overflow = 'hidden';
    return () => { element.close(); document.body.style.overflow = previousOverflow; };
  }, [productId, title]);

  return <dialog ref={dialog} aria-labelledby="premium-pack-title" onCancel={event => { event.preventDefault(); onClose(); }} onClick={event => { if (event.target === event.currentTarget) onClose(); }}
    className="rounded-3xl p-0 border-0" style={{ width: 'min(440px, calc(100vw - 24px))', maxHeight: 'calc(100dvh - 24px)', background: '#fffaf0', color: '#172033', boxShadow: '0 24px 90px rgba(0,0,0,.28)' }}>
    <div className="p-5 sm:p-6">
      <div className="flex items-start justify-between gap-4"><div><span className="eyebrow">Focused Board Booster</span><h2 id="premium-pack-title" className="text-2xl mt-2">This resource is inside a specific ₹199 pack</h2></div><button autoFocus onClick={onClose} aria-label="Close access prompt" className="btn-secondary shrink-0" style={{ padding: '10px 14px' }}>✕</button></div>
      <p className="mt-4 text-sm font-semibold">{title}</p>
      <p className="text-sm leading-6 mt-4">This Premium item is visible so you know it exists, but the file stays protected. Pay through the QR, enter your UTR and send the details on WhatsApp for manual verification.</p>
      <a href={`/premium?plan=199&resource=${encodeURIComponent(title || productId)}`} className="btn-primary w-full mt-5">Show QR & unlock for ₹199</a>
      <a href="/my-purchases" className="btn-secondary w-full mt-3">Already purchased? Open My Purchases</a>
    </div>
  </dialog>;
}
