import { Link } from 'react-router-dom';
import { ArrowRight, Brain, Flame, Target, Zap } from 'lucide-react';

export default function DailyPracticeCTA() {
  return (
    <section className="page-container section-padding">
      <div className="rounded-3xl overflow-hidden" style={{ background: 'linear-gradient(135deg, var(--ink), #2f281f)', border: '1px solid rgba(184,135,47,.25)', boxShadow: '0 24px 60px rgba(30,24,18,.14)' }}>
        <div className="grid lg:grid-cols-[1.1fr_.9fr] gap-8 p-6 sm:p-9 lg:p-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest" style={{ color: '#e7c66c' }}><Zap className="w-4 h-4" /> New daily practice</div>
            <h2 className="text-3xl sm:text-4xl mt-4" style={{ fontFamily: 'var(--font-serif)', color: '#fff' }}>Not sure what to study today? Start with <em style={{ color: '#e7c66c' }}>Daily 10.</em></h2>
            <p className="mt-4 max-w-2xl leading-relaxed" style={{ color: 'rgba(255,255,255,.72)' }}>Ten Commerce questions every day. Wrong answers automatically go into your Mistake Book, and your Weak Topic Radar shows what to revise next.</p>
            <Link to="/daily-practice" className="btn-primary mt-6 inline-flex items-center gap-2">Start today’s Daily 10 <ArrowRight className="w-4 h-4" /></Link>
          </div>

          <div className="grid gap-3">
            {[
              { icon: Flame, title: 'Daily streak', text: 'Build consistency with a simple 10-question habit.' },
              { icon: Brain, title: 'Mistake Book', text: 'Wrong answers become a personal revision queue.' },
              { icon: Target, title: 'Weak Topic Radar', text: 'See the topics where your accuracy needs work.' },
            ].map(({ icon: Icon, title, text }) => (
              <div key={title} className="rounded-2xl p-4 flex gap-3" style={{ background: 'rgba(255,255,255,.06)', border: '1px solid rgba(255,255,255,.1)' }}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(231,198,108,.12)', color: '#e7c66c' }}><Icon className="w-5 h-5" /></div>
                <div><div className="font-semibold" style={{ color: '#fff' }}>{title}</div><div className="text-sm mt-1" style={{ color: 'rgba(255,255,255,.62)' }}>{text}</div></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
