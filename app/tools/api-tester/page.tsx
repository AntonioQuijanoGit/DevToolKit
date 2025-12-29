"use client";

import { useState } from "react";
import { FileCode, Send, Clock } from "lucide-react";
import { ToolHeader } from "@/components/layout/tool-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CodeBlock } from "@/components/shared/code-block";
import { CopyButton } from "@/components/shared/copy-button";
import { Badge } from "@/components/ui/badge";
import { examples } from "@/lib/constants/examples";
import { useHistoryStore } from "@/lib/store/history-store";

interface Request {
  url: string;
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  headers: Record<string, string>;
  body?: string;
}

interface Response {
  status: number;
  statusText: string;
  headers: Record<string, string>;
  data: string;
  responseTime: number;
  error?: string;
}

export default function APITesterPage() {
  const [url, setUrl] = useState("");
  const [method, setMethod] = useState<Request["method"]>("GET");
  const [headers, setHeaders] = useState<Array<{ key: string; value: string }>>([
    { key: "Content-Type", value: "application/json" },
  ]);
  const [body, setBody] = useState("");
  const [response, setResponse] = useState<Response | null>(null);
  const [loading, setLoading] = useState(false);
  const addHistory = useHistoryStore((state) => state.addHistory);

  const handleSend = async () => {
    if (!url.trim()) return;

    setLoading(true);
    const startTime = performance.now();

    try {
      const requestHeaders: Record<string, string> = {};
      headers.forEach((h) => {
        if (h.key.trim()) {
          requestHeaders[h.key] = h.value;
        }
      });

      const request: Request = {
        url,
        method,
        headers: requestHeaders,
        body: method !== "GET" && method !== "DELETE" ? body : undefined,
      };

      const fetchResponse = await fetch(url, {
        method,
        headers: requestHeaders,
        body: request.body,
      });

      const endTime = performance.now();
      const responseTime = Math.round(endTime - startTime);

      const responseHeaders: Record<string, string> = {};
      fetchResponse.headers.forEach((value, key) => {
        responseHeaders[key] = value;
      });

      const contentType = fetchResponse.headers.get("content-type");
      let data = await fetchResponse.text();

      if (contentType?.includes("application/json")) {
        try {
          data = JSON.stringify(JSON.parse(data), null, 2);
        } catch {
          // Keep as is if not valid JSON
        }
      }

      const responseData: Response = {
        status: fetchResponse.status,
        statusText: fetchResponse.statusText,
        headers: responseHeaders,
        data,
        responseTime,
      };

      setResponse(responseData);
      addHistory({
        tool: "api-tester",
        input: JSON.stringify(request, null, 2),
        output: JSON.stringify(responseData, null, 2),
      });
    } catch (error) {
      const endTime = performance.now();
      const responseTime = Math.round(endTime - startTime);
      setResponse({
        status: 0,
        statusText: "Error",
        headers: {},
        data: "",
        responseTime,
        error: error instanceof Error ? error.message : "Unknown error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddHeader = () => {
    setHeaders([...headers, { key: "", value: "" }]);
  };

  const handleRemoveHeader = (index: number) => {
    setHeaders(headers.filter((_, i) => i !== index));
  };

  const handleHeaderChange = (
    index: number,
    field: "key" | "value",
    value: string
  ) => {
    const newHeaders = [...headers];
    newHeaders[index][field] = value;
    setHeaders(newHeaders);
  };

  const handleExample = () => {
    const example = examples["api-tester"];
    setUrl(example.url);
    setMethod(example.method);
  };

  const getStatusColor = (status: number) => {
    if (status >= 200 && status < 300) return "text-green-500";
    if (status >= 300 && status < 400) return "text-yellow-500";
    if (status >= 400) return "text-red-500";
    return "text-muted-foreground";
  };

  return (
    <div className="h-screen flex flex-col">
      <ToolHeader
        title="API Tester"
        description="Test REST APIs with custom requests"
        icon={FileCode}
      />

      <div className="flex-1 p-6 space-y-4 overflow-hidden">
        {/* Request Builder */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Request</CardTitle>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={handleExample}>
                  Example
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Select value={method} onValueChange={(v) => setMethod(v as Request["method"])}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="GET">GET</SelectItem>
                  <SelectItem value="POST">POST</SelectItem>
                  <SelectItem value="PUT">PUT</SelectItem>
                  <SelectItem value="DELETE">DELETE</SelectItem>
                  <SelectItem value="PATCH">PATCH</SelectItem>
                </SelectContent>
              </Select>
              <Input
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://api.example.com/endpoint"
                className="flex-1"
              />
              <Button onClick={handleSend} disabled={loading || !url.trim()}>
                <Send className="h-4 w-4 mr-2" />
                {loading ? "Sending..." : "Send"}
              </Button>
            </div>

            <Tabs defaultValue="headers">
              <TabsList>
                <TabsTrigger value="headers">Headers</TabsTrigger>
                {(method === "POST" ||
                  method === "PUT" ||
                  method === "PATCH") && (
                  <TabsTrigger value="body">Body</TabsTrigger>
                )}
              </TabsList>
              <TabsContent value="headers" className="space-y-2">
                {headers.map((header, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      placeholder="Header name"
                      value={header.key}
                      onChange={(e) =>
                        handleHeaderChange(index, "key", e.target.value)
                      }
                      className="flex-1"
                    />
                    <Input
                      placeholder="Header value"
                      value={header.value}
                      onChange={(e) =>
                        handleHeaderChange(index, "value", e.target.value)
                      }
                      className="flex-1"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveHeader(index)}
                    >
                      ×
                    </Button>
                  </div>
                ))}
                <Button variant="outline" onClick={handleAddHeader} size="sm">
                  + Add Header
                </Button>
              </TabsContent>
              {(method === "POST" ||
                method === "PUT" ||
                method === "PATCH") && (
                <TabsContent value="body">
                  <Textarea
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    placeholder='{"key": "value"}'
                    className="font-mono text-sm min-h-[200px]"
                  />
                </TabsContent>
              )}
            </Tabs>
          </CardContent>
        </Card>

        {/* Response */}
        {response && (
          <Card className="flex-1 flex flex-col overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div className="flex items-center gap-3">
                <CardTitle>Response</CardTitle>
                <Badge
                  className={getStatusColor(response.status)}
                  variant="outline"
                >
                  {response.status} {response.statusText}
                </Badge>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  {response.responseTime}ms
                </div>
              </div>
              {response.data && <CopyButton text={response.data} />}
            </CardHeader>
            <CardContent className="flex-1 overflow-hidden">
              {response.error ? (
                <div className="text-center py-8">
                  <p className="text-destructive font-semibold mb-2">Error</p>
                  <p className="text-sm text-muted-foreground">
                    {response.error}
                  </p>
                </div>
              ) : response.data ? (
                <CodeBlock
                  code={response.data}
                  language={
                    response.headers["content-type"]?.includes("json")
                      ? "json"
                      : "javascript"
                  }
                />
              ) : null}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}




