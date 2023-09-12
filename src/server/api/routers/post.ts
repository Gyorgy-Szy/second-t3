import { clerkClient } from "@clerk/nextjs";
import { User } from "@clerk/nextjs/dist/types/server";
import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

const filterUserForClient = (user: User) => {
  return { id: user.id, username: user.username, imageUrl: user.imageUrl }
}

export const postRouter = createTRPCRouter({
  // hello: publicProcedure
  //   .input(z.object({ text: z.string() }))
  //   .query(({ input }) => {
  //     return {
  //       greeting: `Hello ${input.text}`,
  //     };
  //   }),
  // getAll: publicProcedure.query(({ ctx }) => {
  //   return ctx.db.post.findMany();
  // }),

  getAll: publicProcedure.query(async ({ ctx }) => {
    const posts = await ctx.db.post.findMany({
      take: 100
    });

    const usersMap = new Map<string, Partial<User>>();
    (await clerkClient.users.getUserList({
      userId: [...new Set(posts.map(p => p.authorId))],
      limit: 100,
    })).forEach(u => usersMap.set(u.id, filterUserForClient(u)));

    return posts.map(p => ({ post: p, author: usersMap.get(p.authorId) }));
  }),
});
