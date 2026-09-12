import { useEffect } from 'react';
import { BOARD_BOOSTER_PREVIEWS } from '../../data/boardBoosterPreviews';
import { BOARD_BOOSTER_PRODUCTS } from '../../data/boardBoosterProducts';
import { trackEvent } from '../../lib/analytics';

export default function BoardBoosterPreview({ selectedId, setSelectedId }) {
  const product = BOARD_BOOSTER_PRODUCTS.find(item => item.id === selectedId) || BOARD_BOOSTER_PRODUCTS[0];
  useEffect(() => { trackEvent('board_booster_preview_view', { productId: product.id }); }, [product.id]);
  return (
    <section id="free-preview" className="page-container section-padding scroll-mt-24" aria-labelledby="preview-heading">
      <span className="eyebrow">Free preview · No login</span>
      <h2 id="preview-heading" className="text-3xl sm:text-4xl mt-4" style={{ fontFamily: 'var(--font-serif)' }}>Try the practice style before you reserve</h2>
      <p className="text-sm leading-7 mt-3 max-w-3xl" style={{ color: 'var(--muted)' }}>Free original preview questions with worked answers. These demonstrate the practice style; they are not official board questions or a complete paid pack.</p>
      <label className="block font-semibold text-sm mt-5 max-w-md">Choose your board and subject
        <select className="input-field w-full mt-2" value={product.id} onChange={event => setSelectedId(event.target.value)}>{BOARD_BOOSTER_PRODUCTS.map(item => <option key={item.id} value={item.id}>{item.shortName}</option>)}</select>
      </label>
      <div className="grid md:grid-cols-2 gap-4 mt-5">
        {BOARD_BOOSTER_PREVIEWS[product.id].map((item, index) => <article key={`${product.id}:${item.title}`} className="card-paper p-5 sm:p-6"><h3 className="font-bold text-lg">{item.title}</h3><p className="text-sm leading-7 mt-3">{item.question}</p><details className="tile-paper p-4 mt-4" onToggle={event => { if (event.currentTarget.open) trackEvent('board_booster_preview_answer_open', { productId: product.id, question: index + 1 }); }}><summary className="font-semibold text-sm cursor-pointer">Show worked answer and common mistake</summary><p className="text-sm leading-7 mt-3">{item.answer}</p><p className="text-sm leading-7 mt-3"><strong>Common mistake:</strong> {item.trap}</p></details></article>)}
      </div>
      <button type="button" className="btn-primary mt-5" onClick={() => { document.getElementById('reserve-pack')?.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' }); trackEvent('board_booster_preview_reserve_click', { productId: product.id }); }}>Request {product.shortName} pack details · ₹199</button>
      <p className="text-xs mt-3" style={{ color: 'var(--muted)' }}>The request form does not take payment. Payment and delivery are confirmed separately.</p>
    </section>
  );
}
