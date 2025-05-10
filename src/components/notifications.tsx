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
import { getNotifications } from "@/hooks/notifications/get-notifications";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { BellIcon } from "lucide-react";
import Link from "next/link";
import { useEffect, useState, useTransition } from "react";
import { Notification } from "../../generated";

export function Notifications() {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const data = await getNotifications();
        setNotifications(data);
      } catch (error) {
        console.error("Erro ao buscar notificações:", error);
      }
    };

    fetchNotifications();
  }, []);

  const handleMarkAllAsRead = () => {
    startTransition(async () => {
      await markAllNotificationsAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    });
  };

  const handleMarkOneAsRead = (id: string) => {
    startTransition(async () => {
      await markNotificationAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: true } : n))
      );
    });
  };

  const notificationsNotRead = notifications.filter(
    (notification) => !notification.read
  );

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
      <PopoverContent className="p-0 overflow-clip">
        <div className="flex items-center justify-between p-4">
          <h2 className="text-sm font-medium">
            Notificações ({notificationsNotRead.length})
          </h2>

          {notificationsNotRead.length > 0 && (
            <button
              className="text-xs text-muted-foreground hover:underline"
              onClick={handleMarkAllAsRead}
              disabled={isPending}
            >
              Marcar como lidas
            </button>
          )}
        </div>

        <ScrollArea>
          {notificationsNotRead.length === 0 ? (
            <div className="p-4 bg-muted">
              <p className="text-sm text-muted-foreground">
                Sem notificações no momento.
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {notificationsNotRead.map((notification) => {
                const base = (
                  <div className="px-4 py-2 hover:bg-muted/50">
                    <p className="text-sm">{notification.message}</p>
                    <span className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(notification.createdAt), {
                        addSuffix: true,
                        locale: ptBR,
                      })}
                    </span>
                  </div>
                );

                const onClick = () => {
                  handleMarkOneAsRead(notification.id);
                  setOpen(false);
                };

                let href = "/profile/notifications";
                if (notification.type === "FOLLOW_REQUEST") {
                  href = "/profile/followers/requests";
                }

                return (
                  <Link href={href} key={notification.id} onClick={onClick}>
                    {base}
                  </Link>
                );
              })}
            </div>
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}
