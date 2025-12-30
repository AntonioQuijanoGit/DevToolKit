"use client";

import { useState, useMemo } from "react";
import { TestTube } from "lucide-react";
import { ToolHeader } from "@/components/layout/tool-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { CopyButton } from "@/components/shared/copy-button";
import { EmptyState } from "@/components/shared/empty-state";
import { examples } from "@/lib/constants/examples";

const commonPatterns = [
  { name: "Email", pattern: "\\b\\w+@\\w+\\.\\w+\\b" },
  { name: "Phone", pattern: "\\+?\\d{1,4}?[-.\\s]?\\(?\\d{1,3}?\\)?[-.\\s]?\\d{1,4}[-.\\s]?\\d{1,4}[-.\\s]?\\d{1,9}" },
  { name: "URL", pattern: "https?:\\/\\/(www\\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}\\b([-a-zA-Z0-9()@:%_\\+.~#?&//=]*)" },
  { name: "IPv4", pattern: "\\b(?:\\d{1,3}\\.){3}\\d{1,3}\\b" },
  { name: "Hex Color", pattern: "#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})" },
];

export default function RegexTesterPage() {
  const [pattern, setPattern] = useState("");
  const [flags, setFlags] = useState("g");
  const [testString, setTestString] = useState("");
  const [error, setError] = useState<string | null>(null);

  const matches = useMemo(() => {
    if (!pattern || !testString) return [];
    
    try {
      const regex = new RegExp(pattern, flags);
      const matchArray = Array.from(testString.matchAll(regex));
      setError(null);
      return matchArray;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Invalid regex pattern");
      return [];
    }
  }, [pattern, flags, testString]);

  const handlePatternSelect = (selectedPattern: string) => {
    setPattern(selectedPattern);
  };

  const handleClear = () => {
    setPattern("");
    setFlags("g");
    setTestString("");
    setError(null);
  };

  const handleExample = () => {
    setPattern(examples["regex-tester"].pattern);
    setTestString(examples["regex-tester"].testString);
  };

  return (
    <div className="h-screen flex flex-col">
      <ToolHeader
        title="Regex Tester"
        description="Test and debug regular expressions"
        icon={TestTube}
      />

      <div className="flex-1 p-6 space-y-4 overflow-hidden">
        {/* Pattern Input */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Pattern</CardTitle>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={handleExample}>
                  Example
                </Button>
                <Button variant="ghost" size="sm" onClick={handleClear}>
                  Clear
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                value={pattern}
                onChange={(e) => setPattern(e.target.value)}
                placeholder="Enter regex pattern..."
                className="font-mono"
              />
              <div className="flex gap-1">
                {["g", "i", "m"].map((flag) => (
                  <Button
                    key={flag}
                    variant={flags.includes(flag) ? "default" : "outline"}
                    size="sm"
                    onClick={() => {
                      setFlags(
                        flags.includes(flag)
                          ? flags.replace(flag, "")
                          : flags + flag
                      );
                    }}
                  >
                    {flag}
                  </Button>
                ))}
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <span className="text-sm text-muted-foreground">Common:</span>
              {commonPatterns.map((p) => (
                <Button
                  key={p.name}
                  variant="ghost"
                  size="sm"
                  onClick={() => handlePatternSelect(p.pattern)}
                >
                  {p.name}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-2 gap-4 flex-1 overflow-hidden">
          {/* Test String */}
          <Card className="flex flex-col overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <CardTitle>Test String</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 overflow-hidden">
              <Textarea
                value={testString}
                onChange={(e) => setTestString(e.target.value)}
                placeholder="Enter text to test against the pattern..."
                className="h-full font-mono text-sm resize-none"
              />
            </CardContent>
          </Card>

          {/* Results */}
          <Card className="flex flex-col overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <CardTitle>Matches ({matches.length})</CardTitle>
              {matches.length > 0 && (
                <CopyButton
                  text={matches.map((m) => m[0]).join("\n")}
                />
              )}
            </CardHeader>
            <CardContent className="flex-1 overflow-auto">
              {error ? (
                <div className="text-center py-8">
                  <p className="text-destructive font-semibold mb-2">Error</p>
                  <p className="text-sm text-muted-foreground">{error}</p>
                </div>
              ) : matches.length > 0 ? (
                <div className="space-y-2">
                  {matches.map((match, index) => (
                    <div
                      key={index}
                      className="p-3 rounded-lg bg-accent border border-border"
                    >
                      <div className="font-mono text-sm mb-1">
                        <Badge variant="secondary" className="mr-2">
                          #{index + 1}
                        </Badge>
                        {match[0]}
                      </div>
                      {match.length > 1 && (
                        <div className="text-xs text-muted-foreground mt-2">
                          Groups: {match.slice(1).map((g, i) => (
                            <span key={i} className="ml-2">
                              ${i + 1}: {g}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <EmptyState
                  icon={TestTube}
                  title="No matches"
                  description="Enter a pattern and test string to see matches"
                />
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}






