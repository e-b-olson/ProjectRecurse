import { describe, expect, it } from "vitest";
import {
  createProject,
  createTask,
  createTestUser,
  uniqueLabel,
} from "../../support/fixtures.js";

describe("rls / tasks", () => {
  it("project owner can create and read tasks", async () => {
    const owner = await createTestUser("task-owner");
    const project = await createProject(
      owner.client,
      { id: owner.id },
      uniqueLabel("Task Project")
    );
    const task = await createTask(
      owner.client,
      project.id,
      owner.id,
      uniqueLabel("Task")
    );

    const { data, error } = await owner.client
      .from("tasks")
      .select("id, title, created_by")
      .eq("id", task.id)
      .single();

    expect(error).toBeNull();
    expect(data?.created_by).toBe(owner.id);
  });

  it("non-owner project member cannot insert tasks", async () => {
    const owner = await createTestUser("task-insert-owner");
    const outsider = await createTestUser("task-insert-outsider");
    const project = await createProject(
      owner.client,
      { id: owner.id },
      uniqueLabel("Owner Only Tasks")
    );

    const { error } = await outsider.client.from("tasks").insert({
      project_id: project.id,
      title: "Blocked",
      created_by: outsider.id,
      status: "todo",
    });

    expect(error).not.toBeNull();
  });

  it("task creator can update their task without being project owner", async () => {
    const owner = await createTestUser("task-creator-update-owner");
    const creator = await createTestUser("task-creator-update-creator");

    const { data: projectRow, error: projectError } = await creator.client
      .from("projects")
      .insert({
        name: uniqueLabel("Creator Edit Project"),
        creator_id: creator.id,
        owner_id: owner.id,
      })
      .select("id")
      .single();

    expect(projectError).toBeNull();

    const { data: taskRow, error: taskError } = await owner.client
      .from("tasks")
      .insert({
        project_id: projectRow!.id,
        title: uniqueLabel("Delegated"),
        created_by: creator.id,
        status: "todo",
      })
      .select("id")
      .single();

    expect(taskError).toBeNull();

    const update = await creator.client
      .from("tasks")
      .update({ description: "creator updated" })
      .eq("id", taskRow!.id)
      .select("description")
      .single();

    expect(update.error).toBeNull();
    expect(update.data?.description).toBe("creator updated");
  });

  it("assignee can update task status", async () => {
    const owner = await createTestUser("task-assignee-owner");
    const assignee = await createTestUser("task-assignee-user");
    const project = await createProject(
      owner.client,
      { id: owner.id },
      uniqueLabel("Assignee Project")
    );
    const task = await createTask(
      owner.client,
      project.id,
      owner.id,
      uniqueLabel("Assignable")
    );

    const assign = await owner.client
      .from("tasks")
      .update({ assigned_to: assignee.id })
      .eq("id", task.id)
      .select("assigned_to")
      .single();

    expect(assign.error).toBeNull();

    const statusUpdate = await assignee.client
      .from("tasks")
      .update({ status: "in_progress" })
      .eq("id", task.id)
      .select("status")
      .single();

    expect(statusUpdate.error).toBeNull();
    expect(statusUpdate.data?.status).toBe("in_progress");
  });

  it("outsider cannot read tasks on projects they cannot access", async () => {
    const owner = await createTestUser("task-read-owner");
    const outsider = await createTestUser("task-read-outsider");
    const project = await createProject(
      owner.client,
      { id: owner.id },
      uniqueLabel("Private Tasks")
    );
    const task = await createTask(
      owner.client,
      project.id,
      owner.id,
      uniqueLabel("Hidden")
    );

    const { data, error } = await outsider.client
      .from("tasks")
      .select("id")
      .eq("id", task.id);

    expect(error).toBeNull();
    expect(data ?? []).toHaveLength(0);
  });
});
