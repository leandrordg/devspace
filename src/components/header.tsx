import { Notifications } from "@/components/notifications";
import { MobileMenu } from "@/components/sheets/mobile-menu";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { BookPlusIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export function Header() {
  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-3xl border-b dark:border-transparent h-16">
      <div className="flex items-center h-full gap-4 justify-between max-w-7xl mx-auto p-4 md:px-6">
        <Link href="/">
          <Image
            src="/logo-dark.svg"
            alt="devspace"
            width={80}
            height={80}
            className="dark:invert"
          />
        </Link>

        <div className="flex items-center gap-4">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button size="icon" variant="ghost" asChild>
                <Link href="/posts/create">
                  <BookPlusIcon />
                </Link>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Adicionar uma publicação</TooltipContent>
          </Tooltip>

          <Notifications />
          <ThemeToggle />
          <MobileMenu />
        </div>
      </div>
    </header>
  );
}
