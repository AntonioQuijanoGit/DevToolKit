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
  const [headers, setHeaders] = useState<Array<{ key: string; value: string }>>(
    [{ key: "", value: "" }]
  );
  const [body, setBody] = useState("");
  const [response, setResponse] = useState<Response | null>(null);
  const [loading, setLoading] = useState(false);
  const addHistory = useHistoryStore((state) => state.addHistory);

  const handleSend = async () => {
    if (!url.trim()) return;

    // Validate URL format
    let validUrl = url.trim();
    if (!validUrl.startsWith("http://") && !validUrl.startsWith("https://")) {
      validUrl = `https://${validUrl}`;
    }

    setLoading(true);
    setResponse(null);
    const startTime = performance.now();

    try {
      const requestHeaders: Record<string, string> = {};
      headers.forEach((h) => {
        if (h.key.trim()) {
          const key = h.key.trim();
          const value = h.value.trim();

          // Don't add Content-Type to GET/DELETE requests (causes unnecessary CORS preflight)
          if (
            (method === "GET" || method === "DELETE") &&
            key.toLowerCase() === "content-type"
          ) {
            return; // Skip this header
          }

          requestHeaders[key] = value;
        }
      });

      const request: Request = {
        url: validUrl,
        method,
        headers: requestHeaders,
        body: method !== "GET" && method !== "DELETE" ? body : undefined,
      };

      // Create AbortController for timeout
      const controller = new AbortController();
      const TIMEOUT_MS = 60000; // 60 second timeout
      const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

      let fetchResponse: globalThis.Response;
      try {
        // Build fetch options
        const fetchOptions: RequestInit = {
          method,
          signal: controller.signal,
          mode: "cors",
          credentials: "omit",
        };

        // Only add headers if there are any (and they're not empty)
        if (Object.keys(requestHeaders).length > 0) {
          fetchOptions.headers = requestHeaders;
        }

        // Only add body for methods that support it
        if (request.body) {
          fetchOptions.body = request.body;
        }

        fetchResponse = await fetch(validUrl, fetchOptions);
        clearTimeout(timeoutId);
      } catch (fetchError) {
        clearTimeout(timeoutId);
        if (fetchError instanceof Error && fetchError.name === "AbortError") {
            const timeoutSeconds = TIMEOUT_MS * 0.001;
            throw new Error(
              "Request timeout: The request took longer than " + timeoutSeconds + " seconds"
            );
        }
        // Re-throw to be handled by outer catch
        throw fetchError;
      }

      const endTime = performance.now();
      const responseTime = Math.round(endTime - startTime);

      const responseHeaders: Record<string, string> = {};
      fetchResponse.headers.forEach((value: string, key: string) => {
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

      let errorMessage = "Unknown error";
      if (error instanceof Error) {
        errorMessage = error.message;
        // Provide more helpful error messages
        if (
          errorMessage.includes("Failed to fetch") ||
          errorMessage.includes("NetworkError") ||
          errorMessage.includes("Network request failed")
        ) {
          // Check if it's a CORS issue
          if (
            validUrl.startsWith("http://") ||
            validUrl.startsWith("https://")
          ) {
            // More specific message based on the URL
            if (validUrl.includes("jsonplaceholder.typicode.com")) {
              errorMessage =
                "Failed to fetch from JSONPlaceholder. This might be a temporary server issue or CORS restriction. Try: https://httpbin.org/get or https://api.github.com/users/octocat";
            } else {
              errorMessage =
                "Failed to fetch: This is likely a CORS (Cross-Origin Resource Sharing) issue. The server may not allow requests from this origin. Try using a CORS proxy or test with an API that supports CORS.";
            }
          } else {
            errorMessage =
              "Failed to fetch: Check if the URL is correct and accessible";
          }
        } else if (errorMessage.includes("timeout")) {
          errorMessage = errorMessage; // Keep the timeout message as is
        } else if (errorMessage.includes("TypeError")) {
          errorMessage =
            "Network error: Unable to connect to the server. Check your internet connection and verify the URL is correct.";
        }
      }

      setResponse({
        status: 0,
        statusText: "Error",
        headers: {},
        data: "",
        responseTime,
        error: errorMessage,
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
    if (example && typeof example === "object" && "url" in example) {
      setUrl(example.url);
      setMethod(example.method || "GET");
      setResponse(null);
    }
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

      <div className="flex-1 p-4 sm:p-5 md:p-6 space-y-4 sm:space-y-5 overflow-auto pb-28 sm:pb-32">
        {/* Request Builder */}
        <Card>
          <CardHeader className="p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0">
              <CardTitle className="text-base sm:text-lg font-semibold">
                Request
              </CardTitle>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleExample}
                  className="text-xs sm:text-sm"
                >
                  Example
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 sm:space-y-5 p-4 sm:p-6">
            <div className="p-4 sm:p-5 bg-muted bg-opacity-50 border border-border rounded-lg">
              <div className="flex items-start gap-2">
                <div className="flex-shrink-0 w-5 h-5 rounded-full bg-blue-500 bg-opacity-10 flex items-center justify-center mt-0.5">
                  <span className="text-[10px] text-blue-600 dark:text-blue-400">
                    ℹ
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs sm:text-sm font-medium mb-1">
                    Cross-Origin Resource Sharing (CORS)
                  </p>
                  <p className="text-[10px] sm:text-xs text-muted-foreground leading-relaxed">
                    Browser security policies may restrict cross-origin
                    requests. APIs must explicitly allow requests from your
                    origin via CORS headers. If a request fails, the API may not
                    support browser-based requests. Recommended test endpoints:{" "}
                    <code className="text-[10px] px-1 py-0.5 bg-background rounded">
                      httpbin.org
                    </code>{" "}
                    or{" "}
                    <code className="text-[10px] px-1 py-0.5 bg-background rounded">
                      api.github.com
                    </code>
                  </p>
                </div>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <Select
                value={method}
                onValueChange={(v) => setMethod(v as Request["method"])}
              >
                <SelectTrigger className="w-full sm:w-32 min-h-[44px]">
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
                className="flex-1 min-h-[44px] text-sm sm:text-base"
              />
              <Button
                onClick={handleSend}
                disabled={loading || !url.trim()}
                className="w-full sm:w-auto min-h-[44px] text-sm sm:text-base"
              >
                {loading ? (
                  <>
                    <Clock className="h-4 w-4 mr-2 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Send
                  </>
                )}
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
                {headers.length === 0 ? (
                  <div className="text-center py-4 text-muted-foreground">
                    <p className="text-xs sm:text-sm">
                      No headers. Click &quot;Add Header&quot; to add one.
                    </p>
                    <p className="text-[10px] sm:text-xs mt-1">
                      Note: GET/DELETE requests don&apos;t need Content-Type
                    </p>
                  </div>
                ) : (
                  headers.map((header, index) => (
                    <div
                      key={index}
                      className="flex flex-col sm:flex-row gap-2"
                    >
                      <Input
                        placeholder="Header name (e.g., Authorization)"
                        value={header.key}
                        onChange={(e) =>
                          handleHeaderChange(index, "key", e.target.value)
                        }
                        className="flex-1 min-h-[44px] text-sm sm:text-base"
                      />
                      <Input
                        placeholder="Header value"
                        value={header.value}
                        onChange={(e) =>
                          handleHeaderChange(index, "value", e.target.value)
                        }
                        className="flex-1 min-h-[44px] text-sm sm:text-base"
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveHeader(index)}
                        className="min-h-[44px] min-w-[44px]"
                      >
                        ×
                      </Button>
                    </div>
                  ))
                )}
                <Button
                  variant="outline"
                  onClick={handleAddHeader}
                  size="sm"
                  className="text-xs sm:text-sm"
                >
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
                    className="font-mono text-xs sm:text-sm min-h-[200px] resize-y"
                  />
                </TabsContent>
              )}
            </Tabs>
          </CardContent>
        </Card>

        {/* Response */}
        {response && (
          <Card className="flex-1 flex flex-col overflow-hidden min-h-[300px] sm:min-h-[400px]">
            <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0 pb-3 p-4 sm:p-6 border-b">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3">
                <CardTitle className="text-base sm:text-lg font-semibold">
                  Response
                </CardTitle>
                <Badge
                  className={`${getStatusColor(
                    response.status
                  )} text-xs sm:text-sm`}
                  variant="outline"
                >
                  {response.status} {response.statusText}
                </Badge>
                <div className="flex items-center gap-1 text-xs sm:text-sm text-muted-foreground">
                  <Clock className="h-3 w-3 sm:h-4 sm:w-4" />
                  {response.responseTime}ms
                </div>
              </div>
              {response.data && <CopyButton text={response.data} />}
            </CardHeader>
            <CardContent className="flex-1 overflow-hidden p-4 sm:p-6">
              {response.error ? (
                <div className="text-center py-8 px-4">
                  <p className="text-destructive font-semibold mb-2 text-sm sm:text-base">
                    Error
                  </p>
                  <p className="text-xs sm:text-sm text-muted-foreground break-words">
                    {response.error}
                  </p>
                  <div className="mt-4 space-y-4">
                    <div className="p-4 bg-destructive bg-opacity-5 border border-destructive border-opacity-20 rounded-lg">
                      <h4 className="text-sm font-semibold mb-3 text-destructive">
                        Cross-Origin Resource Sharing (CORS) Error
                      </h4>
                      <div className="space-y-3 text-xs sm:text-sm text-muted-foreground">
                        <p>
                          CORS is a browser security mechanism that restricts
                          HTTP requests initiated from scripts running in the
                          browser to a different origin (domain, protocol, or
                          port) than the one serving the web page.
                        </p>
                        <p>
                          When making a request from{" "}
                          <code className="px-1.5 py-0.5 bg-background rounded text-[10px] sm:text-xs">
                            http://localhost:3000
                          </code>{" "}
                          to an external API, the browser performs a preflight
                          OPTIONS request to verify if the server permits
                          cross-origin requests from your origin.
                        </p>
                        <p className="text-destructive/90">
                          <strong>Note:</strong> This is a browser security
                          limitation, not an API Tester issue. The target server
                          must include appropriate CORS headers (
                          <code className="text-[10px]">
                            Access-Control-Allow-Origin
                          </code>
                          ) to permit the request.
                        </p>
                      </div>
                    </div>

                    <div className="p-4 bg-muted bg-opacity-30 border border-border rounded-lg">
                      <h4 className="text-sm font-semibold mb-3">
                        Recommended Solutions
                      </h4>
                      <ul className="space-y-2 text-xs sm:text-sm text-muted-foreground">
                        <li className="flex items-start gap-2">
                          <span className="text-primary mt-0.5">•</span>
                          <span>
                            <strong>Use CORS-enabled APIs:</strong> Test with
                            endpoints that explicitly support cross-origin
                            requests (GitHub API, httpbin.org, etc.)
                          </span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-primary mt-0.5">•</span>
                          <span>
                            <strong>Optimize request headers:</strong> Avoid
                            unnecessary headers like{" "}
                            <code className="text-[10px] px-1 py-0.5 bg-background rounded">
                              Content-Type
                            </code>{" "}
                            in GET/DELETE requests to prevent preflight requests
                          </span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-primary mt-0.5">•</span>
                          <span>
                            <strong>Server-side configuration:</strong> If you
                            control the API server, configure CORS headers to
                            allow requests from your origin
                          </span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-primary mt-0.5">•</span>
                          <span>
                            <strong>Alternative testing methods:</strong> Use
                            server-side tools (curl, Postman, Insomnia) that are
                            not subject to browser CORS restrictions
                          </span>
                        </li>
                      </ul>
                    </div>

                    <div className="p-4 bg-background border border-border rounded-lg">
                      <h4 className="text-sm font-semibold mb-3">
                        Verified CORS-Compatible Endpoints
                      </h4>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                          <code className="text-[10px] sm:text-xs font-mono break-all">
                            https://httpbin.org/get
                          </code>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                          <code className="text-[10px] sm:text-xs font-mono break-all">
                            https://api.github.com/users/octocat
                          </code>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-yellow-500"></div>
                          <code className="text-[10px] sm:text-xs font-mono break-all">
                            https://jsonplaceholder.typicode.com/users
                          </code>
                          <span className="text-[10px] text-muted-foreground">
                            (may vary by environment)
                          </span>
                        </div>
                      </div>
                      <p className="text-[10px] sm:text-xs text-muted-foreground mt-3 pt-3 border-t border-border">
                        <strong>Environment note:</strong> Electron-based
                        applications (like Cursor) may have additional CORS
                        restrictions. Some APIs may work in standard browsers
                        but fail in Electron environments.
                      </p>
                    </div>
                  </div>
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
