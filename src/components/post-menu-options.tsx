"use client";

import { EditDialogPost } from "@/components/dialog/edit-post-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Post } from "../../generated";
import {
  AlertTriangleIcon,
  PencilIcon,
  Share2Icon,
  Trash2Icon,
} from "lucide-react";
import { DeletePostDialog } from "./dialog/delete-post-dialog";

interface Props {
  asChild?: boolean;
  children: React.ReactNode;
  isOwner: boolean;
  post: Post;
}

export function PostMenuOptions({ asChild, children, post, isOwner }: Props) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="ml-auto" asChild={asChild}>
        {children}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Ações</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <AlertTriangleIcon />
          Denunciar
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Share2Icon />
          Compartilhar
        </DropdownMenuItem>
        {isOwner && (
          <>
            <DropdownMenuSeparator />
            <EditDialogPost post={post} asChild>
              <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                <PencilIcon />
                Editar
              </DropdownMenuItem>
            </EditDialogPost>
            <DeletePostDialog post={post} asChild>
              <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                <Trash2Icon />
                Excluir
              </DropdownMenuItem>
            </DeletePostDialog>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
