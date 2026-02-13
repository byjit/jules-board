import { eq } from "drizzle-orm";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { user } from "@/server/db/schema";
import { updateUserSchema } from "@/server/db/schema/user";

export const userRouter = createTRPCRouter({
  getCurrentUser: protectedProcedure.query(async ({ ctx }) => {
    const [currentUser] = await ctx.db
      .select()
      .from(user)
      .where(eq(user.id, ctx.session.user.id))
      .limit(1);

    return currentUser;
  }),

  updateJulesApiKey: protectedProcedure
    .input(z.object({ julesApiKey: z.string().trim() }))
    .mutation(async ({ ctx, input }) => {
      const [updatedUser] = await ctx.db
        .update(user)
        .set({ julesApiKey: input.julesApiKey })
        .where(eq(user.id, ctx.session.user.id))
        .returning();

      return updatedUser;
    }),

  updateUser: protectedProcedure.input(updateUserSchema).mutation(async ({ ctx, input }) => {
    const [updatedUser] = await ctx.db
      .update(user)
      .set(input)
      .where(eq(user.id, ctx.session.user.id))
      .returning();

    return updatedUser;
  }),
  getUser: protectedProcedure.input(z.object({ id: z.string() })).query(async ({ ctx, input }) => {
    const [u] = await ctx.db.select().from(user).where(eq(user.id, input.id)).limit(1);

    return u;
  }),
});
