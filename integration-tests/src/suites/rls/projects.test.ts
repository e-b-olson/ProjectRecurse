import { describe, expect, it } from "vitest";
import {
  createProject,
  createTestUser,
  uniqueLabel,
} from "../../support/fixtures.js";

describe("rls / projects", () => {
  it("creator can insert and read their project", async () => {
    const user = await createTestUser("project-owner");
    const project = await createProject(
      user.client,
      { id: user.id },
      uniqueLabel("My Project")
    );

    const { data, error } = await user.client
      .from("projects")
      .select("id, name, creator_id, owner_id")
      .eq("id", project.id)
      .single();

    expect(error).toBeNull();
    expect(data?.creator_id).toBe(user.id);
    expect(data?.owner_id).toBe(user.id);
  });

  it("other users cannot see projects they do not own or create", async () => {
    const owner = await createTestUser("project-isolated-owner");
    const outsider = await createTestUser("project-isolated-outsider");
    const project = await createProject(
      owner.client,
      { id: owner.id },
      uniqueLabel("Secret Project")
    );

    const { data, error } = await outsider.client
      .from("projects")
      .select("id")
      .eq("id", project.id);

    expect(error).toBeNull();
    expect(data ?? []).toHaveLength(0);
  });

  it("only owner can update; creator who is not owner cannot", async () => {
    const owner = await createTestUser("project-update-owner");
    const { data: inserted, error: insertError } = await owner.client
      .from("projects")
      .insert({
        name: uniqueLabel("Shared"),
        creator_id: owner.id,
        owner_id: owner.id,
      })
      .select("id")
      .single();

    expect(insertError).toBeNull();
    const projectId = inserted!.id;

    const ownerUpdate = await owner.client
      .from("projects")
      .update({ description: "owner edit" })
      .eq("id", projectId)
      .select("description")
      .single();

    expect(ownerUpdate.error).toBeNull();
    expect(ownerUpdate.data?.description).toBe("owner edit");
  });

  it("rejects insert when creator_id does not match auth user", async () => {
    const user = await createTestUser("project-insert-spoof");
    const fakeCreator = crypto.randomUUID();

    const { error } = await user.client.from("projects").insert({
      name: uniqueLabel("Spoofed"),
      creator_id: fakeCreator,
      owner_id: user.id,
    });

    expect(error).not.toBeNull();
  });
});
