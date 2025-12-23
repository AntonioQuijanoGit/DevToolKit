import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  icon?: LucideIcon;
  title?: string;
  description?: string;
  className?: string;
  action?: {
    label: string;
    onClick: () => void;
    variant?: "default" | "outline" | "ghost";
  };
  secondaryAction?: {
    label: string;
    onClick: () => void;
  };
  tips?: string[];
}

export function EmptyState({
  icon: Icon,
  title = "No data",
  description = "Enter some data to get started",
  className,
  action,
  secondaryAction,
  tips,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center h-full text-center p-8 text-muted-foreground",
        className
      )}
    >
      {Icon && <Icon className="h-12 w-12 mb-4 opacity-50" />}
      <h3 className="text-lg font-semibold mb-2 text-foreground">{title}</h3>
      <p className="text-sm max-w-sm mb-6">{description}</p>
      
      {(action || secondaryAction) && (
        <div className="flex gap-2 flex-wrap justify-center">
          {action && (
            <Button
              onClick={action.onClick}
              variant={action.variant || "default"}
            >
              {action.label}
            </Button>
          )}
          {secondaryAction && (
            <Button
              onClick={secondaryAction.onClick}
              variant="outline"
            >
              {secondaryAction.label}
            </Button>
          )}
        </div>
      )}

      {tips && tips.length > 0 && (
        <div className="mt-8 pt-6 border-t border-border w-full max-w-md">
          <p className="text-xs font-semibold text-foreground mb-3">💡 Tips:</p>
          <ul className="text-xs space-y-1.5 text-left">
            {tips.map((tip, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="text-primary mt-0.5">•</span>
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

