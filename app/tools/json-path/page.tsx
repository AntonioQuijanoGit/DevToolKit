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

      <div className="flex-1 p-6 space-y-4 overflow-auto">
        <Card>
          <CardHeader>
            <CardTitle>JSON Input</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              value={json}
              onChange={(e) => setJson(e.target.value)}
              placeholder="Paste your JSON here..."
              className="font-mono text-sm min-h-[200px]"
            />
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleExample}>
                Example
              </Button>
              <Button variant="ghost" size="sm" onClick={handleClear}>
                Clear
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>JSONPath Expression</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              value={path}
              onChange={(e) => setPath(e.target.value)}
              placeholder="$ or $.key or $.array[*]"
              className="font-mono"
            />
            <div className="text-xs text-muted-foreground space-y-1">
              <p>Examples:</p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li><code>$</code> - Root object</li>
                <li><code>$.key</code> - Access property</li>
                <li><code>$.array[*]</code> - All array items</li>
                <li><code>$.users[0]</code> - First array item</li>
              </ul>
            </div>
            <Button onClick={handleTest} disabled={!json.trim() || !path.trim()}>
              Test Path
            </Button>
          </CardContent>
        </Card>

        {error ? (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-8">
                <p className="text-destructive font-semibold mb-2">Error</p>
                <p className="text-sm text-muted-foreground">{error}</p>
              </div>
            </CardContent>
          </Card>
        ) : results.length > 0 ? (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <CardTitle>
                Results <Badge variant="secondary">{results.length}</Badge>
              </CardTitle>
              <CopyButton text={JSON.stringify(results, null, 2)} />
            </CardHeader>
            <CardContent>
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




