import { useEffect, useRef, useState } from 'react';
import { Cloud, CloudOff, RefreshCw } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { syncLearningState } from '../../lib/cloudSync';

export default function CloudSyncBridge() {
  const { user } = useAuth();
  const [status, setStatus] = useState('idle');
  const timer = useRef(null);
  const debounce = useRef(null);

  useEffect(() => {
    if (!user?.id) {
      setStatus('idle');
      return undefined;
    }

    let cancelled = false;
    let running = false;
    const run = async () => {
      if (running) return;
      running = true;
      setStatus('syncing');
      const result = await syncLearningState(user.id);
      running = false;
      if (cancelled) return;
      setStatus(result.ok ? 'synced' : 'local');
    };
    const schedule = () => {
      if (debounce.current) window.clearTimeout(debounce.current);
      debounce.current = window.setTimeout(run, 1200);
    };

    run();
    timer.current = window.setInterval(run, 45_000);
    const onFocus = () => run();
    window.addEventListener('focus', onFocus);
    window.addEventListener('ssc-study-state-changed', schedule);

    return () => {
      cancelled = true;
      if (timer.current) window.clearInterval(timer.current);
      if (debounce.current) window.clearTimeout(debounce.current);
      window.removeEventListener('focus', onFocus);
      window.removeEventListener('ssc-study-state-changed', schedule);
    };
  }, [user?.id]);

  if (!user) return null;

  const synced = status === 'synced';
  const syncing = status === 'syncing';
  const Icon = syncing ? RefreshCw : synced ? Cloud : CloudOff;
  const label = syncing ? 'Syncing' : synced ? 'Cloud synced' : 'Device saved';

  return (
    <div className="fixed left-3 bottom-24 lg:bottom-4 z-30 pointer-events-none" aria-live="polite">
      <div className="rounded-full px-3 py-2 text-[11px] font-semibold shadow-md flex items-center gap-1.5"
        style={{ background: 'rgba(255,255,255,.92)', color: synced ? 'var(--green)' : 'var(--muted)', border: '1px solid var(--border)' }}>
        <Icon className={`w-3.5 h-3.5 ${syncing ? 'animate-spin' : ''}`} /> {label}
      </div>
    </div>
  );
}
