"use client";

import { useState } from "react";
import { FileText } from "lucide-react";
import { ToolHeader } from "@/components/layout/tool-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CodeBlock } from "@/components/shared/code-block";
import { CopyButton } from "@/components/shared/copy-button";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/shared/empty-state";

export default function ShellFormatterPage() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [errors, setErrors] = useState<string[]>([]);
  const [warnings, setWarnings] = useState<string[]>([]);

  const formatScript = () => {
    if (!input.trim()) return;

    const lines = input.split("\n");
    const formatted: string[] = [];
    let indentLevel = 0;
    const indentSize = 2;
    const newErrors: string[] = [];
    const newWarnings: string[] = [];

    lines.forEach((line, index) => {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) {
        formatted.push(trimmed);
        return;
      }

      // Check for common issues
      if (trimmed.includes("[ ") && !trimmed.includes("[[ ")) {
        newWarnings.push(`Line ${index + 1}: Consider using [[ instead of [ for better compatibility`);
      }

      if (trimmed.includes("==") && trimmed.includes("[")) {
        newWarnings.push(`Line ${index + 1}: Use = instead of == in [ ] tests`);
      }

      // Handle closing braces
      if (trimmed === "fi" || trimmed === "done" || trimmed === "esac" || trimmed === "}") {
        indentLevel = Math.max(0, indentLevel - 1);
      }

      // Add formatted line with indentation
      formatted.push(" ".repeat(indentLevel * indentSize) + trimmed);

      // Handle opening structures
      if (trimmed.endsWith("then") || trimmed.endsWith("do") || trimmed.endsWith("{")) {
        indentLevel++;
      } else if (trimmed.startsWith("if ") || trimmed.startsWith("for ") || trimmed.startsWith("while ")) {
        indentLevel++;
      }
    });

    setOutput(formatted.join("\n"));
    setErrors(newErrors);
    setWarnings(newWarnings);
  };

  const validateScript = () => {
    if (!input.trim()) return;

    const newErrors: string[] = [];
    const lines = input.split("\n");
    let openIf = 0;
    let openFor = 0;
    let openWhile = 0;

    lines.forEach((line, index) => {
      const trimmed = line.trim();
      
      // Count control structures
      if (trimmed.startsWith("if ")) openIf++;
      if (trimmed === "fi") openIf--;
      if (trimmed.startsWith("for ")) openFor++;
      if (trimmed === "done") {
        openFor--;
        openWhile--;
      }
      if (trimmed.startsWith("while ")) openWhile++;

      // Check for unclosed structures
      if (index === lines.length - 1) {
        if (openIf > 0) newErrors.push("Unclosed if statement");
        if (openFor > 0) newErrors.push("Unclosed for loop");
        if (openWhile > 0) newErrors.push("Unclosed while loop");
      }
    });

    setErrors(newErrors);
    if (newErrors.length === 0) {
      setOutput("✓ Script is valid");
    } else {
      setOutput("✗ Script has errors");
    }
  };

  const handleClear = () => {
    setInput("");
    setOutput("");
    setErrors([]);
    setWarnings([]);
  };

  const handleExample = () => {
    setInput(`if [ "$var" = "test" ];then
echo "yes"
fi

for i in 1 2 3;do
echo $i
done`);
  };

  return (
    <div className="h-screen flex flex-col">
      <ToolHeader
        title="Shell Script Formatter"
        description="Format and validate bash scripts"
        icon={FileText}
      />

      <div className="flex-1 p-3 sm:p-4 md:p-6 space-y-3 sm:space-y-4 overflow-auto pb-20 sm:pb-24">
        <Tabs defaultValue="format" className="h-full flex flex-col">
          <TabsList className="mb-3 sm:mb-4">
            <TabsTrigger value="format" className="text-xs sm:text-sm">Format</TabsTrigger>
            <TabsTrigger value="validate" className="text-xs sm:text-sm">Validate</TabsTrigger>
          </TabsList>

          <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
            <Card className="flex flex-col overflow-hidden min-h-[400px] sm:min-h-[500px]">
              <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0 pb-3 p-4 sm:p-6 border-b">
                <CardTitle className="text-base sm:text-lg font-semibold">Input</CardTitle>
                <div className="flex gap-2 flex-wrap">
                  <Button variant="outline" size="sm" onClick={handleExample} className="text-xs sm:text-sm min-h-[36px]">
                    Example
                  </Button>
                  <Button variant="ghost" size="sm" onClick={handleClear} className="text-xs sm:text-sm min-h-[36px]">
                    Clear
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="flex-1 overflow-hidden p-4 sm:p-6">
                <Textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Paste your bash script here..."
                  className="h-full font-mono text-xs sm:text-sm resize-none min-h-[200px]"
                />
              </CardContent>
            </Card>

            <Card className="flex flex-col overflow-hidden min-h-[400px] sm:min-h-[500px]">
              <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0 pb-3 p-4 sm:p-6 border-b">
                <CardTitle className="text-base sm:text-lg font-semibold">Output</CardTitle>
                {output && <CopyButton text={output} />}
              </CardHeader>
              <CardContent className="flex-1 overflow-hidden space-y-3 sm:space-y-4 p-4 sm:p-6">
                {output ? (
                  <>
                    <CodeBlock code={output} language="bash" />
                    {errors.length > 0 && (
                      <div>
                        <Badge variant="destructive" className="mb-2 text-[10px] sm:text-xs">
                          Errors ({errors.length})
                        </Badge>
                        <div className="space-y-1">
                          {errors.map((error, i) => (
                            <p key={i} className="text-[10px] sm:text-xs text-destructive break-words">
                              {error}
                            </p>
                          ))}
                        </div>
                      </div>
                    )}
                    {warnings.length > 0 && (
                      <div>
                        <Badge variant="outline" className="mb-2 text-[10px] sm:text-xs">
                          Warnings ({warnings.length})
                        </Badge>
                        <div className="space-y-1">
                          {warnings.map((warning, i) => (
                            <p key={i} className="text-[10px] sm:text-xs text-muted-foreground break-words">
                              {warning}
                            </p>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <EmptyState
                    icon={FileText}
                    title="No output"
                    description="Format or validate your script to see results"
                  />
                )}
              </CardContent>
            </Card>
          </div>
        </Tabs>
      </div>

      <div className="sticky bottom-0 left-0 right-0 border-t border-border bg-card/95 backdrop-blur-sm p-3 sm:p-4 md:p-5 z-10 shadow-lg">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-center gap-2 sm:gap-3">
          <Button onClick={formatScript} size="lg" disabled={!input.trim()} className="w-full sm:w-auto min-h-[44px] text-sm sm:text-base">
            Format
          </Button>
          <Button variant="outline" onClick={validateScript} size="lg" disabled={!input.trim()} className="w-full sm:w-auto min-h-[44px] text-sm sm:text-base">
            Validate
          </Button>
        </div>
      </div>
    </div>
  );
}






