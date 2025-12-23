"use client";

import { useState, useMemo } from "react";
import { History, Clock, X } from "lucide-react";
import { useHistoryStore } from "@/lib/store/history-store";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface HistoryDropdownProps {
  toolId: string;
  onSelect: (input: string, output: string) => void;
}

export function HistoryDropdown({ toolId, onSelect }: HistoryDropdownProps) {
  const [open, setOpen] = useState(false);
  const allHistory = useHistoryStore((state) => state.history);
  const clearHistory = useHistoryStore((state) => state.clearHistory);
  
  const history = useMemo(() => {
    return allHistory
      .filter((h) => h.tool === toolId)
      .sort((a, b) => b.timestamp - a.timestamp);
  }, [allHistory, toolId]);

  if (history.length === 0) return null;

  return (
    <TooltipProvider>
      <div className="relative">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setOpen(!open)}
              className="relative"
            >
              <History className="h-4 w-4" />
              {history.length > 0 && (
                <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-primary text-[10px] text-primary-foreground flex items-center justify-center">
                  {history.length > 9 ? "9+" : history.length}
                </span>
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent>View history</TooltipContent>
        </Tooltip>

        {open && (
          <>
            <div
              className="fixed inset-0 z-40"
              onClick={() => setOpen(false)}
            />
            <Card className="absolute right-0 top-12 w-80 max-h-96 overflow-hidden z-50">
              <CardHeader className="flex flex-row items-center justify-between pb-3">
                <CardTitle className="text-sm">Recent History</CardTitle>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      clearHistory(toolId);
                      setOpen(false);
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="max-h-80 overflow-y-auto">
                  {history.slice(0, 10).map((item) => (
                    <button
                      key={item.id}
                      onClick={() => {
                        onSelect(item.input, item.output);
                        setOpen(false);
                      }}
                      className={cn(
                        "w-full text-left p-3 border-b border-border hover:bg-accent transition-colors",
                        "last:border-0"
                      )}
                    >
                      <div className="flex items-start justify-between mb-1">
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-mono truncate text-muted-foreground">
                            {item.input.substring(0, 50)}
                            {item.input.length > 50 ? "..." : ""}
                          </p>
                        </div>
                        <Clock className="h-3 w-3 text-muted-foreground ml-2 flex-shrink-0" />
                      </div>
                      <p className="text-[10px] text-muted-foreground">
                        {format(new Date(item.timestamp), "MMM d, HH:mm")}
                      </p>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </TooltipProvider>
  );
}

