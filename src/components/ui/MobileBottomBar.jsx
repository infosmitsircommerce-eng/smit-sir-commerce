import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { Home, BookOpen, Brain, LayoutDashboard, GraduationCap } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const TABS = [
  { path: '/',          icon: Home,            label: 'Home'      },
  { path: '/courses',   icon: GraduationCap,   label: 'Courses'   },
  { path: '/ask',       icon: Brain,           label: 'Ask AI',   highlight: true },
  { path: '/quizzes',   icon: BookOpen,        label: 'Quiz'      },
  { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
];

export default function MobileBottomBar() {
  const { pathname } = useLocation();
  const { user } = useAuth();

  const isActive = (path) => {
    if (path === '/') return pathname === '/';
    return pathname.startsWith(path);
  };

  return (
    <motion.div
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ delay: 0.5, type: 'spring', stiffness: 260, damping: 28 }}
      className="fixed bottom-0 left-0 right-0 z-40 lg:hidden"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      {/* Blur backdrop */}
      <div className="relative"
        style={{
          background: 'rgba(24,19,16,0.94)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderTop: '1px solid rgba(255,255,255,0.07)',
          boxShadow: '0 -8px 32px rgba(0,0,0,0.5)',
        }}>

        <div className="flex items-center justify-around px-2 py-2">
          {TABS.map((tab) => {
            const active = isActive(tab.path);
            const Icon = tab.icon;
            const showDot = tab.path === '/dashboard' && !user;

            return (
              <Link
                key={tab.path}
                to={tab.path}
                className="relative flex flex-col items-center justify-center gap-0.5 flex-1 py-1 transition-all active:scale-90"
              >
                {/* Highlight pill for "Ask AI" */}
                {tab.highlight ? (
                  <motion.div
                    whileTap={{ scale: 0.9 }}
                    className="w-12 h-12 rounded-2xl flex items-center justify-center mb-0.5 -mt-4"
                    style={{
                      background: active
                        ? 'linear-gradient(135deg, #C9A050, #B8872F)'
                        : 'linear-gradient(135deg, rgba(201,160,80,0.9), rgba(184,135,47,0.9))',
                      boxShadow: '0 4px 20px rgba(201,160,80,0.4)',
                    }}
                  >
                    <Icon className="w-5 h-5 text-navy-950" strokeWidth={2.5} />
                  </motion.div>
                ) : (
                  <div className="relative w-10 h-8 flex items-center justify-center">
                    {/* Active indicator pill */}
                    <AnimatePresence>
                      {active && (
                        <motion.div
                          layoutId="activeTab"
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          className="absolute inset-0 rounded-xl"
                          style={{ background: 'rgba(201,160,80,0.12)' }}
                        />
                      )}
                    </AnimatePresence>

                    <Icon
                      className="w-5 h-5 relative z-10 transition-all"
                      style={{ color: active ? '#D9AC5C' : 'rgba(148,163,184,0.6)' }}
                      strokeWidth={active ? 2.5 : 1.8}
                    />

                    {/* Notification dot */}
                    {showDot && (
                      <div className="absolute top-0.5 right-0.5 w-2 h-2 rounded-full bg-red-500 border border-navy-950" />
                    )}
                  </div>
                )}

                {/* Label */}
                <span
                  className="text-[10px] font-semibold transition-all leading-none"
                  style={{
                    color: tab.highlight
                      ? '#D9AC5C'
                      : active ? '#D9AC5C' : 'rgba(148,163,184,0.5)',
                  }}
                >
                  {tab.label}
                </span>
              </Link>
            );
          })}
        </div>

      </div>
    </motion.div>
  );
}
