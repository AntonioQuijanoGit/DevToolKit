"use client";

import { useState } from "react";
import { Terminal } from "lucide-react";
import { ToolHeader } from "@/components/layout/tool-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CopyButton } from "@/components/shared/copy-button";
import { CodeBlock } from "@/components/shared/code-block";
import { EmptyState } from "@/components/shared/empty-state";
import { useHistoryStore } from "@/lib/store/history-store";

const methods = ["GET", "POST", "PUT", "PATCH", "DELETE", "HEAD", "OPTIONS"];

export default function cURLGeneratorPage() {
  const [method, setMethod] = useState("GET");
  const [url, setUrl] = useState("");
  const [headers, setHeaders] = useState("");
  const [body, setBody] = useState("");
  const [output, setOutput] = useState("");
  const addHistory = useHistoryStore((state) => state.addHistory);

  const generateCurl = () => {
    if (!url.trim()) return;

    let curl = `curl -X ${method}`;

    // Add URL
    curl += ` "${url}"`;

    // Add headers
    if (headers.trim()) {
      const headerLines = headers.split("\n").filter((line) => line.trim());
      headerLines.forEach((line) => {
        const [key, ...valueParts] = line.split(":");
        const value = valueParts.join(":").trim();
        if (key && value) {
          curl += ` \\\n  -H "${key}: ${value}"`;
        }
      });
    }

    // Add body
    if (body.trim() && (method === "POST" || method === "PUT" || method === "PATCH")) {
      curl += ` \\\n  -d '${body.replace(/'/g, "'\\''")}'`;
    }

    setOutput(curl);

    addHistory({
      tool: "curl-generator",
      input: JSON.stringify({ method, url, headers, body }),
      output: curl,
    });
  };

  const handleClear = () => {
    setUrl("");
    setHeaders("");
    setBody("");
    setOutput("");
  };

  return (
    <div className="h-screen flex flex-col">
      <ToolHeader
        title="cURL Generator"
        description="Generate cURL commands from API requests"
        icon={Terminal}
      />

      <div className="flex-1 p-6 space-y-6 overflow-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="flex flex-col overflow-hidden space-y-6">
            <CardHeader>
              <CardTitle>Request Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Method</label>
                <Select value={method} onValueChange={setMethod}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {methods.map((m) => (
                      <SelectItem key={m} value={m}>
                        {m}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">URL</label>
                <Input
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://api.example.com/endpoint"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Headers (one per line)</label>
                <Textarea
                  value={headers}
                  onChange={(e) => setHeaders(e.target.value)}
                  placeholder="Content-Type: application/json&#10;Authorization: Bearer token"
                  className="min-h-[100px] font-mono text-sm"
                />
              </div>

              {(method === "POST" || method === "PUT" || method === "PATCH") && (
                <div className="space-y-2">
                  <label className="text-sm font-medium">Body</label>
                  <Textarea
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    placeholder='{"key": "value"}'
                    className="min-h-[150px] font-mono text-sm"
                  />
                </div>
              )}

              <div className="flex gap-2">
                <Button onClick={generateCurl} disabled={!url.trim()}>
                  Generate cURL
                </Button>
                <Button variant="ghost" onClick={handleClear}>
                  Clear
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="flex flex-col overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <CardTitle>cURL Command</CardTitle>
              {output && <CopyButton text={output} />}
            </CardHeader>
            <CardContent className="flex-1 overflow-hidden">
              {output ? (
                <CodeBlock code={output} language="bash" />
              ) : (
                <EmptyState
                  icon={Terminal}
                  title="No command"
                  description="Enter request details and click Generate cURL"
                />
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

