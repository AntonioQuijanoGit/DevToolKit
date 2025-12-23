"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Search, Sparkles } from "lucide-react";
import Fuse from "fuse.js";
import { tools } from "@/lib/constants/tools";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

// Tags para búsqueda mejorada
const toolTags: Record<string, string[]> = {
  "json-formatter": ["format", "beautify", "prettify", "indent"],
  "api-tester": ["api", "rest", "http", "request", "test"],
  "curl-generator": ["curl", "command", "terminal", "api"],
  "code-analyzer": ["analyze", "lint", "check", "review", "quality"],
  "code-explainer": ["explain", "understand", "documentation", "docs"],
  "workflow-automation": ["workflow", "automation", "pipeline", "chain"],
};

const fuse = new Fuse(tools, {
  keys: [
    { name: "name", weight: 0.7 },
    { name: "description", weight: 0.3 },
    { name: "category", weight: 0.2 },
  ],
  threshold: 0.3, // Más permisivo para fuzzy search
  includeScore: true,
});

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const router = useRouter();

  const filteredTools = useMemo(() => {
    if (!query.trim()) {
      return tools;
    }

    const lowerQuery = query.toLowerCase();

    // Búsqueda por tags
    const tagMatches = tools.filter((tool) => {
      const tags = toolTags[tool.id] || [];
      return tags.some((tag) => tag.includes(lowerQuery));
    });

    // Fuzzy search
    const fuseResults = fuse.search(query);
    const fuseMatches = fuseResults.map((result) => result.item);

    // Búsqueda exacta
    const exactMatches = tools.filter(
      (tool) =>
        tool.name.toLowerCase().includes(lowerQuery) ||
        tool.description.toLowerCase().includes(lowerQuery) ||
        tool.category.toLowerCase().includes(lowerQuery)
    );

    // Combinar y deduplicar
    const allMatches = [...tagMatches, ...fuseMatches, ...exactMatches];
    const unique = Array.from(
      new Map(allMatches.map((tool) => [tool.id, tool])).values()
    );

    // Ordenar por relevancia (exact matches primero)
    return unique.sort((a, b) => {
      const aExact = exactMatches.includes(a);
      const bExact = exactMatches.includes(b);
      if (aExact && !bExact) return -1;
      if (!aExact && bExact) return 1;
      return 0;
    });
  }, [query]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
      if (e.key === "Escape") {
        setOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    if (open) {
      setQuery("");
      setSelectedIndex(0);
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) =>
          filteredTools.length > 0 ? (prev + 1) % filteredTools.length : 0
        );
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) =>
          filteredTools.length > 0
            ? (prev - 1 + filteredTools.length) % filteredTools.length
            : 0
        );
      } else if (e.key === "Enter") {
        e.preventDefault();
        if (filteredTools[selectedIndex]) {
          router.push(filteredTools[selectedIndex].href);
          setOpen(false);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, query, selectedIndex, router, filteredTools]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-[20vh] bg-black/50 backdrop-blur-sm"
      onClick={() => setOpen(false)}
    >
      <Card
        className="w-full max-w-2xl shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 border-b border-border">
          <div className="flex items-center gap-2">
            <Search className="h-5 w-5 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setSelectedIndex(0);
              }}
              placeholder="Search tools by name, description, or tags... (Cmd+K)"
              className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
              autoFocus
            />
            <kbd className="hidden sm:inline-flex h-5 select-none items-center gap-1 rounded border border-border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
              ESC
            </kbd>
          </div>
        </div>
        <div className="max-h-[400px] overflow-y-auto p-2">
          {filteredTools.length === 0 ? (
            <div className="py-8 text-center text-sm text-muted-foreground">
              No tools found
            </div>
          ) : (
            <div className="space-y-1">
              {filteredTools.map((tool, index) => {
                const Icon = tool.icon;
                return (
                  <button
                    key={tool.id}
                    onClick={() => {
                      router.push(tool.href);
                      setOpen(false);
                    }}
                    className={cn(
                      "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors",
                      "hover:bg-accent hover:text-accent-foreground",
                      selectedIndex === index && "bg-accent text-accent-foreground"
                    )}
                  >
                    <Icon className="h-5 w-5 text-muted-foreground" />
                    <div className="flex-1">
                      <div className="font-medium flex items-center gap-2">
                        {tool.name}
                        {toolTags[tool.id] && toolTags[tool.id].some((tag) =>
                          query.toLowerCase().includes(tag)
                        ) && (
                          <Badge variant="secondary" className="text-xs">
                            <Sparkles className="h-3 w-3 mr-1" />
                            Match
                          </Badge>
                        )}
                      </div>
                      <div className="text-xs text-muted-foreground">{tool.description}</div>
                    </div>
                    <span className="text-xs text-muted-foreground">{tool.category}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}

