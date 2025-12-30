"use client";

import { useState } from "react";
import { BookOpen, Sparkles } from "lucide-react";
import { ToolHeader } from "@/components/layout/tool-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CodeBlock } from "@/components/shared/code-block";
import { EmptyState } from "@/components/shared/empty-state";
import { explainCode, type CodeExplanation } from "@/lib/utils/code-explainer";
import { useHistoryStore } from "@/lib/store/history-store";
import { useToast } from "@/lib/hooks/use-toast";
import { cn } from "@/lib/utils";

export default function CodeExplainerPage() {
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState<string>("auto");
  const [explanation, setExplanation] = useState<CodeExplanation | null>(null);
  const addHistory = useHistoryStore((state) => state.addHistory);
  const { toast } = useToast();

  const handleExplain = () => {
    if (!code.trim()) {
      toast({
        title: "Error",
        description: "Please enter some code to explain",
        variant: "destructive",
      });
      return;
    }

    try {
      const result = explainCode(code, language === "auto" ? undefined : language);
      setExplanation(result);
      addHistory({
        tool: "code-explainer",
        input: code.substring(0, 100),
        output: result.overview,
      });

      toast({
        title: "Explanation generated",
        description: "Code analyzed successfully",
        variant: "success",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to explain code",
        variant: "destructive",
      });
    }
  };

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case "simple":
        return "text-green-500";
      case "moderate":
        return "text-yellow-500";
      case "complex":
        return "text-red-500";
      default:
        return "text-muted-foreground";
    }
  };

  return (
    <div className="h-screen flex flex-col">
      <ToolHeader
        title="Code Explainer"
        description="Understand what your code does (No API keys required)"
        icon={BookOpen}
      />

      <div className="flex-1 p-6 space-y-6 overflow-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Code Input</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger>
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="auto">Auto-detect</SelectItem>
                  <SelectItem value="javascript">JavaScript</SelectItem>
                  <SelectItem value="typescript">TypeScript</SelectItem>
                  <SelectItem value="json">JSON</SelectItem>
                </SelectContent>
              </Select>

              <Textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Paste your code here..."
                className="font-mono min-h-[400px]"
              />

              <Button onClick={handleExplain} className="w-full" size="lg">
                <Sparkles className="h-4 w-4 mr-2" />
                Explain Code
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Explanation</CardTitle>
            </CardHeader>
            <CardContent>
              {!explanation ? (
                <EmptyState
                  icon={BookOpen}
                  title="No explanation yet"
                  description="Enter code and click 'Explain Code' to see what it does"
                  tips={[
                    "Supports JavaScript, TypeScript, and JSON",
                    "Explains functions, variables, and structure",
                    "Detects algorithms and patterns",
                    "100% local - no data sent to servers"
                  ]}
                />
              ) : (
                <div className="space-y-6">
                  {/* Overview */}
                  <div>
                    <h3 className="font-semibold mb-2 flex items-center gap-2">
                      Overview
                      <Badge
                        variant="outline"
                        className={cn(getComplexityColor(explanation.complexity))}
                      >
                        {explanation.complexity}
                      </Badge>
                    </h3>
                    <p className="text-sm text-muted-foreground">{explanation.overview}</p>
                  </div>

                  {/* Structure */}
                  <div>
                    <h3 className="font-semibold mb-2">Structure</h3>
                    <p className="text-sm text-muted-foreground">{explanation.structure}</p>
                  </div>

                  {/* Functions */}
                  {explanation.functions.length > 0 && (
                    <div>
                      <h3 className="font-semibold mb-3">
                        Functions ({explanation.functions.length})
                      </h3>
                      <div className="space-y-3">
                        {explanation.functions.map((func, index) => (
                          <div key={index} className="p-3 rounded-lg bg-accent">
                            <div className="font-medium mb-1">{func.name}</div>
                            <p className="text-sm text-muted-foreground mb-2">
                              {func.description}
                            </p>
                            {func.parameters.length > 0 && (
                              <div className="text-xs text-muted-foreground mb-1">
                                Parameters: {func.parameters.join(", ")}
                              </div>
                            )}
                            {func.returns && (
                              <div className="text-xs text-muted-foreground mb-1">
                                Returns: {func.returns}
                              </div>
                            )}
                            {func.algorithm && (
                              <Badge variant="secondary" className="text-xs mt-2">
                                Algorithm: {func.algorithm}
                              </Badge>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Variables */}
                  {explanation.variables.length > 0 && (
                    <div>
                      <h3 className="font-semibold mb-3">
                        Variables ({explanation.variables.length})
                      </h3>
                      <div className="space-y-2">
                        {explanation.variables.map((variable, index) => (
                          <div key={index} className="p-2 rounded bg-accent/50">
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-sm font-medium">
                                {variable.name}
                              </span>
                              <Badge variant="outline" className="text-xs">
                                {variable.type}
                              </Badge>
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">
                              {variable.purpose}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Suggestions */}
                  {explanation.suggestions.length > 0 && (
                    <div>
                      <h3 className="font-semibold mb-3">Suggestions</h3>
                      <ul className="space-y-1">
                        {explanation.suggestions.map((suggestion, index) => (
                          <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                            <span className="text-primary mt-1">•</span>
                            <span>{suggestion}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}






