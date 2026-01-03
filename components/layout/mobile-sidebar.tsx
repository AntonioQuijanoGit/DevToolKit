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

  // Close sidebar on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) {
        setOpen(false);
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [open]);

  // Prevent body scroll when sidebar is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden fixed top-4 left-4 z-50 min-h-[44px] min-w-[44px] shadow-lg"
        onClick={() => setOpen(true)}
        aria-label="Open navigation menu"
        aria-expanded={open}
        aria-controls="mobile-sidebar"
      >
        <Menu className="h-5 w-5 sm:h-5.5 sm:w-5.5 sm:h-6 sm:w-6" aria-hidden="true" />
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
              id="mobile-sidebar"
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed left-0 top-0 h-screen w-[85vw] max-w-[320px] border-r border-border bg-card overflow-y-auto z-50 md:hidden"
              role="navigation"
              aria-label="Main navigation"
            >
              <div className="p-4 sm:p-5 sm:p-6 border-b border-border flex items-center justify-between">
                <Link 
                  href="/" 
                  className="flex items-center gap-2 min-w-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-md" 
                  onClick={() => setOpen(false)}
                  aria-label="DevToolkit home"
                >
                  <div className="h-8 w-8 sm:h-9 sm:w-9 rounded-lg bg-primary flex items-center justify-center flex-shrink-0" aria-hidden="true">
                    <span className="text-primary-foreground font-bold text-sm sm:text-base">DT</span>
                  </div>
                  <span className="font-bold text-base sm:text-lg sm:text-lg truncate">DevToolkit</span>
                </Link>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <ThemeToggle />
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => setOpen(false)}
                    aria-label="Close navigation menu"
                    className="min-h-[44px] min-w-[44px]"
                  >
                    <X className="h-4 w-4 sm:h-5 sm:w-5 sm:h-5 sm:w-5" aria-hidden="true" />
                  </Button>
                </div>
              </div>

              <nav className="p-3 sm:p-4 sm:p-4 space-y-4 sm:space-y-5 sm:space-y-6" aria-label="Navigation menu">
                {mounted && recentTools.length > 0 && (
                  <div>
                    <h3 className="text-xs sm:text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 sm:mb-2.5 px-2 flex items-center gap-2">
                      <Clock className="h-3 w-3 sm:h-3.5 sm:w-3.5" aria-hidden="true" />
                      Recent
                    </h3>
                    <ul className="space-y-1" role="list">
                      {recentTools.map((tool) => {
                        const Icon = tool.icon;
                        const isActive = pathname === tool.href;

                        return (
                          <li key={tool.id} role="listitem">
                            <Link
                              href={tool.href}
                              onClick={() => setOpen(false)}
                              className={cn(
                                "relative flex items-center gap-3 px-3 sm:px-3.5 py-2.5 sm:py-3 rounded-lg text-sm sm:text-sm transition-colors min-h-[44px]",
                                "hover:bg-accent hover:text-accent-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
                                isActive
                                  ? "bg-accent text-accent-foreground font-medium"
                                  : "text-muted-foreground"
                              )}
                              aria-current={isActive ? "page" : undefined}
                            >
                              {isActive && (
                                <motion.div
                                  layoutId="activeIndicatorMobile"
                                  className="absolute left-0 w-1 h-6 bg-primary rounded-r"
                                  initial={false}
                                  aria-hidden="true"
                                />
                              )}
                              <Icon className="h-4 w-4 sm:h-4.5 sm:w-4.5 flex-shrink-0" aria-hidden="true" />
                              <span className="truncate">{tool.name}</span>
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                )}
                {toolsByCategory.map(({ category, tools: categoryTools }) => (
                  <div key={category}>
                    <h3 className="text-xs sm:text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 sm:mb-2.5 px-2">
                      {category}
                    </h3>
                    <ul className="space-y-1" role="list" aria-label={`${category} tools`}>
                      {categoryTools.map((tool) => {
                        const Icon = tool.icon;
                        const isActive = pathname === tool.href;

                        return (
                          <li key={tool.id} role="listitem">
                            <Link
                              href={tool.href}
                              onClick={() => setOpen(false)}
                              className={cn(
                                "relative flex items-center gap-3 px-3 sm:px-3.5 py-2.5 sm:py-3 rounded-lg text-sm sm:text-sm transition-colors min-h-[44px]",
                                "hover:bg-accent hover:text-accent-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
                                isActive
                                  ? "bg-accent text-accent-foreground font-medium"
                                  : "text-muted-foreground"
                              )}
                              aria-current={isActive ? "page" : undefined}
                            >
                              {isActive && (
                                <motion.div
                                  layoutId="activeIndicatorMobile"
                                  className="absolute left-0 w-1 h-6 bg-primary rounded-r"
                                  initial={false}
                                  aria-hidden="true"
                                />
                              )}
                              <Icon className="h-4 w-4 sm:h-4.5 sm:w-4.5 flex-shrink-0" aria-hidden="true" />
                              <span className="truncate">{tool.name}</span>
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

