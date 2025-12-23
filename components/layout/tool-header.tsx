import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface ToolHeaderProps {
  title: string;
  description: string;
  icon: LucideIcon;
  className?: string;
}

export function ToolHeader({
  title,
  description,
  icon: Icon,
  className,
}: ToolHeaderProps) {
  return (
    <header
      className={cn(
        "border-b border-border bg-card px-6 py-4",
        className
      )}
    >
      <div className="flex items-center gap-4">
        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
          <Icon className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">{title}</h1>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </div>
    </header>
  );
}

