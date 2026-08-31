import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Download, Smartphone } from 'lucide-react';

export default function InstallPWA() {
  const [prompt, setPrompt] = useState(null);
  const [show, setShow] = useState(false);
  const [installed, setInstalled] = useState(false);

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setInstalled(true);
      return;
    }

    let timer;
    const handler = (e) => {
      e.preventDefault();
      setPrompt(e);
      const visits = Number(localStorage.getItem('ssc-visit-count') || '0') + 1;
      localStorage.setItem('ssc-visit-count', String(visits));
      const dismissedUntil = Number(localStorage.getItem('ssc-install-dismissed-until') || '0');

      // Avoid interrupting a new visitor while they are still understanding the site.
      if (Date.now() >= dismissedUntil) {
        timer = window.setTimeout(() => setShow(true), visits > 1 ? 20000 : 30000);
      }
    };

    const installedHandler = () => {
      setInstalled(true);
      setShow(false);
    };

    window.addEventListener('beforeinstallprompt', handler);
    window.addEventListener('appinstalled', installedHandler);

    return () => {
      window.clearTimeout(timer);
      window.removeEventListener('beforeinstallprompt', handler);
      window.removeEventListener('appinstalled', installedHandler);
    };
  }, []);

  function dismissInstall() {
    // A dismissal stays respected for one week.
    localStorage.setItem('ssc-install-dismissed-until', String(Date.now() + 7 * 24 * 60 * 60 * 1000));
    setShow(false);
  }

  async function handleInstall() {
    if (!prompt) return;
    prompt.prompt();
    const { outcome } = await prompt.userChoice;
    if (outcome === 'accepted') setInstalled(true);
    setShow(false);
  }

  if (installed || !show) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 28 }}
        className="install-pwa-banner fixed left-3 right-3 sm:left-auto sm:right-6 sm:w-80 z-[70]"
      >
        <div className="rounded-2xl p-3.5 sm:p-4 shadow-2xl shadow-black/50 flex items-center gap-3"
          style={{ background: 'linear-gradient(135deg, #0d1f3c, #0a1628)', border: '1px solid rgba(212,175,55,0.3)' }}>

          {/* Icon */}
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: 'linear-gradient(135deg, #D4AF37, #F0C040)' }}>
            <Smartphone className="w-6 h-6 text-navy-950" />
          </div>

          {/* Text */}
          <div className="flex-1 min-w-0">
            <div className="text-white font-bold text-sm">Install App</div>
            <div className="text-navy-400 text-xs mt-0.5 leading-tight">
              Add to home screen for quick access!
            </div>
          </div>

          {/* Buttons */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={handleInstall}
              aria-label="Install Smit Sir Commerce app"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-navy-950 transition-all"
              style={{ background: 'linear-gradient(135deg, #D4AF37, #F0C040)' }}
            >
              <Download className="w-3 h-3" /> Install
            </button>
            <button
              onClick={dismissInstall}
              aria-label="Dismiss install app suggestion"
              className="w-7 h-7 rounded-lg flex items-center justify-center text-navy-400 hover:text-white transition-colors"
              style={{ background: 'rgba(255,255,255,0.05)' }}
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
