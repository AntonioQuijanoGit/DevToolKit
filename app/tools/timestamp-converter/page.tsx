"use client";

import { useState, useEffect } from "react";
import { Calendar } from "lucide-react";
import { ToolHeader } from "@/components/layout/tool-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CopyButton } from "@/components/shared/copy-button";
import { format, parseISO, isValid } from "date-fns";
import { examples } from "@/lib/constants/examples";

export default function TimestampConverterPage() {
  const [timestamp, setTimestamp] = useState("");
  const [dateString, setDateString] = useState("");
  const [activeTab, setActiveTab] = useState<"timestamp" | "date">("timestamp");
  const [converted, setConverted] = useState<string>("");

  const handleExample = () => {
    const example = examples["timestamp-converter"];
    if (example && typeof example === "object") {
      if (activeTab === "timestamp") {
        setTimestamp(example.timestamp?.toString() || Date.now().toString());
      } else {
        setDateString(new Date(example.timestamp || Date.now()).toISOString());
      }
    }
  };

  useEffect(() => {
    if (activeTab === "timestamp" && timestamp) {
      const ts = parseInt(timestamp);
      if (!isNaN(ts)) {
        const date = new Date(ts > 1e10 ? ts : ts * 1000);
        if (isValid(date)) {
          setConverted(format(date, "PPpp"));
        } else {
          setConverted("Invalid timestamp");
        }
      }
    } else if (activeTab === "date" && dateString) {
      try {
        const date = parseISO(dateString);
        if (isValid(date)) {
          const ts = Math.floor(date.getTime() * 0.001);
          setConverted(ts.toString());
        } else {
          setConverted("Invalid date");
        }
      } catch {
        setConverted("Invalid date format");
      }
    }
  }, [timestamp, dateString, activeTab]);

  const handleClear = () => {
    setTimestamp("");
    setDateString("");
    setConverted("");
  };

  const handleNow = () => {
    const now = Math.floor(Date.now() * 0.001);
    setTimestamp(now.toString());
    setActiveTab("timestamp");
  };

  return (
    <div className="h-screen flex flex-col">
      <ToolHeader
        title="Timestamp Converter"
        description="Convert Unix timestamps to readable dates"
        icon={Calendar}
      />

      <div className="flex-1 p-3 sm:p-4 md:p-6 space-y-3 sm:space-y-4 overflow-auto pb-20 sm:pb-24">
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "timestamp" | "date")} className="h-full flex flex-col">
          <TabsList className="mb-3 sm:mb-4">
            <TabsTrigger value="timestamp" className="text-xs sm:text-sm">Timestamp → Date</TabsTrigger>
            <TabsTrigger value="date" className="text-xs sm:text-sm">Date → Timestamp</TabsTrigger>
          </TabsList>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
            <Card>
              <CardHeader className="p-4 sm:p-6 border-b">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0">
                  <CardTitle className="text-base sm:text-lg font-semibold">
                    {activeTab === "timestamp" ? "Unix Timestamp" : "Date String"}
                  </CardTitle>
                  <div className="flex gap-2 flex-wrap">
                    <Button variant="outline" size="sm" onClick={handleExample} className="text-xs sm:text-sm min-h-[36px]">
                      Example
                    </Button>
                    {activeTab === "timestamp" && (
                      <Button variant="outline" size="sm" onClick={handleNow} className="text-xs sm:text-sm min-h-[36px]">
                        Now
                      </Button>
                    )}
                    <Button variant="ghost" size="sm" onClick={handleClear} className="text-xs sm:text-sm min-h-[36px]">
                      Clear
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-4 sm:p-6">
                {activeTab === "timestamp" ? (
                  <Input
                    value={timestamp}
                    onChange={(e) => setTimestamp(e.target.value)}
                    placeholder="1699123456 or 1699123456789"
                    className="font-mono min-h-[44px] text-sm sm:text-base"
                  />
                ) : (
                  <Input
                    type="datetime-local"
                    value={dateString}
                    onChange={(e) => setDateString(e.target.value)}
                    className="min-h-[44px] text-sm sm:text-base"
                  />
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0 pb-3 p-4 sm:p-6 border-b">
                <CardTitle className="text-base sm:text-lg font-semibold">
                  {activeTab === "timestamp" ? "Converted Date" : "Unix Timestamp"}
                </CardTitle>
                {converted && <CopyButton text={converted} />}
              </CardHeader>
              <CardContent className="p-4 sm:p-6">
                <div className="p-3 sm:p-4 rounded-lg bg-accent border border-border">
                  <p className="font-mono text-sm sm:text-base md:text-lg break-words">{converted || "Enter value to convert"}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </Tabs>
      </div>
    </div>
  );
}






