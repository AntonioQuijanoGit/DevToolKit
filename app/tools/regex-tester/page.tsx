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
import { HowToUse } from "@/components/shared/how-to-use";
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

      <div className="flex-1 p-3 sm:p-4 md:p-6 space-y-3 sm:space-y-4 overflow-auto pb-20 sm:pb-24">
        <HowToUse
          steps={[
            "Enter your regex pattern in the pattern field",
            "Select regex flags (global, case-insensitive, multiline)",
            "Enter test string to match against",
            "View matches, groups, and test results in real-time",
          ]}
        />
        {/* Pattern Input */}
        <Card>
          <CardHeader className="p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0">
              <CardTitle className="text-base sm:text-lg font-semibold">Pattern</CardTitle>
              <div className="flex gap-2 flex-wrap">
                <Button variant="outline" size="sm" onClick={handleExample} className="text-xs sm:text-sm ">
                  Example
                </Button>
                <Button variant="ghost" size="sm" onClick={handleClear} className="text-xs sm:text-sm ">
                  Clear
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-3 sm:space-y-4 p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row gap-2">
              <Input
                value={pattern}
                onChange={(e) => setPattern(e.target.value)}
                placeholder="Enter regex pattern..."
                className="font-mono flex-1 min-h-[44px] text-sm sm:text-base"
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
                    className="min-h-[44px] min-w-[44px] text-sm sm:text-base"
                  >
                    {flag}
                  </Button>
                ))}
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <span className="text-xs sm:text-sm text-muted-foreground">Common:</span>
              {commonPatterns.map((p) => (
                <Button
                  key={p.name}
                  variant="ghost"
                  size="sm"
                  onClick={() => handlePatternSelect(p.pattern)}
                  className="text-xs sm:text-sm "
                >
                  {p.name}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
          {/* Test String */}
          <Card className="flex flex-col overflow-hidden min-h-[300px] sm:min-h-[400px]">
            <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0 pb-3 p-4 sm:p-6 border-b">
              <CardTitle className="text-base sm:text-lg font-semibold">Test String</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 overflow-hidden p-4 sm:p-6">
              <Textarea
                value={testString}
                onChange={(e) => setTestString(e.target.value)}
                placeholder="Enter text to test against the pattern..."
                className="h-full font-mono text-xs sm:text-sm resize-none min-h-[200px]"
              />
            </CardContent>
          </Card>

          {/* Results */}
          <Card className="flex flex-col overflow-hidden min-h-[300px] sm:min-h-[400px]">
            <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0 pb-3 p-4 sm:p-6 border-b">
              <CardTitle className="text-base sm:text-lg font-semibold">Matches ({matches.length})</CardTitle>
              {matches.length > 0 && (
                <CopyButton
                  text={matches.map((m) => m[0]).join("\n")}
                />
              )}
            </CardHeader>
            <CardContent className="flex-1 overflow-auto p-4 sm:p-6">
              {error ? (
                <div className="text-center py-8 px-4">
                  <p className="text-destructive font-semibold mb-2 text-sm sm:text-base">Error</p>
                  <p className="text-xs sm:text-sm text-muted-foreground">{error}</p>
                </div>
              ) : matches.length > 0 ? (
                <div className="space-y-2">
                  {matches.map((match, index) => (
                    <div
                      key={index}
                      className="p-3 rounded-lg bg-accent border border-border"
                    >
                      <div className="font-mono text-xs sm:text-sm mb-1 break-words">
                        <Badge variant="secondary" className="mr-2 text-[10px] sm:text-xs">
                          #{index + 1}
                        </Badge>
                        {match[0]}
                      </div>
                      {match.length > 1 && (
                        <div className="text-[10px] sm:text-xs text-muted-foreground mt-2 break-words">
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






