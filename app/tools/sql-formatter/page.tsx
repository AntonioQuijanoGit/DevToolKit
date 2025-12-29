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

      <div className="flex-1 grid grid-cols-2 gap-4 p-6 overflow-hidden">
        <Card className="flex flex-col overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle>Input</CardTitle>
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
              placeholder="Paste your SQL query here..."
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
            {error ? (
              <div className="h-full flex items-center justify-center">
                <div className="text-center">
                  <p className="text-destructive font-semibold mb-2">Error</p>
                  <p className="text-sm text-muted-foreground">{error}</p>
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

      <div className="border-t border-border p-4 flex justify-center gap-3">
        <Button onClick={handleFormat} size="lg" disabled={!input.trim()}>
          Format SQL
        </Button>
      </div>
    </div>
  );
}



