import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) fetchProfile(session.user.id);
      else setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) fetchProfile(session.user.id);
      else { setProfile(null); setLoading(false); }
    });

    return () => subscription.unsubscribe();
  }, []);

  async function fetchProfile(userId) {
    try {
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      setProfile(data ?? null);
    } catch (_) {
      setProfile(null);
    } finally {
      setLoading(false);
    }
  }

  async function signUp(email, password, name, classLevel) {
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

  function signIn(email, password) {
    return supabase.auth.signInWithPassword({ email, password });
  }

  function signOut() {
    return supabase.auth.signOut();
  }

  async function resetPassword(email) {
    return supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
  }

  const isPremium = profile?.is_premium === true;
  const isAdmin = profile?.is_admin === true || profile?.role === 'admin';
  const displayName = profile?.full_name ?? user?.user_metadata?.full_name ?? user?.email?.split('@')[0] ?? 'Student';
  const initials = displayName.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);

  return (
    <AuthContext.Provider value={{
      user, profile, loading,
      isPremium, isAdmin, displayName, initials,
      signIn, signUp, signOut, resetPassword, fetchProfile,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
