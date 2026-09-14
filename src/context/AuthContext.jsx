import { createContext, useContext, useEffect, useState } from 'react';
import { PREMIUM_MEGA_PACK_ID } from '../data/premiumMegaPack';

const AuthContext = createContext({});
let supabasePromise;

function getSupabase() {
  if (!supabasePromise) {
    supabasePromise = import('../lib/supabase').then((module) => module.supabase);
  }
  return supabasePromise;
}

function shouldLoadAuthImmediately() {
  return /^\/(login|onboarding|premium|dashboard|admin(?:\/|$)|admin-studio|learning-insights|my-data|my-purchases|purchase-status)/.test(window.location.pathname);
}

function entitlementIsActive(row) {
  if (!row) return false;
  if (!row.expires_at) return true;
  const expires = new Date(row.expires_at).getTime();
  return !Number.isNaN(expires) && expires > Date.now();
}

async function loadAccountState(supabase, userId) {
  const [profileResult, megaResult] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', userId).single(),
    supabase
      .from('product_entitlements')
      .select('product_id,granted_at,expires_at,revoked_at')
      .eq('user_id', userId)
      .eq('product_id', PREMIUM_MEGA_PACK_ID)
      .is('revoked_at', null)
      .order('granted_at', { ascending: false })
      .limit(1),
  ]);

  const nextProfile = profileResult.data ?? null;
  const megaRow = Array.isArray(megaResult.data) ? megaResult.data[0] : null;
  return { nextProfile, hasMegaPremium: entitlementIsActive(megaRow) };
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [hasMegaPremium, setHasMegaPremium] = useState(false);
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
        else {
          setHasMegaPremium(false);
          setLoading(false);
        }

        const { data } = supabase.auth.onAuthStateChange((_event, nextSession) => {
          if (cancelled) return;
          setUser(nextSession?.user ?? null);
          if (nextSession?.user) fetchProfile(nextSession.user.id);
          else {
            setProfile(null);
            setHasMegaPremium(false);
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
      const state = await loadAccountState(supabase, userId);
      setProfile(state.nextProfile);
      setHasMegaPremium(state.hasMegaPremium);
      return state.nextProfile;
    } catch {
      setProfile(null);
      setHasMegaPremium(false);
      return null;
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
        emailRedirectTo: 'https://www.smitsircommerce.in/login',
        data: {
          full_name: name,
          class_level: Number(classLevel),
        },
      },
    });
  }

  async function signIn(email, password) {
    const supabase = await getSupabase();
    const result = await supabase.auth.signInWithPassword({ email, password });
    if (!result.error && result.data?.user) {
      const state = await loadAccountState(supabase, result.data.user.id);
      setUser(result.data.user);
      setProfile(state.nextProfile);
      setHasMegaPremium(state.hasMegaPremium);
      setLoading(false);
      return { ...result, profile: state.nextProfile };
    }
    return result;
  }

  async function signOut() {
    const supabase = await getSupabase();
    setHasMegaPremium(false);
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
  const legacyPremium = profile?.is_premium === true && !premiumExpired;
  const isPremium = legacyPremium || hasMegaPremium;
  const isAdmin = profile?.is_admin === true || profile?.role === 'admin';
  const displayName = profile?.full_name ?? user?.user_metadata?.full_name ?? user?.email?.split('@')[0] ?? 'Student';
  const initials = displayName.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);

  return (
    <AuthContext.Provider value={{
      user, profile, loading,
      isPremium, legacyPremium, hasMegaPremium, premiumUntil, premiumExpired,
      isAdmin, displayName, initials,
      signIn, signUp, signOut, resetPassword, fetchProfile,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
