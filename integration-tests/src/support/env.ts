import { config } from "dotenv";
import { existsSync } from "node:fs";
import { resolve } from "node:path";

const ROOT = resolve(import.meta.dirname, "../..");

for (const file of [".env.local", ".env"]) {
  const path = resolve(ROOT, file);
  if (existsSync(path)) {
    config({ path });
  }
}

export type IntegrationEnv = {
  supabaseUrl: string;
  anonKey: string;
  serviceRoleKey: string;
  allowedProjectRef?: string;
};

const DEFAULT_ALLOWED_HOSTS = ["localhost", "127.0.0.1", "[::1]"];

function parseAllowedHosts(): string[] {
  const extra = process.env.SUPABASE_ALLOWED_HOSTS?.trim();
  if (!extra) return DEFAULT_ALLOWED_HOSTS;
  return [...DEFAULT_ALLOWED_HOSTS, ...extra.split(",").map((h) => h.trim())];
}

function extractProjectRef(url: string): string | undefined {
  try {
    const host = new URL(url).hostname;
    const match = host.match(/^([a-z0-9]+)\.supabase\.co$/i);
    return match?.[1];
  } catch {
    return undefined;
  }
}

/**
 * Refuses to run unless explicitly enabled and the target looks like
 * local Supabase or an allowlisted non-production project ref.
 */
export function assertSafeIntegrationTarget(): IntegrationEnv {
  if (process.env.INTEGRATION_TESTS_ENABLED !== "true") {
    throw new Error(
      "Integration tests are disabled. Set INTEGRATION_TESTS_ENABLED=true in integration-tests/.env.local and point SUPABASE_* at a local or dedicated test instance — never production."
    );
  }

  const supabaseUrl = process.env.SUPABASE_URL?.trim();
  const anonKey = process.env.SUPABASE_ANON_KEY?.trim();
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();

  if (!supabaseUrl || !anonKey || !serviceRoleKey) {
    throw new Error(
      "Missing SUPABASE_URL, SUPABASE_ANON_KEY, or SUPABASE_SERVICE_ROLE_KEY."
    );
  }

  let hostname: string;
  try {
    hostname = new URL(supabaseUrl).hostname;
  } catch {
    throw new Error(`Invalid SUPABASE_URL: ${supabaseUrl}`);
  }

  const allowedHosts = parseAllowedHosts();
  const hostAllowed = allowedHosts.some(
    (h) => hostname === h || hostname.endsWith(`.${h}`)
  );

  const projectRef = extractProjectRef(supabaseUrl);
  const allowedRef = process.env.SUPABASE_ALLOWED_PROJECT_REF?.trim();
  const refAllowed = allowedRef
    ? projectRef === allowedRef
    : false;

  if (!hostAllowed && !refAllowed) {
    throw new Error(
      `Refusing to run integration tests against "${hostname}". ` +
        "Use local Supabase (127.0.0.1 / localhost) or set SUPABASE_ALLOWED_PROJECT_REF to a dedicated test project."
    );
  }

  if (allowedRef && projectRef && projectRef !== allowedRef) {
    throw new Error(
      `SUPABASE_URL project ref "${projectRef}" does not match SUPABASE_ALLOWED_PROJECT_REF="${allowedRef}".`
    );
  }

  return {
    supabaseUrl,
    anonKey,
    serviceRoleKey,
    allowedProjectRef: allowedRef,
  };
}

export function getIntegrationEnv(): IntegrationEnv {
  return assertSafeIntegrationTarget();
}
