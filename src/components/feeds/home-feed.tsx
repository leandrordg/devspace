import { InfoCard } from "@/components/info-card";
import { PostCard } from "@/components/post-card";
import { getAllPosts } from "@/hooks/posts/get-all-posts";

export async function HomeFeed() {
  const posts = await getAllPosts();

  return (
    <section className="grid grid-cols-1 gap-4">
      {!posts.length && <InfoCard text="Não há publicações disponíveis" />}

      {posts.map((post) => (
        <PostCard
          key={post.id}
          post={post}
          author={post.author}
          authorFollowers={post.author.followers}
          authorFollowsRequests={post.author.followRequestsReceived}
          comments={post.comments}
          likes={post.likes}
        />
      ))}
    </section>
  );
}
