"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export const denyFollowRequest = async (requestId: string) => {
  const { userId } = await auth();

  if (!userId) return { error: "Usuário não autenticado." };

  try {
    const followRequest = await prisma.followRequest.findUnique({
      where: { id: requestId },
    });

    if (!followRequest || followRequest.targetId !== userId) {
      return {
        error: "Solicitação não encontrada ou não pertence ao usuário",
      };
    }

    await prisma.followRequest.delete({
      where: { id: requestId },
    });

    revalidatePath("/");
    return { success: "Solicitação negada com sucesso!" };
  } catch {
    console.error("Erro ao negar a solicitação de seguir.");
    return { error: "Erro ao negar a solicitação de seguir." };
  }
};
