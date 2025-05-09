import { Feed } from "@/components/feed";
import { Button } from "@/components/ui/button";
import { BookPlusIcon } from "lucide-react";
import Link from "next/link";

export default function Homepage() {
  return (
    <main className="max-w-2xl mx-auto space-y-8 py-8">
      <div className="px-4 md:px-0">
        <Button variant="blue" className="w-full" asChild>
          <Link href="/posts/create">
            <BookPlusIcon />
            Adicionar uma publicação
          </Link>
        </Button>
      </div>

      <Feed />
    </main>
  );
}
