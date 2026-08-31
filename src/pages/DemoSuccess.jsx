import { CheckCircle2, BookOpen, MessageCircle, ArrowRight, CalendarCheck2 } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import SEO from '../components/ui/SEO';

const WA_LINK = 'https://wa.me/916353709585?text=Hello%20Smit%20Sir%2C%20I%20just%20submitted%20a%20demo%2Fadmission%20enquiry%20on%20the%20website.';

function formatSlot(slot) {
  if (!slot?.starts_at) return '';
  return new Intl.DateTimeFormat('en-IN', { timeZone: 'Asia/Kolkata', weekday: 'long', day: '2-digit', month: 'long', hour: 'numeric', minute: '2-digit', hour12: true }).format(new Date(slot.starts_at));
}

export default function DemoSuccess() {
  const location = useLocation();
  const intent = location.state?.intent || 'enquiry';
  const booked = Boolean(location.state?.booked);
  const slot = location.state?.slot || null;
  const demoSubject = location.state?.demoSubject || slot?.subject_focus || '';
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-16" style={{ background: 'var(--bg-ivory)' }}>
      <SEO title={booked ? 'Demo Slot Reserved' : 'Enquiry Received'} description="Your enquiry has been received." path="/demo-success" noindex />
      <div className="card-paper max-w-2xl w-full p-7 sm:p-10 text-center">
        <div className="w-16 h-16 rounded-full mx-auto flex items-center justify-center" style={{ background: 'rgba(77,124,15,.09)', color: 'var(--green)' }}><CheckCircle2 className="w-8 h-8" /></div>
        <span className="eyebrow mt-6 inline-block">{booked ? 'Demo reserved' : 'Enquiry received'}</span>
        <h1 className="text-4xl mt-3" style={{ fontFamily: 'var(--font-serif)', color: 'var(--ink)' }}>{booked ? 'Your demo slot is reserved.' : intent === 'Free Demo' ? 'Your demo request is saved.' : 'Your message is saved.'}</h1>
        <p className="mt-4 leading-relaxed" style={{ color: 'var(--muted)' }}>{booked ? 'The booking has been added to the admissions system. Keep your phone available in case Smit Sir needs to confirm any detail.' : 'Your details are now in the admissions system. We’ll use the contact information you submitted to respond about this enquiry.'}</p>

        {booked && slot && <div className="tile-paper p-5 mt-7 text-left"><div className="flex items-center gap-2 font-bold" style={{ color: 'var(--ink)' }}><CalendarCheck2 className="w-5 h-5" style={{ color: 'var(--gold)' }} /> {formatSlot(slot)} IST</div><div className="text-sm mt-2" style={{ color: 'var(--muted)' }}>{slot.mode} · {slot.duration_minutes} minutes · {demoSubject}</div></div>}

        <div className="grid sm:grid-cols-2 gap-3 mt-8">
          <a href={WA_LINK} target="_blank" rel="noopener noreferrer" className="btn-primary inline-flex items-center justify-center gap-2"><MessageCircle className="w-4 h-4" /> Continue on WhatsApp</a>
          <Link to="/cbse-notes" className="btn-secondary inline-flex items-center justify-center gap-2"><BookOpen className="w-4 h-4" /> Use free notes</Link>
        </div>
        <Link to="/" className="inline-flex items-center gap-1.5 mt-6 text-sm font-semibold" style={{ color: 'var(--gold)' }}>Back to home <ArrowRight className="w-4 h-4" /></Link>
      </div>
    </div>
  );
}
