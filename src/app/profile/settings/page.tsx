import { UpdateUserForm } from "@/components/forms/update-user-form";
import { getProfileById } from "@/hooks/profiles/get-profile-by-id";
import { auth } from "@clerk/nextjs/server";
import { notFound } from "next/navigation";

export default async function ProfileSettingsPage() {
  const { userId, redirectToSignIn } = await auth();

  if (!userId) return redirectToSignIn({ returnBackUrl: "/profile/settings" });

  const user = await getProfileById(userId);

  if (!user) notFound();

  return (
    <main className="max-w-2xl mx-auto space-y-4 py-4">
      <UpdateUserForm user={user} />
    </main>
  );
}
