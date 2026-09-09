import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';

export default function PremiumPayments({ students, onVerified }) {
  const [studentId, setStudentId] = useState('');
  const [reference, setReference] = useState('');
  const [confirmed, setConfirmed] = useState(false);
  const [busy, setBusy] = useState('');
  const [message, setMessage] = useState('');
  const [records, setRecords] = useState([]);
  const [claims, setClaims] = useState([]);

  async function refresh() {
    const [payments, submitted] = await Promise.all([
      supabase.from('premium_payment_register').select('id,student_id,transaction_reference,amount_inr,verified_at').order('verified_at', { ascending: false }).limit(100),
      supabase.from('premium_payment_claims').select('id,student_id,transaction_reference,amount_inr,status,submitted_at').order('submitted_at', { ascending: false }).limit(100),
    ]);
    const error = payments.error || submitted.error;
    if (error) setMessage('Payment records could not load: ' + error.message);
    else { setRecords(payments.data || []); setClaims(submitted.data || []); }
  }
  useEffect(() => { refresh(); }, []);

  async function recordManual(event) {
    event.preventDefault();
    if (busy || !confirmed) return;
    setBusy('manual'); setMessage('');
    const { error } = await supabase.rpc('record_verified_quiz_payment', { p_student_id: studentId, p_reference: reference.trim() });
    if (error) setMessage(error.code === '23505' ? 'This transaction reference is already recorded.' : error.message);
    else {
      setMessage('Verified payment recorded. Lifetime Premium is active.');
      setReference(''); setConfirmed(false);
      await refresh(); await onVerified();
    }
    setBusy('');
  }

  async function review(claim, approve) {
    if (busy) return;
    if (approve && !window.confirm('Confirm ₹999 was received for this exact reference?')) return;
    setBusy(claim.id); setMessage('');
    const { error } = await supabase.rpc('review_premium_payment_claim', { p_claim_id: claim.id, p_approve: approve });
    if (error) setMessage(error.message);
    else {
      setMessage(approve ? 'Payment verified and lifetime Premium activated.' : 'Payment claim rejected without activating access.');
      await refresh();
      if (approve) await onVerified();
    }
    setBusy('');
  }

  const studentName = (id) => {
    const student = students.find((item) => item.id === id);
    return student?.email || student?.full_name || id;
  };
  const pending = claims.filter((claim) => claim.status === 'pending');

  return <section className="card-paper p-6 mt-6">
    <h2 className="text-2xl">Premium payment register</h2>
    <p className="mt-3 text-sm leading-6">Approve only after checking that ₹999 reached your bank or payment app. Approval records the reference and grants lifetime Premium together.</p>
    <p role="status" className="mt-4 text-sm font-semibold">{message}</p>
    <h3 className="font-bold text-xl mt-6">Pending submissions ({pending.length})</h3>
    {pending.length === 0 ? <p className="mt-3 text-sm">No payment references are waiting for review.</p> : <div className="overflow-x-auto mt-3"><table className="w-full text-sm text-left"><thead><tr><th className="p-2">Student</th><th className="p-2">Reference</th><th className="p-2">Amount</th><th className="p-2">Submitted</th><th className="p-2">Action</th></tr></thead><tbody>{pending.map((claim) => <tr key={claim.id}><td className="p-2">{studentName(claim.student_id)}</td><td className="p-2 font-semibold">{claim.transaction_reference}</td><td className="p-2">₹{claim.amount_inr}</td><td className="p-2">{new Date(claim.submitted_at).toLocaleString('en-IN')}</td><td className="p-2"><div className="flex gap-2"><button disabled={Boolean(busy)} onClick={() => review(claim, true)} className="btn-primary">{busy === claim.id ? 'Saving…' : 'Verify & activate'}</button><button disabled={Boolean(busy)} onClick={() => review(claim, false)} className="btn-secondary">Reject</button></div></td></tr>)}</tbody></table></div>}
    <details className="mt-7 tile-paper p-4"><summary className="cursor-pointer font-bold">Record a verified payment manually</summary><form onSubmit={recordManual} className="grid gap-4 mt-5 max-w-2xl">
      <label className="text-sm font-semibold">Student account<select required value={studentId} onChange={(event) => setStudentId(event.target.value)} className="w-full border rounded-lg p-3 mt-2"><option value="">Select the registered account</option>{students.map((student) => <option key={student.id} value={student.id}>{student.email || student.id} — {student.full_name || 'Student'}</option>)}</select></label>
      <label className="text-sm font-semibold">Verified transaction reference<input required minLength={6} maxLength={80} pattern="[A-Za-z0-9/\\-]{6,80}" value={reference} onChange={(event) => setReference(event.target.value)} className="w-full border rounded-lg p-3 mt-2" /></label>
      <label className="flex gap-3 text-sm leading-6"><input type="checkbox" checked={confirmed} onChange={(event) => setConfirmed(event.target.checked)} required />I checked that ₹999 was received and selected the correct account.</label>
      <button type="submit" disabled={Boolean(busy) || !confirmed || !studentId} className="btn-primary disabled:opacity-50">{busy === 'manual' ? 'Saving…' : 'Record and activate'}</button>
    </form></details>
    <h3 className="font-bold mt-7">Latest verified payments</h3>
    {records.length === 0 ? <p className="mt-3 text-sm">No verified payments recorded yet.</p> : <div className="overflow-x-auto mt-3"><table className="w-full text-sm text-left"><thead><tr><th className="p-2">Student</th><th className="p-2">Reference</th><th className="p-2">Amount</th><th className="p-2">Verified</th></tr></thead><tbody>{records.map((record) => <tr key={record.id}><td className="p-2">{studentName(record.student_id)}</td><td className="p-2">{record.transaction_reference}</td><td className="p-2">₹{record.amount_inr}</td><td className="p-2">{new Date(record.verified_at).toLocaleString('en-IN')}</td></tr>)}</tbody></table></div>}
  </section>;
}
