import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';

export default function PremiumConversionAnalytics() {
  const [metrics, setMetrics] = useState(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  async function refresh() {
    setBusy(true); setError('');
    try {
      const { data, error: failure } = await supabase.rpc('get_premium_conversion_metrics', {
        p_since: new Date(Date.now() - 30 * 86400000).toISOString(),
      });
      if (failure) throw failure;
      setMetrics(data);
    } catch { setMetrics(null); setError('Could not load conversion totals. Please retry.'); }
    finally { setBusy(false); }
  }
  useEffect(() => { void refresh(); }, []);
  return <section className="card-premium mb-6">
    <div className="flex flex-wrap justify-between gap-3"><h2 className="text-xl font-bold text-white">Notes & Premium · last 30 days</h2><button className="btn-secondary" disabled={busy} onClick={refresh}>{busy ? 'Loading…' : 'Refresh totals'}</button></div>
    <p className="text-sm text-navy-300 mt-3">QR opens and references are interest, not payments. Activations and revenue come only from manually verified payment records.</p>
    {error && <p role="alert" className="text-red-300 mt-4">{error}</p>}
    {metrics && <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-5">{[
      ['QR opens', metrics.qr_opens], ['QR downloads', metrics.qr_downloads],
      ['PDF download clicks', metrics.pdf_download_clicks], ['References submitted', metrics.reference_submissions],
      ['Verified Premium activations', metrics.verified_activations],
      ['Verified revenue', `₹${Number(metrics.verified_revenue_inr).toLocaleString('en-IN')}`],
    ].map(([label, value]) => <div key={label} className="rounded-xl bg-white/5 p-4"><div className="text-2xl font-bold text-white">{value}</div><div className="text-sm text-navy-300 mt-1">{label}</div></div>)}</div>}
    <p className="text-xs text-navy-400 mt-4">Interaction tracking started 12 September 2026. These are event counts, not unique students. PDF clicks do not confirm a completed download. Verified payments include earlier records within the selected 30 days.</p>
  </section>;
}
