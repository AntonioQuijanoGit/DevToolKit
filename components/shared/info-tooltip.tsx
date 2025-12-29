"use client";

import { Info, X } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface InfoTooltipProps {
  title: string;
  content: string | React.ReactNode;
  position?: "top" | "bottom" | "left" | "right";
  className?: string;
  variant?: "default" | "inline" | "banner";
  dismissible?: boolean;
}

export function InfoTooltip({
  title,
  content,
  position = "top",
  className,
  variant = "default",
  dismissible = false,
}: InfoTooltipProps) {
  const [open, setOpen] = useState(true);
  const [dismissed, setDismissed] = useState(false);

  if (dismissed && dismissible) return null;

  if (variant === "banner") {
    return (
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            className={cn("w-full", className)}
          >
            <Card className="p-4 bg-primary/5 border-primary/20">
              <div className="flex items-start gap-3">
                <Info className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <h4 className="font-semibold text-sm mb-1">{title}</h4>
                  <p className="text-sm text-muted-foreground">{content}</p>
                </div>
                {dismissible && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() => {
                      setOpen(false);
                      setTimeout(() => setDismissed(true), 200);
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    );
  }

  if (variant === "inline") {
    return (
      <div className={cn("inline-flex items-center gap-1.5", className)}>
        <Info className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm text-muted-foreground">{content}</span>
      </div>
    );
  }

  return (
    <div className={cn("relative inline-block", className)}>
      <Button
        variant="ghost"
        size="icon"
        className="h-5 w-5"
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
      >
        <Info className="h-4 w-4" />
      </Button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className={cn(
              "absolute z-50 w-64 p-3 bg-popover border border-border rounded-lg shadow-lg",
              position === "top" && "bottom-full mb-2",
              position === "bottom" && "top-full mt-2",
              position === "left" && "right-full mr-2",
              position === "right" && "left-full ml-2"
            )}
          >
            <h4 className="font-semibold text-sm mb-1">{title}</h4>
            <p className="text-xs text-muted-foreground">{content}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}




