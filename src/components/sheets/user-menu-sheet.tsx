import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { SignOutButton } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import {
  BoltIcon,
  CirclePlusIcon,
  HomeIcon,
  LogInIcon,
  LogOutIcon,
  UserRoundIcon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export async function UserMenuSheet() {
  const user = await currentUser();

  if (!user || !user.id) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <Button size="icon" asChild>
            <Link href="/auth/sign-in">
              <LogInIcon />
              <span className="sr-only">fazer login</span>
            </Link>
          </Button>
        </TooltipTrigger>
        <TooltipContent>Fazer login</TooltipContent>
      </Tooltip>
    );
  }

  const userInitials = [user.firstName, user.lastName]
    .filter(Boolean)
    .map((name) => name?.[0]?.toUpperCase())
    .join("");

  return (
    <Sheet>
      <Tooltip>
        <TooltipTrigger asChild>
          <SheetTrigger asChild>
            <Avatar>
              <AvatarImage src={user.imageUrl} />
              <AvatarFallback>{userInitials}</AvatarFallback>
            </Avatar>
          </SheetTrigger>
        </TooltipTrigger>
        <TooltipContent>Você</TooltipContent>
      </Tooltip>
      <SheetContent>
        <VisuallyHidden>
          <SheetHeader>
            <SheetTitle>Meu perfil</SheetTitle>
            <SheetDescription>
              Aqui você pode ver suas informações e editar seu perfil.
            </SheetDescription>
          </SheetHeader>
        </VisuallyHidden>

        <div className="flex flex-col lg:flex-row items-start gap-2 lg:gap-4">
          <div className="relative size-12 lg:size-24 rounded-full overflow-clip">
            <Image
              src={user.imageUrl}
              alt={user.fullName ?? user.id}
              className="bg-muted object-cover"
              fill
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <p>{user.username}</p>
            </div>

            <h1 className="text-2xl tracking-tight">{user.fullName}</h1>

            <p className="text-xs text-muted-foreground">
              {user.primaryEmailAddress?.emailAddress}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-2 mt-8">
          <SheetClose asChild>
            <Button variant="outline" asChild>
              <Link href="/">
                <HomeIcon />
                Página inicial
              </Link>
            </Button>
          </SheetClose>
          <SheetClose asChild>
            <Button variant="outline" asChild>
              <Link href={`/profile/${user.id}`}>
                <UserRoundIcon />
                Ver perfil
              </Link>
            </Button>
          </SheetClose>
          <SheetClose asChild>
            <Button variant="outline" asChild>
              <Link href="/settings">
                <BoltIcon />
                Configurações
              </Link>
            </Button>
          </SheetClose>
          <SheetClose asChild>
            <Button variant="outline" asChild>
              <Link href="/posts/create">
                <CirclePlusIcon />
                Adicionar um post
              </Link>
            </Button>
          </SheetClose>
        </div>

        <div className="flex flex-col gap-4 mt-auto">
          <SignOutButton>
            <SheetClose asChild>
              <Button>
                <LogOutIcon />
                Sair
              </Button>
            </SheetClose>
          </SignOutButton>
        </div>
      </SheetContent>
    </Sheet>
  );
}
