"use client";

import { removeFollow } from "@/actions/follows/remove-follow";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import Link from "next/link";
import { useTransition } from "react";
import { toast } from "sonner";
import { Follow, User } from "../../../generated";

interface Props {
  user: User;
  isOwner: boolean;
  children: React.ReactNode;
  followers: (Follow & {
    follower: User;
  })[];
}

export function FollowersSheet({ children, isOwner, user, followers }: Props) {
  const [isPending, startTransition] = useTransition();

  const handleRemoveFollower = async (followerId: string) => {
    startTransition(async () => {
      if (!isOwner) return;
      const { success, error } = await removeFollow(followerId);
      if (success) toast.success(success);
      if (error) toast.error(error);
    });
  };

  return (
    <Sheet>
      <SheetTrigger className="cursor-pointer" asChild>
        {children}
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Seguidores ({followers.length})</SheetTitle>
          <SheetDescription>
            Veja todos os seguidores de {user.username}.
          </SheetDescription>
        </SheetHeader>

        <ScrollArea className="h-full w-full">
          <div className="grid grid-cols-1 gap-4">
            {followers.map(({ follower }) => {
              const userInitials = follower.name
                .split(" ")
                .filter(Boolean)
                .map((word) => word[0].toUpperCase())
                .join("");

              return (
                <div key={follower.id} className="flex items-center gap-2">
                  <Link href={`/profile/${follower.clerkId}`}>
                    <Avatar className="size-10">
                      <AvatarImage src={follower.image} />
                      <AvatarFallback>{userInitials}</AvatarFallback>
                    </Avatar>
                  </Link>
                  <div>
                    <Link href={`/profile/${follower.clerkId}`}>
                      <p className="text-sm font-semibold">{follower.name}</p>
                    </Link>
                    <p className="text-sm text-muted-foreground">
                      {follower.username}
                    </p>
                  </div>
                  {isOwner && (
                    <button
                      type="button"
                      disabled={isPending}
                      onClick={() => handleRemoveFollower(follower.clerkId)}
                      className="ml-auto text-sm text-muted-foreground hover:text-foreground cursor-pointer"
                    >
                      {isPending ? "Removendo..." : "Remover"}
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
