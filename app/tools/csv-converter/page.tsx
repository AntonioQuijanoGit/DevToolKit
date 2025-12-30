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

      <div className="flex-1 p-6">
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "csv" | "json")} className="h-full flex flex-col">
          <TabsList className="mb-4">
            <TabsTrigger value="csv">CSV → JSON</TabsTrigger>
            <TabsTrigger value="json">JSON → CSV</TabsTrigger>
          </TabsList>

          <div className="flex-1 grid grid-cols-2 gap-4 overflow-hidden">
            <Card className="flex flex-col overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between pb-3">
                <CardTitle>{activeTab === "csv" ? "CSV" : "JSON"}</CardTitle>
                <div className="flex gap-2">
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
                    activeTab === "csv"
                      ? "Paste CSV data..."
                      : "Paste JSON data..."
                  }
                  className="h-full font-mono text-sm resize-none"
                />
              </CardContent>
            </Card>

            <Card className="flex flex-col overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between pb-3">
                <CardTitle>{activeTab === "csv" ? "JSON" : "CSV"}</CardTitle>
                {output && <CopyButton text={output} />}
              </CardHeader>
              <CardContent className="flex-1 overflow-hidden">
                {output ? (
                  activeTab === "csv" ? (
                    <CodeBlock code={output} language="json" />
                  ) : (
                    <div className="h-full overflow-auto p-4">
                      <pre className="text-sm font-mono whitespace-pre-wrap">
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

      <div className="border-t border-border p-4 flex justify-center gap-3">
        <Button onClick={handleConvert} size="lg" disabled={!input.trim()}>
          Convert
        </Button>
      </div>
    </div>
  );
}






