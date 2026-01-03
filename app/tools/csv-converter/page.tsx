"use client";

import { useState } from "react";
import { Layers } from "lucide-react";
import { ToolHeader } from "@/components/layout/tool-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CodeBlock } from "@/components/shared/code-block";
import { CopyButton } from "@/components/shared/copy-button";
import { EmptyState } from "@/components/shared/empty-state";

const csvToJSON = (csv: string): string => {
  const lines = csv.split("\n").filter((line) => line.trim());
  if (lines.length === 0) return "[]";

  const headers = lines[0].split(",").map((h) => h.trim());
  const result = [];

  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(",").map((v) => v.trim());
    const obj: Record<string, string> = {};
    headers.forEach((header, index) => {
      obj[header] = values[index] || "";
    });
    result.push(obj);
  }

  return JSON.stringify(result, null, 2);
};

const jsonToCSV = (json: string): string => {
  try {
    const data = JSON.parse(json);
    if (!Array.isArray(data) || data.length === 0) return "";

    const headers = Object.keys(data[0]);
    const csvLines = [headers.join(",")];

    data.forEach((row) => {
      const values = headers.map((header) => row[header] || "");
      csvLines.push(values.join(","));
    });

    return csvLines.join("\n");
  } catch {
    return "Invalid JSON";
  }
};

export default function CSVConverterPage() {
  const [activeTab, setActiveTab] = useState<"csv" | "json">("csv");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");

  const handleConvert = () => {
    if (activeTab === "csv") {
      setOutput(csvToJSON(input));
    } else {
      setOutput(jsonToCSV(input));
    }
  };

  const handleClear = () => {
    setInput("");
    setOutput("");
  };

  const handleExample = () => {
    if (activeTab === "csv") {
      setInput(`name,age,city
John,30,New York
Jane,25,Los Angeles`);
    } else {
      setInput(`[
  {"name": "John", "age": 30, "city": "New York"},
  {"name": "Jane", "age": 25, "city": "Los Angeles"}
]`);
    }
  };

  return (
    <div className="h-screen flex flex-col">
      <ToolHeader
        title="CSV to JSON"
        description="Convert CSV to JSON and vice versa"
        icon={Layers}
      />

      <div className="flex-1 p-3 sm:p-4 md:p-6">
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "csv" | "json")} className="h-full flex flex-col">
          <TabsList className="mb-3 sm:mb-4">
            <TabsTrigger value="csv" className="text-xs sm:text-sm">CSV → JSON</TabsTrigger>
            <TabsTrigger value="json" className="text-xs sm:text-sm">JSON → CSV</TabsTrigger>
          </TabsList>

          <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 overflow-hidden">
            <Card className="flex flex-col overflow-hidden min-h-[300px] sm:min-h-[400px]">
              <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0 pb-3 p-4 sm:p-6 border-b">
                <CardTitle className="text-base sm:text-lg font-semibold">{activeTab === "csv" ? "CSV" : "JSON"}</CardTitle>
                <div className="flex gap-2 flex-wrap">
                  <Button variant="outline" size="sm" onClick={handleExample} className="text-xs sm:text-sm ">
                    Example
                  </Button>
                  <Button variant="ghost" size="sm" onClick={handleClear} className="text-xs sm:text-sm ">
                    Clear
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="flex-1 overflow-hidden p-4 sm:p-6">
                <Textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={
                    activeTab === "csv"
                      ? "Paste CSV data..."
                      : "Paste JSON data..."
                  }
                  className="h-full font-mono text-xs sm:text-sm resize-none min-h-[200px]"
                />
              </CardContent>
            </Card>

            <Card className="flex flex-col overflow-hidden min-h-[300px] sm:min-h-[400px]">
              <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0 pb-3 p-4 sm:p-6 border-b">
                <CardTitle className="text-base sm:text-lg font-semibold">{activeTab === "csv" ? "JSON" : "CSV"}</CardTitle>
                {output && <CopyButton text={output} />}
              </CardHeader>
              <CardContent className="flex-1 overflow-hidden p-4 sm:p-6">
                {output ? (
                  activeTab === "csv" ? (
                    <CodeBlock code={output} language="json" />
                  ) : (
                    <div className="h-full overflow-auto">
                      <pre className="text-xs sm:text-sm font-mono whitespace-pre-wrap break-words">
                        {output}
                      </pre>
                    </div>
                  )
                ) : (
                  <EmptyState
                    icon={Layers}
                    title="No output"
                    description="Convert data to see results"
                  />
                )}
              </CardContent>
            </Card>
          </div>
        </Tabs>
      </div>

      <div className="sticky bottom-0 left-0 right-0 border-t border-border bg-card/95 backdrop-blur-sm p-3 sm:p-4 md:p-5 z-10 shadow-lg">
        <div className="max-w-7xl mx-auto flex justify-center">
          <Button onClick={handleConvert} size="lg" disabled={!input.trim()} className="w-full sm:w-auto min-h-[44px] text-sm sm:text-base">
            Convert
          </Button>
        </div>
      </div>
    </div>
  );
}






