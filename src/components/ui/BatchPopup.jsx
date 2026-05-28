import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { X, Zap, Users, Clock } from 'lucide-react';

export default function BatchPopup() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Don't show if dismissed in last 24 hours
    const dismissed = localStorage.getItem('batch_popup_dismissed');
    if (dismissed && Date.now() - Number(dismissed) < 86400000) return;

    const timer = setTimeout(() => setVisible(true), 3500);
    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setVisible(false);
    localStorage.setItem('batch_popup_dismissed', Date.now().toString());
  };

  return (
    <AnimatePresence>
      {visible && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[998] bg-black/50 backdrop-blur-sm"
            onClick={handleClose}
          />

          {/* Popup */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 40 }}
            transition={{ type: 'spring', stiffness: 260, damping: 22 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[999] w-[calc(100vw-2rem)] max-w-sm"
          >
            <div className="relative bg-navy-900 border border-gold-500/30 rounded-2xl p-6 shadow-[0_20px_60px_rgba(0,0,0,0.6),0_0_0_1px_rgba(245,158,11,0.1)]">
              {/* Gold top accent */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-px bg-gradient-to-r from-transparent via-gold-500 to-transparent rounded-full" />

              {/* Close button */}
              <button
                onClick={handleClose}
                className="absolute top-3 right-3 w-7 h-7 bg-navy-800 hover:bg-navy-700 rounded-lg flex items-center justify-center text-navy-400 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Badge */}
              <div className="inline-flex items-center gap-1.5 bg-gold-500/15 border border-gold-500/30 rounded-full px-3 py-1 text-gold-400 text-xs font-semibold mb-4">
                <span className="w-1.5 h-1.5 bg-gold-400 rounded-full animate-pulse" />
                New Batch Announcement
              </div>

              <h3 className="font-display font-bold text-white text-xl mb-2">
                🎓 New Batch Starting Soon!
              </h3>
              <p className="text-navy-300 text-sm mb-5 leading-relaxed">
                Class 11 &amp; 12 Commerce batches — Online &amp; Offline. <span className="text-gold-400 font-semibold">Limited seats available.</span>
              </p>

              {/* Info row */}
              <div className="flex items-center gap-4 mb-5">
                <div className="flex items-center gap-1.5 text-navy-400 text-xs">
                  <Users className="w-3.5 h-3.5 text-gold-400" />
                  Limited Seats
                </div>
                <div className="flex items-center gap-1.5 text-navy-400 text-xs">
                  <Zap className="w-3.5 h-3.5 text-emerald-400" />
                  Online + Offline
                </div>
                <div className="flex items-center gap-1.5 text-navy-400 text-xs">
                  <Clock className="w-3.5 h-3.5 text-blue-400" />
                  Mehsana, Gujarat
                </div>
              </div>

              {/* CTA */}
              <div className="flex gap-2">
                <Link
                  to="/contact"
                  onClick={handleClose}
                  className="flex-1 btn-primary text-center text-sm py-2.5"
                >
                  Book Free Demo
                </Link>
                <a
                  href="https://wa.me/916353709585?text=Hello%20Smit%20Sir%2C%20I%20want%20to%20know%20about%20the%20new%20batch."
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={handleClose}
                  className="flex-1 btn-secondary text-center text-sm py-2.5"
                >
                  WhatsApp Us
                </a>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
