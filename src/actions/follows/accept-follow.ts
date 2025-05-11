"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export const acceptFollow = async (requestId: string) => {
  const { userId } = await auth();

  if (!userId) return { error: "Usuário não autenticado." };

  try {
    const followRequest = await prisma.followRequest.findUnique({
      where: { id: requestId },
    });

    if (!followRequest || followRequest.targetId !== userId) {
      return {
        error: "Solicitação não encontrada ou não pertence ao usuário.",
      };
    }

    await prisma.follow.create({
      data: {
        followerId: followRequest.requesterId,
        followingId: followRequest.targetId,
      },
    });

    await prisma.followRequest.delete({
      where: { id: requestId },
    });

    const requester = await prisma.user.findUnique({
      where: { clerkId: followRequest.requesterId },
    });

    await prisma.notification.create({
      data: {
        type: "FOLLOW_REQUEST_ACCEPTED",
        recipientId: followRequest.requesterId,
        senderId: followRequest.targetId,
      },
    });

    revalidatePath("/");
    return { success: `Você aceitou a solicitação de ${requester?.username}` };
  } catch {
    console.error("Erro ao aceitar a solicitação de seguir.");
    return { error: "Erro ao aceitar a solicitação de seguir." };
  }
};
