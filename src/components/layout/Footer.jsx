import { Link } from 'react-router-dom';
import { GraduationCap, Phone, Mail, MapPin, Instagram, Youtube, MessageCircle } from 'lucide-react';

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

export default function Footer() {
  return (
    <footer className="bg-navy-950 border-t border-navy-800/50">
      {/* Main Footer */}
      <div className="page-container py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-3 mb-5">
              <div className="w-12 h-12 bg-gradient-to-br from-gold-400 to-gold-600 rounded-xl flex items-center justify-center shadow-gold">
                <GraduationCap className="w-6 h-6 text-navy-950" />
              </div>
              <div>
                <div className="font-display font-bold text-white text-lg leading-tight">Smit Sir</div>
                <div className="font-display font-bold text-gold-400 text-sm leading-tight tracking-wider">COMMERCE</div>
              </div>
            </Link>
            <p className="text-navy-400 text-sm leading-relaxed mb-3">
              Master Class 11 &amp; 12 Commerce with Smit Sir. CBSE-focused coaching for Economics, Business Studies, Accountancy &amp; Entrepreneurship in Mehsana, Gujarat.
            </p>
            <a href="tel:+916353709585" className="text-gold-400 text-sm font-semibold hover:text-gold-300 transition-colors mb-5 inline-block">
              📞 +91 63537 09585
            </a>
            <div className="flex items-center gap-3">
              <a href="https://instagram.com/smitthker" target="_blank" rel="noopener noreferrer" className="w-9 h-9 bg-navy-800 hover:bg-gold-500 rounded-lg flex items-center justify-center transition-colors group">
                <Instagram className="w-4 h-4 text-navy-400 group-hover:text-navy-950" />
              </a>
              <a href="https://wa.me/916353709585?text=Hello%20Smit%20Sir%2C%20I%20want%20to%20know%20about%20Class%2011%2F12%20Commerce%20batch%20admission." className="w-9 h-9 bg-navy-800 hover:bg-green-600 rounded-lg flex items-center justify-center transition-colors group">
                <MessageCircle className="w-4 h-4 text-navy-400 group-hover:text-white" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display font-semibold text-white mb-5">Quick Links</h4>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.path}>
                  <Link to={link.path} className="text-navy-400 hover:text-gold-400 text-sm transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Subjects */}
          <div>
            <h4 className="font-display font-semibold text-white mb-5">Subjects</h4>
            <div className="space-y-4">
              <div>
                <div className="text-gold-400 text-xs font-semibold uppercase tracking-wider mb-2">Class 11</div>
                <ul className="space-y-1">
                  {class11Links.map((s) => (
                    <li key={s}>
                      <Link to="/courses" className="text-navy-400 hover:text-gold-400 text-sm transition-colors">{s}</Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <div className="text-gold-400 text-xs font-semibold uppercase tracking-wider mb-2">Class 12</div>
                <ul className="space-y-1">
                  {class12Links.map((s) => (
                    <li key={s}>
                      <Link to="/courses" className="text-navy-400 hover:text-gold-400 text-sm transition-colors">{s}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display font-semibold text-white mb-5">Contact</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-gold-400 mt-0.5 flex-shrink-0" />
                <div>
                  <div className="text-white text-sm font-medium">+91 63537 09585</div>
                  <div className="text-navy-400 text-xs">Mon–Sat, 9am–8pm</div>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-gold-400 mt-0.5 flex-shrink-0" />
                <div className="text-navy-400 text-sm">infosmitsircommerce@gmail.com</div>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-gold-400 mt-0.5 flex-shrink-0" />
                <div className="text-navy-400 text-sm">Mehsana, Gujarat, India</div>
              </li>
            </ul>
            <div className="mt-5">
              <Link to="/contact" className="btn-primary text-sm py-2 px-4 inline-block">
                Book Free Demo
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-navy-800/50">
        <div className="page-container py-5 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-navy-500 text-sm">© 2026 Smit Sir Commerce. All Rights Reserved.</p>
          <div className="flex items-center gap-4">
            <Link to="/faq" className="text-navy-500 hover:text-gold-400 text-xs transition-colors">FAQ</Link>
            <Link to="/about" className="text-navy-500 hover:text-gold-400 text-xs transition-colors">About</Link>
            <Link to="/contact" className="text-navy-500 hover:text-gold-400 text-xs transition-colors">Contact</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
