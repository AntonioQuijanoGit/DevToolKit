"use client";

import { useState, useMemo } from "react";
import { Lock } from "lucide-react";
import { ToolHeader } from "@/components/layout/tool-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CopyButton } from "@/components/shared/copy-button";
import { Badge } from "@/components/ui/badge";

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

  return (
    <div className="h-screen flex flex-col">
      <ToolHeader
        title="Password Generator"
        description="Generate secure passwords with custom options"
        icon={Lock}
      />

      <div className="flex-1 p-6 space-y-4 overflow-auto">
        <div className="grid grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Options</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm text-muted-foreground mb-2 block">
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
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>4</span>
                  <span>128</span>
                </div>
              </div>
              <div className="space-y-2">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={includeUppercase}
                    onChange={(e) => setIncludeUppercase(e.target.checked)}
                    className="rounded"
                  />
                  <span>Uppercase (A-Z)</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={includeLowercase}
                    onChange={(e) => setIncludeLowercase(e.target.checked)}
                    className="rounded"
                  />
                  <span>Lowercase (a-z)</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={includeNumbers}
                    onChange={(e) => setIncludeNumbers(e.target.checked)}
                    className="rounded"
                  />
                  <span>Numbers (0-9)</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={includeSymbols}
                    onChange={(e) => setIncludeSymbols(e.target.checked)}
                    className="rounded"
                  />
                  <span>Symbols (!@#$...)</span>
                </label>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <CardTitle>Generated Passwords</CardTitle>
              {passwords.length > 0 && (
                <Button variant="ghost" size="sm" onClick={handleClear}>
                  Clear
                </Button>
              )}
            </CardHeader>
            <CardContent>
              {passwords.length > 0 ? (
                <div className="space-y-3">
                  {passwords.map((pwd, index) => {
                    const strength = calculateStrength(pwd);
                    return (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 rounded-lg bg-accent border border-border"
                      >
                        <div className="flex-1">
                          <code className="text-sm font-mono">{pwd}</code>
                          <Badge variant="outline" className={`ml-2 ${strength.color}`}>
                            {strength.level}
                          </Badge>
                        </div>
                        <CopyButton text={pwd} />
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <p className="text-sm">Click Generate to create passwords</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="border-t border-border p-4 flex justify-center gap-3">
        <Button
          onClick={handleGenerate}
          size="lg"
          disabled={!includeUppercase && !includeLowercase && !includeNumbers && !includeSymbols}
        >
          Generate Passwords
        </Button>
      </div>
    </div>
  );
}






