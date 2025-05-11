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
  BellIcon,
  BookHeartIcon,
  BookPlusIcon,
  HomeIcon,
  LogInIcon,
  LogOutIcon,
  MenuIcon,
  UserRoundIcon,
} from "lucide-react";
import Link from "next/link";

export async function MobileMenu() {
  const user = await currentUser();

  const userInitials = [user?.firstName, user?.lastName]
    .filter(Boolean)
    .map((name) => name?.[0]?.toUpperCase())
    .join("");

  return (
    <Sheet>
      <Tooltip>
        <TooltipTrigger asChild>
          <SheetTrigger asChild>
            <Button size="icon" variant="ghost">
              {user ? (
                <Avatar>
                  <AvatarImage src={user.imageUrl} />
                  <AvatarFallback>{userInitials}</AvatarFallback>
                </Avatar>
              ) : (
                <MenuIcon />
              )}
            </Button>
          </SheetTrigger>
        </TooltipTrigger>
        <TooltipContent>{user ? "Você" : "Menu"}</TooltipContent>
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

        {user && (
          <div className="flex items-center gap-4">
            <Avatar className="size-14 md:size-24">
              <AvatarImage src={user.imageUrl} />
              <AvatarFallback>{userInitials}</AvatarFallback>
            </Avatar>

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
        )}

        <p className="text-sm font-medium uppercase">Navegação</p>

        <div className="flex flex-col gap-2">
          <SheetClose asChild>
            <Button variant="outline" className="justify-start" asChild>
              <Link href="/">
                <HomeIcon />
                Início
              </Link>
            </Button>
          </SheetClose>

          {user && (
            <SheetClose asChild>
              <Button variant="outline" className="justify-start" asChild>
                <Link href={`/profile/${user.id}`}>
                  <UserRoundIcon />
                  Meu perfil
                </Link>
              </Button>
            </SheetClose>
          )}

          {user && (
            <SheetClose asChild>
              <Button variant="outline" className="justify-start" asChild>
                <Link href={`/profile/${user.id}/settings`}>
                  <UserRoundIcon />
                  Configurações
                </Link>
              </Button>
            </SheetClose>
          )}

          <SheetClose asChild>
            <Button variant="outline" className="justify-start" asChild>
              <Link href="/notifications">
                <BellIcon />
                Notificações
              </Link>
            </Button>
          </SheetClose>

          <SheetClose asChild>
            <Button variant="outline" className="justify-start" asChild>
              <Link href="/posts/create">
                <BookPlusIcon />
                Adicionar publicação
              </Link>
            </Button>
          </SheetClose>

          <SheetClose asChild>
            <Button variant="outline" className="justify-start" asChild>
              <Link href="/posts/following">
                <BookHeartIcon />
                Ver publicações que sigo
              </Link>
            </Button>
          </SheetClose>
        </div>

        <div className="flex flex-col gap-4 mt-auto">
          {user ? (
            <SignOutButton>
              <SheetClose asChild>
                <Button>
                  <LogOutIcon />
                  Sair
                </Button>
              </SheetClose>
            </SignOutButton>
          ) : (
            <SheetClose asChild>
              <Button asChild>
                <Link href="/auth/sign-in">
                  <LogInIcon />
                  Entrar
                </Link>
              </Button>
            </SheetClose>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
