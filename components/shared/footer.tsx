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
    <footer className="border-t border-border bg-card/50 backdrop-blur-sm">
      <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {/* About */}
          <div>
            <h3 className="font-semibold mb-3 flex items-center gap-2 text-sm sm:text-base">
              <Code className="h-4 w-4" />
              DevToolkit
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground mb-4">
              Essential developer tools in one place. Free, fast, and works offline.
            </p>
            <div className="text-xs text-muted-foreground">
              <p className="mb-1">Developed with</p>
              <div className="flex items-center gap-1 flex-wrap">
                <Heart className="h-3 w-3 text-red-500 flex-shrink-0" />
                <span>by</span>
                <span className="font-semibold text-foreground">Antonio Quijano</span>
              </div>
            </div>
          </div>

          {/* Technologies */}
          <div>
            <h3 className="font-semibold mb-3 text-sm sm:text-base">Built with</h3>
            <div className="flex flex-wrap gap-2">
              {technologies.map((tech) => (
                <Badge key={tech} variant="secondary" className="text-xs">
                  {tech}
                </Badge>
              ))}
            </div>
          </div>

          {/* Links */}
          <div>
            <h3 className="font-semibold mb-3 text-sm sm:text-base">Links</h3>
            <div className="flex flex-col gap-2">
              <Link
                href="https://github.com/AntonioQuijanoGit/DevToolKit"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2"
              >
                <Github className="h-4 w-4 flex-shrink-0" />
                <span className="break-words">GitHub Repository</span>
              </Link>
              <Link
                href="/tools/stats"
                className="text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Usage Statistics
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-border text-center text-xs text-muted-foreground px-2">
          <p className="break-words">
            © {new Date().getFullYear()} DevToolkit. Made by{" "}
            <span className="font-semibold text-foreground">Antonio Quijano</span>
          </p>
        </div>
      </div>
    </footer>
  );
}

