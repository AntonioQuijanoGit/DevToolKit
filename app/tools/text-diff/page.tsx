"use client";

import { useState } from "react";
import { FileDiff } from "lucide-react";
import { ToolHeader } from "@/components/layout/tool-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { CopyButton } from "@/components/shared/copy-button";
import { diffWords, diffLines, Change } from "diff";

export default function TextDiffPage() {
  const [text1, setText1] = useState("");
  const [text2, setText2] = useState("");
  const [diffMode, setDiffMode] = useState<"words" | "lines">("words");

  const diff = diffMode === "words" ? diffWords(text1, text2) : diffLines(text1, text2);

  const handleClear = () => {
    setText1("");
    setText2("");
  };

  const renderDiff = () => {
    return diff.map((part: Change, index: number) => {
      const className = part.added
        ? "bg-green-500/20 text-green-300"
        : part.removed
        ? "bg-red-500/20 text-red-300 line-through"
        : "text-foreground";
      return (
        <span key={index} className={className}>
          {part.value}
        </span>
      );
    });
  };

  return (
    <div className="h-screen flex flex-col">
      <ToolHeader
        title="Text Diff/Compare"
        description="Compare two texts and see differences"
        icon={FileDiff}
      />

      <div className="flex-1 p-6 space-y-4 overflow-auto">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Comparison Mode</CardTitle>
              <div className="flex gap-2">
                <Button
                  variant={diffMode === "words" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setDiffMode("words")}
                >
                  Words
                </Button>
                <Button
                  variant={diffMode === "lines" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setDiffMode("lines")}
                >
                  Lines
                </Button>
              </div>
            </div>
          </CardHeader>
        </Card>

        <div className="grid grid-cols-2 gap-4">
          <Card className="flex flex-col overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <CardTitle>Text 1</CardTitle>
              <Button variant="ghost" size="sm" onClick={handleClear}>
                Clear
              </Button>
            </CardHeader>
            <CardContent className="flex-1 overflow-hidden">
              <Textarea
                value={text1}
                onChange={(e) => setText1(e.target.value)}
                placeholder="Enter first text..."
                className="h-full font-mono text-sm resize-none"
              />
            </CardContent>
          </Card>

          <Card className="flex flex-col overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <CardTitle>Text 2</CardTitle>
              <Button variant="ghost" size="sm" onClick={handleClear}>
                Clear
              </Button>
            </CardHeader>
            <CardContent className="flex-1 overflow-hidden">
              <Textarea
                value={text2}
                onChange={(e) => setText2(e.target.value)}
                placeholder="Enter second text..."
                className="h-full font-mono text-sm resize-none"
              />
            </CardContent>
          </Card>
        </div>

        {text1 || text2 ? (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <CardTitle>Diff Result</CardTitle>
              <CopyButton text={JSON.stringify(diff, null, 2)} />
            </CardHeader>
            <CardContent>
              <div className="p-4 rounded-lg bg-accent border border-border font-mono text-sm whitespace-pre-wrap">
                {renderDiff()}
              </div>
            </CardContent>
          </Card>
        ) : null}
      </div>
    </div>
  );
}






