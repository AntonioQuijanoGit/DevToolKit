"use client";

import { useState } from "react";
import { FileJson } from "lucide-react";
import { ToolHeader } from "@/components/layout/tool-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CodeBlock } from "@/components/shared/code-block";
import { CopyButton } from "@/components/shared/copy-button";
import { EmptyState } from "@/components/shared/empty-state";
import { HowToUse } from "@/components/shared/how-to-use";
import { Badge } from "@/components/ui/badge";

export default function JSONPathPage() {
  const [json, setJson] = useState("");
  const [path, setPath] = useState("$");
  const [results, setResults] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleTest = () => {
    try {
      if (!json.trim()) {
        setError("JSON is required");
        return;
      }

      const parsed = JSON.parse(json);
      setError(null);

      // Simple JSONPath implementation
      const evaluatePath = (obj: any, pathExpr: string): any[] => {
        if (pathExpr === "$") return [obj];
        if (pathExpr === "$.*") {
          return Object.values(obj);
        }
        if (pathExpr.startsWith("$.")) {
          const keys = pathExpr.slice(2).split(".");
          let current = obj;
          for (const key of keys) {
            if (current && typeof current === "object") {
              current = current[key];
            } else {
              return [];
            }
          }
          return [current];
        }
        if (pathExpr.includes("[*]")) {
          const parts = pathExpr.split("[*]");
          let current = obj;
          for (const part of parts.slice(0, -1)) {
            const key = part.replace("$.", "");
            if (current && typeof current === "object") {
              current = current[key];
            }
          }
          if (Array.isArray(current)) {
            return current;
          }
        }
        return [];
      };

      const res = evaluatePath(parsed, path);
      setResults(res);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Invalid JSON");
      setResults([]);
    }
  };

  const handleClear = () => {
    setJson("");
    setPath("$");
    setResults([]);
    setError(null);
  };

  const handleExample = () => {
    setJson(`{
  "users": [
    {"id": 1, "name": "John", "email": "john@example.com"},
    {"id": 2, "name": "Jane", "email": "jane@example.com"}
  ],
  "settings": {
    "theme": "dark",
    "language": "en"
  }
}`);
    setPath("$.users[*]");
  };

  return (
    <div className="h-screen flex flex-col">
      <ToolHeader
        title="JSON Path Tester"
        description="Test JSONPath expressions on JSON data"
        icon={FileJson}
      />

      <div className="flex-1 p-3 sm:p-4 md:p-6 space-y-3 sm:space-y-4 overflow-auto pb-20 sm:pb-24">
        <HowToUse
          steps={[
            "Enter your JSON data in the input field",
            "Enter a JSONPath expression (e.g., $.users[*], $.settings.theme)",
            "Click 'Test' to evaluate the path",
            "View matching results or copy them for use",
          ]}
        />
        <HowToUse
          steps={[
            "Enter your JSON data in the input field",
            "Enter a JSONPath expression (e.g., $.users[*], $.settings.theme)",
            "Click 'Test' to evaluate the path",
            "View matching results or copy them for use",
          ]}
        />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
          <Card className="flex flex-col overflow-hidden min-h-[300px] sm:min-h-[400px]">
            <CardHeader className="p-4 sm:p-6 border-b">
              <CardTitle className="text-base sm:text-lg font-semibold">JSON Input</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 sm:space-y-4 p-4 sm:p-6">
              <Textarea
                value={json}
                onChange={(e) => setJson(e.target.value)}
                placeholder="Paste your JSON here..."
                className="font-mono text-xs sm:text-sm min-h-[200px] resize-y"
              />
              <div className="flex gap-2 flex-wrap">
                <Button variant="outline" size="sm" onClick={handleExample} className="text-xs sm:text-sm ">
                  Example
                </Button>
                <Button variant="ghost" size="sm" onClick={handleClear} className="text-xs sm:text-sm ">
                  Clear
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="flex flex-col overflow-hidden min-h-[300px] sm:min-h-[400px]">
            <CardHeader className="p-4 sm:p-6 border-b">
              <CardTitle className="text-base sm:text-lg font-semibold">JSONPath Expression</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 sm:space-y-4 p-4 sm:p-6">
              <Input
                value={path}
                onChange={(e) => setPath(e.target.value)}
                placeholder="$ or $.key or $.array[*]"
                className="font-mono min-h-[44px] text-sm sm:text-base"
              />
              <div className="text-[10px] sm:text-xs text-muted-foreground space-y-1">
                <p className="font-medium">Examples:</p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li><code className="text-[10px] sm:text-xs">$</code> - Root object</li>
                  <li><code className="text-[10px] sm:text-xs">$.key</code> - Access property</li>
                  <li><code className="text-[10px] sm:text-xs">$.array[*]</code> - All array items</li>
                  <li><code className="text-[10px] sm:text-xs">$.users[0]</code> - First array item</li>
                </ul>
              </div>
              <Button onClick={handleTest} disabled={!json.trim() || !path.trim()} className="w-full sm:w-auto min-h-[44px] text-sm sm:text-base">
                Test Path
              </Button>
            </CardContent>
          </Card>
        </div>

        {error ? (
          <Card>
            <CardContent className="pt-6 p-4 sm:p-6">
              <div className="text-center py-8 px-4">
                <p className="text-destructive font-semibold mb-2 text-sm sm:text-base">Error</p>
                <p className="text-xs sm:text-sm text-muted-foreground break-words">{error}</p>
              </div>
            </CardContent>
          </Card>
        ) : results.length > 0 ? (
          <Card>
            <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0 pb-3 p-4 sm:p-6 border-b">
              <CardTitle className="text-base sm:text-lg font-semibold flex items-center gap-2">
                Results <Badge variant="secondary" className="text-[10px] sm:text-xs">{results.length}</Badge>
              </CardTitle>
              <CopyButton text={JSON.stringify(results, null, 2)} />
            </CardHeader>
            <CardContent className="p-4 sm:p-6">
              <CodeBlock
                code={JSON.stringify(results, null, 2)}
                language="json"
              />
            </CardContent>
          </Card>
        ) : null}
      </div>
    </div>
  );
}






