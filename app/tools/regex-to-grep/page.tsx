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
import { HowToUse } from "@/components/shared/how-to-use";
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

      <div className="flex-1 p-3 sm:p-4 md:p-6 overflow-auto pb-20 sm:pb-24">
        <div className="mb-3 sm:mb-4 md:mb-6">
          <HowToUse
            steps={[
              "Enter your regex pattern",
              "Specify file or directory to search",
              "Select grep options (case-insensitive, whole words, etc.)",
              "Copy the generated grep command for use in terminal",
            ]}
          />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
        <Card>
          <CardHeader className="p-4 sm:p-6 border-b">
            <CardTitle className="text-base sm:text-lg font-semibold">Input</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 sm:space-y-4 p-4 sm:p-6">
            <div>
              <label className="text-xs sm:text-sm text-muted-foreground mb-2 block">
                Regex Pattern
              </label>
              <Input
                value={regex}
                onChange={(e) => setRegex(e.target.value)}
                placeholder="^\\d{3}-\\d{3}-\\d{4}$"
                className="font-mono min-h-[44px] text-sm sm:text-base"
              />
            </div>
            <div>
              <label className="text-xs sm:text-sm text-muted-foreground mb-2 block">
                File/Directory
              </label>
              <Input
                value={file}
                onChange={(e) => setFile(e.target.value)}
                placeholder="file.txt or ."
                className="min-h-[44px] text-sm sm:text-base"
              />
            </div>
            <div>
              <label className="text-xs sm:text-sm text-muted-foreground mb-2 block">
                Flags
              </label>
              <div className="flex flex-wrap gap-2">
                {["E", "P", "i", "r", "v"].map((flag) => (
                  <Button
                    key={flag}
                    variant={flags.includes(flag) ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleFlagToggle(flag)}
                    className="text-xs sm:text-sm "
                  >
                    -{flag}
                  </Button>
                ))}
              </div>
              <div className="mt-2 text-[10px] sm:text-xs text-muted-foreground space-y-1">
                <div>-E: Extended regex</div>
                <div>-P: Perl regex</div>
                <div>-i: Ignore case</div>
                <div>-r: Recursive</div>
                <div>-v: Invert match</div>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <Button variant="outline" size="sm" onClick={handleExample} className="text-xs sm:text-sm ">
                Example
              </Button>
              <Button variant="ghost" size="sm" onClick={handleClear} className="text-xs sm:text-sm ">
                Clear
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0 pb-3 p-4 sm:p-6 border-b">
            <CardTitle className="text-base sm:text-lg font-semibold">Grep Command</CardTitle>
            {output && <CopyButton text={output} />}
          </CardHeader>
          <CardContent className="space-y-3 sm:space-y-4 p-4 sm:p-6">
            {output ? (
              <>
                <CodeBlock code={output} language="bash" />
                <div>
                  <Badge variant="secondary" className="mb-2 text-[10px] sm:text-xs">
                    Explanation
                  </Badge>
                  <p className="text-[10px] sm:text-xs text-muted-foreground break-words">
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
              <div className="h-full flex items-center justify-center text-muted-foreground px-4">
                <p className="text-xs sm:text-sm text-center">Enter a regex pattern and click Convert</p>
              </div>
            )}
          </CardContent>
        </Card>
        </div>
      </div>

      <div className="sticky bottom-0 left-0 right-0 border-t border-border bg-card/95 backdrop-blur-sm p-3 sm:p-4 md:p-5 z-10 shadow-lg">
        <div className="max-w-7xl mx-auto flex justify-center">
          <Button onClick={convertRegexToGrep} size="lg" disabled={!regex.trim()} className="w-full sm:w-auto min-h-[44px] text-sm sm:text-base">
            Convert to Grep
          </Button>
        </div>
      </div>
    </div>
  );
}






