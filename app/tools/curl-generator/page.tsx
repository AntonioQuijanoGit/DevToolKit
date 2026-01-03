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
import { examples } from "@/lib/constants/examples";

const methods = ["GET", "POST", "PUT", "PATCH", "DELETE", "HEAD", "OPTIONS"];

export default function cURLGeneratorPage() {
  const [method, setMethod] = useState("GET");
  const [url, setUrl] = useState("");
  const [headers, setHeaders] = useState("");
  const [body, setBody] = useState("");
  const [output, setOutput] = useState("");
  const addHistory = useHistoryStore((state) => state.addHistory);

  const handleExample = () => {
    const example = examples["curl-generator"];
    if (example && typeof example === "object") {
      setMethod(example.method || "GET");
      setUrl(example.url || "");
      if (example.headers) {
        setHeaders(Object.entries(example.headers).map(([k, v]) => `${k}: ${v}`).join("\n"));
      }
    }
  };

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

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 md:gap-6 p-3 sm:p-4 md:p-6 overflow-auto pb-20 sm:pb-24">
        <Card className="flex flex-col overflow-hidden min-h-[400px] sm:min-h-[500px]">
          <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0 p-4 sm:p-6 border-b">
            <CardTitle className="text-base sm:text-lg font-semibold">Request Details</CardTitle>
            <Button variant="outline" size="sm" onClick={handleExample} className="text-xs sm:text-sm ">
              Example
            </Button>
          </CardHeader>
          <CardContent className="space-y-3 sm:space-y-4 p-4 sm:p-6">
            <div className="space-y-2">
              <label className="text-xs sm:text-sm font-medium">Method</label>
              <Select value={method} onValueChange={setMethod}>
                <SelectTrigger className="min-h-[44px]">
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
              <label className="text-xs sm:text-sm font-medium">URL</label>
              <Input
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://api.example.com/endpoint"
                className="min-h-[44px] text-sm sm:text-base"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs sm:text-sm font-medium">Headers (one per line)</label>
              <Textarea
                value={headers}
                onChange={(e) => setHeaders(e.target.value)}
                placeholder="Content-Type: application/json&#10;Authorization: Bearer token"
                className="min-h-[100px] font-mono text-xs sm:text-sm resize-y"
              />
            </div>

            {(method === "POST" || method === "PUT" || method === "PATCH") && (
              <div className="space-y-2">
                <label className="text-xs sm:text-sm font-medium">Body</label>
                <Textarea
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  placeholder='{"key": "value"}'
                  className="min-h-[150px] font-mono text-xs sm:text-sm resize-y"
                />
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-2">
              <Button onClick={generateCurl} disabled={!url.trim()} className="w-full sm:w-auto min-h-[44px] text-sm sm:text-base">
                Generate cURL
              </Button>
              <Button variant="ghost" onClick={handleClear} className="w-full sm:w-auto min-h-[44px] text-sm sm:text-base">
                Clear
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="flex flex-col overflow-hidden min-h-[400px] sm:min-h-[500px]">
          <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0 pb-3 p-4 sm:p-6 border-b">
            <CardTitle className="text-base sm:text-lg font-semibold">cURL Command</CardTitle>
            {output && <CopyButton text={output} />}
          </CardHeader>
          <CardContent className="flex-1 overflow-hidden p-4 sm:p-6">
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
  );
}






