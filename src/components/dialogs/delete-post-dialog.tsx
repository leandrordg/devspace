"use client";

import { deletePost } from "@/actions/posts/delete-post";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Post } from "../../../generated";
import { toast } from "sonner";

interface Props {
  asChild?: boolean;
  children: React.ReactNode;
  post: Post;
}

export function DeletePostDialog({ asChild, children, post }: Props) {
  const handleDelete = async () => {
    const { success, error } = await deletePost({ id: post.id });

    if (success) toast.success(success);
    if (error) toast.error(error);
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild={asChild}>{children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Excluir publicação</AlertDialogTitle>
          <AlertDialogDescription>
            Tem certeza que deseja excluir esta publicação? Esta ação não pode
            ser desfeita.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete}>Excluir</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
