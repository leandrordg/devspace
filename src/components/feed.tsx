import { PostCard } from "@/components/post-card";
import { getAllPosts } from "@/hooks/posts/get-all-posts";
import { InfoIcon } from "lucide-react";

export async function Feed() {
  const posts = await getAllPosts();

  return (
    <section className="grid grid-cols-1 gap-4">
      {!posts.length && (
        <div className="bg-muted/50 p-4 rounded-xl flex items-center flex-wrap gap-2">
          <InfoIcon className="size-4 text-muted-foreground" />
          <p className="text-sm">Nenhuma publicação encontrada</p>
        </div>
      )}

      {posts.map((post) => (
        <PostCard
          key={post.id}
          post={post}
          author={post.author}
          comments={post.comments}
          likes={post.likes}
        />
      ))}
    </section>
  );
}
