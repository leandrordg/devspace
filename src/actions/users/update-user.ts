"use server";

import { cloudinary } from "@/lib/cloudinary";
import { prisma } from "@/lib/prisma";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { UploadApiResponse } from "cloudinary";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const schema = z.object({
  name: z.string().optional(),
  email: z.string().email().optional(),
  username: z.string().optional(),
  image: z.union([z.instanceof(File), z.string()]).optional(),
  bio: z.string().optional(),
  private: z.boolean(),
});

export const updateUser = async ({
  name,
  email,
  username,
  image,
  bio,
  private: isPrivate,
}: z.infer<typeof schema>) => {
  const { userId } = await auth();
  if (!userId) return { error: "Usuário não autenticado" };

  try {
    const existingUser = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    if (!existingUser) {
      return { error: "Você não possui uma conta ativa" };
    }

    const conflictingUser = await prisma.user.findFirst({
      where: {
        NOT: { clerkId: userId },
        OR: [{ email }, { username }],
      },
    });

    if (conflictingUser) {
      const message =
        conflictingUser.email === email
          ? "Email já cadastrado"
          : "Nome de usuário já cadastrado";
      return { error: message };
    }

    const clerk = await clerkClient();

    let finalImageUrl: string | undefined;
    if (image && typeof image !== "string") {
      const imageArrayBuffer = await image.arrayBuffer();
      const imageBuffer = Buffer.from(imageArrayBuffer);

      const uploadResult: UploadApiResponse = await new Promise(
        (resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            (error, result) => {
              if (error) reject(error);
              else resolve(result as UploadApiResponse);
            }
          );
          uploadStream.end(imageBuffer);
        }
      );

      finalImageUrl = uploadResult.secure_url;

      await clerk.users.updateUserProfileImage(userId, { file: image });
    } else if (typeof image === "string") {
      finalImageUrl = image;
    }

    await prisma.user.update({
      where: { clerkId: userId },
      data: {
        bio,
        name,
        email,
        username,
        clerkId: userId,
        image: finalImageUrl,
        private: isPrivate,
      },
    });

    let firstName: string | undefined;
    let lastName: string | undefined;

    if (name) {
      const nameParts = name.trim().split(" ");
      firstName = nameParts[0];
      lastName = nameParts.slice(1).join(" ") || undefined;
    }

    await clerk.users.updateUser(userId, {
      firstName,
      lastName,
      username,
    });

    if (!isPrivate) {
      const pendingRequests = await prisma.followRequest.findMany({
        where: {
          targetId: userId,
        },
      });

      const followsToCreate = pendingRequests.map((request) => ({
        followerId: request.requesterId,
        followingId: request.targetId,
      }));

      if (followsToCreate.length > 0) {
        await prisma.follow.createMany({
          data: followsToCreate,
          skipDuplicates: true,
        });

        await prisma.followRequest.deleteMany({
          where: {
            targetId: userId,
          },
        });
      }
    }

    revalidatePath("/profile/settings");
    return { success: "Perfil atualizado com sucesso" };
  } catch (error) {
    console.error("Erro ao atualizar o usuário:", error);
    return { error: "Ocorreu um erro ao atualizar o perfil" };
  }
};
