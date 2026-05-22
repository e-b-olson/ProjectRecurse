"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
// import { supabase } from "@/lib/supabaseClient";
import { getSupabase } from "@/lib/supabaseClient";
import UserMenu from "@/app/components/UserMenu";
import ProfileModal from "@/app/components/ProfileModal";

interface Profile {
  displayName: string | null;
  avatarUrl: string | null;
}

interface Props {
  userId: string;
  email: string;
}

export default function AppHeader({ userId, email }: Props) {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile>({ displayName: null, avatarUrl: null });
  const [showProfile, setShowProfile] = useState(false);

  const supabase = getSupabase();

  useEffect(() => {
    supabase
      .from("profiles")
      .select("display_name, avatar_url")
      .eq("id", userId)
      .maybeSingle()
      .then(({ data }) => {
        if (data) {
          setProfile({ displayName: data.display_name ?? null, avatarUrl: data.avatar_url ?? null });
        }
      });
  }, [userId]);

  function handleSignOut() {
    supabase.auth.signOut().then(() => router.replace("/login"));
  }

  return (
    <>
      <header className="flex items-center justify-between px-8 py-4 border-b border-slate-800">
        <Link
          href="/dashboard"
          className="text-white font-bold text-lg tracking-tight hover:text-indigo-300 transition-colors"
        >
          Project Recurse
        </Link>
        <UserMenu
          displayName={profile.displayName}
          avatarUrl={profile.avatarUrl}
          email={email}
          onProfile={() => setShowProfile(true)}
          onSignOut={handleSignOut}
        />
      </header>

      {showProfile && (
        <ProfileModal
          userId={userId}
          email={email}
          initial={profile}
          onClose={() => setShowProfile(false)}
          onSaved={(updated) => {
            setProfile(updated);
            setShowProfile(false);
          }}
        />
      )}
    </>
  );
}
