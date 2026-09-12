import { useEffect, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ArrowRight, Check, FlaskConical, RotateCcw, Share2, ShoppingBasket, Sparkles } from 'lucide-react';
import SEO from '../components/ui/SEO';
import { trackEvent } from '../lib/analytics';
import { conceptLabMeta, inflationCases, moneyPresets, purchasingPower, cleanLabState, LAB_STORAGE_KEY } from '../data/conceptLab';
import '../styles/conceptLab.css';

function initialState() {
  try { const saved = localStorage.getItem(LAB_STORAGE_KEY); return saved ? cleanLabState(JSON.parse(saved)) : cleanLabState({ prices: 25 }); }
  catch { return cleanLabState({ prices: 25 }); }
}
const rupees = value => `₹${Math.round(value).toLocaleString('en-IN')}`;

export default function ConceptLab() {
  const [params] = useSearchParams();
  const [state, setState] = useState(initialState);
  const [hindi, setHindi] = useState(false);
  const [shareMessage, setShareMessage] = useState('');
  const caseHeading = useRef(null);
  const current = inflationCases.find(item => item.id === state.caseId);
  const selected = state.answers[current.id] || { main: null, follow: null };
  const result = purchasingPower(state.prices, state.income);
  const change = Math.abs(result.realChange) < 0.00001 ? 0 : result.realChange;
  const completed = inflationCases.filter(item => state.answers[item.id]?.main === item.answer && state.answers[item.id]?.follow === item.follow.answer).length;

  useEffect(() => {
    const requested = params.get('case');
    if (inflationCases.some(item => item.id === requested)) setState(previous => ({ ...previous, caseId: requested }));
  }, [params]);
  useEffect(() => { setShareMessage(''); }, [state.caseId]);
  useEffect(() => {
    try { localStorage.setItem(LAB_STORAGE_KEY, JSON.stringify(state)); } catch { /* Learning works even with storage disabled. */ }
  }, [state]);

  function answer(index, follow = false) {
    if (index !== null) void trackEvent('concept_lab_answer', { case: current.id, stage: follow ? 'apply' : 'identify', correct: index === (follow ? current.follow.answer : current.answer) });
    setState(previous => ({ ...previous, answers: { ...previous.answers, [current.id]: follow
      ? { ...(previous.answers[current.id] || { main: null }), follow: index }
      : { main: index, follow: null } } }));
  }
  function nextCase() {
    const next = inflationCases[(inflationCases.indexOf(current) + 1) % inflationCases.length];
    setState(previous => ({ ...previous, caseId: next.id }));
    window.requestAnimationFrame(() => caseHeading.current?.focus({ preventScroll: true }));
  }
  async function share() {
    const url = `${window.location.origin}/concept-lab?case=${current.id}`;
    try {
      if (navigator.share) await navigator.share({ title: 'Try the Commerce Concept Lab', text: 'Can you explain this Economics situation?', url });
      else if (navigator.clipboard?.writeText) { await navigator.clipboard.writeText(url); setShareMessage('Case link copied.'); }
      else setShareMessage(url);
    } catch (error) { if (error.name !== 'AbortError') setShareMessage(url); }
  }

  return <div className="concept-lab">
    <SEO {...conceptLabMeta} structuredData={{ '@context': 'https://schema.org', '@type': 'LearningResource', name: conceptLabMeta.title, description: conceptLabMeta.description, url: 'https://www.smitsircommerce.in/concept-lab', isAccessibleForFree: true, learningResourceType: 'Interactive practice', educationalLevel: 'Class 11 and Class 12', inLanguage: ['en', 'hi'] }} />
    <header className="lab-hero">
      <div className="lab-wrap">
        <nav aria-label="Breadcrumb" className="lab-breadcrumb"><Link to="/">Home</Link><span>/</span><span>Concept Lab</span></nav>
        <div className="lab-hero-grid"><div>
          <span className="lab-eyebrow"><FlaskConical size={17} aria-hidden="true" /> SMIT SIR COMMERCE · LAB 01</span>
          <h1>Make economics<br /><em>click.</em></h1>
          <p className="lab-lede">Change a number. See the idea.<br />Then explain it in your own words.</p>
          <div className="lab-tags"><span>Free · No login</span><span>English + Hindi explanations</span><span>Your place is saved on this device</span></div>
        </div><div className="lab-hero-art" aria-hidden="true">
          <div className="lab-orbit"><div className="lab-art-card"><span>THE SAME RUPEE.</span><strong>A different<br />buying power.</strong><ShoppingBasket size={58} strokeWidth={1.3} /></div><span className="lab-orbit-tag">WHAT IF?</span><span className="lab-orbit-dot" /></div>
        </div></div>
        <div className="lab-route"><a href="#money-lab"><span>01</span> Experiment</a><a href="#case-lab"><span>02</span> Explain a case</a><a href="#lab-resources"><span>03</span> Keep learning</a></div>
      </div>
    </header>
    <div className="lab-wrap lab-main">
      <section id="money-lab" aria-labelledby="money-title" className="lab-experiment">
        <div className="lab-section-heading"><span className="lab-kicker">01 / THE MONEY EXPERIMENT</span><h2 id="money-title">A bigger income. A smaller basket?</h2><p>Move the sliders and compare income with prices. These are fictional learning values for one period.</p></div>
        <div className="lab-panel-grid">
          <div className="lab-controls lab-card">
            <div className="lab-preset-row" aria-label="Example settings">{moneyPresets.map(preset => <button key={preset.id} type="button" aria-pressed={state.prices === preset.prices && state.income === preset.income} onClick={() => setState(previous => ({ ...previous, prices: preset.prices, income: preset.income }))}>{preset.label}</button>)}</div>
            <div className="lab-slider"><label htmlFor="price-rise">Basket price increase <strong>{state.prices}%</strong></label><input id="price-rise" type="range" min="0" max="40" step="5" value={state.prices} onChange={event => setState(previous => ({ ...previous, prices: Number(event.target.value) }))} aria-valuetext={`${state.prices} percent price increase`} /><div><span>No rise</span><span>40% rise</span></div></div>
            <div className="lab-slider"><label htmlFor="income-rise">Income increase <strong>{state.income}%</strong></label><input id="income-rise" type="range" min="0" max="40" step="5" value={state.income} onChange={event => setState(previous => ({ ...previous, income: Number(event.target.value) }))} aria-valuetext={`${state.income} percent income increase`} /><div><span>No rise</span><span>40% rise</span></div></div>
            <div className="lab-starting-values"><span>Starting income <strong>₹10,000</strong></span><span>Starting basket <strong>₹1,000</strong></span></div>
            <p className="lab-small">Treat the basket as a representative bundle of goods and services. This model applies the same price-level change to the whole bundle.</p>
            <button type="button" className="lab-text-button" onClick={() => setState(previous => ({ ...previous, prices: 0, income: 0 }))}><RotateCcw size={15} aria-hidden="true" /> Reset numbers</button>
          </div>
          <div className="lab-result lab-card" aria-live="polite" aria-atomic="true">
            <span className="lab-kicker">YOUR NEW PURCHASING POWER</span>
            <div className="lab-basket-count"><strong>{result.baskets.toFixed(2)}</strong><span>baskets<br />instead of 10</span></div>
            <div className="lab-basket-strip" aria-hidden="true">{Array.from({ length: 14 }, (_, index) => <span key={index}><span style={{ clipPath: `inset(0 ${100 - Math.max(0, Math.min(1, result.baskets - index)) * 100}% 0 0)` }}><ShoppingBasket size={26} strokeWidth={1.6} /></span><ShoppingBasket size={26} strokeWidth={1.2} /></span>)}</div>
            <p className={`lab-change ${change < 0 ? 'lab-change-loss' : ''}`}>{change === 0 ? 'Same purchasing power' : `${Math.abs(change).toFixed(1)}% ${change < 0 ? 'less' : 'more'} purchasing power`}</p>
            <div className="lab-result-values"><div><span>New income</span><strong>{rupees(result.budget)}</strong></div><div><span>New basket price</span><strong>{rupees(result.basketPrice)}</strong></div></div>
            <div className="lab-takeaway"><Sparkles size={19} aria-hidden="true" /><p>{change < 0 ? 'More expensive baskets can outweigh an income rise. Compare what the money buys, not just the number of rupees.' : change > 0 ? 'Income grew faster than the basket price, so the same-period income buys more.' : 'Income and the price level changed by the same percentage. The quantity you can buy stays the same.'}</p></div>
            <details className="lab-working"><summary>See the working</summary><p>{rupees(result.budget)} ÷ {rupees(result.basketPrice)} = {result.baskets.toFixed(2)} baskets.</p><p>Real change = [(1 + income increase ÷ 100) ÷ (1 + price increase ÷ 100) − 1] × 100.</p><p>A 25% price rise with unchanged income means 20% less purchasing power, not 25% less.</p></details>
          </div>
        </div>
      </section>
      <section id="case-lab" aria-labelledby="case-title" className="lab-case-section">
        <div className="lab-section-heading"><span className="lab-kicker">02 / THINK LIKE AN ECONOMIST</span><h2 id="case-title">Find the clue. Explain the cause.</h2><p>Five original situations. Each one has a fresh follow-up question.</p></div>
        <div className="lab-case-layout"><nav className="lab-case-nav" aria-label="Choose a case">{inflationCases.map((item, index) => {
          const done = state.answers[item.id]?.main === item.answer && state.answers[item.id]?.follow === item.follow.answer;
          return <button type="button" key={item.id} aria-pressed={current.id === item.id} onClick={() => setState(previous => ({ ...previous, caseId: item.id }))}><span className="lab-case-number">{done ? <Check size={17} aria-label="Completed" /> : String(index + 1).padStart(2, '0')}</span><span><strong>{item.title}</strong><small>{item.tag}</small></span><ArrowRight size={17} aria-hidden="true" /></button>;
        })}<p className="lab-progress">{completed} / 5 cases completed <span>A case is complete after both answers are correct.</span></p></nav>
        <article className="lab-case-card lab-card">
          <div className="lab-case-top"><span className="lab-kicker">CASE {inflationCases.indexOf(current) + 1} / 5</span><button type="button" className="lab-language" aria-pressed={hindi} onClick={() => setHindi(previous => !previous)}>{hindi ? 'Explain in English' : 'Explain in Hindi'}</button></div>
          <h3 ref={caseHeading} tabIndex={-1}>{current.title}</h3><p className="lab-story">{current.story}</p>
          <div className="lab-answers" role="group" aria-label="Choose your answer">{current.options.map((option, index) => <button type="button" key={option.label} aria-pressed={selected.main === index} onClick={() => answer(index)} disabled={selected.main === current.answer} className={selected.main === index ? (index === current.answer ? 'lab-answer-correct' : 'lab-answer-revise') : ''}><span>{String.fromCharCode(65 + index)}</span>{option.label}{selected.main === index && index === current.answer && <Check size={18} aria-hidden="true" />}</button>)}</div>
          {selected.main !== null && <div className="lab-feedback" role="status">
            <strong>{selected.main === current.answer ? 'You found the clue.' : 'Let’s unpack that answer.'}</strong><p lang={hindi ? 'hi' : 'en'}>{hindi ? current.hindi : current.options[selected.main].reason}</p><p className="lab-clue"><span>LOOK FOR</span> {current.clue}</p>
            {selected.main !== current.answer && <button type="button" className="lab-text-button" onClick={() => answer(null)}>Try the question again <ArrowRight size={15} aria-hidden="true" /></button>}
          </div>}
          {selected.main === current.answer && <section className="lab-follow" aria-label="Apply the concept"><span className="lab-kicker">NOW APPLY IT</span><h4>{current.follow.question}</h4><div className="lab-answers" role="group" aria-label="Choose your follow-up answer">{current.follow.options.map((option, index) => <button type="button" key={option} onClick={() => answer(index, true)} aria-pressed={selected.follow === index} disabled={selected.follow === current.follow.answer} className={selected.follow === index ? (index === current.follow.answer ? 'lab-answer-correct' : 'lab-answer-revise') : ''}><span>{String.fromCharCode(65 + index)}</span>{option}</button>)}</div>
            {selected.follow !== null && <div className="lab-feedback" role="status"><strong>{selected.follow === current.follow.answer ? 'Concept applied.' : 'One more look at the clue.'}</strong><p lang={hindi ? 'hi' : 'en'}>{hindi ? current.follow.hindi : current.follow.explanation}</p>{selected.follow !== current.follow.answer && <button type="button" className="lab-text-button" onClick={() => answer(null, true)}>Try the new question again</button>}</div>}
          </section>}
          {selected.main !== null && <details className="lab-exam"><summary>How to write this in an exam</summary><p>{current.exam}</p><small>Original model explanation. Match your textbook wording and the marks asked; this is not an official board marking scheme.</small></details>}
          <div className="lab-case-bottom"><button type="button" className="lab-primary" onClick={nextCase}>Next case <ArrowRight size={17} aria-hidden="true" /></button><button type="button" className="lab-text-button" onClick={share}><Share2 size={16} aria-hidden="true" /> Share this case</button><button type="button" className="lab-text-button" onClick={() => setState(previous => ({ ...previous, answers: { ...previous.answers, [current.id]: { main: null, follow: null } } }))}>Restart case</button></div>
          {shareMessage && <p role="status" className="lab-small lab-share-message">{shareMessage}</p>}
        </article></div>
      </section>
      <section id="lab-resources" className="lab-resources" aria-labelledby="resources-title"><span className="lab-kicker">03 / KEEP THE IDEA MOVING</span><h2 id="resources-title">Turn the experiment into revision.</h2><div><a href="/gseb/class-12/economics/money-and-inflation-notes.html">GSEB Money & Inflation notes <ArrowRight size={18} aria-hidden="true" /></a><Link to="/quizzes?board=GSEB&class=12&subject=Economics&pack=gseb-12-economics-ch3">GSEB chapter quiz <ArrowRight size={18} aria-hidden="true" /></Link><Link to="/cbse/class-12/macroeconomics-notes">CBSE Macroeconomics notes <ArrowRight size={18} aria-hidden="true" /></Link></div><p>Inflation basics: <a href="https://www.bankofengland.co.uk/explainers/what-is-inflation" target="_blank" rel="noopener noreferrer">Bank of England explainer</a>. The rupee examples here are fictional; they do not show current inflation or predict prices.</p></section>
    </div>
  </div>;
}
