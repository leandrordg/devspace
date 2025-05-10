"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function unfollowUser(id: string) {
  const { userId } = await auth();

  if (!userId) return { error: "Usuário não autenticado" };

  const userExists = await prisma.user.findUnique({
    where: { id },
  });

  if (!userExists) return { error: "Usuário não encontrado" };

  if (userExists.clerkId === userId) {
    return { error: "Você não pode deixar de seguir você" };
  }

  await prisma.follow.deleteMany({
    where: {
      followerId: userId,
      followingId: userExists.clerkId,
    },
  });

  const { count } = await prisma.followRequest.deleteMany({
    where: {
      requesterId: userId,
      targetId: userExists.clerkId,
    },
  });

  if (count) {
    revalidatePath("/");

    return { error: "Solicitação removida" };
  }

  revalidatePath("/");

  return { success: `Você deixou de seguir ${userExists.username}` };
}
