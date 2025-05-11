"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export const deleteAllNotifications = async () => {
  const { userId } = await auth();

  if (!userId) return { error: "Usuário não autenticado" };

  try {
    await prisma.notification.deleteMany({
      where: { recipientId: userId },
    });

    revalidatePath("/");
    return { success: "Todas as notificações foram excluídas com sucesso" };
  } catch {
    console.error("Erro ao excluir notificações");
    return { error: "Erro ao excluir notificações" };
  }
};
