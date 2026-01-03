"use client";

import { Sidebar } from "@/components/layout/sidebar";
import { MobileSidebar } from "@/components/layout/mobile-sidebar";
import { ContextualSuggestions } from "@/components/shared/contextual-suggestions";
import { Footer } from "@/components/shared/footer";
import { useStatsStore } from "@/lib/store/stats-store";
import { useRecentToolsStore } from "@/lib/store/recent-tools-store";
import { useAnalyticsStore } from "@/lib/store/analytics-store";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useRef, useCallback } from "react";

export default function ToolsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const recordUsage = useStatsStore((state) => state.recordUsage);
  const addRecent = useRecentToolsStore((state) => state.addRecent);
  const recordActivity = useAnalyticsStore((state) => state.recordActivity);

  const currentToolId = useMemo(() => {
    if (pathname.startsWith("/tools/")) {
      return pathname.replace("/tools/", "");
    }
    return undefined;
  }, [pathname]);

  // Track last tool to avoid duplicate recordings
  const lastToolIdRef = useRef<string | undefined>(undefined);

  const recordToolUsage = useCallback((toolId: string) => {
    recordUsage(toolId);
    addRecent(toolId);
    recordActivity(toolId);
  }, [recordUsage, addRecent, recordActivity]);

  useEffect(() => {
    if (currentToolId && currentToolId !== lastToolIdRef.current) {
      lastToolIdRef.current = currentToolId;
      recordToolUsage(currentToolId);
    }
  }, [currentToolId, recordToolUsage]);

  return (
    <div className="flex h-screen overflow-hidden">
      <MobileSidebar />
      <Sidebar />
      <main 
        id="main-content"
        className="flex-1 md:ml-60 lg:ml-64 overflow-y-auto focus:outline-none scroll-smooth w-full"
        role="main"
        aria-label="Main content"
        tabIndex={-1}
      >
        {currentToolId && (
          <div className="px-3 sm:px-4 md:px-6 pt-3 sm:pt-4 md:pt-6 pb-2">
            <ContextualSuggestions currentToolId={currentToolId} />
          </div>
        )}
        {children}
        <Footer />
      </main>
    </div>
  );
}

