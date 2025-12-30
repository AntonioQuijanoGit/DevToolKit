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

  const favoriteTools = useMemo(() => 
    tools.filter((tool) => favorites.includes(tool.id)),
    [favorites]
  );
  
  const toolsByCategory = useMemo(() => 
    categories.map((category) => ({
      category,
      tools: tools.filter((tool) => tool.category === category),
    })),
    []
  );

  return (
    <aside 
      className="hidden md:block fixed left-0 top-0 h-screen w-60 lg:w-64 border-r border-border bg-card overflow-y-auto z-40"
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="p-4 md:p-5 lg:p-6 border-b border-border flex items-center justify-between">
        <Link 
          href="/" 
          className="flex items-center gap-2 min-w-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-md"
          aria-label="DevToolkit home"
        >
          <div className="h-8 w-8 lg:h-9 lg:w-9 rounded-lg bg-primary flex items-center justify-center flex-shrink-0" aria-hidden="true">
            <span className="text-primary-foreground font-bold text-sm lg:text-base">DT</span>
          </div>
          <span className="font-bold text-base md:text-lg lg:text-xl truncate">DevToolkit</span>
        </Link>
        <ThemeToggle />
      </div>

      <nav className="p-3 md:p-4 lg:p-5 space-y-4 md:space-y-5 lg:space-y-6" aria-label="Navigation menu">
        {mounted && recentTools.length > 0 && (
          <div>
            <h3 className="text-xs lg:text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 lg:mb-2.5 px-2 flex items-center gap-2">
              <Clock className="h-3 w-3 lg:h-3.5 lg:w-3.5" aria-hidden="true" />
              Recent
            </h3>
            <ul className="space-y-1" role="list">
              {recentTools.map((tool) => {
                const Icon = tool.icon;
                const isActive = pathname === tool.href;

                return (
                  <li key={tool.id} className="group" role="listitem">
                    <div className="flex items-center">
                      <Link
                        href={tool.href}
                        className={cn(
                          "relative flex-1 flex items-center gap-3 px-3 lg:px-3.5 py-2.5 lg:py-3 rounded-lg text-sm lg:text-sm transition-colors min-h-[44px]",
                          "hover:bg-accent hover:text-accent-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
                          isActive
                            ? "bg-accent text-accent-foreground font-medium"
                            : "text-muted-foreground"
                        )}
                        aria-current={isActive ? "page" : undefined}
                      >
                        {isActive && (
                          <motion.div
                            layoutId="activeIndicator"
                            className="absolute left-0 w-1 h-6 bg-primary rounded-r"
                            initial={false}
                            aria-hidden="true"
                          />
                        )}
                        <Icon className="h-4 w-4 lg:h-4.5 lg:w-4.5 flex-shrink-0" aria-hidden="true" />
                        <span className="truncate">{tool.name}</span>
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
            <h3 className="text-xs lg:text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 lg:mb-2.5 px-2">
              Favorites
            </h3>
            <ul className="space-y-1" role="list" aria-label="Favorite tools">
              {favoriteTools.map((tool) => {
                const Icon = tool.icon;
                const isActive = pathname === tool.href;

                return (
                  <li key={tool.id} className="group" role="listitem">
                    <div className="flex items-center">
                      <Link
                        href={tool.href}
                        className={cn(
                          "relative flex-1 flex items-center gap-3 px-3 lg:px-3.5 py-2.5 lg:py-3 rounded-lg text-sm lg:text-sm transition-colors min-h-[44px]",
                          "hover:bg-accent hover:text-accent-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
                          isActive
                            ? "bg-accent text-accent-foreground font-medium"
                            : "text-muted-foreground"
                        )}
                        aria-current={isActive ? "page" : undefined}
                      >
                        {isActive && (
                          <motion.div
                            layoutId="activeIndicator"
                            className="absolute left-0 w-1 h-6 bg-primary rounded-r"
                            initial={false}
                            aria-hidden="true"
                          />
                        )}
                        <Icon className="h-4 w-4 lg:h-4.5 lg:w-4.5 flex-shrink-0" aria-hidden="true" />
                        <span className="truncate">{tool.name}</span>
                      </Link>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-9 w-9 lg:h-10 lg:w-10 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 min-h-[44px] min-w-[44px]"
                        onClick={(e) => {
                          e.preventDefault();
                          toggleFavorite(tool.id);
                        }}
                        aria-label={`Remove ${tool.name} from favorites`}
                      >
                        <Star className="h-3.5 w-3.5 lg:h-4 lg:w-4 fill-yellow-500 text-yellow-500" aria-hidden="true" />
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
            <h3 className="text-xs lg:text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 lg:mb-2.5 px-2">
              {category}
            </h3>
            <ul className="space-y-1" role="list" aria-label={`${category} tools`}>
              {categoryTools.map((tool) => {
                const Icon = tool.icon;
                const isActive = pathname === tool.href;

                return (
                  <li key={tool.id} className="group" role="listitem">
                    <div className="flex items-center">
                      <Link
                        href={tool.href}
                        className={cn(
                          "relative flex-1 flex items-center gap-3 px-3 lg:px-3.5 py-2.5 lg:py-3 rounded-lg text-sm lg:text-sm transition-colors min-h-[44px]",
                          "hover:bg-accent hover:text-accent-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
                          isActive
                            ? "bg-accent text-accent-foreground font-medium"
                            : "text-muted-foreground"
                        )}
                        aria-current={isActive ? "page" : undefined}
                      >
                        {isActive && (
                          <motion.div
                            layoutId="activeIndicator"
                            className="absolute left-0 w-1 h-6 bg-primary rounded-r"
                            initial={false}
                            aria-hidden="true"
                          />
                        )}
                        <Icon className="h-4 w-4 lg:h-4.5 lg:w-4.5 flex-shrink-0" aria-hidden="true" />
                        <span className="truncate">{tool.name}</span>
                      </Link>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-9 w-9 lg:h-10 lg:w-10 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 min-h-[44px] min-w-[44px]"
                        onClick={(e) => {
                          e.preventDefault();
                          toggleFavorite(tool.id);
                        }}
                        aria-label={isFavorite(tool.id) ? `Remove ${tool.name} from favorites` : `Add ${tool.name} to favorites`}
                      >
                        <Star
                          className={cn(
                            "h-3.5 w-3.5 lg:h-4 lg:w-4",
                            isFavorite(tool.id)
                              ? "fill-yellow-500 text-yellow-500"
                              : "text-muted-foreground"
                          )}
                          aria-hidden="true"
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

