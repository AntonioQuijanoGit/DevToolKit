"use client";

import { useState, useMemo } from "react";
import { Type } from "lucide-react";
import { ToolHeader } from "@/components/layout/tool-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { CopyButton } from "@/components/shared/copy-button";
import { Badge } from "@/components/ui/badge";

export default function StringUtilitiesPage() {
  const [input, setInput] = useState("");

  const stats = useMemo(() => {
    if (!input) {
      return {
        characters: 0,
        charactersNoSpaces: 0,
        words: 0,
        lines: 0,
        paragraphs: 0,
        bytes: 0,
      };
    }

    return {
      characters: input.length,
      charactersNoSpaces: input.replace(/\s/g, "").length,
      words: input.trim() ? input.trim().split(/\s+/).length : 0,
      lines: input.split("\n").length,
      paragraphs: input.split(/\n\s*\n/).filter((p) => p.trim()).length,
      bytes: new Blob([input]).size,
    };
  }, [input]);

  const reversed = useMemo(() => {
    return input.split("").reverse().join("");
  }, [input]);

  const handleClear = () => {
    setInput("");
  };

  const handleTransform = (transform: (text: string) => string) => {
    setInput(transform(input));
  };

  return (
    <div className="h-screen flex flex-col">
      <ToolHeader
        title="String Utilities"
        description="Count characters, words, lines and more"
        icon={Type}
      />

      <div className="flex-1 p-6 space-y-4 overflow-auto">
        <div className="grid grid-cols-2 gap-4">
          <Card className="flex flex-col overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <CardTitle>Input</CardTitle>
              <Button variant="ghost" size="sm" onClick={handleClear}>
                Clear
              </Button>
            </CardHeader>
            <CardContent className="flex-1 overflow-hidden">
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Enter text to analyze..."
                className="h-full resize-none"
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Statistics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-muted-foreground">Characters</div>
                  <div className="text-2xl font-bold">{stats.characters}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Characters (no spaces)</div>
                  <div className="text-2xl font-bold">{stats.charactersNoSpaces}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Words</div>
                  <div className="text-2xl font-bold">{stats.words}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Lines</div>
                  <div className="text-2xl font-bold">{stats.lines}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Paragraphs</div>
                  <div className="text-2xl font-bold">{stats.paragraphs}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Bytes</div>
                  <div className="text-2xl font-bold">{stats.bytes}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Transformations</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleTransform((t) => t.toUpperCase())}
              >
                UPPERCASE
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleTransform((t) => t.toLowerCase())}
              >
                lowercase
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleTransform((t) => t.split("").reverse().join(""))}
              >
                Reverse
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleTransform((t) => t.trim())}
              >
                Trim
              </Button>
            </div>
            {reversed && (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="secondary">Reversed</Badge>
                  <CopyButton text={reversed} />
                </div>
                <div className="p-3 rounded bg-accent border border-border font-mono text-sm">
                  {reversed}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}






