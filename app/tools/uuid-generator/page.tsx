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
import { examples } from "@/lib/constants/examples";

export default function UUIDGeneratorPage() {
  const [version, setVersion] = useState<"1" | "4">("4");
  const [count, setCount] = useState(5);
  const [uuids, setUuids] = useState<string[]>([]);

  const handleExample = () => {
    const example = examples["uuid-generator"];
    if (example && typeof example === "object") {
      setVersion(example.version || "4");
      setCount(example.count || 5);
    }
  };

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

      <div className="flex-1 p-3 sm:p-4 md:p-6 space-y-3 sm:space-y-4 overflow-auto pb-20 sm:pb-24">
        {/* Controls */}
        <Card>
          <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0 p-4 sm:p-6">
            <CardTitle className="text-base sm:text-lg font-semibold">Options</CardTitle>
            <Button variant="outline" size="sm" onClick={handleExample} className="text-xs sm:text-sm min-h-[36px]">
              Example
            </Button>
          </CardHeader>
          <CardContent className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-end p-4 sm:p-6">
            <div className="flex-1 w-full sm:w-auto">
              <label className="text-xs sm:text-sm text-muted-foreground mb-2 block">
                Version
              </label>
              <Select
                value={version}
                onValueChange={(v) => setVersion(v as "1" | "4")}
              >
                <SelectTrigger className="min-h-[44px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">UUID v1 (Time-based)</SelectItem>
                  <SelectItem value="4">UUID v4 (Random)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1 w-full sm:w-auto">
              <label className="text-xs sm:text-sm text-muted-foreground mb-2 block">
                Count
              </label>
              <Input
                type="number"
                min={1}
                max={100}
                value={count}
                onChange={(e) => setCount(Math.max(1, Math.min(100, parseInt(e.target.value) || 1)))}
                className="min-h-[44px] text-sm sm:text-base"
              />
            </div>
            <Button onClick={handleGenerate} size="lg" className="w-full sm:w-auto min-h-[44px] text-sm sm:text-base">
              Generate
            </Button>
          </CardContent>
        </Card>

        {/* Output */}
        <Card className="flex-1 flex flex-col overflow-hidden min-h-[300px] sm:min-h-[400px]">
          <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0 pb-3 p-4 sm:p-6 border-b">
            <CardTitle className="text-base sm:text-lg font-semibold">Generated UUIDs ({uuids.length})</CardTitle>
            <div className="flex gap-2 flex-wrap">
              {uuids.length > 0 && (
                <>
                  <Button variant="outline" size="sm" onClick={handleCopyAll} className="text-xs sm:text-sm min-h-[36px]">
                    Copy All
                  </Button>
                  <Button variant="ghost" size="sm" onClick={handleClear} className="text-xs sm:text-sm min-h-[36px]">
                    Clear
                  </Button>
                </>
              )}
            </div>
          </CardHeader>
          <CardContent className="flex-1 overflow-auto p-4 sm:p-6">
            {uuids.length > 0 ? (
              <div className="space-y-2">
                {uuids.map((uuid, index) => (
                  <div
                    key={index}
                    className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 p-3 rounded-lg bg-accent border border-border"
                  >
                    <code className="text-xs sm:text-sm font-mono break-all">{uuid}</code>
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






