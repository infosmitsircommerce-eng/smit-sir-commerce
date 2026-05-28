import { motion, AnimatePresence } from 'framer-motion';
import { X, Clock, Bell, MessageCircle } from 'lucide-react';

export default function ComingSoonModal({ visible, onClose, title = 'Content Coming Soon!' }) {
  return (
    <AnimatePresence>
      {visible && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[998] bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 30 }}
            transition={{ type: 'spring', stiffness: 280, damping: 22 }}
            className="fixed inset-0 z-[999] flex items-center justify-center p-4 pointer-events-none"
          >
            <div className="pointer-events-auto w-full max-w-sm bg-navy-900 border border-navy-700/60 rounded-2xl p-7 shadow-[0_24px_60px_rgba(0,0,0,0.6)] relative overflow-hidden">

              {/* Gold top line */}
              <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-gold-500 to-transparent" />

              {/* Close */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 w-8 h-8 bg-navy-800 hover:bg-navy-700 rounded-lg flex items-center justify-center text-navy-400 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Icon */}
              <div className="w-16 h-16 bg-gold-500/15 border border-gold-500/25 rounded-2xl flex items-center justify-center mx-auto mb-5 text-3xl">
                🚀
              </div>

              {/* Text */}
              <h3 className="font-display font-bold text-white text-xl text-center mb-2">
                {title}
              </h3>
              <p className="text-navy-400 text-sm text-center leading-relaxed mb-6">
                This content is being prepared by <span className="text-white font-medium">Smit Sir</span> and will be uploaded very soon. Stay tuned!
              </p>

              {/* Info pills */}
              <div className="flex justify-center gap-3 mb-6">
                <div className="flex items-center gap-1.5 bg-navy-800 border border-navy-700 rounded-full px-3 py-1.5 text-xs text-navy-300">
                  <Clock className="w-3.5 h-3.5 text-gold-400" />
                  Uploading Soon
                </div>
                <div className="flex items-center gap-1.5 bg-navy-800 border border-navy-700 rounded-full px-3 py-1.5 text-xs text-navy-300">
                  <Bell className="w-3.5 h-3.5 text-emerald-400" />
                  Free to Access
                </div>
              </div>

              {/* WhatsApp CTA */}
              <a
                href="https://wa.me/916353709585?text=Hello%20Smit%20Sir%2C%20please%20notify%20me%20when%20new%20content%20is%20uploaded%20on%20the%20website."
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full bg-[#25D366] hover:bg-[#20c05c] text-white font-semibold py-3 rounded-xl transition-all duration-200 text-sm shadow-[0_2px_12px_rgba(37,211,102,0.3)]"
                onClick={onClose}
              >
                <MessageCircle className="w-4 h-4" />
                Get Notified on WhatsApp
              </a>

              <button
                onClick={onClose}
                className="mt-3 w-full text-navy-500 hover:text-navy-300 text-sm py-2 transition-colors"
              >
                Go Back
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
