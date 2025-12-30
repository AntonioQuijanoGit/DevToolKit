"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Sparkles, X } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { tools } from "@/lib/constants/tools";
import { useStatsStore } from "@/lib/store/stats-store";
import { cn } from "@/lib/utils";

interface ContextualSuggestionsProps {
  currentToolId?: string;
  className?: string;
}

export function ContextualSuggestions({
  currentToolId,
  className,
}: ContextualSuggestionsProps) {
  const [dismissed, setDismissed] = useState(false);
  const router = useRouter();
  const stats = useStatsStore((state) => state.stats || {});

  const suggestions = useMemo(() => {
    if (!currentToolId || dismissed) return [];

    const currentTool = tools.find((t) => t.id === currentToolId);
    if (!currentTool) return [];

    // Find tools in the same category
    const sameCategory = tools
      .filter((t) => t.category === currentTool.category && t.id !== currentToolId)
      .slice(0, 2);

    // Find most used tools
    const mostUsed = Object.entries(stats)
      .sort(([, a], [, b]) => b.count - a.count)
      .slice(0, 3)
      .map(([toolId]) => tools.find((t) => t.id === toolId))
      .filter((t): t is typeof tools[0] => t !== undefined && t.id !== currentToolId)
      .slice(0, 2);

    // Combine and deduplicate
    const all = [...sameCategory, ...mostUsed];
    const unique = Array.from(
      new Map(all.map((tool) => [tool.id, tool])).values()
    ).slice(0, 3);

    return unique;
  }, [currentToolId, stats, dismissed]);

  if (suggestions.length === 0 || dismissed) return null;

  return (
    <div className={cn("mb-3 sm:mb-4", className)} role="region" aria-label="Suggested tools">
        <Card className="p-3 sm:p-4 sm:p-4 bg-primary/5 border-primary/20 pl-12 sm:pl-14 sm:pl-16 md:pl-4">
          <div className="flex items-start gap-2.5 sm:gap-3">
            <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 text-primary mt-0.5 flex-shrink-0" aria-hidden="true" />
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-xs sm:text-sm mb-2 sm:mb-2.5 flex items-center gap-2">
                You might also like
                <Badge variant="secondary" className="text-[10px] sm:text-xs">
                  {suggestions.length}
                </Badge>
              </h4>
              <div className="flex flex-wrap gap-2 sm:gap-2.5" role="list" aria-label="Suggested tools">
                {suggestions.map((tool) => {
                  const Icon = tool.icon;
                  return (
                    <Button
                      key={tool.id}
                      variant="outline"
                      size="sm"
                      onClick={() => router.push(tool.href)}
                      className="h-auto min-h-[44px] py-2 sm:py-2.5 px-3 sm:px-3.5 text-xs sm:text-sm"
                      role="listitem"
                      aria-label={`Go to ${tool.name}`}
                    >
                      <Icon className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1.5 sm:mr-2 flex-shrink-0" aria-hidden="true" />
                      <span className="truncate">{tool.name}</span>
                    </Button>
                  );
                })}
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 sm:h-9 sm:w-9 flex-shrink-0 min-h-[44px] min-w-[44px]"
              onClick={() => setDismissed(true)}
              aria-label="Dismiss suggestions"
            >
              <X className="h-4 w-4 sm:h-4.5 sm:w-4.5" aria-hidden="true" />
            </Button>
          </div>
        </Card>
    </div>
  );
}

