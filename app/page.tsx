"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { tools } from "@/lib/constants/tools";
import { motion } from "framer-motion";
import { Footer } from "@/components/shared/footer";
import { WelcomeBanner } from "@/components/shared/welcome-banner";

function Stat({ number, label }: { number: string; label: string }) {
  return (
    <div className="text-center" role="group" aria-label={`${label}: ${number}`}>
      <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-1.5 sm:mb-2" aria-hidden="true">
        {number}
      </div>
      <div className="text-xs sm:text-sm text-muted-foreground font-medium">{label}</div>
    </div>
  );
}

const ToolCard = React.memo(function ToolCard({ tool }: { tool: (typeof tools)[0] }) {
  const Icon = tool.icon;

  return (
    <Link 
      href={tool.href}
      className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-lg transition-all"
      aria-label={`${tool.name} - ${tool.description}`}
    >
      <Card className="p-4 sm:p-5 md:p-6 h-full hover:border-primary/50 hover:shadow-md transition-all cursor-pointer group focus-within:ring-2 focus-within:ring-primary/50">
        <div className="flex items-start justify-between mb-3 sm:mb-4">
          <div 
            className="h-10 w-10 sm:h-11 sm:w-11 md:h-12 md:w-12 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors flex-shrink-0"
            aria-hidden="true"
          >
            <Icon className="h-5 w-5 sm:h-5.5 sm:w-5.5 md:h-6 md:w-6 text-primary" />
          </div>
          <ArrowRight 
            className="h-4 w-4 sm:h-4.5 sm:w-4.5 md:h-5 md:w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all flex-shrink-0 ml-2" 
            aria-hidden="true"
          />
        </div>
        <h3 className="text-sm sm:text-base md:text-lg font-semibold mb-1.5 sm:mb-2 leading-tight">{tool.name}</h3>
        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed mb-3 sm:mb-4 line-clamp-2">
          {tool.description}
        </p>
        <Badge variant="secondary" className="text-[10px] sm:text-xs font-medium">
          {tool.category}
        </Badge>
      </Card>
    </Link>
  );
});

export default function Home() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="min-h-screen">
      {/* Skip to main content link for accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-md focus:shadow-lg"
      >
        Skip to main content
      </a>

      {/* Hero Section */}
      <section 
        className="min-h-screen flex items-center justify-center px-4 sm:px-6 md:px-8 py-12 sm:py-16 md:py-20 lg:py-24"
        aria-labelledby="hero-heading"
      >
        {mounted ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-4xl w-full"
          >
            <Badge className="mb-4 sm:mb-5 sm:mb-6 text-xs sm:text-sm px-3 sm:px-4 py-1.5" aria-label="Free Developer Tools badge">
              Free Developer Tools
            </Badge>

            <h1 
              id="hero-heading"
              className="text-2xl sm:text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mt-4 sm:mt-5 sm:mt-6 mb-3 sm:mb-4 sm:mb-5 px-2 leading-tight"
            >
              Essential Tools for
              <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent block sm:inline mt-1 sm:mt-0">
                {" "}
                Developers
              </span>
            </h1>

            <p className="text-sm sm:text-base sm:text-lg md:text-xl lg:text-2xl text-muted-foreground mb-6 sm:mb-8 sm:mb-10 md:mb-12 max-w-2xl mx-auto px-3 sm:px-4 leading-relaxed">
              Format, convert, test and generate. All your dev tools in one place.
              No login required. Works offline.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-3.5 sm:gap-4 justify-center mb-8 sm:mb-10 sm:mb-12 md:mb-16 px-3 sm:px-4">
              <Button 
                size="lg" 
                className="w-full sm:w-auto min-h-[44px] text-sm sm:text-base px-6 sm:px-8" 
                asChild
              >
                <Link href="/tools/json-formatter" aria-label="Get started with JSON Formatter">
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" aria-hidden="true" />
                </Link>
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="w-full sm:w-auto min-h-[44px] text-sm sm:text-base px-6 sm:px-8" 
                asChild
              >
                <Link 
                  href="https://github.com/AntonioQuijanoGit/DevToolKit" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  aria-label="View DevToolkit on GitHub (opens in new tab)"
                >
                  View on GitHub
                </Link>
              </Button>
            </div>

            <div 
              className="flex flex-col sm:flex-row gap-6 sm:gap-8 sm:gap-10 md:gap-12 lg:gap-16 justify-center px-3 sm:px-4"
              role="list"
              aria-label="Key features"
            >
              <div className="text-center" role="listitem">
                <Stat number={tools.length.toString()} label="Tools" />
                <p className="text-[10px] sm:text-xs text-muted-foreground mt-2 max-w-[140px] sm:max-w-[160px] mx-auto leading-relaxed">
                  All-in-one toolkit for developers
                </p>
              </div>
              <div className="text-center" role="listitem">
                <Stat number="100%" label="Free" />
                <p className="text-[10px] sm:text-xs text-muted-foreground mt-2 max-w-[140px] sm:max-w-[160px] mx-auto leading-relaxed">
                  No credit card required
                </p>
              </div>
              <div className="text-center" role="listitem">
                <Stat number="0ms" label="Latency" />
                <p className="text-[10px] sm:text-xs text-muted-foreground mt-2 max-w-[140px] sm:max-w-[160px] mx-auto leading-relaxed">
                  Works completely offline
                </p>
              </div>
            </div>
          </motion.div>
        ) : (
          <div className="text-center max-w-4xl w-full">
            <Badge className="mb-4 sm:mb-5 sm:mb-6 text-xs sm:text-sm px-3 sm:px-4 py-1.5" aria-label="Free Developer Tools badge">
              Free Developer Tools
            </Badge>

            <h1 
              id="hero-heading"
              className="text-2xl sm:text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mt-4 sm:mt-5 sm:mt-6 mb-3 sm:mb-4 sm:mb-5 px-2 leading-tight"
            >
              Essential Tools for
              <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent block sm:inline mt-1 sm:mt-0">
                {" "}
                Developers
              </span>
            </h1>

            <p className="text-sm sm:text-base sm:text-lg md:text-xl lg:text-2xl text-muted-foreground mb-6 sm:mb-8 sm:mb-10 md:mb-12 max-w-2xl mx-auto px-3 sm:px-4 leading-relaxed">
              Format, convert, test and generate. All your dev tools in one place.
              No login required. Works offline.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-3.5 sm:gap-4 justify-center mb-8 sm:mb-10 sm:mb-12 md:mb-16 px-3 sm:px-4">
              <Button 
                size="lg" 
                className="w-full sm:w-auto min-h-[44px] text-sm sm:text-base px-6 sm:px-8" 
                asChild
              >
                <Link href="/tools/json-formatter" aria-label="Get started with JSON Formatter">
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" aria-hidden="true" />
                </Link>
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="w-full sm:w-auto min-h-[44px] text-sm sm:text-base px-6 sm:px-8" 
                asChild
              >
                <Link 
                  href="https://github.com/AntonioQuijanoGit/DevToolKit" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  aria-label="View DevToolkit on GitHub (opens in new tab)"
                >
                  View on GitHub
                </Link>
              </Button>
            </div>

            <div 
              className="flex flex-col sm:flex-row gap-6 sm:gap-8 sm:gap-10 md:gap-12 lg:gap-16 justify-center px-3 sm:px-4"
              role="list"
              aria-label="Key features"
            >
              <div className="text-center" role="listitem">
                <Stat number={tools.length.toString()} label="Tools" />
                <p className="text-[10px] sm:text-xs text-muted-foreground mt-2 max-w-[140px] sm:max-w-[160px] mx-auto leading-relaxed">
                  All-in-one toolkit for developers
                </p>
              </div>
              <div className="text-center" role="listitem">
                <Stat number="100%" label="Free" />
                <p className="text-[10px] sm:text-xs text-muted-foreground mt-2 max-w-[140px] sm:max-w-[160px] mx-auto leading-relaxed">
                  No credit card required
                </p>
              </div>
              <div className="text-center" role="listitem">
                <Stat number="0ms" label="Latency" />
                <p className="text-[10px] sm:text-xs text-muted-foreground mt-2 max-w-[140px] sm:max-w-[160px] mx-auto leading-relaxed">
                  Works completely offline
                </p>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Features Grid */}
      <section 
        id="main-content"
        className="py-10 sm:py-12 md:py-16 lg:py-20 xl:py-24 px-4 sm:px-6 md:px-8 bg-card"
        aria-labelledby="tools-heading"
      >
        <div className="max-w-7xl mx-auto mb-6 sm:mb-8">
          <WelcomeBanner />
        </div>
        {mounted ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5 }}
          >
            <div className="text-center mb-8 sm:mb-10 sm:mb-12 md:mb-16">
              <h2 
                id="tools-heading"
                className="text-xl sm:text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4 sm:mb-5 px-3 sm:px-4"
              >
                All Tools You Need
              </h2>
              <p className="text-xs sm:text-sm sm:text-base md:text-lg text-muted-foreground max-w-2xl mx-auto px-3 sm:px-4 leading-relaxed">
                Discover powerful developer tools. Press{" "}
                <kbd className="px-2 sm:px-2.5 py-1 sm:py-1.5 bg-background border border-border rounded text-[10px] sm:text-xs sm:text-sm font-mono">
                  Cmd/Ctrl + K
                </kbd>{" "}
                to search, or{" "}
                <kbd className="px-2 sm:px-2.5 py-1 sm:py-1.5 bg-background border border-border rounded text-[10px] sm:text-xs sm:text-sm font-mono">
                  ?
                </kbd>{" "}
                for shortcuts.
              </p>
            </div>

            <div 
              className="grid grid-cols-1 sm:grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 sm:gap-5 md:gap-6 max-w-7xl mx-auto"
              role="list"
              aria-label="Available developer tools"
            >
              {tools.map((tool) => (
                <ToolCard key={tool.id} tool={tool} />
              ))}
            </div>
          </motion.div>
        ) : (
          <div>
            <div className="text-center mb-8 sm:mb-10 sm:mb-12 md:mb-16">
              <h2 
                id="tools-heading"
                className="text-xl sm:text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4 sm:mb-5 px-3 sm:px-4"
              >
                All Tools You Need
              </h2>
              <p className="text-xs sm:text-sm sm:text-base md:text-lg text-muted-foreground max-w-2xl mx-auto px-3 sm:px-4 leading-relaxed">
                Discover powerful developer tools. Press{" "}
                <kbd className="px-2 sm:px-2.5 py-1 sm:py-1.5 bg-background border border-border rounded text-[10px] sm:text-xs sm:text-sm font-mono">
                  Cmd/Ctrl + K
                </kbd>{" "}
                to search, or{" "}
                <kbd className="px-2 sm:px-2.5 py-1 sm:py-1.5 bg-background border border-border rounded text-[10px] sm:text-xs sm:text-sm font-mono">
                  ?
                </kbd>{" "}
                for shortcuts.
              </p>
            </div>

            <div 
              className="grid grid-cols-1 sm:grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 sm:gap-5 md:gap-6 max-w-7xl mx-auto"
              role="list"
              aria-label="Available developer tools"
            >
              {tools.map((tool) => (
                <ToolCard key={tool.id} tool={tool} />
              ))}
            </div>
          </div>
        )}
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
