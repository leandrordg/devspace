"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export const denyFollowRequest = async (requestId: string) => {
  const { userId } = await auth();

  if (!userId) return { error: "Usuário não autenticado." };

  const followRequest = await prisma.followRequest.findUnique({
    where: { id: requestId },
  });

  if (!followRequest || followRequest.targetId !== userId) {
    return { error: "Solicitação não encontrada ou não pertence ao usuário." };
  }

  await prisma.followRequest.delete({
    where: { id: requestId },
  });

  revalidatePath("/profile/followers/requests");

  return { success: "Solicitação recusada com sucesso!" };
};
