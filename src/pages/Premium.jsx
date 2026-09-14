import { Link } from 'react-router-dom';
import { BadgeCheck, Crown, LockKeyhole, ShieldCheck, Sparkles } from 'lucide-react';
import SEO from '../components/ui/SEO';
import { useAuth } from '../context/AuthContext';

export default function Premium() {
  const { user, isPremium, isAdmin, loading } = useAuth();
  const legacyAccess = isPremium || isAdmin;

  return (
    <main className="min-h-screen" style={{ background: 'linear-gradient(180deg,#fffaf0 0%,#f8fafc 55%,#fff 100%)' }}>
      <SEO
        title="Premium Access — Smit Sir Commerce"
        description="Legacy Premium access page. New students can choose focused ₹199 Board Booster packs with preview-before-payment."
        path="/premium"
        noindex
      />

      <section className="page-container py-14 sm:py-20 max-w-5xl">
        <div className="grid lg:grid-cols-[1.05fr_.95fr] gap-7 items-start">
          <div>
            <span className="eyebrow inline-flex items-center gap-2"><Sparkles className="w-4 h-4" /> Premium access update</span>
            <h1 className="text-4xl sm:text-6xl mt-5 leading-tight" style={{ fontFamily: 'var(--font-serif)', letterSpacing: '-.04em' }}>Premium is now organised as <span style={{ color: 'var(--gold)' }}>focused Board Booster packs.</span></h1>
            <p className="text-lg mt-5 leading-8" style={{ color: 'var(--muted)' }}>The old manual ₹999 QR/UTR sales flow has been retired for new purchases. New students choose the exact board, class and subject pack they need, see the contents first, then use secure checkout after Cashfree activation.</p>

            <div className="grid sm:grid-cols-2 gap-4 mt-7">
              <div className="card-paper p-5"><ShieldCheck className="w-6 h-6" style={{ color: '#21663a' }} /><h2 className="text-lg font-black mt-3">Pack-specific access</h2><p className="text-sm mt-2 leading-6" style={{ color: 'var(--muted)' }}>A ₹199 GSEB Economics purchase unlocks that product only. It does not silently unlock unrelated packs.</p></div>
              <div className="card-paper p-5"><LockKeyhole className="w-6 h-6" style={{ color: 'var(--gold)' }} /><h2 className="text-lg font-black mt-3">Server-verified payments</h2><p className="text-sm mt-2 leading-6" style={{ color: 'var(--muted)' }}>Access is granted only after the payment provider is verified on the server. A browser success screen alone is not trusted.</p></div>
            </div>

            <div className="flex flex-wrap gap-3 mt-7"><Link to="/board-booster-packs" className="btn-primary">Browse ₹199 Board Boosters</Link><a href="/my-purchases.html" className="btn-secondary">My Purchases</a><Link to="/study-material" className="btn-secondary">Free Resources</Link></div>
          </div>

          <aside className="card-paper p-6 sm:p-7">
            <Crown className="w-9 h-9" style={{ color: 'var(--gold)' }} />
            <h2 className="text-2xl mt-4" style={{ fontFamily: 'var(--font-serif)' }}>Existing legacy Premium account</h2>
            {loading ? <p className="mt-4">Checking your account…</p> : legacyAccess ? <div className="rounded-2xl p-5 mt-5" style={{ background: '#edf9f0', border: '1px solid #bfe0c7' }}><div className="flex gap-3"><BadgeCheck className="w-7 h-7 shrink-0" style={{ color: '#21663a' }} /><div><div className="font-black" style={{ color: '#174d2a' }}>Legacy Premium is active</div><p className="text-sm mt-1 leading-6" style={{ color: '#356846' }}>Your older Premium status continues to work. You do not need to buy the new packs again for resources covered by that legacy access.</p></div></div><Link to="/premium/economics" className="btn-primary w-full mt-4 text-center">Open Economics library</Link></div> : user ? <div className="rounded-2xl p-5 mt-5" style={{ background: 'var(--gold-bg)', border: '1px solid rgba(184,135,47,.25)' }}><div className="font-black">No legacy Premium on this account</div><p className="text-sm mt-2 leading-6">That is completely fine. Use the Board Booster store for the new focused pack system.</p><Link to="/board-booster-packs" className="btn-primary w-full mt-4 text-center">Choose a pack</Link></div> : <div className="rounded-2xl p-5 mt-5" style={{ background: 'var(--gold-bg)', border: '1px solid rgba(184,135,47,.25)' }}><div className="font-black">Sign in to check legacy access</div><p className="text-sm mt-2 leading-6">If you previously had Premium, sign in with the same account.</p><Link to="/login" className="btn-primary w-full mt-4 text-center">Sign in</Link></div>}
          </aside>
        </div>
      </section>
    </main>
  );
}
