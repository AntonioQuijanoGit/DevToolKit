"use client";

import { useState } from "react";
import { Network } from "lucide-react";
import { ToolHeader } from "@/components/layout/tool-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { CodeBlock } from "@/components/shared/code-block";
import { CopyButton } from "@/components/shared/copy-button";
import { EmptyState } from "@/components/shared/empty-state";
import { ErrorDisplay } from "@/components/shared/error-display";
import {
  validateGraphQL,
  formatGraphQL,
  minifyGraphQL,
  buildGraphQLQuery,
} from "@/lib/utils/graphql-utils";
import { useHistoryStore } from "@/lib/store/history-store";
import { useToast } from "@/lib/hooks/use-toast";

export default function GraphQLToolsPage() {
  const [query, setQuery] = useState("");
  const [formatted, setFormatted] = useState("");
  const [minified, setMinified] = useState("");
  const [validation, setValidation] = useState<any>(null);
  const [builderName, setBuilderName] = useState("");
  const [builderFields, setBuilderFields] = useState("");
  const [builderVars, setBuilderVars] = useState("");
  const addHistory = useHistoryStore((state) => state.addHistory);
  const { toast } = useToast();

  const handleFormat = () => {
    if (!query.trim()) {
      toast({
        title: "Error",
        description: "Please enter a GraphQL query",
        variant: "destructive",
      });
      return;
    }

    try {
      const formattedQuery = formatGraphQL(query);
      setFormatted(formattedQuery);
      addHistory({
        tool: "graphql-tools",
        input: query.substring(0, 100),
        output: formattedQuery.substring(0, 100),
      });
      toast({
        title: "Formatted",
        description: "GraphQL query formatted successfully",
        variant: "success",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to format query",
        variant: "destructive",
      });
    }
  };

  const handleMinify = () => {
    if (!query.trim()) {
      toast({
        title: "Error",
        description: "Please enter a GraphQL query",
        variant: "destructive",
      });
      return;
    }

    try {
      const minifiedQuery = minifyGraphQL(query);
      setMinified(minifiedQuery);
      toast({
        title: "Minified",
        description: "GraphQL query minified successfully",
        variant: "success",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to minify query",
        variant: "destructive",
      });
    }
  };

  const handleValidate = () => {
    if (!query.trim()) {
      toast({
        title: "Error",
        description: "Please enter a GraphQL query",
        variant: "destructive",
      });
      return;
    }

    const result = validateGraphQL(query);
    setValidation(result);
    
    if (result.valid) {
      toast({
        title: "Valid",
        description: "GraphQL query is valid",
        variant: "success",
      });
    } else {
      toast({
        title: "Invalid",
        description: `Found ${result.errors.length} error(s)`,
        variant: "destructive",
      });
    }
  };

  const handleBuild = () => {
    if (!builderName.trim() || !builderFields.trim()) {
      toast({
        title: "Error",
        description: "Name and fields are required",
        variant: "destructive",
      });
      return;
    }

    try {
      const fields = builderFields.split("\n").filter((f) => f.trim());
      let variables: Record<string, { type: string; required: boolean }> | undefined;

      if (builderVars.trim()) {
        variables = {};
        builderVars.split("\n").forEach((line) => {
          const [name, type, required] = line.split(":").map((s) => s.trim());
          if (name && type) {
            variables![name] = {
              type,
              required: required === "!" || required === "required",
            };
          }
        });
      }

      const built = buildGraphQLQuery("query", builderName, fields, variables);
      setQuery(built);
      setFormatted(built);
      
      toast({
        title: "Built",
        description: "GraphQL query built successfully",
        variant: "success",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to build query",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="h-screen flex flex-col">
      <ToolHeader
        title="GraphQL Tools"
        description="Build, validate, and format GraphQL queries (No API keys required)"
        icon={Network}
      />

      <div className="flex-1 p-6 space-y-6 overflow-auto">
        <Tabs defaultValue="builder" className="space-y-6">
          <TabsList>
            <TabsTrigger value="builder">Query Builder</TabsTrigger>
            <TabsTrigger value="formatter">Formatter</TabsTrigger>
            <TabsTrigger value="validator">Validator</TabsTrigger>
          </TabsList>

          <TabsContent value="builder" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Build GraphQL Query</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Query Name</label>
                  <Input
                    value={builderName}
                    onChange={(e) => setBuilderName(e.target.value)}
                    placeholder="GetUsers"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Fields (one per line)</label>
                  <Textarea
                    value={builderFields}
                    onChange={(e) => setBuilderFields(e.target.value)}
                    placeholder="id\nname\nemail"
                    className="font-mono min-h-[200px]"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Variables (optional, format: name:Type:required)
                  </label>
                  <Textarea
                    value={builderVars}
                    onChange={(e) => setBuilderVars(e.target.value)}
                    placeholder="id:ID:required\nlimit:Int"
                    className="font-mono min-h-[100px]"
                  />
                </div>

                <Button onClick={handleBuild} className="w-full">
                  Build Query
                </Button>

                {formatted && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Generated Query</span>
                      <CopyButton text={formatted} />
                    </div>
                    <CodeBlock code={formatted} language="graphql" />
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="formatter" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Input Query</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Textarea
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="query { users { id name } }"
                    className="font-mono min-h-[400px]"
                  />
                  <div className="flex gap-2">
                    <Button onClick={handleFormat} className="flex-1">
                      Format
                    </Button>
                    <Button onClick={handleMinify} variant="outline" className="flex-1">
                      Minify
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Result</CardTitle>
                </CardHeader>
                <CardContent>
                  {!formatted && !minified ? (
                    <EmptyState
                      icon={Network}
                      title="No result yet"
                      description="Enter a query and format or minify it"
                    />
                  ) : (
                    <div className="space-y-4">
                      {formatted && (
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium">Formatted</span>
                            <CopyButton text={formatted} />
                          </div>
                          <CodeBlock code={formatted} language="graphql" />
                        </div>
                      )}
                      {minified && (
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium">Minified</span>
                            <CopyButton text={minified} />
                          </div>
                          <CodeBlock code={minified} language="graphql" />
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="validator" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Input Query</CardTitle>
                </CardHeader>
                <CardContent>
                  <Textarea
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="query { users { id name } }"
                    className="font-mono min-h-[400px]"
                  />
                  <Button onClick={handleValidate} className="w-full mt-4">
                    Validate Query
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Validation Results</CardTitle>
                </CardHeader>
                <CardContent>
                  {!validation ? (
                    <EmptyState
                      icon={Network}
                      title="No validation yet"
                      description="Enter a query and click 'Validate Query'"
                    />
                  ) : (
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <Badge
                          variant={validation.valid ? "default" : "destructive"}
                          className="text-lg px-3 py-1"
                        >
                          {validation.valid ? "Valid" : "Invalid"}
                        </Badge>
                      </div>

                      {validation.errors.length > 0 && (
                        <div>
                          <h4 className="font-semibold text-sm mb-2 text-destructive">
                            Errors ({validation.errors.length})
                          </h4>
                          <ul className="space-y-1">
                            {validation.errors.map((error: string, index: number) => (
                              <li key={index} className="text-sm text-destructive">
                                • {error}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {validation.warnings.length > 0 && (
                        <div>
                          <h4 className="font-semibold text-sm mb-2 text-yellow-500">
                            Warnings ({validation.warnings.length})
                          </h4>
                          <ul className="space-y-1">
                            {validation.warnings.map((warning: string, index: number) => (
                              <li key={index} className="text-sm text-yellow-500">
                                • {warning}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {validation.valid && validation.errors.length === 0 && (
                        <div className="text-center py-4 text-green-500">
                          ✓ Query is valid!
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

