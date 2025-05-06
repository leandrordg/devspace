"use server";

import { cloudinary } from "@/lib/cloudinary";
import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
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

  const verifyUserAlreadyExists = await prisma.user.findUnique({
    where: { clerkId: userId },
  });

  if (!verifyUserAlreadyExists)
    return { error: "Você não possui uma conta ativa" };

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

  let uploadResult: UploadApiResponse | undefined = undefined;

  if (image && typeof image !== "string") {
    const imageArrayBuffer = await image.arrayBuffer();
    const imageBuffer = Buffer.from(imageArrayBuffer);

    uploadResult = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result);
          }
        }
      );

      uploadStream.end(imageBuffer);
    });
  }

  await prisma.user.update({
    where: { clerkId: userId },
    data: {
      bio,
      name,
      email,
      username,
      clerkId: userId,
      image: typeof image === "string" ? image : uploadResult?.secure_url,
      private: isPrivate,
    },
  });

  revalidatePath("/settings");
};
