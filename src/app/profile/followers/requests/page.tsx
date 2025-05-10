import { FollowRequestButtons } from "@/components/follow-request-buttons";
import { getAllFollowRequests } from "@/hooks/follow-requests/get-all-follow-requests";
import Image from "next/image";
import Link from "next/link";

export default async function FollowersRequests() {
  const requests = await getAllFollowRequests();

  return (
    <main className="max-w-2xl mx-auto space-y-4 py-4">
      <section className="bg-background dark:bg-muted/30 p-4 rounded-xl md:border">
        <h1 className="font-medium">Solicitações ({requests.length})</h1>
        <p className="text-sm text-muted-foreground">
          Você pode aceitar ou recusar solicitações de seguidores.
        </p>
      </section>

      <section className="space-y-4 bg-background dark:bg-muted/30 p-4 rounded-xl md:border">
        {requests.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Nenhuma solicitação no momento.
          </p>
        ) : (
          <ul className="divide-y">
            {requests.map((request) => (
              <li
                key={request.id}
                className="flex items-center justify-between py-3 gap-4"
              >
                <Link
                  href={`/profile/${request.requesterId}`}
                  className="flex items-center gap-3"
                >
                  <Image
                    src={request.requester.image}
                    alt={`Imagem de ${request.requester.name}`}
                    width={40}
                    height={40}
                    className="rounded-full object-cover"
                  />
                  <div>
                    <p className="text-sm font-medium break-all line-clamp-1">
                      {request.requester.name}
                    </p>

                    <p className="text-sm text-muted-foreground">
                      {request.requester.username}
                    </p>
                  </div>
                </Link>

                <div className="flex ml-auto items-center gap-2">
                  <FollowRequestButtons followRequest={request} />
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
