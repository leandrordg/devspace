"use client";

import { acceptFollow } from "@/actions/follows/accept-follow";
import { denyFollowRequest } from "@/actions/follows/deny-follow";
import { Button } from "@/components/ui/button";
import { CheckIcon, XIcon } from "lucide-react";
import { useTransition } from "react";
import { toast } from "sonner";
import { FollowRequest } from "../../generated";

interface Props {
  followRequest: FollowRequest;
}

export function FollowRequestButtons({ followRequest }: Props) {
  const [isPending, startTransition] = useTransition();

  const handleClick = (action: "accept" | "reject") => {
    startTransition(async () => {
      if (action === "accept") {
        const { success, error } = await acceptFollow(followRequest.id);
        if (success) toast.success(success);
        if (error) toast.error(error);
      } else {
        const { success, error } = await denyFollowRequest(followRequest.id);
        if (success) toast.success(success);
        if (error) toast.error(error);
      }
    });
  };

  return (
    <div className="flex gap-2">
      <Button
        size="icon"
        variant="outline"
        className="shrink-0"
        onClick={() => handleClick("reject")}
        disabled={isPending}
      >
        <XIcon className="size-4" />
        <span className="sr-only">Recusar</span>
      </Button>
      <Button
        size="icon"
        onClick={() => handleClick("accept")}
        disabled={isPending}
        className="shrink-0"
      >
        <CheckIcon className="size-4" />
        <span className="sr-only">Aceitar</span>
      </Button>
    </div>
  );
}
