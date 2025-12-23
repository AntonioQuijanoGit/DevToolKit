"use client";

import { Sidebar } from "@/components/layout/sidebar";
import { MobileSidebar } from "@/components/layout/mobile-sidebar";
import { ContextualSuggestions } from "@/components/shared/contextual-suggestions";
import { useStatsStore } from "@/lib/store/stats-store";
import { useRecentToolsStore } from "@/lib/store/recent-tools-store";
import { useAnalyticsStore } from "@/lib/store/analytics-store";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useRef } from "react";

export default function ToolsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const recordUsage = useStatsStore((state) => state.recordUsage);
  const addRecent = useRecentToolsStore((state) => state.addRecent);
  const recordActivity = useAnalyticsStore((state) => state.recordActivity);
  
  // Use refs to avoid dependency issues
  const recordUsageRef = useRef(recordUsage);
  const addRecentRef = useRef(addRecent);
  const recordActivityRef = useRef(recordActivity);
  
  // Update refs when functions change
  useEffect(() => {
    recordUsageRef.current = recordUsage;
    addRecentRef.current = addRecent;
    recordActivityRef.current = recordActivity;
  }, [recordUsage, addRecent, recordActivity]);

  const currentToolId = useMemo(() => {
    if (pathname.startsWith("/tools/")) {
      return pathname.replace("/tools/", "");
    }
    return undefined;
  }, [pathname]);

  // Track last tool to avoid duplicate recordings
  const lastToolIdRef = useRef<string | undefined>(undefined);

  useEffect(() => {
    if (currentToolId && currentToolId !== lastToolIdRef.current) {
      lastToolIdRef.current = currentToolId;
      recordUsageRef.current(currentToolId);
      addRecentRef.current(currentToolId);
      recordActivityRef.current(currentToolId);
    }
  }, [currentToolId]);

  return (
    <div className="flex h-screen overflow-hidden">
      <MobileSidebar />
      <Sidebar />
      <main className="flex-1 md:ml-60 overflow-y-auto">
        {currentToolId && (
          <div className="p-6 pb-0">
            <ContextualSuggestions currentToolId={currentToolId} />
          </div>
        )}
        {children}
      </main>
    </div>
  );
}

