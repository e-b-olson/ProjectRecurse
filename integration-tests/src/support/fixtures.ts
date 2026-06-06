import type { SupabaseClient, User } from "@supabase/supabase-js";
import { getAdminClient } from "./clients.js";
import { createAuthenticatedClient } from "./clients.js";
import { trackUser } from "./cleanup.js";

const RUN_ID = crypto.randomUUID().slice(0, 8);

export type TestUser = {
  id: string;
  email: string;
  password: string;
  client: SupabaseClient;
};

export async function createTestUser(label: string): Promise<TestUser> {
  const admin = getAdminClient();
  const email = `integration-${RUN_ID}-${label}@test.local`;
  const password = `Test-${RUN_ID}-${label}!`;

  const { data, error } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });

  if (error || !data.user) {
    throw new Error(`createUser failed: ${error?.message ?? "no user"}`);
  }

  trackUser(data.user.id);

  const client = await createAuthenticatedClient(email, password);

  return {
    id: data.user.id,
    email,
    password,
    client,
  };
}

export async function waitForProfile(
  client: SupabaseClient,
  userId: string,
  attempts = 10
): Promise<void> {
  for (let i = 0; i < attempts; i++) {
    const { data } = await client
      .from("profiles")
      .select("id")
      .eq("id", userId)
      .maybeSingle();
    if (data) return;
    await new Promise((r) => setTimeout(r, 200));
  }
  throw new Error(`Profile not created for user ${userId}`);
}

export type TestProject = {
  id: string;
  name: string;
};

export async function createProject(
  client: SupabaseClient,
  user: User | { id: string },
  name: string
): Promise<TestProject> {
  const { data, error } = await client
    .from("projects")
    .insert({
      name,
      description: "integration test project",
      creator_id: user.id,
      owner_id: user.id,
    })
    .select("id, name")
    .single();

  if (error || !data) {
    throw new Error(`createProject failed: ${error?.message ?? "no row"}`);
  }

  return { id: data.id, name: data.name };
}

export type TestTask = {
  id: string;
  title: string;
};

export async function createTask(
  client: SupabaseClient,
  projectId: string,
  userId: string,
  title: string
): Promise<TestTask> {
  const { data, error } = await client
    .from("tasks")
    .insert({
      project_id: projectId,
      title,
      description: "integration test task",
      created_by: userId,
      status: "todo",
    })
    .select("id, title")
    .single();

  if (error || !data) {
    throw new Error(`createTask failed: ${error?.message ?? "no row"}`);
  }

  return { id: data.id, title: data.title };
}

export function uniqueLabel(prefix: string): string {
  return `${prefix}-${RUN_ID}-${crypto.randomUUID().slice(0, 8)}`;
}
