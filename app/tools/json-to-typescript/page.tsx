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
import { examples } from "@/lib/constants/examples";

export default function JSONToTypeScriptPage() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [interfaceName, setInterfaceName] = useState("Root");
  const [error, setError] = useState<string | null>(null);
  const addHistory = useHistoryStore((state) => state.addHistory);

  const handleExample = () => {
    const example = examples["json-to-typescript"];
    if (example && typeof example === "string") {
      setInput(example);
    }
  };

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

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 md:gap-6 p-3 sm:p-4 md:p-6 overflow-auto pb-20 sm:pb-24">
        <Card className="flex flex-col overflow-hidden min-h-[400px] sm:min-h-[500px]">
          <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0 pb-3 p-4 sm:p-6 border-b">
            <CardTitle className="text-base sm:text-lg font-semibold">JSON Input</CardTitle>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleExample} className="text-xs sm:text-sm min-h-[36px]">
                Example
              </Button>
            </div>
          </CardHeader>
          <CardContent className="flex-1 overflow-hidden space-y-3 sm:space-y-4 p-4 sm:p-6">
            <Input
              value={interfaceName}
              onChange={(e) => setInterfaceName(e.target.value)}
              placeholder="Interface name (e.g., User, Product)"
              className="font-mono min-h-[44px] text-sm sm:text-base"
            />
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder='{"name": "John", "age": 30}'
              className="min-h-[300px] sm:min-h-[400px] font-mono text-xs sm:text-sm resize-y"
            />
            <div className="flex flex-col sm:flex-row gap-2">
              <Button onClick={handleConvert} disabled={!input.trim()} className="w-full sm:w-auto min-h-[44px] text-sm sm:text-base">
                Convert
              </Button>
              <Button variant="ghost" onClick={handleClear} className="w-full sm:w-auto min-h-[44px] text-sm sm:text-base">
                Clear
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="flex flex-col overflow-hidden min-h-[400px] sm:min-h-[500px]">
          <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0 pb-3 p-4 sm:p-6 border-b">
            <CardTitle className="text-base sm:text-lg font-semibold">TypeScript Output</CardTitle>
            {output && <CopyButton text={output} />}
          </CardHeader>
          <CardContent className="flex-1 overflow-hidden p-4 sm:p-6">
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
  );
}






