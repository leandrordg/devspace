import { NotificationsClient } from "@/components/notifications-client";
import { getAllNotifications } from "@/hooks/notifications/get-all-notifications";

export async function Notifications() {
  const notifications = await getAllNotifications();

  return <NotificationsClient notifications={notifications} />;
}
