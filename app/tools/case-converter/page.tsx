"use client";

import { useState } from "react";
import { Type } from "lucide-react";
import { ToolHeader } from "@/components/layout/tool-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CopyButton } from "@/components/shared/copy-button";
import { EmptyState } from "@/components/shared/empty-state";
import { convertCase, CaseType } from "@/lib/utils/case-converter";
import { useHistoryStore } from "@/lib/store/history-store";

const caseTypes: CaseType[] = [
  "camelCase",
  "PascalCase",
  "snake_case",
  "kebab-case",
  "CONSTANT_CASE",
  "lower case",
  "UPPER CASE",
  "Title Case",
  "Sentence case",
];

export default function CaseConverterPage() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [selectedCase, setSelectedCase] = useState<CaseType>("camelCase");
  const addHistory = useHistoryStore((state) => state.addHistory);

  const handleConvert = () => {
    if (!input.trim()) return;
    
    const converted = convertCase(input, selectedCase);
    setOutput(converted);
    
    addHistory({
      tool: "case-converter",
      input,
      output: converted,
    });
  };

  const handleClear = () => {
    setInput("");
    setOutput("");
  };

  const handleConvertAll = () => {
    if (!input.trim()) return;
    
    const results = caseTypes.map((caseType) => ({
      case: caseType,
      result: convertCase(input, caseType),
    }));
    
    const outputText = results
      .map((r) => `${r.case}:\n${r.result}\n`)
      .join("\n");
    
    setOutput(outputText);
  };

  return (
    <div className="h-screen flex flex-col">
      <ToolHeader
        title="Case Converter"
        description="Convert text between different cases"
        icon={Type}
      />

      <div className="flex-1 p-6 space-y-6 overflow-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="flex flex-col overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <CardTitle>Input</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 overflow-hidden space-y-4">
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Enter text to convert..."
                className="min-h-[300px] font-mono"
              />
              <div className="flex items-center gap-2">
                <Select value={selectedCase} onValueChange={(v) => setSelectedCase(v as CaseType)}>
                  <SelectTrigger className="w-[200px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {caseTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button onClick={handleConvert} disabled={!input.trim()}>
                  Convert
                </Button>
                <Button variant="outline" onClick={handleConvertAll} disabled={!input.trim()}>
                  Convert All
                </Button>
                <Button variant="ghost" onClick={handleClear}>
                  Clear
                </Button>
              </div>
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
                  icon={Type}
                  title="No output"
                  description="Enter text and select a case to convert"
                />
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}






