"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export const markNotificationAsRead = async (notificationId: string) => {
  const { userId } = await auth();

  if (!userId) return { error: "Usuário não autenticado" };

  try {
    await prisma.notification.update({
      where: { id: notificationId, recipientId: userId },
      data: { read: true },
    });

    revalidatePath("/");
    return { success: "Notificação marcada como lida" };
  } catch {
    console.error("Erro ao marcar notificação como lida.");
    return { error: "Erro ao marcar notificação como lida" };
  }
};
