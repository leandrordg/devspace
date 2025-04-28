import { PostCard } from "@/components/post-card";
import { getAllPosts } from "@/hooks/posts/get-all-posts";

export async function Feed() {
  const posts = await getAllPosts();

  return (
    <section className="grid grid-cols-1 gap-4 md:gap-6">
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
