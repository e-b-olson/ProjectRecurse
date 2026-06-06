import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { getIntegrationEnv } from "./env.js";

let adminClient: SupabaseClient | undefined;
let anonClient: SupabaseClient | undefined;

export function getAdminClient(): SupabaseClient {
  if (!adminClient) {
    const { supabaseUrl, serviceRoleKey } = getIntegrationEnv();
    adminClient = createClient(supabaseUrl, serviceRoleKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });
  }
  return adminClient;
}

export function getAnonClient(): SupabaseClient {
  if (!anonClient) {
    const { supabaseUrl, anonKey } = getIntegrationEnv();
    anonClient = createClient(supabaseUrl, anonKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });
  }
  return anonClient;
}

/** Fresh client per user so sessions do not leak between tests. */
export async function createAuthenticatedClient(
  email: string,
  password: string
): Promise<SupabaseClient> {
  const { supabaseUrl, anonKey } = getIntegrationEnv();
  const client = createClient(supabaseUrl, anonKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const { error } = await client.auth.signInWithPassword({ email, password });
  if (error) {
    throw new Error(`signInWithPassword failed: ${error.message}`);
  }

  return client;
}
