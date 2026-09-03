import { Link } from 'react-router-dom';
import { GraduationCap, Phone, Mail, MapPin, ShieldCheck, CircleHelp, FileText, LockKeyhole } from 'lucide-react';

const quickLinks = [
  { label: 'Home', path: '/' },
  { label: 'Free Commerce Calculators', path: '/tools' },
  { label: 'Commerce Tuition Mehsana', path: '/commerce-coaching-mehsana' },
  { label: 'Class 11 Commerce Mehsana', path: '/class-11-commerce-tuition-mehsana' },
  { label: 'Class 12 Commerce Mehsana', path: '/class-12-commerce-tuition-mehsana' },
  { label: 'Free Paper Analysis', path: '/book-demo' },
  { label: 'Study Material', path: '/study-material' },
  { label: 'Test Series', path: '/test-series' },
  { label: 'Contact', path: '/contact' },
];

const classLinks = ['Economics', 'Business Studies', 'Entrepreneurship', 'Physical Education'];

const localSubjectLinks = [
  { label: 'Economics Tuition in Mehsana', path: '/economics-tuition-mehsana' },
  { label: 'Business Studies Tuition in Mehsana', path: '/business-studies-tuition-mehsana' },
];

const legalLinks = [
  { label: 'Privacy Policy', path: '/privacy', icon: ShieldCheck },
  { label: 'FAQ / Help', path: '/faq', icon: CircleHelp },
  { label: 'Terms of Use', path: '/terms', icon: FileText },
  { label: 'Access Policy', path: '/access-policy', icon: LockKeyhole },
];

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
      <div style={{ height: '1px', background: 'linear-gradient(90deg, transparent, rgba(201,160,80,0.4), transparent)' }} />
      <div style={{ height: '2px' }} />
      <div style={{ height: '1px', background: 'linear-gradient(90deg, transparent, rgba(201,160,80,0.15), transparent)' }} />

      <div className="page-container py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-10">
          <div>
            <Link to="/" className="flex items-center gap-3 mb-5">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #C9A050, #B8872F)', boxShadow: '0 4px 18px rgba(184,135,47,0.3)' }}><GraduationCap className="w-6 h-6" style={{ color: '#1E1812' }} /></div>
              <div><div className="text-lg leading-tight" style={headingStyle}>Smit Sir</div><div className="text-sm leading-tight" style={{ fontFamily: 'var(--font-sans)', fontWeight: 700, letterSpacing: '0.16em', color: 'var(--gold-bright)' }}>COMMERCE</div></div>
            </Link>
            <p className="text-sm leading-relaxed mb-3" style={mutedLink}>Class 11 &amp; 12 Commerce learning in Mehsana for Economics, Business Studies and Entrepreneurship, with supporting study resources, calculators, practice and tests.</p>
            <a href="tel:+916353709585" className="text-sm font-semibold transition-colors inline-block" style={{ color: 'var(--gold-bright)' }}>📞 +91 63537 09585</a>
          </div>

          <div>
            <h4 className="mb-5" style={headingStyle}>Explore</h4>
            <ul className="space-y-2">{quickLinks.map((link) => <li key={link.path}><FooterLink to={link.path}>{link.label}</FooterLink></li>)}</ul>
          </div>

          <div>
            <h4 className="mb-5" style={headingStyle}>Subjects</h4>
            <div className="space-y-4">
              <div><div className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--gold-bright)' }}>Local subject pages</div><ul className="space-y-1">{localSubjectLinks.map((s) => <li key={s.path}><FooterLink to={s.path}>{s.label}</FooterLink></li>)}</ul></div>
              <div><div className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--gold-bright)' }}>Class 11 &amp; 12</div><ul className="space-y-1">{classLinks.map((s) => <li key={s}><FooterLink to="/courses">{s}</FooterLink></li>)}</ul></div>
            </div>
          </div>

          <div>
            <h4 className="mb-5" style={headingStyle}>Legal &amp; Help</h4>
            <ul className="space-y-3">
              {legalLinks.map(({ label, path, icon: Icon }) => (
                <li key={path}>
                  <Link to={path} className="group flex items-center gap-2.5 text-sm transition-colors" style={mutedLink}>
                    <Icon className="w-4 h-4 flex-shrink-0" style={{ color: 'var(--gold-bright)' }} />
                    <span className="group-hover:text-amber-300 transition-colors">{label}</span>
                  </Link>
                </li>
              ))}
              <li><FooterLink to="/about">About Smit Sir Commerce</FooterLink></li>
              <li><FooterLink to="/contact">Contact &amp; Support</FooterLink></li>
            </ul>
          </div>

          <div>
            <h4 className="mb-5" style={headingStyle}>Contact &amp; Local Area</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3"><Phone className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: 'var(--gold-bright)' }} /><div><a href="tel:+916353709585" className="text-sm font-medium" style={{ color: 'var(--ivory-on-ink)' }}>+91 63537 09585</a><div className="text-xs" style={mutedLink}>Call for demo and batch enquiries</div></div></li>
              <li className="flex items-start gap-3"><Mail className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: 'var(--gold-bright)' }} /><a href="mailto:infosmitsircommerce@gmail.com" className="text-sm break-all" style={mutedLink}>infosmitsircommerce@gmail.com</a></li>
              <li className="flex items-start gap-3"><MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: 'var(--gold-bright)' }} /><div className="text-sm" style={mutedLink}>Mehsana, Gujarat, India</div></li>
            </ul>
            <div className="mt-5 flex flex-col gap-2 items-start"><Link to="/book-demo" className="btn-gold text-sm py-2 px-4 inline-flex">Free Paper Analysis / Demo</Link><FooterLink to="/tools">Free Commerce calculators</FooterLink><FooterLink to="/commerce-coaching-mehsana">Commerce tuition in Mehsana</FooterLink></div>
          </div>
        </div>
      </div>

      <div style={{ borderTop: '1px solid rgba(243,236,221,0.10)' }}>
        <div className="page-container py-5 flex flex-col lg:flex-row items-center justify-between gap-4">
          <p className="text-sm text-center lg:text-left" style={{ color: 'rgba(200,190,176,0.82)' }}>
            © 2026 <strong style={{ color: 'var(--ivory-on-ink)', fontWeight: 600 }}>Smit Sir Commerce</strong>. All rights reserved.
          </p>
          <div className="flex flex-wrap justify-center items-center gap-x-4 gap-y-2">
            <FooterLink to="/privacy">Privacy Policy</FooterLink>
            <FooterLink to="/faq">FAQ</FooterLink>
            <FooterLink to="/terms">Terms of Use</FooterLink>
            <FooterLink to="/access-policy">Access Policy</FooterLink>
          </div>
        </div>
      </div>
    </footer>
  );
}
