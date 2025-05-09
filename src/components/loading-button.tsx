import { Button, buttonVariants } from "@/components/ui/button";
import { VariantProps } from "class-variance-authority";
import { Loader } from "lucide-react";

export function LoadingButton({
  className,
  variant,
  size,
  text,
  loading,
  loadingText,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
    text: string;
    loading: boolean;
    loadingText: string;
  }) {
  return (
    <Button
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
        text
      )}
    </Button>
  );
}
