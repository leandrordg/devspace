import { Button } from "@/components/ui/button";
import { SignInButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { LogInIcon } from "lucide-react";

export async function LoginCard() {
  const { userId } = await auth();

  if (userId) return null;

  return (
    <div className="bg-gradient-to-r from-blue-500 to-blue-700 p-4 rounded-xl flex items-center justify-between gap-2">
      <div>
        <h2 className="font-medium tracking-tighter">bem vindo ao devspace</h2>
        <p className="text-sm">
          Acesse a sua conta para ver as publicações de outros usuários e
          interagir com eles.
        </p>
      </div>
      <SignInButton mode="modal">
        <Button>
          <span className="hidden md:block">Acessar conta</span>
          <LogInIcon />
        </Button>
      </SignInButton>
    </div>
  );
}
