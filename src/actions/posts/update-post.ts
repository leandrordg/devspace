"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const schema = z.object({
  id: z.string(),
  content: z.string().nullable(),
  published: z.boolean(),
});

export async function updatePost({
  id,
  content,
  published,
}: z.infer<typeof schema>) {
  const { userId } = await auth();

  if (!userId) return { error: "Usuário não autenticado" };

  try {
    const post = await prisma.post.findUnique({ where: { id } });

    if (!post) return { error: "Publicação não encontrada" };

    if (post.authorId !== userId) {
      return { error: "Você não tem permissão para editar esta publicação" };
    }

    await prisma.post.update({ where: { id }, data: { content, published } });
  } catch {
    console.error("Erro ao atualizar a publicação");
    return { error: "Erro ao atualizar a publicação" };
  }

  revalidatePath(`/posts/${id}`);

  return { success: "Publicação atualizada com sucesso" };
}
