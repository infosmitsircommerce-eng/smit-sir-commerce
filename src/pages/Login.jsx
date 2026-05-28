import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, User, GraduationCap, ArrowRight, Loader } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();

  const [mode, setMode]           = useState('login'); // 'login' | 'signup'
  const [loading, setLoading]     = useState(false);
  const [showPass, setShowPass]   = useState(false);
  const [error, setError]         = useState('');
  const [success, setSuccess]     = useState('');

  const [form, setForm] = useState({
    email: '', password: '', name: '', classLevel: '12',
  });

  const set = (key) => (e) => setForm(f => ({ ...f, [key]: e.target.value }));

  async function handleSubmit(e) {
    e.preventDefault();
    setError(''); setSuccess('');
    setLoading(true);

    if (mode === 'login') {
      const { error } = await signIn(form.email, form.password);
      if (error) { setError(error.message); setLoading(false); return; }
      navigate('/dashboard');
    } else {
      if (!form.name.trim()) { setError('Please enter your name.'); setLoading(false); return; }
      if (form.password.length < 6) { setError('Password must be at least 6 characters.'); setLoading(false); return; }
      const { error } = await signUp(form.email, form.password, form.name, form.classLevel);
      if (error) { setError(error.message); setLoading(false); return; }
      setSuccess('Account created! Check your email to confirm, then login.');
      setMode('login');
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-navy-950 flex items-center justify-center px-4 relative overflow-hidden">

      {/* Background glows */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full opacity-[0.06]"
          style={{ background: 'radial-gradient(circle, #D4AF37 0%, transparent 70%)' }} />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full opacity-[0.04]"
          style={{ background: 'radial-gradient(circle, #6366f1 0%, transparent 70%)' }} />
      </div>

      <div className="w-full max-w-md relative z-10">

        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-3 group">
            <div className="w-12 h-12 bg-gradient-to-br from-gold-400 to-gold-600 rounded-xl flex items-center justify-center shadow-gold group-hover:scale-110 transition-transform">
              <GraduationCap className="w-6 h-6 text-navy-950" />
            </div>
            <div className="text-left">
              <div className="font-display font-bold text-white text-base leading-tight">Smit Sir</div>
              <div className="font-display font-bold text-gold-400 text-xs leading-tight tracking-wide">COMMERCE</div>
            </div>
          </Link>
        </div>

        {/* Card */}
        <div className="bg-navy-900 border border-navy-700 rounded-2xl p-8"
          style={{ boxShadow: '0 0 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(212,175,55,0.08)' }}>

          {/* Mode toggle */}
          <div className="flex bg-navy-800 rounded-xl p-1 mb-8">
            {['login', 'signup'].map(m => (
              <button
                key={m}
                onClick={() => { setMode(m); setError(''); setSuccess(''); }}
                className="flex-1 py-2 rounded-lg text-sm font-semibold transition-all duration-200"
                style={mode === m ? {
                  background: 'linear-gradient(135deg, #D4AF37, #F0C040)',
                  color: '#030112',
                } : { color: '#8899BB' }}
              >
                {m === 'login' ? 'Login' : 'Sign Up'}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={mode}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <h2 className="text-white font-bold text-xl mb-1">
                {mode === 'login' ? 'Welcome back!' : 'Create your account'}
              </h2>
              <p className="text-navy-400 text-sm mb-6">
                {mode === 'login'
                  ? 'Login to access your lectures, notes & quizzes.'
                  : 'Join Smit Sir Commerce and start learning today.'}
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">

                {/* Name (signup only) */}
                {mode === 'signup' && (
                  <div>
                    <label className="block text-navy-300 text-xs font-medium mb-1.5">Full Name</label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-navy-500" />
                      <input
                        type="text" value={form.name} onChange={set('name')}
                        placeholder="Your full name"
                        className="input-field pl-10 w-full"
                        required
                      />
                    </div>
                  </div>
                )}

                {/* Class (signup only) */}
                {mode === 'signup' && (
                  <div>
                    <label className="block text-navy-300 text-xs font-medium mb-1.5">Class</label>
                    <select value={form.classLevel} onChange={set('classLevel')} className="input-field w-full">
                      <option value="11">Class 11</option>
                      <option value="12">Class 12</option>
                    </select>
                  </div>
                )}

                {/* Email */}
                <div>
                  <label className="block text-navy-300 text-xs font-medium mb-1.5">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-navy-500" />
                    <input
                      type="email" value={form.email} onChange={set('email')}
                      placeholder="your@email.com"
                      className="input-field pl-10 w-full"
                      required
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label className="block text-navy-300 text-xs font-medium mb-1.5">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-navy-500" />
                    <input
                      type={showPass ? 'text' : 'password'}
                      value={form.password} onChange={set('password')}
                      placeholder={mode === 'signup' ? 'Min. 6 characters' : 'Your password'}
                      className="input-field pl-10 pr-10 w-full"
                      required
                    />
                    <button type="button" onClick={() => setShowPass(s => !s)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-navy-500 hover:text-navy-300 transition-colors">
                      {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Error / Success */}
                {error && (
                  <div className="text-red-400 text-sm bg-red-400/10 border border-red-400/20 rounded-lg px-4 py-2.5">
                    {error}
                  </div>
                )}
                {success && (
                  <div className="text-emerald-400 text-sm bg-emerald-400/10 border border-emerald-400/20 rounded-lg px-4 py-2.5">
                    {success}
                  </div>
                )}

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary w-full flex items-center justify-center gap-2 mt-2"
                >
                  {loading
                    ? <Loader className="w-4 h-4 animate-spin" />
                    : <>
                        {mode === 'login' ? 'Login to Dashboard' : 'Create Account'}
                        <ArrowRight className="w-4 h-4" />
                      </>
                  }
                </button>
              </form>

              {mode === 'login' && (
                <p className="text-center text-navy-500 text-xs mt-4">
                  Don't have an account?{' '}
                  <button onClick={() => setMode('signup')} className="text-gold-400 hover:text-gold-300 transition-colors font-medium">
                    Sign up free
                  </button>
                </p>
              )}
              {mode === 'signup' && (
                <p className="text-center text-navy-500 text-xs mt-4">
                  Already have an account?{' '}
                  <button onClick={() => setMode('login')} className="text-gold-400 hover:text-gold-300 transition-colors font-medium">
                    Login
                  </button>
                </p>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Footer note */}
        <p className="text-center text-navy-600 text-xs mt-6">
          By signing up, you agree to use this platform for educational purposes only.
        </p>
      </div>
    </div>
  );
}
