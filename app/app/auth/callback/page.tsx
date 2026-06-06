// FILE: app/app/auth/callback/page.tsx

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getSupabase } from "@/lib/supabaseClient";

export default function AuthCallback() {
  const router = useRouter();
  const [error, setError] = useState("");

  useEffect(() => {
    const supabase = getSupabase();

    async function finishSignIn() {
      const params = new URLSearchParams(window.location.search);
      const code = params.get("code");

      if (code) {
        const { error: exchangeError } =
          await supabase.auth.exchangeCodeForSession(code);

        if (exchangeError) {
          setError(exchangeError.message);
          return;
        }
      }

      const { data: { session }, error: sessionError } =
        await supabase.auth.getSession();

      if (sessionError) {
        setError(sessionError.message);
        return;
      }

      if (session?.user) {
        router.replace("/dashboard");
        return;
      }

      setError("Sign-in could not be completed. Request a new magic link.");
    }

    void finishSignIn();
  }, [router]);

  return (
    <main className="min-h-screen bg-[#0f172a] flex items-center justify-center px-4">
      {error ? (
        <p className="text-red-400 text-sm max-w-md text-center">{error}</p>
      ) : (
        <span className="text-slate-500 text-sm">Signing you in…</span>
      )}
    </main>
  );
}
