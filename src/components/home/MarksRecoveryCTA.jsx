import { Link } from 'react-router-dom';
import { ArrowRight, BarChart3, Target, TrendingUp } from 'lucide-react';

export default function MarksRecoveryCTA() {
  return (
    <section className="page-container section-padding pt-8">
      <div className="card-paper p-6 sm:p-8 lg:p-10 overflow-hidden relative">
        <div className="grid lg:grid-cols-[1.05fr_.95fr] gap-8 items-center">
          <div>
            <span className="eyebrow">New · Commerce Marks Leak Engine</span>
            <h2 className="headline mt-4">Your score tells you <em>how much.</em> This tells you <em>why.</em></h2>
            <p className="mt-4 text-sm sm:text-base leading-7 max-w-2xl" style={{ color: 'var(--muted)' }}>Enter your latest Commerce test score, mark where you lost marks and get a readiness score, weak-topic map and 5-day recovery plan. Free, no login.</p>
            <div className="mt-6 flex flex-wrap gap-3"><Link to="/marks-recovery" className="btn-primary inline-flex items-center gap-2">Find my marks leaks <ArrowRight className="w-4 h-4" /></Link><Link to="/book-demo?source=marks-recovery-home" className="btn-outline-ink">Free human paper analysis</Link></div>
          </div>
          <div className="grid sm:grid-cols-3 lg:grid-cols-1 gap-3">
            <div className="tile-paper p-4 flex items-center gap-3"><Target className="w-5 h-5 flex-shrink-0" style={{ color: 'var(--gold)' }} /><div><div className="font-semibold" style={{ color: 'var(--ink)' }}>Find the leak</div><div className="text-xs mt-1" style={{ color: 'var(--muted)' }}>Concept, formula, structure, time or careless error</div></div></div>
            <div className="tile-paper p-4 flex items-center gap-3"><BarChart3 className="w-5 h-5 flex-shrink-0" style={{ color: 'var(--gold)' }} /><div><div className="font-semibold" style={{ color: 'var(--ink)' }}>Get a readiness score</div><div className="text-xs mt-1" style={{ color: 'var(--muted)' }}>See which topics need attention first</div></div></div>
            <div className="tile-paper p-4 flex items-center gap-3"><TrendingUp className="w-5 h-5 flex-shrink-0" style={{ color: 'var(--gold)' }} /><div><div className="font-semibold" style={{ color: 'var(--ink)' }}>Retest the recovery</div><div className="text-xs mt-1" style={{ color: 'var(--muted)' }}>Measure marks recovered, not videos watched</div></div></div>
          </div>
        </div>
      </div>
    </section>
  );
}
