import { Link, useLocation } from 'react-router-dom';
import { BookOpen, Brain, FileText, Gamepad2, MessageCircle, Search, Wrench } from 'lucide-react';

const quickLinks = [
  { label: 'Notes', path: '/study-material', icon: BookOpen, primary: true },
  { label: 'GSEB PDFs', path: '/study-material?board=GSEB', match: '/study-material', icon: FileText },
  { label: 'CBSE Notes', path: '/cbse-notes', icon: Search },
  { label: 'Practice', path: '/daily-practice', icon: Brain },
  { label: 'Games', path: '/games', icon: Gamepad2 },
  { label: 'Tools', path: '/tools', icon: Wrench },
  { label: 'Contact', path: '/contact', icon: MessageCircle },
];

const hiddenPrefixes = ['/admin', '/login', '/onboarding', '/pdf-viewer'];

export default function QuickAccessDock() {
  const { pathname, search } = useLocation();
  if (hiddenPrefixes.some((prefix) => pathname.startsWith(prefix))) return null;

  return (
    <nav className="ssc-floating-dock" aria-label="Fast study shortcuts">
      {quickLinks.map((item) => {
        const Icon = item.icon;
        const active = item.path.includes('?')
          ? pathname === item.match && search.toUpperCase().includes('BOARD=GSEB')
          : pathname === item.path || pathname.startsWith(`${item.path}/`);
        return (
          <Link
            key={item.label}
            to={item.path}
            className="ssc-dock-link"
            data-active={active ? 'true' : undefined}
            data-primary={item.primary ? 'true' : undefined}
          >
            <Icon className="w-4 h-4" strokeWidth={2.3} />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
