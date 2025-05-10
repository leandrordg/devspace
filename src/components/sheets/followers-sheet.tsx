"use client";

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
import { Follow, User } from "../../../generated";

interface Props {
  children: React.ReactNode;
  user: User;
  followers: (Follow & {
    follower: User;
  })[];
}

export function FollowersSheet({ children, user, followers }: Props) {
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
                </div>
              );
            })}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
