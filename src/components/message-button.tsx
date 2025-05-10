import { Button } from "@/components/ui/button";
import { SendIcon } from "lucide-react";

export function MessageButton() {
  return (
    <Button className="flex-1" variant="outline">
      <SendIcon /> <span className="hidden md:block">Mensagem</span>
    </Button>
  );
}
