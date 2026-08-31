import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Activity, BarChart3, BookOpenCheck, CheckCircle2, Clock3, Crown,
  Database, Download, ExternalLink, Loader2, RefreshCw, Search,
  ShieldCheck, Sparkles, UserRoundCog, Users, XCircle
} from 'lucide-react';
import SEO from '../components/ui/SEO';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';

const DAY = 24 * 60 * 60 * 1000;

function isActivePro(profile) {
  if (!profile?.is_premium) return false;
  if (!profile.premium_until) return true;
  const expiry = new Date(profile.premium_until).getTime();
  return Number.isFinite(expiry) && expiry > Date.now();
}

function formatDate(value) {
  if (!value) return 'No expiry';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '—';
  return date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

function csvCell(value) {
  const text = Array.isArray(value) ? value.join(' | ') : String(value ?? '');
  return `"${text.replace(/"/g, '""')}"`;
}

function Restricted({ loggedIn }) {
  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: 'var(--bg-ivory)' }}>
      <SEO title="Owner Control Panel" description="Restricted owner administration area." path="/admin" noindex />
      <div className="card-paper max-w-lg w-full p-8 text-center">
        <ShieldCheck className="w-11 h-11 mx-auto" style={{ color: 'var(--gold)' }} />
        <h1 className="text-3xl mt-4" style={{ fontFamily: 'var(--font-serif)', color: 'var(--ink)' }}>{loggedIn ? 'Owner access required' : 'Owner login required'}</h1>
        <p className="text-sm mt-3 leading-relaxed" style={{ color: 'var(--muted)' }}>
          {loggedIn
            ? 'This page can read student records and change Pro access, so ordinary student accounts are blocked.'
            : 'Sign in with the account that has been designated as the platform owner/admin.'}
        </p>
        <Link to={loggedIn ? '/dashboard' : '/login'} className="btn-primary inline-flex mt-6">{loggedIn ? 'Back to dashboard' : 'Login'}</Link>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const { user, isAdmin, loading, fetchProfile } = useAuth();
  const [students, setStudents] = useState([]);
  const [attempts, setAttempts] = useState([]);
  const [events, setEvents] = useState([]);
  const [logs, setLogs] = useState([]);
  const [contentCount, setContentCount] = useState(0);
  const [cloudCount, setCloudCount] = useState(0);
  const [busy, setBusy] = useState(true);
  const [actionId, setActionId] = useState(null);
  const [message, setMessage] = useState('');
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('all');

  const refresh = async () => {
    if (!isAdmin) return;
    setBusy(true);
    setMessage('');
    const since = new Date(Date.now() - 7 * DAY).toISOString();
    const [profilesRes, attemptsRes, eventsRes, logsRes, contentRes, cloudRes] = await Promise.all([
      supabase.from('profiles').select('id,email,full_name,class_level,board,subjects,study_goal,onboarding_completed,is_premium,premium_until,created_at').order('created_at', { ascending: false }).limit(2000),
      supabase.from('test_attempts').select('id,user_id,test_name,subject,percentage,created_at').order('created_at', { ascending: false }).limit(5000),
      supabase.from('learning_events').select('id,user_id,event_name,path,created_at').gte('created_at', since).order('created_at', { ascending: false }).limit(5000),
      supabase.from('premium_access_log').select('id,actor_user_id,target_user_id,old_is_premium,new_is_premium,old_premium_until,new_premium_until,changed_at').order('changed_at', { ascending: false }).limit(100),
      supabase.from('content_items').select('id', { count: 'exact', head: true }).eq('status', 'published'),
      supabase.from('student_learning_state').select('user_id', { count: 'exact', head: true }),
    ]);

    const errors = [profilesRes.error, attemptsRes.error, eventsRes.error, logsRes.error, contentRes.error, cloudRes.error].filter(Boolean);
    if (errors.length) setMessage(`Some owner data could not be loaded: ${errors[0].message}`);
    setStudents(profilesRes.data || []);
    setAttempts(attemptsRes.data || []);
    setEvents(eventsRes.data || []);
    setLogs(logsRes.data || []);
    setContentCount(contentRes.count || 0);
    setCloudCount(cloudRes.count || 0);
    setBusy(false);
  };

  useEffect(() => { refresh(); }, [isAdmin]);

  const perStudent = useMemo(() => {
    const map = new Map();
    attempts.forEach((attempt) => {
      if (!attempt.user_id) return;
      const row = map.get(attempt.user_id) || { count: 0, total: 0, best: 0, last: null };
      const pct = Number(attempt.percentage || 0);
      row.count += 1;
      row.total += pct;
      row.best = Math.max(row.best, pct);
      if (!row.last || new Date(attempt.created_at) > new Date(row.last)) row.last = attempt.created_at;
      map.set(attempt.user_id, row);
    });
    return map;
  }, [attempts]);

  const lastActivity = useMemo(() => {
    const map = new Map();
    events.forEach((event) => {
      if (!event.user_id) return;
      const previous = map.get(event.user_id);
      if (!previous || new Date(event.created_at) > new Date(previous)) map.set(event.user_id, event.created_at);
    });
    return map;
  }, [events]);

  const activeProCount = students.filter(isActivePro).length;
  const averageScore = attempts.length ? Math.round(attempts.reduce((sum, item) => sum + Number(item.percentage || 0), 0) / attempts.length) : 0;
  const guestEvents = events.filter((item) => !item.user_id).length;

  const visibleStudents = useMemo(() => {
    const q = query.trim().toLowerCase();
    return students.filter((student) => {
      const activePro = isActivePro(student);
      if (filter === 'pro' && !activePro) return false;
      if (filter === 'free' && activePro) return false;
      if (filter === '11' && Number(student.class_level) !== 11) return false;
      if (filter === '12' && Number(student.class_level) !== 12) return false;
      if (!q) return true;
      return `${student.full_name || ''} ${student.email || ''} ${student.board || ''} ${(student.subjects || []).join(' ')}`.toLowerCase().includes(q);
    });
  }, [students, query, filter]);

  const setPro = async (student, durationDays) => {
    const label = student.full_name || student.email || 'this student';
    const revoke = durationDays === 0;
    const permanent = durationDays === null;
    const until = revoke || permanent ? null : new Date(Date.now() + durationDays * DAY).toISOString();
    if (!window.confirm(revoke ? `Remove Pro access from ${label}?` : `Give ${label} ${permanent ? 'Pro access with no expiry' : `${durationDays} days of Pro access`}?`)) return;

    setActionId(student.id);
    setMessage('');
    const { error } = await supabase.from('profiles').update({ is_premium: !revoke, premium_until: until }).eq('id', student.id);
    if (error) setMessage(`Could not change Pro access: ${error.message}`);
    else {
      setMessage(revoke ? `Pro access removed from ${label}.` : `Pro access updated for ${label}.`);
      if (student.id === user?.id) await fetchProfile(user.id);
      await refresh();
    }
    setActionId(null);
  };

  const exportStudents = () => {
    const header = ['Name','Email','Class','Board','Subjects','Goal','Pro','Pro expiry','Tests','Average score','Best score','Created'];
    const rows = students.map((student) => {
      const stat = perStudent.get(student.id) || { count: 0, total: 0, best: 0 };
      const avg = stat.count ? Math.round(stat.total / stat.count) : '';
      return [student.full_name, student.email, student.class_level, student.board, student.subjects, student.study_goal, isActivePro(student) ? 'Yes' : 'No', student.premium_until, stat.count, avg, stat.best || '', student.created_at];
    });
    const csv = [header, ...rows].map((row) => row.map(csvCell).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `smit-sir-students-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg-ivory)' }}><Loader2 className="w-8 h-8 animate-spin" style={{ color: 'var(--gold)' }} /></div>;
  if (!user) return <Restricted loggedIn={false} />;
  if (!isAdmin) return <Restricted loggedIn />;

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-ivory)' }}>
      <SEO title="Owner Control Panel" description="Restricted owner administration area." path="/admin" noindex />

      <header className="sticky top-0 z-40 border-b" style={{ background: 'rgba(250,246,238,.96)', borderColor: 'var(--border)', backdropFilter: 'blur(16px)' }}>
        <div className="page-container py-4 flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="text-xs font-black tracking-[.18em]" style={{ color: 'var(--gold)' }}>OWNER CONTROL</div>
            <h1 className="text-2xl mt-1" style={{ fontFamily: 'var(--font-serif)', color: 'var(--ink)' }}>Smit Sir Commerce</h1>
          </div>
          <div className="flex flex-wrap gap-2">
            <button onClick={refresh} disabled={busy} className="btn-secondary inline-flex items-center gap-2"><RefreshCw className={`w-4 h-4 ${busy ? 'animate-spin' : ''}`} /> Refresh</button>
            <button onClick={exportStudents} disabled={!students.length} className="btn-secondary inline-flex items-center gap-2"><Download className="w-4 h-4" /> Export students</button>
            <Link to="/admin-studio" className="btn-primary inline-flex items-center gap-2"><UserRoundCog className="w-4 h-4" /> Content Studio</Link>
            <Link to="/" className="btn-secondary inline-flex items-center gap-2"><ExternalLink className="w-4 h-4" /> View site</Link>
          </div>
        </div>
      </header>

      <main className="page-container py-8 space-y-7">
        {message && <div className="rounded-xl p-4 text-sm" style={{ background: 'var(--gold-bg)', border: '1px solid rgba(184,135,47,.25)', color: 'var(--charcoal)' }}>{message}</div>}

        <section className="grid grid-cols-2 lg:grid-cols-6 gap-3">
          {[
            { icon: Users, label: 'Students', value: busy ? '…' : students.length },
            { icon: Crown, label: 'Active Pro', value: busy ? '…' : activeProCount },
            { icon: BarChart3, label: 'Test attempts', value: busy ? '…' : attempts.length },
            { icon: Sparkles, label: 'Average score', value: attempts.length ? `${averageScore}%` : '—' },
            { icon: Database, label: 'Cloud profiles', value: busy ? '…' : cloudCount },
            { icon: BookOpenCheck, label: 'Published admin content', value: busy ? '…' : contentCount },
          ].map(({ icon: Icon, label, value }) => <div key={label} className="card-paper p-4"><Icon className="w-5 h-5" style={{ color: 'var(--gold)' }} /><div className="text-2xl font-bold mt-3" style={{ fontFamily: 'var(--font-serif)', color: 'var(--ink)' }}>{value}</div><div className="text-xs mt-1" style={{ color: 'var(--muted)' }}>{label}</div></div>)}
        </section>

        <section className="grid lg:grid-cols-[1.35fr_.65fr] gap-5">
          <div className="card-paper p-5 sm:p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div><span className="eyebrow">Real accounts only</span><h2 className="text-3xl mt-2" style={{ fontFamily: 'var(--font-serif)', color: 'var(--ink)' }}>Student access</h2></div>
              <div className="flex flex-wrap gap-2">
                <label className="relative"><Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--muted)' }} /><input value={query} onChange={(e) => setQuery(e.target.value)} className="input-field pl-10 min-w-[240px]" placeholder="Search student…" /></label>
                <select className="input-field w-auto" value={filter} onChange={(e) => setFilter(e.target.value)}><option value="all">All</option><option value="pro">Pro</option><option value="free">Free</option><option value="11">Class 11</option><option value="12">Class 12</option></select>
              </div>
            </div>

            {busy ? <div className="py-16 flex justify-center"><Loader2 className="w-7 h-7 animate-spin" style={{ color: 'var(--gold)' }} /></div> : visibleStudents.length === 0 ? <div className="tile-paper p-8 text-center mt-5"><Users className="w-8 h-8 mx-auto" style={{ color: 'var(--gold)' }} /><div className="font-semibold mt-3" style={{ color: 'var(--ink)' }}>No matching student accounts</div><p className="text-sm mt-1" style={{ color: 'var(--muted)' }}>This panel does not generate demo students. Real sign-ups will appear here.</p></div> : <div className="overflow-x-auto mt-5"><table className="w-full min-w-[980px]"><thead><tr className="text-xs text-left border-b" style={{ color: 'var(--muted)', borderColor: 'var(--border)' }}><th className="py-3 pr-4">Student</th><th className="py-3 pr-4">Study setup</th><th className="py-3 pr-4">Tests</th><th className="py-3 pr-4">Last activity</th><th className="py-3 pr-4">Access</th><th className="py-3">Owner actions</th></tr></thead><tbody>{visibleStudents.map((student) => {
              const stat = perStudent.get(student.id) || { count: 0, total: 0, best: 0, last: null };
              const avg = stat.count ? Math.round(stat.total / stat.count) : null;
              const activePro = isActivePro(student);
              const activity = lastActivity.get(student.id) || stat.last;
              return <tr key={student.id} className="border-b align-top" style={{ borderColor: 'var(--border)' }}><td className="py-4 pr-4"><div className="font-semibold" style={{ color: 'var(--ink)' }}>{student.full_name || 'Unnamed student'}</div><div className="text-xs mt-1" style={{ color: 'var(--muted)' }}>{student.email || student.id.slice(0, 8)}</div></td><td className="py-4 pr-4 text-sm"><div style={{ color: 'var(--charcoal)' }}>{student.class_level ? `Class ${student.class_level}` : 'Class not set'} · {student.board || 'Board not set'}</div><div className="text-xs mt-1 max-w-[260px]" style={{ color: 'var(--muted)' }}>{student.subjects?.length ? student.subjects.join(', ') : 'No subjects selected'}{student.onboarding_completed ? '' : ' · Setup incomplete'}</div></td><td className="py-4 pr-4"><div className="font-semibold" style={{ color: 'var(--ink)' }}>{stat.count}</div><div className="text-xs mt-1" style={{ color: 'var(--muted)' }}>{avg === null ? 'No measured score yet' : `Avg ${avg}% · Best ${Math.round(stat.best)}%`}</div></td><td className="py-4 pr-4 text-sm" style={{ color: 'var(--muted)' }}>{activity ? formatDate(activity) : 'No recorded activity'}</td><td className="py-4 pr-4"><span className="inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1.5 rounded-full" style={{ background: activePro ? 'rgba(77,124,15,.09)' : 'var(--bg-ivory)', color: activePro ? 'var(--green)' : 'var(--muted)', border: '1px solid var(--border)' }}>{activePro ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}{activePro ? 'PRO' : 'FREE'}</span><div className="text-xs mt-2" style={{ color: 'var(--muted)' }}>{activePro ? formatDate(student.premium_until) : student.is_premium && student.premium_until ? `Expired ${formatDate(student.premium_until)}` : 'No Pro access'}</div></td><td className="py-4"><div className="flex flex-wrap gap-1.5"><button disabled={actionId === student.id} onClick={() => setPro(student, 30)} className="text-xs font-semibold px-2.5 py-2 rounded-lg" style={{ background: 'var(--gold-bg)', color: 'var(--gold)' }}>+30d</button><button disabled={actionId === student.id} onClick={() => setPro(student, 90)} className="text-xs font-semibold px-2.5 py-2 rounded-lg" style={{ background: 'var(--gold-bg)', color: 'var(--gold)' }}>+90d</button><button disabled={actionId === student.id} onClick={() => setPro(student, null)} className="text-xs font-semibold px-2.5 py-2 rounded-lg" style={{ background: 'var(--ink)', color: '#fff' }}>No expiry</button>{(student.is_premium || activePro) && <button disabled={actionId === student.id} onClick={() => setPro(student, 0)} className="text-xs font-semibold px-2.5 py-2 rounded-lg" style={{ background: 'rgba(180,83,60,.08)', color: '#B4533C' }}>Revoke</button>}</div></td></tr>;
            })}</tbody></table></div>}
          </div>

          <div className="space-y-5">
            <div className="card-paper p-6"><div className="flex items-center justify-between"><div><span className="eyebrow">Last 7 days</span><h2 className="text-2xl mt-2" style={{ fontFamily: 'var(--font-serif)', color: 'var(--ink)' }}>Platform activity</h2></div><Activity className="w-6 h-6" style={{ color: 'var(--gold)' }} /></div><div className="grid grid-cols-2 gap-3 mt-5"><div className="tile-paper p-4"><div className="text-2xl font-bold" style={{ color: 'var(--ink)' }}>{events.length}</div><div className="text-xs mt-1" style={{ color: 'var(--muted)' }}>tracked events</div></div><div className="tile-paper p-4"><div className="text-2xl font-bold" style={{ color: 'var(--ink)' }}>{guestEvents}</div><div className="text-xs mt-1" style={{ color: 'var(--muted)' }}>guest events</div></div></div><p className="text-xs mt-4 leading-relaxed" style={{ color: 'var(--muted)' }}>These are product-learning events such as page views and exam activity. They are not fabricated attendance figures.</p></div>

            <div className="card-paper p-6"><div className="flex items-center justify-between"><div><span className="eyebrow">Audit trail</span><h2 className="text-2xl mt-2" style={{ fontFamily: 'var(--font-serif)', color: 'var(--ink)' }}>Recent Pro changes</h2></div><Clock3 className="w-6 h-6" style={{ color: 'var(--gold)' }} /></div>{logs.length === 0 ? <p className="text-sm mt-4" style={{ color: 'var(--muted)' }}>No Pro-access changes yet.</p> : <div className="space-y-3 mt-4 max-h-[420px] overflow-y-auto">{logs.slice(0, 12).map((log) => { const target = students.find((student) => student.id === log.target_user_id); return <div key={log.id} className="tile-paper p-3"><div className="text-sm font-semibold" style={{ color: 'var(--ink)' }}>{target?.full_name || target?.email || log.target_user_id.slice(0, 8)}</div><div className="text-xs mt-1" style={{ color: 'var(--muted)' }}>{log.new_is_premium ? `Pro enabled · ${formatDate(log.new_premium_until)}` : 'Pro revoked'} · {formatDate(log.changed_at)}</div></div>; })}</div>}</div>
          </div>
        </section>
      </main>
    </div>
  );
}
