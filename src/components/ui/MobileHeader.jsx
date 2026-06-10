import { Link } from 'react-router-dom';
import { GraduationCap, Bell } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function MobileHeader() {
  const { user, initials } = useAuth();

  return (
    <div className="lg:hidden sticky top-0 z-40 flex items-center justify-between px-4 h-14"
      style={{
        background: 'rgba(24,19,16,0.94)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
      }}>

      {/* Logo */}
      <Link to="/" className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-xl flex items-center justify-center"
          style={{ background: 'linear-gradient(135deg, #C9A050, #B8872F)' }}>
          <GraduationCap className="w-4 h-4 text-navy-950" strokeWidth={2.5} />
        </div>
        <div>
          <span className="text-white font-black text-sm leading-none">Smit Sir</span>
          <span className="text-gold-400 font-bold text-xs block leading-none tracking-wide">COMMERCE</span>
        </div>
      </Link>

      {/* Right actions */}
      <div className="flex items-center gap-2">
        <Link to="/contact"
          className="text-xs font-bold px-3 py-1.5 rounded-xl"
          style={{ background: 'linear-gradient(135deg, #C9A050, #B8872F)', color: '#0a0f2c' }}>
          Free Demo
        </Link>

        {user ? (
          <Link to="/dashboard"
            className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-black text-navy-950"
            style={{ background: 'linear-gradient(135deg, #C9A050, #B8872F)' }}>
            {initials}
          </Link>
        ) : (
          <Link to="/login"
            className="w-8 h-8 rounded-full flex items-center justify-center"
            style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)' }}>
            <GraduationCap className="w-4 h-4 text-navy-300" />
          </Link>
        )}
      </div>
    </div>
  );
}
