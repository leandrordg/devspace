import { ProfileFeed } from "@/components/profile-feed";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { getProfileById } from "@/hooks/profiles/get-profile-by-id";
import { auth } from "@clerk/nextjs/server";
import {
  GlobeLockIcon,
  PencilIcon,
  SendIcon,
  UserRoundPlusIcon,
} from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function ProfilePage({ params }: Props) {
  const { id } = await params;
  const { userId } = await auth();

  const user = await getProfileById(id);

  if (!user) notFound();

  const isOwner = userId === user.clerkId;

  const userInitials = user.name
    .split(" ")
    .filter(Boolean)
    .map((word) => word[0].toUpperCase())
    .join("");

  return (
    <main className="max-w-2xl mx-auto space-y-4 py-4">
      <section
        key={user.id}
        className="space-y-4 bg-background dark:bg-muted/30 p-4 md:p-6 rounded-xl md:border"
      >
        <div className="flex items-start gap-4">
          <Avatar className="size-14 md:size-24">
            <AvatarImage src={user.image} />
            <AvatarFallback>{userInitials}</AvatarFallback>
          </Avatar>

          <div>
            <p className="text-muted-foreground">{user.username}</p>

            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-2xl tracking-tight">{user.name}</h1>

              {user.private && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <GlobeLockIcon className="size-4 text-cyan-600" />
                  </TooltipTrigger>
                  <TooltipContent>Perfil privado</TooltipContent>
                </Tooltip>
              )}
            </div>

            <p className="hidden md:block text-sm text-muted-foreground">
              {user.bio ?? "Esse usuário não possui uma biografia."}
            </p>
          </div>
        </div>

        <p className="md:hidden text-sm text-muted-foreground">
          {user.bio ?? "Esse usuário não possui uma biografia."}
        </p>

        {!isOwner ? (
          <div className="flex items-center gap-2">
            <Button className="flex-1" variant="cyan">
              <UserRoundPlusIcon />
              <span className="hidden md:block">Seguir</span>
            </Button>
            <Button className="flex-1" variant="outline">
              <SendIcon /> <span className="hidden md:block">Mensagem</span>
            </Button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Button className="flex-1" variant="cyan" asChild>
              <Link href="/profile/settings">
                <PencilIcon />
                Editar perfil
              </Link>
            </Button>
          </div>
        )}
      </section>

      <ProfileFeed id={id} />
    </main>
  );
}
