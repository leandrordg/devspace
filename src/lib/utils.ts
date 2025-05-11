import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { NotificationType } from "../../generated";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(
  date: Date | number,
  options?: Intl.DateTimeFormatOptions
) {
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "long",
    timeStyle: "short",
    ...options,
  }).format(new Date(date));
}

export function formatNotificationType(type: NotificationType) {
  switch (type) {
    case NotificationType.FOLLOW:
      return "começou a seguir você";
    case NotificationType.LIKE:
      return "curtiu seu comentário";
    case NotificationType.COMMENT:
      return "comentou em sua postagem";
    case NotificationType.FOLLOW_REQUEST:
      return "enviou uma solicitação para seguir você";
    case NotificationType.FOLLOW_REQUEST_ACCEPTED:
      return "aceitou sua solicitação";
    default:
      return "notificação desconhecida";
  }
}
