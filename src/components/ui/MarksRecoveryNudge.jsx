import { Link, useLocation } from 'react-router-dom';
import { ArrowRight, Target } from 'lucide-react';

export default function MarksRecoveryNudge() {
  const { pathname } = useLocation();
  const show = /^\/tools\/[^/]+$/.test(pathname) || pathname.includes('/practice/cbse/') || /\/cbse\/class-\d+\/.+\/.+-notes$/.test(pathname);
  if (!show) return null;
  return (
    <section className="page-container pb-10">
      <div className="card-paper p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3"><div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'var(--gold-bg)' }}><Target className="w-5 h-5" style={{ color: 'var(--gold)' }} /></div><div><div className="font-semibold" style={{ color: 'var(--ink)' }}>Still losing marks even after understanding this topic?</div><p className="text-xs sm:text-sm leading-6 mt-1" style={{ color: 'var(--muted)' }}>Use your latest test to find whether the real leak is concept, formula, interpretation, answer structure, time or a careless error.</p></div></div>
        <Link to="/marks-recovery?source=learning-resource" className="btn-outline-ink whitespace-nowrap inline-flex items-center justify-center gap-2">Find my marks leak <ArrowRight className="w-4 h-4" /></Link>
      </div>
    </section>
  );
}
