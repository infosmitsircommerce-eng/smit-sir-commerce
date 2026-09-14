import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { CheckCircle2, Clock3, Loader2, ShieldCheck, XCircle } from 'lucide-react';
import SEO from '../components/ui/SEO';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';

export default function PurchaseStatus() {
  const { user, loading } = useAuth();
  const [params] = useSearchParams();
  const orderId = params.get('order_id') || '';
  const [state, setState] = useState({ loading: true, status: 'checking', message: '', product: null, accessPath: '/my-purchases' });

  async function check() {
    if (!user || !orderId) return;
    setState((current) => ({ ...current, loading: true, message: '' }));
    try {
      const { data } = await supabase.auth.getSession();
      const token = data.session?.access_token;
      if (!token) throw new Error('Please sign in again.');
      const response = await fetch('/api/purchase-status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ orderId }),
      });
      const body = await response.json();
      if (!response.ok) throw new Error(body.error || 'Unable to verify payment.');
      setState({ loading: false, status: body.status, message: '', product: body.product, accessPath: body.accessPath || '/my-purchases' });
    } catch (error) {
      setState((current) => ({ ...current, loading: false, status: 'error', message: error.message || 'Unable to verify payment.' }));
    }
  }

  useEffect(() => {
    if (!loading && user && orderId) void check();
    else if (!loading) setState((current) => ({ ...current, loading: false }));
  }, [loading, user?.id, orderId]);

  if (loading || state.loading) {
    return <main className="page-container py-20 min-h-[65vh] flex items-center justify-center"><SEO title="Verifying Payment" description="Private payment verification page." path="/purchase-status" noindex /><div className="text-center"><Loader2 className="w-9 h-9 animate-spin mx-auto" style={{ color: 'var(--gold)' }} /><h1 className="text-2xl mt-5">Verifying your payment…</h1><p className="mt-2" style={{ color: 'var(--muted)' }}>We are checking Cashfree directly before unlocking anything.</p></div></main>;
  }

  if (!user) {
    return <main className="page-container py-16 max-w-xl"><SEO title="Payment Status" description="Private payment verification page." path="/purchase-status" noindex /><section className="card-paper p-8 text-center"><ShieldCheck className="w-10 h-10 mx-auto" style={{ color: 'var(--gold)' }} /><h1 className="text-3xl mt-4">Sign in to verify this purchase</h1><p className="mt-3">Use the same student account that started the payment.</p><Link to="/login" className="btn-primary inline-flex mt-6">Sign in</Link></section></main>;
  }

  if (!orderId) {
    return <main className="page-container py-16 max-w-xl"><SEO title="Payment Status" description="Private payment verification page." path="/purchase-status" noindex /><section className="card-paper p-8 text-center"><XCircle className="w-10 h-10 mx-auto" style={{ color: '#B4533C' }} /><h1 className="text-3xl mt-4">Order not found</h1><p className="mt-3">Open My Purchases to see your payment history.</p><Link to="/my-purchases" className="btn-primary inline-flex mt-6">My Purchases</Link></section></main>;
  }

  const paid = state.status === 'paid';
  const pending = ['created', 'pending'].includes(state.status);

  return (
    <main className="page-container py-14 max-w-2xl">
      <SEO title="Payment Status" description="Private payment verification page." path="/purchase-status" noindex />
      <section className="card-paper p-7 sm:p-9 text-center">
        {paid ? <CheckCircle2 className="w-14 h-14 mx-auto" style={{ color: '#21663a' }} /> : pending ? <Clock3 className="w-14 h-14 mx-auto" style={{ color: 'var(--gold)' }} /> : <XCircle className="w-14 h-14 mx-auto" style={{ color: '#B4533C' }} />}
        <span className="eyebrow inline-block mt-5">Secure Cashfree verification</span>
        <h1 className="text-3xl sm:text-4xl mt-3" style={{ fontFamily: 'var(--font-serif)' }}>{paid ? 'Payment verified — pack unlocked' : pending ? 'Payment is still being confirmed' : 'Payment not completed'}</h1>
        {state.product ? <p className="font-black mt-4">{state.product.name}</p> : null}
        <p className="mt-3 leading-7" style={{ color: 'var(--muted)' }}>{paid ? 'Access was granted only after server-side verification with Cashfree.' : pending ? 'Do not pay again. Use Verify again in a moment; late UPI confirmations can take a little time.' : state.message || 'No successful payment was confirmed for this order.'}</p>
        <div className="grid sm:grid-cols-2 gap-3 mt-7">
          {paid ? <Link to={state.accessPath} className="btn-primary text-center">Open purchased pack</Link> : <button onClick={() => void check()} className="btn-primary">Verify again</button>}
          <Link to="/my-purchases" className="btn-secondary text-center">My Purchases</Link>
        </div>
      </section>
    </main>
  );
}
