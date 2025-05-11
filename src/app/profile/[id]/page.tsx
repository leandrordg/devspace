import { CreatePostCard } from "@/components/create-post-card";
import { ProfileFeed } from "@/components/feeds/profile-feed";
import { FollowButton } from "@/components/follow-button";
import { InfoCard } from "@/components/info-card";
import { MessageButton } from "@/components/message-button";
import { FollowersSheet } from "@/components/sheets/followers-sheet";
import { FollowingSheet } from "@/components/sheets/following-sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { getProfileById } from "@/hooks/profiles/get-profile-by-id";
import { auth } from "@clerk/nextjs/server";
import { GlobeLockIcon, PencilIcon } from "lucide-react";
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

  const isFollowing = user.followers.some(
    (follower) =>
      follower.followerId === userId && follower.followingId === user.clerkId
  );

  const isFollowingRequest = user.followRequestsReceived.some(
    (request) => request.requesterId === userId
  );

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

            {user.bio && (
              <p className="hidden md:block text-sm text-muted-foreground">
                {user.bio}
              </p>
            )}

            <div className="hidden md:flex flex-wrap items-center gap-2 mt-2">
              <FollowersSheet
                user={user}
                isOwner={isOwner}
                followers={user.followers}
              >
                <p className="text-sm text-muted-foreground">
                  {user.followers.length} seguidores
                </p>
              </FollowersSheet>

              <FollowingSheet
                user={user}
                isOwner={isOwner}
                following={user.following}
              >
                <p className="text-sm text-muted-foreground">
                  {user.following.length} seguindo
                </p>
              </FollowingSheet>
            </div>
          </div>
        </div>

        {user.bio && (
          <p className="md:hidden text-sm text-muted-foreground">{user.bio}</p>
        )}

        <div className="md:hidden flex flex-wrap items-center gap-2">
          <FollowersSheet
            user={user}
            isOwner={isOwner}
            followers={user.followers}
          >
            <p className="text-sm text-muted-foreground">
              {user.followers.length} seguidores
            </p>
          </FollowersSheet>

          <FollowingSheet
            user={user}
            isOwner={isOwner}
            following={user.following}
          >
            <p className="text-sm text-muted-foreground">
              {user.following.length} seguindo
            </p>
          </FollowingSheet>
        </div>

        {!isOwner ? (
          <div className="flex items-center gap-2">
            <FollowButton
              user={user}
              isFollowing={isFollowing}
              isFollowingRequest={isFollowingRequest}
            />
            <MessageButton />
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Button className="flex-1" variant="cyan" asChild>
              <Link href={`/profile/${user.clerkId}/settings`}>
                <PencilIcon />
                Editar perfil
              </Link>
            </Button>
          </div>
        )}
      </section>

      {isOwner && (
        <CreatePostCard
          text="Adicionar uma publicação"
          description="Interaja com os seus seguidores"
        />
      )}

      {!user.private || isOwner || isFollowing ? (
        <ProfileFeed id={user.clerkId} />
      ) : (
        <InfoCard
          text="Perfil privado"
          description="Siga esse usuário para ver as publicações"
        />
      )}
    </main>
  );
}
