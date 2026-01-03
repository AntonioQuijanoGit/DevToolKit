"use client";

import { useState } from "react";
import { FileText } from "lucide-react";
import { ToolHeader } from "@/components/layout/tool-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { CodeBlock } from "@/components/shared/code-block";
import { CopyButton } from "@/components/shared/copy-button";
import { EmptyState } from "@/components/shared/empty-state";

const formatYAML = (yaml: string): { success: boolean; result?: string; error?: string } => {
  try {
    if (!yaml.trim()) {
      return { success: false, error: "Input is empty" };
    }
    
    // Basic YAML formatting - indent properly
    const lines = yaml.split("\n");
    let indent = 0;
    const formatted: string[] = [];
    
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) {
        formatted.push(trimmed);
        continue;
      }
      
      if (trimmed.endsWith(":") || trimmed.match(/^-\s/)) {
        formatted.push("  ".repeat(indent) + trimmed);
        indent++;
      } else if (trimmed.match(/^[a-zA-Z]/) && !trimmed.includes(":")) {
        indent = Math.max(0, indent - 1);
        formatted.push("  ".repeat(indent) + trimmed);
      } else {
        formatted.push("  ".repeat(indent) + trimmed);
      }
    }
    
    return { success: true, result: formatted.join("\n") };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Invalid YAML",
    };
  }
};

export default function YAMLFormatterPage() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleFormat = () => {
    const result = formatYAML(input);
    if (result.success && result.result) {
      setOutput(result.result);
      setError(null);
    } else {
      setError(result.error || "Formatting failed");
      setOutput("");
    }
  };

  const handleClear = () => {
    setInput("");
    setOutput("");
    setError(null);
  };

  const handleExample = () => {
    setInput(`name: DevToolkit
version: 1.0.0
tools:
  - json-formatter
  - base64
features:
  darkMode: true
  offline: true`);
  };

  return (
    <div className="h-screen flex flex-col">
      <ToolHeader
        title="YAML Formatter"
        description="Format and validate YAML files"
        icon={FileText}
      />

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 p-3 sm:p-4 md:p-6 overflow-auto pb-20 sm:pb-24">
        <Card className="flex flex-col overflow-hidden min-h-[400px] sm:min-h-[500px]">
          <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0 pb-3 p-4 sm:p-6 border-b">
            <CardTitle className="text-base sm:text-lg font-semibold">Input</CardTitle>
            <div className="flex gap-2 flex-wrap">
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
              placeholder="Paste your YAML here..."
              className="h-full font-mono text-xs sm:text-sm resize-none min-h-[200px]"
            />
          </CardContent>
        </Card>

        <Card className="flex flex-col overflow-hidden min-h-[400px] sm:min-h-[500px]">
          <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0 pb-3 p-4 sm:p-6 border-b">
            <CardTitle className="text-base sm:text-lg font-semibold">Output</CardTitle>
            {output && <CopyButton text={output} />}
          </CardHeader>
          <CardContent className="flex-1 overflow-hidden p-4 sm:p-6">
            {error ? (
              <div className="h-full flex items-center justify-center">
                <div className="text-center px-4">
                  <p className="text-destructive font-semibold mb-2 text-sm sm:text-base">Error</p>
                  <p className="text-xs sm:text-sm text-muted-foreground">{error}</p>
                </div>
              </div>
            ) : output ? (
              <CodeBlock code={output} language="yaml" />
            ) : (
              <EmptyState
                icon={FileText}
                title="No output"
                description="Format your YAML to see results"
              />
            )}
          </CardContent>
        </Card>
      </div>

      <div className="sticky bottom-0 left-0 right-0 border-t border-border bg-card/95 backdrop-blur-sm p-3 sm:p-4 md:p-5 z-10 shadow-lg">
        <div className="max-w-7xl mx-auto flex justify-center">
          <Button onClick={handleFormat} size="lg" disabled={!input.trim()} className="w-full sm:w-auto min-h-[44px] text-sm sm:text-base">
            Format YAML
          </Button>
        </div>
      </div>
    </div>
  );
}

