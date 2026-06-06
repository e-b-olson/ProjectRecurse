import { describe, expect, it } from "vitest";
import { getAdminClient, getAnonClient } from "../../support/clients.js";

const REQUIRED_TABLES = [
  "beta_registrations",
  "profiles",
  "projects",
  "tasks",
  "task_volunteers",
  "skills",
  "task_skills",
] as const;

describe("smoke / connectivity", () => {
  it("anon client can reach Supabase REST", async () => {
    const { error } = await getAnonClient().from("beta_registrations").select("id").limit(1);
    expect(error).toBeNull();
  });

  it("service role can reach auth admin API", async () => {
    const { data, error } = await getAdminClient().auth.admin.listUsers({
      page: 1,
      perPage: 1,
    });
    expect(error).toBeNull();
    expect(data).toBeDefined();
  });

  it("expected public schema tables are exposed via PostgREST", async () => {
    const admin = getAdminClient();
    for (const table of REQUIRED_TABLES) {
      const { error } = await admin.from(table).select("*").limit(0);
      expect(error, `table "${table}" should be queryable`).toBeNull();
    }
  });
});
