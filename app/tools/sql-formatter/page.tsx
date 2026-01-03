"use client";

import { useState } from "react";
import { Database } from "lucide-react";
import { ToolHeader } from "@/components/layout/tool-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { CodeBlock } from "@/components/shared/code-block";
import { CopyButton } from "@/components/shared/copy-button";
import { EmptyState } from "@/components/shared/empty-state";

const formatSQL = (sql: string): string => {
  let formatted = sql
    .replace(/\s+/g, " ")
    .replace(/\s*,\s*/g, ", ")
    .replace(/\s*\(\s*/g, " (")
    .replace(/\s*\)\s*/g, ") ")
    .trim();

  const keywords = [
    "SELECT", "FROM", "WHERE", "JOIN", "INNER", "LEFT", "RIGHT", "OUTER",
    "ON", "GROUP BY", "ORDER BY", "HAVING", "INSERT", "INTO", "VALUES",
    "UPDATE", "SET", "DELETE", "CREATE", "TABLE", "ALTER", "DROP", "INDEX",
    "AND", "OR", "NOT", "AS", "DISTINCT", "COUNT", "SUM", "AVG", "MAX", "MIN"
  ];

  keywords.forEach((keyword) => {
    const regex = new RegExp(`\\b${keyword}\\b`, "gi");
    formatted = formatted.replace(regex, keyword.toUpperCase());
  });

  let indent = 0;
  const lines = formatted.split(" ");
  const result: string[] = [];
  const indentSize = 2;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.match(/^(SELECT|FROM|WHERE|JOIN|GROUP BY|ORDER BY|HAVING)$/i)) {
      if (i > 0) result.push("");
      result.push(" ".repeat(indent * indentSize) + line);
      if (line.match(/^(SELECT|WHERE|GROUP BY|ORDER BY|HAVING)$/i)) {
        indent++;
      }
    } else if (line.match(/^(FROM|JOIN)$/i)) {
      indent = Math.max(0, indent - 1);
      result.push(" ".repeat(indent * indentSize) + line);
    } else if (line.trim()) {
      result.push(" ".repeat(indent * indentSize) + line);
    }
  }

  return result.join("\n");
};

export default function SQLFormatterPage() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleFormat = () => {
    try {
      if (!input.trim()) {
        setError("Input is empty");
        return;
      }
      const formatted = formatSQL(input);
      setOutput(formatted);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Formatting failed");
      setOutput("");
    }
  };

  const handleClear = () => {
    setInput("");
    setOutput("");
    setError(null);
  };

  const handleExample = () => {
    setInput(`SELECT id, name, email FROM users WHERE status = 'active' AND created_at > '2024-01-01' ORDER BY name ASC`);
  };

  return (
    <div className="h-screen flex flex-col">
      <ToolHeader
        title="SQL Formatter"
        description="Format and validate SQL queries"
        icon={Database}
      />

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 p-3 sm:p-4 md:p-6 overflow-auto pb-20 sm:pb-24">
        <Card className="flex flex-col overflow-hidden min-h-[400px] sm:min-h-[500px]">
          <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0 pb-3 p-4 sm:p-6 border-b">
            <CardTitle className="text-base sm:text-lg font-semibold">Input</CardTitle>
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
              placeholder="Paste your SQL query here..."
              className="h-full font-mono text-xs sm:text-sm resize-none min-h-[200px]"
            />
          </CardContent>
        </Card>

        <Card className="flex flex-col overflow-hidden min-h-[400px] sm:min-h-[500px]">
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
              <CodeBlock code={output} language="sql" />
            ) : (
              <EmptyState
                icon={Database}
                title="No output"
                description="Format your SQL query to see results"
              />
            )}
          </CardContent>
        </Card>
      </div>

      <div className="sticky bottom-0 left-0 right-0 border-t border-border bg-card/95 backdrop-blur-sm p-3 sm:p-4 md:p-5 z-10 shadow-lg">
        <div className="max-w-7xl mx-auto flex justify-center">
          <Button onClick={handleFormat} size="lg" disabled={!input.trim()} className="w-full sm:w-auto min-h-[44px] text-sm sm:text-base">
            Format SQL
          </Button>
        </div>
      </div>
    </div>
  );
}






