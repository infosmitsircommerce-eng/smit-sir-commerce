import { Link } from 'react-router-dom';
import { ArrowRight, ListChecks } from 'lucide-react';

const subjects = [
  { name: 'Microeconomics', classLabel: 'Class 11', chapters: '13 chapters', questions: 520, key: 'micro', detail: 'Demand, consumer equilibrium, production, costs and markets.' },
  { name: 'Macroeconomics', classLabel: 'Class 12', chapters: '5 units', questions: 200, key: 'macro', detail: 'National income, banking, employment, government budget and BOP.' },
  { name: 'Indian Economic Development', classLabel: 'Class 12', chapters: '13 chapters', questions: 520, key: 'ied', detail: 'Economic reforms, rural development, human capital and sustainability.' },
];

export default function QuizPromo() {
  return (
    <section id="chapter-quizzes" aria-labelledby="quiz-heading" className="py-12 sm:py-16" style={{ background: 'var(--bg-ivory)' }}>
      <div className="page-container">
        <div className="flex flex-col sm:flex-row justify-between sm:items-end gap-5 mb-7">
          <div>
            <span className="eyebrow">Free CBSE Economics practice</span>
            <h2 id="quiz-heading" className="headline mt-3">Know the chapter? <em>Test yourself.</em></h2>
            <p className="text-base mt-3 max-w-2xl" style={{ color: 'var(--muted)' }}>1,240 questions with answers and explanations. Choose your subject, chapter and difficulty.</p>
          </div>
          <Link to="/quizzes" className="btn-primary shrink-0">Browse all quizzes <ArrowRight className="w-4 h-4" /></Link>
        </div>
        <div className="grid md:grid-cols-3 gap-5">
          {subjects.map((subject) => (
            <article key={subject.key} className="card-paper p-6 flex flex-col">
              <div className="flex justify-between items-center gap-3" style={{ color: 'var(--gold)' }}>
                <span className="text-sm font-bold">{subject.classLabel} · CBSE</span><ListChecks className="w-6 h-6" />
              </div>
              <h3 className="text-2xl mt-4" style={{ fontFamily: 'var(--font-serif)', color: 'var(--ink)' }}>{subject.name}</h3>
              <p className="text-base mt-3" style={{ color: 'var(--muted)' }}>{subject.detail}</p>
              <p className="text-sm font-bold mt-4" style={{ color: 'var(--gold)' }}>{subject.chapters} · {subject.questions} questions</p>
              <p className="text-sm mt-2 mb-6" style={{ color: 'var(--muted)' }}>Easy · Moderate · Hard · Extreme</p>
              <Link to={'/quizzes?subject=' + subject.key} className="btn-secondary mt-auto" aria-label={'Start ' + subject.name + ' quiz'}>Start quiz <ArrowRight className="w-4 h-4" /></Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
