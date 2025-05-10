import { InfoIcon } from "lucide-react";

interface Props {
  text: string;
  description?: string;
}

export function InfoCard({ text, description }: Props) {
  return (
    <div className="bg-background border dark:bg-muted/30 p-4 rounded-xl flex items-center flex-wrap gap-4">
      <InfoIcon className="size-6 text-muted-foreground" />

      <div>
        <p className="text-sm">{text}</p>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </div>
    </div>
  );
}
