import { Button } from "@/components/ui/button";
import { getallPosts } from "@/hooks/posts/get-all-posts";
import { formatDate } from "@/lib/utils";
import { HeartIcon, MessageCircleIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default async function Homepage() {
  const posts = await getallPosts();

  return (
    <main className="max-w-2xl mx-auto space-y-8 py-8">
      <Button className="w-full" asChild>
        <Link href="/posts/create">Criar uma publicação</Link>
      </Button>

      <section className="grid grid-cols-1 gap-4 md:gap-6">
        {posts.map((post) => (
          <div
            key={post.id}
            className="space-y-4 bg-background p-4 md:p-6 rounded-xl border"
          >
            <div className="flex items-center gap-2">
              <Image
                src={post.author.image}
                alt={post.author.username}
                height={32}
                width={32}
                className="rounded-full"
              />
              <div>
                <div className="flex items-center gap-2">
                  <p>{post.author.username}</p>
                  <p className="text-emerald-600">
                    <Link href={`/profile/${post.authorId}`}>seguir</Link>
                  </p>
                </div>

                <p className="text-xs text-muted-foreground">
                  {formatDate(post.createdAt)}
                </p>
              </div>
            </div>
            <div>
              <p>{post.content}</p>

              {post.image && (
                <div className="flex justify-center bg-muted/30 rounded-xl overflow-clip mt-4 max-h-[512px]">
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
            <div className="flex items-center gap-2 ">
              <Button variant="outline">
                <HeartIcon /> {post.likes.length}
              </Button>
              <Button variant="outline">
                <MessageCircleIcon /> {post.comments.length}
              </Button>
            </div>
          </div>
        ))}
      </section>
    </main>
  );
}
