import { createProxySSGHelpers } from "@trpc/react-query/ssg";
import { appRouter } from "~/server/api/root";
import superjson from "superjson";
import { prisma } from "~/server/db";

export const generateSSGHelper = () =>
  createProxySSGHelpers({
    router: appRouter,
    ctx: { prisma, userId: null },
    transformer: superjson,
  });
