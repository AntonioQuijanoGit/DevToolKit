"use client";

import { Keyboard, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Shortcut {
  keys: string[];
  description: string;
  category?: string;
}

interface KeyboardShortcutsProps {
  shortcuts?: Shortcut[];
}

const defaultShortcuts: Shortcut[] = [
  {
    keys: ["Cmd/Ctrl", "K"],
    description: "Open Command Palette",
    category: "Navigation",
  },
  {
    keys: ["?"],
    description: "Show Keyboard Shortcuts",
    category: "Navigation",
  },
  {
    keys: ["ESC"],
    description: "Close modals/dialogs",
    category: "Navigation",
  },
  {
    keys: ["Cmd/Ctrl", "C"],
    description: "Copy result",
    category: "Actions",
  },
  {
    keys: ["Cmd/Ctrl", "S"],
    description: "Save/Download",
    category: "Actions",
  },
  {
    keys: ["Cmd/Ctrl", "Enter"],
    description: "Execute/Process",
    category: "Actions",
  },
];

export function KeyboardShortcuts({ shortcuts = defaultShortcuts }: KeyboardShortcutsProps) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Open with "?" key
      if (e.key === "?" && !e.ctrlKey && !e.metaKey && !e.altKey) {
        // Only if not typing in an input/textarea
        const target = e.target as HTMLElement;
        if (
          target.tagName !== "INPUT" &&
          target.tagName !== "TEXTAREA" &&
          !target.isContentEditable
        ) {
          e.preventDefault();
          setOpen((prev) => !prev);
        }
      }
      // Close with ESC
      if (e.key === "Escape" && open) {
        setOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open]);

  const shortcutsByCategory = shortcuts.reduce((acc, shortcut) => {
    const category = shortcut.category || "General";
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(shortcut);
    return acc;
  }, {} as Record<string, Shortcut[]>);

  return (
    <>
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
              onClick={() => setOpen(false)}
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
              onClick={(e) => e.stopPropagation()}
            >
              <Card className="w-full max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
                <CardHeader className="flex flex-row items-center justify-between border-b">
                  <div className="flex items-center gap-2">
                    <Keyboard className="h-5 w-5" />
                    <CardTitle className="text-xl">Keyboard Shortcuts</CardTitle>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setOpen(false)}
                    aria-label="Close"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </CardHeader>
                <CardContent className="flex-1 overflow-y-auto pt-6">
                  <div className="space-y-6">
                    {Object.entries(shortcutsByCategory).map(([category, categoryShortcuts]) => (
                      <div key={category}>
                        <h3 className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wide">
                          {category}
                        </h3>
                        <div className="space-y-2">
                          {categoryShortcuts.map((shortcut, index) => (
                            <div
                              key={index}
                              className="flex items-center justify-between p-3 rounded-lg bg-accent/50 hover:bg-accent transition-colors"
                            >
                              <span className="text-sm">{shortcut.description}</span>
                              <div className="flex gap-1.5">
                                {shortcut.keys.map((key, i) => (
                                  <Badge
                                    key={i}
                                    variant="secondary"
                                    className="font-mono text-xs px-2 py-1"
                                  >
                                    {key}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-6 pt-4 border-t text-xs text-muted-foreground text-center">
                    Press <kbd className="px-1.5 py-0.5 bg-background rounded text-xs font-mono">?</kbd> or <kbd className="px-1.5 py-0.5 bg-background rounded text-xs font-mono">ESC</kbd> to close
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

