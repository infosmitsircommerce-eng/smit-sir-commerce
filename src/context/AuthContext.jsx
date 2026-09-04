import { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext({});
let supabasePromise;

function getSupabase() {
  if (!supabasePromise) {
    supabasePromise = import('../lib/supabase').then((module) => module.supabase);
  }
  return supabasePromise;
}

function shouldLoadAuthImmediately() {
  return /^\/(login|onboarding|dashboard|admin(?:\/|$)|admin-studio|learning-insights|my-data)/.test(window.location.pathname);
}

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    let subscription;
    let idleId;
    let timerId;

    const init = async () => {
      try {
        const supabase = await getSupabase();
        if (cancelled) return;

        const { data: { session } } = await supabase.auth.getSession();
        if (cancelled) return;

        setUser(session?.user ?? null);
        if (session?.user) await fetchProfile(session.user.id);
        else setLoading(false);

        const { data } = supabase.auth.onAuthStateChange((_event, nextSession) => {
          if (cancelled) return;
          setUser(nextSession?.user ?? null);
          if (nextSession?.user) fetchProfile(nextSession.user.id);
          else {
            setProfile(null);
            setLoading(false);
          }
        });
        subscription = data.subscription;
      } catch {
        if (!cancelled) setLoading(false);
      }
    };

    if (shouldLoadAuthImmediately()) {
      init();
    } else if ('requestIdleCallback' in window) {
      idleId = window.requestIdleCallback(init, { timeout: 1400 });
    } else {
      timerId = window.setTimeout(init, 700);
    }

    return () => {
      cancelled = true;
      subscription?.unsubscribe();
      if (idleId) window.cancelIdleCallback?.(idleId);
      if (timerId) window.clearTimeout(timerId);
    };
  }, []);

  async function fetchProfile(userId) {
    try {
      const supabase = await getSupabase();
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      setProfile(data ?? null);
    } catch {
      setProfile(null);
    } finally {
      setLoading(false);
    }
  }

  async function signUp(email, password, name, classLevel) {
    const supabase = await getSupabase();
    return supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name,
          class_level: Number(classLevel),
        },
      },
    });
  }

  async function signIn(email, password) {
    const supabase = await getSupabase();
    return supabase.auth.signInWithPassword({ email, password });
  }

  async function signOut() {
    const supabase = await getSupabase();
    return supabase.auth.signOut();
  }

  async function resetPassword(email) {
    const supabase = await getSupabase();
    return supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
  }

  const premiumUntil = profile?.premium_until ? new Date(profile.premium_until) : null;
  const premiumHasTime = premiumUntil && !Number.isNaN(premiumUntil.getTime());
  const premiumExpired = profile?.is_premium === true && premiumHasTime && premiumUntil.getTime() <= Date.now();
  const isPremium = profile?.is_premium === true && !premiumExpired;
  const isAdmin = profile?.is_admin === true || profile?.role === 'admin';
  const displayName = profile?.full_name ?? user?.user_metadata?.full_name ?? user?.email?.split('@')[0] ?? 'Student';
  const initials = displayName.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);

  return (
    <AuthContext.Provider value={{
      user, profile, loading,
      isPremium, premiumUntil, premiumExpired,
      isAdmin, displayName, initials,
      signIn, signUp, signOut, resetPassword, fetchProfile,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
