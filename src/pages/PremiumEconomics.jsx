import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpenCheck, Crown, Loader2, LockKeyhole } from 'lucide-react';
import SEO from '../components/ui/SEO';
import PremiumGsebEconomics from '../components/PremiumGsebEconomics';
import { useAuth } from '../context/AuthContext';
import { verifiedQuizPacks } from '../data/quizPublic';
import { supabase } from '../lib/supabase';

const economics = verifiedQuizPacks.filter((pack) => pack.board === 'CBSE' && pack.subject === 'Economics');
const groupFor = (pack) => pack.classLevel === 11 ? 'micro' : pack.stream === 'Macroeconomics' ? 'macro' : 'ied';
const productForGroup = (group) => group === 'micro' ? 'cbse-11-microeconomics' : group === 'gseb' ? 'gseb-12-economics' : 'cbse-12-economics';
const labelForProduct = (productId) => productId === 'cbse-11-microeconomics' ? 'CBSE Class 11 Microeconomics Foundation Pack' : productId === 'gseb-12-economics' ? 'GSEB Class 12 Economics Board Booster' : 'CBSE Class 12 Economics Board Booster';

export default function PremiumEconomics() {
  const { user, loading } = useAuth();
  const [group, setGroup] = useState(() => new URLSearchParams(window.location.search).get('board') === 'CBSE' ? 'micro' : 'gseb');
  const [guide, setGuide] = useState(null);
  const [busy, setBusy] = useState('');
  const [error, setError] = useState('');
  const [lockedProduct, setLockedProduct] = useState('');
  const packs = useMemo(() => economics.filter((pack) => groupFor(pack) === group), [group]);

  useEffect(() => { setGuide(null); setError(''); setLockedProduct(''); }, [user?.id, group]);

  async function open(pack) {
    setBusy(pack.id);
    setError('');
    setLockedProduct('');
    const productId = productForGroup(groupFor(pack));
    try {
      if (!user) {
        setLockedProduct(productId);
        setError('Sign in first so we can check whether this pack belongs to your account.');
        return;
      }
      const { data } = await supabase.auth.getSession();
      const token = data.session?.access_token;
      if (!token) throw new Error('Please sign in again.');
      const response = await fetch('/api/premium-study', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ packId: pack.id }),
      });
      const body = await response.json();
      if (response.status === 401 || response.status === 403) {
        setLockedProduct(body.productId || productId);
        setError(body.error || 'This guide requires the matching Board Booster pack.');
        return;
      }
      if (!response.ok) throw new Error(body.error || 'Unable to load guide');
      setGuide(body);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (problem) {
      setError(problem.message);
    } finally {
      setBusy('');
    }
  }

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin" /></div>;

  if (guide) return <main className="page-container py-10 max-w-5xl"><SEO title={`${guide.title} Premium Guide`} description="Protected Premium learning resource." path="/premium/economics" noindex /><button onClick={() => setGuide(null)} className="btn-secondary">← All Premium guides</button><div className="mt-6 flex items-start gap-3"><Crown className="w-7 h-7" style={{ color: 'var(--gold)' }} /><div><span className="eyebrow">Purchased pack resource</span><h1 className="text-3xl sm:text-4xl mt-2">{guide.title}</h1><p className="mt-2">Class {guide.classLevel} · {guide.stream}</p></div></div><section className="card-paper p-6 mt-7"><h2 className="text-2xl">20 concept explanations</h2><div className="space-y-4 mt-5">{guide.concepts.map((concept) => <article key={concept.title} className="tile-paper p-4"><h3 className="font-bold">{concept.prompt}</h3><p className="mt-2 leading-7">{concept.explanation}</p></article>)}</div></section><section className="card-paper p-6 mt-7"><h2 className="text-2xl">20 worked Hard and Extreme challenges</h2><p className="mt-2">Attempt each question before opening its answer.</p><div className="space-y-4 mt-5">{guide.worked.map((question, index) => <details key={index} className="tile-paper p-4"><summary className="cursor-pointer font-bold">{question.level} {index % 10 + 1}. {question.question}</summary><ol className="list-[upper-alpha] pl-6 mt-3 space-y-1">{question.options.map((option) => <li key={option}>{option}</li>)}</ol><p className="mt-4 leading-7"><strong>Answer: {String.fromCharCode(65 + question.answer)}. {question.options[question.answer]}.</strong> {question.explanation}</p></details>)}</div></section></main>;

  return <main className="page-container py-10 max-w-6xl"><SEO title="Economics Board Booster Library" description="Protected Economics Board Booster study guides." path="/premium/economics" noindex /><span className="eyebrow">Purchased learning library</span><h1 className="text-4xl mt-4">Economics Board Booster library</h1><p className="mt-4 max-w-3xl leading-7">This library now uses pack-specific access. GSEB Class 12, CBSE Class 12 and CBSE Class 11 are separate products. Older lifetime-Premium accounts continue to work as legacy access, while new ₹199 purchases unlock only the matching pack.</p><div className="flex flex-wrap gap-2 mt-6">{[['micro', 'Class 11 Micro'], ['macro', 'Class 12 Macro'], ['ied', 'Class 12 IED'], ['gseb', 'GSEB Class 12 PDFs']].map(([id, label]) => <button key={id} onClick={() => setGroup(id)} className={group === id ? 'btn-primary' : 'btn-secondary'}>{label}</button>)}</div>

    {error ? <div className="card-paper p-5 mt-5"><div className="flex gap-3"><LockKeyhole className="w-6 h-6 shrink-0" style={{ color: 'var(--gold)' }} /><div><p role="alert" className="font-semibold">{error}</p>{lockedProduct ? <div className="flex flex-wrap gap-3 mt-4"><Link to={`/board-booster-packs?pack=${lockedProduct}`} className="btn-primary">See {labelForProduct(lockedProduct)} · ₹199</Link><a href="/my-purchases.html" className="btn-secondary">My Purchases</a>{!user ? <Link to="/login" className="btn-secondary">Sign in</Link> : null}</div> : null}</div></div></div> : null}

    {group === 'gseb' ? <PremiumGsebEconomics /> : <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4 mt-7">{packs.map((pack) => <article key={pack.id} className="card-paper p-5"><BookOpenCheck className="w-6 h-6" style={{ color: 'var(--gold)' }} /><h2 className="text-xl mt-3">{pack.title}</h2><p className="text-sm mt-2">20 concepts · 20 worked challenges</p><button onClick={() => open(pack)} disabled={busy === pack.id} className="btn-primary w-full mt-5">{busy === pack.id ? 'Checking access…' : 'Open / check access'}</button></article>)}</div>}
  </main>;
}
