import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

interface Props {
  children: React.ReactNode;
}

export function PostLikesSheet({ children }: Props) {
  return (
    <Sheet>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Visualizando curtidas do post</SheetTitle>
          <SheetDescription>
            Você pode somente visualizar as curtidas do post.
          </SheetDescription>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
}
