"use client";

import { useState, useEffect } from "react";
import { X, Sparkles, ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

const WELCOME_BANNER_KEY = "devtoolkit-welcome-dismissed";

interface WelcomeBannerProps {
  onDismiss?: () => void;
  className?: string;
}

export function WelcomeBanner({ onDismiss, className }: WelcomeBannerProps) {
  const [dismissed, setDismissed] = useState(true);

  useEffect(() => {
    const wasDismissed = localStorage.getItem(WELCOME_BANNER_KEY);
    setDismissed(wasDismissed === "true");
  }, []);

  const handleDismiss = () => {
    localStorage.setItem(WELCOME_BANNER_KEY, "true");
    setDismissed(true);
    onDismiss?.();
  };

  if (dismissed) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className={cn("mb-4 sm:mb-6", className)}
      >
        <Card className="p-4 sm:p-6 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border-primary/20">
          <div className="flex items-start gap-3 sm:gap-4">
            <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
              <Sparkles className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-base sm:text-lg font-semibold mb-1 sm:mb-2">
                Welcome to DevToolkit! 🎉
              </h3>
              <p className="text-sm sm:text-base text-muted-foreground mb-3 sm:mb-4 leading-relaxed">
                Get started quickly: Press <kbd className="px-2 py-1 bg-background border border-border rounded text-xs font-mono">Cmd/Ctrl + K</kbd> to search tools, or explore our{" "}
                <strong className="text-foreground">41+ developer tools</strong> below.
              </p>
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                <Button
                  size="sm"
                  variant="default"
                  className="text-xs sm:text-sm"
                    onClick={() => {
                    // Trigger command palette with keyboard event
                    const event = new KeyboardEvent('keydown', {
                      key: 'k',
                      ctrlKey: navigator.platform.includes('Mac') ? false : true,
                      metaKey: navigator.platform.includes('Mac') ? true : false,
                    });
                    window.dispatchEvent(event);
                  }}
                >
                  Try Command Palette
                  <ArrowRight className="ml-2 h-3 w-3 sm:h-4 sm:w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="text-xs sm:text-sm"
                  onClick={handleDismiss}
                >
                  Got it, thanks!
                </Button>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 sm:h-9 sm:w-9 flex-shrink-0"
              onClick={handleDismiss}
              aria-label="Dismiss welcome banner"
            >
              <X className="h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
          </div>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
}

