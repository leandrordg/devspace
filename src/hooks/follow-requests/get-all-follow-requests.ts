"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { cache } from "react";

export const getAllFollowRequests = cache(async () => {
  const { userId } = await auth();

  if (!userId) throw new Error("Usuário não autenticado");

  return await prisma.followRequest.findMany({
    where: { targetId: userId },
    include: { requester: true },
    orderBy: { createdAt: "desc" },
  });
});
