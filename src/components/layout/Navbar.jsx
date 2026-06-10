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

// Routes that use the light editorial (ivory) theme
const LIGHT_ROUTES = ['/'];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, displayName, initials, isPremium, signOut } = useAuth();

  const light = LIGHT_ROUTES.includes(location.pathname);

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

  // Theme palette for the two nav variants
  const T = light ? {
    scrolledBg: {
      background: 'rgba(250,246,238,0.88)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      borderBottom: '1px solid rgba(184,135,47,0.18)',
      boxShadow: '0 4px 24px rgba(30,24,18,0.06)',
    },
    linkColor: 'var(--charcoal)',
    linkActive: 'var(--gold)',
    linkHoverBg: 'rgba(184,135,47,0.07)',
    brandTop: 'var(--ink)',
    dropdownBg: { background: '#FFFFFF', border: '1px solid var(--border)', boxShadow: 'var(--shadow-md)' },
    dropdownItem: 'var(--charcoal)',
    dropdownItemHoverBg: 'var(--bg-ivory)',
  } : {
    scrolledBg: {
      background: 'rgba(10,15,44,0.85)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      borderBottom: '1px solid rgba(212,175,55,0.1)',
      boxShadow: '0 4px 30px rgba(0,0,0,0.3)',
    },
    linkColor: '#c7d7fe',
    linkActive: '#D9AC5C',
    linkHoverBg: 'rgba(55,48,163,0.4)',
    brandTop: '#fff',
    dropdownBg: { background: '#1e1b5e', border: '1px solid #4338c2', boxShadow: '0 4px 24px rgba(30,27,94,0.4)' },
    dropdownItem: '#c7d7fe',
    dropdownItemHoverBg: '#3730a3',
  };

  const linkStyle = (active) => ({
    color: active ? T.linkActive : T.linkColor,
    fontFamily: 'var(--font-sans)',
  });

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      style={scrolled ? T.scrolledBg : { background: 'transparent' }}
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 hidden lg:block"
    >
      <div className="page-container">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform"
              style={{
                background: 'linear-gradient(135deg, #C9A050, #B8872F)',
                boxShadow: '0 4px 16px rgba(184,135,47,0.3)',
              }}>
              <GraduationCap className="w-5 h-5" style={{ color: '#1E1812' }} />
            </div>
            <div>
              <div className="text-sm leading-tight" style={{ fontFamily: 'var(--font-serif)', fontWeight: 700, color: T.brandTop }}>Smit Sir</div>
              <div className="text-xs leading-tight" style={{ fontFamily: 'var(--font-sans)', fontWeight: 700, letterSpacing: '0.14em', color: 'var(--gold)' }}>COMMERCE</div>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) =>
              link.children ? (
                <div key={link.label} className="relative">
                  <button
                    className="flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                    style={linkStyle(false)}
                    onMouseEnter={(e) => { setOpenDropdown(link.label); e.currentTarget.style.background = T.linkHoverBg; e.currentTarget.style.color = T.linkActive; }}
                    onMouseLeave={(e) => { setOpenDropdown(null); e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = T.linkColor; }}
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
                        className="absolute top-full left-0 mt-1 rounded-xl py-2 min-w-[190px]"
                        style={T.dropdownBg}
                        onMouseEnter={() => setOpenDropdown(link.label)}
                        onMouseLeave={() => setOpenDropdown(null)}
                      >
                        {link.children.map((child) => (
                          <Link
                            key={child.path}
                            to={child.path}
                            className="block px-4 py-2 text-sm transition-colors"
                            style={{ color: T.dropdownItem }}
                            onMouseEnter={e => { e.currentTarget.style.background = T.dropdownItemHoverBg; e.currentTarget.style.color = T.linkActive; }}
                            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = T.dropdownItem; }}
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
                  className="relative px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                  style={linkStyle(location.pathname === link.path)}
                  onMouseEnter={e => { e.currentTarget.style.background = T.linkHoverBg; e.currentTarget.style.color = T.linkActive; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = location.pathname === link.path ? T.linkActive : T.linkColor; }}
                >
                  {link.label}
                  {location.pathname === link.path && (
                    <motion.span
                      layoutId="nav-indicator"
                      className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 rounded-full"
                      style={{ background: 'var(--gold)' }}
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
                  className="flex items-center gap-2 rounded-xl px-3 py-2 transition-colors"
                  style={light
                    ? { background: 'var(--bg-white)', border: '1px solid var(--border)' }
                    : { background: '#3730a3', border: '1px solid #4338c2' }}
                >
                  <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
                    style={{ background: 'linear-gradient(135deg, #C9A050, #B8872F)', color: '#1E1812' }}>
                    {initials}
                  </div>
                  <span className="text-sm font-medium max-w-[100px] truncate" style={{ color: light ? 'var(--ink)' : '#fff' }}>{displayName}</span>
                  {isPremium && (
                    <span className="text-xs px-1.5 py-0.5 rounded-full font-bold"
                      style={{ background: 'rgba(184,135,47,0.12)', color: 'var(--gold)', border: '1px solid rgba(184,135,47,0.3)' }}>
                      PRO
                    </span>
                  )}
                  <ChevronDown className="w-3.5 h-3.5" style={{ color: light ? 'var(--subtle)' : '#8193f1' }} />
                </button>
                <AnimatePresence>
                  {userMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      className="absolute right-0 top-full mt-2 rounded-xl py-2 min-w-[180px] z-50"
                      style={T.dropdownBg}
                    >
                      <Link to="/dashboard" onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-sm transition-colors"
                        style={{ color: T.dropdownItem }}
                        onMouseEnter={e => { e.currentTarget.style.background = T.dropdownItemHoverBg; }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}>
                        <User className="w-4 h-4" /> My Dashboard
                      </Link>
                      <button onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-400 transition-colors"
                        onMouseEnter={e => { e.currentTarget.style.background = T.dropdownItemHoverBg; }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}>
                        <LogOut className="w-4 h-4" /> Logout
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link to="/login"
                className="text-sm py-2 px-4 rounded-xl font-semibold transition-all"
                style={light
                  ? { color: 'var(--ink)', border: '1px solid var(--border)', background: 'var(--bg-white)' }
                  : { color: '#fff', border: '1px solid #4338c2', background: '#3730a3' }}>
                Login
              </Link>
            )}
            <Link to="/contact" className="btn-primary text-sm py-2 px-5">Book Free Demo</Link>
          </div>

          {/* Mobile Toggle */}
          <button
            className="lg:hidden p-2 rounded-lg"
            style={{ color: light ? 'var(--ink)' : '#fff' }}
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
            className="lg:hidden backdrop-blur-xl"
            style={light
              ? { background: 'rgba(250,246,238,0.98)', borderTop: '1px solid var(--border)' }
              : { background: 'rgba(15,13,46,0.98)', borderTop: '1px solid #3730a3' }}
          >
            <div className="page-container py-4 space-y-1">
              {navLinks.map((link) =>
                link.children ? (
                  <div key={link.label} className="mb-1">
                    <div className="flex items-center gap-2 px-3 py-2">
                      <span className="text-xs font-bold uppercase tracking-wider" style={{ color: light ? 'var(--subtle)' : '#8193f1' }}>{link.label}</span>
                      <div className="flex-1 h-px" style={{ background: light ? 'var(--border)' : 'rgba(255,255,255,0.06)' }} />
                    </div>
                    {link.children.map((child) => (
                      <Link key={child.path} to={child.path}
                        className="block px-5 py-2 text-sm rounded-lg transition-colors"
                        style={{ color: location.pathname === child.path ? 'var(--gold)' : (light ? 'var(--charcoal)' : '#c7d7fe') }}>
                        {child.label}
                      </Link>
                    ))}
                  </div>
                ) : (
                  <Link
                    key={link.path}
                    to={link.path}
                    className="block px-3 py-2 rounded-lg"
                    style={{ color: location.pathname === link.path ? 'var(--gold)' : (light ? 'var(--charcoal)' : '#c7d7fe') }}
                  >
                    {link.label}
                  </Link>
                )
              )}
              <div className="pt-3 flex flex-col gap-2">
                {user ? (
                  <>
                    <Link to="/dashboard" className="btn-outline-ink text-center text-sm py-2">My Dashboard</Link>
                    <button onClick={handleLogout} className="text-red-400 text-sm py-2 hover:text-red-300 transition-colors">Logout</button>
                  </>
                ) : (
                  <Link to="/login" className="btn-outline-ink text-center text-sm py-2">Login</Link>
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
