"use server";

import { cloudinary } from "@/lib/cloudinary";
import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { UploadApiResponse } from "cloudinary";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const schema = z.object({
  content: z.string().optional(),
  image: z.instanceof(File).optional(),
  private: z.boolean(),
});

export const createPost = async ({
  content,
  private: privatePost,
  image,
}: z.infer<typeof schema>) => {
  const { userId } = await auth();

  if (!userId) return { error: "Usuário não autenticado" };

  try {
    const userExists = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    if (!userExists) return { error: "Usuário não existe" };

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
        private: privatePost,
        authorId: userId,
        image: uploadResult?.secure_url,
      },
    });

    revalidatePath("/posts/create");
    return { success: "Publicação criada com sucesso" };
  } catch {
    console.error("Erro ao criar a publicação");
    return { error: "Erro ao criar a publicação" };
  }
};
