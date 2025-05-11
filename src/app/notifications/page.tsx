import { DeleteAllNotificationsButton } from "@/components/delete-all-notifications-button";
import { FollowRequestButtons } from "@/components/follow-request-buttons";
import { InfoCard } from "@/components/info-card";
import { getAllFollowRequests } from "@/hooks/follow-requests/get-all-follow-requests";
import { getAllNotifications } from "@/hooks/notifications/get-all-notifications";
import { cn, formatNotificationType } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import Image from "next/image";
import Link from "next/link";

export default async function NotificationsPage() {
  const notifications = await getAllNotifications();
  const followRequests = await getAllFollowRequests();

  return (
    <main className="max-w-2xl mx-auto space-y-4 py-4">
      <InfoCard
        text="Notificações"
        description="Aqui você pode ver todas as suas notificações."
      />

      <section className="space-y-4 bg-background dark:bg-muted/30 p-4 rounded-xl border">
        <h1 className="font-medium">
          Solicitações para seguir ({followRequests.length})
        </h1>

        {followRequests.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Nenhuma solicitação no momento.
          </p>
        ) : (
          <ul className="divide-y">
            {followRequests.map((request) => (
              <li
                key={request.id}
                className="flex items-center justify-between py-2 gap-4"
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

      <section className="space-y-4 bg-background dark:bg-muted/30 p-4 rounded-xl border">
        <div className="flex items-center justify-between">
          <h1 className="font-medium">
            Todas as notificações ({notifications.length})
          </h1>

          {notifications.length > 0 && (
            <DeleteAllNotificationsButton variant="outline" size="sm" />
          )}
        </div>

        {notifications.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Nenhuma notificação no momento.
          </p>
        ) : (
          <div className="flex flex-col gap-1">
            {notifications.map(({ id, read, createdAt, type, sender }) => (
              <div
                key={id}
                className={cn(
                  "px-4 py-2 flex flex-col gap-1 rounded-xl bg-muted/50 transition-all",
                  read && "opacity-50"
                )}
              >
                <p className="text-sm">
                  <strong>{sender.username}</strong>{" "}
                  {formatNotificationType(type)}
                </p>

                <span className="text-xs text-muted-foreground">
                  {formatDistanceToNow(new Date(createdAt), {
                    addSuffix: true,
                    locale: ptBR,
                  })}
                </span>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
