import { CreatePostCard } from "@/components/create-post-card";
import { HomeFeed } from "@/components/feeds/home-feed";
import { LoginCard } from "@/components/login-card";

export default function Homepage() {
  return (
    <main className="max-w-2xl mx-auto space-y-4 py-4">
      <CreatePostCard
        text="Adicione uma publicação"
        description="Interaja com os seus seguidores"
      />

      <LoginCard />

      <HomeFeed />
    </main>
  );
}
