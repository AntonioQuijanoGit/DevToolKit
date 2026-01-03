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
import { encode, decode } from "html-entities";
import { examples } from "@/lib/constants/examples";

export default function HTMLEncoderPage() {
  const [activeTab, setActiveTab] = useState<"encode" | "decode">("encode");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");

  const handleExample = () => {
    const example = examples["html-encoder"];
    if (example && typeof example === "object") {
      if (activeTab === "encode") {
        setInput(example.encode || "");
      } else {
        setInput(example.decode || "");
      }
    }
  };

  const handleEncode = () => {
    try {
      const encoded = encode(input, { level: "html5" });
      setOutput(encoded);
    } catch (err) {
      setOutput("Encoding failed");
    }
  };

  const handleDecode = () => {
    try {
      const decoded = decode(input);
      setOutput(decoded);
    } catch (err) {
      setOutput("Decoding failed");
    }
  };

  const handleClear = () => {
    setInput("");
    setOutput("");
  };

  return (
    <div className="h-screen flex flex-col">
      <ToolHeader
        title="HTML Entity Encoder"
        description="Encode and decode HTML entities"
        icon={Code}
      />

      <div className="flex-1 p-3 sm:p-4 md:p-6">
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "encode" | "decode")} className="h-full flex flex-col">
          <TabsList className="mb-3 sm:mb-4">
            <TabsTrigger value="encode">Encode</TabsTrigger>
            <TabsTrigger value="decode">Decode</TabsTrigger>
          </TabsList>

          <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 overflow-hidden">
            <Card className="flex flex-col overflow-hidden min-h-[300px] sm:min-h-[400px]">
              <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0 pb-3 p-4 sm:p-6 border-b">
                <CardTitle className="text-base sm:text-lg font-semibold">Input</CardTitle>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={handleExample} className="text-xs sm:text-sm min-h-[36px]">
                    Example
                  </Button>
                  <Button variant="ghost" size="sm" onClick={handleClear} className="text-xs sm:text-sm min-h-[36px]">
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
                      ? "Enter text to encode..."
                      : "Enter HTML entities to decode..."
                  }
                  className="h-full font-mono text-xs sm:text-sm resize-none min-h-[200px]"
                />
              </CardContent>
            </Card>

            <Card className="flex flex-col overflow-hidden min-h-[300px] sm:min-h-[400px]">
              <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0 pb-3 p-4 sm:p-6 border-b">
                <CardTitle className="text-base sm:text-lg font-semibold">Output</CardTitle>
                {output && <CopyButton text={output} />}
              </CardHeader>
              <CardContent className="flex-1 overflow-hidden p-4 sm:p-6">
                {output ? (
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
                        ? "Enter text and click Encode"
                        : "Enter HTML entities and click Decode"
                    }
                  />
                )}
              </CardContent>
            </Card>
          </div>
        </Tabs>
      </div>

      <div className="sticky bottom-0 left-0 right-0 border-t border-border bg-card/95 backdrop-blur-sm p-3 sm:p-4 md:p-5 z-10 shadow-lg">
        <div className="max-w-7xl mx-auto flex justify-center">
          <Button
            onClick={activeTab === "encode" ? handleEncode : handleDecode}
            size="lg"
            disabled={!input.trim()}
            className="w-full sm:w-auto min-w-[120px] min-h-[44px] text-sm sm:text-base"
          >
            {activeTab === "encode" ? "Encode" : "Decode"}
          </Button>
        </div>
      </div>
    </div>
  );
}






