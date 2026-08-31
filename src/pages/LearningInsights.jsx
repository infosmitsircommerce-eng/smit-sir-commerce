import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { BarChart3, BookOpenCheck, Brain, CheckCircle2, RefreshCw, Target, TriangleAlert } from 'lucide-react';
import SEO from '../components/ui/SEO';
import { useAuth } from '../context/AuthContext';
import { getUnifiedLearningSnapshot } from '../lib/learningIntelligence';

export default function LearningInsights() {
  const { user } = useAuth();
  const [refresh, setRefresh] = useState(0);
  const snapshot = useMemo(() => getUnifiedLearningSnapshot(user?.id), [user?.id, refresh]);

  useEffect(() => {
    const onStorage = () => setRefresh((v) => v + 1);
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  return <div className="min-h-screen" style={{ background: 'var(--bg-ivory)' }}>
    <SEO title="My Commerce Learning Insights" description="Private learning analytics built from practice, tests, mistakes and chapter completion." path="/learning-insights" noindex />
    <section className="page-hero"><div className="page-container"><span className="eyebrow">Unified learning intelligence</span><div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mt-5"><div><h1>Know exactly <em>what to fix next.</em></h1><p className="mt-5 text-lg max-w-3xl leading-relaxed" style={{ color: 'var(--muted)' }}>This combines Daily 10, Exam Mode, Test Series, Mistake Book and chapter progress into one weak-topic view. It is a study estimate based on your activity, not an official grade.</p></div><button onClick={() => setRefresh((v) => v + 1)} className="btn-secondary inline-flex items-center gap-2 self-start"><RefreshCw className="w-4 h-4" /> Refresh insights</button></div></div></section>
    <main className="page-container section-padding"><div className="grid grid-cols-2 lg:grid-cols-5 gap-3">{[
      ['Total tests', snapshot.attempts, BarChart3],
      ['Average score', `${snapshot.averageScore}%`, Target],
      ['Mistakes to fix', snapshot.pendingMistakes, TriangleAlert],
      ['Chapters viewed', snapshot.viewedChapters, Brain],
      ['Chapters complete', snapshot.completedChapters, BookOpenCheck],
    ].map(([label, value, Icon]) => <div key={label} className="card-paper p-4 text-center"><Icon className="w-5 h-5 mx-auto" style={{ color: 'var(--gold)' }} /><div className="text-2xl font-black mt-2" style={{ color: 'var(--ink)' }}>{value}</div><div className="text-xs mt-1" style={{ color: 'var(--muted)' }}>{label}</div></div>)}</div>

      {snapshot.topics.length === 0 ? <section className="card-paper p-10 text-center mt-6"><Brain className="w-10 h-10 mx-auto" style={{ color: 'var(--gold)' }} /><h2 className="text-2xl mt-4" style={{ fontFamily: 'var(--font-serif)', color: 'var(--ink)' }}>Not enough practice data yet</h2><p className="mt-2 text-sm" style={{ color: 'var(--muted)' }}>Complete Daily 10 or an Exam Mode test and your weak-topic map will start building automatically.</p><div className="flex flex-wrap justify-center gap-2 mt-6"><Link to="/daily-practice" className="btn-primary">Start Daily 10</Link><Link to="/exam-mode" className="btn-secondary">Open Exam Mode</Link></div></section> : <div className="grid lg:grid-cols-2 gap-6 mt-6">
        <section className="card-paper p-5 sm:p-7"><h2 className="text-2xl flex items-center gap-2" style={{ fontFamily: 'var(--font-serif)', color: 'var(--ink)' }}><TriangleAlert className="w-5 h-5" style={{ color: '#B4533C' }} /> Weakest topics</h2><p className="text-sm mt-2" style={{ color: 'var(--muted)' }}>Lowest estimated accuracy across your recorded practice.</p><div className="space-y-3 mt-5">{snapshot.weakest.map((item, index) => <div key={`${item.topic}-${index}`} className="tile-paper p-4"><div className="flex items-start justify-between gap-3"><div><strong style={{ color: 'var(--ink)' }}>{item.topic}</strong><div className="text-xs mt-1" style={{ color: 'var(--muted)' }}>{item.subject} · {item.sources.join(' + ')}</div></div><strong style={{ color: item.accuracy >= 80 ? 'var(--green)' : '#B4533C' }}>{item.accuracy}%</strong></div><div className="h-2 rounded-full overflow-hidden mt-3" style={{ background: 'var(--border-soft)' }}><div className="h-full rounded-full" style={{ width: `${item.accuracy}%`, background: item.accuracy >= 80 ? 'var(--green)' : 'var(--gold)' }} /></div></div>)}</div><div className="grid sm:grid-cols-2 gap-2 mt-5"><Link to="/study-coach" className="btn-primary text-center">Get study mission</Link><Link to="/daily-practice" className="btn-secondary text-center">Fix mistakes</Link></div></section>
        <section className="card-paper p-5 sm:p-7"><h2 className="text-2xl flex items-center gap-2" style={{ fontFamily: 'var(--font-serif)', color: 'var(--ink)' }}><CheckCircle2 className="w-5 h-5" style={{ color: 'var(--green)' }} /> Strongest topics</h2><p className="text-sm mt-2" style={{ color: 'var(--muted)' }}>Areas where your recorded accuracy is strongest.</p><div className="space-y-3 mt-5">{snapshot.strongest.map((item, index) => <div key={`${item.topic}-${index}`} className="tile-paper p-4"><div className="flex items-start justify-between gap-3"><div><strong style={{ color: 'var(--ink)' }}>{item.topic}</strong><div className="text-xs mt-1" style={{ color: 'var(--muted)' }}>{item.subject} · {item.attempts} evidence point{item.attempts === 1 ? '' : 's'}</div></div><strong style={{ color: 'var(--green)' }}>{item.accuracy}%</strong></div></div>)}</div><Link to="/exam-mode" className="btn-secondary w-full text-center mt-5">Challenge yourself with another exam</Link></section>
      </div>}
    </main>
  </div>;
}
