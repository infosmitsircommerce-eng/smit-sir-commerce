import { Link } from 'react-router-dom';
import { CalendarCheck2, MessageCircle, Phone } from 'lucide-react';
import { trackEvent } from '../../lib/analytics';

const PHONE = '+916353709585';

export default function LocalRevenueActions({ demoHref }) {
  const trackContact = (action) => trackEvent('local_tuition_contact_click', { action, placement: 'contact-actions' });
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
            <a href={`tel:${PHONE}`} onClick={() => trackContact('call')} className="btn-secondary inline-flex items-center justify-center gap-2"><Phone className="w-4 h-4" /> Call</a>
            <a href={whatsappHref} onClick={() => trackContact('whatsapp')} target="_blank" rel="noopener noreferrer" className="btn-secondary inline-flex items-center justify-center gap-2"><MessageCircle className="w-4 h-4" /> WhatsApp</a>
            <Link to={demoHref} onClick={() => trackContact('enquiry')} className="btn-primary col-span-2 inline-flex items-center justify-center gap-2"><CalendarCheck2 className="w-4 h-4" /> Book free analysis</Link>
          </div>
        </div>
      </div>

    </>
  );
}
