import { FollowingFeed } from "@/components/feeds/following-feed";
import { LoginCard } from "@/components/login-card";

export default function FollowingPostsPage() {
  return (
    <main className="max-w-2xl mx-auto space-y-4 py-4">
      <LoginCard />

      <FollowingFeed />
    </main>
  );
}
