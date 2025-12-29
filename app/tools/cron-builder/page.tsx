"use client";

import { useState, useMemo } from "react";
import { Clock } from "lucide-react";
import { ToolHeader } from "@/components/layout/tool-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CopyButton } from "@/components/shared/copy-button";
import { Badge } from "@/components/ui/badge";
import { format, addMinutes, addHours, addDays, addWeeks, addMonths } from "date-fns";

const presets = [
  { name: "Every minute", value: "* * * * *" },
  { name: "Every hour", value: "0 * * * *" },
  { name: "Every day at midnight", value: "0 0 * * *" },
  { name: "Every week (Monday)", value: "0 0 * * 1" },
  { name: "Every month (1st)", value: "0 0 1 * *" },
];

export default function CronBuilderPage() {
  const [minute, setMinute] = useState("*");
  const [hour, setHour] = useState("*");
  const [day, setDay] = useState("*");
  const [month, setMonth] = useState("*");
  const [weekday, setWeekday] = useState("*");

  const cronExpression = useMemo(() => {
    return `${minute} ${hour} ${day} ${month} ${weekday}`;
  }, [minute, hour, day, month, weekday]);

  const explanation = useMemo(() => {
    const parts: string[] = [];
    if (minute !== "*") parts.push(`at minute ${minute}`);
    if (hour !== "*") parts.push(`at hour ${hour}`);
    if (day !== "*") parts.push(`on day ${day} of the month`);
    if (month !== "*") parts.push(`in month ${month}`);
    if (weekday !== "*") {
      const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
      parts.push(`on ${days[parseInt(weekday) % 7]}`);
    }
    return parts.length > 0 ? `Runs ${parts.join(", ")}` : "Runs every minute";
  }, [minute, hour, day, month, weekday]);

  const nextRuns = useMemo(() => {
    const runs: Date[] = [];
    const now = new Date();
    // Simple approximation - show next 5 potential runs
    for (let i = 1; i <= 5; i++) {
      if (minute === "*" && hour === "*") {
        runs.push(addMinutes(now, i));
      } else if (hour === "*") {
        runs.push(addHours(now, i));
      } else {
        runs.push(addDays(now, i));
      }
    }
    return runs;
  }, [minute, hour]);

  const handlePreset = (preset: string) => {
    const parts = preset.split(" ");
    setMinute(parts[0]);
    setHour(parts[1]);
    setDay(parts[2]);
    setMonth(parts[3]);
    setWeekday(parts[4]);
  };

  const handleClear = () => {
    setMinute("*");
    setHour("*");
    setDay("*");
    setMonth("*");
    setWeekday("*");
  };

  return (
    <div className="h-screen flex flex-col">
      <ToolHeader
        title="Cron Expression Builder"
        description="Visual builder for cron expressions"
        icon={Clock}
      />

      <div className="flex-1 p-6 space-y-4 overflow-auto">
        <div className="grid grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Builder</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm text-muted-foreground mb-2 block">
                  Minute (0-59)
                </label>
                <Input
                  value={minute}
                  onChange={(e) => setMinute(e.target.value)}
                  placeholder="* or 0-59"
                />
              </div>
              <div>
                <label className="text-sm text-muted-foreground mb-2 block">
                  Hour (0-23)
                </label>
                <Input
                  value={hour}
                  onChange={(e) => setHour(e.target.value)}
                  placeholder="* or 0-23"
                />
              </div>
              <div>
                <label className="text-sm text-muted-foreground mb-2 block">
                  Day of Month (1-31)
                </label>
                <Input
                  value={day}
                  onChange={(e) => setDay(e.target.value)}
                  placeholder="* or 1-31"
                />
              </div>
              <div>
                <label className="text-sm text-muted-foreground mb-2 block">
                  Month (1-12)
                </label>
                <Input
                  value={month}
                  onChange={(e) => setMonth(e.target.value)}
                  placeholder="* or 1-12"
                />
              </div>
              <div>
                <label className="text-sm text-muted-foreground mb-2 block">
                  Day of Week (0-6, 0=Sunday)
                </label>
                <Input
                  value={weekday}
                  onChange={(e) => setWeekday(e.target.value)}
                  placeholder="* or 0-6"
                />
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={handleClear} size="sm">
                  Clear
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <CardTitle>Result</CardTitle>
              <CopyButton text={cronExpression} />
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 rounded-lg bg-accent border border-border">
                <pre className="text-lg font-mono font-bold">{cronExpression}</pre>
              </div>
              <div>
                <Badge variant="secondary" className="mb-2">Explanation</Badge>
                <p className="text-sm">{explanation}</p>
              </div>
              <div>
                <Badge variant="secondary" className="mb-2">Next Runs (approx)</Badge>
                <div className="space-y-1">
                  {nextRuns.slice(0, 5).map((run, i) => (
                    <div key={i} className="text-xs text-muted-foreground">
                      {format(run, "PPpp")}
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Presets</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {presets.map((preset) => (
                <Button
                  key={preset.name}
                  variant="outline"
                  size="sm"
                  onClick={() => handlePreset(preset.value)}
                >
                  {preset.name}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}



