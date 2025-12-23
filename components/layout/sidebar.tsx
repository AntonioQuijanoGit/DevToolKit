"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { tools, categories } from "@/lib/constants/tools";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { useFavoritesStore } from "@/lib/store/favorites-store";
import { useRecentToolsStore } from "@/lib/store/recent-tools-store";
import { Star, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Sidebar() {
  const pathname = usePathname();
  const { favorites, toggleFavorite, isFavorite } = useFavoritesStore();
  const [mounted, setMounted] = useState(false);
  
  // Only access store after mount to avoid hydration mismatch
  const recent = useRecentToolsStore((state) => state.recent);
  
  const recentTools = useMemo(() => {
    if (!mounted || !recent.length) return [];
    const recentToolIds = recent.slice(0, 5);
    return tools
      .filter((tool) => recentToolIds.includes(tool.id))
      .sort((a, b) => recentToolIds.indexOf(a.id) - recentToolIds.indexOf(b.id));
  }, [recent, mounted]);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  const favoriteTools = tools.filter((tool) => favorites.includes(tool.id));
  const toolsByCategory = categories.map((category) => ({
    category,
    tools: tools.filter((tool) => tool.category === category),
  }));

  return (
    <aside className="hidden md:block fixed left-0 top-0 h-screen w-60 border-r border-border bg-card overflow-y-auto z-40">
      <div className="p-6 border-b border-border flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-sm">DT</span>
          </div>
          <span className="font-bold text-lg">DevToolkit</span>
        </Link>
        <ThemeToggle />
      </div>

      <nav className="p-4 space-y-6">
        {mounted && recentTools.length > 0 && (
          <div>
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-2 flex items-center gap-2">
              <Clock className="h-3 w-3" />
              Recent
            </h3>
            <ul className="space-y-1">
              {recentTools.map((tool) => {
                const Icon = tool.icon;
                const isActive = pathname === tool.href;

                return (
                  <li key={tool.id} className="group">
                    <div className="flex items-center">
                      <Link
                        href={tool.href}
                        className={cn(
                          "relative flex-1 flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors",
                          "hover:bg-accent hover:text-accent-foreground",
                          isActive
                            ? "bg-accent text-accent-foreground font-medium"
                            : "text-muted-foreground"
                        )}
                      >
                        {isActive && (
                          <motion.div
                            layoutId="activeIndicator"
                            className="absolute left-0 w-1 h-6 bg-primary rounded-r"
                            initial={false}
                          />
                        )}
                        <Icon className="h-4 w-4" />
                        <span>{tool.name}</span>
                      </Link>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
        {favoriteTools.length > 0 && (
          <div>
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-2">
              Favorites
            </h3>
            <ul className="space-y-1">
              {favoriteTools.map((tool) => {
                const Icon = tool.icon;
                const isActive = pathname === tool.href;

                return (
                  <li key={tool.id} className="group">
                    <div className="flex items-center">
                      <Link
                        href={tool.href}
                        className={cn(
                          "relative flex-1 flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors",
                          "hover:bg-accent hover:text-accent-foreground",
                          isActive
                            ? "bg-accent text-accent-foreground font-medium"
                            : "text-muted-foreground"
                        )}
                      >
                        {isActive && (
                          <motion.div
                            layoutId="activeIndicator"
                            className="absolute left-0 w-1 h-6 bg-primary rounded-r"
                            initial={false}
                          />
                        )}
                        <Icon className="h-4 w-4" />
                        <span>{tool.name}</span>
                      </Link>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 opacity-0 group-hover:opacity-100"
                        onClick={(e) => {
                          e.preventDefault();
                          toggleFavorite(tool.id);
                        }}
                      >
                        <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
                      </Button>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
        {toolsByCategory.map(({ category, tools: categoryTools }) => (
          <div key={category}>
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-2">
              {category}
            </h3>
            <ul className="space-y-1">
              {categoryTools.map((tool) => {
                const Icon = tool.icon;
                const isActive = pathname === tool.href;

                return (
                  <li key={tool.id} className="group">
                    <div className="flex items-center">
                      <Link
                        href={tool.href}
                        className={cn(
                          "relative flex-1 flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors",
                          "hover:bg-accent hover:text-accent-foreground",
                          isActive
                            ? "bg-accent text-accent-foreground font-medium"
                            : "text-muted-foreground"
                        )}
                      >
                        {isActive && (
                          <motion.div
                            layoutId="activeIndicator"
                            className="absolute left-0 w-1 h-6 bg-primary rounded-r"
                            initial={false}
                          />
                        )}
                        <Icon className="h-4 w-4" />
                        <span>{tool.name}</span>
                      </Link>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 opacity-0 group-hover:opacity-100"
                        onClick={(e) => {
                          e.preventDefault();
                          toggleFavorite(tool.id);
                        }}
                      >
                        <Star
                          className={cn(
                            "h-3 w-3",
                            isFavorite(tool.id)
                              ? "fill-yellow-500 text-yellow-500"
                              : "text-muted-foreground"
                          )}
                        />
                      </Button>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>
    </aside>
  );
}

