"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { tools, categories } from "@/lib/constants/tools";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { useRecentToolsStore } from "@/lib/store/recent-tools-store";
import { Clock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function MobileSidebar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
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

  const toolsByCategory = useMemo(() => 
    categories.map((category) => ({
      category,
      tools: tools.filter((tool) => tool.category === category),
    })),
    []
  );

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden fixed top-3 left-3 sm:top-4 sm:left-4 z-50"
        onClick={() => setOpen(true)}
      >
        <Menu className="h-5 w-5 sm:h-6 sm:w-6" />
      </Button>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
              onClick={() => setOpen(false)}
            />
            <motion.aside
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed left-0 top-0 h-screen w-[280px] sm:w-64 border-r border-border bg-card overflow-y-auto z-50 md:hidden"
            >
              <div className="p-4 sm:p-6 border-b border-border flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2 min-w-0" onClick={() => setOpen(false)}>
                  <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center flex-shrink-0">
                    <span className="text-primary-foreground font-bold text-sm">DT</span>
                  </div>
                  <span className="font-bold text-base sm:text-lg truncate">DevToolkit</span>
                </Link>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <ThemeToggle />
                  <Button variant="ghost" size="icon" onClick={() => setOpen(false)}>
                    <X className="h-4 w-4 sm:h-5 sm:w-5" />
                  </Button>
                </div>
              </div>

              <nav className="p-3 sm:p-4 space-y-4 sm:space-y-6">
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
                          <li key={tool.id}>
                            <Link
                              href={tool.href}
                              onClick={() => setOpen(false)}
                              className={cn(
                                "relative flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors",
                                "hover:bg-accent hover:text-accent-foreground",
                                isActive
                                  ? "bg-accent text-accent-foreground font-medium"
                                  : "text-muted-foreground"
                              )}
                            >
                              {isActive && (
                                <motion.div
                                  layoutId="activeIndicatorMobile"
                                  className="absolute left-0 w-1 h-6 bg-primary rounded-r"
                                  initial={false}
                                />
                              )}
                              <Icon className="h-4 w-4" />
                              <span>{tool.name}</span>
                            </Link>
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
                          <li key={tool.id}>
                            <Link
                              href={tool.href}
                              onClick={() => setOpen(false)}
                              className={cn(
                                "relative flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors",
                                "hover:bg-accent hover:text-accent-foreground",
                                isActive
                                  ? "bg-accent text-accent-foreground font-medium"
                                  : "text-muted-foreground"
                              )}
                            >
                              {isActive && (
                                <motion.div
                                  layoutId="activeIndicatorMobile"
                                  className="absolute left-0 w-1 h-6 bg-primary rounded-r"
                                  initial={false}
                                />
                              )}
                              <Icon className="h-4 w-4" />
                              <span>{tool.name}</span>
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                ))}
              </nav>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

