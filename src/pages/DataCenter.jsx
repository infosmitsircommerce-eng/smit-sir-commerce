import { useMemo, useRef, useState } from 'react';
import { Cloud, Download, FileJson, RefreshCw, ShieldCheck, Trash2, Upload } from 'lucide-react';
import SEO from '../components/ui/SEO';
import { useAuth } from '../context/AuthContext';
import { CLOUD_KEYS, collectLocalLearningState, syncLearningState } from '../lib/cloudSync';

const EXTRA_KEYS = ['ssc-exam-attempts-v1', 'ssc-chapter-progress-v1', 'ssc-analytics-events-v1'];

function downloadJson(filename, data) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

export default function DataCenter() {
  const { user } = useAuth();
  const fileRef = useRef();
  const [status, setStatus] = useState('');
  const [syncing, setSyncing] = useState(false);
  const keys = useMemo(() => [...new Set([...CLOUD_KEYS, ...EXTRA_KEYS, `ssc-test-attempts-v1:${user?.id || 'guest'}`])], [user?.id]);

  const exportData = () => {
    const data = { version: 1, exportedAt: new Date().toISOString(), app: 'Smit Sir Commerce', state: {} };
    for (const key of keys) {
      try { data.state[key] = JSON.parse(localStorage.getItem(key) || '[]'); } catch { data.state[key] = []; }
    }
    downloadJson(`smit-sir-commerce-study-backup-${new Date().toISOString().slice(0, 10)}.json`, data);
    setStatus('Backup downloaded. Keep it somewhere safe if you want a personal copy of your study progress.');
  };

  const importData = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      const parsed = JSON.parse(await file.text());
      if (!parsed?.state || typeof parsed.state !== 'object') throw new Error('Invalid backup format');
      for (const [key, value] of Object.entries(parsed.state)) {
        if (!keys.includes(key)) continue;
        localStorage.setItem(key, JSON.stringify(value));
      }
      setStatus('Backup restored on this device. Refresh study pages to see the restored progress.');
      if (user?.id) await syncLearningState(user.id);
    } catch {
      setStatus('That file does not look like a valid Smit Sir Commerce study backup.');
    } finally {
      event.target.value = '';
    }
  };

  const syncNow = async () => {
    if (!user?.id) { setStatus('Login first if you want cross-device cloud sync. Device backup still works without login.'); return; }
    setSyncing(true);
    const result = await syncLearningState(user.id);
    setSyncing(false);
    setStatus(result.ok ? 'Cloud sync completed.' : 'Cloud sync is not available yet. Your device data remains saved safely in this browser.');
  };

  const clearDevice = () => {
    const confirmed = window.confirm('Clear saved study progress from this browser? Export a backup first if you may need it later.');
    if (!confirmed) return;
    keys.forEach((key) => localStorage.removeItem(key));
    setStatus('Study progress cleared from this browser.');
  };

  const state = user?.id ? collectLocalLearningState(user.id) : {};
  const estimatedItems = Object.values(state).reduce((sum, value) => sum + (Array.isArray(value) ? value.length : 0), 0);

  return <div className="min-h-screen" style={{ background: 'var(--bg-ivory)' }}>
    <SEO title="My Study Data & Backup" description="Private data controls for study progress, backup, restore and cloud sync." path="/my-data" noindex />
    <section className="page-hero"><div className="page-container max-w-4xl"><span className="eyebrow">Privacy & data controls</span><h1 className="mt-5">Your progress should stay <em>under your control.</em></h1><p className="mt-5 text-lg leading-relaxed" style={{ color: 'var(--muted)' }}>Export a personal JSON backup, restore it on this browser, request cloud sync when logged in, or clear device-saved study data.</p></div></section>
    <main className="page-container section-padding max-w-5xl"><div className="grid md:grid-cols-2 gap-5"><section className="card-paper p-6"><Download className="w-8 h-8" style={{ color: 'var(--gold)' }} /><h2 className="text-2xl mt-4" style={{ fontFamily: 'var(--font-serif)', color: 'var(--ink)' }}>Export study backup</h2><p className="text-sm mt-2 leading-relaxed" style={{ color: 'var(--muted)' }}>Creates a local file containing supported study history such as Daily 10, Mistake Book, exam attempts, bookmarks and chapter progress.</p><button onClick={exportData} className="btn-primary mt-5 inline-flex items-center gap-2"><FileJson className="w-4 h-4" /> Download backup</button></section><section className="card-paper p-6"><Upload className="w-8 h-8" style={{ color: 'var(--gold)' }} /><h2 className="text-2xl mt-4" style={{ fontFamily: 'var(--font-serif)', color: 'var(--ink)' }}>Restore backup</h2><p className="text-sm mt-2 leading-relaxed" style={{ color: 'var(--muted)' }}>Import a backup previously exported from this site. Only recognised study-progress keys are restored.</p><input ref={fileRef} type="file" accept="application/json,.json" onChange={importData} className="hidden" /><button onClick={() => fileRef.current?.click()} className="btn-secondary mt-5 inline-flex items-center gap-2"><Upload className="w-4 h-4" /> Choose backup file</button></section></div>
      <section className="card-paper p-6 mt-5"><div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5"><div><div className="flex items-center gap-2"><Cloud className="w-6 h-6" style={{ color: 'var(--gold)' }} /><h2 className="text-2xl" style={{ fontFamily: 'var(--font-serif)', color: 'var(--ink)' }}>Cloud sync</h2></div><p className="text-sm mt-2" style={{ color: 'var(--muted)' }}>{user ? `Signed in · about ${estimatedItems} supported progress records currently detected on this device.` : 'Not signed in. Your study data can still remain saved locally on this device.'}</p></div><button onClick={syncNow} disabled={syncing} className="btn-primary inline-flex items-center justify-center gap-2 disabled:opacity-60">{syncing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Cloud className="w-4 h-4" />} Sync now</button></div></section>
      <section className="card-paper p-6 mt-5"><div className="flex items-start gap-3"><ShieldCheck className="w-6 h-6 flex-shrink-0" style={{ color: 'var(--green)' }} /><div><h2 className="text-xl" style={{ fontFamily: 'var(--font-serif)', color: 'var(--ink)' }}>Privacy note</h2><p className="text-sm mt-2 leading-relaxed" style={{ color: 'var(--muted)' }}>The export feature is designed for your study progress. It does not include your password. Analytics code intentionally avoids storing email, phone number, or free-text answers in event metadata.</p></div></div></section>
      <section className="rounded-2xl p-6 mt-5" style={{ background: 'rgba(180,83,60,.06)', border: '1px solid rgba(180,83,60,.18)' }}><Trash2 className="w-6 h-6" style={{ color: '#B4533C' }} /><h2 className="text-xl mt-3" style={{ fontFamily: 'var(--font-serif)', color: 'var(--ink)' }}>Clear this browser’s study data</h2><p className="text-sm mt-2" style={{ color: 'var(--muted)' }}>This only clears supported study-progress keys from the current browser. It does not delete a Supabase account or cloud records.</p><button onClick={clearDevice} className="mt-4 rounded-xl px-4 py-2.5 text-sm font-bold" style={{ background: '#B4533C', color: '#fff' }}>Clear device progress</button></section>
      {status && <div className="mt-5 rounded-xl p-4 text-sm" role="status" style={{ background: 'var(--gold-bg)', color: 'var(--charcoal)', border: '1px solid rgba(184,135,47,.2)' }}>{status}</div>}
    </main>
  </div>;
}
