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
import { examples } from "@/lib/constants/examples";

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

  const handleExample = () => {
    const example = examples["case-converter"];
    if (example && typeof example === "string") {
      setInput(example);
    }
  };

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

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 md:gap-6 p-3 sm:p-4 md:p-6 overflow-auto pb-20 sm:pb-24">
        <Card className="flex flex-col overflow-hidden min-h-[400px] sm:min-h-[500px]">
          <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0 pb-3 p-4 sm:p-6 border-b">
            <CardTitle className="text-base sm:text-lg font-semibold">Input</CardTitle>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleExample} className="text-xs sm:text-sm ">
                Example
              </Button>
            </div>
          </CardHeader>
          <CardContent className="flex-1 overflow-hidden space-y-3 sm:space-y-4 p-4 sm:p-6">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Enter text to convert..."
              className="min-h-[300px] sm:min-h-[400px] font-mono text-xs sm:text-sm resize-y"
            />
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
              <Select value={selectedCase} onValueChange={(v) => setSelectedCase(v as CaseType)}>
                <SelectTrigger className="w-full sm:w-[200px] min-h-[44px]">
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
              <Button onClick={handleConvert} disabled={!input.trim()} className="w-full sm:w-auto min-h-[44px] text-sm sm:text-base">
                Convert
              </Button>
              <Button variant="outline" onClick={handleConvertAll} disabled={!input.trim()} className="w-full sm:w-auto min-h-[44px] text-sm sm:text-base">
                Convert All
              </Button>
              <Button variant="ghost" onClick={handleClear} className="w-full sm:w-auto min-h-[44px] text-sm sm:text-base">
                Clear
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="flex flex-col overflow-hidden min-h-[400px] sm:min-h-[500px]">
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
                icon={Type}
                title="No output"
                description="Enter text and select a case to convert"
              />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}






