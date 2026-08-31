import { useState } from 'react';
import { CalendarCheck2, CheckCircle2, MessageCircle, ShieldCheck, Sparkles } from 'lucide-react';
import SEO from '../components/ui/SEO';
import LeadCaptureForm from '../components/leads/LeadCaptureForm';
import DemoSlotPicker from '../components/leads/DemoSlotPicker';

export default function BookDemo() {
  const [selectedSlot, setSelectedSlot] = useState(null);

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-ivory)' }}>
      <SEO title="Book a Free Commerce Demo Class" description="Choose a real available Class 11 or 12 Commerce demo slot with Smit Sir Commerce, then reserve it with your study details." path="/book-demo" />

      <section className="page-hero">
        <div className="page-container max-w-5xl text-center">
          <span className="eyebrow">Free demo · Real published availability</span>
          <h1 className="mt-5">Choose a time. <em>Experience the teaching.</em></h1>
          <p className="mt-5 max-w-2xl mx-auto text-lg leading-relaxed" style={{ color: 'var(--muted)' }}>Pick one of the currently available slots below. If no suitable time is listed, send a normal demo request and we’ll arrange another option with you.</p>
        </div>
      </section>

      <main className="page-container section-padding">
        <div className="grid lg:grid-cols-[.72fr_1.28fr] gap-8 items-start">
          <aside className="space-y-4 lg:sticky lg:top-28">
            <div className="card-paper p-6">
              <Sparkles className="w-6 h-6" style={{ color: 'var(--gold)' }} />
              <h2 className="text-2xl mt-4" style={{ fontFamily: 'var(--font-serif)', color: 'var(--ink)' }}>What happens next?</h2>
              <div className="space-y-4 mt-5">
                {[
                  ['1', 'Choose a real slot', 'Only active times configured by Smit Sir are bookable.'],
                  ['2', 'Reserve with your details', 'Tell us your class, board and the subject you want to discuss.'],
                  ['3', 'Attend the demo', 'The owner CRM keeps the booking, reminder and follow-up together.'],
                ].map(([n, title, text]) => <div key={n} className="flex gap-3"><div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-black flex-shrink-0" style={{ background: 'var(--gold-bg)', color: 'var(--gold)' }}>{n}</div><div><div className="font-semibold" style={{ color: 'var(--ink)' }}>{title}</div><div className="text-sm mt-1 leading-relaxed" style={{ color: 'var(--muted)' }}>{text}</div></div></div>)}
              </div>
            </div>

            <div className="card-paper p-6">
              <div className="grid grid-cols-2 gap-3 text-sm">
                {[
                  [CheckCircle2, 'Class 11 & 12'],
                  [CalendarCheck2, 'Online + Offline'],
                  [ShieldCheck, 'No payment to book'],
                  [MessageCircle, 'WhatsApp support'],
                ].map(([Icon, text]) => <div key={text} className="tile-paper p-3"><Icon className="w-4 h-4" style={{ color: 'var(--gold)' }} /><div className="mt-2 font-semibold" style={{ color: 'var(--charcoal)' }}>{text}</div></div>)}
              </div>
            </div>
          </aside>

          <div className="space-y-5">
            <section className="card-paper p-6 sm:p-8"><DemoSlotPicker selectedId={selectedSlot?.id || null} onSelect={setSelectedSlot} /></section>
            <section className="card-paper p-6 sm:p-8"><LeadCaptureForm intent="Free Demo" heading={selectedSlot ? 'Reserve your selected demo' : 'Request your free demo'} demoSlot={selectedSlot} /></section>
          </div>
        </div>
      </main>
    </div>
  );
}
