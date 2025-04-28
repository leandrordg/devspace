import { prisma } from "@/lib/prisma";

export const getallPosts = async () => {
  return await prisma.post.findMany({
    where: { published: true },
    include: {
      author: true,
      likes: { include: { author: true } },
      comments: { include: { author: true } },
    },
  });
};
