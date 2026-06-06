import { describe, expect, it } from "vitest";
import { createTestUser, waitForProfile } from "../../support/fixtures.js";

describe("auth / profiles", () => {
  it("creates a profile row when a user signs up (handle_new_user trigger)", async () => {
    const user = await createTestUser("profile-trigger");
    await waitForProfile(user.client, user.id);

    const { data, error } = await user.client
      .from("profiles")
      .select("id, display_name")
      .eq("id", user.id)
      .single();

    expect(error).toBeNull();
    expect(data?.id).toBe(user.id);
  });

  it("user can update only their own profile", async () => {
    const owner = await createTestUser("profile-owner");
    const other = await createTestUser("profile-other");
    await waitForProfile(owner.client, owner.id);
    await waitForProfile(other.client, other.id);

    const ownUpdate = await owner.client
      .from("profiles")
      .update({ display_name: "Integration Owner" })
      .eq("id", owner.id)
      .select("display_name")
      .single();

    expect(ownUpdate.error).toBeNull();
    expect(ownUpdate.data?.display_name).toBe("Integration Owner");

    const crossUpdate = await owner.client
      .from("profiles")
      .update({ display_name: "Hijack" })
      .eq("id", other.id)
      .select("display_name");

    expect(crossUpdate.error).toBeNull();
    expect(crossUpdate.data ?? []).toHaveLength(0);
  });

  it("authenticated users can read any profile", async () => {
    const a = await createTestUser("profile-read-a");
    const b = await createTestUser("profile-read-b");
    await waitForProfile(a.client, a.id);
    await waitForProfile(b.client, b.id);

    const { data, error } = await a.client
      .from("profiles")
      .select("id")
      .eq("id", b.id)
      .single();

    expect(error).toBeNull();
    expect(data?.id).toBe(b.id);
  });
});
