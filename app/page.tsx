"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { tools } from "@/lib/constants/tools";
import { motion } from "framer-motion";
import { Footer } from "@/components/shared/footer";

function Stat({ number, label }: { number: string; label: string }) {
  return (
    <div className="text-center">
      <div className="text-3xl sm:text-4xl font-bold mb-2">{number}</div>
      <div className="text-sm text-muted-foreground">{label}</div>
    </div>
  );
}

const ToolCard = React.memo(function ToolCard({ tool }: { tool: (typeof tools)[0] }) {
  const Icon = tool.icon;

  return (
    <Link href={tool.href}>
      <Card className="p-4 sm:p-6 h-full hover:border-primary/50 transition-colors cursor-pointer group">
        <div className="flex items-start justify-between mb-3 sm:mb-4">
          <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors flex-shrink-0">
            <Icon className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
          </div>
          <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all flex-shrink-0 ml-2" />
        </div>
        <h3 className="text-base sm:text-lg font-semibold mb-2">{tool.name}</h3>
        <p className="text-xs sm:text-sm text-muted-foreground">{tool.description}</p>
        <Badge variant="secondary" className="mt-3 sm:mt-4 text-xs">
          {tool.category}
        </Badge>
      </Card>
    </Link>
  );
});

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center px-4 sm:px-6 py-12 sm:py-0">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-4xl w-full"
        >
          <Badge className="mb-4 sm:mb-6">Free Developer Tools</Badge>

          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mt-4 sm:mt-6 mb-3 sm:mb-4 px-2">
            Essential Tools for
            <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent block sm:inline">
              {" "}
              Developers
            </span>
          </h1>

          <p className="text-base sm:text-lg md:text-xl text-muted-foreground mb-6 sm:mb-8 max-w-2xl mx-auto px-4">
            Format, convert, test and generate. All your dev tools in one place.
            No login required. Works offline.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mb-8 sm:mb-16 px-4">
            <Button size="lg" className="w-full sm:w-auto" asChild>
              <Link href="/tools/json-formatter">
                Get Started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" className="w-full sm:w-auto" asChild>
              <Link href="https://github.com/AntonioQuijanoGit/DevToolKit" target="_blank" rel="noopener noreferrer">
                View on GitHub
              </Link>
            </Button>
          </div>

          <div className="flex flex-col sm:flex-row gap-6 sm:gap-8 md:gap-12 justify-center px-4">
            <div className="text-center">
              <Stat number={tools.length.toString()} label="Tools" />
              <p className="text-xs text-muted-foreground mt-2 max-w-[120px] mx-auto">
                All-in-one toolkit for developers
              </p>
            </div>
            <div className="text-center">
              <Stat number="100%" label="Free" />
              <p className="text-xs text-muted-foreground mt-2 max-w-[120px] mx-auto">
                No credit card required
              </p>
            </div>
            <div className="text-center">
              <Stat number="0ms" label="Latency" />
              <p className="text-xs text-muted-foreground mt-2 max-w-[120px] mx-auto">
                Works completely offline
              </p>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Features Grid */}
      <section className="py-12 sm:py-16 md:py-24 px-4 sm:px-6 bg-card">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center mb-8 sm:mb-12 md:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 px-4">
              All Tools You Need
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto px-4">
              Discover powerful developer tools. Press <kbd className="px-2 py-1 bg-background border border-border rounded text-xs sm:text-sm font-mono">Cmd/Ctrl + K</kbd> to search, or <kbd className="px-2 py-1 bg-background border border-border rounded text-xs sm:text-sm font-mono">?</kbd> for shortcuts.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 max-w-7xl mx-auto">
            {tools.map((tool) => (
              <ToolCard key={tool.id} tool={tool} />
            ))}
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
