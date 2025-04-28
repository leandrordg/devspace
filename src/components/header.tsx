import { UserMenuSheet } from "@/components/sheets/user-menu-sheet";
import Link from "next/link";

export async function Header() {
  return (
    <header>
      <div className="flex items-center gap-4 justify-between max-w-7xl mx-auto p-4 md:px-6">
        <h1 className="font-medium">
          <Link href="/">devspace</Link>
        </h1>

        <UserMenuSheet />
      </div>
    </header>
  );
}
