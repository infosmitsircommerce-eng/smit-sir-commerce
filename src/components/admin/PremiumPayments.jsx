import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';

export default function PremiumPayments({ students, onVerified }) {
 const [studentId,setStudentId]=useState('');
 const [reference,setReference]=useState('');
 const [confirmed,setConfirmed]=useState(false);
 const [busy,setBusy]=useState(false);
 const [message,setMessage]=useState('');
 const [records,setRecords]=useState([]);
 async function refresh(){
  const {data,error}=await supabase.from('premium_payment_register').select('id,student_id,transaction_reference,amount_inr,verified_at').order('verified_at',{ascending:false}).limit(100);
  if(error)setMessage('Payment history could not load: '+error.message);else setRecords(data||[]);
 }
 useEffect(()=>{refresh();},[]);
 async function submit(event){
  event.preventDefault();if(busy||!confirmed)return;
  setBusy(true);setMessage('');
  try{
   const {error}=await supabase.rpc('record_verified_quiz_payment',{p_student_id:studentId,p_reference:reference.trim()});
   if(error)throw error;
   setMessage('Verified payment recorded. Lifetime Premium is active for this account.');
   setReference('');setConfirmed(false);await refresh();await onVerified();
  }catch(error){setMessage(error.code==='23505'?'This transaction reference is already recorded. Check the existing payment before proceeding.':error.message||'Could not save payment. Check the payment history before retrying.');}
  finally{setBusy(false);}
 }
 return <section className="card-paper p-6 mt-6"><h2 className="text-2xl">Premium payment register</h2><p className="mt-3 text-sm leading-6">Record a ₹999 payment only after checking receipt in your bank or payment app. Saving records the reference and grants lifetime Premium together. Student screenshots alone are not payment confirmation.</p>
 <form onSubmit={submit} className="grid gap-4 mt-5 max-w-2xl">
 <label className="text-sm font-semibold">Student account<select required value={studentId} onChange={e=>setStudentId(e.target.value)} className="w-full border rounded-lg p-3 mt-2"><option value="">Select the registered account</option>{students.map(s=><option key={s.id} value={s.id}>{s.email||s.id} — {s.full_name||'Student'}</option>)}</select></label>
 <label className="text-sm font-semibold">Verified transaction reference<input required minLength={6} maxLength={80} pattern="[A-Za-z0-9/\-]{6,80}" value={reference} onChange={e=>setReference(e.target.value)} className="w-full border rounded-lg p-3 mt-2" placeholder="UPI transaction reference" /></label>
 <label className="flex gap-3 text-sm leading-6"><input type="checkbox" checked={confirmed} onChange={e=>setConfirmed(e.target.checked)} required />I checked that ₹999 was received and selected the correct student account.</label>
 <button type="submit" disabled={busy||!confirmed||!studentId} className="btn-primary disabled:opacity-50">{busy?'Saving…':'Record payment and activate lifetime Premium'}</button>
 </form><p role="status" className="mt-4 text-sm">{message}</p>
 <h3 className="font-bold mt-6">Latest verified payments</h3>{records.length===0?<p className="mt-3 text-sm">No verified payments recorded here yet.</p>:<div className="overflow-x-auto mt-3"><table className="w-full text-sm text-left"><thead><tr><th className="p-2">Student</th><th className="p-2">Reference</th><th className="p-2">Amount</th><th className="p-2">Verified</th></tr></thead><tbody>{records.map(r=><tr key={r.id}><td className="p-2">{students.find(s=>s.id===r.student_id)?.email||r.student_id}</td><td className="p-2">{r.transaction_reference}</td><td className="p-2">₹{r.amount_inr}</td><td className="p-2">{new Date(r.verified_at).toLocaleString('en-IN')}</td></tr>)}</tbody></table></div>}
 </section>;
}
