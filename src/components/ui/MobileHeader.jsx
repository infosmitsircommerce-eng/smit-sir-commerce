import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BookOpen, Brain, ChevronRight, ListChecks, GraduationCap, Menu, MessageCircle, Search, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { isLightRoute } from '../../lib/theme';

const groups = [
  { title: 'Study Material', icon: BookOpen, links: [
    { label: 'All Study Material', path: '/study-material' },
    { label: 'GSEB Class 12 Economics', path: '/study-material?board=GSEB' },
    { label: 'CBSE Notes', path: '/cbse-notes' },
    { label: 'CBSE PYQ & Sample Papers', path: '/cbse-pyq' },
    { label: 'Study Toolkit', path: '/study-tools' },
  ]},
  { title: 'Practice', icon: Brain, links: [
    { label: 'Daily Practice', path: '/daily-practice' },
    { label: 'CBSE Chapter Practice', path: '/cbse-practice' },
    { label: 'Test Series', path: '/test-series' },
    { label: 'Quizzes', path: '/quizzes' },
    { label: 'Flashcards', path: '/flashcards' },
    { label: 'Ask AI Doubt', path: '/ask' },
  ]},
  { title: 'Quizzes & Tools', icon: ListChecks, links: [
    { label: 'Quizzes', path: '/quizzes' },
    { label: 'Commerce Tools', path: '/tools' },
    { label: 'Study Coach', path: '/study-coach' },
    { label: 'Learning Insights', path: '/learning-insights' },
  ]},
  { title: 'Help', icon: MessageCircle, links: [
    { label: 'Contact Smit Sir', path: '/contact' },
    { label: 'Courses', path: '/courses' },
    { label: 'Online Batch', path: '/online-batch' },
    { label: 'Offline Batch', path: '/offline-batch' },
    { label: 'Live Classes', path: '/live-classes' },
  ]},
  { title: 'College & Exams', icon: GraduationCap, links: [
    { label: 'All Commerce Learning', path: '/commerce-learning' },
    { label: 'College Commerce', path: '/college-commerce' },
    { label: 'UGC NET Commerce', path: '/ugc-net-commerce' },
    { label: 'GSET Commerce', path: '/gset-commerce' },
  ]},
];

export default function MobileHeader() {
  const [open, setOpen] = useState(false);
  const { pathname, search } = useLocation();
  const { user, initials, isAdmin } = useAuth();
  const light = isLightRoute(pathname);

  useEffect(() => {
    setOpen(false);
    document.body.style.overflow = '';
    document.documentElement.style.overflow = '';
  }, [pathname, search]);

  useEffect(() => () => {
    document.body.style.overflow = '';
    document.documentElement.style.overflow = '';
  }, []);

  const surface = light ? '#F7F8FC' : '#101828';
  const text = light ? 'var(--ink)' : 'var(--ivory-on-ink)';
  const muted = light ? 'var(--muted)' : 'var(--muted-on-ink)';

  return <>
    <header className="mobile-site-header lg:hidden sticky top-0 z-[60] flex items-center justify-between px-4 h-16" style={{ background: light ? 'rgba(247,248,252,0.96)' : 'rgba(16,24,40,0.96)', backdropFilter: 'blur(14px)', WebkitBackdropFilter: 'blur(14px)', borderBottom: light ? '1px solid var(--border)' : '1px solid rgba(255,255,255,0.08)' }}>
      <Link to="/" className="flex items-center gap-2.5 min-w-0" aria-label="Smit Sir Commerce home">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'linear-gradient(135deg, #C9A050, #B8872F)' }}><GraduationCap className="w-5 h-5" style={{ color: '#1E1812' }} strokeWidth={2.3} /></div>
        <div className="min-w-0"><span className="font-black text-sm leading-none block truncate" style={{ color: text }}>Smit Sir</span><span className="font-bold text-[10px] block leading-none tracking-[0.16em] mt-1" style={{ color: 'var(--gold)' }}>COMMERCE</span></div>
      </Link>
      <div className="flex items-center gap-2">
        <Link to="/study-material" className="mobile-header-demo hidden min-[390px]:inline-flex items-center gap-1.5 min-h-10 px-3 rounded-xl text-[11px] font-black" aria-label="Open free study material"><BookOpen className="w-4 h-4" />Notes</Link>
        <button type="button" onClick={() => window.dispatchEvent(new CustomEvent('ssc-open-search'))} className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ color: text, background: light ? 'var(--bg-ivory)' : 'rgba(255,255,255,0.07)', border: light ? '1px solid var(--border)' : '1px solid rgba(255,255,255,0.1)' }} aria-label="Search study resources"><Search className="w-4 h-4" /></button>
        {user && <Link to={isAdmin ? "/admin" : "/learning-insights"} className="w-10 h-10 rounded-xl flex items-center justify-center text-xs font-black" style={{ color: '#1E1812', background: 'var(--gold-bg)', border: '1px solid rgba(184,135,47,0.28)' }} aria-label="Open learning insights">{initials}</Link>}
        <button type="button" onClick={() => setOpen(value => !value)} className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ color: text, background: light ? 'var(--bg-ivory)' : 'rgba(255,255,255,0.07)', border: light ? '1px solid var(--border)' : '1px solid rgba(255,255,255,0.1)' }} aria-expanded={open} aria-controls="mobile-navigation" aria-label={open ? 'Close menu' : 'Open menu'}>{open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}</button>
      </div>
    </header>
    {open && <>
      <button type="button" aria-label="Close navigation" onClick={() => setOpen(false)} className="lg:hidden fixed inset-0 top-16 z-[54] bg-black/45" />
      <nav id="mobile-navigation" aria-label="Mobile navigation" className="lg:hidden fixed top-16 left-0 right-0 z-[55] max-h-[calc(100dvh-4rem)] overflow-y-auto overscroll-contain pb-[calc(1.25rem+env(safe-area-inset-bottom))]" style={{ background: surface, borderBottom: light ? '1px solid var(--border)' : '1px solid rgba(255,255,255,0.1)', boxShadow: '0 20px 50px rgba(0,0,0,0.22)', WebkitOverflowScrolling: 'touch' }}>
        <div className="px-4 py-4 space-y-4">
          <Link to="/study-material" className="mobile-menu-demo-cta flex items-center justify-between gap-3 rounded-2xl px-4 py-4 min-h-16">
            <div className="flex items-center gap-3 min-w-0"><div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 mobile-menu-demo-icon"><BookOpen className="w-5 h-5" /></div><div className="min-w-0"><div className="text-sm font-black">Open Free Study Material</div><div className="text-[11px] mt-0.5 opacity-80">Notes, PDFs, practice and tools.</div></div></div><ChevronRight className="w-5 h-5 flex-shrink-0" />
          </Link>
          {groups.map(group => { const Icon = group.icon; const groupId = group.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'); return <section key={group.title} aria-labelledby={`mobile-${groupId}`} className="mobile-menu-group rounded-2xl p-3" style={{ background: light ? 'var(--bg-ivory)' : 'rgba(255,255,255,0.045)', border: light ? '1px solid var(--border-soft)' : '1px solid rgba(255,255,255,0.06)' }}>
            <div id={`mobile-${groupId}`} className="px-2 pb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--gold)' }}><Icon className="w-4 h-4" />{group.title}</div>
            <div className="grid grid-cols-1 min-[420px]:grid-cols-2 gap-1">{group.links.map(item => { const active = pathname === item.path || pathname.startsWith(`${item.path.split('?')[0]}/`); return <Link key={item.path} to={item.path} className="min-h-11 rounded-xl px-3 py-2.5 flex items-center justify-between gap-2 text-sm font-semibold" style={{ color: active ? 'var(--gold)' : text, background: active ? 'var(--gold-bg)' : 'transparent' }}><span>{item.label}</span><ChevronRight className="w-4 h-4 flex-shrink-0" style={{ color: active ? 'var(--gold)' : muted }} /></Link>; })}</div>
          </section>; })}
          {user ? <div className="grid gap-2">{isAdmin && <Link to="/admin" className="btn-primary w-full min-h-12">Owner Panel</Link>}<Link to="/my-data" className="btn-outline-ink w-full min-h-12">My Study Data & Backup</Link></div> : <Link to="/login" className="btn-outline-ink w-full min-h-12">Student Login</Link>}
        </div>
      </nav>
    </>}
  </>;
}
