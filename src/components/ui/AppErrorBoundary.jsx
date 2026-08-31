import { Component } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

export default class AppErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    console.error('Smit Sir Commerce UI error', error, info);
  }

  render() {
    if (!this.state.error) return this.props.children;
    return <div className="min-h-screen flex items-center justify-center p-4" style={{ background: 'var(--bg-ivory)' }}><div className="card-paper max-w-lg w-full p-8 text-center"><AlertTriangle className="w-10 h-10 mx-auto" style={{ color: '#B4533C' }} /><h1 className="text-2xl mt-4" style={{ fontFamily: 'var(--font-serif)', color: 'var(--ink)' }}>This page hit an unexpected error</h1><p className="text-sm mt-3 leading-relaxed" style={{ color: 'var(--muted)' }}>Your device-saved study progress has not been intentionally cleared. Reload the page and try again.</p><button onClick={() => window.location.reload()} className="btn-primary mt-6 inline-flex items-center gap-2"><RefreshCw className="w-4 h-4" /> Reload page</button></div></div>;
  }
}
