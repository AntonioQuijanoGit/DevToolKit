"use client";

import { useState } from "react";
import { FileJson } from "lucide-react";
import { ToolHeader } from "@/components/layout/tool-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { CodeBlock } from "@/components/shared/code-block";
import { CopyButton } from "@/components/shared/copy-button";
import { EmptyState } from "@/components/shared/empty-state";
import { ErrorDisplay } from "@/components/shared/error-display";
import { HistoryDropdown } from "@/components/shared/history-dropdown";
import { DragDropZone } from "@/components/shared/drag-drop-zone";
import { KeyboardShortcuts } from "@/components/shared/keyboard-shortcuts";
import { DownloadButton } from "@/components/shared/download-button";
import { formatJSON, minifyJSON, validateJSON } from "@/lib/utils/formatters";
import { examples } from "@/lib/constants/examples";
import { useHistoryStore } from "@/lib/store/history-store";
import { useToast } from "@/lib/hooks/use-toast";

export default function JSONFormatterPage() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const addHistory = useHistoryStore((state) => state.addHistory);
  const { toast } = useToast();

  const handleFileDrop = async (file: File) => {
    try {
      const text = await file.text();
      setInput(text);
      toast({
        title: "File loaded",
        description: `${file.name} loaded successfully`,
        variant: "success",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to read file",
        variant: "destructive",
      });
    }
  };

  const handleFormat = () => {
    const result = formatJSON(input);
    if (result.success && result.result) {
      setOutput(result.result);
      setError(null);
      addHistory({
        tool: "json-formatter",
        input,
        output: result.result,
      });
    } else {
      setError(result.error || "Unknown error");
      setOutput("");
    }
  };

  const handleMinify = () => {
    const result = minifyJSON(input);
    if (result.success && result.result) {
      setOutput(result.result);
      setError(null);
      addHistory({
        tool: "json-formatter",
        input,
        output: result.result,
      });
    } else {
      setError(result.error || "Unknown error");
      setOutput("");
    }
  };

  const handleValidate = () => {
    const result = validateJSON(input);
    if (result.success) {
      setError(null);
      setOutput("✓ Valid JSON");
    } else {
      setError(result.error || "Unknown error");
      setOutput("");
    }
  };

  const handleClear = () => {
    setInput("");
    setOutput("");
    setError(null);
  };

  const handleExample = () => {
    setInput(examples["json-formatter"]);
  };

  return (
    <div className="h-screen flex flex-col">
      <ToolHeader
        title="JSON Formatter"
        description="Format, validate and beautify JSON data"
        icon={FileJson}
      />

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 p-3 sm:p-4 md:p-6 overflow-hidden">
        {/* Input Panel */}
        <Card className="flex flex-col overflow-hidden">
          <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0 pb-3 p-4 sm:p-6">
            <CardTitle className="text-base sm:text-lg">Input</CardTitle>
            <div className="flex gap-2 flex-wrap">
              <HistoryDropdown
                toolId="json-formatter"
                onSelect={(input, output) => {
                  setInput(input);
                  setOutput(output);
                }}
              />
              <Button variant="outline" size="sm" onClick={handleExample} className="text-xs sm:text-sm">
                Example
              </Button>
              <Button variant="ghost" size="sm" onClick={handleClear} className="text-xs sm:text-sm">
                Clear
              </Button>
            </div>
          </CardHeader>
          <CardContent className="flex-1 overflow-hidden flex flex-col gap-2 p-4 sm:p-6">
            <DragDropZone
              onFileAccepted={handleFileDrop}
              accept={{ "application/json": [".json"], "text/*": [".txt"] }}
              className="flex-shrink-0"
            />
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Paste your JSON here or drag & drop a file..."
              className="flex-1 font-mono text-xs sm:text-sm resize-none"
            />
          </CardContent>
        </Card>

        {/* Output Panel */}
        <Card className="flex flex-col overflow-hidden">
          <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0 pb-3 p-4 sm:p-6">
            <CardTitle className="text-base sm:text-lg">Output</CardTitle>
            <div className="flex gap-2">
              {output && <DownloadButton content={output} filename="formatted.json" mimeType="application/json" />}
              {output && <CopyButton text={output} />}
            </div>
          </CardHeader>
          <CardContent className="flex-1 overflow-hidden p-4 sm:p-6">
            {error ? (
              <ErrorDisplay error={error} variant="inline" />
            ) : output ? (
              <CodeBlock code={output} language="json" />
            ) : (
              <EmptyState
                icon={FileJson}
                title="No output"
                description="Format, minify, or validate your JSON to see results"
              />
            )}
          </CardContent>
        </Card>
      </div>

      {/* Action Bar */}
      <div className="border-t border-border p-3 sm:p-4 flex flex-col sm:flex-row justify-center gap-2 sm:gap-3">
        <Button onClick={handleFormat} size="lg" className="w-full sm:w-auto">
          Format
        </Button>
        <Button variant="secondary" onClick={handleMinify} size="lg" className="w-full sm:w-auto">
          Minify
        </Button>
        <Button variant="outline" onClick={handleValidate} size="lg" className="w-full sm:w-auto">
          Validate
        </Button>
      </div>

      <KeyboardShortcuts
        shortcuts={[
          { keys: ["Cmd/Ctrl", "Enter"], description: "Format JSON" },
          { keys: ["Cmd/Ctrl", "C"], description: "Copy output" },
          { keys: ["Cmd/Ctrl", "L"], description: "Clear all" },
          { keys: ["Esc"], description: "Close modals" },
        ]}
      />
    </div>
  );
}

