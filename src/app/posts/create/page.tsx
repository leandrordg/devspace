import { CreatePostForm } from "@/components/forms/create-post-form";
import { Button } from "@/components/ui/button";
import { ChevronLeftIcon } from "lucide-react";
import Link from "next/link";

export default function CreatePostPage() {
  return (
    <main className="max-w-2xl mx-auto space-y-8 py-8">
      <div className="px-4 md:px-0">
        <Button variant="outline" className="w-full" asChild>
          <Link href="/">
            <ChevronLeftIcon />
            Voltar ao início
          </Link>
        </Button>
      </div>

      <CreatePostForm />
    </main>
  );
}
