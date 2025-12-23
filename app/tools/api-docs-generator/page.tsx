"use client";

import { useState } from "react";
import { FileCode, Download } from "lucide-react";
import { ToolHeader } from "@/components/layout/tool-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CodeBlock } from "@/components/shared/code-block";
import { CopyButton } from "@/components/shared/copy-button";
import { EmptyState } from "@/components/shared/empty-state";
import {
  generateOpenAPI,
  generatePostmanCollection,
  generateCurlCommands,
  type APIEndpoint,
} from "@/lib/utils/api-docs-generator";
import { useHistoryStore } from "@/lib/store/history-store";
import { useToast } from "@/lib/hooks/use-toast";
import { downloadFile } from "@/lib/utils/download";

export default function APIDocsGeneratorPage() {
  const [apiTitle, setApiTitle] = useState("My API");
  const [apiVersion, setApiVersion] = useState("1.0.0");
  const [baseUrl, setBaseUrl] = useState("https://api.example.com");
  const [endpointsJson, setEndpointsJson] = useState("");
  const [outputFormat, setOutputFormat] = useState<"openapi" | "postman" | "curl">("openapi");
  const [output, setOutput] = useState("");
  const addHistory = useHistoryStore((state) => state.addHistory);
  const { toast } = useToast();

  const exampleEndpoints: APIEndpoint[] = [
    {
      method: "GET",
      path: "/users",
      description: "Get all users",
      responses: [
        {
          status: 200,
          description: "List of users",
          schema: {
            type: "array",
            items: {
              type: "object",
              properties: {
                id: { type: "string" },
                name: { type: "string" },
                email: { type: "string" },
              },
            },
          },
        },
      ],
    },
    {
      method: "POST",
      path: "/users",
      description: "Create a new user",
      requestBody: {
        contentType: "application/json",
        schema: {
          type: "object",
          properties: {
            name: { type: "string" },
            email: { type: "string" },
          },
          required: ["name", "email"],
        },
      },
      responses: [
        {
          status: 201,
          description: "User created",
        },
      ],
    },
  ];

  const handleGenerate = () => {
    try {
      let endpoints: APIEndpoint[];

      if (endpointsJson.trim()) {
        endpoints = JSON.parse(endpointsJson);
      } else {
        endpoints = exampleEndpoints;
      }

      let generated: string;

      switch (outputFormat) {
        case "openapi":
          generated = generateOpenAPI(apiTitle, apiVersion, baseUrl, endpoints);
          break;
        case "postman":
          generated = generatePostmanCollection(apiTitle, baseUrl, endpoints);
          break;
        case "curl":
          generated = generateCurlCommands(baseUrl, endpoints);
          break;
        default:
          throw new Error("Unknown format");
      }

      setOutput(generated);
      addHistory({
        tool: "api-docs-generator",
        input: `${apiTitle} - ${endpoints.length} endpoints`,
        output: generated.substring(0, 100),
      });

      toast({
        title: "Generated",
        description: `API documentation generated successfully`,
        variant: "success",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to generate",
        variant: "destructive",
      });
    }
  };

  const handleDownload = () => {
    if (!output) return;

    const extension = outputFormat === "openapi" ? "json" : outputFormat === "postman" ? "json" : "sh";
    const filename = `${apiTitle.toLowerCase().replace(/\s+/g, "-")}.${extension}`;
    const mimeType = extension === "json" ? "application/json" : "text/plain";

    downloadFile(output, filename, mimeType);
    toast({
      title: "Downloaded",
      description: `Saved as ${filename}`,
      variant: "success",
    });
  };

  const loadExample = () => {
    setEndpointsJson(JSON.stringify(exampleEndpoints, null, 2));
  };

  return (
    <div className="h-screen flex flex-col">
      <ToolHeader
        title="API Docs Generator"
        description="Generate OpenAPI, Postman, and cURL from API structure (No API keys required)"
        icon={FileCode}
      />

      <div className="flex-1 p-6 space-y-6 overflow-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>API Configuration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">API Title</label>
                <Input
                  value={apiTitle}
                  onChange={(e) => setApiTitle(e.target.value)}
                  placeholder="My API"
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Version</label>
                <Input
                  value={apiVersion}
                  onChange={(e) => setApiVersion(e.target.value)}
                  placeholder="1.0.0"
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Base URL</label>
                <Input
                  value={baseUrl}
                  onChange={(e) => setBaseUrl(e.target.value)}
                  placeholder="https://api.example.com"
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Output Format</label>
                <Select value={outputFormat} onValueChange={(v: any) => setOutputFormat(v)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="openapi">OpenAPI 3.0</SelectItem>
                    <SelectItem value="postman">Postman Collection</SelectItem>
                    <SelectItem value="curl">cURL Commands</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium">Endpoints (JSON)</label>
                  <Button variant="ghost" size="sm" onClick={loadExample}>
                    Load Example
                  </Button>
                </div>
                <Textarea
                  value={endpointsJson}
                  onChange={(e) => setEndpointsJson(e.target.value)}
                  placeholder='[{"method":"GET","path":"/users","description":"Get users"}]'
                  className="font-mono min-h-[300px]"
                />
              </div>

              <Button onClick={handleGenerate} className="w-full" size="lg">
                Generate Documentation
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Generated Documentation</CardTitle>
                {output && (
                  <Button onClick={handleDownload} size="sm" variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {!output ? (
                <EmptyState
                  icon={FileCode}
                  title="No documentation yet"
                  description="Configure your API and click 'Generate Documentation'"
                  tips={[
                    "Supports OpenAPI 3.0, Postman Collections, and cURL",
                    "Define endpoints as JSON",
                    "Click 'Load Example' to see format",
                    "100% local generation"
                  ]}
                />
              ) : (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">
                      {outputFormat === "openapi"
                        ? "OpenAPI Spec"
                        : outputFormat === "postman"
                        ? "Postman Collection"
                        : "cURL Commands"}
                    </span>
                    <CopyButton text={output} />
                  </div>
                  <CodeBlock
                    code={output}
                    language={outputFormat === "curl" ? "bash" : "json"}
                  />
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

