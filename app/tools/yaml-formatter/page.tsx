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

      <div className="flex-1 grid grid-cols-2 gap-4 p-6 overflow-hidden">
        <Card className="flex flex-col overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle>Input</CardTitle>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleExample}>
                Example
              </Button>
              <Button variant="ghost" size="sm" onClick={handleClear}>
                Clear
              </Button>
            </div>
          </CardHeader>
          <CardContent className="flex-1 overflow-hidden">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Paste your YAML here..."
              className="h-full font-mono text-sm resize-none"
            />
          </CardContent>
        </Card>

        <Card className="flex flex-col overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle>Output</CardTitle>
            {output && <CopyButton text={output} />}
          </CardHeader>
          <CardContent className="flex-1 overflow-hidden">
            {error ? (
              <div className="h-full flex items-center justify-center">
                <div className="text-center">
                  <p className="text-destructive font-semibold mb-2">Error</p>
                  <p className="text-sm text-muted-foreground">{error}</p>
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

      <div className="border-t border-border p-4 flex justify-center gap-3">
        <Button onClick={handleFormat} size="lg" disabled={!input.trim()}>
          Format YAML
        </Button>
      </div>
    </div>
  );
}

