import { Link } from 'react-router-dom';
import { MapPin, Phone } from 'lucide-react';
import { localTuitionService } from '../../data/localTuitionService';
import { trackEvent } from '../../lib/analytics';

export default function LocalTuitionDetails({ demoHref }) {
  return (
    <section className="card-paper p-5 sm:p-7" aria-labelledby="local-lesson-options">
      <span className="eyebrow inline-flex items-center gap-2"><MapPin className="w-4 h-4" /> Mehsana, Gujarat</span>
      <h2 id="local-lesson-options" className="text-2xl sm:text-3xl mt-3" style={{ fontFamily: 'var(--font-serif)', color: 'var(--ink)' }}>{localTuitionService.heading}</h2>
      <p className="text-sm leading-7 mt-3" style={{ color: 'var(--muted)' }}>{localTuitionService.intro}</p>
      <div className="grid sm:grid-cols-2 gap-3 mt-5">
        {localTuitionService.modes.map((mode) => <div key={mode.title} className="tile-paper p-4"><h3 className="font-bold">{mode.title}</h3><p className="text-sm leading-7 mt-2" style={{ color: 'var(--muted)' }}>{mode.description}</p></div>)}
      </div>
      <div className="flex flex-col sm:flex-row gap-3 mt-5">
        <Link to={demoHref} className="btn-primary inline-flex items-center justify-center" onClick={() => trackEvent('local_tuition_contact_click', { action: 'enquiry', placement: 'lesson-options' })}>Enquire about tuition</Link>
        <a href={`tel:${localTuitionService.phone}`} className="btn-secondary inline-flex items-center justify-center gap-2" onClick={() => trackEvent('local_tuition_contact_click', { action: 'call', placement: 'lesson-options' })}><Phone className="w-4 h-4" /> {localTuitionService.phoneLabel}</a>
        <a href={localTuitionService.mapsUrl} target="_blank" rel="noopener noreferrer" className="btn-secondary inline-flex items-center justify-center gap-2" onClick={() => trackEvent('local_tuition_contact_click', { action: 'maps', placement: 'lesson-options' })}><MapPin className="w-4 h-4" /> View location on Google Maps</a>
      </div>
      <div className="space-y-3 mt-5">
        {localTuitionService.faqs.map(([question, answer]) => <details key={question} className="tile-paper p-4"><summary className="font-semibold cursor-pointer">{question}</summary><p className="text-sm leading-7 mt-3" style={{ color: 'var(--muted)' }}>{answer}</p></details>)}
      </div>
    </section>
  );
}
