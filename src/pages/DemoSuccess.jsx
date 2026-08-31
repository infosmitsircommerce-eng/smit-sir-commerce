import { CheckCircle2, BookOpen, MessageCircle, ArrowRight } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import SEO from '../components/ui/SEO';

const WA_LINK = 'https://wa.me/916353709585?text=Hello%20Smit%20Sir%2C%20I%20just%20submitted%20a%20demo%2Fadmission%20enquiry%20on%20the%20website.';

export default function DemoSuccess() {
  const location = useLocation();
  const intent = location.state?.intent || 'enquiry';
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-16" style={{ background: 'var(--bg-ivory)' }}>
      <SEO title="Enquiry Received" description="Your enquiry has been received." path="/demo-success" noindex />
      <div className="card-paper max-w-2xl w-full p-7 sm:p-10 text-center">
        <div className="w-16 h-16 rounded-full mx-auto flex items-center justify-center" style={{ background: 'rgba(77,124,15,.09)', color: 'var(--green)' }}><CheckCircle2 className="w-8 h-8" /></div>
        <span className="eyebrow mt-6 inline-block">Enquiry received</span>
        <h1 className="text-4xl mt-3" style={{ fontFamily: 'var(--font-serif)', color: 'var(--ink)' }}>{intent === 'Free Demo' ? 'Your demo request is saved.' : 'Your message is saved.'}</h1>
        <p className="mt-4 leading-relaxed" style={{ color: 'var(--muted)' }}>Your details are now in the admissions system. We’ll use the contact information you submitted to respond about this enquiry.</p>

        <div className="grid sm:grid-cols-2 gap-3 mt-8">
          <a href={WA_LINK} target="_blank" rel="noopener noreferrer" className="btn-primary inline-flex items-center justify-center gap-2"><MessageCircle className="w-4 h-4" /> Continue on WhatsApp</a>
          <Link to="/cbse-notes" className="btn-secondary inline-flex items-center justify-center gap-2"><BookOpen className="w-4 h-4" /> Use free notes</Link>
        </div>
        <Link to="/" className="inline-flex items-center gap-1.5 mt-6 text-sm font-semibold" style={{ color: 'var(--gold)' }}>Back to home <ArrowRight className="w-4 h-4" /></Link>
      </div>
    </div>
  );
}
