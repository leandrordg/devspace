import { UserMenuSheet } from "@/components/sheets/user-menu-sheet";
import { ThemeToggle } from "@/components/theme-toggle";
import Image from "next/image";
import Link from "next/link";

export function Header() {
  return (
    <header>
      <div className="flex items-center gap-4 justify-between max-w-7xl mx-auto p-4 md:px-6">
        <h1 className="font-medium">
          <Link href="/">
            <Image
              src="/logo-dark.svg"
              alt="devspace"
              width={80}
              height={120}
              className="dark:invert"
            />
          </Link>
        </h1>

        <div className="flex items-center gap-4">
          <ThemeToggle />
          <UserMenuSheet />
        </div>
      </div>
    </header>
  );
}
