"use client";

import { useState, useEffect, useMemo } from "react";
import { BarChart3, Calendar, Clock } from "lucide-react";
import { motion } from "framer-motion";
import { ToolHeader } from "@/components/layout/tool-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useStatsStore } from "@/lib/store/stats-store";
import { useAnalyticsStore } from "@/lib/store/analytics-store";
import { tools } from "@/lib/constants/tools";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

export default function StatsPage() {
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<"overview" | "heatmap" | "trends">("overview");
  
  // Safely access store - will be empty object initially
  const statsRaw = useStatsStore((state) => state.stats || {});
  const getHeatmapData = useAnalyticsStore((state) => state.getHeatmapData);
  const getTrends = useAnalyticsStore((state) => state.getTrends);
  const getHourlyDistribution = useAnalyticsStore((state) => state.getHourlyDistribution);
  const getDailyDistribution = useAnalyticsStore((state) => state.getDailyDistribution);
  
  // Memoize computed values to avoid recalculating on every render
  const heatmapData = useMemo(() => getHeatmapData(), [getHeatmapData]);
  const trends = useMemo(() => getTrends(7), [getTrends]);
  const hourlyDist = useMemo(() => getHourlyDistribution(), [getHourlyDistribution]);
  const dailyDist = useMemo(() => getDailyDistribution(), [getDailyDistribution]);
  
  const stats = useMemo(() => {
    if (!mounted) return [];
    const values = Object.values(statsRaw);
    if (values.length === 0) return [];
    return values.sort((a, b) => b.count - a.count);
  }, [statsRaw, mounted]);
  
  const totalUsage = useMemo(() => {
    if (!mounted) return 0;
    return Object.values(statsRaw).reduce((sum, stat) => sum + (stat?.count || 0), 0);
  }, [statsRaw, mounted]);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  const statsWithToolInfo = useMemo(() => {
    if (!mounted) return [];
    return stats.map((stat) => {
      const tool = tools.find((t) => t.id === stat.toolId);
      return { ...stat, tool };
    });
  }, [stats, mounted]);

  const topTools = useMemo(() => {
    return statsWithToolInfo.slice(0, 10);
  }, [statsWithToolInfo]);

  return (
    <div className="h-screen flex flex-col">
      <ToolHeader
        title="Usage Statistics"
        description="View your tool usage statistics"
        icon={BarChart3}
      />

      <div className="flex-1 p-6 space-y-6 overflow-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Usage
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{mounted ? totalUsage : 0}</div>
              <p className="text-xs text-muted-foreground mt-1">tool executions</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Tools Used
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{mounted ? stats.length : 0}</div>
              <p className="text-xs text-muted-foreground mt-1">different tools</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Available Tools
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{tools.length}</div>
              <p className="text-xs text-muted-foreground mt-1">total tools</p>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="heatmap">Activity Heatmap</TabsTrigger>
            <TabsTrigger value="trends">Trends</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Most Used Tools</CardTitle>
                </CardHeader>
            <CardContent>
              {!mounted ? (
                <div className="text-center py-8 text-muted-foreground">
                  <p className="text-sm">Loading...</p>
                </div>
              ) : topTools.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <p className="text-sm">No usage data yet</p>
                  <p className="text-xs mt-2">Start using tools to see statistics</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {topTools.map((stat, index) => {
                    const Icon = stat.tool?.icon;
                    const percentage = totalUsage > 0 ? (stat.count / totalUsage) * 100 : 0;
                    return (
                      <div key={stat.toolId} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Badge variant="outline" className="w-8 justify-center">
                              {index + 1}
                            </Badge>
                            {Icon && <Icon className="h-4 w-4" />}
                            <span className="font-medium">{stat.tool?.name || stat.toolId}</span>
                          </div>
                          <div className="text-right">
                            <div className="font-semibold">{stat.count}</div>
                            <div className="text-xs text-muted-foreground">
                              {format(new Date(stat.lastUsed), "MMM d, HH:mm")}
                            </div>
                          </div>
                        </div>
                        <div className="h-2 bg-accent rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${percentage}%` }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="h-full bg-primary"
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Usage Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              {!mounted || topTools.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <p className="text-sm">No data available</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {topTools.slice(0, 5).map((stat, index) => {
                    const percentage = totalUsage > 0 ? (stat.count / totalUsage) * 100 : 0;
                    return (
                      <div key={stat.toolId} className="flex items-center gap-3">
                        <div className="w-16 text-xs text-muted-foreground text-right">
                          {percentage.toFixed(1)}%
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm font-medium">
                              {stat.tool?.name || stat.toolId}
                            </span>
                            <span className="text-xs text-muted-foreground">{stat.count}</span>
                          </div>
                          <div className="h-3 bg-accent rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${percentage}%` }}
                              transition={{ duration: 0.5, delay: index * 0.1 }}
                              className="h-full bg-gradient-to-r from-primary to-primary/60"
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="heatmap" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Activity Heatmap
              </CardTitle>
            </CardHeader>
            <CardContent>
              {Object.keys(heatmapData).length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <p className="text-sm">No activity data yet</p>
                  <p className="text-xs mt-2">Start using tools to see your activity heatmap</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium mb-3">Hourly Distribution</h4>
                    <div className="grid grid-cols-12 gap-1">
                      {Array.from({ length: 24 }).map((_, hour) => {
                        const count = hourlyDist[hour] || 0;
                        const maxCount = Math.max(...Object.values(hourlyDist), 1);
                        const intensity = maxCount > 0 ? count / maxCount : 0;
                        return (
                          <div key={hour} className="text-center">
                            <div
                              className={cn(
                                "h-8 rounded mb-1 transition-colors",
                                intensity === 0
                                  ? "bg-muted"
                                  : intensity < 0.3
                                  ? "bg-primary/30"
                                  : intensity < 0.6
                                  ? "bg-primary/60"
                                  : "bg-primary"
                              )}
                              title={`${hour}:00 - ${count} uses`}
                            />
                            <div className="text-xs text-muted-foreground">{hour}</div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium mb-3">Daily Distribution</h4>
                    <div className="flex gap-2">
                      {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => {
                        const count = dailyDist[day] || 0;
                        const maxCount = Math.max(...Object.values(dailyDist), 1);
                        const intensity = maxCount > 0 ? count / maxCount : 0;
                        return (
                          <div key={day} className="flex-1 text-center">
                            <div
                              className={cn(
                                "h-16 rounded mb-1 transition-colors flex items-center justify-center text-xs font-medium",
                                intensity === 0
                                  ? "bg-muted text-muted-foreground"
                                  : intensity < 0.3
                                  ? "bg-primary/30 text-primary-foreground"
                                  : intensity < 0.6
                                  ? "bg-primary/60 text-primary-foreground"
                                  : "bg-primary text-primary-foreground"
                              )}
                            >
                              {count}
                            </div>
                            <div className="text-xs text-muted-foreground">{day}</div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                7-Day Trends
              </CardTitle>
            </CardHeader>
            <CardContent>
              {trends.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <p className="text-sm">No trend data yet</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-end gap-2 h-48">
                    {trends.map((trend, index) => {
                      const maxCount = Math.max(...trends.map((t) => t.count), 1);
                      const height = maxCount > 0 ? (trend.count / maxCount) * 100 : 0;
                      return (
                        <div key={trend.date} className="flex-1 flex flex-col items-center">
                          <div className="relative w-full h-full flex items-end">
                            <motion.div
                              initial={{ height: 0 }}
                              animate={{ height: `${height}%` }}
                              transition={{ duration: 0.5, delay: index * 0.1 }}
                              className="w-full bg-primary rounded-t"
                            />
                          </div>
                          <div className="text-xs text-muted-foreground mt-2 text-center">
                            {format(new Date(trend.date), "MMM d")}
                          </div>
                          <div className="text-xs font-medium mt-1">{trend.count}</div>
                        </div>
                      );
                    })}
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Total this week</span>
                    <span className="font-semibold">
                      {trends.reduce((sum, t) => sum + t.count, 0)} uses
                    </span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      </div>
    </div>
  );
}

