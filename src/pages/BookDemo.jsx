import { CalendarCheck2, CheckCircle2, MessageCircle, ShieldCheck, Sparkles } from 'lucide-react';
import SEO from '../components/ui/SEO';
import LeadCaptureForm from '../components/leads/LeadCaptureForm';

export default function BookDemo() {
  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-ivory)' }}>
      <SEO title="Book a Free Commerce Demo Class" description="Request a free Class 11 or 12 Commerce demo with Smit Sir Commerce. Choose your board, subjects and preferred learning mode." path="/book-demo" />

      <section className="page-hero">
        <div className="page-container max-w-5xl text-center">
          <span className="eyebrow">Free demo · No payment required</span>
          <h1 className="mt-5">See whether the teaching style <em>works for you.</em></h1>
          <p className="mt-5 max-w-2xl mx-auto text-lg leading-relaxed" style={{ color: 'var(--muted)' }}>Tell us what you are studying and where you need help. We will contact you to confirm a suitable demo option and answer your questions before you decide anything.</p>
        </div>
      </section>

      <main className="page-container section-padding">
        <div className="grid lg:grid-cols-[.78fr_1.22fr] gap-8 items-start">
          <aside className="space-y-4 lg:sticky lg:top-28">
            <div className="card-paper p-6">
              <Sparkles className="w-6 h-6" style={{ color: 'var(--gold)' }} />
              <h2 className="text-2xl mt-4" style={{ fontFamily: 'var(--font-serif)', color: 'var(--ink)' }}>What happens next?</h2>
              <div className="space-y-4 mt-5">
                {[
                  ['1', 'Send your study details', 'Class, board, subjects and preferred mode.'],
                  ['2', 'We contact you', 'We confirm availability and understand what you need help with.'],
                  ['3', 'Attend the demo', 'Experience the teaching approach before making a decision.'],
                ].map(([n, title, text]) => <div key={n} className="flex gap-3"><div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-black flex-shrink-0" style={{ background: 'var(--gold-bg)', color: 'var(--gold)' }}>{n}</div><div><div className="font-semibold" style={{ color: 'var(--ink)' }}>{title}</div><div className="text-sm mt-1 leading-relaxed" style={{ color: 'var(--muted)' }}>{text}</div></div></div>)}
              </div>
            </div>

            <div className="card-paper p-6">
              <div className="grid grid-cols-2 gap-3 text-sm">
                {[
                  [CheckCircle2, 'Class 11 & 12'],
                  [CalendarCheck2, 'Online + Offline'],
                  [ShieldCheck, 'No payment to request'],
                  [MessageCircle, 'WhatsApp support'],
                ].map(([Icon, text]) => <div key={text} className="tile-paper p-3"><Icon className="w-4 h-4" style={{ color: 'var(--gold)' }} /><div className="mt-2 font-semibold" style={{ color: 'var(--charcoal)' }}>{text}</div></div>)}
              </div>
            </div>
          </aside>

          <section className="card-paper p-6 sm:p-8">
            <LeadCaptureForm intent="Free Demo" heading="Request your free demo" />
          </section>
        </div>
      </main>
    </div>
  );
}
