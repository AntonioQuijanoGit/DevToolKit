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
    <div className={cn("mb-4", className)}>
        <Card className="p-4 bg-primary/5 border-primary/20 pl-12 md:pl-4">
          <div className="flex items-start gap-3">
            <Sparkles className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                You might also like
                <Badge variant="secondary" className="text-xs">
                  {suggestions.length}
                </Badge>
              </h4>
              <div className="flex flex-wrap gap-2">
                {suggestions.map((tool) => {
                  const Icon = tool.icon;
                  return (
                    <Button
                      key={tool.id}
                      variant="outline"
                      size="sm"
                      onClick={() => router.push(tool.href)}
                      className="h-auto py-2 px-3"
                    >
                      <Icon className="h-4 w-4 mr-2" />
                      {tool.name}
                    </Button>
                  );
                })}
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 flex-shrink-0"
              onClick={() => setDismissed(true)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </Card>
    </div>
  );
}

