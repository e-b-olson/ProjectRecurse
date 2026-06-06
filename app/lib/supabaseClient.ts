import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error(
    "Missing Supabase env vars. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY (or NEXT_PUBLIC_SUPABASE_ANON_KEY)."
  );
}

/**
 * Supabase auth uses navigator.locks by default. In Next.js (Strict Mode, HMR)
 * that lock can deadlock and leave getSession() / getUser() pending forever.
 */
const lockNoOp = async <R>(
  _name: string,
  _acquireTimeout: number,
  fn: () => Promise<R>
): Promise<R> => fn();

function createBrowserClient(): SupabaseClient {
  return createClient(supabaseUrl, supabaseKey, {
    auth: {
      flowType: "pkce",
      detectSessionInUrl: true,
      persistSession: true,
      autoRefreshToken: true,
      lock: lockNoOp,
    },
  });
}

let browserClient: SupabaseClient | undefined;

/** Singleton Supabase client for browser code (client components). */
export function getSupabase(): SupabaseClient {
  if (!browserClient) {
    browserClient = createBrowserClient();
  }
  return browserClient;
}

/** @deprecated Prefer getSupabase() in new code. */
export const supabase = new Proxy({} as SupabaseClient, {
  get(_target, prop) {
    const client = getSupabase();
    const value = client[prop as keyof SupabaseClient];
    return typeof value === "function"
      ? (value as (...args: unknown[]) => unknown).bind(client)
      : value;
  },
});
