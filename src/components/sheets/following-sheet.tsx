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
  following: (Follow & {
    following: User;
  })[];
}

export function FollowingSheet({ children, user, following }: Props) {
  return (
    <Sheet>
      <SheetTrigger className="cursor-pointer" asChild>
        {children}
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Seguindo ({following.length})</SheetTitle>
          <SheetDescription>
            Veja quem {user.username} está seguindo.
          </SheetDescription>
        </SheetHeader>

        <ScrollArea className="h-full w-full">
          <div className="grid grid-cols-1 gap-4">
            {following.map(({ following }) => {
              const userInitials = following.name
                .split(" ")
                .filter(Boolean)
                .map((word) => word[0].toUpperCase())
                .join("");

              return (
                <div key={following.id} className="flex items-center gap-2">
                  <Link href={`/profile/${following.clerkId}`}>
                    <Avatar className="size-10">
                      <AvatarImage src={following.image} />
                      <AvatarFallback>{userInitials}</AvatarFallback>
                    </Avatar>
                  </Link>
                  <div>
                    <Link href={`/profile/${following.clerkId}`}>
                      <p className="text-sm font-semibold">{following.name}</p>
                    </Link>
                    <p className="text-sm text-muted-foreground">
                      {following.username}
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
