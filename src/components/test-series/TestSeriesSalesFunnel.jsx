import { Link } from 'react-router-dom';
import {
  ArrowRight, BadgeCheck, BarChart3, BookOpenCheck, CheckCircle2,
  Crown, FileCheck2, Flame, LockKeyhole, MessageCircle, ShieldCheck,
  Sparkles, Target, Timer, Trophy
} from 'lucide-react';

const WHATSAPP_URL = 'https://wa.me/916353709585?text=Hi%20Smit%20Sir%2C%20I%20want%20details%20about%20the%20CBSE%20Commerce%20Test%20Series.';

const benefits = [
  { icon: Timer, title: 'Timed exam practice', text: 'Practise under pressure instead of only reading notes.' },
  { icon: FileCheck2, title: 'Instant checking', text: 'Get your score, correct answers and explanations immediately.' },
  { icon: BarChart3, title: 'Progress analytics', text: 'Track attempts, best score and average performance over time.' },
  { icon: Target, title: 'Weak-topic insights', text: 'Use Daily 10, Mistake Book and Study Coach to decide what to revise next.' },
  { icon: Trophy, title: 'Leaderboard support', text: 'Logged-in students can compare performance when shared leaderboard sync is enabled.' },
  { icon: BookOpenCheck, title: 'Commerce focused', text: 'Accountancy, Economics and Business Studies practice in one place.' },
];

const plans = [
  {
    name: 'Free Starter',
    price: '₹0',
    note: 'Start before you buy',
    badge: 'TRY FIRST',
    featured: false,
    items: ['Free playable tests', 'Instant score', 'Answer explanations', 'Daily 10 practice', 'Mistake Book'],
    action: '#test-library',
    actionLabel: 'Try a free test',
  },
  {
    name: 'Pro Test Pass',
    price: 'Ask for current price',
    note: 'For serious exam practice',
    badge: 'MOST COMPLETE',
    featured: true,
    items: ['Unlock Pro-labelled tests', 'Saved test progress', 'Attempt history', 'Weak-topic workflow', 'Leaderboard support'],
    action: WHATSAPP_URL,
    actionLabel: 'Get Pro details',
  },
  {
    name: 'Coaching + Test Support',
    price: 'Enquire',
    note: 'For students who want guidance too',
    badge: 'GUIDED',
    featured: false,
    items: ['Test-series access guidance', 'Study-material support', 'Personal doubt support', 'Online/offline batch options', 'Revision planning'],
    action: '/contact',
    actionLabel: 'Talk to Smit Sir',
  },
];

const faqs = [
  ['Can I try the test series before paying?', 'Yes. Free-labelled tests are available so you can check the experience before asking for Pro access.'],
  ['What happens after I get Pro access?', 'Your student profile can be marked Premium, which unlocks Pro-labelled tests in the test-series page.'],
  ['Does the site show solutions?', 'Yes. Completed tests show the correct answer and a short explanation for every question.'],
  ['Will my score be saved?', 'The site keeps device-based progress. Logged-in students can also sync attempts to the shared database once the test-attempts table is enabled.'],
  ['Is payment automatic on the website?', 'Not yet. Current price, payment method, access duration and any applicable refund terms should be confirmed before payment through the contact or WhatsApp flow.'],
  ['Is the mastery score an official school grade?', 'No. It is a study estimate based on practice activity and is meant to help students decide what to revise next.'],
];

function CTA({ plan }) {
  const className = plan.featured ? 'btn-primary' : 'btn-secondary';
  if (plan.action.startsWith('http')) {
    return <a href={plan.action} target="_blank" rel="noopener noreferrer" className={`${className} w-full inline-flex items-center justify-center gap-2`}>{plan.actionLabel}<ArrowRight className="w-4 h-4" /></a>;
  }
  if (plan.action.startsWith('#')) {
    return <a href={plan.action} className={`${className} w-full inline-flex items-center justify-center gap-2`}>{plan.actionLabel}<ArrowRight className="w-4 h-4" /></a>;
  }
  return <Link to={plan.action} className={`${className} w-full inline-flex items-center justify-center gap-2`}>{plan.actionLabel}<ArrowRight className="w-4 h-4" /></Link>;
}

export default function TestSeriesSalesFunnel() {
  return (
    <>
      <section className="page-container section-padding" id="test-series-access">
        <div className="max-w-3xl mx-auto text-center">
          <span className="eyebrow">From practice to exam confidence</span>
          <h2 className="text-3xl sm:text-4xl mt-4" style={{ fontFamily: 'var(--font-serif)', color: 'var(--ink)' }}>Stop guessing whether you are prepared.</h2>
          <p className="mt-4 text-base sm:text-lg" style={{ color: 'var(--muted)' }}>Use free tests first. When you need deeper practice, unlock Pro tests and combine them with saved progress, Daily 10, Mistake Book and your personalized Study Coach.</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-9">
          {plans.map((plan) => (
            <article key={plan.name} className="card-paper p-6 relative overflow-hidden flex flex-col" style={plan.featured ? { border: '1px solid rgba(184,135,47,.5)', boxShadow: '0 20px 60px rgba(80,55,15,.10)' } : undefined}>
              {plan.featured && <div className="absolute left-0 right-0 top-0 h-1" style={{ background: 'linear-gradient(90deg,var(--gold),#e7c66c)' }} />}
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-bold tracking-wider" style={{ color: 'var(--gold)' }}>{plan.badge}</span>
                {plan.featured ? <Crown className="w-5 h-5" style={{ color: 'var(--gold)' }} /> : <ShieldCheck className="w-5 h-5" style={{ color: 'var(--muted)' }} />}
              </div>
              <h3 className="text-2xl mt-4" style={{ fontFamily: 'var(--font-serif)', color: 'var(--ink)' }}>{plan.name}</h3>
              <div className="text-2xl font-bold mt-3" style={{ color: plan.featured ? 'var(--gold)' : 'var(--ink)' }}>{plan.price}</div>
              <p className="text-sm mt-1" style={{ color: 'var(--muted)' }}>{plan.note}</p>
              <div className="space-y-3 my-6 flex-1">
                {plan.items.map((item) => <div key={item} className="flex items-start gap-2 text-sm"><CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: 'var(--green)' }} /><span style={{ color: 'var(--charcoal)' }}>{item}</span></div>)}
              </div>
              <CTA plan={plan} />
            </article>
          ))}
        </div>

        <div className="rounded-2xl p-4 sm:p-5 mt-5 flex items-start gap-3" style={{ background: 'var(--gold-bg)', border: '1px solid rgba(184,135,47,.24)' }}>
          <LockKeyhole className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: 'var(--gold)' }} />
          <p className="text-sm leading-relaxed" style={{ color: 'var(--charcoal)' }}><strong>Clear purchase rule:</strong> the website does not invent a price or pretend payment is automated. Students should confirm the current price, access period, payment method and refund/access terms before paying.</p>
        </div>
      </section>

      <section className="page-container pb-14">
        <div className="card-paper p-6 sm:p-8">
          <div className="grid lg:grid-cols-[.85fr_1.15fr] gap-8 items-start">
            <div>
              <span className="eyebrow">What you actually get</span>
              <h2 className="text-3xl mt-4" style={{ fontFamily: 'var(--font-serif)', color: 'var(--ink)' }}>A practice system, not a PDF bundle.</h2>
              <p className="mt-3 text-sm leading-relaxed" style={{ color: 'var(--muted)' }}>The goal is simple: attempt → find mistakes → revise weak areas → attempt again → watch your score improve.</p>
              <div className="mt-6 rounded-2xl p-5" style={{ background: 'var(--ink)', color: '#fff' }}>
                <div className="flex items-center gap-2 text-sm font-bold"><Flame className="w-4 h-4" style={{ color: '#e7c66c' }} /> Recommended student loop</div>
                <div className="text-sm mt-3 leading-7" style={{ color: 'rgba(255,255,255,.78)' }}>Daily 10 → Mistake Book → Study Coach → Test Series → Progress Dashboard → repeat.</div>
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              {benefits.map(({ icon: Icon, title, text }) => <div key={title} className="tile-paper p-4"><div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'var(--gold-bg)', color: 'var(--gold)' }}><Icon className="w-5 h-5" /></div><h3 className="font-bold mt-3" style={{ color: 'var(--ink)' }}>{title}</h3><p className="text-sm mt-1 leading-relaxed" style={{ color: 'var(--muted)' }}>{text}</p></div>)}
            </div>
          </div>
        </div>
      </section>

      <section className="page-container pb-16">
        <div className="grid lg:grid-cols-[1fr_.8fr] gap-6">
          <div className="card-paper p-6 sm:p-8">
            <span className="eyebrow">Before you unlock</span>
            <h2 className="text-3xl mt-4" style={{ fontFamily: 'var(--font-serif)', color: 'var(--ink)' }}>Questions students usually ask</h2>
            <div className="divide-y mt-6" style={{ borderColor: 'var(--border)' }}>
              {faqs.map(([question, answer]) => <details key={question} className="py-4 group"><summary className="cursor-pointer font-semibold list-none flex items-center justify-between gap-4" style={{ color: 'var(--ink)' }}>{question}<span style={{ color: 'var(--gold)' }}>+</span></summary><p className="text-sm leading-relaxed mt-3" style={{ color: 'var(--muted)' }}>{answer}</p></details>)}
            </div>
          </div>

          <aside className="card-paper p-6 sm:p-8 h-fit lg:sticky lg:top-24">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: 'var(--gold-bg)', color: 'var(--gold)' }}><Sparkles className="w-6 h-6" /></div>
            <span className="eyebrow mt-5 inline-block">Ready for the next level?</span>
            <h2 className="text-3xl mt-3" style={{ fontFamily: 'var(--font-serif)', color: 'var(--ink)' }}>Try free first. Upgrade only when you need more.</h2>
            <div className="space-y-3 mt-6 text-sm">
              {['No forced purchase to try the platform', 'Pro tests visibly marked before opening', 'Current price confirmed before payment', 'Access tied to the student profile'].map(item => <div key={item} className="flex gap-2"><BadgeCheck className="w-4 h-4 mt-0.5" style={{ color: 'var(--green)' }} /><span style={{ color: 'var(--charcoal)' }}>{item}</span></div>)}
            </div>
            <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="btn-primary w-full mt-7 inline-flex items-center justify-center gap-2"><MessageCircle className="w-4 h-4" /> Ask about Pro access</a>
            <Link to="/contact" className="btn-secondary w-full mt-3 inline-flex items-center justify-center gap-2">View all contact options</Link>
          </aside>
        </div>
      </section>

      <div className="fixed left-3 right-3 bottom-20 z-30 lg:hidden rounded-2xl p-3 flex items-center gap-3 shadow-2xl" style={{ background: 'var(--ink)', border: '1px solid rgba(231,198,108,.28)' }}>
        <div className="min-w-0 flex-1"><div className="text-xs font-bold" style={{ color: '#e7c66c' }}>PRO TEST SERIES</div><div className="text-xs truncate" style={{ color: 'rgba(255,255,255,.72)' }}>Try free first · unlock more when ready</div></div>
        <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="px-4 py-2 rounded-xl text-sm font-bold flex-shrink-0" style={{ background: '#e7c66c', color: '#2b2115' }}>Get access</a>
      </div>
    </>
  );
}
