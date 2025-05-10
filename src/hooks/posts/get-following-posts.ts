"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { cache } from "react";

export const getFollowingPosts = cache(async () => {
  const { userId } = await auth();

  if (!userId) return [];

  const following = await prisma.follow.findMany({
    where: { followerId: userId },
    select: { followingId: true },
  });

  const followingIds = following.map((f) => f.followingId);

  if (!followingIds.length) return [];

  return await prisma.post.findMany({
    where: { authorId: { in: followingIds }, private: false },
    orderBy: { createdAt: "desc" },
    include: {
      author: {
        include: {
          followers: true,
          followRequestsReceived: true,
        },
      },
      comments: true,
      likes: true,
    },
  });
});
