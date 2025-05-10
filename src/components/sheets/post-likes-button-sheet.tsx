"use client";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { HeartIcon } from "lucide-react";
import { useState } from "react";
import { Like, Post } from "../../../generated";

interface Props {
  post: Post;
  likes: Like[];
}

export function PostLikesButtonSheet({ post, likes }: Props) {
  const [open, setOpen] = useState(false);

  const handleLeftClick = () => {
    console.log("Left click - like or unlike");
  };

  const handleRightClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setOpen(true);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <Button
        variant="outline"
        onClick={handleLeftClick}
        onContextMenu={handleRightClick}
      >
        <HeartIcon /> {likes.length}
      </Button>

      <SheetContent>
        <SheetHeader>
          <SheetTitle>Curtídas ({likes.length})</SheetTitle>
          <SheetDescription>
            Veja todas as curtidas da publicação abaixo.
          </SheetDescription>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
}
