"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { cache } from "react";

export const getMyProfile = cache(async () => {
  const { userId } = await auth();

  if (!userId) return null;

  return await prisma.user.findUnique({
    where: { clerkId: userId },
    include: {
      followers: {
        include: {
          follower: true,
        },
      },
      following: {
        include: {
          following: true,
        },
      },
      followRequestsReceived: true,
      followRequestsSent: true,
    },
  });
});
