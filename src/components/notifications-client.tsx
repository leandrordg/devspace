"use client";

import { markAllNotificationsAsRead } from "@/actions/notifications/mark-all-notifications-as-read";
import { markNotificationAsRead } from "@/actions/notifications/mark-notification-as-read";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn, formatNotificationType } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { BellIcon } from "lucide-react";
import Link from "next/link";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Notification, User } from "../../generated";

interface NotificationsClientProps {
  notifications: (Notification & {
    recipient: User;
    sender: User;
  })[];
}

export function NotificationsClient({
  notifications,
}: NotificationsClientProps) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleMarkAllAsRead = () => {
    startTransition(async () => {
      const { success, error } = await markAllNotificationsAsRead();
      if (success) toast.success(success);
      if (error) toast.error(error);
    });
  };

  const handleMarkOneAsRead = (id: string) => {
    startTransition(async () => {
      await markNotificationAsRead(id);
    });
  };

  const notificationsNotRead = notifications.filter((n) => !n.read);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <Tooltip>
        <TooltipTrigger asChild>
          <PopoverTrigger asChild>
            <Button className="relative" variant="ghost" size="icon">
              <BellIcon className="size-4" />
              {notificationsNotRead.length > 0 && (
                <span className="absolute -top-1 -right-1 flex items-center justify-center size-4 p-1 text-xs font-medium text-white bg-blue-500 rounded-full">
                  {notificationsNotRead.length}
                </span>
              )}
            </Button>
          </PopoverTrigger>
        </TooltipTrigger>
        <TooltipContent>
          {notificationsNotRead.length > 0
            ? "Você tem novas notificações"
            : "Sem novas notificações"}
        </TooltipContent>
      </Tooltip>
      <PopoverContent
        align="center"
        className="flex flex-col gap-2 w-full sm:w-72 md:w-96"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-medium">
            Notificações ({notificationsNotRead.length}){" "}
          </h2>
          <Link
            href="/notifications"
            className="text-sm text-muted-foreground"
            onClick={() => setOpen(false)}
          >
            Ver todas
          </Link>
        </div>

        <ScrollArea>
          {notifications.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Sem notificações no momento.
            </p>
          ) : (
            <div className="flex flex-col gap-2">
              {notifications
                .slice(0, 6)
                .map(({ id, read, type, createdAt, sender }) => (
                  <div
                    key={id}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "py-2 flex flex-col gap-1",
                      read && "opacity-50"
                    )}
                  >
                    <p className="text-sm">
                      <Link href={`/profile/${sender.clerkId}`}>
                        <strong>{sender.username}</strong>
                      </Link>{" "}
                      {formatNotificationType(type)} <br />
                      <span className="text-xs">
                        {formatDistanceToNow(new Date(createdAt), {
                          addSuffix: true,
                          locale: ptBR,
                        })}
                      </span>
                    </p>
                  </div>
                ))}
            </div>
          )}
        </ScrollArea>

        {notificationsNotRead.length > 0 && (
          <button
            className="text-sm text-muted-foreground bg-muted py-1 rounded-md"
            onClick={handleMarkAllAsRead}
            disabled={isPending}
          >
            Marcar como lidas
          </button>
        )}
      </PopoverContent>
    </Popover>
  );
}
