import { describe, expect, it } from "vitest";
import {
  createProject,
  createTask,
  createTestUser,
  uniqueLabel,
} from "../../support/fixtures.js";

describe("rls / skills and task_skills", () => {
  it("project owner can create project-scoped skills", async () => {
    const owner = await createTestUser("skills-owner");
    const project = await createProject(
      owner.client,
      { id: owner.id },
      uniqueLabel("Skills Project")
    );

    const { data, error } = await owner.client
      .from("skills")
      .insert({
        name: uniqueLabel("TypeScript"),
        project_id: project.id,
      })
      .select("id, name, project_id")
      .single();

    expect(error).toBeNull();
    expect(data?.project_id).toBe(project.id);
  });

  it("outsider cannot read project-scoped skills", async () => {
    const owner = await createTestUser("skills-isolated-owner");
    const outsider = await createTestUser("skills-isolated-outsider");
    const project = await createProject(
      owner.client,
      { id: owner.id },
      uniqueLabel("Skills Private")
    );

    const { data: skill } = await owner.client
      .from("skills")
      .insert({
        name: uniqueLabel("Rust"),
        project_id: project.id,
      })
      .select("id")
      .single();

    const { data, error } = await outsider.client
      .from("skills")
      .select("id")
      .eq("id", skill!.id);

    expect(error).toBeNull();
    expect(data ?? []).toHaveLength(0);
  });

  it("task creator can attach a project skill to their task", async () => {
    const owner = await createTestUser("task-skills-owner");
    const creator = await createTestUser("task-skills-creator");

    const { data: project } = await creator.client
      .from("projects")
      .insert({
        name: uniqueLabel("Task Skills Project"),
        creator_id: creator.id,
        owner_id: owner.id,
      })
      .select("id")
      .single();

    const { data: skill } = await owner.client
      .from("skills")
      .insert({ name: uniqueLabel("React"), project_id: project!.id })
      .select("id")
      .single();

    const { data: task } = await owner.client
      .from("tasks")
      .insert({
        project_id: project!.id,
        title: uniqueLabel("Skill Task"),
        created_by: creator.id,
        status: "todo",
      })
      .select("id")
      .single();

    const link = await creator.client
      .from("task_skills")
      .insert({ task_id: task!.id, skill_id: skill!.id })
      .select("task_id, skill_id")
      .single();

    expect(link.error).toBeNull();

    const read = await owner.client
      .from("task_skills")
      .select("task_id, skill_id")
      .eq("task_id", task!.id);

    expect(read.error).toBeNull();
    expect(read.data).toHaveLength(1);
  });

  it("cannot link a skill from a different project", async () => {
    const owner = await createTestUser("task-skills-mismatch-owner");
    const projectA = await createProject(
      owner.client,
      { id: owner.id },
      uniqueLabel("Project A")
    );
    const projectB = await createProject(
      owner.client,
      { id: owner.id },
      uniqueLabel("Project B")
    );

    const { data: skillB } = await owner.client
      .from("skills")
      .insert({ name: uniqueLabel("Go"), project_id: projectB.id })
      .select("id")
      .single();

    const taskA = await createTask(
      owner.client,
      projectA.id,
      owner.id,
      uniqueLabel("Task A")
    );

    const { error } = await owner.client
      .from("task_skills")
      .insert({ task_id: taskA.id, skill_id: skillB!.id });

    expect(error).not.toBeNull();
  });
});
