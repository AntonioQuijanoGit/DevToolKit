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
        "border-b border-border bg-card px-4 sm:px-6 py-3 sm:py-4 md:pl-6",
        // Add left padding on mobile to avoid hamburger menu overlap
        "pl-12 md:pl-6",
        className
      )}
    >
      <div className="flex items-center gap-3 sm:gap-4">
        <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
          <Icon className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
        </div>
        <div className="min-w-0 flex-1">
          <h1 className="text-xl sm:text-2xl font-bold truncate">{title}</h1>
          <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2">{description}</p>
        </div>
      </div>
    </header>
  );
}

