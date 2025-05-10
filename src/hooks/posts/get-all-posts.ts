import { prisma } from "@/lib/prisma";

export const getAllPosts = async () => {
  return await prisma.post.findMany({
    where: { private: false },
    include: {
      author: { include: { followers: true, followRequestsReceived: true } },
      likes: { include: { author: true } },
      comments: { include: { author: true } },
    },
    orderBy: { createdAt: "desc" },
  });
};
