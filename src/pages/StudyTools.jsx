import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Bookmark, CalendarDays, Calculator, Clock3, FileQuestion, Search, Sigma, Sparkles, Target, Trash2 } from 'lucide-react';
import SEO from '../components/ui/SEO';
import { getBookmarks, getRecentLearning, toggleBookmark } from '../components/ui/GlobalStudySearch';
import { seoMaterials } from '../data/seoMaterials';

const PLAN_KEY = 'ssc-revision-plan-v1';

function readPlan() {
  try { return JSON.parse(localStorage.getItem(PLAN_KEY) || '{}'); } catch { return {}; }
}

export default function StudyTools() {
  const [bookmarks, setBookmarks] = useState(() => getBookmarks());
  const [recent, setRecent] = useState(() => getRecentLearning());
  const [examDate, setExamDate] = useState(() => readPlan().examDate || '');
  const [minutes, setMinutes] = useState(() => readPlan().minutes || 30);

  useEffect(() => {
    const sync = () => { setBookmarks(getBookmarks()); setRecent(getRecentLearning()); };
    window.addEventListener('ssc-study-state-changed', sync);
    return () => window.removeEventListener('ssc-study-state-changed', sync);
  }, []);

  const plan = useMemo(() => {
    if (!examDate) return null;
    const today = new Date(); today.setHours(0,0,0,0);
    const target = new Date(`${examDate}T00:00:00`);
    const days = Math.max(1, Math.ceil((target - today) / 86400000));
    const chaptersPerDay = Math.max(1, Math.ceil(seoMaterials.length / days));
    const daily = seoMaterials.slice(0, Math.min(chaptersPerDay, 4));
    return { days, chaptersPerDay, daily };
  }, [examDate]);

  function savePlan() {
    localStorage.setItem(PLAN_KEY, JSON.stringify({ examDate, minutes }));
  }

  function removeBookmark(item) {
    toggleBookmark(item);
    setBookmarks(getBookmarks());
  }

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-ivory)' }}>
      <SEO title="Commerce Study Toolkit" description="Search, bookmark and continue CBSE Commerce learning with a revision planner, important-question shortcuts and numerical practice links." path="/study-tools" />

      <section className="page-hero">
        <div className="page-container">
          <span className="eyebrow">Your study workspace</span>
          <h1 className="mt-5">Study smarter, <em>pick up exactly where you left off.</em></h1>
          <p className="mt-5 text-lg max-w-3xl" style={{ color: 'var(--muted)' }}>Search the site, save useful chapters, reopen recent resources, and build a simple revision plan from the material already published on Smit Sir Commerce.</p>
          <button onClick={() => window.dispatchEvent(new CustomEvent('ssc-open-search'))} className="btn-primary mt-7 inline-flex items-center gap-2"><Search className="w-4 h-4" /> Search everything</button>
        </div>
      </section>

      <main className="page-container section-padding space-y-8">
        <section className="grid lg:grid-cols-2 gap-6">
          <div className="card-paper p-6 sm:p-8">
            <div className="flex items-center justify-between gap-3 mb-5"><div><span className="eyebrow">Bookmarks</span><h2 className="text-2xl mt-2" style={{ fontFamily: 'var(--font-serif)', color: 'var(--ink)' }}>Saved for revision</h2></div><Bookmark className="w-6 h-6" style={{ color: 'var(--gold)' }} /></div>
            <div className="space-y-3">
              {bookmarks.length === 0 ? <p className="text-sm" style={{ color: 'var(--muted)' }}>Nothing saved yet. Open site search and tap the bookmark icon beside any chapter or tool.</p> : bookmarks.slice(0, 8).map((item) => <div key={item.path} className="tile-paper p-3 flex items-center gap-3"><Link to={item.path} className="flex-1 min-w-0"><div className="text-xs" style={{ color: 'var(--gold)' }}>{item.type || 'Saved'}</div><div className="font-semibold text-sm truncate" style={{ color: 'var(--ink)' }}>{item.title}</div></Link><button onClick={() => removeBookmark(item)} aria-label="Remove bookmark" className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ color: 'var(--muted)' }}><Trash2 className="w-4 h-4" /></button></div>)}
            </div>
          </div>

          <div className="card-paper p-6 sm:p-8">
            <div className="flex items-center justify-between gap-3 mb-5"><div><span className="eyebrow">Continue learning</span><h2 className="text-2xl mt-2" style={{ fontFamily: 'var(--font-serif)', color: 'var(--ink)' }}>Recently viewed</h2></div><Clock3 className="w-6 h-6" style={{ color: 'var(--gold)' }} /></div>
            <div className="space-y-3">
              {recent.length === 0 ? <p className="text-sm" style={{ color: 'var(--muted)' }}>Your recent chapters and practice pages will appear here automatically.</p> : recent.slice(0, 8).map((item) => <Link key={item.path} to={item.path} className="tile-paper p-3 block"><div className="text-xs" style={{ color: 'var(--gold)' }}>{item.type || 'Learning'}</div><div className="font-semibold text-sm mt-1" style={{ color: 'var(--ink)' }}>{item.title}</div><div className="text-xs mt-1" style={{ color: 'var(--muted)' }}>{item.subtitle}</div></Link>)}
            </div>
          </div>
        </section>

        <section className="card-paper p-6 sm:p-8">
          <div className="grid lg:grid-cols-[.8fr_1.2fr] gap-7 items-start">
            <div>
              <span className="eyebrow">Revision calendar</span>
              <h2 className="text-3xl mt-3" style={{ fontFamily: 'var(--font-serif)', color: 'var(--ink)' }}>Plan backwards from your exam.</h2>
              <p className="text-sm mt-3 leading-relaxed" style={{ color: 'var(--muted)' }}>This planner uses only the chapters currently published on the website. It is a study guide, not an official school timetable.</p>
              <label className="block text-sm font-semibold mt-6 mb-2" style={{ color: 'var(--ink)' }}>Exam date</label>
              <input type="date" value={examDate} onChange={(e) => setExamDate(e.target.value)} className="w-full rounded-xl px-4 py-3" style={{ background: 'var(--bg-white)', border: '1px solid var(--border)', color: 'var(--ink)' }} />
              <label className="block text-sm font-semibold mt-4 mb-2" style={{ color: 'var(--ink)' }}>Daily revision time</label>
              <select value={minutes} onChange={(e) => setMinutes(Number(e.target.value))} className="w-full rounded-xl px-4 py-3" style={{ background: 'var(--bg-white)', border: '1px solid var(--border)', color: 'var(--ink)' }}><option value={15}>15 minutes</option><option value={30}>30 minutes</option><option value={45}>45 minutes</option><option value={60}>60 minutes</option></select>
              <button onClick={savePlan} className="btn-primary mt-5 inline-flex items-center gap-2"><CalendarDays className="w-4 h-4" /> Save plan</button>
            </div>
            <div className="rounded-2xl p-5 sm:p-6" style={{ background: 'var(--gold-bg)', border: '1px solid rgba(184,135,47,.22)' }}>
              {!plan ? <div className="text-sm" style={{ color: 'var(--muted)' }}>Choose an exam date to see a suggested pace.</div> : <><div className="grid grid-cols-3 gap-3 mb-5">{[[plan.days,'days left'],[minutes,'min/day'],[plan.chaptersPerDay,'chapters/day']].map(([value,label]) => <div key={label} className="text-center rounded-xl p-3" style={{ background: 'rgba(255,255,255,.62)' }}><div className="text-2xl font-bold" style={{ color: 'var(--ink)' }}>{value}</div><div className="text-[10px] uppercase tracking-wider" style={{ color: 'var(--muted)' }}>{label}</div></div>)}</div><div className="text-sm font-semibold mb-3" style={{ color: 'var(--ink)' }}>Start with these published chapters</div><div className="space-y-2">{plan.daily.map((m) => <Link key={m.id} to={m.seo_path} className="block rounded-xl px-4 py-3 text-sm" style={{ background: 'rgba(255,255,255,.7)', color: 'var(--ink)' }}>Class {m.class_level} · {m.chapter}</Link>)}</div></>}
            </div>
          </div>
        </section>

        <section>
          <div className="text-center max-w-2xl mx-auto mb-6"><span className="eyebrow">Exam prep shortcuts</span><h2 className="text-3xl mt-3" style={{ fontFamily: 'var(--font-serif)', color: 'var(--ink)' }}>Go straight to the kind of practice you need.</h2></div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { icon: FileQuestion, title: 'Important Questions', text: 'Every published SEO chapter includes important questions with answer guidance.', to: '/cbse-notes' },
              { icon: Calculator, title: 'Numerical Practice', text: 'Use Economics and Accountancy tests, Daily 10 and chapter MCQs for calculation practice.', to: '/test-series' },
              { icon: Sigma, title: 'Formula Revision', text: 'Open the relevant chapter notes and save formula-heavy chapters to your bookmarks.', to: '/study-material' },
              { icon: Target, title: 'Case Study Practice', text: 'Practice application-style Business Studies questions through chapter MCQs and tests.', to: '/test-series' },
            ].map(({ icon: Icon, title, text, to }) => <Link key={title} to={to} className="card-paper p-5 hover:-translate-y-1 transition-transform"><Icon className="w-6 h-6" style={{ color: 'var(--gold)' }} /><h3 className="font-semibold mt-4" style={{ color: 'var(--ink)' }}>{title}</h3><p className="text-sm mt-2 leading-relaxed" style={{ color: 'var(--muted)' }}>{text}</p></Link>)}
          </div>
        </section>

        <section className="rounded-3xl p-6 sm:p-8 text-center" style={{ background: 'var(--ink)', color: '#fff' }}>
          <Sparkles className="w-7 h-7 mx-auto" style={{ color: 'var(--gold-bright)' }} />
          <h2 className="text-3xl mt-3" style={{ fontFamily: 'var(--font-serif)' }}>Need the site to choose for you?</h2>
          <p className="mt-3 text-sm max-w-xl mx-auto" style={{ color: 'var(--muted-on-ink)' }}>Use Study Coach for a personalized next mission, or Daily 10 if you only have a few minutes.</p>
          <div className="flex flex-wrap justify-center gap-3 mt-6"><Link to="/study-coach" className="btn-gold">Open Study Coach</Link><Link to="/daily-practice" className="btn-secondary">Do Daily 10</Link></div>
        </section>
      </main>
    </div>
  );
}
