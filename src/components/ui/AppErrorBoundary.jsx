import { Component } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

const STALE_ASSET_RECOVERY_KEY = 'ssc-stale-asset-recovery-v1';

function isStaleAssetError(error) {
  const text = `${error?.name || ''} ${error?.message || ''} ${error?.stack || ''}`;
  return /ChunkLoadError|Loading chunk .* failed|Failed to fetch dynamically imported module|Importing a module script failed|error loading dynamically imported module/i.test(text);
}

async function refreshAppAssets() {
  try {
    if ('caches' in window) {
      const cacheNames = await window.caches.keys();
      await Promise.all(
        cacheNames
          .filter((name) => /workbox|precache|ssc-|vite|runtime|navigation/i.test(name))
          .map((name) => window.caches.delete(name)),
      );
    }
  } catch {
    // Cache cleanup is best-effort. Never touch localStorage study progress.
  }

  try {
    if ('serviceWorker' in navigator) {
      const registrations = await navigator.serviceWorker.getRegistrations();
      await Promise.all(registrations.map((registration) => registration.unregister().catch(() => false)));
    }
  } catch {
    // A normal reload still gives the app a chance to recover.
  }

  window.location.reload();
}

export default class AppErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null, recovering: false };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    console.error('Smit Sir Commerce UI error', error, info);

    if (!isStaleAssetError(error)) return;

    try {
      if (window.sessionStorage.getItem(STALE_ASSET_RECOVERY_KEY) === 'done') return;
      window.sessionStorage.setItem(STALE_ASSET_RECOVERY_KEY, 'done');
    } catch {
      // If sessionStorage is blocked, continue with one best-effort recovery.
    }

    this.setState({ recovering: true });
    refreshAppAssets();
  }

  handleReload = () => {
    this.setState({ recovering: true });
    refreshAppAssets();
  };

  render() {
    if (!this.state.error) return this.props.children;

    return (
      <div
        className="min-h-screen flex items-center justify-center p-4"
        style={{ background: 'var(--bg-ivory)' }}
      >
        <div className="card-paper max-w-lg w-full p-8 text-center">
          <AlertTriangle className="w-10 h-10 mx-auto" style={{ color: '#B4533C' }} />
          <h1
            className="text-2xl mt-4"
            style={{ fontFamily: 'var(--font-serif)', color: 'var(--ink)' }}
          >
            {this.state.recovering ? 'Refreshing the latest version…' : 'This page hit an unexpected error'}
          </h1>
          <p className="text-sm mt-3 leading-relaxed" style={{ color: 'var(--muted)' }}>
            Your device-saved study progress has not been intentionally cleared. {this.state.recovering
              ? 'The app is clearing only stale website files and will reload automatically.'
              : 'Reload the latest website files and try again.'}
          </p>
          {!this.state.recovering && (
            <button onClick={this.handleReload} className="btn-primary mt-6 inline-flex items-center gap-2">
              <RefreshCw className="w-4 h-4" /> Reload latest version
            </button>
          )}
        </div>
      </div>
    );
  }
}
