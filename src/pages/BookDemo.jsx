import { useState } from 'react';
import { CalendarCheck2, CheckCircle2, FileSearch, ShieldCheck, Sparkles, Target } from 'lucide-react';
import SEO from '../components/ui/SEO';
import LeadCaptureForm from '../components/leads/LeadCaptureForm';
import DemoSlotPicker from '../components/leads/DemoSlotPicker';

export default function BookDemo() {
  const [selectedSlot, setSelectedSlot] = useState(null);

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-ivory)' }}>
      <SEO
        title="Free Commerce Paper Analysis & Demo in Mehsana"
        description="Class 11 and 12 Commerce students in Mehsana can get a free test-paper analysis, weak-topic plan and demo class with Smit Sir Commerce. Economics, Business Studies, Entrepreneurship and Physical Education."
        path="/book-demo"
      />

      <section className="page-hero">
        <div className="page-container max-w-5xl text-center">
          <span className="eyebrow">Mehsana · Class 11 &amp; 12 · No admission pressure</span>
          <h1 className="mt-5">Bring your latest paper. <em>Find out where the marks are going.</em></h1>
          <p className="mt-5 max-w-3xl mx-auto text-lg leading-relaxed" style={{ color: 'var(--muted)' }}>
            Already enrolled in another tuition? That is completely fine. Start with a free academic analysis and demo. The goal is to understand your weak areas first — not to pressure you into changing classes.
          </p>
          <div className="flex flex-wrap justify-center gap-2 mt-6 text-sm" style={{ color: 'var(--muted)' }}>
            {['Economics', 'Business Studies', 'Entrepreneurship', 'Physical Education'].map((subject) => (
              <span key={subject} className="tile-paper px-3 py-2">{subject}</span>
            ))}
          </div>
        </div>
      </section>

      <main className="page-container section-padding">
        <div className="grid lg:grid-cols-[.78fr_1.22fr] gap-8 items-start">
          <aside className="space-y-4 lg:sticky lg:top-28">
            <div className="card-paper p-6">
              <FileSearch className="w-6 h-6" style={{ color: 'var(--gold)' }} />
              <h2 className="text-2xl mt-4" style={{ fontFamily: 'var(--font-serif)', color: 'var(--ink)' }}>Your free starting point</h2>
              <div className="space-y-4 mt-5">
                {[
                  ['1', 'Tell me the weak subject', 'Share your class, board and the subject or chapter that is troubling you.'],
                  ['2', 'Bring your latest test paper', 'If you have one, bring it to the demo so we can identify the exact mistakes and lost marks.'],
                  ['3', 'Get a focused next-step plan', 'You leave knowing what to fix first, which topics need attention and how I would approach the improvement.'],
                ].map(([n, title, text]) => <div key={n} className="flex gap-3"><div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-black flex-shrink-0" style={{ background: 'var(--gold-bg)', color: 'var(--gold)' }}>{n}</div><div><div className="font-semibold" style={{ color: 'var(--ink)' }}>{title}</div><div className="text-sm mt-1 leading-relaxed" style={{ color: 'var(--muted)' }}>{text}</div></div></div>)}
              </div>
            </div>

            <div className="card-paper p-6">
              <div className="grid grid-cols-2 gap-3 text-sm">
                {[
                  [CheckCircle2, 'Class 11 & 12'],
                  [CalendarCheck2, 'Online + Offline'],
                  [ShieldCheck, 'No payment to book'],
                  [Target, 'Focused follow-up'],
                ].map(([Icon, text]) => <div key={text} className="tile-paper p-3"><Icon className="w-4 h-4" style={{ color: 'var(--gold)' }} /><div className="mt-2 font-semibold" style={{ color: 'var(--charcoal)' }}>{text}</div></div>)}
              </div>
            </div>

            <div className="card-paper p-6" style={{ border: '1px solid rgba(184,135,47,.28)' }}>
              <ShieldCheck className="w-6 h-6" style={{ color: 'var(--gold)' }} />
              <span className="eyebrow mt-4 inline-block">My teaching commitment</span>
              <h2 className="text-2xl mt-2" style={{ fontFamily: 'var(--font-serif)', color: 'var(--ink)' }}>I make this promise because I trust my teaching.</h2>
              <p className="text-sm leading-7 mt-3" style={{ color: 'var(--muted)' }}>
                If an enrolled student regularly attends, completes the required work and tests, follows the agreed study plan, and still fails the subject taught by me, the tuition fee for that subject is refunded according to the written eligibility terms shared before enrolment.
              </p>
              <div className="tile-paper p-3 mt-4 text-xs leading-6" style={{ color: 'var(--muted)' }}>
                This is not a marks guarantee. It is a commitment for students who sincerely follow the complete academic system.
              </div>
            </div>
          </aside>

          <div className="space-y-5">
            <section className="card-paper p-6 sm:p-8">
              <div className="flex items-start gap-3 mb-5">
                <Target className="w-5 h-5 mt-1" style={{ color: 'var(--gold)' }} />
                <div>
                  <h2 className="text-2xl" style={{ fontFamily: 'var(--font-serif)', color: 'var(--ink)' }}>Choose a demo time</h2>
                  <p className="text-sm mt-1 leading-relaxed" style={{ color: 'var(--muted)' }}>If a suitable published slot is available, reserve it. Otherwise submit the form below and I can contact you to arrange another option.</p>
                </div>
              </div>
              <DemoSlotPicker selectedId={selectedSlot?.id || null} onSelect={setSelectedSlot} />
            </section>
            <section className="card-paper p-6 sm:p-8">
              <LeadCaptureForm intent="Free Demo" heading={selectedSlot ? 'Reserve your free analysis + demo' : 'Request your free analysis + demo'} demoSlot={selectedSlot} />
            </section>
          </div>
        </div>

        <section className="card-paper p-6 sm:p-8 mt-8 text-center">
          <Sparkles className="w-7 h-7 mx-auto" style={{ color: 'var(--gold)' }} />
          <h2 className="text-2xl sm:text-3xl mt-3" style={{ fontFamily: 'var(--font-serif)', color: 'var(--ink)' }}>You do not have to switch tuition to ask for help.</h2>
          <p className="mt-3 max-w-2xl mx-auto leading-7" style={{ color: 'var(--muted)' }}>First understand the teaching approach and your own weak areas. Then decide what is best for you.</p>
        </section>
      </main>
    </div>
  );
}
