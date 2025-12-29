"use client";

import { useState } from "react";
import { Hash, GitCompare } from "lucide-react";
import { ToolHeader } from "@/components/layout/tool-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CopyButton } from "@/components/shared/copy-button";
import { EmptyState } from "@/components/shared/empty-state";
import { HistoryDropdown } from "@/components/shared/history-dropdown";
import { Badge } from "@/components/ui/badge";
import { generateHash } from "@/lib/utils/generators";
import { examples } from "@/lib/constants/examples";
import { useHistoryStore } from "@/lib/store/history-store";

const algorithms = ["MD5", "SHA-1", "SHA-256", "SHA-512"] as const;

export default function HashGeneratorPage() {
  const [activeTab, setActiveTab] = useState<"generate" | "compare">("generate");
  const [input, setInput] = useState("");
  const [algorithm, setAlgorithm] = useState<typeof algorithms[number]>("SHA-256");
  const [output, setOutput] = useState("");
  const [compareInput1, setCompareInput1] = useState("");
  const [compareInput2, setCompareInput2] = useState("");
  const [compareHash1, setCompareHash1] = useState("");
  const [compareHash2, setCompareHash2] = useState("");
  const addHistory = useHistoryStore((state) => state.addHistory);

  const handleGenerate = () => {
    if (!input.trim()) return;
    try {
      const hash = generateHash(input, algorithm);
      setOutput(hash);
      addHistory({
        tool: "hash-generator",
        input,
        output: hash,
      });
    } catch (error) {
      console.error("Hash generation failed:", error);
    }
  };

  const handleClear = () => {
    setInput("");
    setOutput("");
  };

  const handleExample = () => {
    setInput(examples["hash-generator"]);
  };

  const handleCompare = () => {
    if (!compareInput1.trim() || !compareInput2.trim()) return;
    try {
      const hash1 = generateHash(compareInput1, algorithm);
      const hash2 = generateHash(compareInput2, algorithm);
      setCompareHash1(hash1);
      setCompareHash2(hash2);
    } catch (error) {
      console.error("Hash comparison failed:", error);
    }
  };

  const hashesMatch = compareHash1 && compareHash2 && compareHash1 === compareHash2;

  return (
    <div className="h-screen flex flex-col">
      <ToolHeader
        title="Hash Generator"
        description="Generate MD5, SHA-1, SHA-256, SHA-512 hashes"
        icon={Hash}
      />

      <div className="flex-1 p-3 sm:p-4 md:p-6">
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "generate" | "compare")} className="h-full flex flex-col">
          <TabsList className="mb-3 sm:mb-4">
            <TabsTrigger value="generate" className="text-xs sm:text-sm">Generate</TabsTrigger>
            <TabsTrigger value="compare" className="text-xs sm:text-sm">Compare</TabsTrigger>
          </TabsList>

          {activeTab === "generate" ? (
            <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 overflow-hidden">
              {/* Input Panel */}
              <Card className="flex flex-col overflow-hidden">
                <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0 pb-3 p-4 sm:p-6">
                  <CardTitle className="text-base sm:text-lg">Input</CardTitle>
                  <div className="flex gap-2 flex-wrap">
                    <HistoryDropdown
                      toolId="hash-generator"
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
                <CardContent className="flex-1 overflow-hidden space-y-4 p-4 sm:p-6">
                  <Select value={algorithm} onValueChange={(v) => setAlgorithm(v as typeof algorithms[number])}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {algorithms.map((alg) => (
                        <SelectItem key={alg} value={alg}>
                          {alg}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Enter text to hash..."
                    className="flex-1 font-mono text-xs sm:text-sm resize-none"
                  />
                </CardContent>
              </Card>

              {/* Output Panel */}
              <Card className="flex flex-col overflow-hidden">
                <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0 pb-3 p-4 sm:p-6">
                  <CardTitle className="text-base sm:text-lg">Hash ({algorithm})</CardTitle>
                  {output && <CopyButton text={output} />}
                </CardHeader>
                <CardContent className="flex-1 overflow-hidden p-4 sm:p-6">
                  {output ? (
                    <div className="h-full overflow-auto">
                      <pre className="text-xs sm:text-sm font-mono break-all">{output}</pre>
                    </div>
                  ) : (
                    <EmptyState
                      icon={Hash}
                      title="No hash generated"
                      description="Enter text and click Generate to create a hash"
                    />
                  )}
                </CardContent>
              </Card>
            </div>
          ) : (
            <div className="flex-1 space-y-3 sm:space-y-4 overflow-hidden">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 flex-1 overflow-hidden">
                <Card className="flex flex-col overflow-hidden">
                  <CardHeader className="p-4 sm:p-6">
                    <CardTitle className="text-base sm:text-lg">Text 1</CardTitle>
                  </CardHeader>
                  <CardContent className="flex-1 overflow-hidden space-y-4 p-4 sm:p-6">
                    <Textarea
                      value={compareInput1}
                      onChange={(e) => setCompareInput1(e.target.value)}
                      placeholder="Enter first text..."
                      className="flex-1 font-mono text-xs sm:text-sm resize-none"
                    />
                    {compareHash1 && (
                      <div className="space-y-2">
                        <div className="text-xs text-muted-foreground">Hash 1:</div>
                        <div className="p-2 rounded bg-accent font-mono text-xs break-all">
                          {compareHash1}
                        </div>
                        <CopyButton text={compareHash1} />
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card className="flex flex-col overflow-hidden">
                  <CardHeader className="p-4 sm:p-6">
                    <CardTitle className="text-base sm:text-lg">Text 2</CardTitle>
                  </CardHeader>
                  <CardContent className="flex-1 overflow-hidden space-y-4 p-4 sm:p-6">
                    <Textarea
                      value={compareInput2}
                      onChange={(e) => setCompareInput2(e.target.value)}
                      placeholder="Enter second text..."
                      className="flex-1 font-mono text-xs sm:text-sm resize-none"
                    />
                    {compareHash2 && (
                      <div className="space-y-2">
                        <div className="text-xs text-muted-foreground">Hash 2:</div>
                        <div className="p-2 rounded bg-accent font-mono text-xs break-all">
                          {compareHash2}
                        </div>
                        <CopyButton text={compareHash2} />
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {compareHash1 && compareHash2 && (
                <Card>
                  <CardContent className="pt-4 sm:pt-6 p-4 sm:p-6">
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4">
                      <GitCompare className="h-5 w-5 sm:h-6 sm:w-6" />
                      {hashesMatch ? (
                        <Badge variant="default" className="bg-green-500 text-xs sm:text-sm">
                          Hashes Match ✓
                        </Badge>
                      ) : (
                        <Badge variant="destructive" className="text-xs sm:text-sm">Hashes Don't Match ✗</Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </Tabs>
      </div>

      {/* Action Bar */}
      <div className="border-t border-border p-3 sm:p-4 flex justify-center gap-2 sm:gap-3">
        {activeTab === "generate" ? (
          <Button onClick={handleGenerate} size="lg" disabled={!input.trim()} className="w-full sm:w-auto">
            Generate
          </Button>
        ) : (
          <Button onClick={handleCompare} size="lg" disabled={!compareInput1.trim() || !compareInput2.trim()} className="w-full sm:w-auto">
            Compare
          </Button>
        )}
      </div>
    </div>
  );
}

