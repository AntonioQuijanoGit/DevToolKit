import { Info, AlertCircle, CheckCircle2, Lightbulb } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface InstructionCardProps {
  type?: "info" | "warning" | "success" | "tip";
  title?: string;
  children: React.ReactNode;
  className?: string;
}

const typeConfig = {
  info: {
    icon: Info,
    bgColor: "bg-blue-50 dark:bg-blue-950/20",
    borderColor: "border-blue-200 dark:border-blue-800",
    iconColor: "text-blue-600 dark:text-blue-400",
    textColor: "text-blue-900 dark:text-blue-100",
    textMuted: "text-blue-800 dark:text-blue-200",
  },
  warning: {
    icon: AlertCircle,
    bgColor: "bg-yellow-50 dark:bg-yellow-950/20",
    borderColor: "border-yellow-200 dark:border-yellow-800",
    iconColor: "text-yellow-600 dark:text-yellow-400",
    textColor: "text-yellow-900 dark:text-yellow-100",
    textMuted: "text-yellow-800 dark:text-yellow-200",
  },
  success: {
    icon: CheckCircle2,
    bgColor: "bg-green-50 dark:bg-green-950/20",
    borderColor: "border-green-200 dark:border-green-800",
    iconColor: "text-green-600 dark:text-green-400",
    textColor: "text-green-900 dark:text-green-100",
    textMuted: "text-green-800 dark:text-green-200",
  },
  tip: {
    icon: Lightbulb,
    bgColor: "bg-purple-50 dark:bg-purple-950/20",
    borderColor: "border-purple-200 dark:border-purple-800",
    iconColor: "text-purple-600 dark:text-purple-400",
    textColor: "text-purple-900 dark:text-purple-100",
    textMuted: "text-purple-800 dark:text-purple-200",
  },
};

export function InstructionCard({
  type = "info",
  title,
  children,
  className,
}: InstructionCardProps) {
  const config = typeConfig[type];
  const Icon = config.icon;

  return (
    <Card className={cn("border", config.bgColor, config.borderColor, className)}>
      <CardContent className="p-4 sm:p-6">
        <div className="flex items-start gap-3">
          <Icon className={cn("h-5 w-5 flex-shrink-0 mt-0.5", config.iconColor)} />
          <div className="flex-1 space-y-2">
            {title && (
              <h3 className={cn("font-semibold text-sm sm:text-base", config.textColor)}>
                {title}
              </h3>
            )}
            <div className={cn("text-xs sm:text-sm", config.textMuted)}>
              {children}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

