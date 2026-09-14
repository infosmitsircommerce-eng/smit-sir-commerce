import { Link } from 'react-router-dom';
import { BadgeCheck, BookOpenCheck, Crown, LockKeyhole, ShieldCheck, Sparkles } from 'lucide-react';
import SEO from '../components/ui/SEO';
import { useAuth } from '../context/AuthContext';

export default function Premium() {
  const { user, isPremium, isAdmin, loading } = useAuth();
  const legacyAccess = isPremium || isAdmin;

  return (
    <main className="min-h-screen" style={{ background: 'linear-gradient(180deg,#fffaf0 0%,#f8fafc 55%,#fff 100%)' }}>
      <SEO
        title="Premium Access — Smit Sir Commerce"
        description="Premium Commerce libraries and focused Board Booster packs with clear contents and protected student access."
        path="/premium"
        noindex
      />

      <section className="page-container py-14 sm:py-20 max-w-5xl">
        <div className="grid lg:grid-cols-[1.05fr_.95fr] gap-7 items-start">
          <div>
            <span className="eyebrow inline-flex items-center gap-2"><Sparkles className="w-4 h-4" /> Premium access</span>
            <h1 className="text-4xl sm:text-6xl mt-5 leading-tight" style={{ fontFamily: 'var(--font-serif)', letterSpacing: '-.04em' }}>Premium is organised around <span style={{ color: 'var(--gold)' }}>clear subject libraries and focused packs.</span></h1>
            <p className="text-lg mt-5 leading-8" style={{ color: 'var(--muted)' }}>Students should be able to see exactly what they will receive before access is unlocked. New purchases use the focused pack system and secure checkout after Cashfree activation.</p>

            <a href="/gseb-class-11-accountancy-premium.html" className="card-paper p-5 sm:p-6 mt-7 block" style={{ border: '1px solid rgba(184,135,47,.38)', background: 'linear-gradient(135deg,#fffaf0,#fff3c8)' }}>
              <div className="flex items-start gap-4"><div className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0" style={{ background: '#17284b', color: '#f4cc62' }}><BookOpenCheck className="w-6 h-6" /></div><div><span className="text-xs font-black tracking-wider" style={{ color: '#8a6012' }}>NEW PREMIUM LIBRARY</span><h2 className="text-xl sm:text-2xl font-black mt-1">GSEB Std. 11 Accountancy — Part 1</h2><p className="text-sm leading-6 mt-2" style={{ color: 'var(--muted)' }}>10 complete chapters · 718 chapter pages · 720-page master book · accounting tables · worked numericals · board practice.</p><div className="font-black mt-3" style={{ color: 'var(--gold)' }}>See exactly what is included →</div></div></div>
            </a>

            <div className="grid sm:grid-cols-2 gap-4 mt-5">
              <div className="card-paper p-5"><ShieldCheck className="w-6 h-6" style={{ color: '#21663a' }} /><h2 className="text-lg font-black mt-3">Pack-specific access</h2><p className="text-sm mt-2 leading-6" style={{ color: 'var(--muted)' }}>Focused purchases unlock only the product attached to that student account. Legacy Premium continues to work where applicable.</p></div>
              <div className="card-paper p-5"><LockKeyhole className="w-6 h-6" style={{ color: 'var(--gold)' }} /><h2 className="text-lg font-black mt-3">Server-verified access</h2><p className="text-sm mt-2 leading-6" style={{ color: 'var(--muted)' }}>Protected material is served only after the account is verified. A visible chapter card is not the same as a public PDF link.</p></div>
            </div>

            <div className="flex flex-wrap gap-3 mt-7"><Link to="/board-booster-packs" className="btn-primary">Browse Board Boosters</Link><a href="/my-purchases.html" className="btn-secondary">My Purchases</a><Link to="/study-material" className="btn-secondary">Free Resources</Link></div>
          </div>

          <aside className="card-paper p-6 sm:p-7">
            <Crown className="w-9 h-9" style={{ color: 'var(--gold)' }} />
            <h2 className="text-2xl mt-4" style={{ fontFamily: 'var(--font-serif)' }}>Existing legacy Premium account</h2>
            {loading ? <p className="mt-4">Checking your account…</p> : legacyAccess ? <div className="rounded-2xl p-5 mt-5" style={{ background: '#edf9f0', border: '1px solid #bfe0c7' }}><div className="flex gap-3"><BadgeCheck className="w-7 h-7 shrink-0" style={{ color: '#21663a' }} /><div><div className="font-black" style={{ color: '#174d2a' }}>Legacy Premium is active</div><p className="text-sm mt-1 leading-6" style={{ color: '#356846' }}>Your older Premium status continues to work for protected resources covered by legacy access.</p></div></div><a href="/gseb-class-11-accountancy-premium.html" className="btn-primary w-full mt-4 text-center">Open Accountancy Part 1</a><Link to="/premium/economics" className="btn-secondary w-full mt-3 text-center">Open Economics library</Link></div> : user ? <div className="rounded-2xl p-5 mt-5" style={{ background: 'var(--gold-bg)', border: '1px solid rgba(184,135,47,.25)' }}><div className="font-black">No legacy Premium on this account</div><p className="text-sm mt-2 leading-6">You can still inspect the complete contents of each Premium library before choosing access.</p><a href="/gseb-class-11-accountancy-premium.html" className="btn-primary w-full mt-4 text-center">Preview Accountancy Premium</a></div> : <div className="rounded-2xl p-5 mt-5" style={{ background: 'var(--gold-bg)', border: '1px solid rgba(184,135,47,.25)' }}><div className="font-black">Sign in to check access</div><p className="text-sm mt-2 leading-6">If you previously had Premium, sign in with the same account.</p><Link to="/login" className="btn-primary w-full mt-4 text-center">Sign in</Link></div>}
          </aside>
        </div>
      </section>
    </main>
  );
}
