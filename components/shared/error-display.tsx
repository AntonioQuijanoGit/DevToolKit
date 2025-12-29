"use client";

import { AlertCircle, X } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface ErrorDisplayProps {
  error: string | string[];
  title?: string;
  onDismiss?: () => void;
  variant?: "default" | "inline" | "minimal";
  className?: string;
}

export function ErrorDisplay({
  error,
  title = "Error",
  onDismiss,
  variant = "default",
  className,
}: ErrorDisplayProps) {
  const errors = Array.isArray(error) ? error : [error];

  if (variant === "minimal") {
    return (
      <div className={cn("text-destructive text-sm", className)}>
        {errors[0]}
      </div>
    );
  }

  if (variant === "inline") {
    return (
      <div className={cn("flex items-start gap-2 p-3 rounded-lg bg-destructive/10 border border-destructive/20", className)}>
        <AlertCircle className="h-4 w-4 text-destructive mt-0.5 flex-shrink-0" />
        <div className="flex-1">
          <p className="text-sm font-semibold text-destructive mb-1">{title}</p>
          <div className="space-y-1">
            {errors.map((err, i) => (
              <p key={i} className="text-xs text-destructive/90">
                {err}
              </p>
            ))}
          </div>
        </div>
        {onDismiss && (
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={onDismiss}
          >
            <X className="h-3 w-3" />
          </Button>
        )}
      </div>
    );
  }

  return (
    <Card className={cn("border-destructive/50", className)}>
      <CardContent className="pt-6">
        <div className="flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <p className="text-destructive font-semibold">{title}</p>
                {errors.length > 1 && (
                  <Badge variant="destructive" className="text-xs">
                    {errors.length}
                  </Badge>
                )}
              </div>
              {onDismiss && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={onDismiss}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
            <div className="space-y-1">
              {errors.map((err, i) => (
                <p key={i} className="text-sm text-muted-foreground">
                  {err}
                </p>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}




