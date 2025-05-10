"use client";

import { UpdatePostForm } from "@/components/forms/update-post-form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Post } from "../../../generated";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { useState } from "react";

interface Props {
  asChild?: boolean;
  children: React.ReactNode;
  post: Post;
}

export function EditDialogPost({ asChild, children, post }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild={asChild}>{children}</DialogTrigger>
      <DialogContent>
        <VisuallyHidden>
          <DialogHeader>
            <DialogTitle>Editar publicação</DialogTitle>
            <DialogDescription>
              Altere as informações da sua publicação.
            </DialogDescription>
          </DialogHeader>
        </VisuallyHidden>

        <UpdatePostForm post={post} setOpen={setOpen} asChild />
      </DialogContent>
    </Dialog>
  );
}
