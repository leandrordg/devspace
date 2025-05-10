import { Button } from "@/components/ui/button";
import { auth } from "@clerk/nextjs/server";
import { ChevronRightIcon } from "lucide-react";
import Link from "next/link";

interface Props {
  text: string;
  description?: string;
}

export async function CreatePostCard({ text, description }: Props) {
  const { userId } = await auth();

  if (!userId) return null;

  return (
    <div className="bg-background dark:bg-muted/30 p-4 rounded-xl border flex items-center justify-between gap-2">
      <div>
        <h2 className="tracking-tighter">{text}</h2>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      <Button size="sm" asChild>
        <Link href="/posts/create">
          <span className="hidden md:block">Adicionar</span>
          <ChevronRightIcon />
        </Link>
      </Button>
    </div>
  );
}
