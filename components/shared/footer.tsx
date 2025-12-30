"use client";

import Link from "next/link";
import { Github, Code, Heart } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function Footer() {
  const technologies = [
    "Next.js 16",
    "React 19",
    "TypeScript",
    "Tailwind CSS",
    "shadcn/ui",
    "Framer Motion",
    "Zustand",
  ];

  return (
    <footer className="border-t border-border bg-card/50 backdrop-blur-sm" role="contentinfo">
      <div className="container mx-auto px-3 sm:px-4 sm:px-5 md:px-6 py-5 sm:py-6 sm:py-7 md:py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 sm:gap-6 sm:gap-7 md:gap-8">
          {/* About */}
          <div>
            <h3 className="font-semibold mb-2.5 sm:mb-3 flex items-center gap-2 text-xs sm:text-sm sm:text-base">
              <Code className="h-3.5 w-3.5 sm:h-4 sm:w-4" aria-hidden="true" />
              DevToolkit
            </h3>
            <p className="text-xs sm:text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4 leading-relaxed">
              Essential developer tools in one place. Free, fast, and works offline.
            </p>
            <div className="text-xs text-muted-foreground">
              <p className="mb-1">Developed with</p>
              <div className="flex items-center gap-1 flex-wrap">
                <Heart className="h-3 w-3 text-red-500 flex-shrink-0" aria-hidden="true" />
                <span>by</span>
                <span className="font-semibold text-foreground">Antonio Quijano</span>
              </div>
            </div>
          </div>

          {/* Technologies */}
          <div>
            <h3 className="font-semibold mb-2.5 sm:mb-3 text-xs sm:text-sm sm:text-base">Built with</h3>
            <div className="flex flex-wrap gap-1.5 sm:gap-2" role="list" aria-label="Technologies used">
              {technologies.map((tech) => (
                <Badge key={tech} variant="secondary" className="text-[10px] sm:text-xs" role="listitem">
                  {tech}
                </Badge>
              ))}
            </div>
          </div>

          {/* Links */}
          <div>
            <h3 className="font-semibold mb-2.5 sm:mb-3 text-xs sm:text-sm sm:text-base">Links</h3>
            <nav className="flex flex-col gap-2" aria-label="Footer navigation">
              <Link
                href="https://github.com/AntonioQuijanoGit/DevToolKit"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs sm:text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2 min-h-[44px] focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-md px-1"
                aria-label="View DevToolkit on GitHub (opens in new tab)"
              >
                <Github className="h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0" aria-hidden="true" />
                <span className="break-words">GitHub Repository</span>
              </Link>
              <Link
                href="/tools/stats"
                className="text-xs sm:text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-colors min-h-[44px] flex items-center focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-md px-1"
                aria-label="View usage statistics"
              >
                Usage Statistics
              </Link>
            </nav>
          </div>
        </div>

        <div className="mt-5 sm:mt-6 sm:mt-7 md:mt-8 pt-4 sm:pt-5 sm:pt-6 border-t border-border text-center text-[10px] sm:text-xs text-muted-foreground px-2">
          <p className="break-words">
            © {new Date().getFullYear()} DevToolkit. Made by{" "}
            <span className="font-semibold text-foreground">Antonio Quijano</span>
          </p>
        </div>
      </div>
    </footer>
  );
}

