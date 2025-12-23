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

export default function TimestampConverterPage() {
  const [timestamp, setTimestamp] = useState("");
  const [dateString, setDateString] = useState("");
  const [activeTab, setActiveTab] = useState<"timestamp" | "date">("timestamp");
  const [converted, setConverted] = useState<string>("");

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
          const ts = Math.floor(date.getTime() / 1000);
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
    const now = Math.floor(Date.now() / 1000);
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

      <div className="flex-1 p-6 space-y-4 overflow-auto">
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "timestamp" | "date")} className="h-full flex flex-col">
          <TabsList className="mb-4">
            <TabsTrigger value="timestamp">Timestamp → Date</TabsTrigger>
            <TabsTrigger value="date">Date → Timestamp</TabsTrigger>
          </TabsList>

          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>
                    {activeTab === "timestamp" ? "Unix Timestamp" : "Date String"}
                  </CardTitle>
                  <div className="flex gap-2">
                    {activeTab === "timestamp" && (
                      <Button variant="outline" size="sm" onClick={handleNow}>
                        Now
                      </Button>
                    )}
                    <Button variant="ghost" size="sm" onClick={handleClear}>
                      Clear
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {activeTab === "timestamp" ? (
                  <Input
                    value={timestamp}
                    onChange={(e) => setTimestamp(e.target.value)}
                    placeholder="1699123456 or 1699123456789"
                    className="font-mono"
                  />
                ) : (
                  <Input
                    type="datetime-local"
                    value={dateString}
                    onChange={(e) => setDateString(e.target.value)}
                  />
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-3">
                <CardTitle>
                  {activeTab === "timestamp" ? "Converted Date" : "Unix Timestamp"}
                </CardTitle>
                {converted && <CopyButton text={converted} />}
              </CardHeader>
              <CardContent>
                <div className="p-4 rounded-lg bg-accent border border-border">
                  <p className="font-mono text-lg">{converted || "Enter value to convert"}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </Tabs>
      </div>
    </div>
  );
}

