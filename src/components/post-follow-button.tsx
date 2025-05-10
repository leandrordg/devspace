"use client";

import { followUser } from "@/actions/follows/follow";
import { unfollowUser } from "@/actions/follows/unfollow";
import { cn } from "@/lib/utils";
import { EllipsisIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { User } from "../../generated";

interface Props {
  user: User;
  isFollowing: boolean;
  isFollowingRequest: boolean;
  className?: string;
}

export function PostFollowButton({
  user,
  isFollowing,
  isFollowingRequest,
  className,
}: Props) {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    setLoading(true);

    try {
      const action =
        isFollowing || isFollowingRequest ? unfollowUser : followUser;
      const { success, error } = await action(user.id);

      if (success) toast.success(success);
      if (error) toast.error(error);
    } finally {
      setLoading(false);
    }
  };

  const getButtonText = () => {
    if (isFollowing) return "Seguindo";
    if (isFollowingRequest) return "Solicitação enviada";
    return "Seguir";
  };

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className={cn(
        "flex items-center gap-2",
        className,
        loading && "animate-pulse"
      )}
    >
      <span>{getButtonText()}</span>
      {loading && <EllipsisIcon className="size-4" />}
    </button>
  );
}
