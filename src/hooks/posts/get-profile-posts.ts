"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { cache } from "react";

export const getAllPostsByProfile = cache(async (authorId: string) => {
  const { userId } = await auth();

  const privatePost = userId !== authorId ? false : undefined;

  return await prisma.post.findMany({
    where: { private: privatePost, authorId },
    include: {
      author: { include: { followers: true, followRequestsReceived: true } },
      likes: { include: { author: true } },
      comments: { include: { author: true } },
    },
    orderBy: { createdAt: "desc" },
  });
});
