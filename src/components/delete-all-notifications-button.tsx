"use client";

import { deleteAllNotifications } from "@/actions/notifications/delete-all-notifications";
import { LoadingButton } from "@/components/loading-button";
import { Button } from "@/components/ui/button";
import { useTransition } from "react";
import { toast } from "sonner";

export function DeleteAllNotificationsButton(
  props: React.ComponentPropsWithoutRef<typeof Button>
) {
  const [isPending, startTransition] = useTransition();

  const handleDeleteAll = () => {
    startTransition(async () => {
      const { success, error } = await deleteAllNotifications();
      if (success) toast.success(success);
      if (error) toast.error(error);
    });
  };

  return (
    <LoadingButton
      size="sm"
      onClick={handleDeleteAll}
      disabled={isPending}
      loading={isPending}
      text="Apagar notificações"
      loadingText="Apagando..."
      {...props}
    />
  );
}
