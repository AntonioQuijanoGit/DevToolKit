"use client";

import { useState } from "react";
import { Code2, Sparkles, AlertTriangle, CheckCircle2, Info } from "lucide-react";
import { ToolHeader } from "@/components/layout/tool-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CodeBlock } from "@/components/shared/code-block";
import { CopyButton } from "@/components/shared/copy-button";
import { EmptyState } from "@/components/shared/empty-state";
import { analyzeCode, type AnalysisResult, type CodeIssue } from "@/lib/utils/code-analyzer";
import { useHistoryStore } from "@/lib/store/history-store";
import { useToast } from "@/lib/hooks/use-toast";
import { cn } from "@/lib/utils";

export default function CodeAnalyzerPage() {
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState<string>("auto");
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const addHistory = useHistoryStore((state) => state.addHistory);
  const { toast } = useToast();

  const handleAnalyze = () => {
    if (!code.trim()) {
      toast({
        title: "Error",
        description: "Please enter some code to analyze",
        variant: "destructive",
      });
      return;
    }

    try {
      const analysis = analyzeCode(code, language === "auto" ? undefined : language);
      setResult(analysis);
      addHistory({
        tool: "code-analyzer",
        input: code.substring(0, 100),
        output: `Found ${analysis.summary.total} issues (Score: ${analysis.score}/100)`,
      });
      
      toast({
        title: "Analysis complete",
        description: `Found ${analysis.summary.total} issue(s)`,
        variant: analysis.summary.errors > 0 ? "destructive" : "default",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to analyze code",
        variant: "destructive",
      });
    }
  };

  const getIssueIcon = (type: CodeIssue["type"]) => {
    switch (type) {
      case "error":
        return <AlertTriangle className="h-4 w-4 text-destructive" />;
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case "suggestion":
        return <Info className="h-4 w-4 text-blue-500" />;
      default:
        return <Info className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-500";
    if (score >= 60) return "text-yellow-500";
    return "text-red-500";
  };

  return (
    <div className="h-screen flex flex-col">
      <ToolHeader
        title="Code Analyzer"
        description="Analyze your code and get intelligent suggestions (No API keys required)"
        icon={Code2}
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
                  <SelectItem value="sql">SQL</SelectItem>
                </SelectContent>
              </Select>

              <Textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Paste your code here..."
                className="font-mono min-h-[400px]"
              />

              <Button onClick={handleAnalyze} className="w-full" size="lg">
                <Sparkles className="h-4 w-4 mr-2" />
                Analyze Code
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Analysis Results</CardTitle>
            </CardHeader>
            <CardContent>
              {!result ? (
                <EmptyState
                  icon={Code2}
                  title="No analysis yet"
                  description="Enter code and click 'Analyze Code' to see results"
                  tips={[
                    "Supports JavaScript, TypeScript, JSON, and SQL",
                    "Detects common issues and anti-patterns",
                    "Suggests improvements based on best practices",
                    "100% local - no data sent to servers"
                  ]}
                />
              ) : (
                <div className="space-y-4">
                  {/* Score */}
                  <div className="p-4 rounded-lg bg-accent">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Code Quality Score</span>
                      <Badge
                        variant={result.score >= 80 ? "default" : result.score >= 60 ? "secondary" : "destructive"}
                        className="text-lg px-3 py-1"
                      >
                        {result.score}/100
                      </Badge>
                    </div>
                    <div className="mt-2 h-2 bg-background rounded-full overflow-hidden">
                      <div
                        className={cn("h-full transition-all", {
                          "bg-green-500": result.score >= 80,
                          "bg-yellow-500": result.score >= 60 && result.score < 80,
                          "bg-red-500": result.score < 60,
                        })}
                        style={{ width: `${result.score}%` }}
                      />
                    </div>
                  </div>

                  {/* Summary */}
                  <div className="grid grid-cols-3 gap-2">
                    <div className="p-3 rounded-lg bg-destructive/10 text-center">
                      <div className="text-2xl font-bold text-destructive">{result.summary.errors}</div>
                      <div className="text-xs text-muted-foreground">Errors</div>
                    </div>
                    <div className="p-3 rounded-lg bg-yellow-500/10 text-center">
                      <div className="text-2xl font-bold text-yellow-500">{result.summary.warnings}</div>
                      <div className="text-xs text-muted-foreground">Warnings</div>
                    </div>
                    <div className="p-3 rounded-lg bg-blue-500/10 text-center">
                      <div className="text-2xl font-bold text-blue-500">{result.summary.suggestions}</div>
                      <div className="text-xs text-muted-foreground">Suggestions</div>
                    </div>
                  </div>

                  {/* Issues */}
                  {result.issues.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="font-semibold text-sm">Issues Found</h4>
                      <div className="space-y-2 max-h-[400px] overflow-y-auto">
                        {result.issues.map((issue, index) => (
                          <div
                            key={index}
                            className={cn(
                              "p-3 rounded-lg border",
                              {
                                "border-destructive bg-destructive/5": issue.type === "error",
                                "border-yellow-500 bg-yellow-500/5": issue.type === "warning",
                                "border-blue-500 bg-blue-500/5": issue.type === "suggestion",
                                "border-muted bg-muted/50": issue.type === "info",
                              }
                            )}
                          >
                            <div className="flex items-start gap-2">
                              {getIssueIcon(issue.type)}
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="text-sm font-medium">{issue.message}</span>
                                  {issue.line && (
                                    <Badge variant="outline" className="text-xs">
                                      Line {issue.line}
                                    </Badge>
                                  )}
                                  <Badge
                                    variant="outline"
                                    className={cn("text-xs", {
                                      "border-red-500": issue.severity === "high",
                                      "border-yellow-500": issue.severity === "medium",
                                      "border-blue-500": issue.severity === "low",
                                    })}
                                  >
                                    {issue.severity}
                                  </Badge>
                                </div>
                                {issue.suggestion && (
                                  <p className="text-xs text-muted-foreground mt-1">
                                    💡 {issue.suggestion}
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {result.issues.length === 0 && (
                    <div className="text-center py-8">
                      <CheckCircle2 className="h-12 w-12 text-green-500 mx-auto mb-4" />
                      <p className="font-semibold">No issues found!</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Your code looks good 👍
                      </p>
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

