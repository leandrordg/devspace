"use server";

import { prisma } from "@/lib/prisma";
import { cache } from "react";

export const getAllPosts = cache(async () => {
  return await prisma.post.findMany({
    where: { private: false },
    include: {
      author: { include: { followers: true, followRequestsReceived: true } },
      likes: { include: { author: true } },
      comments: { include: { author: true } },
    },
    orderBy: { createdAt: "desc" },
  });
});
