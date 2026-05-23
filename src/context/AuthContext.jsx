import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

// ─── Auth Context ─────────────────────────────────────────────────────────────
// Single source of truth for the authenticated user.
// Wrap your app in <AuthProvider> and consume with useAuth() hook.
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser]       = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Hydrate from existing persisted session (avoids flicker on refresh)
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (error) console.warn('[Auth] getSession error:', error.message);
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
      console.debug('[Auth] Initial session:', session?.user?.id ?? 'none');
    });

    // 2. React to future sign-in / sign-out / token refresh events
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.debug('[Auth] State change:', event, session?.user?.id ?? 'none');
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) console.error('[Auth] Sign-out error:', error.message);
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook — throws if used outside <AuthProvider>
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
};
