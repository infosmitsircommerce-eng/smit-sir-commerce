import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, Clock3, CreditCard, Loader2, LockKeyhole, RefreshCw } from 'lucide-react';
import SEO from '../components/ui/SEO';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { BOARD_BOOSTER_PRODUCTS } from '../data/boardBoosterProducts';
import { PREMIUM_MEGA_PACK } from '../data/premiumMegaPack';

const products = new Map([...BOARD_BOOSTER_PRODUCTS, PREMIUM_MEGA_PACK].map((product) => [product.id, product]));

function productFor(id) {
  return products.get(id) || {
    id,
    name: id,
    shortName: id,
    accessPath: '/board-booster-packs',
    previewPath: '/board-booster-packs',
    price: 0,
  };
}

export default function MyPurchases() {
  const { user, loading, isPremium, hasMegaPremium, legacyPremium } = useAuth();
  const [entitlements, setEntitlements] = useState([]);
  const [orders, setOrders] = useState([]);
  const [busy, setBusy] = useState(false);
  const [checking, setChecking] = useState('');
  const [message, setMessage] = useState('');

  async function load() {
    if (!user) return;
    setBusy(true);
    setMessage('');
    const [entitlementResult, orderResult] = await Promise.all([
      supabase
        .from('product_entitlements')
        .select('id,product_id,granted_at,expires_at,revoked_at,source,order_id')
        .is('revoked_at', null)
        .order('granted_at', { ascending: false }),
      supabase
        .from('payment_orders')
        .select('id,product_id,provider_order_id,status,amount_paise,currency,created_at,updated_at,paid_at')
        .order('created_at', { ascending: false })
        .limit(30),
    ]);

    if (entitlementResult.error || orderResult.error) {
      setMessage('Unable to load your purchases right now. Please try again.');
    } else {
      setEntitlements(entitlementResult.data || []);
      setOrders(orderResult.data || []);
    }
    setBusy(false);
  }

  useEffect(() => { void load(); }, [user?.id]);

  async function refreshOrder(order) {
    if (!order.provider_order_id) return;
    setChecking(order.id);
    setMessage('');
    try {
      const { data } = await supabase.auth.getSession();
      const token = data.session?.access_token;
      if (!token) throw new Error('Please sign in again.');
      const response = await fetch('/api/purchase-status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ orderId: order.provider_order_id }),
      });
      const body = await response.json();
      if (!response.ok) throw new Error(body.error || 'Unable to verify payment.');
      setMessage(body.paid ? 'Payment verified. Your purchased access is unlocked.' : 'Payment has not been confirmed yet.');
      await load();
    } catch (error) {
      setMessage(error.message || 'Unable to verify payment.');
    } finally {
      setChecking('');
    }
  }

  const activeEntitlements = useMemo(
    () => entitlements.filter((item) => !item.expires_at || new Date(item.expires_at).getTime() > Date.now()),
    [entitlements],
  );

  if (loading) {
    return <main className="page-container py-16 min-h-[60vh] flex items-center justify-center"><Loader2 className="w-7 h-7 animate-spin" /></main>;
  }

  if (!user) {
    return (
      <main className="page-container py-16 max-w-xl">
        <SEO title="My Purchases" description="Private Smit Sir Commerce purchase library." path="/my-purchases" noindex />
        <section className="card-paper p-8 text-center">
          <LockKeyhole className="w-10 h-10 mx-auto" style={{ color: 'var(--gold)' }} />
          <h1 className="text-3xl mt-4">My Purchases</h1>
          <p className="mt-3 leading-7">Sign in with the student account used for payment to see unlocked Premium and Board Booster purchases.</p>
          <Link to="/login" className="btn-primary inline-flex mt-6">Sign in</Link>
        </section>
      </main>
    );
  }

  return (
    <main className="page-container py-10 sm:py-14 pb-28">
      <SEO title="My Purchases" description="Private Smit Sir Commerce purchase library." path="/my-purchases" noindex />

      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <span className="eyebrow">Private student library</span>
          <h1 className="text-4xl sm:text-5xl mt-3" style={{ fontFamily: 'var(--font-serif)' }}>My Purchases</h1>
          <p className="mt-3 max-w-2xl leading-7" style={{ color: 'var(--muted)' }}>Focused ₹199 purchases unlock only the matching subject pack. The ₹999 Complete Commerce purchase unlocks the full current Premium ecosystem.</p>
        </div>
        <button onClick={() => void load()} disabled={busy} className="btn-secondary inline-flex items-center justify-center gap-2"><RefreshCw className={`w-4 h-4 ${busy ? 'animate-spin' : ''}`} /> Refresh</button>
      </div>

      {hasMegaPremium ? (
        <div className="card-paper p-5 mt-7" style={{ borderColor: 'rgba(184,135,47,.35)', background: 'linear-gradient(135deg,#fffaf0,#fff3c8)' }}>
          <div className="flex gap-3"><CheckCircle2 className="w-6 h-6 shrink-0" style={{ color: '#21663a' }} /><div><div className="font-black">Complete Commerce is active</div><p className="text-sm mt-1 leading-6" style={{ color: 'var(--muted)' }}>Your ₹999 full-access purchase unlocks the current Premium libraries, protected PDFs and Premium-gated practice tools.</p><Link to="/premium" className="font-black inline-flex mt-2" style={{ color: 'var(--gold)' }}>Open Premium home →</Link></div></div>
        </div>
      ) : legacyPremium || isPremium ? (
        <div className="card-paper p-5 mt-7" style={{ borderColor: 'rgba(184,135,47,.35)' }}>
          <div className="flex gap-3"><CheckCircle2 className="w-6 h-6 shrink-0" style={{ color: '#21663a' }} /><div><div className="font-black">Legacy full-library Premium is active</div><p className="text-sm mt-1 leading-6" style={{ color: 'var(--muted)' }}>Your older Premium status continues to work. New focused purchases are tracked separately by product.</p></div></div>
        </div>
      ) : null}

      {message ? <p role="status" className="card-paper p-4 mt-5 text-sm font-semibold">{message}</p> : null}

      <section className="mt-8">
        <h2 className="text-2xl font-black">Unlocked purchases</h2>
        {busy && !activeEntitlements.length ? <div className="mt-5 flex items-center gap-2"><Loader2 className="w-5 h-5 animate-spin" /> Loading purchases…</div> : null}
        {!busy && !activeEntitlements.length ? (
          <div className="card-paper p-7 mt-5 text-center">
            <CreditCard className="w-8 h-8 mx-auto" style={{ color: 'var(--gold)' }} />
            <h3 className="text-xl font-black mt-3">No tracked purchase yet</h3>
            <p className="mt-2" style={{ color: 'var(--muted)' }}>Choose full Mega Premium access or preview a focused subject pack first.</p>
            <div className="flex flex-wrap justify-center gap-3 mt-5"><Link to="/premium" className="btn-primary">See ₹999 Complete Commerce</Link><Link to="/board-booster-packs" className="btn-secondary">Browse ₹199 packs</Link></div>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4 mt-5">
            {activeEntitlements.map((item) => {
              const product = productFor(item.product_id);
              const isMega = product.id === PREMIUM_MEGA_PACK.id;
              return (
                <article key={item.id} className="card-paper p-6 flex flex-col" style={isMega ? { borderColor: 'rgba(184,135,47,.45)', background: 'linear-gradient(180deg,#fffaf0,#fff)' } : undefined}>
                  <div className="flex items-center justify-between gap-3"><span className="eyebrow">{isMega ? 'Full Premium' : 'Unlocked'}</span><CheckCircle2 className="w-6 h-6" style={{ color: '#21663a' }} /></div>
                  <h3 className="text-xl font-black mt-4">{product.name}</h3>
                  <p className="text-sm mt-2" style={{ color: 'var(--muted)' }}>Purchased access · {new Date(item.granted_at).toLocaleDateString('en-IN')}</p>
                  <Link to={product.accessPath} className="btn-primary w-full mt-6 text-center">{isMega ? 'Open Premium home' : 'Open purchased pack'}</Link>
                  <Link to={isMega ? '/premium' : `/board-booster-packs?pack=${product.id}`} className="btn-secondary w-full mt-2 text-center">{isMega ? 'See everything included' : 'See pack contents'}</Link>
                </article>
              );
            })}
          </div>
        )}
      </section>

      <section className="mt-10">
        <h2 className="text-2xl font-black">Payment history</h2>
        {!orders.length && !busy ? <p className="mt-3" style={{ color: 'var(--muted)' }}>No online payment orders yet.</p> : null}
        <div className="space-y-3 mt-5">
          {orders.map((order) => {
            const product = productFor(order.product_id);
            const paid = order.status === 'paid';
            return (
              <article key={order.id} className="card-paper p-5 flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="flex-1 min-w-0">
                  <div className="font-black">{product.shortName}</div>
                  <div className="text-sm mt-1" style={{ color: 'var(--muted)' }}>₹{(order.amount_paise / 100).toFixed(0)} · {new Date(order.created_at).toLocaleString('en-IN')}</div>
                  <div className="text-xs mt-2 font-black uppercase tracking-wider" style={{ color: paid ? '#21663a' : 'var(--gold)' }}>{order.status}</div>
                </div>
                {paid ? <CheckCircle2 className="w-6 h-6" style={{ color: '#21663a' }} /> : (
                  <button onClick={() => void refreshOrder(order)} disabled={checking === order.id} className="btn-secondary inline-flex items-center justify-center gap-2">
                    {checking === order.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Clock3 className="w-4 h-4" />} Verify payment
                  </button>
                )}
              </article>
            );
          })}
        </div>
      </section>
    </main>
  );
}
