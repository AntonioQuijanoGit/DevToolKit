"use client";

import { useState } from "react";
import { FileCode } from "lucide-react";
import { ToolHeader } from "@/components/layout/tool-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CopyButton } from "@/components/shared/copy-button";
import { CodeBlock } from "@/components/shared/code-block";
import { EmptyState } from "@/components/shared/empty-state";
import { HowToUse } from "@/components/shared/how-to-use";
import { minifyJS, beautifyJS } from "@/lib/utils/js-minifier";
import { useHistoryStore } from "@/lib/store/history-store";
import { examples } from "@/lib/constants/examples";

export default function JSMinifierPage() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [activeTab, setActiveTab] = useState<"minify" | "beautify">("minify");
  const addHistory = useHistoryStore((state) => state.addHistory);

  const handleExample = () => {
    const example = examples["js-minifier"];
    if (example && typeof example === "string") {
      setInput(example);
    }
  };

  const handleMinify = () => {
    if (!input.trim()) return;
    
    try {
      const minified = minifyJS(input);
      setOutput(minified);
      
      addHistory({
        tool: "js-minifier",
        input,
        output: minified,
      });
    } catch (error) {
      console.error("Minification failed:", error);
    }
  };

  const handleBeautify = () => {
    if (!input.trim()) return;
    
    try {
      const beautified = beautifyJS(input);
      setOutput(beautified);
      
      addHistory({
        tool: "js-minifier",
        input,
        output: beautified,
      });
    } catch (error) {
      console.error("Beautification failed:", error);
    }
  };

  const handleClear = () => {
    setInput("");
    setOutput("");
  };

  return (
    <div className="h-screen flex flex-col">
      <ToolHeader
        title="JavaScript Minifier"
        description="Minify and beautify JavaScript code"
        icon={FileCode}
      />

      <div className="flex-1 p-3 sm:p-4 md:p-6 space-y-3 sm:space-y-4 md:space-y-6 overflow-auto pb-20 sm:pb-24">
        <div className="mb-3 sm:mb-4 md:mb-6">
          <HowToUse
            steps={[
              "Select Minify or Beautify tab",
              "Paste your JavaScript code in the input field",
              "Click Minify or Beautify button to process",
              "Copy the minified or beautified result",
            ]}
          />
        </div>
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "minify" | "beautify")}>
          <TabsList className="mb-3 sm:mb-4">
            <TabsTrigger value="minify" className="text-xs sm:text-sm">Minify</TabsTrigger>
            <TabsTrigger value="beautify" className="text-xs sm:text-sm">Beautify</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="space-y-3 sm:space-y-4 md:space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
              <Card className="flex flex-col overflow-hidden min-h-[400px] sm:min-h-[500px]">
                <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0 pb-3 p-4 sm:p-6 border-b">
                  <CardTitle className="text-base sm:text-lg font-semibold">Input</CardTitle>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={handleExample} className="text-xs sm:text-sm ">
                      Example
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="flex-1 overflow-hidden space-y-3 sm:space-y-4 p-4 sm:p-6">
                  <Textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Enter JavaScript code..."
                    className="min-h-[300px] sm:min-h-[400px] font-mono text-xs sm:text-sm resize-y"
                  />
                  <div className="flex flex-col sm:flex-row gap-2">
                    <Button
                      onClick={activeTab === "minify" ? handleMinify : handleBeautify}
                      disabled={!input.trim()}
                      className="w-full sm:w-auto min-h-[44px] text-sm sm:text-base"
                    >
                      {activeTab === "minify" ? "Minify" : "Beautify"}
                    </Button>
                    <Button variant="ghost" onClick={handleClear} className="w-full sm:w-auto min-h-[44px] text-sm sm:text-base">
                      Clear
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="flex flex-col overflow-hidden min-h-[400px] sm:min-h-[500px]">
                <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0 pb-3 p-4 sm:p-6 border-b">
                  <CardTitle className="text-base sm:text-lg font-semibold">Output</CardTitle>
                  {output && <CopyButton text={output} />}
                </CardHeader>
                <CardContent className="flex-1 overflow-hidden p-4 sm:p-6">
                  {output ? (
                    <CodeBlock code={output} language="javascript" />
                  ) : (
                    <EmptyState
                      icon={FileCode}
                      title="No output"
                      description={`Enter JavaScript code and click ${activeTab === "minify" ? "Minify" : "Beautify"}`}
                    />
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}






