import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ChevronDown, GraduationCap, LogOut, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const navLinks = [
  { label: 'Home', path: '/' },
  {
    label: 'Learn',
    children: [
      { label: '📚 Courses', path: '/courses' },
      { label: '🎥 Lectures', path: '/lectures' },
      { label: '📄 Study Material', path: '/study-material' },
    ],
  },
  {
    label: 'Practice',
    children: [
      { label: '🤖 Ask AI Doubt', path: '/ask' },
      { label: '🎬 Reel Generator', path: '/reel' },
      { label: '📝 Quizzes', path: '/quizzes' },
      { label: '📊 Test Series', path: '/test-series' },
      { label: '🎮 Games', path: '/games' },
      { label: '🃏 Flashcards', path: '/flashcards' },
    ],
  },
  {
    label: 'Batches',
    children: [
      { label: '🏫 Online Batch', path: '/online-batch' },
      { label: '🏛️ Offline Batch', path: '/offline-batch' },
      { label: '📺 Live Classes', path: '/live-classes' },
    ],
  },
  { label: 'Contact', path: '/contact' },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, displayName, initials, isPremium, signOut } = useAuth();

  async function handleLogout() {
    await signOut();
    setUserMenuOpen(false);
    navigate('/');
  }

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
    setOpenDropdown(null);
  }, [location]);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      style={scrolled ? {
        background: 'rgba(10,15,44,0.85)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(212,175,55,0.1)',
        boxShadow: '0 4px 30px rgba(0,0,0,0.3)',
      } : {
        background: 'transparent',
      }}
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 hidden lg:block"
    >
      <div className="page-container">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-gradient-to-br from-gold-400 to-gold-600 rounded-xl flex items-center justify-center shadow-gold group-hover:scale-110 transition-transform">
              <GraduationCap className="w-5 h-5 text-navy-950" />
            </div>
            <div>
              <div className="font-display font-bold text-white text-sm leading-tight">Smit Sir</div>
              <div className="font-display font-bold text-gold-400 text-xs leading-tight tracking-wide">COMMERCE</div>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) =>
              link.children ? (
                <div key={link.label} className="relative">
                  <button
                    className="nav-link flex items-center gap-1 px-3 py-2 rounded-lg hover:bg-navy-800/50"
                    onMouseEnter={() => setOpenDropdown(link.label)}
                    onMouseLeave={() => setOpenDropdown(null)}
                  >
                    {link.label}
                    <ChevronDown className="w-3 h-3" />
                  </button>
                  <AnimatePresence>
                    {openDropdown === link.label && (
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 8 }}
                        className="absolute top-full left-0 mt-1 bg-navy-900 border border-navy-700 rounded-xl shadow-navy py-2 min-w-[180px]"
                        onMouseEnter={() => setOpenDropdown(link.label)}
                        onMouseLeave={() => setOpenDropdown(null)}
                      >
                        {link.children.map((child) => (
                          <Link
                            key={child.path}
                            to={child.path}
                            className="block px-4 py-2 text-sm text-navy-200 hover:text-gold-400 hover:bg-navy-800 transition-colors"
                          >
                            {child.label}
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`relative nav-link px-3 py-2 rounded-lg hover:bg-navy-800/50 ${
                    location.pathname === link.path ? 'text-gold-400' : ''
                  }`}
                >
                  {link.label}
                  {location.pathname === link.path && (
                    <motion.span
                      layoutId="nav-indicator"
                      className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-gold-400 rounded-full"
                    />
                  )}
                </Link>
              )
            )}
          </div>

          {/* CTA */}
          <div className="hidden lg:flex items-center gap-3">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(o => !o)}
                  className="flex items-center gap-2 bg-navy-800 hover:bg-navy-700 border border-navy-700 rounded-xl px-3 py-2 transition-colors"
                >
                  <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-navy-950"
                    style={{ background: 'linear-gradient(135deg, #D4AF37, #F0C040)' }}>
                    {initials}
                  </div>
                  <span className="text-white text-sm font-medium max-w-[100px] truncate">{displayName}</span>
                  {isPremium && (
                    <span className="text-xs px-1.5 py-0.5 rounded-full font-bold"
                      style={{ background: 'rgba(212,175,55,0.15)', color: '#D4AF37', border: '1px solid rgba(212,175,55,0.3)' }}>
                      PRO
                    </span>
                  )}
                  <ChevronDown className="w-3.5 h-3.5 text-navy-400" />
                </button>
                <AnimatePresence>
                  {userMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      className="absolute right-0 top-full mt-2 bg-navy-900 border border-navy-700 rounded-xl shadow-navy py-2 min-w-[180px] z-50"
                    >
                      <Link to="/dashboard" onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-navy-200 hover:text-gold-400 hover:bg-navy-800 transition-colors">
                        <User className="w-4 h-4" /> My Dashboard
                      </Link>
                      <button onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-400 hover:bg-navy-800 transition-colors">
                        <LogOut className="w-4 h-4" /> Logout
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link to="/login" className="btn-navy text-sm py-2 px-4">Login</Link>
            )}
            <Link to="/contact" className="btn-primary text-sm py-2 px-5">Book Free Demo</Link>
          </div>

          {/* Mobile Toggle */}
          <button
            className="lg:hidden text-white p-2 rounded-lg hover:bg-navy-800"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-navy-950/98 backdrop-blur-xl border-t border-navy-800"
          >
            <div className="page-container py-4 space-y-1">
              {navLinks.map((link) =>
                link.children ? (
                  <div key={link.label} className="mb-1">
                    <div className="flex items-center gap-2 px-3 py-2">
                      <span className="text-navy-400 text-xs font-bold uppercase tracking-wider">{link.label}</span>
                      <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.06)' }} />
                    </div>
                    {link.children.map((child) => (
                      <Link key={child.path} to={child.path}
                        className={`block px-5 py-2 text-sm rounded-lg hover:bg-navy-800 transition-colors ${
                          location.pathname === child.path ? 'text-gold-400' : 'text-navy-200 hover:text-gold-400'
                        }`}>
                        {child.label}
                      </Link>
                    ))}
                  </div>
                ) : (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`block px-3 py-2 rounded-lg hover:bg-navy-800 ${
                      location.pathname === link.path ? 'text-gold-400 bg-navy-800/50' : 'text-navy-200'
                    }`}
                  >
                    {link.label}
                  </Link>
                )
              )}
              <div className="pt-3 flex flex-col gap-2">
                {user ? (
                  <>
                    <Link to="/dashboard" className="btn-navy text-center text-sm py-2">My Dashboard</Link>
                    <button onClick={handleLogout} className="text-red-400 text-sm py-2 hover:text-red-300 transition-colors">Logout</button>
                  </>
                ) : (
                  <Link to="/login" className="btn-navy text-center text-sm py-2">Login</Link>
                )}
                <Link to="/contact" className="btn-primary text-center text-sm py-2">Book Free Demo Class</Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
