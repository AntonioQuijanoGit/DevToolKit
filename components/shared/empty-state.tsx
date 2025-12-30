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
        "flex flex-col items-center justify-center h-full min-h-[200px] text-center p-6 sm:p-8 text-muted-foreground",
        className
      )}
      role="status"
      aria-live="polite"
    >
      {Icon && (
        <Icon 
          className="h-12 w-12 sm:h-16 sm:w-16 mb-4 opacity-50 text-muted-foreground" 
          aria-hidden="true"
        />
      )}
      <h3 className="text-base sm:text-lg font-semibold mb-2 text-foreground">{title}</h3>
      <p className="text-sm sm:text-base max-w-sm mb-6 leading-relaxed">{description}</p>
      
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

