import { prisma } from "@/lib/prisma";

export const getProfileById = async (id: string) => {
  return await prisma.user.findUnique({
    where: { id },
  });
};
