import { Header } from "@/components/header";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "devspace",
  description: "Interaja com os seus amigos nesse espaço dev!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <TooltipProvider>
        <html lang="pt-BR">
          <body className={`${inter.className} antialiased min-h-dvh`}>
            <Header />
            {children}
          </body>
        </html>
      </TooltipProvider>
    </ClerkProvider>
  );
}
