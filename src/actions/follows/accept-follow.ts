"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export const acceptFollow = async (requestId: string) => {
  const { userId } = await auth();

  if (!userId) return { error: "Usuário não autenticado." };

  const followRequest = await prisma.followRequest.findUnique({
    where: { id: requestId },
  });

  if (!followRequest || followRequest.targetId !== userId) {
    return { error: "Solicitação não encontrada ou não pertence ao usuário." };
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
    where: { id: followRequest.requesterId },
  });

  await prisma.notification.create({
    data: {
      type: "FOLLOW_REQUEST_ACCEPTED",
      message: `Sua solicitação para seguir ${requester?.username} foi aceita.`,
      recipientId: followRequest.requesterId,
      senderId: followRequest.targetId,
    },
  });

  revalidatePath("/profile/followers/requests");

  return { success: "Solicitação aceita com sucesso!" };
};
