"use client";

import { useState } from "react";
import { BookOpen } from "lucide-react";
import { ToolHeader } from "@/components/layout/tool-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CopyButton } from "@/components/shared/copy-button";
import { HowToUse } from "@/components/shared/how-to-use";
import { Badge } from "@/components/ui/badge";
import { commands, searchCommands, getCommandsByCategory, commandCategories } from "@/lib/constants/shell-commands";

export default function CommandCheatsheetPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const filteredCommands = selectedCategory === "all"
    ? searchCommands(searchQuery)
    : getCommandsByCategory(selectedCategory).filter((cmd) =>
        searchQuery === "" ||
        cmd.command.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cmd.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cmd.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );

  return (
    <div className="h-screen flex flex-col">
      <ToolHeader
        title="Command Cheatsheet"
        description="Searchable database of common commands"
        icon={BookOpen}
      />

      <div className="flex-1 p-3 sm:p-4 md:p-6 space-y-3 sm:space-y-4 overflow-auto pb-20 sm:pb-24">
        <HowToUse
          steps={[
            "Search commands by name, description, or tags",
            "Filter by category (git, docker, find, grep, etc.)",
            "Click on a command to copy it to clipboard",
            "Browse commands to discover new ones",
          ]}
        />
        <Card>
          <CardHeader className="p-4 sm:p-6 border-b">
            <CardTitle className="text-base sm:text-lg font-semibold">Search Commands</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 sm:space-y-4 p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search commands, descriptions, tags..."
                className="flex-1 min-h-[44px] text-sm sm:text-base"
              />
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full sm:w-48 min-h-[44px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {commandCategories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat.charAt(0).toUpperCase() + cat.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {filteredCommands.length === 0 ? (
            <Card className="col-span-full">
              <CardContent className="pt-6 p-4 sm:p-6 text-center text-muted-foreground">
                <p className="text-xs sm:text-sm">No commands found</p>
              </CardContent>
            </Card>
          ) : (
            filteredCommands.map((cmd, index) => (
              <Card key={index}>
                <CardHeader className="flex flex-col sm:flex-row items-start justify-between gap-2 sm:gap-0 pb-3 p-4 sm:p-6 border-b">
                  <div className="flex-1 w-full">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="secondary" className="text-[10px] sm:text-xs">{cmd.category}</Badge>
                    </div>
                    <CardTitle className="text-sm sm:text-base font-mono break-all">
                      {cmd.command}
                    </CardTitle>
                  </div>
                  <CopyButton text={cmd.command} />
                </CardHeader>
                <CardContent className="space-y-2 sm:space-y-3 p-4 sm:p-6">
                  <p className="text-xs sm:text-sm text-muted-foreground break-words">{cmd.description}</p>
                  {cmd.explanation && (
                    <p className="text-[10px] sm:text-xs text-muted-foreground italic break-words">
                      {cmd.explanation}
                    </p>
                  )}
                  {cmd.examples && cmd.examples.length > 0 && (
                    <div>
                      <p className="text-[10px] sm:text-xs font-semibold mb-1">Examples:</p>
                      <div className="space-y-1">
                        {cmd.examples.map((example, i) => (
                          <div key={i} className="text-[10px] sm:text-xs font-mono bg-accent p-2 rounded break-words">
                            {example}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {cmd.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {cmd.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-[10px] sm:text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}






