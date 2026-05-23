import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { User } from 'lucide-react';

/**
 * UserProfile Component
 * Fetches a profile row from the `profiles` table (no auth required).
 * Falls back to "Guest User" if no profile is found.
 */
const UserProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);

        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .limit(1)
          .maybeSingle();

        if (profileError) {
          console.error(`Profile fetch error: ${profileError.message}`);
          setProfile({ name: 'Guest User', avatar_url: null });
          return;
        }

        if (!profileData) {
          setProfile({ name: 'Guest User', avatar_url: null });
          return;
        }

        setProfile({
          name: profileData.name || 'Guest User',
          avatar_url: profileData.avatar_url || null,
        });
      } catch (err) {
        console.error('UserProfile fetch failed:', err);
        setProfile({ name: 'Guest User', avatar_url: null });
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // ── Loading skeleton ──────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex items-center gap-2.5 animate-pulse bg-white/[0.02] border border-white/[0.06] px-3.5 py-1.5 rounded-2xl">
        <div className="w-8.5 h-8.5 rounded-full bg-white/[0.06]" />
        <div className="hidden sm:flex flex-col gap-1.5">
          <div className="w-16 h-3 bg-white/[0.06] rounded-full" />
          <div className="w-10 h-2 bg-white/[0.04] rounded-full" />
        </div>
      </div>
    );
  }

  // ── Render ────────────────────────────────────────────────────────────────────
  return (
    <div className="flex items-center gap-3 bg-white/[0.03] border border-white/[0.06] px-3.5 py-1.5 rounded-2xl shadow-sm hover:bg-white/[0.06] hover:border-fuchsia-500/20 transition-all duration-300">
      {profile?.avatar_url ? (
        <img
          src={profile.avatar_url}
          alt={profile.name ?? 'User avatar'}
          className="w-8.5 h-8.5 rounded-full object-cover border border-fuchsia-500/40
                     ring-2 ring-fuchsia-500/10 transition-transform duration-350 hover:scale-105"
        />
      ) : (
        <div
          className="w-8.5 h-8.5 rounded-full bg-gradient-to-tr from-fuchsia-500/20 to-pink-500/20 border border-fuchsia-500/40
                     flex items-center justify-center text-fuchsia-400 shadow-inner"
        >
          <User className="w-4 h-4" />
        </div>
      )}

      <div className="hidden sm:block">
        <p className="text-white text-sm font-semibold leading-none">
          {profile?.name || 'Guest User'}
        </p>
        <p className="text-slate-500 text-xs mt-1 leading-none font-medium">Member</p>
      </div>
    </div>
  );
};

export default UserProfile;
