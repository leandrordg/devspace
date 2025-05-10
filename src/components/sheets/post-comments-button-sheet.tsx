"use client";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Comment, Post } from "../../../generated";
import { MessageCircleIcon } from "lucide-react";

interface Props {
  post: Post;
  comments: Comment[];
}

export function PostCommentsButtonSheet({ post, comments }: Props) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">
          <MessageCircleIcon /> {comments.length}
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Comentários ({comments.length})</SheetTitle>
          <SheetDescription>
            Veja todos os comentários da publicação abaixo.
          </SheetDescription>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
}
