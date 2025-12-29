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
import { minifyJS, beautifyJS } from "@/lib/utils/js-minifier";
import { useHistoryStore } from "@/lib/store/history-store";

export default function JSMinifierPage() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [activeTab, setActiveTab] = useState<"minify" | "beautify">("minify");
  const addHistory = useHistoryStore((state) => state.addHistory);

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

      <div className="flex-1 p-6 space-y-6 overflow-auto">
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "minify" | "beautify")}>
          <TabsList>
            <TabsTrigger value="minify">Minify</TabsTrigger>
            <TabsTrigger value="beautify">Beautify</TabsTrigger>
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
                    placeholder="Enter JavaScript code..."
                    className="min-h-[400px] font-mono"
                  />
                  <div className="flex gap-2">
                    <Button
                      onClick={activeTab === "minify" ? handleMinify : handleBeautify}
                      disabled={!input.trim()}
                    >
                      {activeTab === "minify" ? "Minify" : "Beautify"}
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




