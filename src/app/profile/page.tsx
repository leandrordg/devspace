import { CreatePostCard } from "@/components/create-post-card";
import { ProfileFeed } from "@/components/feeds/profile-feed";
import { FollowersSheet } from "@/components/sheets/followers-sheet";
import { FollowingSheet } from "@/components/sheets/following-sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { getMyProfile } from "@/hooks/profiles/get-my-profile";
import { GlobeLockIcon, PencilIcon } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function MyProfilePage() {
  const user = await getMyProfile();

  if (!user) notFound();

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

          <div className="space-y-1">
            <p className="text-muted-foreground">{user.username}</p>

            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl md:text-2xl tracking-tight">
                {user.name}
              </h1>

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

            <div className="hidden md:flex flex-wrap items-center gap-2 mt-2">
              <FollowersSheet user={user} followers={user.followers}>
                <p className="text-sm text-muted-foreground">
                  {user.followers.length} seguidores
                </p>
              </FollowersSheet>

              <FollowingSheet user={user} following={user.following}>
                <p className="text-sm text-muted-foreground">
                  {user.following.length} seguindo
                </p>
              </FollowingSheet>
            </div>
          </div>
        </div>

        <p className="md:hidden text-sm text-muted-foreground">
          {user.bio ?? "Esse usuário não possui uma biografia."}
        </p>

        <div className="md:hidden flex flex-wrap items-center gap-2">
          <FollowersSheet user={user} followers={user.followers}>
            <p className="text-sm text-muted-foreground">
              {user.followers.length} seguidores
            </p>
          </FollowersSheet>

          <FollowingSheet user={user} following={user.following}>
            <p className="text-sm text-muted-foreground">
              {user.following.length} seguindo
            </p>
          </FollowingSheet>
        </div>

        <Button className="w-full" variant="cyan" asChild>
          <Link href="/profile/settings">
            <PencilIcon />
            Editar perfil
          </Link>
        </Button>
      </section>

      <CreatePostCard
        text="Adicionar uma publicação"
        description="Interaja com os seus seguidores"
      />

      <ProfileFeed id={user.clerkId} />
    </main>
  );
}
