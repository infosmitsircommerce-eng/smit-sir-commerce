import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GraduationCap } from 'lucide-react';

export default function PageLoader() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), 1600);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="loader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.5, ease: 'easeInOut' } }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center"
          style={{ background: 'var(--bg-ivory)' }}
        >
          {/* Faint ruled-paper lines */}
          <div className="absolute inset-0 pointer-events-none"
            style={{ backgroundImage: 'repeating-linear-gradient(180deg, transparent 0px, transparent 47px, rgba(184,135,47,0.05) 47px, rgba(184,135,47,0.05) 48px)' }} />

          <div className="relative flex flex-col items-center gap-6">
            {/* Logo icon */}
            <motion.div
              initial={{ scale: 0, rotate: -20 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.1 }}
              className="w-20 h-20 rounded-2xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #C9A050, #B8872F)', boxShadow: '0 12px 40px rgba(184,135,47,0.35)' }}
            >
              <GraduationCap className="w-10 h-10" style={{ color: '#1E1812' }} />
            </motion.div>

            {/* Brand name */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-center"
            >
              <div className="text-2xl leading-tight" style={{ fontFamily: 'var(--font-serif)', fontWeight: 700, color: 'var(--ink)' }}>Smit Sir</div>
              <div className="text-sm tracking-[0.3em] uppercase" style={{ fontFamily: 'var(--font-sans)', fontWeight: 700, color: 'var(--gold)' }}>Commerce</div>
            </motion.div>

            {/* Loading rule */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.45 }}
              className="w-48 h-px overflow-hidden rounded-full"
              style={{ background: 'var(--border)' }}
            >
              <motion.div
                initial={{ width: '0%' }}
                animate={{ width: '100%' }}
                transition={{ duration: 1, delay: 0.45, ease: 'easeInOut' }}
                className="h-full rounded-full"
                style={{ background: 'linear-gradient(90deg, var(--gold), var(--gold-soft))' }}
              />
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.55 }}
              className="text-xs"
              style={{ fontFamily: 'var(--font-accent)', fontStyle: 'italic', fontSize: '0.95rem', color: 'var(--muted)' }}
            >
              Where commerce concepts turn into marks.
            </motion.p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
