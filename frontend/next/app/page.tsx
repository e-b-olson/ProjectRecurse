"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
// import { supabase } from "@/lib/supabaseClient";
import { getSupabase } from "@/lib/supabaseClient";

export default function Home() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
      const supabase = getSupabase();
      supabase.auth.getUser().then(async ({ data }) => {
        if (data.user) {
          router.replace("/dashboard");
          return;
        }
      });
    }, [router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");

    const { error } = await supabase
      .from("beta_registrations")
      .insert([{ name, email }]);

    if (error) {
      setErrorMsg(error.message);
      setStatus("error");
    } else {
      setStatus("success");
    }
  }

  return (
    <main className="min-h-screen bg-[#0f172a] flex items-center justify-center px-4">
      <div className="fixed top-5 right-6">
        <Link
          href="/login"
          className="text-slate-500 hover:text-slate-300 text-sm transition-colors"
        >
          Sign in
        </Link>
      </div>

      <div className="w-full max-w-md text-center">
        <span className="inline-block mb-6 px-3 py-1 text-xs font-semibold tracking-widest uppercase rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
          Beta
        </span>

        <h1 className="text-5xl font-bold text-white mb-3">
          Project Recurse
        </h1>

        <p className="text-slate-400 text-lg mb-10">
          Organize engineering teams effortlessly.
          <br />
          Be the first to know when we launch.
        </p>

        {status === "success" ? (
          <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/30 px-6 py-8">
            <p className="text-emerald-400 text-lg font-medium">You&apos;re on the list 🎉</p>
            <p className="text-slate-400 text-sm mt-2">
              We&apos;ll reach out to <span className="text-white">{email}</span> when beta access opens.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <input
              type="text"
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full rounded-lg bg-slate-800 border border-slate-700 text-white placeholder-slate-500 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
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
              {status === "loading" ? "Registering…" : "Request Beta Access"}
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
