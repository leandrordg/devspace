import { UpdateUserForm } from "@/components/forms/update-user-form";
import { Button } from "@/components/ui/button";
import { getProfileById } from "@/hooks/profiles/get-profile-by-id";
import { auth } from "@clerk/nextjs/server";
import { ChevronLeftIcon } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function ProfileSettingsPage() {
  const { userId, redirectToSignIn } = await auth();

  if (!userId) return redirectToSignIn({ returnBackUrl: "/settings/profile" });

  const user = await getProfileById(userId);

  if (!user) notFound();

  return (
    <main className="max-w-2xl mx-auto space-y-8 py-8">
      <div className="px-4 md:px-0">
        <Button variant="outline" className="w-full" asChild>
          <Link href="/">
            <ChevronLeftIcon />
            Voltar ao início
          </Link>
        </Button>
      </div>

      <UpdateUserForm user={user} />
    </main>
  );
}
