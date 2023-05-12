import { auth, clerkClient } from "@clerk/nextjs";
import type { User } from "@clerk/nextjs/dist/api";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

const filterUserForClient = (user: User) => {
  return {
    id: user.id,
    username: user.username!,
    profileImageUrl: user.profileImageUrl,
  };
};

export const postsRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    const posts = await ctx.prisma.post.findMany({
      take: 100,
    });

    const users = (
      await clerkClient.users.getUserList({
        userId: posts.map((post) => post.authorId),
        limit: 100,
      })
    ).map(filterUserForClient);

    //.map -> filterUserForClient

    console.table(users);

    return posts.map((post) => {
      const author = users.find((user) => user.id === post.authorId); // Very important

      if (!author)
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Author for this post is not found",
        });

      return {
        post,
        author,
      };
    });
  }),
});
