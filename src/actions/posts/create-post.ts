"use server";

import { cloudinary } from "@/lib/cloudinary";
import { prisma } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { UploadApiResponse } from "cloudinary";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const schema = z.object({
  content: z.string(),
  image: z.instanceof(File).optional(),
  published: z.boolean(),
});

export const createPost = async ({
  content,
  published,
  image,
}: z.infer<typeof schema>) => {
  const user = await currentUser();

  if (!user || !user.id) return { error: "Usuário não autenticado" };

  const userExists = await prisma.user.findUnique({
    where: { clerkId: user.id },
  });

  if (!userExists) {
    const email = user.primaryEmailAddress?.emailAddress || undefined;
    const username = user.username || undefined;

    const userWithEmailOrUsernameExists = await prisma.user.findFirst({
      where: { NOT: { clerkId: user.id }, OR: [{ email }, { username }] },
    });

    if (userWithEmailOrUsernameExists) {
      const message =
        userWithEmailOrUsernameExists.username === user.username
          ? "Nome de usuário já cadastrado"
          : "Email já cadastrado";

      return { error: message };
    }

    await prisma.user.create({
      data: {
        clerkId: user.id,
        private: true,
        name: user.fullName || user.id,
        image: user.imageUrl,
        username: user.username || user.id,
        email: user.primaryEmailAddress
          ? user.primaryEmailAddress.emailAddress
          : user.id,
      },
    });
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

  await prisma.post.create({
    data: {
      content,
      published,
      authorId: user.id,
      image: uploadResult?.secure_url,
    },
  });

  revalidatePath("/posts");
};
