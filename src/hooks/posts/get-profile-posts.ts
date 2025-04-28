import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export const getAllPostsByProfile = async (authorId: string) => {
  const { userId } = await auth();

  const published = userId !== authorId ? true : undefined;

  return await prisma.post.findMany({
    where: { published, authorId },
    include: {
      author: true,
      likes: { include: { author: true } },
      comments: { include: { author: true } },
    },
    orderBy: { createdAt: "desc" },
  });
};
