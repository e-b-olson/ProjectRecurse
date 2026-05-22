import { pgTable, uuid, text, timestamp, pgEnum } from "drizzle-orm/pg-core";

export const betaRegistrations = pgTable("beta_registrations", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

export const profiles = pgTable("profiles", {
  id: uuid("id").primaryKey(),  // matches auth.users.id
  displayName: text("display_name"),
  avatarUrl: text("avatar_url"),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

export const projects = pgTable("projects", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  description: text("description"),
  creatorId: uuid("creator_id").notNull(),   // auth.users.id
  ownerId: uuid("owner_id").notNull(),        // auth.users.id, defaults to creator
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

export const taskStatusEnum = pgEnum("task_status", ["backlog", "todo", "in_progress", "in_review", "done"]);

export const tasks = pgTable("tasks", {
  id: uuid("id").primaryKey().defaultRandom(),
  projectId: uuid("project_id").notNull().references(() => projects.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  description: text("description"),
  status: taskStatusEnum("status").notNull().default("todo"),
  createdBy: uuid("created_by").notNull(),  // auth.users.id
  assignedTo: uuid("assigned_to"),          // auth.users.id, nullable
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

export const taskVolunteers = pgTable("task_volunteers", {
  taskId: uuid("task_id").notNull().references(() => tasks.id, { onDelete: "cascade" }),
  userId: uuid("user_id").notNull(),  // auth.users.id
  volunteeredAt: timestamp("volunteered_at", { withTimezone: true }).defaultNow(),
});
