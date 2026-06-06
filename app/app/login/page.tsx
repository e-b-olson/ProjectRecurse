"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
// import { supabase } from "@/lib/supabaseClient";
import { getSupabase } from "@/lib/supabaseClient";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "sent" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const supabase = getSupabase();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (session?.user) router.replace("/dashboard");
      }
    );
    void supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) router.replace("/dashboard");
    });
    return () => subscription.unsubscribe();
  }, [router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");

    const supabase = getSupabase();

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      setErrorMsg(error.message);
      setStatus("error");
    } else {
      setStatus("sent");
    }
  }

  return (
    <main className="min-h-screen bg-[#0f172a] flex items-center justify-center px-4">
      <div className="w-full max-w-md text-center">
        {/* Back link */}
        <div className="mb-8">
          <Link
            href="/"
            className="text-slate-500 hover:text-slate-300 text-sm transition-colors"
          >
            ← Back
          </Link>
        </div>

        {/* Logo / Name */}
        <h1 className="text-4xl font-bold text-white mb-2">Project Recurse</h1>
        <p className="text-slate-400 text-sm mb-10">Sign in to your account</p>

        {status === "sent" ? (
          <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/30 px-6 py-8">
            <p className="text-emerald-400 text-lg font-medium">Check your inbox ✉️</p>
            <p className="text-slate-400 text-sm mt-2">
              We sent a magic link to <span className="text-white">{email}</span>.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <input
              type="email"
              placeholder="Your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full rounded-lg bg-slate-800 border border-slate-700 text-white placeholder-slate-500 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
              type="submit"
              disabled={status === "loading"}
              className="w-full rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 text-sm transition-colors"
            >
              {status === "loading" ? "Sending…" : "Send Magic Link"}
            </button>

            {status === "error" && (
              <p className="text-red-400 text-sm mt-1">{errorMsg}</p>
            )}
          </form>
        )}
      </div>
    </main>
  );
}
