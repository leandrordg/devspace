"use server";

import { cloudinary } from "@/lib/cloudinary";
import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { UploadApiResponse } from "cloudinary";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const schema = z.object({
  name: z.string(),
  email: z.string().email(),
  username: z.string(),
  image: z.instanceof(File).optional(),
  bio: z.string().optional(),
  private: z.boolean(),
});

export const createUser = async ({
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
    where: { id: userId },
  });

  if (verifyUserAlreadyExists)
    return { error: "Você já possui uma conta ativa" };

  const userWithEmailOrUsernameExists = await prisma.user.findFirst({
    where: { OR: [{ email }, { username }] },
  });

  if (userWithEmailOrUsernameExists) {
    const message =
      userWithEmailOrUsernameExists.email === email
        ? "Email já cadastrado"
        : "Nome de usuário já cadastrado";

    return { error: message };
  }

  let uploadResult: UploadApiResponse | undefined = undefined;

  if (image) {
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

  await prisma.user.create({
    data: {
      bio,
      name,
      email,
      username,
      clerkId: userId,
      image: uploadResult
        ? uploadResult.secure_url
        : "https://placehold.co/600x400/png",
      private: isPrivate,
    },
  });

  revalidatePath("/settings");
};
