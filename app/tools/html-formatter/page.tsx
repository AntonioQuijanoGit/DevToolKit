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

export default function HTMLFormatterPage() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"minify" | "beautify" | "validate">("beautify");
  const addHistory = useHistoryStore((state) => state.addHistory);

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

      <div className="flex-1 p-6 space-y-6 overflow-auto">
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "minify" | "beautify" | "validate")}>
          <TabsList>
            <TabsTrigger value="beautify">Beautify</TabsTrigger>
            <TabsTrigger value="minify">Minify</TabsTrigger>
            <TabsTrigger value="validate">Validate</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="flex flex-col overflow-hidden">
                <CardHeader className="flex flex-row items-center justify-between pb-3">
                  <CardTitle>Input</CardTitle>
                </CardHeader>
                <CardContent className="flex-1 overflow-hidden space-y-4">
                  <Textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="<html>...</html>"
                    className="min-h-[400px] font-mono"
                  />
                  <div className="flex gap-2">
                    <Button
                      onClick={
                        activeTab === "minify"
                          ? handleMinify
                          : activeTab === "beautify"
                          ? handleBeautify
                          : handleValidate
                      }
                      disabled={!input.trim()}
                    >
                      {activeTab === "minify"
                        ? "Minify"
                        : activeTab === "beautify"
                        ? "Beautify"
                        : "Validate"}
                    </Button>
                    <Button variant="ghost" onClick={handleClear}>
                      Clear
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="flex flex-col overflow-hidden">
                <CardHeader className="flex flex-row items-center justify-between pb-3">
                  <CardTitle>Output</CardTitle>
                  {output && <CopyButton text={output} />}
                </CardHeader>
                <CardContent className="flex-1 overflow-hidden">
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




