"use client";

import { useState, useMemo } from "react";
import { Type } from "lucide-react";
import { ToolHeader } from "@/components/layout/tool-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { CopyButton } from "@/components/shared/copy-button";
import { Badge } from "@/components/ui/badge";
import { examples } from "@/lib/constants/examples";

export default function StringUtilitiesPage() {
  const [input, setInput] = useState("");

  const handleExample = () => {
    const example = examples["string-utilities"];
    if (example && typeof example === "string") {
      setInput(example);
    }
  };

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

      <div className="flex-1 p-3 sm:p-4 md:p-6 space-y-3 sm:space-y-4 overflow-auto pb-20 sm:pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
          <Card className="flex flex-col overflow-hidden min-h-[300px] sm:min-h-[400px]">
            <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0 pb-3 p-4 sm:p-6 border-b">
              <CardTitle className="text-base sm:text-lg font-semibold">Input</CardTitle>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={handleExample} className="text-xs sm:text-sm ">
                  Example
                </Button>
                <Button variant="ghost" size="sm" onClick={handleClear} className="text-xs sm:text-sm ">
                  Clear
                </Button>
              </div>
            </CardHeader>
            <CardContent className="flex-1 overflow-hidden p-4 sm:p-6">
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Enter text to analyze..."
                className="h-full resize-none text-xs sm:text-sm min-h-[200px]"
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="p-4 sm:p-6 border-b">
              <CardTitle className="text-base sm:text-lg font-semibold">Statistics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 p-4 sm:p-6">
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <div className="text-xs sm:text-sm text-muted-foreground">Characters</div>
                  <div className="text-xl sm:text-2xl font-bold">{stats.characters}</div>
                </div>
                <div>
                  <div className="text-xs sm:text-sm text-muted-foreground">Characters (no spaces)</div>
                  <div className="text-xl sm:text-2xl font-bold">{stats.charactersNoSpaces}</div>
                </div>
                <div>
                  <div className="text-xs sm:text-sm text-muted-foreground">Words</div>
                  <div className="text-xl sm:text-2xl font-bold">{stats.words}</div>
                </div>
                <div>
                  <div className="text-xs sm:text-sm text-muted-foreground">Lines</div>
                  <div className="text-xl sm:text-2xl font-bold">{stats.lines}</div>
                </div>
                <div>
                  <div className="text-xs sm:text-sm text-muted-foreground">Paragraphs</div>
                  <div className="text-xl sm:text-2xl font-bold">{stats.paragraphs}</div>
                </div>
                <div>
                  <div className="text-xs sm:text-sm text-muted-foreground">Bytes</div>
                  <div className="text-xl sm:text-2xl font-bold">{stats.bytes}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader className="p-4 sm:p-6 border-b">
            <CardTitle className="text-base sm:text-lg font-semibold">Transformations</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 sm:space-y-4 p-4 sm:p-6">
            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleTransform((t) => t.toUpperCase())}
                className="text-xs sm:text-sm "
              >
                UPPERCASE
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleTransform((t) => t.toLowerCase())}
                className="text-xs sm:text-sm "
              >
                lowercase
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleTransform((t) => t.split("").reverse().join(""))}
                className="text-xs sm:text-sm "
              >
                Reverse
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleTransform((t) => t.trim())}
                className="text-xs sm:text-sm "
              >
                Trim
              </Button>
            </div>
            {reversed && (
              <div>
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-2">
                  <Badge variant="secondary" className="text-[10px] sm:text-xs">Reversed</Badge>
                  <CopyButton text={reversed} />
                </div>
                <div className="p-3 rounded bg-accent border border-border font-mono text-xs sm:text-sm break-words">
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






