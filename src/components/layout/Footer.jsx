import { Link } from 'react-router-dom';
import { GraduationCap, Phone, Mail, MapPin, Instagram, MessageCircle, ArrowUpRight } from 'lucide-react';

const links = {
  Learn:   [
    { label: 'Courses',        path: '/courses' },
    { label: 'Lectures',       path: '/lectures' },
    { label: 'Study Material', path: '/study-material' },
    { label: 'Quizzes',        path: '/quizzes' },
    { label: 'Test Series',    path: '/test-series' },
  ],
  Explore: [
    { label: 'About',          path: '/about' },
    { label: 'Contact',        path: '/contact' },
    { label: 'FAQ',            path: '/faq' },
    { label: 'Ask AI Doubt',   path: '/ask' },
    { label: 'Dashboard',      path: '/dashboard' },
  ],
};

export default function Footer() {
  return (
    <footer style={{ background: '#0f1219', borderTop: '1px solid rgba(255,255,255,0.06)' }}>

      {/* Main */}
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '80px 32px 64px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1.4fr', gap: '60px' }}
          className="footer-grid">

          {/* Brand column */}
          <div>
            {/* Logo */}
            <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '12px', marginBottom: '24px', textDecoration: 'none' }}>
              <div style={{
                width: '40px', height: '40px', borderRadius: '10px', flexShrink: 0,
                background: 'linear-gradient(135deg, #C9A227, #f5d878)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 4px 16px rgba(212,175,55,0.25)',
              }}>
                <GraduationCap style={{ width: '20px', height: '20px', color: '#FFFFFF' }} />
              </div>
              <div>
                <div style={{
                  fontFamily: "'Playfair Display', Georgia, serif",
                  fontWeight: 700, fontSize: '18px', color: '#ffffff', lineHeight: 1.1,
                  letterSpacing: '-0.01em',
                }}>Smit Sir</div>
                <div style={{
                  fontFamily: "'Inter', system-ui, sans-serif",
                  fontWeight: 600, fontSize: '10px', color: '#d97706',
                  letterSpacing: '0.2em', textTransform: 'uppercase',
                }}>COMMERCE</div>
              </div>
            </Link>

            <p style={{
              fontSize: '14px', lineHeight: 1.75,
              color: 'rgba(255,255,255,0.45)',
              fontFamily: "'Inter', system-ui, sans-serif",
              maxWidth: '280px', marginBottom: '28px',
            }}>
              Expert CBSE Commerce coaching for Class 11 &amp; 12 in Mehsana, Gujarat — online and offline.
            </p>

            {/* Social icons */}
            <div style={{ display: 'flex', gap: '10px', marginBottom: '28px' }}>
              {[
                { icon: Instagram, href: 'https://instagram.com/smitthker', label: 'IG' },
                { icon: MessageCircle, href: 'https://wa.me/916353709585', label: 'WA' },
              ].map(({ icon: Icon, href, label }) => (
                <a key={label} href={href} target="_blank" rel="noopener noreferrer"
                  style={{
                    width: '36px', height: '36px', borderRadius: '8px',
                    border: '1px solid rgba(255,255,255,0.12)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: 'rgba(255,255,255,0.4)',
                    transition: 'all 0.2s',
                    background: 'rgba(255,255,255,0.04)',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = '#D4AF37'; e.currentTarget.style.color = '#D4AF37'; e.currentTarget.style.background = 'rgba(212,175,55,0.08)'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'; e.currentTarget.style.color = 'rgba(255,255,255,0.4)'; e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; }}
                >
                  <Icon style={{ width: '15px', height: '15px' }} />
                </a>
              ))}
            </div>

            {/* CTA */}
            <Link to="/contact" className="btn-primary"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '13px', padding: '10px 22px', borderRadius: '8px' }}>
              Book Free Demo
              <ArrowUpRight style={{ width: '13px', height: '13px' }} />
            </Link>
          </div>

          {/* Link columns */}
          {Object.entries(links).map(([group, items]) => (
            <div key={group}>
              <div style={{
                fontSize: '10.5px', fontWeight: 600,
                letterSpacing: '0.2em', textTransform: 'uppercase',
                color: '#94a3b8',
                fontFamily: "'Inter', system-ui, sans-serif",
                marginBottom: '20px',
              }}>
                {group}
              </div>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '11px' }}>
                {items.map(({ label, path }) => (
                  <li key={path}>
                    <Link to={path} style={{
                      fontSize: '14px', color: 'rgba(255,255,255,0.45)',
                      textDecoration: 'none',
                      fontFamily: "'Inter', system-ui, sans-serif",
                      transition: 'color 0.15s',
                    }}
                    onMouseEnter={e => e.currentTarget.style.color = '#D4AF37'}
                    onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.45)'}>
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Contact column */}
          <div>
            <div style={{
              fontSize: '10.5px', fontWeight: 600,
              letterSpacing: '0.2em', textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.3)',
              fontFamily: "'Inter', system-ui, sans-serif",
              marginBottom: '20px',
            }}>
              Contact
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {[
                { Icon: Phone, text: '+91 63537 09585',                 sub: 'Mon–Sat, 9am–8pm' },
                { Icon: Mail,  text: 'infosmitsircommerce@gmail.com',   sub: null },
                { Icon: MapPin,text: 'Mehsana, Gujarat, India',         sub: null },
              ].map(({ Icon, text, sub }) => (
                <div key={text} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                  <Icon style={{ width: '14px', height: '14px', color: 'rgba(212,175,55,0.6)', flexShrink: 0, marginTop: '3px' }} />
                  <div>
                    <div style={{ fontSize: '13.5px', color: 'rgba(255,255,255,0.6)', fontFamily: "'Inter', system-ui, sans-serif", lineHeight: 1.4 }}>
                      {text}
                    </div>
                    {sub && (
                      <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)', fontFamily: "'Inter', system-ui, sans-serif", marginTop: '2px' }}>
                        {sub}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* Bottom bar */}
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{
          maxWidth: '1280px', margin: '0 auto', padding: '20px 32px',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          flexWrap: 'wrap', gap: '12px',
        }}>
          <p style={{
            fontSize: '12.5px', color: 'rgba(255,255,255,0.25)',
            fontFamily: "'Inter', system-ui, sans-serif",
          }}>
            © 2026 Smit Sir Commerce. All rights reserved.
          </p>
          <div style={{ display: 'flex', gap: '24px' }}>
            {[['FAQ', '/faq'], ['About', '/about'], ['Contact', '/contact']].map(([label, path]) => (
              <Link key={path} to={path} style={{
                fontSize: '12px', color: 'rgba(255,255,255,0.3)',
                textDecoration: 'none', fontFamily: "'Inter', system-ui, sans-serif",
                transition: 'color 0.15s',
              }}
              onMouseEnter={e => e.currentTarget.style.color = '#D4AF37'}
              onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.3)'}>
                {label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 1023px) {
          .footer-grid { grid-template-columns: 1fr 1fr !important; gap: 40px !important; }
        }
        @media (max-width: 640px) {
          .footer-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </footer>
  );
}
