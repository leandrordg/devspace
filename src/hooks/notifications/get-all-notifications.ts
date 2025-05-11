"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { cache } from "react";

export const getAllNotifications = cache(async () => {
  const { userId } = await auth();

  if (!userId) return [];

  return await prisma.notification.findMany({
    where: { recipientId: userId },
    include: { recipient: true, sender: true },
    orderBy: { createdAt: "desc" },
  });
});
