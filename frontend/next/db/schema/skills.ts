import {
  pgTable,
  uuid,
  varchar,
  text,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core";

export const skills = pgTable("skills", {
    id: uuid("id").primaryKey().defaultRandom(),
    name: varchar("name", { length: 255 }).notNull(),
    description: text("description"),
    iconUrl: text("icon_url"),
    createdAt: timestamp("created_at", {
        withTimezone: true,
    })
    .defaultNow()
    .notNull(),
});