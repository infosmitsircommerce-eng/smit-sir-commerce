import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { Home, BookOpen, Brain, BarChart3, CalendarCheck2 } from 'lucide-react';

const TABS = [
  { path: '/',                  icon: Home,           label: 'Home' },
  { path: '/cbse-notes',        icon: BookOpen,       label: 'Notes' },
  { path: '/daily-practice',    icon: Brain,          label: 'Practice' },
  { path: '/book-demo',         icon: CalendarCheck2, label: 'Free Demo', highlight: true },
  { path: '/learning-insights', icon: BarChart3,      label: 'Progress' },
];

export default function MobileBottomBar() {
  const { pathname } = useLocation();
  const isActive = (path) => path === '/' ? pathname === '/' : pathname.startsWith(path);

  return (
    <motion.div
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ delay: 0.25, type: 'spring', stiffness: 260, damping: 28 }}
      className="mobile-bottom-shell fixed bottom-0 left-0 right-0 z-40 lg:hidden"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <div className="mobile-bottom-surface relative">
        <nav aria-label="Primary mobile navigation" className="flex items-end justify-around px-1.5 pt-2 pb-1.5 min-h-[66px]">
          {TABS.map((tab) => {
            const active = isActive(tab.path);
            const Icon = tab.icon;
            return (
              <Link
                key={tab.path}
                to={tab.path}
                className="mobile-bottom-item relative flex flex-col items-center justify-end gap-1 flex-1 min-h-12 py-1 active:scale-95"
                aria-current={active ? 'page' : undefined}
                aria-label={tab.highlight ? 'Book your free demo class' : tab.label}
              >
                {tab.highlight ? (
                  <motion.div
                    whileTap={{ scale: 0.92 }}
                    className="mobile-demo-orb w-12 h-12 rounded-2xl flex items-center justify-center -mt-5"
                  >
                    <Icon className="w-5 h-5 text-navy-950" strokeWidth={2.6} />
                  </motion.div>
                ) : (
                  <div className="relative w-10 h-8 flex items-center justify-center">
                    <AnimatePresence>
                      {active && (
                        <motion.div
                          layoutId="activeMobileTab"
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          className="mobile-tab-active absolute inset-0 rounded-xl"
                        />
                      )}
                    </AnimatePresence>
                    <Icon
                      className="w-5 h-5 relative z-10 transition-all"
                      style={{ color: active ? '#D9AC5C' : 'rgba(148,163,184,0.72)' }}
                      strokeWidth={active ? 2.5 : 1.9}
                    />
                  </div>
                )}
                <span
                  className="mobile-bottom-label text-[10px] font-bold leading-none"
                  style={{ color: tab.highlight ? '#E8C978' : active ? '#D9AC5C' : 'rgba(203,213,225,0.68)' }}
                >
                  {tab.label}
                </span>
              </Link>
            );
          })}
        </nav>
      </div>
    </motion.div>
  );
}
