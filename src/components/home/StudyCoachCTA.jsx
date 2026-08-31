import { Link } from 'react-router-dom';
import { ArrowRight, Brain, Target, TrendingUp } from 'lucide-react';

export default function StudyCoachCTA() {
  return (
    <section className="page-container py-6 sm:py-10">
      <div className="card-paper p-6 sm:p-8 overflow-hidden relative" style={{ border: '1px solid rgba(184,135,47,.3)' }}>
        <div className="grid lg:grid-cols-[1fr_.8fr] gap-7 items-center">
          <div>
            <span className="eyebrow">NEW · Personal Study Coach</span>
            <h2 className="text-3xl sm:text-4xl mt-3" style={{ fontFamily: 'var(--font-serif)', color: 'var(--ink)' }}>One question: <em>what should I study right now?</em></h2>
            <p className="mt-3 max-w-2xl" style={{ color: 'var(--muted)' }}>See chapter mastery, find your weakest topic and get a focused 10–45 minute mission using your actual practice history.</p>
            <Link to="/study-coach" className="btn-primary inline-flex items-center gap-2 mt-6"><Brain className="w-4 h-4" /> Build my study mission <ArrowRight className="w-4 h-4" /></Link>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {[{ icon: TrendingUp, value: 'Mastery', label: 'chapter-by-chapter' }, { icon: Target, value: 'Weakest', label: 'topic first' }, { icon: Brain, value: '1 Mission', label: 'no confusion' }].map(({ icon: Icon, value, label }) => <div key={value} className="tile-paper p-4 text-center"><Icon className="w-5 h-5 mx-auto mb-2" style={{ color: 'var(--gold)' }} /><div className="font-bold" style={{ color: 'var(--ink)' }}>{value}</div><div className="text-[11px] mt-1" style={{ color: 'var(--muted)' }}>{label}</div></div>)}
          </div>
        </div>
      </div>
    </section>
  );
}
