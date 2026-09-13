import { useEffect, useState } from 'react';
import { Download, Smartphone, X } from 'lucide-react';
import { trackEvent } from '../../lib/analytics';

export default function InstallPWA() {
  const [prompt, setPrompt] = useState(null);
  const [show, setShow] = useState(false);
  const [installed, setInstalled] = useState(false);

  useEffect(() => {
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setInstalled(true);
      return undefined;
    }

    let timer;
    const handler = (event) => {
      event.preventDefault();
      setPrompt(event);
      const visits = Number(localStorage.getItem('ssc-visit-count') || '0') + 1;
      localStorage.setItem('ssc-visit-count', String(visits));
      const dismissedUntil = Number(localStorage.getItem('ssc-install-dismissed-until') || '0');
      if (Date.now() >= dismissedUntil && window.matchMedia('(max-width: 1023px)').matches) {
        timer = window.setTimeout(() => {
          setShow(true);
          void trackEvent('pwa_install_prompt_view', { visit: visits });
        }, visits > 1 ? 12000 : 22000);
      }
    };
    const installedHandler = () => {
      setInstalled(true);
      setShow(false);
      void trackEvent('pwa_install_complete');
    };
    window.addEventListener('beforeinstallprompt', handler);
    window.addEventListener('appinstalled', installedHandler);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener('beforeinstallprompt', handler);
      window.removeEventListener('appinstalled', installedHandler);
    };
  }, []);

  const dismissInstall = () => {
    localStorage.setItem('ssc-install-dismissed-until', String(Date.now() + 7 * 24 * 60 * 60 * 1000));
    setShow(false);
    void trackEvent('pwa_install_prompt_dismiss');
  };

  const handleInstall = async () => {
    if (!prompt) return;
    prompt.prompt();
    const { outcome } = await prompt.userChoice;
    if (outcome === 'accepted') {
      setInstalled(true);
      void trackEvent('pwa_install_accept');
    } else {
      void trackEvent('pwa_install_decline');
    }
    setShow(false);
  };

  if (installed || !show) return null;

  return <aside className="install-pwa-banner fixed left-3 right-3 z-[70] lg:hidden" aria-label="Install Smit Sir Commerce app">
    <div className="rounded-2xl p-3.5 flex items-center gap-3" style={{ background: 'linear-gradient(145deg, #fffef9, #fff2cf)', border: '1px solid #dec180', boxShadow: '0 16px 36px rgba(55,43,25,.2)' }}>
      <span className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'linear-gradient(135deg, #ffe59a, #efbd4e)', color: '#3b2c12' }}><Smartphone className="w-6 h-6" aria-hidden="true" /></span>
      <span className="flex-1 min-w-0"><strong className="block text-sm" style={{ color: '#29251d' }}>Study faster from Home</strong><small className="block text-xs mt-0.5 leading-tight" style={{ color: '#716b60' }}>Install the free app. Recent pages stay ready offline.</small></span>
      <span className="flex items-center gap-1.5 flex-shrink-0">
        <button type="button" onClick={handleInstall} className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold" style={{ background: '#29251d', color: '#fff5e3' }}><Download className="w-3.5 h-3.5" aria-hidden="true" /> Install</button>
        <button type="button" onClick={dismissInstall} aria-label="Dismiss install suggestion" className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: '#fffaf0', color: '#716b60' }}><X className="w-4 h-4" aria-hidden="true" /></button>
      </span>
    </div>
  </aside>;
}
