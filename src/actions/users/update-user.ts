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

  // verify if the user already exists
  try {
    const verifyUserAlreadyExists = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    if (!verifyUserAlreadyExists) {
      return { error: "Você não possui uma conta ativa" };
    }
  } catch {
    console.error("Erro ao verificar se o usuário existe");
    return { error: "Ocorreu um erro ao verificar o usuário" };
  }

  // verify if the email or username already exists by other user
  try {
    const userWithEmailOrUsernameExists = await prisma.user.findFirst({
      where: { NOT: { clerkId: userId }, OR: [{ email }, { username }] },
    });

    if (userWithEmailOrUsernameExists) {
      const message =
        userWithEmailOrUsernameExists.email === email
          ? "Email já cadastrado"
          : "Nome de usuário já cadastrado";

      return { error: message };
    }
  } catch {
    console.error("Erro ao verificar se o email ou nome de usuário já existe");
    return { error: "Ocorreu um erro ao verificar o email ou nome de usuário" };
  }

  const clerk = await clerkClient();

  let uploadResult: UploadApiResponse | undefined;
  let finalImageUrl: string | undefined;

  if (image && typeof image !== "string") {
    const imageArrayBuffer = await image.arrayBuffer();
    const imageBuffer = Buffer.from(imageArrayBuffer);

    uploadResult = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      uploadStream.end(imageBuffer);
    });

    finalImageUrl = uploadResult?.secure_url;

    await clerk.users.updateUserProfileImage(userId, { file: image });
  } else if (typeof image === "string") {
    finalImageUrl = image;
  }

  try {
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
  } catch (error) {
    console.error("Erro ao atualizar no Prisma/Clerk:", error);
    return { error: "Ocorreu um erro ao atualizar!" };
  }

  revalidatePath("/profile/settings");

  return { success: "Usuário atualizado com sucesso!" };
};
