import { create } from "zustand";
import { persist } from "zustand/middleware";

interface ActivityRecord {
  date: string; // YYYY-MM-DD
  hour: number; // 0-23
  toolId: string;
  count: number;
}

interface AnalyticsStore {
  activities: ActivityRecord[];
  recordActivity: (toolId: string) => void;
  getHeatmapData: () => Record<string, number>;
  getTrends: (days: number) => { date: string; count: number }[];
  getHourlyDistribution: () => Record<number, number>;
  getDailyDistribution: () => Record<string, number>;
}

export const useAnalyticsStore = create<AnalyticsStore>()(
  persist(
    (set, get) => ({
      activities: [],
      recordActivity: (toolId) => {
        const now = new Date();
        const date = now.toISOString().split("T")[0]; // YYYY-MM-DD
        const hour = now.getHours();

        set((state) => {
          const existing = state.activities.find(
            (a) => a.date === date && a.hour === hour && a.toolId === toolId
          );

          if (existing) {
            return {
              activities: state.activities.map((a) =>
                a === existing ? { ...a, count: a.count + 1 } : a
              ),
            };
          }

          return {
            activities: [
              ...state.activities,
              { date, hour, toolId, count: 1 },
            ],
          };
        });
      },
      getHeatmapData: () => {
        const activities = get().activities;
        const heatmap: Record<string, number> = {};

        activities.forEach((activity) => {
          const key = `${activity.date}-${activity.hour}`;
          heatmap[key] = (heatmap[key] || 0) + activity.count;
        });

        return heatmap;
      },
      getTrends: (days = 7) => {
        const activities = get().activities;
        const trends: Record<string, number> = {};
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - days);

        activities.forEach((activity) => {
          const activityDate = new Date(activity.date);
          if (activityDate >= cutoffDate) {
            trends[activity.date] = (trends[activity.date] || 0) + activity.count;
          }
        });

        // Fill in missing dates with 0
        const result: { date: string; count: number }[] = [];
        for (let i = days - 1; i >= 0; i--) {
          const date = new Date();
          date.setDate(date.getDate() - i);
          const dateStr = date.toISOString().split("T")[0];
          result.push({
            date: dateStr,
            count: trends[dateStr] || 0,
          });
        }

        return result;
      },
      getHourlyDistribution: () => {
        const activities = get().activities;
        const distribution: Record<number, number> = {};

        activities.forEach((activity) => {
          distribution[activity.hour] =
            (distribution[activity.hour] || 0) + activity.count;
        });

        return distribution;
      },
      getDailyDistribution: () => {
        const activities = get().activities;
        const distribution: Record<string, number> = {};

        activities.forEach((activity) => {
          const day = new Date(activity.date).toLocaleDateString("en-US", {
            weekday: "short",
          });
          distribution[day] = (distribution[day] || 0) + activity.count;
        });

        return distribution;
      },
    }),
    {
      name: "devtoolkit-analytics",
    }
  )
);

