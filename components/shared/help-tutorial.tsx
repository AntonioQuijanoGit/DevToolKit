"use client";

import { useState, useEffect } from "react";
import { HelpCircle, X, Command, Search, Moon, Sun, History, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export function HelpTutorial() {
  const [open, setOpen] = useState(false);

  // Keyboard shortcuts: ESC to close, ? to open
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Open help with ? key (when not typing in input/textarea)
      if (e.key === "?" && !open && !(e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement)) {
        e.preventDefault();
        setOpen(true);
      }
      // Close with ESC
      if (e.key === "Escape" && open) {
        setOpen(false);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open]);

  return (
    <>
      {/* Help Button - Responsive positioning */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 200, damping: 20 }}
        className={cn(
          // Desktop: Fixed bottom-right with safe spacing
          "fixed z-50",
          "bottom-4 right-4 sm:bottom-6 sm:right-6",
          // Mobile: Adjust for smaller screens
          "md:bottom-6 md:right-6"
        )}
      >
        <Button
          size="icon"
          className={cn(
            // Responsive sizing
            "h-11 w-11 sm:h-12 sm:w-12 md:h-14 md:w-14",
            "rounded-full shadow-lg",
            "bg-primary hover:bg-primary/90",
            "text-primary-foreground",
            "transition-all duration-200",
            "hover:scale-110 active:scale-95",
            // Focus states for accessibility
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background",
            // Subtle pulse animation to draw attention
            "animate-pulse hover:animate-none"
          )}
          onClick={() => setOpen(true)}
          aria-label="Open help and tutorial"
          title="Help & Tutorial (Press ? for help)"
        >
          <HelpCircle className="h-5 w-5 sm:h-6 sm:w-6 md:h-7 md:w-7" />
        </Button>
      </motion.div>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
              onClick={() => setOpen(false)}
              aria-hidden="true"
            />
            <motion.div
              initial={{ x: "100%", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "100%", opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className={cn(
                "fixed right-0 top-0 h-full z-50 overflow-y-auto",
                // Responsive width: full on mobile, max-w on desktop
                "w-full sm:w-[90%] md:w-[85%] lg:w-[75%] xl:max-w-2xl",
                "bg-card border-l border-border",
                "shadow-2xl",
                // Focus trap for accessibility
                "focus:outline-none"
              )}
              role="dialog"
              aria-modal="true"
              aria-labelledby="help-title"
            >
              <Card className="border-0 rounded-none h-full flex flex-col">
                <CardHeader className={cn(
                  "flex flex-row items-center justify-between",
                  "border-b border-border",
                  "p-4 sm:p-6",
                  "sticky top-0 bg-card z-10"
                )}>
                  <CardTitle id="help-title" className="text-xl sm:text-2xl font-semibold">
                    Help & Tutorial
                  </CardTitle>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setOpen(false)}
                    className="h-9 w-9 sm:h-10 sm:w-10"
                    aria-label="Close help"
                  >
                    <X className="h-4 w-4 sm:h-5 sm:w-5" />
                  </Button>
                </CardHeader>
                <CardContent className={cn(
                  "flex-1 overflow-y-auto",
                  "p-4 sm:p-6",
                  "space-y-4 sm:space-y-6"
                )}>
                  <div className="space-y-4 sm:space-y-6">
                    {/* Quick Start */}
                    <section>
                      <h3 className="text-base sm:text-lg font-semibold mb-2 sm:mb-3">Quick Start</h3>
                      <p className="text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4 leading-relaxed">
                        DevToolkit is a comprehensive platform of developer tools.
                        All tools work client-side, no internet connection required.
                      </p>
                    </section>

                    {/* Navigation */}
                    <section>
                      <h3 className="text-base sm:text-lg font-semibold mb-2 sm:mb-3 flex items-center gap-2">
                        <Search className="h-4 w-4 sm:h-5 sm:w-5" />
                        Navigation
                      </h3>
                      <div className="space-y-2 sm:space-y-3">
                        <div className="p-3 sm:p-4 rounded-lg bg-accent border border-border">
                          <div className="flex flex-wrap items-center gap-2 mb-2">
                            <Badge variant="secondary" className="text-[10px] sm:text-xs">Shortcut</Badge>
                            <code className="text-[10px] sm:text-xs font-mono bg-background px-2 py-1 rounded">
                              Cmd/Ctrl + K
                            </code>
                          </div>
                          <p className="text-xs sm:text-sm leading-relaxed">
                            Press <kbd className="px-1.5 py-0.5 bg-background rounded text-[10px] sm:text-xs font-mono">Cmd+K</kbd> or <kbd className="px-1.5 py-0.5 bg-background rounded text-[10px] sm:text-xs font-mono">Ctrl+K</kbd> to open the Command Palette and quickly search for tools.
                          </p>
                        </div>
                        <div className="p-3 sm:p-4 rounded-lg bg-accent border border-border">
                          <p className="text-xs sm:text-sm leading-relaxed">
                            Use the <strong>left sidebar</strong> to navigate between different tool categories.
                          </p>
                        </div>
                        <div className="p-3 sm:p-4 rounded-lg bg-accent border border-border">
                          <p className="text-xs sm:text-sm leading-relaxed">
                            On <strong>mobile</strong>, the sidebar becomes a drawer that you can open with the menu button.
                          </p>
                        </div>
                      </div>
                    </section>

                    {/* Features */}
                    <section>
                      <h3 className="text-base sm:text-lg font-semibold mb-2 sm:mb-3">Key Features</h3>
                      <div className="space-y-2 sm:space-y-3">
                        <div className="p-3 sm:p-4 rounded-lg bg-accent border border-border">
                          <div className="flex items-center gap-2 mb-2">
                            <Copy className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                            <strong className="text-xs sm:text-sm">Copy Buttons</strong>
                          </div>
                          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                            Each tool has copy buttons on results. Click to copy to clipboard.
                          </p>
                        </div>
                        <div className="p-3 sm:p-4 rounded-lg bg-accent border border-border">
                          <div className="flex items-center gap-2 mb-2">
                            <History className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                            <strong className="text-xs sm:text-sm">History</strong>
                          </div>
                          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                            Some tools save your history. Look for the history icon to see your recent actions.
                          </p>
                        </div>
                        <div className="p-3 sm:p-4 rounded-lg bg-accent border border-border">
                          <div className="flex items-center gap-2 mb-2">
                            <Moon className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                            <strong className="text-xs sm:text-sm">Light/Dark Mode</strong>
                          </div>
                          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                            Switch between light and dark mode using the button in the sidebar. Your preference is saved automatically.
                          </p>
                        </div>
                      </div>
                    </section>

                    {/* Tool Categories */}
                    <section>
                      <h3 className="text-base sm:text-lg font-semibold mb-2 sm:mb-3">Tool Categories</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                        <div className="p-3 sm:p-4 rounded-lg bg-accent border border-border">
                          <strong className="text-xs sm:text-sm block mb-1">Formatters</strong>
                          <p className="text-[10px] sm:text-xs text-muted-foreground">
                            JSON, SQL, YAML, XML
                          </p>
                        </div>
                        <div className="p-3 sm:p-4 rounded-lg bg-accent border border-border">
                          <strong className="text-xs sm:text-sm block mb-1">Encoders</strong>
                          <p className="text-[10px] sm:text-xs text-muted-foreground">
                            Base64, URL, HTML
                          </p>
                        </div>
                        <div className="p-3 sm:p-4 rounded-lg bg-accent border border-border">
                          <strong className="text-xs sm:text-sm block mb-1">Security</strong>
                          <p className="text-[10px] sm:text-xs text-muted-foreground">
                            Hash, Password, JWT
                          </p>
                        </div>
                        <div className="p-3 sm:p-4 rounded-lg bg-accent border border-border">
                          <strong className="text-xs sm:text-sm block mb-1">Generators</strong>
                          <p className="text-[10px] sm:text-xs text-muted-foreground">
                            UUID, QR, Color, Lorem
                          </p>
                        </div>
                        <div className="p-3 sm:p-4 rounded-lg bg-accent border border-border">
                          <strong className="text-xs sm:text-sm block mb-1">Shell Tools</strong>
                          <p className="text-[10px] sm:text-xs text-muted-foreground">
                            Command Builder, Cheatsheet, Cron
                          </p>
                        </div>
                        <div className="p-3 sm:p-4 rounded-lg bg-accent border border-border">
                          <strong className="text-xs sm:text-sm block mb-1">Converters</strong>
                          <p className="text-[10px] sm:text-xs text-muted-foreground">
                            CSV, Timestamp, Image
                          </p>
                        </div>
                      </div>
                    </section>

                    {/* Tips */}
                    <section>
                      <h3 className="text-base sm:text-lg font-semibold mb-2 sm:mb-3">Useful Tips</h3>
                      <ul className="space-y-2 text-xs sm:text-sm text-muted-foreground">
                        <li className="flex items-start gap-2">
                          <span className="text-primary mt-1 flex-shrink-0">•</span>
                          <span className="leading-relaxed">Use the "Example" buttons to see usage examples</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-primary mt-1 flex-shrink-0">•</span>
                          <span className="leading-relaxed">All tools work offline</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-primary mt-1 flex-shrink-0">•</span>
                          <span className="leading-relaxed">Results can be copied with a single click</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-primary mt-1 flex-shrink-0">•</span>
                          <span className="leading-relaxed">History is saved locally in your browser</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-primary mt-1 flex-shrink-0">•</span>
                          <span className="leading-relaxed">Press ESC to close modals and dropdowns</span>
                        </li>
                      </ul>
                    </section>

                    {/* Keyboard Shortcuts */}
                    <section>
                      <h3 className="text-base sm:text-lg font-semibold mb-2 sm:mb-3 flex items-center gap-2">
                        <Command className="h-4 w-4 sm:h-5 sm:w-5" />
                        Keyboard Shortcuts
                      </h3>
                      <div className="space-y-2">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 p-2 sm:p-3 rounded bg-accent">
                          <span className="text-xs sm:text-sm">Open Command Palette</span>
                          <kbd className="px-2 py-1 bg-background rounded text-[10px] sm:text-xs font-mono">
                            Cmd/Ctrl + K
                          </kbd>
                        </div>
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 p-2 sm:p-3 rounded bg-accent">
                          <span className="text-xs sm:text-sm">Close modals</span>
                          <kbd className="px-2 py-1 bg-background rounded text-[10px] sm:text-xs font-mono">
                            ESC
                          </kbd>
                        </div>
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 p-2 sm:p-3 rounded bg-accent">
                          <span className="text-xs sm:text-sm">Open Help</span>
                          <kbd className="px-2 py-1 bg-background rounded text-[10px] sm:text-xs font-mono">
                            ?
                          </kbd>
                        </div>
                      </div>
                    </section>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}






