import { prisma } from "@/lib/prisma";

export const getProfileById = async (clerkId: string) => {
  return await prisma.user.findUnique({
    where: { clerkId },
    include: {
      followers: true,
      following: true,
      followRequestsReceived: true,
      followRequestsSent: true,
    },
  });
};
