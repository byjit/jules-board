import { and, eq } from "drizzle-orm";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { insertProjectSchema, project, updateProjectSchema } from "@/server/db/schema/project";

export const projectRouter = createTRPCRouter({
  getAll: protectedProcedure.query(async ({ ctx }) => {
    const projects = await ctx.db.query.project.findMany({
      where: eq(project.userId, ctx.session.user.id),
      with: {
        userStories: true,
      },
      orderBy: (project, { desc }) => [desc(project.createdAt)],
    });
    return projects;
  }),

  create: protectedProcedure
    .input(insertProjectSchema.omit({ userId: true }))
    .mutation(async ({ ctx, input }) => {
      const [newProject] = await ctx.db
        .insert(project)
        .values({
          ...input,
          userId: ctx.session.user.id,
        })
        .returning();
      return newProject;
    }),

  update: protectedProcedure
    .input(updateProjectSchema.extend({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;
      const [updatedProject] = await ctx.db
        .update(project)
        .set(data)
        .where(and(eq(project.id, id), eq(project.userId, ctx.session.user.id)))
        .returning();
      return updatedProject;
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const [deletedProject] = await ctx.db
        .delete(project)
        .where(and(eq(project.id, input.id), eq(project.userId, ctx.session.user.id)))
        .returning();
      return deletedProject;
    }),
});
