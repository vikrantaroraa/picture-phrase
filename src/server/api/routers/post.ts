import { z } from "zod";
import {
  createTRPCRouter,
  publicProcedure, // Keep this as publicProcedure
} from "@/server/api/trpc";

export const postRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      };
    }),

  create: publicProcedure // Use publicProcedure temporarily
    .input(z.object({ name: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.post.create({
        data: {
          name: input.name,
          // Temporarily mock the `createdBy` field with a hardcoded user ID
          createdBy: { connect: { id: "mocked-user-id" } },
        },
      });
    }),

  getLatest: publicProcedure.query(async ({ ctx }) => {
    const post = await ctx.db.post.findFirst({
      orderBy: { createdAt: "desc" },
    });

    return post ?? null;
  }),

  getSecretMessage: publicProcedure.query(() => {
    return "you can now see this secret message!";
  }),
});
