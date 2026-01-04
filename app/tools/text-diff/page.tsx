"use client";

import { useState } from "react";
import { FileDiff } from "lucide-react";
import { ToolHeader } from "@/components/layout/tool-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { CopyButton } from "@/components/shared/copy-button";
import { HowToUse } from "@/components/shared/how-to-use";
import { diffWords, diffLines, Change } from "diff";
import { examples } from "@/lib/constants/examples";

export default function TextDiffPage() {
  const [text1, setText1] = useState("");
  const [text2, setText2] = useState("");
  const [diffMode, setDiffMode] = useState<"words" | "lines">("words");

  const handleExample = () => {
    const example = examples["text-diff"];
    if (example && typeof example === "object") {
      setText1(example.text1 || "");
      setText2(example.text2 || "");
    }
  };

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

      <div className="flex-1 p-3 sm:p-4 md:p-6 space-y-3 sm:space-y-4 overflow-auto pb-20 sm:pb-24">
        <HowToUse
          steps={[
            "Enter two texts to compare in the input fields",
            "Select comparison mode (Words or Lines)",
            "View differences highlighted in real-time",
            "Copy the diff result for documentation or reviews",
          ]}
        />
        <Card>
          <CardHeader className="p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0">
              <CardTitle className="text-base sm:text-lg font-semibold">Comparison Mode</CardTitle>
              <div className="flex gap-2">
                <Button
                  variant={diffMode === "words" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setDiffMode("words")}
                  className="text-xs sm:text-sm "
                >
                  Words
                </Button>
                <Button
                  variant={diffMode === "lines" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setDiffMode("lines")}
                  className="text-xs sm:text-sm "
                >
                  Lines
                </Button>
              </div>
            </div>
          </CardHeader>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
          <Card className="flex flex-col overflow-hidden min-h-[300px] sm:min-h-[400px]">
            <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0 pb-3 p-4 sm:p-6 border-b">
              <CardTitle className="text-base sm:text-lg font-semibold">Text 1</CardTitle>
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
                value={text1}
                onChange={(e) => setText1(e.target.value)}
                placeholder="Enter first text..."
                className="h-full font-mono text-xs sm:text-sm resize-none min-h-[200px]"
              />
            </CardContent>
          </Card>

          <Card className="flex flex-col overflow-hidden min-h-[300px] sm:min-h-[400px]">
            <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0 pb-3 p-4 sm:p-6 border-b">
              <CardTitle className="text-base sm:text-lg font-semibold">Text 2</CardTitle>
              <Button variant="ghost" size="sm" onClick={handleClear} className="text-xs sm:text-sm ">
                Clear
              </Button>
            </CardHeader>
            <CardContent className="flex-1 overflow-hidden p-4 sm:p-6">
              <Textarea
                value={text2}
                onChange={(e) => setText2(e.target.value)}
                placeholder="Enter second text..."
                className="h-full font-mono text-xs sm:text-sm resize-none min-h-[200px]"
              />
            </CardContent>
          </Card>
        </div>

        {text1 || text2 ? (
          <Card>
            <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0 pb-3 p-4 sm:p-6 border-b">
              <CardTitle className="text-base sm:text-lg font-semibold">Diff Result</CardTitle>
              <CopyButton text={JSON.stringify(diff, null, 2)} />
            </CardHeader>
            <CardContent className="p-4 sm:p-6">
              <div className="p-3 sm:p-4 rounded-lg bg-accent border border-border font-mono text-xs sm:text-sm whitespace-pre-wrap break-words overflow-x-auto">
                {renderDiff()}
              </div>
            </CardContent>
          </Card>
        ) : null}
      </div>
    </div>
  );
}






