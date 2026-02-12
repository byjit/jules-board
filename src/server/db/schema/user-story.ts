import { createId } from "@paralleldrive/cuid2";
import { relations } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { createInsertSchema, createSelectSchema, createUpdateSchema } from "drizzle-zod";
import type { z } from "zod";
import { project } from "./project";

export const userStory = sqliteTable("user_story", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId()),
  projectId: text("project_id")
    .notNull()
    .references(() => project.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  description: text("description").notNull(),
  acceptanceCriteria: text("acceptance_criteria", { mode: "json" })
    .$type<string[]>()
    .notNull()
    .default([]),
  priority: integer("priority").notNull().default(0),
  passes: integer("passes", { mode: "boolean" }).notNull().default(false),
  status: text("status", { enum: ["todo", "doing", "done"] })
    .notNull()
    .default("todo"),
  notes: text("notes").notNull().default(""),
  dependsOn: text("depends_on", { mode: "json" }).$type<string[]>().notNull().default([]),
  sessionId: text("session_id"),
  sessionStatus: text("session_status"),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
});

export type UserStory = typeof userStory.$inferSelect;
export const selectUserStorySchema = createSelectSchema(userStory);
export const insertUserStorySchema = createInsertSchema(userStory);
export const updateUserStorySchema = createUpdateSchema(userStory);
export type UserStoryInsert = z.infer<typeof insertUserStorySchema>;
export type UserStoryUpdate = z.infer<typeof updateUserStorySchema>;
export type UserStorySelect = z.infer<typeof selectUserStorySchema>;

export const userStoryRelations = relations(userStory, ({ one }) => ({
  project: one(project, {
    fields: [userStory.projectId],
    references: [project.id],
  }),
}));
