"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const schema = z.object({ id: z.string() });

export async function deletePost(values: z.infer<typeof schema>) {
  const { userId } = await auth();

  if (!userId) return { error: "Usuário não autenticado" };

  try {
    const post = await prisma.post.findUnique({ where: { id: values.id } });

    if (!post) return { error: "Publicação não encontrada" };

    if (post.authorId !== userId) {
      return { error: "Você não tem permissão para excluir esta publicação" };
    }

    await prisma.post.delete({ where: { id: values.id } });

    revalidatePath(`/posts/${values.id}`);
    return { success: "Publicação excluída com sucesso" };
  } catch {
    console.error("Erro ao excluir a publicação");
    return { error: "Erro ao excluir a publicação" };
  }
}
