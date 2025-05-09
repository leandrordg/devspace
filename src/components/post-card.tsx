import { PostCommentsSheet } from "@/components/sheets/post-comments-sheet";
import { PostLikesSheet } from "@/components/sheets/post-likes-sheet";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { formatDate } from "@/lib/utils";
import { auth } from "@clerk/nextjs/server";
import {
  GlobeIcon,
  GlobeLockIcon,
  HeartIcon,
  MessageCircleIcon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Comment, Like, Post, User } from "../../generated";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

interface Props {
  post: Post;
  author: User;
  comments: Comment[];
  likes: Like[];
}

export async function PostCard({ post, author, comments, likes }: Props) {
  const { userId } = await auth();

  const isOwner = userId === author.clerkId;

  return (
    <div
      key={post.id}
      className="space-y-4 bg-background dark:bg-muted/30 p-4 md:p-6 rounded-xl border"
    >
      <div className="flex items-center gap-2">
        <Link href={`/profile/${author.clerkId}`}>
          <Avatar className="size-8">
            <AvatarImage src={author.image} />
            <AvatarFallback>{author.name[0] + author.name[1]}</AvatarFallback>
          </Avatar>
        </Link>
        <div>
          <div className="flex items-center gap-2">
            <Link href={`/profile/${author.clerkId}`}>
              <p>{author.username}</p>
            </Link>
            {!isOwner ? (
              <p className="text-emerald-600">
                <button type="button">seguir</button>
              </p>
            ) : (
              <p className="text-muted-foreground">
                {post.published ? (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <GlobeIcon className="size-4" />
                    </TooltipTrigger>
                    <TooltipContent>Pública</TooltipContent>
                  </Tooltip>
                ) : (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <GlobeLockIcon className="size-4" />
                    </TooltipTrigger>
                    <TooltipContent>Somente você</TooltipContent>
                  </Tooltip>
                )}
              </p>
            )}
          </div>

          <p className="text-xs text-muted-foreground">
            {formatDate(post.createdAt)}
          </p>
        </div>
      </div>
      <div>
        <p>{post.content}</p>

        {post.image && (
          <div className="flex justify-center bg-muted/50 dark:bg-muted/30 rounded-xl overflow-clip mt-4 max-h-152">
            <Image
              src={post.image}
              alt="Imagem do post"
              width={500}
              height={500}
              className="aspect-auto object-contain"
            />
          </div>
        )}
      </div>
      <div className="flex items-center gap-2">
        <PostLikesSheet>
          <Button variant="outline">
            <HeartIcon /> {likes.length}
          </Button>
        </PostLikesSheet>

        <PostCommentsSheet>
          <Button variant="outline">
            <MessageCircleIcon /> {comments.length}
          </Button>
        </PostCommentsSheet>
      </div>
    </div>
  );
}
