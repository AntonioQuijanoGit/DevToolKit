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

      <div className="flex-1 p-6 space-y-4 overflow-auto">
        <Card>
          <CardHeader>
            <CardTitle>Search Commands</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-4">
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search commands, descriptions, tags..."
                className="flex-1"
              />
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-48">
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCommands.length === 0 ? (
            <Card className="col-span-full">
              <CardContent className="pt-6 text-center text-muted-foreground">
                No commands found
              </CardContent>
            </Card>
          ) : (
            filteredCommands.map((cmd, index) => (
              <Card key={index}>
                <CardHeader className="flex flex-row items-start justify-between pb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="secondary">{cmd.category}</Badge>
                    </div>
                    <CardTitle className="text-base font-mono break-all">
                      {cmd.command}
                    </CardTitle>
                  </div>
                  <CopyButton text={cmd.command} />
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-muted-foreground">{cmd.description}</p>
                  {cmd.explanation && (
                    <p className="text-xs text-muted-foreground italic">
                      {cmd.explanation}
                    </p>
                  )}
                  {cmd.examples && cmd.examples.length > 0 && (
                    <div>
                      <p className="text-xs font-semibold mb-1">Examples:</p>
                      <div className="space-y-1">
                        {cmd.examples.map((example, i) => (
                          <div key={i} className="text-xs font-mono bg-accent p-2 rounded">
                            {example}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {cmd.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {cmd.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
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




