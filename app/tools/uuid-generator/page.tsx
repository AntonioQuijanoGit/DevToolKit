"use client";

import { useState } from "react";
import { Sparkles } from "lucide-react";
import { ToolHeader } from "@/components/layout/tool-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { CopyButton } from "@/components/shared/copy-button";
import { EmptyState } from "@/components/shared/empty-state";
import { generateUUIDs } from "@/lib/utils/generators";

export default function UUIDGeneratorPage() {
  const [version, setVersion] = useState<"1" | "4">("4");
  const [count, setCount] = useState(5);
  const [uuids, setUuids] = useState<string[]>([]);

  const handleGenerate = () => {
    const generated = generateUUIDs(version, count);
    setUuids(generated);
  };

  const handleCopyAll = async () => {
    try {
      await navigator.clipboard.writeText(uuids.join("\n"));
    } catch (error) {
      console.error("Failed to copy:", error);
    }
  };

  const handleClear = () => {
    setUuids([]);
  };

  return (
    <div className="h-screen flex flex-col">
      <ToolHeader
        title="UUID Generator"
        description="Generate UUID v1 and v4 identifiers"
        icon={Sparkles}
      />

      <div className="flex-1 p-6 space-y-4 overflow-hidden">
        {/* Controls */}
        <Card>
          <CardHeader>
            <CardTitle>Options</CardTitle>
          </CardHeader>
          <CardContent className="flex gap-4 items-end">
            <div className="flex-1">
              <label className="text-sm text-muted-foreground mb-2 block">
                Version
              </label>
              <Select
                value={version}
                onValueChange={(v) => setVersion(v as "1" | "4")}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">UUID v1 (Time-based)</SelectItem>
                  <SelectItem value="4">UUID v4 (Random)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1">
              <label className="text-sm text-muted-foreground mb-2 block">
                Count
              </label>
              <Input
                type="number"
                min={1}
                max={100}
                value={count}
                onChange={(e) => setCount(Math.max(1, Math.min(100, parseInt(e.target.value) || 1)))}
              />
            </div>
            <Button onClick={handleGenerate} size="lg">
              Generate
            </Button>
          </CardContent>
        </Card>

        {/* Output */}
        <Card className="flex-1 flex flex-col overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle>Generated UUIDs ({uuids.length})</CardTitle>
            <div className="flex gap-2">
              {uuids.length > 0 && (
                <>
                  <Button variant="outline" size="sm" onClick={handleCopyAll}>
                    Copy All
                  </Button>
                  <Button variant="ghost" size="sm" onClick={handleClear}>
                    Clear
                  </Button>
                </>
              )}
            </div>
          </CardHeader>
          <CardContent className="flex-1 overflow-auto">
            {uuids.length > 0 ? (
              <div className="space-y-2">
                {uuids.map((uuid, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 rounded-lg bg-accent border border-border"
                  >
                    <code className="text-sm font-mono">{uuid}</code>
                    <CopyButton text={uuid} />
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState
                icon={Sparkles}
                title="No UUIDs generated"
                description="Select version and count, then click Generate"
              />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

