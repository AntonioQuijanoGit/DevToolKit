"use client";

import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { tools } from "@/lib/constants/tools";
import { motion } from "framer-motion";

function Stat({ number, label }: { number: string; label: string }) {
  return (
    <div className="text-center">
      <div className="text-4xl font-bold mb-2">{number}</div>
      <div className="text-sm text-muted-foreground">{label}</div>
    </div>
  );
}

function ToolCard({ tool }: { tool: (typeof tools)[0] }) {
  const Icon = tool.icon;

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
    >
      <Link href={tool.href}>
        <Card className="p-6 h-full hover:border-primary/50 transition-colors cursor-pointer group">
          <div className="flex items-start justify-between mb-4">
            <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
              <Icon className="h-6 w-6 text-primary" />
            </div>
            <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
          </div>
          <h3 className="text-lg font-semibold mb-2">{tool.name}</h3>
          <p className="text-sm text-muted-foreground">{tool.description}</p>
          <Badge variant="secondary" className="mt-4">
            {tool.category}
          </Badge>
        </Card>
      </Link>
    </motion.div>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-4xl"
        >
          <Badge className="mb-6">Free Developer Tools</Badge>

          <h1 className="text-6xl font-bold mt-6 mb-4">
            Essential Tools for
            <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              {" "}
              Developers
            </span>
          </h1>

          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Format, convert, test and generate. All your dev tools in one place.
            No login required. Works offline.
          </p>

          <div className="flex gap-4 justify-center mb-16">
            <Button size="lg" asChild>
              <Link href="/tools/json-formatter">
                Get Started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button variant="outline" size="lg">
              View on GitHub
            </Button>
          </div>

          <div className="flex gap-12 justify-center">
            <div className="text-center">
              <Stat number={tools.length.toString()} label="Tools" />
              <p className="text-xs text-muted-foreground mt-2 max-w-[120px]">
                All-in-one toolkit for developers
              </p>
            </div>
            <div className="text-center">
              <Stat number="100%" label="Free" />
              <p className="text-xs text-muted-foreground mt-2 max-w-[120px]">
                No credit card required
              </p>
            </div>
            <div className="text-center">
              <Stat number="0ms" label="Latency" />
              <p className="text-xs text-muted-foreground mt-2 max-w-[120px]">
                Works completely offline
              </p>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Features Grid */}
      <section className="py-24 px-6 bg-card">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">
              All Tools You Need
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Discover powerful developer tools. Press <kbd className="px-2 py-1 bg-background border border-border rounded text-sm font-mono">Cmd/Ctrl + K</kbd> to search, or <kbd className="px-2 py-1 bg-background border border-border rounded text-sm font-mono">?</kbd> for shortcuts.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
            {tools.map((tool, index) => (
              <motion.div
                key={tool.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <ToolCard tool={tool} />
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>
    </div>
  );
}
