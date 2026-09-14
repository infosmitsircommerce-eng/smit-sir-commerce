import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowRight, GraduationCap, Loader2, Lock, Mail, User } from 'lucide-react';
import { SignIn2 } from '@/components/ui/clean-minimal-sign-in';
import { useAuth } from '../context/AuthContext';

function safeNextPath(value) {
  if (!value || typeof value !== 'string') return '';
  if (!value.startsWith('/') || value.startsWith('//')) return '';
  return value;
}

export default function Login() {
  const { signIn, signUp, resetPassword } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [mode, setMode] = useState(searchParams.get('mode') === 'signup' ? 'signup' : 'login');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [form, setForm] = useState({ email: '', password: '', name: '', classLevel: '12' });

  const set = (key) => (event) => setForm((current) => ({ ...current, [key]: event.target.value }));

  async function handleLogin(email, password) {
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      const { error: signInError, profile } = await signIn(email, password);
      if (signInError) {
        setError(signInError.message);
        return;
      }

      const owner = profile?.is_admin === true || profile?.role === 'admin';
      const requested = safeNextPath(searchParams.get('next'));
      navigate(requested || (owner ? '/admin' : profile?.onboarding_completed ? '/dashboard' : '/onboarding'));
    } finally {
      setLoading(false);
    }
  }

  async function handleForgotPassword(email) {
    setError('');
    const { error: resetError } = await resetPassword(email);
    if (resetError) throw new Error(resetError.message);
  }

  async function handleSignUp(event) {
    event.preventDefault();
    setError('');
    setSuccess('');

    if (!form.name.trim()) {
      setError('Please enter your name.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      setError('Please enter a valid email address.');
      return;
    }
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    try {
      const { error: signUpError } = await signUp(form.email, form.password, form.name, form.classLevel);
      if (signUpError) {
        setError(signUpError.message);
        return;
      }
      setSuccess('Account created! Check your email to confirm, then sign in.');
      setMode('login');
    } finally {
      setLoading(false);
    }
  }

  if (mode === 'login') {
    return (
      <SignIn2
        onSignIn={handleLogin}
        onForgotPassword={handleForgotPassword}
        onCreateAccount={() => {
          setError('');
          setSuccess('');
          setMode('signup');
        }}
        loading={loading}
        externalError={error}
        successMessage={success}
        title="Sign in with email"
        description="Access your Smit Sir Commerce dashboard, notes, quizzes, purchases and Premium study tools."
      />
    );
  }

  return (
    <main className="min-h-screen w-full flex items-center justify-center bg-white px-4 py-10">
      <section className="w-full max-w-sm bg-gradient-to-b from-sky-50/50 to-white rounded-3xl shadow-xl p-8 border border-blue-100 text-black">
        <Link to="/" className="flex items-center justify-center gap-3 mb-7">
          <span className="w-12 h-12 rounded-2xl bg-white shadow-lg flex items-center justify-center">
            <GraduationCap className="w-6 h-6" />
          </span>
          <span className="text-left">
            <strong className="block text-sm">Smit Sir</strong>
            <span className="block text-xs text-gray-500">COMMERCE</span>
          </span>
        </Link>

        <h1 className="text-2xl font-semibold text-center">Create your account</h1>
        <p className="text-gray-500 text-sm leading-6 text-center mt-2 mb-6">Create one student account for progress, purchases and Premium access.</p>

        <form onSubmit={handleSignUp} className="space-y-3">
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input type="text" value={form.name} onChange={set('name')} placeholder="Full name" autoComplete="name" className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-200 bg-gray-50 text-sm" required />
          </div>

          <select value={form.classLevel} onChange={set('classLevel')} className="w-full px-3 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-200 bg-gray-50 text-sm">
            <option value="11">Class 11</option>
            <option value="12">Class 12</option>
          </select>

          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input type="email" value={form.email} onChange={set('email')} placeholder="Email" autoComplete="email" className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-200 bg-gray-50 text-sm" required />
          </div>

          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input type="password" value={form.password} onChange={set('password')} placeholder="Password · minimum 6 characters" autoComplete="new-password" className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-200 bg-gray-50 text-sm" required />
          </div>

          {error ? <p role="alert" className="text-sm text-red-500">{error}</p> : null}

          <button type="submit" disabled={loading} className="w-full bg-gradient-to-b from-gray-700 to-gray-900 text-white font-medium py-2.5 rounded-xl shadow hover:brightness-105 transition flex items-center justify-center gap-2 disabled:opacity-60">
            {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Creating account…</> : <>Create Account <ArrowRight className="w-4 h-4" /></>}
          </button>
        </form>

        <p className="text-center text-gray-500 text-xs mt-6">
          Already have an account?{' '}
          <button type="button" onClick={() => { setError(''); setMode('login'); }} className="text-gray-900 hover:underline font-semibold">Sign in</button>
        </p>
      </section>
    </main>
  );
}
