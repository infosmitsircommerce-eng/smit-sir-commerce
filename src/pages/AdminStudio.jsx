import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Activity, AlertCircle, BarChart3, CheckCircle2, Database, FileJson, Loader2, Plus, Save, ShieldCheck, Trash2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import SEO from '../components/ui/SEO';
import AdminCommerceResources from '../components/admin/AdminCommerceResources';

const emptyQuestion = () => ({ question: '', topic: '', options: ['', '', '', ''], answer: 0, explanation: '' });
const emptyTest = () => ({ name: '', slug: '', subject: 'Economics', classLevel: 12, chapter: '', minutes: 20, difficulty: 'Medium', isFree: true, board: 'CBSE', questions: [emptyQuestion()] });

function slugify(text) {
  return String(text || '').toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 90);
}

export default function AdminStudio() {
  const { user, isAdmin, loading } = useAuth();
  const [tab, setTab] = useState('content');
  const [form, setForm] = useState(emptyTest);
  const [items, setItems] = useState([]);
  const [events, setEvents] = useState([]);
  const [database, setDatabase] = useState({ content_items: 'checking', learning_events: 'checking', student_learning_state: 'checking', test_attempts: 'checking' });
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');

  const refresh = async () => {
    if (!isAdmin) return;
    const checks = await Promise.all([
      supabase.from('content_items').select('id', { count: 'exact', head: true }),
      supabase.from('learning_events').select('id', { count: 'exact', head: true }),
      supabase.from('student_learning_state').select('user_id', { count: 'exact', head: true }),
      supabase.from('test_attempts').select('id', { count: 'exact', head: true }),
    ]);
    setDatabase({
      content_items: checks[0].error ? 'missing' : 'ready',
      learning_events: checks[1].error ? 'missing' : 'ready',
      student_learning_state: checks[2].error ? 'missing' : 'ready',
      test_attempts: checks[3].error ? 'missing' : 'ready',
    });
    if (!checks[0].error) {
      const rows = await supabase.from('content_items').select('id,slug,type,status,payload,updated_at').eq('type', 'test').order('updated_at', { ascending: false }).limit(100);
      setItems(rows.data || []);
    }
    if (!checks[1].error) {
      const rows = await supabase.from('learning_events').select('event_name,path,metadata,created_at').order('created_at', { ascending: false }).limit(1000);
      setEvents(rows.data || []);
    }
  };

  useEffect(() => { refresh(); }, [isAdmin]);

  const analytics = useMemo(() => {
    const eventCounts = new Map();
    const pageCounts = new Map();
    let examStarts = 0; let examCompletes = 0;
    events.forEach((event) => {
      eventCounts.set(event.event_name, (eventCounts.get(event.event_name) || 0) + 1);
      if (event.event_name === 'page_view') pageCounts.set(event.path, (pageCounts.get(event.path) || 0) + 1);
      if (event.event_name === 'exam_start') examStarts += 1;
      if (event.event_name === 'exam_complete') examCompletes += 1;
    });
    return {
      total: events.length,
      examStarts,
      examCompletes,
      examCompletionRate: examStarts ? Math.round((examCompletes / examStarts) * 100) : 0,
      topEvents: [...eventCounts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 8),
      topPages: [...pageCounts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 10),
    };
  }, [events]);

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin" /></div>;
  if (!user) return <div className="min-h-screen flex items-center justify-center px-4" style={{ background: 'var(--bg-ivory)' }}><div className="card-paper p-8 max-w-md text-center"><ShieldCheck className="w-10 h-10 mx-auto" style={{ color: 'var(--gold)' }} /><h1 className="text-2xl mt-4" style={{ fontFamily: 'var(--font-serif)', color: 'var(--ink)' }}>Admin login required</h1><Link to="/login" className="btn-primary inline-flex mt-6">Login</Link></div></div>;
  if (!isAdmin) return <div className="min-h-screen flex items-center justify-center px-4" style={{ background: 'var(--bg-ivory)' }}><SEO title="Admin Access Required" description="Restricted administration area." path="/admin-studio" noindex /><div className="card-paper p-8 max-w-lg text-center"><ShieldCheck className="w-10 h-10 mx-auto" style={{ color: 'var(--gold)' }} /><h1 className="text-2xl mt-4" style={{ fontFamily: 'var(--font-serif)', color: 'var(--ink)' }}>Restricted administration area</h1><p className="text-sm mt-3" style={{ color: 'var(--muted)' }}>Your authenticated profile must have <code>role = admin</code> or <code>is_admin = true</code>. This prevents ordinary student accounts from publishing content or reading admin analytics.</p></div></div>;

  const updateQuestion = (index, patch) => setForm((previous) => ({ ...previous, questions: previous.questions.map((question, i) => i === index ? { ...question, ...patch } : question) }));
  const updateOption = (questionIndex, optionIndex, value) => setForm((previous) => ({ ...previous, questions: previous.questions.map((question, i) => i === questionIndex ? { ...question, options: question.options.map((option, j) => j === optionIndex ? value : option) } : question) }));

  const save = async (status) => {
    setMessage('');
    const slug = slugify(form.slug || form.name);
    const questions = form.questions.filter((question) => question.question.trim() && question.options.filter(Boolean).length >= 2);
    if (!form.name.trim() || !slug || !form.chapter.trim() || questions.length === 0) { setMessage('Add a test name, chapter and at least one complete question.'); return; }
    if (database.content_items !== 'ready') { setMessage('Content database table is not active yet. Apply supabase/platform_hardening.sql first.'); return; }
    setBusy(true);
    const payload = { ...form, slug, questions: questions.map((question, index) => ({ ...question, id: question.id || `${slug}-${index + 1}`, answer: Number(question.answer) })) };
    const result = await supabase.from('content_items').upsert({ slug, type: 'test', status, payload, updated_at: new Date().toISOString(), created_by: user.id }, { onConflict: 'slug' });
    setBusy(false);
    if (result.error) { setMessage(`Save failed: ${result.error.message}`); return; }
    setMessage(status === 'published' ? 'Test published. It will appear automatically in Advanced Exam Mode.' : 'Draft saved.');
    setForm(emptyTest());
    refresh();
  };

  const edit = (row) => setForm({ ...emptyTest(), ...(row.payload || {}), slug: row.slug, questions: (row.payload?.questions || [emptyQuestion()]).map((q) => ({ ...emptyQuestion(), ...q })) });
  const remove = async (row) => {
    if (!window.confirm(`Delete ${row.payload?.name || row.slug}?`)) return;
    await supabase.from('content_items').delete().eq('id', row.id);
    refresh();
  };

  return <div className="min-h-screen" style={{ background: '#0f0d2e' }}>
    <SEO title="Admin Content Studio" description="Restricted administration area." path="/admin-studio" noindex />
    <header className="sticky top-0 z-40 border-b" style={{ background: 'rgba(15,13,46,.96)', borderColor: 'rgba(255,255,255,.08)' }}><div className="page-container py-4 flex flex-wrap items-center justify-between gap-3"><div><div className="text-xs font-bold tracking-widest" style={{ color: '#D9AC5C' }}>ADMIN</div><div className="text-xl font-bold text-white">Content Studio & Analytics</div></div><div className="flex gap-2"><button onClick={() => setTab('content')} className={`px-4 py-2 rounded-xl text-sm font-bold ${tab === 'content' ? 'bg-gold-500 text-navy-950' : 'bg-white/5 text-white'}`}>Content</button><button onClick={() => setTab('resources')} className={`px-4 py-2 rounded-xl text-sm font-bold ${tab === 'resources' ? 'bg-gold-500 text-navy-950' : 'bg-white/5 text-white'}`}>Resources</button><button onClick={() => setTab('analytics')} className={`px-4 py-2 rounded-xl text-sm font-bold ${tab === 'analytics' ? 'bg-gold-500 text-navy-950' : 'bg-white/5 text-white'}`}>Analytics</button><button onClick={() => setTab('database')} className={`px-4 py-2 rounded-xl text-sm font-bold ${tab === 'database' ? 'bg-gold-500 text-navy-950' : 'bg-white/5 text-white'}`}>Database</button></div></div></header>
    <main className="page-container py-8">
      {tab === 'content' && <div className="grid xl:grid-cols-[1.2fr_.8fr] gap-6"><section className="card-premium"><div className="flex items-center justify-between gap-3"><h2 className="text-xl font-bold text-white">Create / edit exam test</h2><FileJson className="w-5 h-5 text-gold-400" /></div><div className="grid md:grid-cols-2 gap-3 mt-5"><input className="input-field" placeholder="Test name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value, slug: form.slug || slugify(e.target.value) })} /><input className="input-field" placeholder="URL slug" value={form.slug} onChange={(e) => setForm({ ...form, slug: slugify(e.target.value) })} /><select className="input-field" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })}>{['Economics','Business Studies','Accountancy','Entrepreneurship','All Subjects'].map((x) => <option key={x}>{x}</option>)}</select><select className="input-field" value={form.classLevel} onChange={(e) => setForm({ ...form, classLevel: Number(e.target.value) })}><option value="11">Class 11</option><option value="12">Class 12</option></select><input className="input-field" placeholder="Chapter / unit" value={form.chapter} onChange={(e) => setForm({ ...form, chapter: e.target.value })} /><input className="input-field" type="number" min="5" max="180" value={form.minutes} onChange={(e) => setForm({ ...form, minutes: Number(e.target.value) })} /><select className="input-field" value={form.difficulty} onChange={(e) => setForm({ ...form, difficulty: e.target.value })}><option>Easy</option><option>Medium</option><option>Hard</option></select><select className="input-field" value={form.isFree ? 'free' : 'pro'} onChange={(e) => setForm({ ...form, isFree: e.target.value === 'free' })}><option value="free">Free</option><option value="pro">Pro</option></select></div><div className="space-y-4 mt-6">{form.questions.map((question, index) => <div key={index} className="rounded-2xl p-4 bg-navy-900/60 border border-white/10"><div className="flex justify-between gap-3"><strong className="text-white">Question {index + 1}</strong><button disabled={form.questions.length === 1} onClick={() => setForm((previous) => ({ ...previous, questions: previous.questions.filter((_, i) => i !== index) }))} className="text-red-400 disabled:opacity-30"><Trash2 className="w-4 h-4" /></button></div><input className="input-field mt-3" placeholder="Question" value={question.question} onChange={(e) => updateQuestion(index, { question: e.target.value })} /><input className="input-field mt-2" placeholder="Topic" value={question.topic} onChange={(e) => updateQuestion(index, { topic: e.target.value })} /><div className="grid md:grid-cols-2 gap-2 mt-2">{question.options.map((option, optionIndex) => <input key={optionIndex} className="input-field" placeholder={`Option ${String.fromCharCode(65 + optionIndex)}`} value={option} onChange={(e) => updateOption(index, optionIndex, e.target.value)} />)}</div><div className="grid md:grid-cols-[160px_1fr] gap-2 mt-2"><select className="input-field" value={question.answer} onChange={(e) => updateQuestion(index, { answer: Number(e.target.value) })}>{question.options.map((_, i) => <option value={i} key={i}>Correct: {String.fromCharCode(65 + i)}</option>)}</select><input className="input-field" placeholder="Explanation" value={question.explanation} onChange={(e) => updateQuestion(index, { explanation: e.target.value })} /></div></div>)}</div><button onClick={() => setForm((previous) => ({ ...previous, questions: [...previous.questions, emptyQuestion()] }))} className="mt-4 px-4 py-2 rounded-xl bg-white/5 text-white inline-flex items-center gap-2"><Plus className="w-4 h-4" /> Add question</button>{message && <div className="mt-4 p-3 rounded-xl bg-gold-500/10 text-gold-300 text-sm">{message}</div>}<div className="flex flex-wrap gap-2 mt-5"><button disabled={busy} onClick={() => save('draft')} className="btn-secondary inline-flex items-center gap-2"><Save className="w-4 h-4" /> Save draft</button><button disabled={busy} onClick={() => save('published')} className="btn-primary inline-flex items-center gap-2">{busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />} Publish</button></div></section><section className="card-premium"><h2 className="text-xl font-bold text-white">Published / draft tests</h2>{database.content_items !== 'ready' ? <div className="mt-5 p-4 rounded-xl bg-red-500/10 text-red-300 text-sm">Content table not active yet. Open the Database tab for setup status.</div> : items.length === 0 ? <div className="mt-5 p-6 rounded-xl bg-white/5 text-navy-300 text-sm text-center">No admin-created tests yet.</div> : <div className="space-y-3 mt-5 max-h-[70vh] overflow-y-auto">{items.map((row) => <div key={row.id} className="p-4 rounded-xl bg-white/5 border border-white/10"><div className="flex justify-between gap-3"><div><div className="font-bold text-white">{row.payload?.name || row.slug}</div><div className="text-xs text-navy-400 mt-1">{row.payload?.subject} · Class {row.payload?.classLevel} · {row.status}</div></div><div className="flex gap-2"><button onClick={() => edit(row)} className="text-gold-300 text-xs">Edit</button><button onClick={() => remove(row)} className="text-red-400"><Trash2 className="w-4 h-4" /></button></div></div></div>)}</div>}</section></div>}
      {tab === 'resources' && <AdminCommerceResources user={user} />}
      {tab === 'analytics' && <><div className="grid grid-cols-2 lg:grid-cols-4 gap-4">{[['Events',analytics.total],['Exam starts',analytics.examStarts],['Exam completions',analytics.examCompletes],['Exam completion rate',`${analytics.examCompletionRate}%`]].map(([label,value]) => <div key={label} className="card-premium"><Activity className="w-5 h-5 text-gold-400" /><div className="text-3xl font-black text-white mt-3">{value}</div><div className="text-xs text-navy-400 mt-1">{label}</div></div>)}</div>{database.learning_events !== 'ready' ? <div className="card-premium mt-6 text-red-300"><AlertCircle className="w-5 h-5 inline mr-2" /> Analytics database table is not active yet.</div> : <div className="grid lg:grid-cols-2 gap-6 mt-6"><section className="card-premium"><h2 className="text-lg font-bold text-white flex items-center gap-2"><BarChart3 className="w-5 h-5 text-gold-400" /> Top events</h2><div className="space-y-2 mt-4">{analytics.topEvents.map(([name,count]) => <div key={name} className="flex justify-between p-3 rounded-xl bg-white/5 text-sm"><span className="text-navy-300">{name}</span><strong className="text-white">{count}</strong></div>)}</div></section><section className="card-premium"><h2 className="text-lg font-bold text-white">Most viewed pages</h2><div className="space-y-2 mt-4">{analytics.topPages.map(([path,count]) => <div key={path} className="flex justify-between gap-4 p-3 rounded-xl bg-white/5 text-sm"><span className="text-navy-300 truncate">{path}</span><strong className="text-white">{count}</strong></div>)}</div></section></div>}</>}
      {tab === 'database' && <section className="max-w-3xl mx-auto"><div className="card-premium"><Database className="w-8 h-8 text-gold-400" /><h2 className="text-2xl font-bold text-white mt-4">Platform database readiness</h2><p className="text-sm text-navy-400 mt-2">This checks the live Supabase project. Code migrations in GitHub do not automatically modify the database.</p><div className="space-y-3 mt-6">{Object.entries(database).map(([table,status]) => <div key={table} className="flex items-center justify-between p-4 rounded-xl bg-white/5"><code className="text-white">{table}</code><span className={`text-xs font-bold inline-flex items-center gap-1 ${status === 'ready' ? 'text-emerald-400' : status === 'checking' ? 'text-gold-400' : 'text-red-400'}`}>{status === 'ready' ? <CheckCircle2 className="w-4 h-4" /> : status === 'checking' ? <Loader2 className="w-4 h-4 animate-spin" /> : <AlertCircle className="w-4 h-4" />}{status}</span></div>)}</div><div className="mt-6 p-4 rounded-xl bg-gold-500/10 text-gold-200 text-sm leading-relaxed">If any required table shows <strong>missing</strong>, apply <code>supabase/platform_hardening.sql</code> in the Supabase SQL editor. I cannot safely execute schema-changing SQL against your external Supabase project from this GitHub connection.</div><button onClick={refresh} className="btn-primary mt-5 inline-flex items-center gap-2"><Database className="w-4 h-4" /> Re-check database</button></div></section>}
    </main>
  </div>;
}
