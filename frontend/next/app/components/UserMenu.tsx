"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

interface Props {
  displayName: string | null;
  avatarUrl: string | null;
  email: string;
  onProfile: () => void;
  onSignOut: () => void;
}

/** Returns up-to-2-character initials from a display name or email. */
function initials(displayName: string | null, email: string): string {
  const source = displayName?.trim() || email;
  const parts = source.split(/[\s@._-]+/).filter(Boolean);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return source.slice(0, 2).toUpperCase();
}

export default function UserMenu({ displayName, avatarUrl, email, onProfile, onSignOut }: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Close on Escape
  useEffect(() => {
    function handler(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  return (
    <div ref={ref} className="relative">
      {/* Avatar button */}
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label="User menu"
        aria-haspopup="true"
        aria-expanded={open}
        className="w-9 h-9 rounded-full overflow-hidden ring-2 ring-transparent hover:ring-indigo-500 focus:outline-none focus:ring-indigo-500 transition-all flex items-center justify-center bg-indigo-600 text-white text-sm font-semibold select-none"
      >
        {avatarUrl ? (
          <Image
            src={avatarUrl}
            alt={displayName ?? email}
            width={36}
            height={36}
            className="object-cover w-full h-full"
          />
        ) : (
          initials(displayName, email)
        )}
      </button>

      {/* Dropdown */}
      {open && (
        <div
          role="menu"
          className="absolute right-0 mt-2 w-44 rounded-xl bg-slate-800 border border-slate-700 shadow-xl py-1 z-50"
        >
          {/* Identity hint */}
          <div className="px-4 py-2.5 border-b border-slate-700">
            <p className="text-white text-sm font-medium truncate">
              {displayName || "No name set"}
            </p>
            <p className="text-slate-500 text-xs truncate">{email}</p>
          </div>

          <button
            role="menuitem"
            onClick={() => { setOpen(false); onProfile(); }}
            className="w-full text-left px-4 py-2.5 text-sm text-slate-300 hover:text-white hover:bg-slate-700/60 transition-colors"
          >
            Profile
          </button>
          <button
            role="menuitem"
            onClick={() => { setOpen(false); onSignOut(); }}
            className="w-full text-left px-4 py-2.5 text-sm text-slate-300 hover:text-white hover:bg-slate-700/60 transition-colors"
          >
            Sign out
          </button>
        </div>
      )}
    </div>
  );
}
