"use client";

import { useState } from "react";
import { FileCode2 } from "lucide-react";
import { ToolHeader } from "@/components/layout/tool-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CopyButton } from "@/components/shared/copy-button";
import { CodeBlock } from "@/components/shared/code-block";
import { EmptyState } from "@/components/shared/empty-state";
import { ErrorDisplay } from "@/components/shared/error-display";
import { minifyHTML, beautifyHTML, validateHTML } from "@/lib/utils/html-formatter";
import { useHistoryStore } from "@/lib/store/history-store";
import { examples } from "@/lib/constants/examples";

export default function HTMLFormatterPage() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"minify" | "beautify" | "validate">("beautify");
  const addHistory = useHistoryStore((state) => state.addHistory);

  const handleExample = () => {
    const example = examples["html-formatter"];
    if (example && typeof example === "string") {
      setInput(example);
    }
  };

  const handleMinify = () => {
    if (!input.trim()) return;
    
    try {
      const minified = minifyHTML(input);
      setOutput(minified);
      setError(null);
      
      addHistory({
        tool: "html-formatter",
        input,
        output: minified,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Minification failed");
    }
  };

  const handleBeautify = () => {
    if (!input.trim()) return;
    
    try {
      const beautified = beautifyHTML(input);
      setOutput(beautified);
      setError(null);
      
      addHistory({
        tool: "html-formatter",
        input,
        output: beautified,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Beautification failed");
    }
  };

  const handleValidate = () => {
    if (!input.trim()) return;
    
    try {
      const validation = validateHTML(input);
      if (validation.valid) {
        setOutput("✅ HTML is valid!");
        setError(null);
      } else {
        setError(validation.errors.join("\n"));
        setOutput("");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Validation failed");
    }
  };

  const handleClear = () => {
    setInput("");
    setOutput("");
    setError(null);
  };

  return (
    <div className="h-screen flex flex-col">
      <ToolHeader
        title="HTML Formatter"
        description="Format, validate and minify HTML"
        icon={FileCode2}
      />

      <div className="flex-1 p-3 sm:p-4 md:p-6 space-y-3 sm:space-y-4 md:space-y-6 overflow-auto pb-20 sm:pb-24">
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "minify" | "beautify" | "validate")}>
          <TabsList className="mb-3 sm:mb-4">
            <TabsTrigger value="beautify" className="text-xs sm:text-sm">Beautify</TabsTrigger>
            <TabsTrigger value="minify" className="text-xs sm:text-sm">Minify</TabsTrigger>
            <TabsTrigger value="validate" className="text-xs sm:text-sm">Validate</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="space-y-3 sm:space-y-4 md:space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
              <Card className="flex flex-col overflow-hidden min-h-[400px] sm:min-h-[500px]">
                <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0 pb-3 p-4 sm:p-6 border-b">
                  <CardTitle className="text-base sm:text-lg font-semibold">Input</CardTitle>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={handleExample} className="text-xs sm:text-sm min-h-[36px]">
                      Example
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="flex-1 overflow-hidden space-y-3 sm:space-y-4 p-4 sm:p-6">
                  <Textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="<html>...</html>"
                    className="min-h-[300px] sm:min-h-[400px] font-mono text-xs sm:text-sm resize-y"
                  />
                  <div className="flex flex-col sm:flex-row gap-2">
                    <Button
                      onClick={
                        activeTab === "minify"
                          ? handleMinify
                          : activeTab === "beautify"
                          ? handleBeautify
                          : handleValidate
                      }
                      disabled={!input.trim()}
                      className="w-full sm:w-auto min-h-[44px] text-sm sm:text-base"
                    >
                      {activeTab === "minify"
                        ? "Minify"
                        : activeTab === "beautify"
                        ? "Beautify"
                        : "Validate"}
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
                  {error ? (
                    <ErrorDisplay error={error} variant="inline" />
                  ) : output ? (
                    <CodeBlock code={output} language="html" />
                  ) : (
                    <EmptyState
                      icon={FileCode2}
                      title="No output"
                      description={`Enter HTML and click ${activeTab === "minify" ? "Minify" : activeTab === "beautify" ? "Beautify" : "Validate"}`}
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






