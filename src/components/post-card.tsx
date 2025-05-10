import { PostMenuOptions } from "@/components/post-menu-options";
import { PostCommentsButtonSheet } from "@/components/sheets/post-comments-button-sheet";
import { PostLikesButtonSheet } from "@/components/sheets/post-likes-button-sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { formatDate } from "@/lib/utils";
import { auth } from "@clerk/nextjs/server";
import { EllipsisIcon, GlobeLockIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import {
  Comment,
  Follow,
  FollowRequest,
  Like,
  Post,
  User,
} from "../../generated";
import { PostFollowButton } from "./post-follow-button";

interface Props {
  post: Post;
  author: User;
  authorFollowers: Follow[];
  authorFollowsRequests: FollowRequest[];
  comments: Comment[];
  likes: Like[];
}

export async function PostCard({
  post,
  author,
  authorFollowers,
  authorFollowsRequests,
  comments,
  likes,
}: Props) {
  const { userId } = await auth();

  const isOwner = userId === author.clerkId;

  const authorInitials = author.name
    .split(" ")
    .filter(Boolean)
    .map((word) => word[0].toUpperCase())
    .join("");

  const isFollowing = authorFollowers.some(
    (follower) =>
      follower.followerId === userId && follower.followingId === author.clerkId
  );

  const isFollowingRequest = authorFollowsRequests.some(
    (request) => request.requesterId === userId
  );

  return (
    <div
      key={post.id}
      className="rounded-xl bg-background dark:bg-muted/30 p-4 space-y-2 border"
    >
      <div className="flex items-center gap-3">
        <Button size="icon" variant="ghost" asChild>
          <Link href={`/profile/${author.clerkId}`}>
            <Avatar className="size-8">
              <AvatarImage src={author.image} />
              <AvatarFallback>{authorInitials}</AvatarFallback>
            </Avatar>
          </Link>
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <Link href={`/profile/${author.clerkId}`}>
              <p>{author.username}</p>
            </Link>

            {!isOwner && (
              <PostFollowButton
                user={author}
                isFollowing={isFollowing}
                isFollowingRequest={isFollowingRequest}
                className="text-sm text-muted-foreground"
              />
            )}

            {isOwner && post.private && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <GlobeLockIcon className="size-4 text-cyan-600" />
                </TooltipTrigger>
                <TooltipContent>Somente você</TooltipContent>
              </Tooltip>
            )}
          </div>

          <p className="text-xs text-muted-foreground line-clamp-1">
            {formatDate(post.createdAt)}
          </p>
        </div>

        <PostMenuOptions isOwner={isOwner} post={post} asChild>
          <Button size="icon" variant="ghost">
            <EllipsisIcon />
          </Button>
        </PostMenuOptions>
      </div>

      <p className="break-words">{post.content}</p>

      {post.image && (
        <div className="relative flex justify-center dark:bg-muted/30 rounded-xl overflow-clip max-h-152 min-h-[300px]">
          <Image
            src={post.image}
            alt={post.id}
            aria-hidden="true"
            className="blur-2xl"
            fill
          />

          <Image
            src={post.image}
            alt="Imagem do post"
            width={1920}
            height={1920}
            sizes="(max-width: 768px) 100vw, 700px"
            className="aspect-auto object-contain z-10"
            priority
          />
        </div>
      )}

      <div className="flex items-center gap-2">
        <PostLikesButtonSheet post={post} likes={likes} />
        <PostCommentsButtonSheet post={post} comments={comments} />
      </div>
    </div>
  );
}
