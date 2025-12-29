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
      <main className="flex-1 md:ml-60 overflow-y-auto">
        {currentToolId && (
          <div className="p-3 sm:p-4 md:p-6 pb-0">
            <ContextualSuggestions currentToolId={currentToolId} />
          </div>
        )}
        {children}
        <Footer />
      </main>
    </div>
  );
}

