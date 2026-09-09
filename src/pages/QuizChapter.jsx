import { Link, useLocation } from 'react-router-dom';
import SEO from '../components/ui/SEO';
import { quizDiscovery, quizPageByPath } from '../data/quizDiscovery';
import { LevelGrid } from './Quizzes';

export default function QuizChapter() {
  const { pathname } = useLocation();
  const page = quizPageByPath[pathname.replace(/\/$/, '')];
  if (!page) return <main className="page-container py-12"><SEO title="Quiz not found" path={pathname} noindex /><h1>Quiz not found</h1><Link to="/quizzes">Browse chapter quizzes</Link></main>;
  const {pack} = page;
  const related = quizDiscovery.filter(p => p.id !== page.id && p.pack.classLevel === pack.classLevel && p.pack.stream === pack.stream).slice(0,4);
  const base = 'https://www.smitsircommerce.in';
  return <main className="page-container py-10 max-w-5xl">
    <SEO title={page.title} description={page.description} path={page.path} structuredData={{'@context':'https://schema.org','@type':'LearningResource',name:page.title,url:base+page.path,learningResourceType:'Practice quiz',educationalLevel:`Class ${pack.classLevel}`,inLanguage:'en',isAccessibleForFree:true}} />
    <nav aria-label="Breadcrumb" className="text-sm mb-5"><Link to="/">Home</Link> / <Link to="/quizzes">Economics quizzes</Link> / {pack.title}</nav>
    <h1 className="text-3xl sm:text-4xl">{page.title}</h1>
    <p className="mt-4 text-base leading-7">Test your understanding of {pack.title} with 20 free questions across Easy and Moderate. Choose a level below, attempt each question, then review the explanation before moving on. Hard and Extreme require Premium.</p>
    <LevelGrid key={pack.id} pack={pack} />
    <section className="mt-10"><h2 className="text-2xl">Key concepts to revise</h2><div className="grid sm:grid-cols-2 gap-4 mt-5">{pack.levels.Easy.map((q,i)=><article key={i} className="rounded-xl border p-4"><h3 className="font-bold">{q.q.match(/\"(.*?)\"/)?.[1] || `Concept ${i+1}`}</h3><p className="text-base leading-7 mt-2">{q.explanation}</p></article>)}</div></section>
    <section className="mt-10"><h2 className="text-2xl">Try these sample MCQs</h2>{pack.levels.Moderate.slice(0,3).map((q,i)=><article key={i} className="border rounded-xl p-5 mt-4"><h3 className="font-semibold leading-7">{i+1}. {q.q}</h3><ol className="list-[upper-alpha] pl-6 mt-3 space-y-2">{q.options.map(o=><li key={o}>{o}</li>)}</ol><details className="mt-4"><summary className="cursor-pointer font-bold">Check answer and explanation</summary><p className="mt-3 leading-7">{q.options[q.answer]}. {q.explanation}</p></details></article>)}</section>
    <section className="mt-10"><h2 className="text-2xl">After the quiz</h2><p className="mt-3 leading-7">Write down the concepts you missed. Explain each one in your own words, give an example, and attempt the level again without notes. A high score on a short quiz does not replace revision of the whole chapter.</p><Link className="btn-secondary mt-4" to={pack.classLevel === 11 ? '/cbse/class-11/microeconomics-notes' : '/cbse/class-12/economics-revision-guide'}>Continue Economics revision</Link></section>
    <section className="mt-10"><h2 className="text-2xl">Related chapter quizzes</h2><ul className="mt-4 space-y-3">{related.map(p=><li key={p.id}><Link className="underline" to={p.path}>{p.title}</Link></li>)}</ul></section>
  </main>;
}
