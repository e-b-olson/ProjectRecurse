"use client";

import { useState } from "react";
// import { supabase } from "@/lib/supabaseClient";
import { getSupabase } from "@/lib/supabaseClient";

interface Profile {
  displayName: string | null;
  avatarUrl: string | null;
}

interface Props {
  userId: string;
  email: string;
  initial: Profile;
  onClose: () => void;
  onSaved: (profile: Profile) => void;
}

export default function ProfileModal({ userId, email, initial, onClose, onSaved }: Props) {
  const [displayName, setDisplayName] = useState(initial.displayName ?? "");
  const [avatarUrl, setAvatarUrl] = useState(initial.avatarUrl ?? "");
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const supabase = getSupabase();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");

    const { error } = await supabase
      .from("profiles")
      .upsert({
        id: userId,
        display_name: displayName.trim() || null,
        avatar_url: avatarUrl.trim() || null,
      });

    if (error) {
      setErrorMsg(error.message);
      setStatus("error");
    } else {
      onSaved({
        displayName: displayName.trim() || null,
        avatarUrl: avatarUrl.trim() || null,
      });
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="w-full max-w-md rounded-2xl bg-slate-900 border border-slate-700 p-8 shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-white font-semibold text-lg">Profile</h2>
          <button
            onClick={onClose}
            aria-label="Close"
            className="text-slate-500 hover:text-slate-300 transition-colors text-xl leading-none"
          >
            ×
          </button>
        </div>

        {/* Read-only email */}
        <div className="mb-5 px-4 py-3 rounded-lg bg-slate-800/50 border border-slate-700">
          <p className="text-slate-500 text-xs mb-0.5">Email</p>
          <p className="text-slate-300 text-sm">{email}</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="display-name" className="text-slate-400 text-xs font-medium uppercase tracking-wider">
              Display Name
            </label>
            <input
              id="display-name"
              type="text"
              placeholder="How should we call you?"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              maxLength={80}
              className="w-full rounded-lg bg-slate-800 border border-slate-700 text-white placeholder-slate-500 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="avatar-url" className="text-slate-400 text-xs font-medium uppercase tracking-wider">
              Avatar URL
            </label>
            <input
              id="avatar-url"
              type="url"
              placeholder="https://…"
              value={avatarUrl}
              onChange={(e) => setAvatarUrl(e.target.value)}
              className="w-full rounded-lg bg-slate-800 border border-slate-700 text-white placeholder-slate-500 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {status === "error" && (
            <p className="text-red-400 text-sm">{errorMsg}</p>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-lg border border-slate-700 text-slate-400 hover:text-white hover:border-slate-500 font-medium py-3 text-sm transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={status === "loading"}
              className="flex-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 text-sm transition-colors"
            >
              {status === "loading" ? "Saving…" : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
