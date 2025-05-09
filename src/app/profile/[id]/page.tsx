import { ProfileFeed } from "@/components/profile-feed";
import { Button } from "@/components/ui/button";
import { getProfileById } from "@/hooks/profiles/get-profile-by-id";
import { formatDate } from "@/lib/utils";
import { auth } from "@clerk/nextjs/server";
import { ChevronLeftIcon, SendIcon, UserRoundPlusIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function ProfilePage({ params }: Props) {
  const { id } = await params;
  const { userId } = await auth();

  const user = await getProfileById(id);

  if (!user) notFound();

  const isOwner = userId === user.clerkId;

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

      <section
        key={user.id}
        className="space-y-4 bg-background dark:bg-muted/30 p-4 md:p-6 rounded-xl border"
      >
        <div className="flex flex-col md:flex-row items-start gap-2 md:gap-4">
          <div className="relative size-12 md:size-24 rounded-full overflow-clip">
            <Image
              src={user.image}
              alt={user.username}
              className="bg-muted object-cover"
              fill
            />
          </div>
          <div>
            <p className="text-muted-foreground">{user.username}</p>

            <h1 className="text-2xl tracking-tight">{user.name}</h1>

            <p className="text-xs text-muted-foreground">
              Entrou em: {formatDate(user.createdAt)}
            </p>

            <p className="mt-4 text-sm text-muted-foreground">
              {user.bio ?? "Esse usuário não possui uma biografia."}
            </p>
          </div>
        </div>

        {!isOwner ? (
          <div className="flex items-center gap-2">
            <Button className="flex-1" variant="blue">
              <UserRoundPlusIcon />
              <span className="hidden md:block">Seguir</span>
            </Button>
            <Button className="flex-1" variant="outline">
              <SendIcon /> <span className="hidden md:block">Mensagem</span>
            </Button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Button className="flex-1" variant="blue" asChild>
              <Link href="/settings/profile">
                <UserRoundPlusIcon />
                <span className="hidden md:block">Editar perfil</span>
              </Link>
            </Button>
          </div>
        )}
      </section>

      <ProfileFeed id={id} />
    </main>
  );
}
