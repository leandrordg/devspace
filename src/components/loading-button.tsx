import { Button, buttonVariants } from "@/components/ui/button";
import { VariantProps } from "class-variance-authority";
import { Loader, LucideIcon } from "lucide-react";

export function LoadingButton({
  className,
  variant,
  size,
  text,
  loading,
  loadingText,
  icon: Icon,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
    icon?: LucideIcon;
    text: string;
    loading: boolean;
    loadingText: string;
  }) {
  return (
    <Button
      className={className}
      variant={variant}
      size={size}
      disabled={loading}
      asChild={asChild}
      {...props}
    >
      {loading ? (
        <>
          <Loader className="size-4 animate-spin" />
          {loadingText}
        </>
      ) : (
        <>
          {Icon && <Icon className="size-4" />}
          {text}
        </>
      )}
    </Button>
  );
}
