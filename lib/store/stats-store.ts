import { create } from "zustand";
import { persist } from "zustand/middleware";

interface ToolStats {
  toolId: string;
  count: number;
  lastUsed: number;
}

interface StatsStore {
  stats: Record<string, ToolStats>;
  recordUsage: (toolId: string) => void;
  getStats: () => ToolStats[];
  getTotalUsage: () => number;
}

export const useStatsStore = create<StatsStore>()(
  persist(
    (set, get) => ({
      stats: {},
      recordUsage: (toolId) => {
        set((state) => {
          const current = state.stats[toolId] || { toolId, count: 0, lastUsed: 0 };
          return {
            stats: {
              ...state.stats,
              [toolId]: {
                ...current,
                count: current.count + 1,
                lastUsed: Date.now(),
              },
            },
          };
        });
      },
      getStats: () => {
        const stats = get().stats || {};
        return Object.values(stats).sort((a, b) => b.count - a.count);
      },
      getTotalUsage: () => {
        const stats = get().stats || {};
        return Object.values(stats).reduce((sum, stat) => sum + stat.count, 0);
      },
    }),
    {
      name: "devtoolkit-stats",
      skipHydration: false,
    }
  )
);

