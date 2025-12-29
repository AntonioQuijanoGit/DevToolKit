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

export default function HTMLEncoderPage() {
  const [activeTab, setActiveTab] = useState<"encode" | "decode">("encode");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");

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

      <div className="flex-1 p-6">
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "encode" | "decode")} className="h-full flex flex-col">
          <TabsList className="mb-4">
            <TabsTrigger value="encode">Encode</TabsTrigger>
            <TabsTrigger value="decode">Decode</TabsTrigger>
          </TabsList>

          <div className="flex-1 grid grid-cols-2 gap-4 overflow-hidden">
            <Card className="flex flex-col overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between pb-3">
                <CardTitle>Input</CardTitle>
                <Button variant="ghost" size="sm" onClick={handleClear}>
                  Clear
                </Button>
              </CardHeader>
              <CardContent className="flex-1 overflow-hidden">
                <Textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={
                    activeTab === "encode"
                      ? "Enter text to encode..."
                      : "Enter HTML entities to decode..."
                  }
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
                {output ? (
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

      <div className="border-t border-border p-4 flex justify-center gap-3">
        <Button
          onClick={activeTab === "encode" ? handleEncode : handleDecode}
          size="lg"
          disabled={!input.trim()}
        >
          {activeTab === "encode" ? "Encode" : "Decode"}
        </Button>
      </div>
    </div>
  );
}




