import { Link } from 'react-router-dom';
import { CalendarCheck2, MessageCircle, Phone } from 'lucide-react';

const PHONE = '+916353709585';

export default function LocalRevenueActions({ demoHref }) {
  const whatsappHref = `https://wa.me/916353709585?text=${encodeURIComponent('Hello Smit Sir, I want a free 20-minute paper analysis for Class 11/12 Commerce in Mehsana.')}`;

  return (
    <>
      <div className="card-paper p-4 sm:p-5" aria-label="Contact Smit Sir Commerce">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="font-black" style={{ color: 'var(--ink)' }}>Get a free 20-minute paper analysis</div>
            <p className="text-sm mt-1" style={{ color: 'var(--muted)' }}>Bring a recent test paper. Get a focused improvement plan before deciding about tuition.</p>
          </div>
          <div className="grid grid-cols-2 sm:flex gap-2 flex-shrink-0">
            <a href={`tel:${PHONE}`} className="btn-secondary inline-flex items-center justify-center gap-2"><Phone className="w-4 h-4" /> Call</a>
            <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className="btn-secondary inline-flex items-center justify-center gap-2"><MessageCircle className="w-4 h-4" /> WhatsApp</a>
            <Link to={demoHref} className="btn-primary col-span-2 inline-flex items-center justify-center gap-2"><CalendarCheck2 className="w-4 h-4" /> Book free analysis</Link>
          </div>
        </div>
      </div>

      <nav className="fixed left-3 right-3 z-40 grid grid-cols-3 gap-2 rounded-2xl p-2 shadow-2xl md:hidden" style={{ bottom: 'calc(5.75rem + env(safe-area-inset-bottom))', background: '#111827', border: '1px solid rgba(255,255,255,.14)' }} aria-label="Quick admission actions">
        <a href={`tel:${PHONE}`} className="min-h-12 rounded-xl inline-flex flex-col items-center justify-center gap-1 text-[11px] font-bold text-white"><Phone className="w-4 h-4" /> Call</a>
        <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className="min-h-12 rounded-xl inline-flex flex-col items-center justify-center gap-1 text-[11px] font-bold text-white"><MessageCircle className="w-4 h-4" /> WhatsApp</a>
        <Link to={demoHref} className="min-h-12 rounded-xl inline-flex flex-col items-center justify-center gap-1 text-[11px] font-black" style={{ background: 'var(--gold)', color: '#111827' }}><CalendarCheck2 className="w-4 h-4" /> Free analysis</Link>
      </nav>
    </>
  );
}
