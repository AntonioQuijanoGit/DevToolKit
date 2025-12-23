"use client";

import { useState } from "react";
import { Code } from "lucide-react";
import { ToolHeader } from "@/components/layout/tool-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CopyButton } from "@/components/shared/copy-button";
import { EmptyState } from "@/components/shared/empty-state";
import { encodeBase64, decodeBase64, fileToBase64 } from "@/lib/utils/encoders";
import { examples } from "@/lib/constants/examples";
import { useHistoryStore } from "@/lib/store/history-store";

export default function Base64Page() {
  const [activeTab, setActiveTab] = useState<"encode" | "decode">("encode");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const addHistory = useHistoryStore((state) => state.addHistory);

  const handleEncode = () => {
    try {
      const encoded = encodeBase64(input);
      setOutput(encoded);
      setError(null);
      addHistory({
        tool: "base64",
        input,
        output: encoded,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Encoding failed");
      setOutput("");
    }
  };

  const handleDecode = () => {
    try {
      const decoded = decodeBase64(input);
      setOutput(decoded);
      setError(null);
      addHistory({
        tool: "base64",
        input,
        output: decoded,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Decoding failed");
      setOutput("");
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const base64 = await fileToBase64(file);
      setInput(base64);
      setOutput(base64);
      setError(null);
    } catch (err) {
      setError("Failed to read file");
      setOutput("");
    }
  };

  const handleClear = () => {
    setInput("");
    setOutput("");
    setError(null);
  };

  const handleExample = () => {
    setInput(examples.base64);
  };

  return (
    <div className="h-screen flex flex-col">
      <ToolHeader
        title="Base64 Encoder/Decoder"
        description="Encode and decode Base64 strings"
        icon={Code}
      />

      <div className="flex-1 p-6">
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "encode" | "decode")} className="h-full flex flex-col">
          <TabsList className="mb-4">
            <TabsTrigger value="encode">Encode</TabsTrigger>
            <TabsTrigger value="decode">Decode</TabsTrigger>
          </TabsList>

          <div className="flex-1 grid grid-cols-2 gap-4 overflow-hidden">
            {/* Input Panel */}
            <Card className="flex flex-col overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between pb-3">
                <CardTitle>Input</CardTitle>
                <div className="flex gap-2">
                  {activeTab === "encode" && (
                    <label className="cursor-pointer">
                      <Button variant="outline" size="sm" asChild>
                        <span>Upload</span>
                      </Button>
                      <input
                        type="file"
                        className="hidden"
                        onChange={handleFileUpload}
                      />
                    </label>
                  )}
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
                  placeholder={
                    activeTab === "encode"
                      ? "Enter text to encode or upload a file..."
                      : "Enter Base64 string to decode..."
                  }
                  className="h-full font-mono text-sm resize-none"
                />
              </CardContent>
            </Card>

            {/* Output Panel */}
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
                  <div className="h-full overflow-auto p-4">
                    <pre className="text-sm font-mono whitespace-pre-wrap break-words">
                      {output}
                    </pre>
                  </div>
                ) : (
                  <EmptyState
                    icon={Code}
                    title="No output"
                    description={
                      activeTab === "encode"
                        ? "Enter text or upload a file to encode"
                        : "Enter a Base64 string to decode"
                    }
                  />
                )}
              </CardContent>
            </Card>
          </div>
        </Tabs>
      </div>

      {/* Action Bar */}
      <div className="border-t border-border p-4 flex justify-center gap-3">
        <Button
          onClick={activeTab === "encode" ? handleEncode : handleDecode}
          size="lg"
        >
          {activeTab === "encode" ? "Encode" : "Decode"}
        </Button>
      </div>
    </div>
  );
}

