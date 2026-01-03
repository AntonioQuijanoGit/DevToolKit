"use client";

import { useState, useEffect } from "react";
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
import { Skeleton } from "@/components/shared/skeleton-loader";
import { formatJSON, minifyJSON, validateJSON } from "@/lib/utils/formatters";
import { examples } from "@/lib/constants/examples";
import { useHistoryStore } from "@/lib/store/history-store";
import { useToast } from "@/lib/hooks/use-toast";
import { Loader2 } from "lucide-react";

export default function JSONFormatterPage() {
  // Scroll to top and focus on main content when component mounts
  useEffect(() => {
    const mainContent = document.getElementById("main-content");
    if (mainContent) {
      mainContent.focus();
      mainContent.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, []);
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
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

  const handleFormat = async () => {
    if (!input.trim()) {
      toast({
        title: "Input required",
        description: "Please enter some JSON to format",
        variant: "default",
      });
      return;
    }
    
    setIsProcessing(true);
    setError(null);
    
    // Simulate processing for better UX
    await new Promise(resolve => setTimeout(resolve, 150));
    
    const result = formatJSON(input);
    if (result.success && result.result) {
      setOutput(result.result);
      setError(null);
      addHistory({
        tool: "json-formatter",
        input,
        output: result.result,
      });
      toast({
        title: "Formatted successfully",
        description: "JSON has been formatted",
        variant: "success",
      });
    } else {
      setError(result.error || "Unknown error");
      setOutput("");
      toast({
        title: "Formatting failed",
        description: result.error || "Invalid JSON",
        variant: "destructive",
      });
    }
    setIsProcessing(false);
  };

  const handleMinify = async () => {
    if (!input.trim()) {
      toast({
        title: "Input required",
        description: "Please enter some JSON to minify",
        variant: "default",
      });
      return;
    }
    
    setIsProcessing(true);
    setError(null);
    
    await new Promise(resolve => setTimeout(resolve, 150));
    
    const result = minifyJSON(input);
    if (result.success && result.result) {
      setOutput(result.result);
      setError(null);
      addHistory({
        tool: "json-formatter",
        input,
        output: result.result,
      });
      toast({
        title: "Minified successfully",
        description: "JSON has been minified",
        variant: "success",
      });
    } else {
      setError(result.error || "Unknown error");
      setOutput("");
      toast({
        title: "Minification failed",
        description: result.error || "Invalid JSON",
        variant: "destructive",
      });
    }
    setIsProcessing(false);
  };

  const handleValidate = async () => {
    if (!input.trim()) {
      toast({
        title: "Input required",
        description: "Please enter some JSON to validate",
        variant: "default",
      });
      return;
    }
    
    setIsProcessing(true);
    setError(null);
    
    await new Promise(resolve => setTimeout(resolve, 150));
    
    const result = validateJSON(input);
    if (result.success) {
      setError(null);
      setOutput("✓ Valid JSON");
      toast({
        title: "Validation successful",
        description: "JSON is valid",
        variant: "success",
      });
    } else {
      setError(result.error || "Unknown error");
      setOutput("");
      toast({
        title: "Validation failed",
        description: result.error || "Invalid JSON",
        variant: "destructive",
      });
    }
    setIsProcessing(false);
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
    <div className="min-h-screen flex flex-col">
      <ToolHeader
        title="JSON Formatter"
        description="Format, validate and beautify JSON data. Paste your JSON in the input area, then click Format, Minify, or Validate to process it."
        icon={FileJson}
        category="Formatter"
      />

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5 md:gap-6 p-4 sm:p-5 md:p-6 pb-28 sm:pb-32">
        {/* Input Panel */}
        <Card className="flex flex-col min-h-[400px] sm:min-h-[500px]">
          <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0 pb-3 p-4 sm:p-6 border-b">
            <CardTitle className="text-base sm:text-lg font-semibold">Input</CardTitle>
            <div className="flex gap-2 flex-wrap">
              <HistoryDropdown
                toolId="json-formatter"
                onSelect={(input, output) => {
                  setInput(input);
                  setOutput(output);
                }}
              />
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleExample} 
                className="text-xs sm:text-sm"
                aria-label="Load example JSON"
              >
                Example
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleClear} 
                className="text-xs sm:text-sm"
                aria-label="Clear input and output"
              >
                Clear
              </Button>
            </div>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col gap-3 p-4 sm:p-6">
            <DragDropZone
              onFileAccepted={handleFileDrop}
              accept={{ "application/json": [".json"], "text/*": [".txt"] }}
              className="flex-shrink-0"
            />
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Paste your JSON here or drag & drop a file..."
              className="flex-1 min-h-[200px] font-mono text-xs sm:text-sm resize-y"
              aria-label="JSON input"
            />
          </CardContent>
        </Card>

        {/* Output Panel */}
        <Card className="flex flex-col min-h-[400px] sm:min-h-[500px]">
          <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0 pb-3 p-4 sm:p-6 border-b">
            <CardTitle className="text-base sm:text-lg font-semibold">Output</CardTitle>
            <div className="flex gap-2">
              {output && <DownloadButton content={output} filename="formatted.json" mimeType="application/json" />}
              {output && <CopyButton text={output} />}
            </div>
          </CardHeader>
          <CardContent className="flex-1 p-4 sm:p-6 overflow-y-auto">
            {isProcessing ? (
              <div className="flex flex-col items-center justify-center h-full gap-4">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="text-sm text-muted-foreground">Processing...</p>
              </div>
            ) : error ? (
              <ErrorDisplay error={error} variant="inline" />
            ) : output ? (
              <CodeBlock code={output} language="json" />
            ) : (
              <EmptyState
                icon={FileJson}
                title="No output yet"
                description="Format, minify, or validate your JSON to see results here"
                action={{
                  label: "Load Example",
                  onClick: handleExample,
                  variant: "outline"
                }}
                tips={[
                  "Paste your JSON in the input area",
                  "Click 'Format' to beautify your JSON",
                  "Click 'Minify' to compress it",
                  "Click 'Validate' to check for errors"
                ]}
              />
            )}
          </CardContent>
        </Card>
      </div>

      {/* Action Bar - Fixed at bottom */}
      <div className="sticky bottom-0 left-0 right-0 border-t border-border bg-card/95 backdrop-blur-sm p-3 sm:p-4 md:p-5 z-10 shadow-lg">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-center gap-2 sm:gap-3">
          <Button 
            onClick={handleFormat} 
            size="lg" 
            className="w-full sm:w-auto min-h-[44px] text-sm sm:text-base"
            aria-label="Format JSON"
            disabled={isProcessing || !input.trim()}
          >
            {isProcessing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              "Format"
            )}
          </Button>
          <Button 
            variant="secondary" 
            onClick={handleMinify} 
            size="lg" 
            className="w-full sm:w-auto min-h-[44px] text-sm sm:text-base"
            aria-label="Minify JSON"
            disabled={isProcessing || !input.trim()}
          >
            {isProcessing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              "Minify"
            )}
          </Button>
          <Button 
            variant="outline" 
            onClick={handleValidate} 
            size="lg" 
            className="w-full sm:w-auto min-h-[44px] text-sm sm:text-base"
            aria-label="Validate JSON"
            disabled={isProcessing || !input.trim()}
          >
            {isProcessing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              "Validate"
            )}
          </Button>
        </div>
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

