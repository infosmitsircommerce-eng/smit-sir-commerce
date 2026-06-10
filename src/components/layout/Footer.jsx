import { Link } from 'react-router-dom';
import { GraduationCap, Phone, Mail, MapPin, Instagram, MessageCircle } from 'lucide-react';

const quickLinks = [
  { label: 'Home', path: '/' },
  { label: 'Courses', path: '/courses' },
  { label: 'Lectures', path: '/lectures' },
  { label: 'Study Material', path: '/study-material' },
  { label: 'Test Series', path: '/test-series' },
  { label: 'About', path: '/about' },
  { label: 'Contact', path: '/contact' },
  { label: 'FAQ', path: '/faq' },
];

const class11Links = ['Accountancy', 'Business Studies', 'Economics', 'Entrepreneurship', 'Physical Education'];
const class12Links = ['Accountancy', 'Business Studies', 'Economics', 'Entrepreneurship', 'Physical Education'];

const mutedLink = { color: 'var(--muted-on-ink)' };
const headingStyle = { fontFamily: 'var(--font-serif)', fontWeight: 700, color: 'var(--ivory-on-ink)' };

function FooterLink({ to, children }) {
  return (
    <Link to={to} className="text-sm transition-colors" style={mutedLink}
      onMouseEnter={e => { e.currentTarget.style.color = 'var(--gold-bright)'; }}
      onMouseLeave={e => { e.currentTarget.style.color = 'var(--muted-on-ink)'; }}>
      {children}
    </Link>
  );
}

export default function Footer() {
  return (
    <footer style={{ background: 'var(--ink-bg)', borderTop: '1px solid rgba(201,160,80,0.2)' }}>
      {/* Double gold rule at the very top */}
      <div style={{ height: '1px', background: 'linear-gradient(90deg, transparent, rgba(201,160,80,0.4), transparent)' }} />
      <div style={{ height: '2px' }} />
      <div style={{ height: '1px', background: 'linear-gradient(90deg, transparent, rgba(201,160,80,0.15), transparent)' }} />

      {/* Main Footer */}
      <div className="page-container py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-3 mb-5">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, #C9A050, #B8872F)', boxShadow: '0 4px 18px rgba(184,135,47,0.3)' }}>
                <GraduationCap className="w-6 h-6" style={{ color: '#1E1812' }} />
              </div>
              <div>
                <div className="text-lg leading-tight" style={headingStyle}>Smit Sir</div>
                <div className="text-sm leading-tight" style={{ fontFamily: 'var(--font-sans)', fontWeight: 700, letterSpacing: '0.16em', color: 'var(--gold-bright)' }}>COMMERCE</div>
              </div>
            </Link>
            <p className="text-sm leading-relaxed mb-3" style={mutedLink}>
              Master Class 11 &amp; 12 Commerce with Smit Sir. CBSE-focused coaching for Economics, Business Studies, Accountancy &amp; Entrepreneurship in Mehsana, Gujarat.
            </p>
            <a href="tel:+916353709585" className="text-sm font-semibold transition-colors mb-5 inline-block" style={{ color: 'var(--gold-bright)' }}>
              📞 +91 63537 09585
            </a>
            <div className="flex items-center gap-3">
              <a href="https://instagram.com/smitthker" target="_blank" rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg flex items-center justify-center transition-all group"
                style={{ background: 'rgba(243,236,221,0.06)', border: '1px solid rgba(243,236,221,0.1)' }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(217,172,92,0.15)'; e.currentTarget.style.borderColor = 'rgba(217,172,92,0.4)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(243,236,221,0.06)'; e.currentTarget.style.borderColor = 'rgba(243,236,221,0.1)'; }}>
                <Instagram className="w-4 h-4" style={{ color: 'var(--gold-bright)' }} />
              </a>
              <a href="https://wa.me/916353709585?text=Hello%20Smit%20Sir%2C%20I%20want%20to%20know%20about%20Class%2011%2F12%20Commerce%20batch%20admission."
                className="w-9 h-9 rounded-lg flex items-center justify-center transition-all group"
                style={{ background: 'rgba(243,236,221,0.06)', border: '1px solid rgba(243,236,221,0.1)' }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(143,191,107,0.15)'; e.currentTarget.style.borderColor = 'rgba(143,191,107,0.4)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(243,236,221,0.06)'; e.currentTarget.style.borderColor = 'rgba(243,236,221,0.1)'; }}>
                <MessageCircle className="w-4 h-4" style={{ color: '#8FBF6B' }} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="mb-5" style={headingStyle}>Quick Links</h4>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.path}>
                  <FooterLink to={link.path}>{link.label}</FooterLink>
                </li>
              ))}
            </ul>
          </div>

          {/* Subjects */}
          <div>
            <h4 className="mb-5" style={headingStyle}>Subjects</h4>
            <div className="space-y-4">
              <div>
                <div className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--gold-bright)' }}>Class 11</div>
                <ul className="space-y-1">
                  {class11Links.map((s) => (
                    <li key={s}><FooterLink to="/courses">{s}</FooterLink></li>
                  ))}
                </ul>
              </div>
              <div>
                <div className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--gold-bright)' }}>Class 12</div>
                <ul className="space-y-1">
                  {class12Links.map((s) => (
                    <li key={s}><FooterLink to="/courses">{s}</FooterLink></li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="mb-5" style={headingStyle}>Contact</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <Phone className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: 'var(--gold-bright)' }} />
                <div>
                  <div className="text-sm font-medium" style={{ color: 'var(--ivory-on-ink)' }}>+91 63537 09585</div>
                  <div className="text-xs" style={mutedLink}>Mon–Sat, 9am–8pm</div>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: 'var(--gold-bright)' }} />
                <div className="text-sm" style={mutedLink}>infosmitsircommerce@gmail.com</div>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: 'var(--gold-bright)' }} />
                <div className="text-sm" style={mutedLink}>Mehsana, Gujarat, India</div>
              </li>
            </ul>
            <div className="mt-5">
              <Link to="/contact" className="btn-gold text-sm py-2 px-4 inline-flex">
                Book Free Demo
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div style={{ borderTop: '1px solid rgba(243,236,221,0.08)' }}>
        <div className="page-container py-5 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-sm" style={{ color: 'rgba(166,152,138,0.7)' }}>
            © 2026 Smit Sir Commerce ·{' '}
            <span style={{ fontFamily: 'var(--font-accent)', fontStyle: 'italic' }}>All accounts balanced.</span>
          </p>
          <div className="flex items-center gap-4">
            <FooterLink to="/faq">FAQ</FooterLink>
            <FooterLink to="/about">About</FooterLink>
            <FooterLink to="/contact">Contact</FooterLink>
          </div>
        </div>
      </div>
    </footer>
  );
}
