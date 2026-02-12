import { TRPCError } from "@trpc/server";
import { and, eq } from "drizzle-orm";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { project } from "@/server/db/schema/project";
import {
  insertUserStorySchema,
  updateUserStorySchema,
  userStory,
} from "@/server/db/schema/user-story";

export const userStoryRouter = createTRPCRouter({
  create: protectedProcedure.input(insertUserStorySchema).mutation(async ({ ctx, input }) => {
    // Verify project ownership
    const [existingProject] = await ctx.db
      .select()
      .from(project)
      .where(and(eq(project.id, input.projectId), eq(project.userId, ctx.session.user.id)));

    if (!existingProject) {
      throw new TRPCError({ code: "FORBIDDEN", message: "Project not found or access denied" });
    }

    const [newStory] = await ctx.db.insert(userStory).values(input).returning();
    return newStory;
  }),

  update: protectedProcedure
    .input(updateUserStorySchema.extend({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;

      // We could check ownership here too, or just rely on the projectId if it's provided in update
      // For safety, let's check if the story belongs to a project owned by the user
      const [storyWithProject] = await ctx.db
        .select({ storyId: userStory.id })
        .from(userStory)
        .innerJoin(project, eq(userStory.projectId, project.id))
        .where(and(eq(userStory.id, id), eq(project.userId, ctx.session.user.id)));

      if (!storyWithProject) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Story not found or access denied" });
      }

      const [updatedStory] = await ctx.db
        .update(userStory)
        .set(data)
        .where(eq(userStory.id, id))
        .returning();
      return updatedStory;
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const [storyWithProject] = await ctx.db
        .select({ storyId: userStory.id })
        .from(userStory)
        .innerJoin(project, eq(userStory.projectId, project.id))
        .where(and(eq(userStory.id, input.id), eq(project.userId, ctx.session.user.id)));

      if (!storyWithProject) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Story not found or access denied" });
      }

      const [deletedStory] = await ctx.db
        .delete(userStory)
        .where(eq(userStory.id, input.id))
        .returning();
      return deletedStory;
    }),
});
