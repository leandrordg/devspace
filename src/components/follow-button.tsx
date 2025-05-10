"use client";

import { followUser } from "@/actions/follows/follow";
import { unfollowUser } from "@/actions/follows/unfollow";
import { LoadingButton } from "@/components/loading-button";
import { CheckIcon, ClockIcon, UserPlusIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { User } from "../../generated";

interface Props {
  user: User;
  isFollowing: boolean;
  isFollowingRequest: boolean;
}

export function FollowButton({ user, isFollowing, isFollowingRequest }: Props) {
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

  const getLoadingText = () => {
    if (isFollowing) return "Deixando de seguir...";
    if (isFollowingRequest) return "Cancelando solicitação...";
    return "Seguindo...";
  };

  const getIcons = () => {
    if (isFollowing) return CheckIcon;
    if (isFollowingRequest) return ClockIcon;
    return UserPlusIcon;
  };

  return (
    <LoadingButton
      className="flex-1"
      variant={isFollowing ? "outline" : "cyan"}
      loading={loading}
      disabled={loading}
      icon={getIcons()}
      text={getButtonText()}
      loadingText={getLoadingText()}
      onClick={handleClick}
    />
  );
}
