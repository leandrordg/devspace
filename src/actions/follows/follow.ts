"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function followUser(id: string) {
  const { userId } = await auth();

  if (!userId) return { error: "Usuário não autenticado" };

  try {
    const userExists = await prisma.user.findUnique({
      where: { id },
    });

    if (!userExists) return { error: "Usuário não encontrado" };

    if (userExists.clerkId === userId) {
      return { error: "Você não pode seguir você mesmo" };
    }

    const isAlreadyFollowing = await prisma.follow.findFirst({
      where: {
        followerId: userId,
        followingId: userExists.clerkId,
      },
    });

    if (isAlreadyFollowing) return { error: "Você já segue esse usuário" };

    if (userExists.private) {
      const requestAlreadyExists = await prisma.followRequest.findFirst({
        where: {
          requesterId: userId,
          targetId: userExists.clerkId,
        },
      });

      if (requestAlreadyExists) return { error: "Solicitação já enviada" };

      await prisma.followRequest.create({
        data: {
          requesterId: userId,
          targetId: userExists.clerkId,
        },
      });

      const sender = await prisma.user.findUnique({
        where: { clerkId: userId },
      });

      await prisma.notification.create({
        data: {
          type: "FOLLOW_REQUEST",
          recipientId: userExists.clerkId,
          senderId: userId,
        },
      });

      revalidatePath("/");
      return { success: "Solicitação enviada com sucesso" };
    }

    await prisma.follow.create({
      data: {
        followerId: userId,
        followingId: userExists.clerkId,
      },
    });

    await prisma.notification.create({
      data: {
        type: "FOLLOW",
        recipientId: userExists.clerkId,
        senderId: userId,
      },
    });

    revalidatePath("/");
    return { success: `Você começou a seguir ${userExists.username}` };
  } catch {
    console.error("Erro ao seguir o usuário.");
    return { error: "Erro ao seguir o usuário." };
  }
}
