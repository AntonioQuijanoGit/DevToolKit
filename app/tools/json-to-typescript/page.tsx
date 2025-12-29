"use client";

import { useState } from "react";
import { FileJson } from "lucide-react";
import { ToolHeader } from "@/components/layout/tool-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { CopyButton } from "@/components/shared/copy-button";
import { CodeBlock } from "@/components/shared/code-block";
import { EmptyState } from "@/components/shared/empty-state";
import { ErrorDisplay } from "@/components/shared/error-display";
import { jsonToTypeScript } from "@/lib/utils/json-to-ts";
import { useHistoryStore } from "@/lib/store/history-store";

export default function JSONToTypeScriptPage() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [interfaceName, setInterfaceName] = useState("Root");
  const [error, setError] = useState<string | null>(null);
  const addHistory = useHistoryStore((state) => state.addHistory);

  const handleConvert = () => {
    if (!input.trim()) return;
    
    try {
      const json = JSON.parse(input);
      const typescript = jsonToTypeScript(json, interfaceName);
      setOutput(typescript);
      setError(null);
      
      addHistory({
        tool: "json-to-typescript",
        input,
        output: typescript,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Invalid JSON");
      setOutput("");
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
        title="JSON to TypeScript"
        description="Convert JSON to TypeScript interfaces"
        icon={FileJson}
      />

      <div className="flex-1 p-6 space-y-6 overflow-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="flex flex-col overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <CardTitle>JSON Input</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 overflow-hidden space-y-4">
              <Input
                value={interfaceName}
                onChange={(e) => setInterfaceName(e.target.value)}
                placeholder="Interface name (e.g., User, Product)"
                className="font-mono"
              />
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder='{"name": "John", "age": 30}'
                className="min-h-[400px] font-mono"
              />
              <div className="flex gap-2">
                <Button onClick={handleConvert} disabled={!input.trim()}>
                  Convert
                </Button>
                <Button variant="ghost" onClick={handleClear}>
                  Clear
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="flex flex-col overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <CardTitle>TypeScript Output</CardTitle>
              {output && <CopyButton text={output} />}
            </CardHeader>
            <CardContent className="flex-1 overflow-hidden">
              {error ? (
                <ErrorDisplay error={error} variant="inline" />
              ) : output ? (
                <CodeBlock code={output} language="typescript" />
              ) : (
                <EmptyState
                  icon={FileJson}
                  title="No output"
                  description="Enter JSON and click Convert to generate TypeScript interfaces"
                />
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}




