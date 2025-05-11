"use client";

import { followUser } from "@/actions/follows/follow";
import { unfollowUser } from "@/actions/follows/unfollow";
import { LoadingButton } from "@/components/loading-button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { SignInButton, useUser } from "@clerk/nextjs";
import { CheckIcon, ClockIcon, UserPlusIcon } from "lucide-react";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { User } from "../../generated";

interface Props {
  user: User;
  isFollowing: boolean;
  isFollowingRequest: boolean;
}

export function FollowButton({ user, isFollowing, isFollowingRequest }: Props) {
  const { user: currentUser } = useUser();
  const [isPending, startTransition] = useTransition();
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleFollow = () => {
    startTransition(async () => {
      const { success, error } = await followUser(user.id);
      if (success) toast.success(success);
      if (error) toast.error(error);
    });
  };

  const handleUnfollow = () => {
    startTransition(async () => {
      const { success, error } = await unfollowUser(user.id);
      if (success) toast.success(success);
      if (error) toast.error(error);
    });
  };

  const handleClick = () => {
    if (isPending) return;

    if ((isFollowing || isFollowingRequest) && user.private) {
      setDialogOpen(true);
    } else {
      if (isFollowing || isFollowingRequest) {
        handleUnfollow();
      } else {
        handleFollow();
      }
    }
  };

  const getButtonText = () => {
    if (isFollowing) return "Seguindo";
    if (isFollowingRequest) return "Solicitação enviada";
    return "Seguir";
  };

  const getIcons = () => {
    if (isFollowing) return CheckIcon;
    if (isFollowingRequest) return ClockIcon;
    return UserPlusIcon;
  };

  return (
    <>
      {!currentUser ? (
        <SignInButton
          mode="modal"
          fallbackRedirectUrl={`/profile/${user.clerkId}`}
        >
          <LoadingButton
            className="flex-1"
            variant="cyan"
            loading={isPending}
            disabled={isPending}
            icon={UserPlusIcon}
            text="Seguir"
            loadingText="Carregando..."
          />
        </SignInButton>
      ) : (
        <LoadingButton
          className="flex-1"
          variant={isFollowing ? "outline" : "cyan"}
          loading={isPending}
          disabled={isPending}
          icon={getIcons()}
          text={getButtonText()}
          loadingText="Carregando..."
          onClick={handleClick}
        />
      )}

      <AlertDialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Deixar de seguir {user.username}
            </AlertDialogTitle>
            <AlertDialogDescription>
              Este é um perfil privado. Se você deixar de seguir, precisará
              enviar uma nova solicitação para segui-lo novamente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                setDialogOpen(false);
                handleUnfollow();
              }}
            >
              Confirmar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
