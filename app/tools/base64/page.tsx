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
import { HowToUse } from "@/components/shared/how-to-use";
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

      <div className="flex-1 p-3 sm:p-4 md:p-6">
        <div className="mb-3 sm:mb-4 md:mb-6">
          <HowToUse
            steps={[
              "Select Encode or Decode tab depending on your needs",
              "Enter text to encode or Base64 string to decode",
              "For encoding, you can also upload a file directly",
              "Click Encode/Decode button and copy the result",
            ]}
          />
        </div>
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "encode" | "decode")} className="h-full flex flex-col">
          <TabsList className="mb-3 sm:mb-4">
            <TabsTrigger value="encode">Encode</TabsTrigger>
            <TabsTrigger value="decode">Decode</TabsTrigger>
          </TabsList>

          <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 overflow-hidden">
            {/* Input Panel */}
            <Card className="flex flex-col overflow-hidden min-h-[300px] sm:min-h-[400px]">
              <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0 pb-3 p-4 sm:p-6 border-b">
                <CardTitle className="text-base sm:text-lg font-semibold">Input</CardTitle>
                <div className="flex gap-2 flex-wrap">
                  {activeTab === "encode" && (
                    <label className="cursor-pointer">
                      <Button variant="outline" size="sm" asChild className="text-xs sm:text-sm">
                        <span>Upload</span>
                      </Button>
                      <input
                        type="file"
                        className="hidden"
                        onChange={handleFileUpload}
                      />
                    </label>
                  )}
                  <Button variant="outline" size="sm" onClick={handleExample} className="text-xs sm:text-sm">
                    Example
                  </Button>
                  <Button variant="ghost" size="sm" onClick={handleClear} className="text-xs sm:text-sm">
                    Clear
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="flex-1 overflow-hidden p-4 sm:p-6">
                <Textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={
                    activeTab === "encode"
                      ? "Enter text to encode or upload a file..."
                      : "Enter Base64 string to decode..."
                  }
                  className="h-full font-mono text-xs sm:text-sm resize-none min-h-[200px]"
                />
              </CardContent>
            </Card>

            {/* Output Panel */}
            <Card className="flex flex-col overflow-hidden min-h-[300px] sm:min-h-[400px]">
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
                  <div className="h-full overflow-auto">
                    <pre className="text-xs sm:text-sm font-mono whitespace-pre-wrap break-words">
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
      <div className="sticky bottom-0 left-0 right-0 border-t border-border bg-card/95 backdrop-blur-sm p-3 sm:p-4 md:p-5 z-10 shadow-lg">
        <div className="max-w-7xl mx-auto flex justify-center">
          <Button
            onClick={activeTab === "encode" ? handleEncode : handleDecode}
            size="lg"
            className="w-full sm:w-auto min-w-[120px] min-h-[44px] text-sm sm:text-base"
          >
            {activeTab === "encode" ? "Encode" : "Decode"}
          </Button>
        </div>
      </div>
    </div>
  );
}






