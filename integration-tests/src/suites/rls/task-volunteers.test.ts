import { describe, expect, it } from "vitest";
import {
  createProject,
  createTask,
  createTestUser,
  uniqueLabel,
} from "../../support/fixtures.js";

describe("rls / task_volunteers", () => {
  it("user can volunteer on a task and see their own row", async () => {
    const owner = await createTestUser("volunteer-owner");
    const volunteer = await createTestUser("volunteer-user");
    const project = await createProject(
      owner.client,
      { id: owner.id },
      uniqueLabel("Volunteer Project")
    );
    const task = await createTask(
      owner.client,
      project.id,
      owner.id,
      uniqueLabel("Volunteer Task")
    );

    const insert = await volunteer.client
      .from("task_volunteers")
      .insert({ task_id: task.id, user_id: volunteer.id })
      .select("task_id, user_id")
      .single();

    expect(insert.error).toBeNull();

    const { data, error } = await volunteer.client
      .from("task_volunteers")
      .select("task_id, user_id")
      .eq("task_id", task.id)
      .eq("user_id", volunteer.id);

    expect(error).toBeNull();
    expect(data).toHaveLength(1);
  });

  it("cannot volunteer on behalf of another user", async () => {
    const owner = await createTestUser("volunteer-spoof-owner");
    const a = await createTestUser("volunteer-spoof-a");
    const b = await createTestUser("volunteer-spoof-b");
    const project = await createProject(
      owner.client,
      { id: owner.id },
      uniqueLabel("Spoof Volunteer Project")
    );
    const task = await createTask(
      owner.client,
      project.id,
      owner.id,
      uniqueLabel("Spoof Task")
    );

    const { error } = await a.client
      .from("task_volunteers")
      .insert({ task_id: task.id, user_id: b.id });

    expect(error).not.toBeNull();
  });

  it("project owner can see all volunteers; volunteer sees own row on foreign project", async () => {
    const owner = await createTestUser("volunteer-visibility-owner");
    const volunteer = await createTestUser("volunteer-visibility-user");
    const project = await createProject(
      owner.client,
      { id: owner.id },
      uniqueLabel("Visibility Project")
    );
    const task = await createTask(
      owner.client,
      project.id,
      owner.id,
      uniqueLabel("Visibility Task")
    );

    await volunteer.client
      .from("task_volunteers")
      .insert({ task_id: task.id, user_id: volunteer.id });

    const ownerView = await owner.client
      .from("task_volunteers")
      .select("user_id")
      .eq("task_id", task.id);

    expect(ownerView.error).toBeNull();
    expect(ownerView.data?.map((r) => r.user_id)).toContain(volunteer.id);

    const volunteerView = await volunteer.client
      .from("task_volunteers")
      .select("user_id")
      .eq("task_id", task.id);

    expect(volunteerView.error).toBeNull();
    expect(volunteerView.data?.length).toBeGreaterThanOrEqual(1);
  });

  it("user can withdraw their own volunteer row", async () => {
    const owner = await createTestUser("volunteer-delete-owner");
    const volunteer = await createTestUser("volunteer-delete-user");
    const project = await createProject(
      owner.client,
      { id: owner.id },
      uniqueLabel("Withdraw Project")
    );
    const task = await createTask(
      owner.client,
      project.id,
      owner.id,
      uniqueLabel("Withdraw Task")
    );

    await volunteer.client
      .from("task_volunteers")
      .insert({ task_id: task.id, user_id: volunteer.id });

    const del = await volunteer.client
      .from("task_volunteers")
      .delete()
      .eq("task_id", task.id)
      .eq("user_id", volunteer.id);

    expect(del.error).toBeNull();

    const { data } = await volunteer.client
      .from("task_volunteers")
      .select("user_id")
      .eq("task_id", task.id)
      .eq("user_id", volunteer.id);

    expect(data ?? []).toHaveLength(0);
  });
});
