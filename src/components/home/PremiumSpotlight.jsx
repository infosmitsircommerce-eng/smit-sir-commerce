import { Link } from 'react-router-dom';
import { ArrowRight, BookOpenCheck, Check, Crown, ListChecks } from 'lucide-react';

export default function PremiumSpotlight() {
  return (
    <section aria-labelledby="premium-home-heading" className="py-10 sm:py-14" style={{ background: '#111827', color: '#fff' }}>
      <div className="page-container">
        <div className="grid lg:grid-cols-[1fr_auto] gap-7 items-center">
          <div>
            <span className="inline-flex items-center gap-2 text-xs font-black tracking-widest uppercase" style={{ color: 'var(--gold-bright)' }}><Crown className="w-4 h-4" /> Lifetime Premium</span>
            <h2 id="premium-home-heading" className="text-3xl sm:text-4xl mt-3" style={{ fontFamily: 'var(--font-serif)', color: '#fff' }}>Advanced Economics practice for ₹999 once.</h2>
            <p className="mt-3 max-w-3xl leading-7" style={{ color: '#cbd5e1' }}>Unlock Hard & Extreme quizzes plus deep-dive guides for 31 CBSE Economics chapters. Free notes and Easy–Moderate quizzes stay free.</p>
            <div className="flex flex-wrap gap-x-5 gap-y-2 mt-5 text-sm" style={{ color: '#e5e7eb' }}>
              <span className="inline-flex items-center gap-2"><ListChecks className="w-4 h-4" style={{ color: 'var(--gold-bright)' }} /> Hard + Extreme levels</span>
              <span className="inline-flex items-center gap-2"><BookOpenCheck className="w-4 h-4" style={{ color: 'var(--gold-bright)' }} /> 31 chapter guides</span>
              <span className="inline-flex items-center gap-2"><Check className="w-4 h-4" style={{ color: 'var(--gold-bright)' }} /> No subscription</span>
            </div>
          </div>
          <Link to="/premium" className="btn-primary shrink-0 text-base px-7 py-4">See Premium & pay <ArrowRight className="w-4 h-4" /></Link>
        </div>
      </div>
    </section>
  );
}
