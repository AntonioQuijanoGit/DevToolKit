"use client";

import { useEffect } from "react";
import { CommandPalette } from "@/components/shared/command-palette";
import { HelpTutorial } from "@/components/shared/help-tutorial";
import { KeyboardShortcuts } from "@/components/shared/keyboard-shortcuts";
import { Toaster } from "@/components/ui/toaster";
import { registerServiceWorker } from "@/lib/utils/service-worker";

export function ClientComponents() {
  useEffect(() => {
    // Register Service Worker for offline support
    if (process.env.NODE_ENV === "production") {
      registerServiceWorker();
    }
  }, []);

  return (
    <>
      <CommandPalette />
      <HelpTutorial />
      <KeyboardShortcuts />
      <Toaster />
    </>
  );
}

