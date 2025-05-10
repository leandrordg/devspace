import { CreatePostCard } from "@/components/create-post-card";
import { Feed } from "@/components/feed";
import { LoginCard } from "@/components/login-card";

export default function Homepage() {
  return (
    <main className="max-w-2xl mx-auto space-y-4 py-4">
      <CreatePostCard
        text="Adicione uma publicação"
        description="Interaja com os seus seguidores"
      />

      <LoginCard />

      <Feed />
    </main>
  );
}
