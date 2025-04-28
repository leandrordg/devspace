import { Feed } from "@/components/feed";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function Homepage() {
  return (
    <main className="max-w-2xl mx-auto space-y-8 py-8">
      <div className="px-4 md:px-0">
        <Button className="w-full" asChild>
          <Link href="/posts/create">Criar uma publicação</Link>
        </Button>
      </div>

      <Feed />
    </main>
  );
}
