import { PostCard } from "@/components/post-card";
import { getAllPostsByProfile } from "@/hooks/posts/get-profile-posts";

interface Props {
  id: string;
}

export async function ProfileFeed({ id }: Props) {
  const posts = await getAllPostsByProfile(id);

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
