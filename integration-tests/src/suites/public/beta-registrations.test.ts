import { describe, expect, it } from "vitest";
import { getAnonClient } from "../../support/clients.js";
import { trackBetaRegistration } from "../../support/cleanup.js";
import { uniqueLabel } from "../../support/fixtures.js";

describe("public / beta_registrations", () => {
  it("anon can insert a beta registration (matches landing page flow)", async () => {
    const email = `${uniqueLabel("beta")}@test.local`;
    const { data, error } = await getAnonClient()
      .from("beta_registrations")
      .insert({ name: "Integration Tester", email })
      .select("id")
      .single();

    expect(error).toBeNull();
    expect(data?.id).toBeTruthy();
    if (data?.id) trackBetaRegistration(data.id);
  });

  it("anon cannot read beta registrations", async () => {
    const { data, error } = await getAnonClient()
      .from("beta_registrations")
      .select("id")
      .limit(1);

    expect(error).toBeNull();
    expect(data ?? []).toHaveLength(0);
  });

  it("rejects duplicate email", async () => {
    const email = `${uniqueLabel("beta-dup")}@test.local`;
    const anon = getAnonClient();

    const first = await anon
      .from("beta_registrations")
      .insert({ name: "First", email })
      .select("id")
      .single();
    expect(first.error).toBeNull();
    if (first.data?.id) trackBetaRegistration(first.data.id);

    const second = await anon
      .from("beta_registrations")
      .insert({ name: "Second", email })
      .select("id")
      .single();

    expect(second.error).not.toBeNull();
  });
});
