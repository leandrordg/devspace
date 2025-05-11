"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function removeFollow(followerId: string) {
  const { userId } = await auth();

  if (!userId) return { error: "Usuário não autenticado" };

  if (followerId === userId) {
    return { error: "Você não pode remover você mesmo" };
  }

  try {
    const followerExists = await prisma.user.findUnique({
      where: { clerkId: followerId },
    });

    if (!followerExists) return { error: "Usuário não encontrado" };

    await prisma.follow.deleteMany({
      where: {
        followerId: followerExists.clerkId,
        followingId: userId,
      },
    });

    revalidatePath("/");
    return { success: `Você removeu o seguidor ${followerExists.username}` };
  } catch {
    console.error("Erro ao remover o seguidor.");
    return { error: "Erro ao remover o seguidor." };
  }
}
