"use client";

import { DeletePostDialog } from "@/components/dialogs/delete-post-dialog";
import { EditDialogPost } from "@/components/dialogs/edit-post-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AlertTriangleIcon, PencilIcon, Trash2Icon } from "lucide-react";
import { Post } from "../../generated";

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
      <DropdownMenuContent side="left" align="end">
        <DropdownMenuItem>
          <AlertTriangleIcon />
          Denunciar
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
