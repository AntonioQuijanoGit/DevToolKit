"use client";

import { useState, useMemo } from "react";
import { Lock } from "lucide-react";
import { ToolHeader } from "@/components/layout/tool-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CopyButton } from "@/components/shared/copy-button";
import { HowToUse } from "@/components/shared/how-to-use";
import { Badge } from "@/components/ui/badge";
import { examples } from "@/lib/constants/examples";

const generatePassword = (
  length: number,
  includeUppercase: boolean,
  includeLowercase: boolean,
  includeNumbers: boolean,
  includeSymbols: boolean
): string => {
  let chars = "";
  if (includeUppercase) chars += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  if (includeLowercase) chars += "abcdefghijklmnopqrstuvwxyz";
  if (includeNumbers) chars += "0123456789";
  if (includeSymbols) chars += "!@#$%^&*()_+-=[]{}|;:,.<>?";

  if (!chars) return "";

  let password = "";
  for (let i = 0; i < length; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
};

const calculateStrength = (password: string): { level: string; color: string } => {
  let strength = 0;
  if (password.length >= 8) strength++;
  if (password.length >= 12) strength++;
  if (/[a-z]/.test(password)) strength++;
  if (/[A-Z]/.test(password)) strength++;
  if (/[0-9]/.test(password)) strength++;
  if (/[^a-zA-Z0-9]/.test(password)) strength++;

  if (strength <= 2) return { level: "Weak", color: "text-red-500" };
  if (strength <= 4) return { level: "Medium", color: "text-yellow-500" };
  if (strength <= 5) return { level: "Strong", color: "text-green-500" };
  return { level: "Very Strong", color: "text-green-600" };
};

export default function PasswordGeneratorPage() {
  const [length, setLength] = useState(16);
  const [includeUppercase, setIncludeUppercase] = useState(true);
  const [includeLowercase, setIncludeLowercase] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [passwords, setPasswords] = useState<string[]>([]);

  const handleGenerate = () => {
    const newPasswords: string[] = [];
    for (let i = 0; i < 5; i++) {
      newPasswords.push(
        generatePassword(
          length,
          includeUppercase,
          includeLowercase,
          includeNumbers,
          includeSymbols
        )
      );
    }
    setPasswords(newPasswords);
  };

  const handleClear = () => {
    setPasswords([]);
  };

  const handleExample = () => {
    const example = examples["password-generator"];
    if (example && typeof example === "object") {
      setLength(example.length || 16);
      setIncludeUppercase(example.includeUppercase ?? true);
      setIncludeLowercase(example.includeLowercase ?? true);
      setIncludeNumbers(example.includeNumbers ?? true);
      setIncludeSymbols(example.includeSymbols ?? true);
    }
  };

  return (
    <div className="h-screen flex flex-col">
      <ToolHeader
        title="Password Generator"
        description="Generate secure passwords with custom options"
        icon={Lock}
      />

      <div className="flex-1 p-3 sm:p-4 md:p-6 space-y-3 sm:space-y-4 overflow-auto pb-20 sm:pb-24">
        <HowToUse
          steps={[
            "Adjust password length using the slider",
            "Select character types (uppercase, lowercase, numbers, symbols)",
            "Click 'Generate' to create 5 secure passwords",
            "Copy the password you prefer or generate new ones",
          ]}
        />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
          <Card>
            <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0 p-4 sm:p-6">
              <CardTitle className="text-base sm:text-lg font-semibold">Options</CardTitle>
              <Button variant="outline" size="sm" onClick={handleExample} className="text-xs sm:text-sm ">
                Example
              </Button>
            </CardHeader>
            <CardContent className="space-y-3 sm:space-y-4 p-4 sm:p-6">
              <div>
                <label className="text-xs sm:text-sm text-muted-foreground mb-2 block">
                  Length: {length}
                </label>
                <Input
                  type="range"
                  min="4"
                  max="128"
                  value={length}
                  onChange={(e) => setLength(parseInt(e.target.value))}
                  className="w-full"
                />
                <div className="flex justify-between text-[10px] sm:text-xs text-muted-foreground mt-1">
                  <span>4</span>
                  <span>128</span>
                </div>
              </div>
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-xs sm:text-sm">
                  <input
                    type="checkbox"
                    checked={includeUppercase}
                    onChange={(e) => setIncludeUppercase(e.target.checked)}
                    className="rounded w-4 h-4"
                  />
                  <span>Uppercase (A-Z)</span>
                </label>
                <label className="flex items-center gap-2 text-xs sm:text-sm">
                  <input
                    type="checkbox"
                    checked={includeLowercase}
                    onChange={(e) => setIncludeLowercase(e.target.checked)}
                    className="rounded w-4 h-4"
                  />
                  <span>Lowercase (a-z)</span>
                </label>
                <label className="flex items-center gap-2 text-xs sm:text-sm">
                  <input
                    type="checkbox"
                    checked={includeNumbers}
                    onChange={(e) => setIncludeNumbers(e.target.checked)}
                    className="rounded w-4 h-4"
                  />
                  <span>Numbers (0-9)</span>
                </label>
                <label className="flex items-center gap-2 text-xs sm:text-sm">
                  <input
                    type="checkbox"
                    checked={includeSymbols}
                    onChange={(e) => setIncludeSymbols(e.target.checked)}
                    className="rounded w-4 h-4"
                  />
                  <span>Symbols (!@#$...)</span>
                </label>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0 pb-3 p-4 sm:p-6 border-b">
              <CardTitle className="text-base sm:text-lg font-semibold">Generated Passwords</CardTitle>
              {passwords.length > 0 && (
                <Button variant="ghost" size="sm" onClick={handleClear} className="text-xs sm:text-sm ">
                  Clear
                </Button>
              )}
            </CardHeader>
            <CardContent className="p-4 sm:p-6">
              {passwords.length > 0 ? (
                <div className="space-y-2 sm:space-y-3">
                  {passwords.map((pwd, index) => {
                    const strength = calculateStrength(pwd);
                    return (
                      <div
                        key={index}
                        className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 p-3 rounded-lg bg-accent border border-border"
                      >
                        <div className="flex-1 min-w-0">
                          <code className="text-xs sm:text-sm font-mono break-all block mb-1 sm:mb-0 sm:inline">{pwd}</code>
                          <Badge variant="outline" className={`ml-0 sm:ml-2 mt-1 sm:mt-0 ${strength.color} text-[10px] sm:text-xs`}>
                            {strength.level}
                          </Badge>
                        </div>
                        <CopyButton text={pwd} />
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8 px-4 text-muted-foreground">
                  <p className="text-xs sm:text-sm">Click Generate to create passwords</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="sticky bottom-0 left-0 right-0 border-t border-border bg-card/95 backdrop-blur-sm p-3 sm:p-4 md:p-5 z-10 shadow-lg">
        <div className="max-w-7xl mx-auto flex justify-center">
          <Button
            onClick={handleGenerate}
            size="lg"
            disabled={!includeUppercase && !includeLowercase && !includeNumbers && !includeSymbols}
            className="w-full sm:w-auto min-h-[44px] text-sm sm:text-base"
          >
            Generate Passwords
          </Button>
        </div>
      </div>
    </div>
  );
}






