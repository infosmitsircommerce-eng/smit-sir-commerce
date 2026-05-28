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

    const handler = (e) => {
      e.preventDefault();
      setPrompt(e);
      // Show banner after 10 seconds
      setTimeout(() => setShow(true), 10000);
    };

    window.addEventListener('beforeinstallprompt', handler);
    window.addEventListener('appinstalled', () => setInstalled(true));

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

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
        className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:w-80 z-50"
      >
        <div className="rounded-2xl p-4 shadow-2xl shadow-black/50 flex items-center gap-3"
          style={{ background: 'linear-gradient(135deg, #0d1f3c, #0a1628)', border: '1px solid rgba(212,175,55,0.3)' }}>

          {/* Icon */}
          <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
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
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-navy-950 transition-all"
              style={{ background: 'linear-gradient(135deg, #D4AF37, #F0C040)' }}
            >
              <Download className="w-3 h-3" /> Install
            </button>
            <button
              onClick={() => setShow(false)}
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
