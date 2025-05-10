"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export const markAllNotificationsAsRead = async () => {
  const { userId } = await auth();

  if (!userId) return { error: "Usuário não autenticado." };

  await prisma.notification.updateMany({
    where: { recipientId: userId, read: false },
    data: { read: true },
  });

  revalidatePath("/");

  return { success: "Notificações marcadas como lidas" };
};
