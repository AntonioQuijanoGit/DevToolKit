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
import { HowToUse } from "@/components/shared/how-to-use";
import { ErrorDisplay } from "@/components/shared/error-display";
import {
  validateGraphQL,
  formatGraphQL,
  minifyGraphQL,
  buildGraphQLQuery,
} from "@/lib/utils/graphql-utils";
import { useHistoryStore } from "@/lib/store/history-store";
import { useToast } from "@/lib/hooks/use-toast";
import { examples } from "@/lib/constants/examples";

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

  const handleExample = () => {
    const example = examples["graphql-tools"];
    if (example && typeof example === "string") {
      setQuery(example);
    }
  };

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

      <div className="flex-1 p-3 sm:p-4 md:p-6 space-y-3 sm:space-y-4 md:space-y-6 overflow-auto pb-20 sm:pb-24">
        <HowToUse
          steps={[
            "Select a tool tab (Query Builder, Formatter, or Validator)",
            "In Builder: Enter query name and fields to build a GraphQL query",
            "In Formatter: Paste your query and format it",
            "In Validator: Check your query for syntax errors",
          ]}
        />
        <Tabs defaultValue="builder" className="space-y-3 sm:space-y-4 md:space-y-6">
          <TabsList className="mb-3 sm:mb-4">
            <TabsTrigger value="builder" className="text-xs sm:text-sm">Query Builder</TabsTrigger>
            <TabsTrigger value="formatter" className="text-xs sm:text-sm">Formatter</TabsTrigger>
            <TabsTrigger value="validator" className="text-xs sm:text-sm">Validator</TabsTrigger>
          </TabsList>

          <TabsContent value="builder" className="space-y-3 sm:space-y-4 md:space-y-6">
            <Card>
              <CardHeader className="p-4 sm:p-6 border-b">
                <CardTitle className="text-base sm:text-lg font-semibold">Build GraphQL Query</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 sm:space-y-4 p-4 sm:p-6">
                <div>
                  <label className="text-xs sm:text-sm font-medium mb-2 block">Query Name</label>
                  <Input
                    value={builderName}
                    onChange={(e) => setBuilderName(e.target.value)}
                    placeholder="GetUsers"
                    className="min-h-[44px] text-sm sm:text-base"
                  />
                </div>

                <div>
                  <label className="text-xs sm:text-sm font-medium mb-2 block">Fields (one per line)</label>
                  <Textarea
                    value={builderFields}
                    onChange={(e) => setBuilderFields(e.target.value)}
                    placeholder="id\nname\nemail"
                    className="font-mono min-h-[150px] sm:min-h-[200px] text-xs sm:text-sm resize-y"
                  />
                </div>

                <div>
                  <label className="text-xs sm:text-sm font-medium mb-2 block">
                    Variables (optional, format: name:Type:required)
                  </label>
                  <Textarea
                    value={builderVars}
                    onChange={(e) => setBuilderVars(e.target.value)}
                    placeholder="id:ID:required\nlimit:Int"
                    className="font-mono min-h-[80px] sm:min-h-[100px] text-xs sm:text-sm resize-y"
                  />
                </div>

                <Button onClick={handleBuild} className="w-full min-h-[44px] text-sm sm:text-base">
                  Build Query
                </Button>

                {formatted && (
                  <div className="space-y-2">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0">
                      <span className="text-xs sm:text-sm font-medium">Generated Query</span>
                      <CopyButton text={formatted} />
                    </div>
                    <CodeBlock code={formatted} language="graphql" />
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="formatter" className="space-y-3 sm:space-y-4 md:space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
              <Card className="min-h-[400px] sm:min-h-[500px]">
                <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0 p-4 sm:p-6 border-b">
                  <CardTitle className="text-base sm:text-lg font-semibold">Input Query</CardTitle>
                  <Button variant="outline" size="sm" onClick={handleExample} className="text-xs sm:text-sm ">
                    Example
                  </Button>
                </CardHeader>
                <CardContent className="space-y-3 sm:space-y-4 p-4 sm:p-6">
                  <Textarea
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="query { users { id name } }"
                    className="font-mono min-h-[300px] sm:min-h-[400px] text-xs sm:text-sm resize-y"
                  />
                  <div className="flex flex-col sm:flex-row gap-2">
                    <Button onClick={handleFormat} className="flex-1 min-h-[44px] text-sm sm:text-base">
                      Format
                    </Button>
                    <Button onClick={handleMinify} variant="outline" className="flex-1 min-h-[44px] text-sm sm:text-base">
                      Minify
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="min-h-[400px] sm:min-h-[500px]">
                <CardHeader className="p-4 sm:p-6 border-b">
                  <CardTitle className="text-base sm:text-lg font-semibold">Result</CardTitle>
                </CardHeader>
                <CardContent className="p-4 sm:p-6 overflow-auto">
                  {!formatted && !minified ? (
                    <EmptyState
                      icon={Network}
                      title="No result yet"
                      description="Enter a query and format or minify it"
                    />
                  ) : (
                    <div className="space-y-3 sm:space-y-4">
                      {formatted && (
                        <div>
                          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0 mb-2">
                            <span className="text-xs sm:text-sm font-medium">Formatted</span>
                            <CopyButton text={formatted} />
                          </div>
                          <CodeBlock code={formatted} language="graphql" />
                        </div>
                      )}
                      {minified && (
                        <div>
                          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0 mb-2">
                            <span className="text-xs sm:text-sm font-medium">Minified</span>
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

          <TabsContent value="validator" className="space-y-3 sm:space-y-4 md:space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
              <Card className="min-h-[400px] sm:min-h-[500px]">
                <CardHeader className="p-4 sm:p-6 border-b">
                  <CardTitle className="text-base sm:text-lg font-semibold">Input Query</CardTitle>
                </CardHeader>
                <CardContent className="p-4 sm:p-6">
                  <Textarea
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="query { users { id name } }"
                    className="font-mono min-h-[300px] sm:min-h-[400px] text-xs sm:text-sm resize-y"
                  />
                  <Button onClick={handleValidate} className="w-full mt-3 sm:mt-4 min-h-[44px] text-sm sm:text-base">
                    Validate Query
                  </Button>
                </CardContent>
              </Card>

              <Card className="min-h-[400px] sm:min-h-[500px]">
                <CardHeader className="p-4 sm:p-6 border-b">
                  <CardTitle className="text-base sm:text-lg font-semibold">Validation Results</CardTitle>
                </CardHeader>
                <CardContent className="p-4 sm:p-6 overflow-auto">
                  {!validation ? (
                    <EmptyState
                      icon={Network}
                      title="No validation yet"
                      description="Enter a query and click 'Validate Query'"
                    />
                  ) : (
                    <div className="space-y-3 sm:space-y-4">
                      <div className="flex items-center gap-2">
                        <Badge
                          variant={validation.valid ? "default" : "destructive"}
                          className="text-sm sm:text-base md:text-lg px-2 sm:px-3 py-1"
                        >
                          {validation.valid ? "Valid" : "Invalid"}
                        </Badge>
                      </div>

                      {validation.errors.length > 0 && (
                        <div>
                          <h4 className="font-semibold text-xs sm:text-sm mb-2 text-destructive">
                            Errors ({validation.errors.length})
                          </h4>
                          <ul className="space-y-1">
                            {validation.errors.map((error: string, index: number) => (
                              <li key={index} className="text-xs sm:text-sm text-destructive break-words">
                                • {error}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {validation.warnings.length > 0 && (
                        <div>
                          <h4 className="font-semibold text-xs sm:text-sm mb-2 text-yellow-500">
                            Warnings ({validation.warnings.length})
                          </h4>
                          <ul className="space-y-1">
                            {validation.warnings.map((warning: string, index: number) => (
                              <li key={index} className="text-xs sm:text-sm text-yellow-500 break-words">
                                • {warning}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {validation.valid && validation.errors.length === 0 && (
                        <div className="text-center py-4 text-green-500 text-sm sm:text-base">
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

