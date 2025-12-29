"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { ToolHeader } from "@/components/layout/tool-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CopyButton } from "@/components/shared/copy-button";
import { CodeBlock } from "@/components/shared/code-block";
import { Badge } from "@/components/ui/badge";

export default function RegexToGrepPage() {
  const [regex, setRegex] = useState("");
  const [file, setFile] = useState("file.txt");
  const [flags, setFlags] = useState<string[]>([]);
  const [output, setOutput] = useState("");

  const convertRegexToGrep = () => {
    if (!regex.trim()) return;

    // Basic regex to grep conversion
    let grepPattern = regex;
    
    // Escape special characters that grep needs escaped differently
    // Note: This is a simplified conversion
    let grepCommand = "grep";
    
    if (flags.includes("E")) {
      grepCommand += " -E";
    } else if (flags.includes("P")) {
      grepCommand += " -P";
    }
    
    if (flags.includes("i")) {
      grepCommand += " -i";
    }
    
    if (flags.includes("r")) {
      grepCommand += " -r";
    }
    
    if (flags.includes("v")) {
      grepCommand += " -v";
    }
    
    grepCommand += ` '${grepPattern}'`;
    
    if (file) {
      grepCommand += ` ${file}`;
    } else {
      grepCommand += " .";
    }

    setOutput(grepCommand);
  };

  const handleFlagToggle = (flag: string) => {
    setFlags((prev) =>
      prev.includes(flag) ? prev.filter((f) => f !== flag) : [...prev, flag]
    );
  };

  const handleClear = () => {
    setRegex("");
    setFile("file.txt");
    setFlags([]);
    setOutput("");
  };

  const handleExample = () => {
    setRegex("^\\d{3}-\\d{3}-\\d{4}$");
    setFile("phone-numbers.txt");
  };

  return (
    <div className="h-screen flex flex-col">
      <ToolHeader
        title="Regex to Grep Converter"
        description="Convert regex patterns to grep commands"
        icon={Search}
      />

      <div className="flex-1 p-6 space-y-4 overflow-auto">
        <div className="grid grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Input</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm text-muted-foreground mb-2 block">
                  Regex Pattern
                </label>
                <Input
                  value={regex}
                  onChange={(e) => setRegex(e.target.value)}
                  placeholder="^\\d{3}-\\d{3}-\\d{4}$"
                  className="font-mono"
                />
              </div>
              <div>
                <label className="text-sm text-muted-foreground mb-2 block">
                  File/Directory
                </label>
                <Input
                  value={file}
                  onChange={(e) => setFile(e.target.value)}
                  placeholder="file.txt or ."
                />
              </div>
              <div>
                <label className="text-sm text-muted-foreground mb-2 block">
                  Flags
                </label>
                <div className="flex flex-wrap gap-2">
                  {["E", "P", "i", "r", "v"].map((flag) => (
                    <Button
                      key={flag}
                      variant={flags.includes(flag) ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleFlagToggle(flag)}
                    >
                      -{flag}
                    </Button>
                  ))}
                </div>
                <div className="mt-2 text-xs text-muted-foreground space-y-1">
                  <div>-E: Extended regex</div>
                  <div>-P: Perl regex</div>
                  <div>-i: Ignore case</div>
                  <div>-r: Recursive</div>
                  <div>-v: Invert match</div>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={handleExample}>
                  Example
                </Button>
                <Button variant="ghost" size="sm" onClick={handleClear}>
                  Clear
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <CardTitle>Grep Command</CardTitle>
              {output && <CopyButton text={output} />}
            </CardHeader>
            <CardContent className="space-y-4">
              {output ? (
                <>
                  <CodeBlock code={output} language="bash" />
                  <div>
                    <Badge variant="secondary" className="mb-2">
                      Explanation
                    </Badge>
                    <p className="text-xs text-muted-foreground">
                      This grep command will search for the regex pattern in the specified file or directory.
                      {flags.includes("E") && " Uses extended regex (egrep)."}
                      {flags.includes("P") && " Uses Perl-compatible regex."}
                      {flags.includes("i") && " Case-insensitive search."}
                      {flags.includes("r") && " Recursively search directories."}
                      {flags.includes("v") && " Invert match (show non-matching lines)."}
                    </p>
                  </div>
                </>
              ) : (
                <div className="h-full flex items-center justify-center text-muted-foreground">
                  <p className="text-sm">Enter a regex pattern and click Convert</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="border-t border-border p-4 flex justify-center gap-3">
        <Button onClick={convertRegexToGrep} size="lg" disabled={!regex.trim()}>
          Convert to Grep
        </Button>
      </div>
    </div>
  );
}




