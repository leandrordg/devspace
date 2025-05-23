"use server";

import { prisma } from "@/lib/prisma";
import { cache } from "react";

export const getProfileById = cache(async (clerkId: string) => {
  return await prisma.user.findUnique({
    where: { clerkId },
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
