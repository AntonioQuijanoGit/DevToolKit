"use client";

import { useState } from "react";
import { FileCode2 } from "lucide-react";
import { ToolHeader } from "@/components/layout/tool-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { CodeBlock } from "@/components/shared/code-block";
import { CopyButton } from "@/components/shared/copy-button";
import { EmptyState } from "@/components/shared/empty-state";

const formatXML = (xml: string): { success: boolean; result?: string; error?: string } => {
  try {
    if (!xml.trim()) {
      return { success: false, error: "Input is empty" };
    }

    let formatted = "";
    let indent = 0;
    const tab = "  ";

    xml = xml.replace(/>\s*</g, "><");

    for (let i = 0; i < xml.length; i++) {
      const char = xml[i];
      const nextChar = xml[i + 1];

      if (char === "<" && nextChar === "/") {
        formatted += "\n" + tab.repeat(--indent) + char;
      } else if (char === "<") {
        formatted += (i > 0 ? "\n" : "") + tab.repeat(indent++) + char;
      } else if (char === ">") {
        formatted += char;
      } else {
        formatted += char;
      }
    }

    return { success: true, result: formatted.trim() };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Invalid XML",
    };
  }
};

export default function XMLFormatterPage() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleFormat = () => {
    const result = formatXML(input);
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
    setInput(`<root><name>DevToolkit</name><version>1.0.0</version><tools><tool>json-formatter</tool></tools></root>`);
  };

  return (
    <div className="h-screen flex flex-col">
      <ToolHeader
        title="XML Formatter"
        description="Format and validate XML documents"
        icon={FileCode2}
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
              placeholder="Paste your XML here..."
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
              <CodeBlock code={output} language="xml" />
            ) : (
              <EmptyState
                icon={FileCode2}
                title="No output"
                description="Format your XML to see results"
              />
            )}
          </CardContent>
        </Card>
      </div>

      <div className="border-t border-border p-4 flex justify-center gap-3">
        <Button onClick={handleFormat} size="lg" disabled={!input.trim()}>
          Format XML
        </Button>
      </div>
    </div>
  );
}



