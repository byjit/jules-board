import { createId } from "@paralleldrive/cuid2";
import { relations } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { createInsertSchema, createSelectSchema, createUpdateSchema } from "drizzle-zod";
import type { z } from "zod";
import { user } from "./user";
import { userStory } from "./user-story";

export const project = sqliteTable("project", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId()),
  name: text("name").notNull(),
  description: text("description"),
  branchName: text("branch_name"),
  gitRepo: text("git_repo"),
  gitBranch: text("git_branch"),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
});

export type Project = typeof project.$inferSelect;
export const selectProjectSchema = createSelectSchema(project);
export const insertProjectSchema = createInsertSchema(project);
export const updateProjectSchema = createUpdateSchema(project);
export type ProjectInsert = z.infer<typeof insertProjectSchema>;
export type ProjectUpdate = z.infer<typeof updateProjectSchema>;
export type ProjectSelect = z.infer<typeof selectProjectSchema>;

export const projectRelations = relations(project, ({ one, many }) => ({
  user: one(user, {
    fields: [project.userId],
    references: [user.id],
  }),
  userStories: many(userStory),
}));
